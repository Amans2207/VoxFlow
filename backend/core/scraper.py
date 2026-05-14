"""
VoxFlow Neural Chamber: TITAN-X SCRAPER
========================================
Independent web context and trend scouting engine.
"""

import asyncio
from scraper import scraper as legacy_scraper
from utils.logger import vox_logger

class NeuralScout:
    async def fetch_trending_context(self, prompt: str):
        vox_logger.info(f"[Scout] Fetching context for: {prompt[:30]}...")
        try:
            # Reuses the robust logic from scraper.py
            return await legacy_scraper.fetch_context(prompt)
        except Exception as e:
            vox_logger.warning(f"[Scout] Context fetch failed: {e}. Proceeding without trends.")
            return {"enriched_prompt": prompt}

neural_scout = NeuralScout()
