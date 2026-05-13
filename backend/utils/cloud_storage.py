import os
import cloudinary
import cloudinary.uploader

def upload_to_cloud(file_path, public_id=None):
    """
    Neural Storage: Uploads generated assets to Cloudinary.
    Ensures persistent access beyond local container limits.
    """
    cloud_name = os.environ.get("CLOUDINARY_CLOUD_NAME")
    api_key = os.environ.get("CLOUDINARY_API_KEY")
    api_secret = os.environ.get("CLOUDINARY_API_SECRET")

    if not all([cloud_name, api_key, api_secret]):
        print("[Cloud Storage] Credentials Missing. Falling back to local URL.")
        return None

    try:
        cloudinary.config(
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret
        )
        
        response = cloudinary.uploader.upload(
            file_path,
            resource_type="video" if file_path.endswith('.mp4') else "auto",
            public_id=public_id,
            folder="voxflow_productions"
        )
        
        print(f"[Cloud Storage] Upload Success: {response['secure_url']}")
        return response['secure_url']
    except Exception as e:
        print(f"[Cloud Storage] Upload Failed: {e}")
        return None
