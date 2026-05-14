import os
import requests
from moviepy.editor import AudioFileClip, VideoFileClip, CompositeAudioClip

PEXELS_API_KEY = os.getenv("PEXELS_API_KEY", "YOUR_PEXELS_KEY")

class StockAssetManager:
    def search_b_roll(self, query, per_page=5):
        """
        Fetches 4K B-roll clips from Pexels based on script keywords.
        """
        url = f"https://api.pexels.com/videos/search?query={query}&per_page={per_page}"
        headers = {"Authorization": PEXELS_API_KEY}
        try:
            response = requests.get(url, headers=headers)
            data = response.json()
            return [
                {
                    "id": v["id"],
                    "thumb": v["image"],
                    "video": v["video_files"][0]["link"],
                    "duration": v["duration"]
                } for v in data.get("videos", [])
            ]
        except Exception as e:
            print(f"[Stock Engine] Error: {str(e)}")
            return []

class NeuralSoundboard:
    def __init__(self):
        # Paths to core SFX assets (ensure these exist in backend/assets/sfx/)
        self.sfx_paths = {
            "whoosh": "assets/sfx/whoosh.mp3",
            "pop": "assets/sfx/pop.mp3",
            "cash": "assets/sfx/cash.mp3",
            "click": "assets/sfx/click.mp3"
        }

    def auto_place_sfx(self, video_clip, transition_points):
        """
        Automatically overlays SFX at specific timestamps.
        """
        audio_layers = [video_clip.audio]
        
        for point in transition_points:
            # Add a 'Whoosh' at every transition
            if os.path.exists(self.sfx_paths["whoosh"]):
                sfx = AudioFileClip(self.sfx_paths["whoosh"]).set_start(point)
                audio_layers.append(sfx)
        
        return CompositeAudioClip(audio_layers)

def calculate_viral_score(hook_quality, caption_density, music_energy):
    """
    Proprietary algorithm to predict viral success.
    hook_quality: 0-100 (Based on first 3s metrics)
    caption_density: 0-100 (Words per second)
    music_energy: 0-100 (BPM/Spectral analysis)
    """
    score = (hook_quality * 0.5) + (caption_density * 0.3) + (music_energy * 0.2)
    return round(score, 1)

# Instances
stock_manager = StockAssetManager()
neural_sfx = NeuralSoundboard()
