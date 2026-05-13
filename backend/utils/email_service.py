import os
from resend import Resend

def send_completion_email(to_email, job_id, video_url):
    """
    Neural Link: Email Dispatcher
    Uses Resend API to notify user when their render is complete.
    """
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        print("[Email Service] RESEND_API_KEY missing. Skipping email.")
        return

    try:
        resend = Resend(api_key)
        
        params = {
            "from": "VoxFlow AI <notifications@voxflow.ai>",
            "to": [to_email],
            "subject": f"Neural Render Complete: {job_id}",
            "html": f"""
                <div style="background: #000; color: #fff; padding: 40px; font-family: sans-serif; border-radius: 20px;">
                    <h1 style="color: #CCFF00; letter-spacing: -1px;">VOXFLOW AI</h1>
                    <p style="font-size: 18px;">Your neural video orchestration is complete.</p>
                    <div style="background: #111; padding: 20px; border-radius: 12px; margin: 20px 0;">
                        <p style="color: #666; font-size: 12px;">JOB ID: {job_id}</p>
                        <a href="{video_url}" style="background: #CCFF00; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">Download Video</a>
                    </div>
                    <p style="color: #444; font-size: 10px;">Titan-X Neural Engine v4.2</p>
                </div>
            """
        }
        
        resend.Emails.send(params)
        print(f"[Email Service] Success notification sent to {to_email}")
    except Exception as e:
        print(f"[Email Service] Failed to send email: {e}")
