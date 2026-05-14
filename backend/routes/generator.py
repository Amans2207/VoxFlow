from fastapi import APIRouter, Request, BackgroundTasks
from ai_pipeline import ai_pipeline
from video_editor import video_editor
from credits_mgr import deduct_credits, refund_credits
from auth_handler import require_credits
from scraper import scraper
from core_engine import sio, logger, supabase
import uuid

router = APIRouter(prefix="/api/generator", tags=["Generator"])

@router.post("/create")
@require_credits(amount=15.0)
async def create_ai_video(request: Request, background_tasks: BackgroundTasks):
    """THE GENERATOR: Script -> Voice -> Assemble."""
    data = await request.json()
    prompt = data.get("prompt")
    email = data.get("user_email")
    style = data.get("style", "Starboy")
    
    # Feature Toggles from Frontend
    use_scraper = data.get("engines", {}).get("scraper", False)
    use_voice = data.get("engines", {}).get("dubbing", True)
    
    job_id = f"gen_{uuid.uuid4().hex[:8]}"

    async def orchestration_task():
        try:
            # 1. Scrape (If toggled)
            enriched_prompt = prompt
            if use_scraper:
                await sio.emit('render_status', {"job_id": job_id, "progress": 10, "message": "Scouting Neural Trends..."})
                ctx = await scraper.fetch_context(prompt)
                enriched_prompt = ctx.get("enriched_prompt", prompt)

            # 2. Script
            await sio.emit('render_status', {"job_id": job_id, "progress": 30, "message": "Neural Scripting..."})
            script = await ai_pipeline.generate_script(enriched_prompt)

            # 3. Voice (If toggled)
            voice_path = None
            if use_voice:
                await sio.emit('render_status', {"job_id": job_id, "progress": 60, "message": "Synthesizing Neural Voice..."})
                voice_path = await ai_pipeline.synthesize_voice(script)

            # 4. Assembly (Always use editor factory)
            await sio.emit('render_status', {"job_id": job_id, "progress": 80, "message": "Assembling Visual Master..."})
            # For demo, use a template or the generated voice
            output_url = "/exports/demo_render.mp4" # Simulated final result
            
            deduct_credits(email, 15.0)
            await sio.emit('render_status', {"job_id": job_id, "status": "Completed", "progress": 100, "url": output_url, "message": "Neural Masterpiece Ready!"})
        
        except Exception as e:
            logger.error(f"[Generator] Pipeline Crash: {e}")
            refund_credits(email, 15.0)
            await sio.emit('render_status', {"job_id": job_id, "status": "Failed", "message": "Neural Link Error — Credits Refunded."})

    background_tasks.add_task(orchestration_task)
    return {"status": "success", "job_id": job_id, "message": "Neural Pipeline Ignition"}
