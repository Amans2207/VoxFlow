"""
VoxFlow Neural Chamber: THE VIDEO FACTORY (Engine)
==================================================
Handles purely visual and assembly tasks: MoviePy, Captions, Rendering.
"""

import os
from core_engine import editor as core_editor
from utils.logger import vox_logger

class VideoFactory:
    def render_video(self, source_video: str, captions_enabled: bool = True, style: str = "Starboy"):
        """Factory Logic: Assembly and Visual Overlays."""
        vox_logger.info(f"[Factory] Rendering with Style: {style} (Captions: {captions_enabled})")
        
        output_path = source_video
        
        # 1. Viral Captions
        if captions_enabled:
            try:
                output_path = core_editor.apply_viral_captions(output_path, style=style)
            except Exception as e:
                vox_logger.error(f"[Factory] Captioning failed: {e}")
                # Non-blocking failure
        
        # 2. Final Touches (Branding)
        try:
            output_path = core_editor.apply_watermark(output_path)
        except Exception as e:
            vox_logger.error(f"[Factory] Branding failed: {e}")

        return output_path

    def assemble_final(self, video_path: str, audio_path: str = None):
        """Merges audio and video streams."""
        vox_logger.info("[Factory] Final Merging...")
        return video_path # Placeholder for demo

video_factory = VideoFactory()
