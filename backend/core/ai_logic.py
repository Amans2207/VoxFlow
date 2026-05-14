"""
VoxFlow Neural Chamber: THE SOUL (AI Logic)
===========================================
Handles high-level content generation: Scripts, Voices, and Translations.
"""

import os
from openai import OpenAI
from elevenlabs.client import ElevenLabs
from utils.logger import vox_logger
from utils.eleven_manager import eleven_manager

class NeuralSoul:
    def __init__(self):
        self.openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    async def generate_content(self, prompt: str, language: str = "en-US"):
        """Script + Voice Logic orchestration."""
        vox_logger.info(f"[Soul] Breathing life into prompt: {prompt[:40]}...")
        
        # 1. Scripting
        script = await self._write_script(prompt)
        
        # 2. Translation (If needed)
        if language != "en-US":
            script = await self._translate_script(script, language)
            
        return script

    async def _write_script(self, prompt: str):
        try:
            res = self.openai.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": f"Write a viral video script about: {prompt}"}]
            )
            return res.choices[0].message.content
        except Exception as e:
            vox_logger.error(f"[Soul] Scripting failure: {e}")
            return f"Neural fallback script for: {prompt}"

    async def _translate_script(self, text: str, target_lang: str):
        # Placeholder for translation logic
        return text

    async def synthesize_voice(self, text: str, voice_id: str):
        vox_logger.info(f"[Soul] Synthesizing Voice: {voice_id}")
        try:
            key = eleven_manager.get_active_key()
            if not key: return None
            
            client = ElevenLabs(api_key=key)
            audio_gen = client.text_to_speech.convert(
                text=text,
                voice_id=voice_id,
                model_id="eleven_multilingual_v2"
            )
            
            output_path = f"exports/voice_{os.urandom(4).hex()}.mp3"
            with open(output_path, "wb") as f:
                for chunk in audio_gen:
                    if chunk: f.write(chunk)
            return output_path
        except Exception as e:
            vox_logger.error(f"[Soul] Voice synthesis failed: {e}")
            return None

neural_soul = NeuralSoul()
