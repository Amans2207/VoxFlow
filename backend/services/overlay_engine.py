import os
from moviepy.editor import VideoFileClip, ImageClip, TextClip, CompositeVideoClip

def apply_studio_overlays(video_path, logo_path=None, captions=None, output_format='9:16'):
    """
    Neural Overlay Engine: Branding & Captions
    Applies logo watermarks and dynamic text overlays to the final render.
    """
    try:
        print(f"[Overlay Engine] Hardening Render: {video_path}")
        video = VideoFileClip(video_path)
        
        # 1. Format Resizing (9:16 or 16:9)
        if output_format == '9:16':
            # Instagram/TikTok Style
            video = video.resize(height=1920)
            video = video.crop(x1=video.w/2 - 540, y1=0, x2=video.w/2 + 540, y2=1920)
        else:
            # YouTube/Widescreen Style
            video = video.resize(width=1920)

        clips = [video]

        # 2. Logo Watermark
        if logo_path and os.path.exists(logo_path):
            logo = (ImageClip(logo_path)
                    .set_duration(video.duration)
                    .resize(height=100) # Professional scale
                    .margin(right=40, top=40, opacity=0)
                    .set_pos(("right", "top")))
            clips.append(logo)

        # 3. Dynamic Captions (Alex Hormozi Style Simulation)
        if captions:
            # Simple caption centered at the bottom
            # In production, this would be a loop through timestamped subtitles
            txt_clip = (TextClip(captions, fontsize=70, color='yellow', font='Arial-Bold', stroke_color='black', stroke_width=2)
                        .set_pos(('center', 1400))
                        .set_duration(video.duration))
            clips.append(txt_clip)

        final_video = CompositeVideoClip(clips)
        temp_output = video_path.replace(".mp4", "_overlay.mp4")
        final_video.write_videofile(temp_output, codec="libx264", audio_codec="aac")
        
        # Replace original with overlay version
        os.remove(video_path)
        os.rename(temp_output, video_path)
        
        print(f"[Overlay Engine] Overlay Applied Successfully.")
        return True
    except Exception as e:
        print(f"[Overlay Engine] Failed to apply overlays: {e}")
        return False
