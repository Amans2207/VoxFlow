import runpod
import os
import sys
import uuid
import requests

# Add backend to path so we can import the pipeline
sys.path.append(os.path.join(os.getcwd(), 'backend'))
from pipeline import DubbingPipeline

def handler(job):
    """
    The main handler function for RunPod Serverless.
    Expected input: { "video_url": "...", "target_lang": "..." }
    """
    job_input = job['input']
    video_url = job_input.get("video_url")
    target_lang = job_input.get("target_lang", "hindi")
    
    if not video_url:
        return {"error": "No video_url provided"}

    print(f"Starting RunPod Job {job['id']} for {video_url}")
    
    # 1. Download video
    local_input = f"/tmp/{uuid.uuid4().hex}.mp4"
    try:
        response = requests.get(video_url, stream=True)
        with open(local_input, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
    except Exception as e:
        return {"error": f"Failed to download video: {str(e)}"}

    # 2. Run Pipeline
    try:
        # We use CPU by default in handler if CUDA is not detected, 
        # but RunPod will have CUDA.
        pipeline = DubbingPipeline(device="cuda")
        output_path, _ = pipeline.process(local_input, target_lang)
        
        # 3. Upload Result (For RunPod, you usually return a URL to S3/Supabase)
        # For now, we return the local path or simulate success
        return {
            "status": "success",
            "job_id": job['id'],
            "output_video_path": output_path,
            "target_lang": target_lang
        }
    except Exception as e:
        return {"error": f"Pipeline Crash: {str(e)}"}
    finally:
        # Cleanup
        if os.path.exists(local_input):
            os.remove(local_input)

if __name__ == "__main__":
    runpod.serverless.start({"handler": handler})
