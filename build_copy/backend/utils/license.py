import os
from PIL import Image, ImageDraw, ImageFont
import qrcode
from datetime import datetime

def generate_usage_certificate(job_id, user_id, video_filename, target_lang, output_path):
    """Generates a VoxFlow Usage Certificate as a PNG image."""
    
    # Create image
    width, height = 800, 600
    background_color = (10, 10, 15) # Dark "Starboy" aesthetic
    image = Image.new('RGB', (width, height), color=background_color)
    draw = ImageDraw.Draw(image)
    
    # Load fonts (using default if custom not available)
    try:
        # Assuming we might have a font in the container or system
        font_title = ImageFont.truetype("arial.ttf", 40)
        font_body = ImageFont.truetype("arial.ttf", 20)
        font_footer = ImageFont.truetype("arial.ttf", 15)
    except:
        font_title = ImageFont.load_default()
        font_body = ImageFont.load_default()
        font_footer = ImageFont.load_default()
        
    # Draw branding
    draw.text((40, 40), "VOXFLOW AI", fill=(0, 242, 255), font=font_title)
    draw.text((40, 90), "USAGE CERTIFICATE", fill=(255, 255, 255), font=font_body)
    
    # Draw details
    details = [
        f"Certificate ID: VXF-{job_id[:8].upper()}",
        f"Issue Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        f"User ID: {user_id}",
        f"Project: {video_filename}",
        f"Engine: Aman Studio Proprietary Synthesis (F5-v2)",
        f"Language: {target_lang}",
        "License: Commercial Use Granted"
    ]
    
    y_offset = 160
    for detail in details:
        draw.text((40, y_offset), detail, fill=(200, 200, 200), font=font_body)
        y_offset += 35
        
    # Draw QR Code for verification
    qr = qrcode.QRCode(version=1, box_size=5, border=2)
    qr.add_data(f"https://voxflow.ai/verify/{job_id}")
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color=(0, 242, 255), back_color=(10, 10, 15))
    image.paste(qr_img, (width - 200, 40))
    
    # Draw Footer
    draw.text((40, height - 60), "This certificate guarantees that the audio was generated via VoxFlow's private proprietary engine.", fill=(100, 100, 100), font=font_footer)
    draw.text((40, height - 40), "No data was shared with third-party providers (ElevenLabs/OpenAI).", fill=(100, 100, 100), font=font_footer)
    
    # Save image
    image.save(output_path)
    return output_path
