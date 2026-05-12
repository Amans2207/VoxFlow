import os
try:
    import static_ffmpeg
    static_ffmpeg.add_paths()
    print("FFmpeg linked via static-ffmpeg")
except:
    pass
import subprocess
from fastapi import FastAPI, BackgroundTasks, WebSocket, WebSocketDisconnect, UploadFile, File
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv
import shutil
import uuid
import threading
import json
import time
from functools import wraps

# Core Engines
from editor import VideoEditor
from vision_engine import VisionEngine
from pipeline import DubbingPipeline
from supabase import create_client, Client

from werkzeug.utils import secure_filename

load_dotenv()

def retry_with_backoff(max_retries=3, initial_delay=1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            retries = 0
            delay = initial_delay
            while retries < max_retries:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    retries += 1
                    if retries == max_retries:
                        print(f"Neural Core: API Exhausted after {max_retries} attempts.")
                        raise e
                    print(f"Neural Core: 429/Timeout detected. Retrying in {delay}s...")
                    time.sleep(delay)
                    delay *= 2 # Exponential backoff
            return None
        return wrapper
    return decorator

# Global Task Queue for Background Processing
task_state = {} # { task_id: { "status": "processing", "result": None, "error": None } }

# Startup Check: Ensure critical I/O directories exist
UPLOAD_DIR = os.path.abspath("uploads")
EXPORT_DIR = os.path.abspath("exports")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(EXPORT_DIR, exist_ok=True)

app = FastAPI(title="VoxFlow AI Production Core")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/exports", StaticFiles(directory="exports"), name="exports")
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# WebSocket Orchestration
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()

@app.websocket("/ws/status/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# CORS
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,https://voxflow.in").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Open for deployment, can be restricted via ALLOWED_ORIGINS env
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# Route Separation
from routes.autopilot_routes import autopilot_bp
from routes.studio_routes import studio_bp

app.include_router(autopilot_bp)
app.include_router(studio_bp)

# Global Instances
editor = VideoEditor()
vision_engine = VisionEngine()
pipeline = None

def get_pipeline():
    global pipeline
    if pipeline is None:
        pipeline = DubbingPipeline()
    return pipeline

def start_trend_worker():
    import trend_worker
    worker_thread = threading.Thread(target=trend_worker.simulate_scraping, daemon=True)
    worker_thread.start()

@app.on_event("startup")
async def startup_event():
    start_trend_worker()

# Supabase Initialization
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

class DubRequest(BaseModel):
    video_url: str
    target_lang: str
    voice: str = "Starboy"
    job_id: str
    edit_config: dict = None

class ExportRequest(BaseModel):
    project_id: str
    user_id: str = "anonymous"
    tracks: dict = None
    config: dict = None

class MetadataRequest(BaseModel):
    transcript: str

class PaymentSubmitRequest(BaseModel):
    user_id: str
    utr_number: str
    screenshot_url: str
    amount: int
    credits_requested: int

class PaymentResolveRequest(BaseModel):
    transaction_id: str
    action: str # 'approve' or 'reject'
    credits: int = 0

class UploadResponse(BaseModel):
    url: str
    filename: str
    local_path: str
    project_id: str

@app.get("/health/gpu")
async def gpu_health():
    try:
        nvenc_check = subprocess.run(["ffmpeg", "-encoders"], capture_output=True, text=True)
        has_nvenc = "h264_nvenc" in nvenc_check.stdout
        return {
            "status": "Healthy",
            "gpu": "CPU Mode (Neural Safe)",
            "acceleration": "NVENC Active" if has_nvenc else "Software Only",
            "vRAM": "N/A"
        }
    except Exception as e:
        return {"status": "Unhealthy", "error": str(e)}

@app.post("/api/upload", response_model=UploadResponse)
async def upload_video_direct(file: UploadFile = File(...)):
    print('Bhai, request mil gayi backend par! Route: /api/upload')
    try:
        project_id = f"vxf_{uuid.uuid4().hex[:8]}"
        safe_name = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_DIR, f"{project_id}_{safe_name}")
        
        print(f"Neural Upload Initialized: {safe_name} -> {file_path}")
        
        await file.seek(0)
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
            
        if not os.path.exists(file_path) or os.path.getsize(file_path) == 0:
            raise Exception("I/O Failure: File write was not persistent")

        base_url = "http://127.0.0.1:5000"
        return {
            "status": "success",
            "url": f"{base_url}/uploads/{os.path.basename(file_path)}", 
            "filename": safe_name, 
            "local_path": file_path,
            "project_id": project_id
        }
    except Exception as e:
        print(f"Upload Error: {e}")
        from fastapi.responses import JSONResponse
        return JSONResponse(status_code=500, content={"status": "error", "message": f"Server I/O Error: {str(e)}"})

@app.post("/api/dub")
async def process_dubbing(request: DubRequest, background_tasks: BackgroundTasks):
    print('Bhai, request mil gayi backend par! Route: /api/dub')
    """Alias for /dub to match legacy frontend expectations."""
    return await start_dubbing(request, background_tasks)

@app.post("/editor/metadata")
async def generate_video_metadata(request: MetadataRequest):
    return {
        "instagram": {"title": "Viral Neural Edit ⚡", "desc": "Transformed this raw clip into a high-retention viral masterpiece using VoxFlow AI."},
        "youtube": {"title": "The Future of AI Video Production", "desc": "In this video, we explore how neural engines are automating the creative process."},
        "tiktok": {"title": "Neural Hook Test #1", "desc": "AI just edited this video in 15 seconds. The future is here."}
    }

@app.post("/api/clone")
async def upload_voice_clone(file: UploadFile = File(...), user_id: str = "anonymous"):
    try:
        os.makedirs("user_voices", exist_ok=True)
        file_path = f"user_voices/{user_id}_ref.wav"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return {"status": "success", "message": "Voice Profile Neuralized", "ref_path": file_path}
    except Exception as e:
        return {"status": "error", "message": str(e)}

async def process_dubbing_task(request: DubRequest):
    try:
        await manager.broadcast({"type": "render_status", "job_id": request.job_id, "status": "Processing", "progress": 10, "message": "Neural Pipeline Booting..."})
        video_url = request.video_url
        if video_url.startswith("http://localhost:5000/"):
            local_path = video_url.replace("http://localhost:5000/", "")
            if os.path.exists(local_path): video_url = local_path
        elif video_url.startswith("http://127.0.0.1:5000/"):
            local_path = video_url.replace("http://127.0.0.1:5000/", "")
            if os.path.exists(local_path): video_url = local_path
        
        await manager.broadcast({"type": "render_status", "job_id": request.job_id, "status": "Processing", "progress": 30, "message": "Transcribing Audio (Whisper)..."})
        p = get_pipeline()
        output_video, license_file = p.process(video_url, request.target_lang, request.edit_config)
        
        final_output = f"exports/dub_{request.job_id}.mp4"
        shutil.move(output_video, final_output)
        
        base_url = "http://localhost:5000"
        public_url = f"{base_url}/{final_output}"
        await manager.broadcast({"type": "render_status", "job_id": request.job_id, "status": "Completed", "progress": 100, "url": public_url, "message": "Neural Dubbing Complete"})
    except Exception as e:
        print(f"Dubbing Error: {e}")
        await manager.broadcast({"type": "render_status", "job_id": request.job_id, "status": "Failed", "error": str(e), "message": f"Dubbing Failed: {str(e)}"})

@app.post("/dub")
async def start_dubbing(request: DubRequest, background_tasks: BackgroundTasks):
    print('Bhai, request mil gayi backend par! Route: /dub')
    print(f"Received Dubbing Request for Job: {request.job_id}")
    background_tasks.add_task(process_dubbing_task, request)
    return {"message": "Dubbing Pipeline Initialized", "job_id": request.job_id}

@app.post("/api/dub-elevenlabs")
async def process_elevenlabs_dub(request: DubRequest, background_tasks: BackgroundTasks):
    print('Bhai, request mil gayi backend par! Route: /api/dub-elevenlabs')
    print(f"ElevenLabs Premium Dubbing Initialized for Job: {request.job_id}")
    
    # We use the same background task logic but specifically for ElevenLabs
    # (The pipeline.py is already using ElevenLabs now, but we create this route for separation)
    background_tasks.add_task(process_dubbing_task, request)
    
    return {
        "status": "success",
        "message": "ElevenLabs Premium Pipeline Booted",
        "job_id": request.job_id,
        "engine": "ElevenLabs Multilingual V2"
    }

async def process_studio_export(request: ExportRequest):
    try:
        await manager.broadcast({"type": "render_status", "job_id": request.project_id, "status": "Rendering", "progress": 15, "message": "Neural Engine Warming Up..."})
        render_data = request.tracks if request.tracks else (request.config or {})
        video_url = render_data.get('video_url', '')
        if video_url.startswith("http://localhost:5000/"):
            local_path = video_url.replace("http://localhost:5000/", "")
            if os.path.exists(local_path): render_data['video_url'] = local_path

        await manager.broadcast({"type": "render_status", "job_id": request.project_id, "status": "Rendering", "progress": 40, "message": "Applying Neural Styles..."})
        output_path = editor.export_project(render_data)
        
        base_url = "http://localhost:5000"
        public_url = f"{base_url}/{output_path}"
        await manager.broadcast({"type": "render_status", "job_id": request.project_id, "status": "Completed", "progress": 100, "url": public_url, "message": "Neural Export Ready"})
    except Exception as e:
        print(f"Export Error: {e}")
        await manager.broadcast({"type": "render_status", "job_id": request.project_id, "status": "Failed", "error": str(e), "message": f"Export Failed: {str(e)}"})

@app.post("/api/edit")
async def export_studio_project(request: ExportRequest, background_tasks: BackgroundTasks):
    print('Bhai, request mil gayi backend par! Route: /api/edit')
    print(f"Received Export Request for Project: {request.project_id}")
    background_tasks.add_task(process_studio_export, request)
    return {"message": "Export Orchestration Started", "project_id": request.project_id}

@app.post("/api/marketplace/process")
async def process_marketplace_item(request: Request, background_tasks: BackgroundTasks):
    print('Bhai, request mil gayi backend par! Route: /api/marketplace/process')
    try:
        data = await request.json()
        template_id = data.get('template_id')
        video_url = data.get('video_url')
        user_id = data.get('user_id')
        
        # Load templates
        with open("templates.json", "r") as f:
            templates = json.load(f)
        
        template = templates.get(template_id)
        if not template:
            return {"status": "error", "message": "Invalid Template ID"}

        # Background task for rendering and credit deduction
        background_tasks.add_task(run_marketplace_pipeline, template, video_url, user_id)
        
        return {
            "status": "success", 
            "message": "Marketplace Synthesis Initialized",
            "credits_deducted": template['credits_cost']
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

async def run_marketplace_pipeline(template, video_urls, user_id):
    try:
        # Handle both single string and list
        if isinstance(video_urls, str):
            video_urls = [video_urls]
            
        # 1. Deduct Credits
        print(f"Deducting {template['credits_cost']} credits for user {user_id}")
        
        # 2. Process with VideoEditor (Concatenate if multiple)
        render_data = {
            "project_id": f"mkplace_{uuid.uuid4().hex[:6]}",
            "video_urls": video_urls, # NEW: support for multiple
            "video_url": video_urls[0], # Fallback for old logic
            "quality": "final_export",
            "filters": template['ffmpeg_filters']
        }
        output_video = editor.export_project(render_data)
        
        # 3. Broadcast status
        base_url = "http://localhost:5000"
        public_url = f"{base_url}/{output_video}"
        await manager.broadcast({
            "type": "render_status", 
            "status": "Completed", 
            "url": public_url, 
            "message": f"{template['name']} Synthesis Ready"
        })
    except Exception as e:
        print(f"Marketplace Error: {e}")
        await manager.broadcast({
            "type": "render_status", 
            "status": "Failed", 
            "error": str(e),
            "message": "Synthesis Engine Crash"
        })

@app.get("/editor/trending")
async def get_trending_music():
    print('Bhai, request mil gayi backend par! Route: /editor/trending')
    try:
        with open("trending.json", "r") as f: return json.load(f)
    except:
        return {"week": "2026-W19", "songs": [{"id": "t1", "title": "Neural Pulse", "artist": "Cyber-Rush", "trend_score": 98, "vibe": "Hype"}]}

@app.post("/api/payments/submit")
async def submit_payment(request: PaymentSubmitRequest):
    print('Bhai, request mil gayi backend par! Route: /api/payments/submit')
    try:
        if not supabase: raise Exception("Supabase Offline")
        data = {"user_id": request.user_id, "utr_number": request.utr_number, "screenshot_url": request.screenshot_url, "amount": request.amount, "credits_requested": request.credits_requested, "status": "pending"}
        supabase.table("transactions").insert(data).execute()
        return {"status": "success", "message": "Payment submitted for verification"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/task/status/{task_id}")
async def get_task_status(task_id: str):
    print('Bhai, request mil gayi backend par! Route: /api/task/status')
    return task_state.get(task_id, {"status": "not_found"})

if __name__ == "__main__":
    import uvicorn
    # Use PORT from environment or default to 5000
    port = int(os.environ.get("PORT", 5000))
    print(f"Neural Core: Ignition on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
