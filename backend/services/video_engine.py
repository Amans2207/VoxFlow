import subprocess
import os

def generate_video_ffmpeg(audio_path, image_path, output_path):
    """
    Neural Video Engine: FFmpeg Orchestration
    Combines audio and image into a high-quality MP4.
    """
    print(f"[Video Engine] Orchestrating Render: {output_path}")
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Command: Static image + Audio -> Video
    command = [
        'ffmpeg', '-y',
        '-loop', '1', '-i', image_path,
        '-i', audio_path,
        '-c:v', 'libx264', '-tune', 'stillimage',
        '-c:a', 'aac', '-b:a', '192k',
        '-pix_fmt', 'yuv420p', '-shortest',
        output_path
    ]

    try:
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
        
        if process.returncode != 0:
            print(f"[Video Engine] FFmpeg Error: {stderr.decode()}")
            return False
        
        return True
    except Exception as e:
        print(f"[Video Engine] Critical Failure: {e}")
        return False
