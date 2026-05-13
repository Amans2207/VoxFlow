import os
from dotenv import load_dotenv

load_dotenv()

class ElevenLabsManager:
    def __init__(self):
        # Load all keys from environment
        raw_keys = os.getenv("ELEVEN_API_KEY", "")
        self.keys = [k.strip() for k in raw_keys.split(",") if k.strip()]
        self.current_index = 0
        
        if not self.keys:
            print("Neural Core: [WARNING] No ElevenLabs API keys found in .env!")

    def get_active_key(self):
        """Returns the currently active API key."""
        if not self.keys:
            return None
        return self.keys[self.current_index]

    def rotate_key(self):
        """Switches to the next available API key in the pool."""
        if not self.keys or len(self.keys) <= 1:
            print("Neural Core: [CRITICAL] No more ElevenLabs keys to rotate to.")
            return False
            
        self.current_index = (self.current_index + 1) % len(self.keys)
        print(f"Neural Core: [ROTATION] Switched to ElevenLabs API Key #{self.current_index + 1} (Suffix: ...{self.keys[self.current_index][-4:]})")
        return True

    def get_all_keys(self):
        return self.keys

# Global instance
eleven_manager = ElevenLabsManager()
