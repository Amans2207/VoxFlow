from fastapi import APIRouter, Request, BackgroundTasks
from video_editor import video_editor
from auth_handler import require_credits
from core_engine import sio, logger

router = APIRouter(prefix="/api/studio", tags=["Studio"])

@router.post("/captions")
@require_credits(amount=2.0)
async def add_captions(request: Request, background_tasks: BackgroundTasks):
    """Studio Section: Adds viral captions to an existing video."""
    data = await request.json()
    video_path = data.get("video_url")
    style = data.get("style", "Starboy")
    job_id = data.get("job_id", "studio_caps")

    async def process_task():
        await sio.emit('render_status', {"job_id": job_id, "status": "Processing", "progress": 30, "message": "Burning Viral Captions..."})
        output = video_editor.apply_viral_captions(video_path, style=style)
        await sio.emit('render_status', {"job_id": job_id, "status": "Completed", "progress": 100, "url": output, "message": "Captions Synced! 🎬"})

    background_tasks.add_task(process_task)
    return {"status": "success", "message": "Caption task dispatched"}

@router.post("/ingest")
async def ingest_video(request: Request, background_tasks: BackgroundTasks):
    """Universal Ingest Switchboard."""
    data = await request.json()
    url = data.get("url")
    job_id = f"ingest_{os.urandom(4).hex()}"
    
    background_tasks.add_task(video_editor.normalize_video, url, job_id)
    return {"status": "success", "job_id": job_id, "message": "Normalization Started"}

import os
