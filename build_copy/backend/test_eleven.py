import os
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs

load_dotenv()

def test_elevenlabs():
    api_key = os.getenv("ELEVEN_API_KEY")
    client = ElevenLabs(api_key=api_key)
    
    try:
        print("Fetching available voices...")
        voices = client.voices.get_all()
        if voices.voices:
            first_voice = voices.voices[0]
            print(f"Found voice: {first_voice.name} (ID: {first_voice.voice_id})")
            
            print(f"Testing TTS with {first_voice.name}...")
            audio_gen = client.text_to_speech.convert(
                text="VoxFlow ElevenLabs Integration Successful.",
                voice_id=first_voice.voice_id,
                model_id="eleven_multilingual_v2"
            )
            print("✅ Success!")
        else:
            print("No voices found.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_elevenlabs()
