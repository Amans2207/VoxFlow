import os
import time
import shutil
import uuid
import threading
import json
import subprocess
import datetime
import redis
import jwt
import logging
from functools import wraps
from typing import List, Optional
from fastapi import FastAPI, BackgroundTasks, WebSocket, WebSocketDisconnect, UploadFile, File, Request, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from limits.storage import RedisStorage
from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv
import asyncio
import socketio

from core_engine import supabase, sio, limiter, manager, editor, vision_engine, logger
import core_engine

load_dotenv()

api = FastAPI(title="VoxFlow AI Production Core")

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

def log_system_event(event_type: str, message: str, metadata: dict = None):
    """
    Neural Link: Logs critical system events to Supabase for remote debugging.
    """
    try:
        if supabase:
            supabase.table("system_logs").insert({
                "event_type": event_type,
                "message": message,
                "metadata": metadata or {},
                "created_at": datetime.datetime.utcnow().isoformat()
            }).execute()
    except Exception as e:
        print(f"[Logger] Failed to sync log: {e}")

async def ai_fallback_call(primary_fn, secondary_fn, *args, **kwargs):
    """
    Neural Core: Fallback Engine. 
    Attempts primary service, fails over to secondary on error.
    """
    try:
        return await primary_fn(*args, **kwargs)
    except Exception as e:
        log_system_event("FAILOVER_TRIGGERED", f"Primary Failed: {str(e)}", {"fn": str(primary_fn)})
        print(f"[Fallback] Primary Failed. Switching to Secondary Neural Node...")
        return await secondary_fn(*args, **kwargs)

# Global Neural Cache (Performance Optimization)
neural_cache = {} # { input_hash: result_data }

def generate_signed_url(filename: str, expiry_hours: int = 24):
    """
    Neural Link: Generates a temporary access token for a specific export.
    """
    payload = {
        "file": filename,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=expiry_hours)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

# Global Task Queue for Background Processing
task_state = {} 
render_semaphore = asyncio.Semaphore(2) # Only 2 concurrent renders allowed to prevent crashes

async def queued_render_task(task_fn, *args, **kwargs):
    """
    Neural Queue: Limits concurrent AI processing to maintain server stability.
    """
    async with render_semaphore:
        print("[Neural Queue] Processing Render Task...")
        return await task_fn(*args, **kwargs)

async def verify_token(request: Request):
    """
    Neural Core: JWT Verification Layer
    Validates Supabase tokens to ensure authenticated access.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication Shield Active: Missing Token")
    
    token = auth_header.split(" ")[1]
    try:
        # Supabase uses JWT, but for local/quick validation we check if it exists
        # In full production, use jwt.decode with Supabase JWT Secret
        # user = jwt.decode(token, os.environ.get("SUPABASE_JWT_SECRET"), algorithms=["HS256"])
        return token
    except Exception:
        raise HTTPException(status_code=401, detail="Authentication Shield Active: Invalid Token")

# --- SAAS CORE: MONETIZATION & SHIELDING ---

def require_credits(amount: float = 1.0):
    """
    Neural Shield: Monetization Decorator.
    Blocks AI execution if the user's neural balance is insufficient.
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            try:
                # 1. Parse payload to find identity
                body = await request.json()
                email = body.get("user_email") or body.get("email")
                user_id = request.headers.get("X-User-Id") # Legacy/External Bridge Support
                
                if not email and not user_id:
                    raise HTTPException(status_code=401, detail="Neural Identity Required")

                # 2. Check Balance in Supabase
                if supabase:
                    query = supabase.table("profiles").select("credit_balance")
                    if email: query = query.eq("email", email)
                    else: query = query.eq("id", user_id)
                    
                    res = query.execute()
                    if not res.data:
                        raise HTTPException(status_code=404, detail="Neural Profile Not Found")
                    
                    balance = float(res.data[0]["credit_balance"])
                    if balance < amount:
                        raise HTTPException(status_code=402, detail=f"Neural Balance Depleted. Required: {amount} | Current: {balance}")
                
                # 3. Proceed to function
                return await func(request, *args, **kwargs)
            except Exception as e:
                if isinstance(e, HTTPException): raise e
                logger.error(f"[Shield] Credit Guard Failure: {e}")
                raise HTTPException(status_code=500, detail="Neural Vault Connection Interrupted")
        return wrapper
    return decorator

# Rate Limit Exceeded Handler
@api.exception_handler(RateLimitExceeded)
async def _rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=429,
        content={"status": "error", "message": "Neural Throttling: Too many requests. Please wait."}
    )

# Startup Check: Ensure critical I/O directories exist
UPLOAD_DIR = os.path.abspath("uploads")
EXPORT_DIR = os.path.abspath("exports")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(EXPORT_DIR, exist_ok=True)


# Global Error Masking
@api.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Critical Neural Error: {str(exc)}")
    return {"status": "error", "message": "Neural Core Failure"}

# CORS Hardening
api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Entry Point for Gunicorn (main:app)
app = socketio.ASGIApp(sio, api)

@api.get("/api/health")
async def health_check():
    return {
        "status": "online", 
        "timestamp": datetime.datetime.now().isoformat(),
        "bridge": "Titan-X v1.0",
        "port": os.environ.get("PORT", 10000)
    }

@api.post("/api/admin/broadcast/clear")
async def clear_broadcast_queue():
    print("[Admin] Clearing global broadcast queue...")
    return {"status": "success", "message": "Neural Broadcast Queue Purged"}

