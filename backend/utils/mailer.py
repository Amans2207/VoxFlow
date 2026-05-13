import os
import resend

class Mailer:
    def __init__(self):
        self.api_key = os.environ.get("RESEND_API_KEY")
        if self.api_key:
            resend.api_key = self.api_key
        else:
            print("WARNING: RESEND_API_KEY not found in environment. Emails will not be sent.")

    def send_success_email(self, to_email, project_id, download_url):
        if not self.api_key:
            return False
            
        try:
            params = {
                "from": "VoxFlow AI <no-reply@voxflow.in>",
                "to": [to_email],
                "subject": f"Your Video is Ready! (Project: {project_id})",
                "html": f"""
                <div style="font-family: 'Inter', sans-serif; background-color: #000; color: #fff; padding: 40px; border-radius: 12px; border: 1px solid #333;">
                    <h1 style="color: #fff; font-size: 24px; margin-bottom: 20px;">VoxFlow Neural Core</h1>
                    <p style="color: #ccc; font-size: 16px; line-height: 1.6;">
                        Bhai, your video synthesis is complete! Your project <strong>{project_id}</strong> is now ready for export.
                    </p>
                    <div style="margin-top: 30px; text-align: center;">
                        <a href="{download_url}" style="background: linear-gradient(90deg, #00f2ff, #0066ff); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                            Download Video
                        </a>
                    </div>
                    <p style="color: #666; font-size: 12px; margin-top: 40px; border-top: 1px solid #222; padding-top: 20px;">
                        Sent via VoxFlow Starboy Engine. If you didn't request this, ignore it.
                    </p>
                </div>
                """
            }
            resend.Emails.send(params)
            print(f"[Email] Success email sent to {to_email}")
            return True
        except Exception as e:
            print(f"[Email] Error sending email: {e}")
            return False

# Singleton instance
mailer = Mailer()
