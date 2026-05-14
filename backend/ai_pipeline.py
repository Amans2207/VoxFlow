"""
VoxFlow AI Pipeline — THE BRAIN
================================
Handles Neural Scripting, Voice Synthesis, and Language Translation.
"""

import os
import asyncio
from openai import OpenAI
from elevenlabs.client import ElevenLabs
from utils.eleven_manager import eleven_manager
from core_engine import logger

class AIPipeline:
    def __init__(self):
        self.openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.el_client = None
    
    def _get_el_client(self):
        key = eleven_manager.get_active_key()
        if key:
            return ElevenLabs(api_key=key)
        return None

    async def generate_script(self, prompt: str, duration: int = 15) -> str:
        """Neural Scripting: GPT-4o optimized for viral retention."""
        try:
            res = self.openai.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": f"Write a {duration}-second viral script about: {prompt}. High energy, hook-first."}]
            )
            return res.choices[0].message.content
        except Exception as e:
            logger.error(f"[AI Pipeline] Scripting Failed: {e}")
            return f"This is a fallback script for: {prompt}"

    async def synthesize_voice(self, text: str, voice_id: str = "Starboy") -> str:
        """Neural Voice: ElevenLabs synthesis."""
        client = self._get_el_client()
        if not client: return ""
        
        output_path = f"exports/voice_{os.urandom(4).hex()}.mp3"
        try:
            audio_gen = client.text_to_speech.convert(
                text=text,
                voice_id=voice_id,
                model_id="eleven_multilingual_v2"
            )
            with open(output_path, "wb") as f:
                for chunk in audio_gen:
                    if chunk: f.write(chunk)
            return output_path
        except Exception as e:
            logger.error(f"[AI Pipeline] Voice Synthesis Failed: {e}")
            return ""

# Singleton instance
ai_pipeline = AIPipeline()