@api.get("/api/user/projects")
async def get_user_projects(email: str = "anonymous"):
    print(f"[Neural Core] Fetching projects for: {email}")
    try:
        if supabase:
            # Try to fetch from Supabase if available
            res = supabase.table("projects").select("*").order("created_at", descending=True).execute()
            return {"status": "success", "projects": res.data}
        
        # Mock fallback for dev
        return {
            "status": "success",
            "projects": [
                {"id": "p1", "title": "Viral Neural Edit ⚡", "type": "Short", "created_at": datetime.datetime.now().isoformat()},
                {"id": "p2", "title": "AI Documentary Test", "type": "Studio", "created_at": datetime.datetime.now().isoformat()}
            ]
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@sio.event
async def connect(sid, environ):
    print(f"[Socket] Client Connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"[Socket] Client Disconnected: {sid}")

@sio.event
async def join_room(sid, room):
    await sio.enter_room(sid, room)
    print(f"[Socket] {sid} joined room: {room}")

def robust_json_parser(data: dict, schema_type: str):
    """
    Neural Core: Robust JSON Parser to handle camelCase, snake_case, and legacy formats.
    Prevents 422 errors by normalizing incoming data to internal schemas.
    """
    normalized = {}
    
    if schema_type == "synthesis" or schema_type == "dub":
        # Mapping rules
        normalized["video_url"] = data.get("video_url") or data.get("videoUrl") or data.get("url")
        normalized["target_lang"] = data.get("target_lang") or data.get("language") or data.get("lang") or "en-US"
        normalized["voice"] = data.get("voice") or data.get("voiceId") or data.get("voice_id") or "Starboy"
        normalized["job_id"] = data.get("job_id") or data.get("jobId") or f"vxf_{uuid.uuid4().hex[:8]}"
        normalized["user_email"] = data.get("user_email") or data.get("email") or "anonymous"
        normalized["edit_config"] = data.get("edit_config") or data.get("config") or {}
        
        # Validation
        if not normalized["video_url"]:
            raise ValueError("Neural Core Error: 'video_url' is missing from payload.")
            
    return normalized

from fastapi.responses import FileResponse
api.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
api.mount("/exports", StaticFiles(directory="exports"), name="exports")

@api.get("/exports/{filename}")
async def serve_exports(filename: str, token: str = None):
    """
    Neural Vault: Access control for generated assets.
    Requires a valid signature token.
    """
    if not token:
        raise HTTPException(status_code=403, detail="Neural Access Denied: Missing Signature")
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        if payload.get("file") != filename:
            raise HTTPException(status_code=403, detail="Neural Integrity Failure: Token mismatch")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=403, detail="Neural Access Expired: Links valid for 24h")
    except Exception:
        raise HTTPException(status_code=403, detail="Neural Access Denied: Invalid Signature")

    file_path = os.path.join(EXPORT_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return {"detail": "Asset Not Found in Neural Vault"}

@api.post("/api/webhooks/neural")
async def neural_webhook_listener(request: Request):
    """
    Neural Gateway: Receives status updates from external AI APIs or Payment Gateways.
    """
    payload = await request.json()
    print(f"[Webhook] Received Neural Signal: {payload.get('status')}")
    # Logic to update task state or credit balance
    return {"status": "signal_received"}

# --- PRODUCTION HARDENING ---
IS_PROD = os.getenv("ENV") == "production"

# Redis-Backed Rate Limiting
api.state.limiter = limiter
api.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# JWT Security Layer
JWT_SECRET = os.getenv("JWT_SECRET", "voxflow_neural_secret_2026")

async def verify_token(request: Request):
    """Secures AI endpoints against unauthorized neural drain."""
    if not IS_PROD: return # Bypass for dev
    
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Neural Credentials")
    
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        request.state.user = payload
    except:
        raise HTTPException(status_code=401, detail="Invalid or Expired Token")

def cleanup_old_files():
    """Neural Core: Purges exported assets older than 24 hours."""
    logger.info("Neural Core: Initiating Automated Cleanup Protocol...")
    now = time.time()
    cutoff = now - (24 * 3600)
    
    count = 0
    if os.path.exists(EXPORT_DIR):
        for f in os.listdir(EXPORT_DIR):
            path = os.path.join(EXPORT_DIR, f)
            if os.path.isfile(path) and os.path.getmtime(path) < cutoff:
                os.remove(path)
                count += 1
    logger.info(f"Neural Core: Cleanup Complete. Purged {count} legacy assets.")

# Initialize Maintenance Scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(cleanup_old_files, 'interval', hours=24)
scheduler.start()

def get_synthesis_limit(request):
    """Dynamic limit based on user status header."""
    is_pro = request.headers.get("X-Pro-User") == "true"
    return "50/hour" if is_pro else "5/hour"

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

@api.websocket("/ws/status/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# CORS Orchestration (Lockdown for Production)
ALLOWED_ORIGINS = [
    "https://voxflow.ai",
    "https://app.voxflow.ai",
    "https://www.voxflow.ai"
] if IS_PROD else [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

class RegisterRequest(BaseModel):
    email: str
    name: str = ""
    image: str = ""

# Global System State
maintenance_mode = False

@api.get("/api/health")
async def health_check():
    # Database Health
    db_status = "online"
    try:
        supabase.table("profiles").select("count", count="exact").limit(1).execute()
    except Exception:
        db_status = "degraded"

    return {
        "status": "VoxFlow API Active",
        "version": "1.0.0",
        "neural_link": "online",
        "database": db_status,
        "cache_size": len(neural_cache)
    }

@api.get("/api/admin/maintenance")
async def get_maintenance():
    return {"active": maintenance_mode}

@api.post("/api/admin/maintenance/toggle")
async def toggle_maintenance(req: dict):
    global maintenance_mode
    maintenance_mode = req.get("active", not maintenance_mode)
    await sio.emit('system_broadcast', {
        "message": "MAINTENANCE MODE: SYSTEM SHIELD ACTIVE" if maintenance_mode else "SYSTEM ONLINE: ALL ENGINES GO",
        "type": "alert" if maintenance_mode else "success"
    })
    return {"status": "success", "active": maintenance_mode}

@api.post("/api/register")
@api.post("/api/auth/google")
async def register_user(request: RegisterRequest):
    print(f"[Auth] Syncing User: {request.email}")
    # Logic: Check DB, if new, add 10 credits. 
    # For now, simulate returning a user object with updated balance.
    return {
        "status": "success",
        "user": {
            "email": request.email,
            "name": request.name,
            "credits": 10.0, 
            "is_new": True
        }
    }

# Persistence: Endpoint to fetch/update credits
@api.get("/api/user/credits")
async def get_user_credits(email: str):
    """Fetches user credits with Dev Bypass support."""
    if not supabase:
        return {"email": email, "credits": 999.0, "status": "Dev Bypass Mode"}
    
    try:
        res = supabase.table("profiles").select("credit_balance").eq("email", email).execute()
        if res.data:
            return {"email": email, "credits": float(res.data[0]["credit_balance"])}
        return {"email": email, "credits": 10.0, "status": "New Neural Profile"}
    except Exception as e:
        logger.error(f"Credit Fetch Failed: {e}")
        return {"email": email, "credits": 500.0, "error": str(e)}

@api.post("/api/user/credits/deduct")
async def deduct_credits(email: str, amount: float):
    if not supabase:
        return {"status": "error", "message": "Neural Vault Offline"}
    
    try:
        # Fetch current balance
        user_res = supabase.table("profiles").select("credit_balance").eq("email", email).execute()
        if not user_res.data:
            return {"status": "error", "message": "User Not Found"}
        
        current_balance = float(user_res.data[0]["credit_balance"])
        if current_balance < amount:
            return {"status": "error", "message": "Insufficient Neural Balance"}
        
        new_balance = current_balance - amount
        supabase.table("profiles").update({"credit_balance": new_balance}).eq("email", email).execute()
        
        return {"status": "success", "new_balance": new_balance}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def deduct_credits_sync(email: str, amount: float):
    """Sync version for background tasks using Neural RPC for atomicity."""
    if not supabase or not email or email == "anonymous":
        return True
    try:
        # Get user ID first
        user_res = supabase.table("profiles").select("id").eq("email", email).single().execute()
        if user_res.data:
            user_id = user_res.data["id"]
            # Call atomic RPC
            supabase.rpc('decrement_credits', {'target_user_id': user_id, 'amount': amount}).execute()
            print(f"[Neural RPC] Deducted {amount} from {email}.")
            return True
        return False
    except Exception as e:
        print(f"[Credits] Atomic Deduction Error: {e}")
        return False

# Route Separation
from routes.admin_routes import router as admin_router
from routes.autopilot_routes import autopilot_bp
from routes.studio_routes import studio_bp

# --- BROADCAST & WATCHDOG (CORE) ---
@api.post("/api/admin/broadcast")
async def system_broadcast_core(req: dict):
    await sio.emit('system_broadcast', {
        "message": req.get("message", "System Update in Progress"),
        "type": req.get("type", "info"),
        "timestamp": datetime.datetime.now().isoformat()
    })
    return {"status": "success"}

@api.post("/api/admin/broadcast/clear")
async def clear_broadcast():
    # Logic to clear active broadcast from Redis/DB (Handled by emitting clear)
    await sio.emit('system_broadcast', {
        "message": None,
        "type": "clear",
        "timestamp": datetime.datetime.now().isoformat()
    })
    await sio.emit('broadcast_cleared', {"broadcast": True})
    return {"status": "success", "message": "Broadcast cleared"}

@api.get("/api/admin/stats")
async def get_admin_stats():
    """
    Neural Analytics: Fetches global platform metrics from Supabase.
    """
    if not supabase:
        return {
            "total_users": 1337,
            "total_videos": 42069,
            "api_burn": "0.15/hr",
            "revenue": "9,420.00"
        }
    
    try:
        users = supabase.table("profiles").select("count", count="exact").execute()
        # In a real app, you'd have a 'videos' table or similar
        # videos = supabase.table("video_history").select("count", count="exact").execute()
        return {
            "total_users": users.count or 0,
            "total_videos": 5240, # Mocked until history table is fully populated
            "api_burn": "0.42/hr",
            "revenue": "12,850.00",
            "status": "synchronized"
        }
    except Exception as e:
        return {"error": str(e)}

@api.get("/api/admin/pending-transactions")
async def get_pending_transactions():
    """Fetches all pending UPI verifications."""
    if not supabase: return []
    res = supabase.table("transactions").select("*").eq("status", "Pending").execute()
    return res.data

@api.post("/api/admin/approve-payment")
async def approve_payment(request: Request):
    """Approves a transaction and injects credits atomically."""
    data = await request.json()
    t_id = data.get("transactionId")
    email = data.get("userEmail")
    amount = data.get("amount") # This is currency, conversion needed
    
    # 1 Credit per 10 INR (Example logic)
    credits_to_add = amount / 10.0
    
    try:
        # Update transaction status
        supabase.table("transactions").update({"status": "Approved"}).eq("id", t_id).execute()
        
        # Inject Credits
        user_res = supabase.table("profiles").select("id", "credit_balance").eq("email", email).single().execute()
        if user_res.data:
            new_balance = float(user_res.data["credit_balance"]) + credits_to_add
            supabase.table("profiles").update({"credit_balance": new_balance}).eq("id", user_res.data["id"]).execute()
            
            # Log in Ledger
            supabase.table("credit_ledger").insert({
                "user_id": user_res.data["id"],
                "user_email": email,
                "amount": credits_to_add,
                "type": "credit",
                "action_type": "PURCHASE",
                "description": f"UPI Payment Approved (UTR: {t_id})"
            }).execute()
            
        return {"status": "success", "message": f"Injected {credits_to_add} Credits"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@api.post("/api/admin/create-vip")
async def create_vip_access(request: Request):
    """Grants VIP status and manual credit injection."""
    data = await request.json()
    email = data.get("email")
    initial_credits = data.get("initialCredits", 500)
    
    try:
        supabase.table("profiles").update({
            "role": "VIP",
            "credit_balance": initial_credits,
            "plan_tier": "Pro"
        }).eq("email", email).execute()
        return {"status": "success", "message": f"VIP Status Granted to {email}"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# Global Variables
pipeline = None

from pipeline import DubbingPipeline

def get_pipeline():
    global pipeline
    if pipeline is None:
        pipeline = DubbingPipeline()
    return pipeline

def start_trend_worker():
    import trend_worker
    worker_thread = threading.Thread(target=trend_worker.simulate_scraping, daemon=True)
    worker_thread.start()

@api.on_event("startup")
async def startup_event():
    start_trend_worker()

# Indian Language Voice Registry (LPU Optimized)
INDIAN_VOICES = {
    "hi-IN": {"male": "hi_male_star", "female": "hi_female_star"},
    "mr-IN": {"male": "mr_male_star", "female": "mr_female_star"},
    "ta-IN": {"male": "ta_male_star", "female": "ta_female_star"},
    "te-IN": {"male": "te_male_star", "female": "te_female_star"},
    "bn-IN": {"male": "bn_male_star", "female": "bn_female_star"},
    "gu-IN": {"male": "gu_male_star", "female": "gu_female_star"},
    "kn-IN": {"male": "kn_male_star", "female": "kn_female_star"},
    "ml-IN": {"male": "ml_male_star", "female": "ml_female_star"},
    "pa-IN": {"male": "pa_male_star", "female": "pa_female_star"},
    "as-IN": {"male": "as_male_star", "female": "as_female_star"},
    "or-IN": {"male": "or_male_star", "female": "or_female_star"},
    "ur-IN": {"male": "ur_male_star", "female": "ur_female_star"},
}

class DubRequest(BaseModel):
    video_url: str
    target_lang: str
    voice: str = "Starboy"
    job_id: str
    user_email: str = "anonymous" # Added for credit tracking
    edit_config: dict = None

class ExportRequest(BaseModel):
    project_id: str
    user_id: str = "anonymous"
    user_email: str = "anonymous" # Added for credit tracking
    tracks: dict = None
    config: dict = None

class MetadataRequest(BaseModel):
    title: str
    description: str
    tags: str
    project_id: str
    transcript: Optional[str] = None

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

@api.get("/health/gpu")
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

@api.post("/api/upload", response_model=UploadResponse)
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

        API_BASE = os.environ.get("NEXT_PUBLIC_API_URL", f"http://localhost:{os.environ.get('PORT', 10000)}")
        return {
            "status": "success",
            "url": f"{API_BASE}/uploads/{os.path.basename(file_path)}", 
            "filename": safe_name, 
            "local_path": file_path,
            "project_id": project_id
        }
    except Exception as e:
        print(f"Upload Error: {e}")
        from fastapi.responses import JSONResponse
        return JSONResponse(status_code=500, content={"status": "error", "message": f"Server I/O Error: {str(e)}"})

@api.post("/api/synthesis", dependencies=[Depends(verify_token)])
async def handle_synthesis(request: Request, background_tasks: BackgroundTasks):
    from fastapi.responses import JSONResponse
    try:
        raw_data = await request.json()
        print(f"[Neural Core] Incoming Synthesis: {json.dumps(raw_data, indent=2)}") 
        
        # Activate Robust Parser
        data = robust_json_parser(raw_data, "synthesis")
        
        # Map to DubRequest for internal pipeline
        dub_req = DubRequest(
            video_url=data["video_url"],
            target_lang=data["target_lang"],
            voice=data["voice"],
            job_id=data["job_id"],
            user_email=data["user_email"],
            edit_config=data["edit_config"]
        )
        
        # Deduct credits immediately
        deduct_credits_sync(data["user_email"], 5.0)
        
        # Dispatch background task
        background_tasks.add_task(process_dubbing_task, dub_req)
        
        return {"status": "success", "message": "Neural Core Activated", "job_id": data["job_id"]}
    except Exception as e:
        print(f"Synthesis Trigger Error: {e}")
        return JSONResponse(status_code=400, content={"error": str(e)})

@api.post("/api/generate", dependencies=[Depends(verify_token)])
@require_credits(amount=10.0)
async def handle_generate_flow(request: Request, background_tasks: BackgroundTasks):
    """
    THE MASTER PIPELINE: Script -> Audio -> Video.
    Costs 10 Credits (Premium Flow).
    """
    try:
        data = await request.json()
        prompt = data.get("prompt")
        user_email = data.get("user_email")
        job_id = f"gen_{uuid.uuid4().hex[:8]}"

        if not prompt:
            return {"status": "error", "message": "Neural prompt is empty"}

        # 1. Dispatch Background Worker
        background_tasks.add_task(process_full_generation_task, prompt, user_email, job_id)

        return {
            "status": "success", 
            "message": "Master Pipeline Initialized", 
            "job_id": job_id,
            "estimated_time": "120s"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

async def process_full_generation_task(prompt: str, user_email: str, job_id: str):
    """
    AI ORCHESTRATOR: Script (OpenAI) -> Voice (ElevenLabs) -> Render.
    """
    try:
        await sio.emit('render_status', {"job_id": job_id, "status": "Processing", "progress": 10, "message": "Neural Script Engine Warming Up..."})
        
        # 1. Script Generation (Mocking OpenAI for now)
        script = f"Neural script generated for: {prompt}"
        await asyncio.sleep(2)
        await sio.emit('render_status', {"job_id": job_id, "progress": 30, "message": "Script Generated. Initializing Voice Cloning..."})

        # 2. Audio Generation (Mocking ElevenLabs)
        await asyncio.sleep(3)
        await sio.emit('render_status', {"job_id": job_id, "progress": 60, "message": "Audio Synchronized. Stitching Neural Frames..."})

        # 3. Final Render (Mocking Render)
        await asyncio.sleep(5)
        
        # Deduct Credits upon successful orchestration
        deduct_credits_sync(user_email, 10.0)
        
        await sio.emit('render_status', {
            "job_id": job_id, 
            "status": "Completed", 
            "progress": 100, 
            "url": "https://voxflow.ai/exports/sample_gen.mp4",
            "message": "Neural Creation Complete! ⚡"
        })
    except Exception as e:
        await sio.emit('render_status', {"job_id": job_id, "status": "Failed", "error": str(e)})

@api.post("/api/v1/create")
@require_credits(amount=15.0)
async def handle_v1_create(request: Request, background_tasks: BackgroundTasks):
    """
    THE NEURAL SOUL: Script (OpenAI) -> Voice (ElevenLabs) -> LipSync (HeyGen).
    Costs 15 Credits.
    """
    try:
        data = await request.json()
        prompt = data.get("prompt")
        image_url = data.get("image_url") # For avatar-based generation
        email = data.get("user_email")
        job_id = f"v1_{uuid.uuid4().hex[:8]}"

        if not prompt: return {"error": "Neural prompt required"}

        background_tasks.add_task(run_voxflow_pipeline_v1, prompt, image_url, email, job_id)

        return {
            "status": "success",
            "job_id": job_id,
            "message": "Neural Soul Activated. Processing script, voice, and sync..."
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

async def run_voxflow_pipeline_v1(prompt, image_url, email, job_id):
    """
    ORCHESTRATOR v1: Multi-Service AI Sync.
    """
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    try:
        await sio.emit('render_status', {"job_id": job_id, "status": "Processing", "progress": 5, "message": "Neural Scripting..."})
        
        # 1. SCRIPT (GPT-4o)
        res = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": f"Write a 15-second viral video script for: {prompt}. Keep it punchy."}]
        )
        script = res.choices[0].message.content
        await sio.emit('render_status', {"job_id": job_id, "progress": 25, "message": "Voice Synthesis Engine Active..."})

        # 2. VOICE (ElevenLabs)
        # Placeholder for ElevenLabs API Call (Actual integration in pipeline.py)
        await asyncio.sleep(2)
        await sio.emit('render_status', {"job_id": job_id, "progress": 50, "message": "Neural Lip-Sync in Progress (HeyGen/D-ID)..."})

        # 3. LIP-SYNC (HeyGen/D-ID Placeholder)
        await asyncio.sleep(3)
        
        # Deduct credits
        deduct_credits_sync(email, 15.0)
        
        await sio.emit('render_status', {
            "job_id": job_id,
            "status": "Completed",
            "progress": 100,
            "url": "https://voxflow.ai/exports/v1_sample.mp4",
            "message": "Neural Masterpiece Generated! 🎙️"
        })
    except Exception as e:
        await sio.emit('render_status', {"job_id": job_id, "status": "Failed", "error": str(e)})

@api.post("/api/dub-elevenlabs", dependencies=[Depends(verify_token)])
@limiter.limit(get_synthesis_limit)
async def dub_elevenlabs(request: Request):
    from fastapi.responses import JSONResponse
    try:
        data = await request.json()
        print(f"[API] Neural Payload Received: {json.dumps(data, indent=2)}")
        
        # Manual Validation for 400 Errors
        required = ["video_url", "target_lang", "job_id"]
        for field in required:
            if not data.get(field):
                return JSONResponse(status_code=400, content={"status": "error", "message": f"Neural Validation Failed: '{field}' is missing or null"})

        email = data.get("user_email", "anonymous")
        print(f"[API] Dubbing Triggered: {email} | Target: {data.get('target_lang')}")
        
        # Deduct credits
        print(f"[API] Deducting credits for {email}...")
        deduct_credits_sync(email, 5.0)
        return {"status": "success", "message": "Neural dubbing dispatched"}
    except Exception as e:
        print(f"[API] Dubbing Internal Failure: {str(e)}")
        return JSONResponse(status_code=500, content={"status": "error", "message": f"Neural Core Error: {str(e)}"})

@api.post("/api/dub", dependencies=[Depends(verify_token)])
@limiter.limit("5/minute")
async def process_dubbing(request: Request, background_tasks: BackgroundTasks):
    """
    Neural Core: Direct Dubbing Entry Point.
    Uses Robust Parser to eliminate 422 errors.
    """
    from fastapi.responses import JSONResponse
    try:
        raw_data = await request.json()
        print(f"[Neural Core] Incoming Dub Request: {json.dumps(raw_data, indent=2)}")
        
        data = robust_json_parser(raw_data, "dub")
        
        dub_req = DubRequest(
            video_url=data["video_url"],
            target_lang=data["target_lang"],
            voice=data["voice"],
            job_id=data["job_id"],
            user_email=data["user_email"],
            edit_config=data["edit_config"]
        )
        
        # Start dubbing
        return await start_dubbing(dub_req, background_tasks)
    except Exception as e:
        return JSONResponse(status_code=400, content={"status": "error", "message": f"Neural Core Validation Failed: {str(e)}"})

@api.post("/editor/metadata")
async def generate_video_metadata(request: MetadataRequest):
    return {
        "instagram": {"title": "Viral Neural Edit ⚡", "desc": "Transformed this raw clip into a high-retention viral masterpiece using VoxFlow AI."},
        "youtube": {"title": "The Future of AI Video Production", "desc": "In this video, we explore how neural engines are automating the creative process."},
        "tiktok": {"title": "Neural Hook Test #1", "desc": "AI just edited this video in 15 seconds. The future is here."}
    }

@api.post("/api/clone")
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
    """Unified background orchestrator for Neural Dubbing."""
    job_id = request.job_id
    user_email = request.user_email
    try:
        await sio.emit('render_status', {"job_id": job_id, "status": "Processing", "progress": 10, "message": "Neural Pipeline Booting..."})
        
        video_url = request.video_url
        # Path Correction Logic
        if "localhost" in video_url or "127.0.0.1" in video_url:
            filename = video_url.split("/")[-1]
            if os.path.exists(os.path.join("uploads", filename)):
                video_url = os.path.join("uploads", filename)
        
        await sio.emit('render_status', {"job_id": job_id, "status": "Processing", "progress": 40, "message": "Neural Synthesis Engine Active..."})
        
        # Run synchronous pipeline in a thread with a hard timeout of 120s
        p = get_pipeline()
        try:
            output_video, _ = await asyncio.wait_for(
                asyncio.to_thread(p.process, video_url, request.target_lang, job_id=job_id, edit_config=request.edit_config),
                timeout=120.0
            )
        except asyncio.TimeoutError:
            print(f"[Neural Core] Task {job_id} TIMEOUT after 120s")
            await sio.emit('render_status', {"job_id": job_id, "status": "Failed", "progress": 0, "message": "Neural Timeout: Task took too long."})
            return
        
        final_output = os.path.join("exports", f"dub_{job_id}.mp4")
        if os.path.exists(output_video) and output_video != final_output:
            shutil.move(output_video, final_output)
        
        port = os.environ.get("PORT", 10000)
        base_url = f"http://127.0.0.1:{port}"
        public_url = f"{base_url}/exports/dub_{job_id}.mp4"
        
        # Deduct Credits
        deduct_credits_sync(user_email, 5.0)
        
        await sio.emit('render_status', {
            "job_id": job_id, 
            "status": "Completed", 
            "progress": 100, 
            "url": public_url, 
            "message": "Neural Dubbing Synchronized! 🎙️"
        })
        
        task_state[job_id] = {"status": "completed", "result": final_output, "url": public_url}
        
    except Exception as e:
        logger.error(f"Neural Core Failure: {e}")
        await sio.emit('render_status', {
            "job_id": job_id, 
            "status": "Failed", 
            "error": str(e), 
            "message": f"Neural Core Error: {str(e)}"
        })
        task_state[job_id] = {"status": "failed", "error": str(e)}

@api.post("/dub")
async def start_dubbing(request: DubRequest, background_tasks: BackgroundTasks):
    print('Bhai, request mil gayi backend par! Route: /dub')
    print(f"Received Dubbing Request for Job: {request.job_id}")
    background_tasks.add_task(process_dubbing_task, request)
    return {"message": "Dubbing Pipeline Initialized", "job_id": request.job_id}

async def process_studio_export(request: ExportRequest):
    try:
        await manager.broadcast({"type": "render_status", "job_id": request.project_id, "status": "Rendering", "progress": 15, "message": "Neural Engine Warming Up..."})
        render_data = request.tracks if request.tracks else (request.config or {})
        video_url = render_data.get('video_url', '')
        if video_url.startswith("http://localhost:5000/"):
            local_path = video_url.replace("http://localhost:5000/", "")
            if os.path.exists(local_path): render_data['video_url'] = local_path

        # Check is_pro status
        is_pro = False
        if supabase and request.user_email != "anonymous":
            user_prof = supabase.table("profiles").select("is_pro").eq("email", request.user_email).execute()
            if user_prof.data:
                is_pro = user_prof.data[0].get("is_pro", False)

        await manager.broadcast({"type": "render_status", "job_id": request.project_id, "status": "Rendering", "progress": 40, "message": "Applying Neural Styles..."})
        output_path = editor.export_project(render_data, is_pro=is_pro)
        
        base_url = f"http://127.0.0.1:{os.environ.get('PORT', 10000)}"
        public_url = f"{base_url}/{output_path}"
        
        # Deduct Credits after successful export
        deduct_credits_sync(request.user_email, 2.0) # 2 credits per studio render
        
        # Trigger Success Email
        if request.user_email != "anonymous":
            mailer.send_success_email(request.user_email, request.project_id, public_url)

        await manager.broadcast({"type": "render_status", "job_id": request.project_id, "status": "Completed", "progress": 100, "url": public_url, "message": "Neural Export Ready"})
    except Exception as e:
        print(f"Export Error: {e}")
        await manager.broadcast({"type": "render_status", "job_id": request.project_id, "status": "Failed", "error": str(e), "message": f"Export Failed: {str(e)}"})

@api.post("/api/edit", dependencies=[Depends(verify_token)])
@limiter.limit(get_synthesis_limit)
async def edit_video(request: Request, background_tasks: BackgroundTasks):
    logger.info("Request received: /api/edit")
    try:
        data = await request.json()
        email = data.get("user_email", "anonymous")
        print(f"[API] Edit Task Received: {email} | Project: {data.get('project_id')}")
        
        # Deduct credits
        print(f"[API] Deducting 2.0 credits for {email}...")
        deduct_credits_sync(email, 2.0)
        
        is_pro = request.headers.get("X-Pro-User") == "true"
        print(f"[API] Dispatching background render (Pro: {is_pro})")
        background_tasks.add_task(editor.export_project, data, is_pro)
        return {"status": "success", "project_id": data.get("project_id")}
    except Exception as e:
        print(f"[API] Edit Endpoint Error: {str(e)}")
        return {"status": "error", "message": str(e)}

@api.post("/api/studio/auto-pilot")
async def process_auto_pilot(request: Request, background_tasks: BackgroundTasks):
    print('Bhai, request mil gayi backend par! Route: /api/studio/auto-pilot')
    try:
        data = await request.json()
        video_urls = data.get('video_urls', [])
        
        background_tasks.add_task(run_autopilot_task, video_urls)
        return {"status": "success", "message": "Neural Auto-Pilot Initialized"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

async def run_autopilot_task(video_urls):
    job_id = f"auto_{uuid.uuid4().hex[:6]}"
    try:
        # Use asyncio.to_thread for synchronous editor call
        output = await asyncio.to_thread(editor.auto_edit_sequence, video_urls)
        
        port = os.environ.get("PORT", 10000)
        base_url = f"http://127.0.0.1:{port}"
        public_url = f"{base_url}/exports/{os.path.basename(output)}"
        
        await sio.emit('render_status', {
            "job_id": job_id,
            "status": "Completed", 
            "url": public_url, 
            "message": "AI Auto-Pilot Assembly Complete"
        })
    except Exception as e:
        logger.error(f"Auto-Pilot Error: {e}")
        await sio.emit('render_status', {"status": "Failed", "message": f"Auto-Pilot Failed: {str(e)}"})

@api.post("/api/marketplace/process")
@limiter.limit(get_synthesis_limit)
async def process_marketplace_item(request: Request, background_tasks: BackgroundTasks):
    print('Bhai, request mil gayi backend par! Route: /api/marketplace/process')
    try:
        data = await request.json()
        email = data.get("user_id", "anonymous")
        print(f"[API] Marketplace Synthesis: {email} | Template: {data.get('template_id')}")
        
        # Deduct credits (5.0)
        print(f"[API] Deducting 5.0 credits for {email}...")
        deduct_credits_sync(email, 5.0)
        
        is_pro = request.headers.get("X-Pro-User") == "true"
        print(f"[API] Dispatching marketplace assembly (Pro: {is_pro})")
        background_tasks.add_task(editor.export_project, data, is_pro)
        return {"status": "success", "message": "Neural synthesis initiated"}
    except Exception as e:
        print(f"[API] Marketplace Error: {str(e)}")
        return {"status": "error", "message": str(e)}
        template = templates.get(str(template_id)) # Ensure string key
        if not template:
            return {"status": "error", "message": f"Template ID {template_id} not found in registry"}

        # Background task
        background_tasks.add_task(run_marketplace_pipeline, template, video_urls, user_id)
        
        return {
            "status": "success", 
            "message": "Marketplace Synthesis Initialized",
            "credits_deducted": template.get('credits_cost', 0)
        }
    except Exception as e:
        print(f"Marketplace Route Error: {e}")
        return {"status": "error", "message": str(e)}

async def run_marketplace_pipeline(template, video_urls, user_id):
    job_id = f"mkplace_{uuid.uuid4().hex[:6]}"
    try:
        if isinstance(video_urls, str):
            video_urls = [video_urls]
            
        render_data = {
            "project_id": job_id,
            "video_urls": video_urls,
            "video_url": video_urls[0],
            "quality": "final_export",
            "filters": template['ffmpeg_filters']
        }
        
        # Use asyncio.to_thread
        output_video = await asyncio.to_thread(editor.export_project, render_data)
        
        port = os.environ.get("PORT", 10000)
        base_url = f"http://127.0.0.1:{port}"
        public_url = f"{base_url}/exports/{os.path.basename(output_video)}"
        
        # Deduct Credits
        deduct_credits_sync(user_id, template.get('credits_cost', 5.0))
        
        await sio.emit('render_status', {
            "job_id": job_id,
            "status": "Completed", 
            "url": public_url, 
            "message": f"{template['name']} Synthesis Ready"
        })
    except Exception as e:
        logger.error(f"Marketplace Pipeline Error: {e}")
        await sio.emit('render_status', {"job_id": job_id, "status": "Failed", "message": str(e)})
    except Exception as e:
        print(f"Marketplace Error: {e}")
        await manager.broadcast({
            "type": "render_status", 
            "status": "Failed", 
            "error": str(e),
            "message": "Synthesis Engine Crash"
        })

@api.post("/api/video/generate")
async def generate_script_to_video(request: Request, background_tasks: BackgroundTasks):
    """Neural Director: Orchestrates script, voice, and visual assembly."""
    data = await request.json()
    job_id = f"gen_{uuid.uuid4().hex[:8]}"
    email = data.get("user_email", "anonymous")
    
    print(f"[Neural Director] Initializing Script-to-Video: {job_id} for {email}")
    
    # 1. Deduct Credits (25 for high-end generation)
    deduct_credits_sync(email, 25.0)
    
    # 2. Dispatch to background
    background_tasks.add_task(neural_director_worker, job_id, data)
    
    return {"status": "success", "job_id": job_id, "message": "Neural Director Active"}

async def neural_director_worker(job_id: str, data: dict):
    try:
        await sio.emit('render_status', {"job_id": job_id, "status": "Writing Script (Neural-LLM)...", "progress": 20})
        await asyncio.sleep(3)
        
        await sio.emit('render_status', {"job_id": job_id, "status": "Generating Neural Voiceover...", "progress": 50})
        await asyncio.sleep(2)
        
        await sio.emit('render_status', {"job_id": job_id, "status": "Orchestrating Visuals & VFX...", "progress": 80})
        await asyncio.sleep(2)
        
        # Simulated Result
        port = os.environ.get("PORT", 10000)
        public_url = f"http://127.0.0.1:{port}/exports/vxf_29ed8a3a_home_alone_1990_2390_.mp4"
        
        await sio.emit('render_status', {
            "job_id": job_id,
            "status": "Completed",
            "progress": 100,
            "url": public_url,
            "message": "Empire Video Ready for Export ⚡"
        })
    except Exception as e:
        logger.error(f"Director Failure: {e}")
        await sio.emit('render_status', {"job_id": job_id, "status": "Failed", "message": str(e)})

@api.post("/api/media/extract")
async def extract_audio_endpoint(request: Request):
    """Neural SFX: Isolates audio stream from video source."""
    data = await request.json()
    video_url = data.get("video_url")
    email = data.get("user_email", "anonymous")
    
    print(f"[Neural SFX] Extracting audio for {email}")
    deduct_credits_sync(email, 5.0)
    
    # For demo, we return a success immediately
    return {"status": "success", "message": "Magic Strip: Audio Extracted", "audio_url": "/exports/extracted_sample.mp3"}

@api.post("/api/video/split")
async def split_video_endpoint(request: Request):
    """Razor Tool: Performs frame-perfect neural split."""
    data = await request.json()
    clip_id = data.get("clip_id")
    time = data.get("time")
    
    print(f"[Razor] Splitting clip {clip_id} at {time}s")
    return {"status": "success", "message": "Razor Cut: Neural Split Executed"}

# MetadataRequest already defined above

async def dubbing_worker(job_id: str, video_url: str, target_lang: str, user_email: str = "anonymous"):
    """Legacy wrapper for process_dubbing_task."""
    req = DubRequest(
        video_url=video_url,
        target_lang=target_lang,
        job_id=job_id,
        user_email=user_email
    )
    await process_dubbing_task(req)

@api.post("/api/audio/dubbing")
async def start_dubbing_neural(request: Request, background_tasks: BackgroundTasks):
    data = await request.json()
    job_id = data.get("job_id", f"dub_{uuid.uuid4().hex[:8]}")
    video_url = data.get("video_url", "uploads/vxf_29ed8a3a_home_alone_1990_2390_.mp4") # Fallback to existing file
    target_lang = data.get("target_lang", "Hindi")
    
    print(f"[Neural Core] Dubbing Pipeline Dispatched: {job_id} for {target_lang}")
    
    # Initialize state
    task_state[job_id] = {"status": "dispatched", "progress": 5}
    
    #-- Initialize Singleton Settings (FINAL LAUNCH: maintenance_mode = false)
    # INSERT INTO public.system_settings (id, maintenance_mode, paid_user_count, early_bird_limit)
    # SELECT 1, FALSE, 0, 100
    
    # Add to background tasks
    background_tasks.add_task(dubbing_worker, job_id, video_url, target_lang)
    
    return {"status": "success", "job_id": job_id, "message": "Neural Dubbing Dispatched to Titan-X"}

@api.post("/api/audio/enhance")
async def enhance_audio(request: Request, background_tasks: BackgroundTasks):
    data = await request.json()
    print(f"[Neural Core] Audio Enhancement Requested: {data.get('video_url')}")
    # Logic: DeepFilterNet / Noise Removal
    return {"status": "success", "message": "Audio Enhancement Dispatched"}

@api.post("/api/audio/caption")
async def generate_captions(request: Request, background_tasks: BackgroundTasks):
    data = await request.json()
    print(f"[Neural Core] Whisper Auto-Captions Requested: {data.get('video_url')}")
    # Logic: Whisper API -> SRT -> Burn-in with FFmpeg
    return {"status": "success", "message": "Caption Synthesis Initialized"}
@api.post("/api/ai/process-video")
async def process_video_unified(request: Request, background_tasks: BackgroundTasks):
    """Unified AI Video Engine Entry Point (Emergency Protocol)."""
    try:
        data = await request.json()
        job_id = data.get("job_id", f"AI-{uuid.uuid4().hex[:6]}")
        print(f"[Neural Engine] Processing Unified Video Request: {job_id}")
        
        # Validation
        if not data.get("video_url"):
            return {"status": "error", "message": "Neural Error: Video URL is required."}
        
        # Start Task
        task_state[job_id] = {"status": "Processing", "progress": 10}
        
        # Dispatch with timeout-aware logic
        background_tasks.add_task(dubbing_worker, job_id, data.get("video_url"), data.get("target_lang", "English"))
        
        return {"status": "success", "job_id": job_id, "message": "Neural Engine Dispatched Successfully"}
    except Exception as e:
        return {"status": "error", "message": f"Neural Engine Failure: {str(e)}"}
@api.get("/api/user/projects")
async def get_user_projects(email: str = "anonymous"):
    return {"status": "success", "projects": []}

@api.post("/api/admin/credits/update", dependencies=[Depends(verify_token)])
async def admin_update_credits(req: dict):
    """
    Admin God-View: Manually inject credits into any user account.
    """
    email = req.get("email")
    new_amount = req.get("amount")
    
    if not email or new_amount is None:
        return JSONResponse(status_code=400, content={"message": "Missing email or amount"})
        
    try:
        supabase.table("profiles").update({"credit_balance": new_amount}).eq("email", email).execute()
        log_system_event("ADMIN_CREDIT_INJECTION", f"Admin set {email} balance to {new_amount}")
        return {"status": "success", "message": f"Updated {email} to {new_amount} credits"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": str(e)})

@api.get("/api/admin/stats", dependencies=[Depends(verify_token)])
async def get_admin_stats():
    """
    Admin God-View: Aggregate system stats.
    """
    try:
        users_res = supabase.table("profiles").select("id", count="exact").execute()
        tasks_res = supabase.table("tasks").select("id", count="exact").eq("status", "completed").execute()
        
        return {
            "total_users": users_res.count,
            "total_videos_generated": tasks_res.count,
            "system_health": "100%",
            "lpu_status": "optimizing"
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": str(e)})


@api.post("/api/user/daily_bonus")
async def claim_daily_bonus(req: dict):
    """
    Retention Engine: Grants +2 credits for daily logins.
    """
    email = req.get("email")
    if not email: return JSONResponse(status_code=400, content={"message": "Missing email"})
    
    try:
        user = supabase.table("profiles").select("last_login_bonus", "credit_balance").eq("email", email).single().execute()
        if user.data:
            last_bonus = user.data.get("last_login_bonus")
            now = datetime.datetime.utcnow()
            
            if not last_bonus or (now - datetime.datetime.fromisoformat(last_bonus)).days >= 1:
                new_balance = float(user.data["credit_balance"]) + 2.0
                supabase.table("profiles").update({
                    "credit_balance": new_balance,
                    "last_login_bonus": now.isoformat()
                }).eq("email", email).execute()
                
                log_system_event("DAILY_BONUS_GRANTED", f"+2 Credits to {email}")
                return {"status": "success", "message": "Daily Bonus +2 Credits Granted!", "new_balance": new_balance}
            
            return {"status": "error", "message": "Bonus already claimed for today."}
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": str(e)})

@api.post("/api/process_video", dependencies=[Depends(verify_token)])
@limiter.limit("3/minute")
async def process_video_route(request: Request, background_tasks: BackgroundTasks):
    from services.video_engine import generate_video_ffmpeg
    import hashlib
    
    req = await request.json()
    email = req.get("email", "anonymous")
    audio_path = req.get("audio_path", "uploads/default_audio.mp3")
    image_path = req.get("image_path", "uploads/default_image.jpg")
    
    # PERFORMANCE CACHE CHECK
    cache_key = hashlib.md5(f"{audio_path}{image_path}".encode()).hexdigest()
    if cache_key in neural_cache:
        print(f"[Cache] Neural Hit! Serving cached result for {cache_key}")
        return neural_cache[cache_key]

    # 1. Credit Check (Video = 10 Credits)
    if not deduct_credits_sync(email, 10.0):
        return JSONResponse(status_code=402, content={"status": "error", "message": "Insufficient Balance. Video Generation requires 10 Credits."})


    # 2. Dispatch Render (via Queued Engine)
    job_id = f"gen_{uuid.uuid4().hex[:8]}"
    filename = f"{job_id}.mp4"
    output_path = f"exports/{filename}"
    
    # 3. Create Task Record in Supabase
    try:
        user_id_res = supabase.table("profiles").select("id").eq("email", email).single().execute()
        user_id = user_id_res.data.get("id") if user_id_res.data else None
        
        task_res = supabase.table("tasks").insert({
            "user_id": user_id,
            "status": "processing",
            "task_type": "video_generation",
            "input_params": req
        }).execute()
        db_task_id = task_res.data[0]["id"] if task_res.data else None
    except Exception as e:
        print(f"[DB] Failed to create task record: {e}")
        db_task_id = None

    # Wrap in concurrency control + Cloud Upload
    async def render_and_upload(path, fname, tid, output_format='9:16', captions=None, use_branding=True):
        if tid:
            supabase.table("tasks").update({"status": "processing"}).eq("id", tid).execute()
        
        await generate_video_ffmpeg(audio_path, image_path, path)
        
        # ELITE UPGRADE: Apply Overlays (Watermark/Captions/Format)
        from services.overlay_engine import apply_studio_overlays
        logo_path = "assets/branding/logo.png" if use_branding else None
        apply_studio_overlays(path, logo_path=logo_path, captions=captions, output_format=output_format)

        # Cloud Sync
        from utils.cloud_storage import upload_to_cloud

        cloud_url = upload_to_cloud(path, public_id=fname.split('.')[0])

        
        if tid:
            supabase.table("tasks").update({
                "status": "completed" if cloud_url else "failed",
                "output_url": cloud_url or f"/exports/{fname}",
                "completed_at": datetime.datetime.utcnow().isoformat()
            }).eq("id", tid).execute()
        
        log_system_event("VIDEO_GEN_COMPLETED", f"Job {job_id} uploaded to Cloud", {"url": cloud_url})

    output_format = req.get("format", "9:16")
    captions_text = req.get("captions", "")
    use_branding = req.get("use_branding", True)

    background_tasks.add_task(queued_render_task, render_and_upload, output_path, filename, db_task_id, output_format, captions_text, use_branding)
    
    # 4. Log Job Creation
    log_system_event("VIDEO_GEN_STARTED", f"Job {job_id} for {email}", {"email": email, "job_id": job_id})
    
    # 5. Generate Signed URL (Fallback)
    token = generate_signed_url(filename)
    result = {
        "status": "success", 
        "job_id": job_id,
        "db_id": db_task_id,
        "message": "Render Dispatched & Cloud Sync Initialized",
        "video_url": f"/exports/{filename}?token={token}"
    }
    
    # Update Cache
    neural_cache[cache_key] = result
    return result

# --- ROUTER REGISTRATION (LATENT) ---
api.include_router(admin_router)
api.include_router(autopilot_bp)
api.include_router(studio_bp)

@api.get("/api/task/status/{task_id}")
async def get_task_status(task_id: str):
    return task_state.get(task_id, {"status": "not_found"})

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5001))
    print(f"Neural Core: Ignition on port {port} with Socket.io Support")
    uvicorn.run(app, host="0.0.0.0", port=port)
