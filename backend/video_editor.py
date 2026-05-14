"""
VoxFlow Video Editor — THE FACTORY
===================================
Handles Video Assembly, Captions, Watermarks, and Aspect Ratios.
"""

import os
import subprocess
from core_engine import logger, editor as core_editor

class VideoEditorModule:
    def __init__(self):
        self.output_dir = "exports"
        os.makedirs(self.output_dir, exist_ok=True)

    def apply_viral_captions(self, video_path: str, style: str = "Starboy") -> str:
        """Studio Section: Burns viral captions using MoviePy."""
        try:
            # Reuses the existing robust editor logic
            return core_editor.apply_viral_captions(video_path, [], style=style)
        except Exception as e:
            logger.error(f"[Video Editor] Captioning Failed: {e}")
            return video_path

    def apply_branding(self, video_path: str, position: str = "static") -> str:
        """Watermark Logic: Injects brand identity."""
        try:
            # Reuses the existing robust editor logic
            return core_editor.apply_watermark(video_path, position=position)
        except Exception as e:
            logger.error(f"[Video Editor] Branding Failed: {e}")
            return video_path

    def normalize_video(self, source_url: str, job_id: str) -> str:
        """Universal Ingest: Normalizes to 9:16."""
        output_path = os.path.join("uploads", f"{job_id}.mp4")
        try:
            cmd = [
                "ffmpeg", "-i", source_url, 
                "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920",
                "-c:v", "libx264", "-preset", "ultrafast", "-c:a", "aac",
                output_path, "-y"
            ]
            subprocess.run(cmd, capture_output=True)
            return output_path
        except Exception as e:
            logger.error(f"[Video Editor] Normalization Failed: {e}")
            return ""

# Singleton instance
video_editor = VideoEditorModule()
