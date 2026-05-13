from fastapi import APIRouter, Request, BackgroundTasks
from fastapi.responses import StreamingResponse
import threading
import uuid
import subprocess
import re
import os
import gc
import json
import time

autopilot_bp = APIRouter(prefix="/api/autopilot")

# Global progress tracker
render_progress = {} # { task_id: percentage }

def ffmpeg_progress_monitor(task_id, cmd, total_duration):
    """Parses FFmpeg stderr to calculate real-time percentage."""
    process = subprocess.Popen(cmd, stderr=subprocess.PIPE, universal_newlines=True)
    
    if process.stderr:
        for line in process.stderr:
            # Extract time=HH:MM:SS.ms
            match = re.search(r"time=(\d+:\d+:\d+\.\d+)", line)
            if match:
                time_str = match.group(1)
                h, m, s = map(float, time_str.split(':'))
                current_time = h * 3600 + m * 60 + s
                percentage = min(int((current_time / total_duration) * 100), 100)
                render_progress[task_id] = percentage
                print(f"Task {task_id} Progress: {percentage}%")
    
    process.wait()
    render_progress[task_id] = 100
    gc.collect() # Explicit GC after heavy task

@autopilot_bp.post('/generate')
async def generate_auto_pilot(request: Request, background_tasks: BackgroundTasks):
    print('Bhai, request mil gayi backend par! Route: /api/autopilot/generate')
    data = await request.json()
    task_id = f"auto_{uuid.uuid4().hex[:8]}"
    
    # Mocking total duration for progress calculation
    total_duration = 60.0 # 1 minute video
    
    # In a real scenario, this would be your FFmpeg command
    cmd = ["ffmpeg", "-i", "input.mp4", "-vf", "scale=1080:1920", "output.mp4", "-y"]
    
    background_tasks.add_task(ffmpeg_progress_monitor, task_id, cmd, total_duration)
    
    return {"status": "accepted", "task_id": task_id}

@autopilot_bp.get('/progress/{task_id}')
async def stream_progress(task_id: str):
    print('Bhai, request mil gayi backend par! Route: /api/autopilot/progress')
    """Server-Sent Events (SSE) for real-time progress bar."""
    def generate():
        while True:
            progress = render_progress.get(task_id, 0)
            yield f"data: {json.dumps({'progress': progress})}\n\n"
            if progress >= 100:
                break
            time.sleep(1)
    
    return StreamingResponse(generate(), media_type='text/event-stream')
