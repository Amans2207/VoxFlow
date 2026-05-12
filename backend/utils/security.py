import os
from cryptography.fernet import Fernet
from dotenv import load_dotenv

load_dotenv()

# In production, this key should be managed securely
ENCRYPTION_KEY = os.environ.get("VOICE_ENCRYPTION_KEY")
if not ENCRYPTION_KEY:
    # Fallback for dev, but warning should be logged
    ENCRYPTION_KEY = Fernet.generate_key().decode()
    print("WARNING: VOICE_ENCRYPTION_KEY not set. Generating temporary key.")

cipher_suite = Fernet(ENCRYPTION_KEY.encode())

def encrypt_data(data: bytes) -> bytes:
    """Encrypts vocal data."""
    return cipher_suite.encrypt(data)

def decrypt_data(data: bytes) -> bytes:
    """Decrypts vocal data."""
    return cipher_suite.decrypt(data)

def save_encrypted_voice(voice_data: bytes, file_path: str):
    """Encrypts and saves voice data to a file."""
    encrypted = encrypt_data(voice_data)
    with open(file_path, "wb") as f:
        f.write(encrypted)

def load_decrypted_voice(file_path: str) -> bytes:
    """Loads and decrypts voice data from a file."""
    with open(file_path, "rb") as f:
        encrypted = f.read()
    return decrypt_data(encrypted)

def token_required(f):
    """Placeholder for token authentication."""
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated
