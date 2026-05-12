import os
import uuid
import runpod
import shutil
import requests
from pipeline import DubbingPipeline
from editor import VideoEditor

# Initialize Engines Globally for cold-start efficiency
print("🚀 Neural Core: Initializing Serverless Engines...")
pipeline = DubbingPipeline(device="cpu")
editor = VideoEditor()

def download_file(url):
    """Helper to download remote assets for processing."""
    local_filename = f"/tmp/{uuid.uuid4().hex}_{url.split('/')[-1]}"
    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open(local_filename, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
    return local_filename

def handler(job):
    """
    Main RunPod Serverless Handler
    Input format:
    {
        "type": "dub" | "studio",
        "input_url": "https://...",
        "target_lang": "hi",
        "voice": "Bella",
        "config": { ... }
    }
    """
    job_input = job["input"]
    job_type = job_input.get("type", "dub")
    input_url = job_input.get("input_url")
    
    if not input_url:
        return {"error": "Missing input_url"}

    print(f"📦 Processing {job_type} job for {input_url}")
    
    local_input = ""
    try:
        # 1. Download asset
        local_input = download_file(input_url)
        
        # 2. Process based on type
        if job_type == "dub":
            target_lang = job_input.get("target_lang", "hi")
            edit_config = job_input.get("config", {"voice": job_input.get("voice", "Bella")})
            
            output_video, license_file = pipeline.process(local_input, target_lang, edit_config)
            
        elif job_type == "studio":
            render_data = job_input.get("config", {})
            render_data['video_url'] = local_input
            output_video = editor.export_project(render_data)
        
        else:
            return {"error": "Unknown job type"}

        # 3. Handle Output
        # NOTE: Since this is serverless, you should upload the result to S3/Supabase.
        # For now, we return the local path (which won't work for the user unless they have persistent storage)
        # In production, add your S3 upload logic here.
        
        final_filename = os.path.basename(output_video)
        print(f"✅ Success! Output ready: {final_filename}")
        
        # Mocking an S3 URL for demonstration
        # In a real setup, replace this with your actual upload code.
        return {
            "status": "completed",
            "output_video": output_video, 
            "message": "Processing complete. Please ensure you have an upload hook configured for permanent storage."
        }

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return {"error": str(e)}
    
    finally:
        # Cleanup temporary files
        if local_input and os.path.exists(local_input):
            os.remove(local_input)

# Start the Serverless Handler
runpod.serverless.start({"handler": handler})
