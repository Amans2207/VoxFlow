"""
VoxFlow Scraper — THE SCOUT
============================
Handles all external web scraping and context fetching.
Uses Playwright for deep scraping, with a fast RSS/JSON fallback.

This module has NO knowledge of the user, credits, or video pipeline.
It simply takes a topic and returns rich context data.
"""

import asyncio
import json
import logging
import os
import random
import time

logger = logging.getLogger("VoxFlow.Scraper")

TRENDS_FILE = os.path.join(os.path.dirname(__file__), "data", "trending_blueprints.json")

# Keyword triggers that activate context scraping
CONTEXT_TRIGGERS = [
    "trend", "latest", "news", "viral", "today",
    "2024", "2025", "2026", "current", "hot"
]


class NeuralScraper:
    """
    THE SCOUT: Fetches real-time context from the web.
    V1 uses a mock/local data store; V2 will use Playwright + TikTok Creative Center.
    """

    def __init__(self):
        os.makedirs(os.path.dirname(TRENDS_FILE), exist_ok=True)
        self._blueprints = [
            {"title": "AI Revolution 2026", "style": "Starboy", "score": 98, "vibe": "Hype", "category": "Tech"},
            {"title": "Crypto Comeback", "style": "Hormozi", "score": 95, "vibe": "Hype", "category": "Finance"},
            {"title": "Mental Health Daily", "style": "Minimalist", "score": 92, "vibe": "Emotional", "category": "Wellness"},
            {"title": "Velocity Edit v3", "style": "Hormozi", "score": 91, "vibe": "Action", "category": "Lifestyle"},
            {"title": "Cinematic Storyteller", "style": "Minimalist", "score": 89, "vibe": "Emotional", "category": "Vlogs"},
        ]

    def needs_context(self, prompt: str) -> bool:
        """Returns True if the prompt should trigger web context fetching."""
        prompt_lower = prompt.lower()
        return any(trigger in prompt_lower for trigger in CONTEXT_TRIGGERS)

    async def fetch_context(self, prompt: str) -> dict:
        """
        Fetches relevant real-time context for a given prompt.
        Returns a structured dict with summary and suggested style.
        """
        logger.info(f"[Scout] Fetching context for: {prompt[:60]}...")

        # V1: Fast local data (simulates web scraping result)
        await asyncio.sleep(0.5)  # Simulate network latency

        # Find best matching trend
        best_match = None
        for bp in self._blueprints:
            if any(kw in prompt.lower() for kw in bp["category"].lower().split()):
                best_match = bp
                break

        if not best_match:
            best_match = max(self._blueprints, key=lambda x: x["score"])

        context = {
            "summary": f"Top trend detected: '{best_match['title']}' is viral with a score of {best_match['score']}/100.",
            "suggested_style": best_match["style"],
            "vibe": best_match["vibe"],
            "category": best_match["category"],
            "enriched_prompt": f"{prompt} (Neural Context: {best_match['title']} is trending in {best_match['category']}.)"
        }

        logger.info(f"[Scout] Context ready — Style: {context['suggested_style']}, Vibe: {context['vibe']}")
        return context

    def get_trending_blueprints(self) -> list:
        """Returns the current trending blueprint list."""
        # Simulate live score fluctuation
        for bp in self._blueprints:
            bp["score"] = random.randint(85, 99)
        try:
            with open(TRENDS_FILE, "w") as f:
                json.dump(self._blueprints, f)
        except Exception:
            pass
        return self._blueprints

    async def run_playwright_scrape(self, url: str) -> str:
        """
        V2 Playwright scraper. Requires `playwright install chromium`.
        Currently returns a placeholder — activate in production.
        """
        try:
            from playwright.async_api import async_playwright
            logger.info(f"[Scout] Playwright scraping: {url}")
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                page = await browser.new_page()
                await page.goto(url, wait_until="domcontentloaded", timeout=10000)
                content = await page.inner_text("body")
                await browser.close()
                return content[:2000]  # Return first 2000 chars
        except Exception as e:
            logger.warning(f"[Scout] Playwright scrape failed: {e}")
            return ""


# Singleton instance
scraper = NeuralScraper()


def start_trend_worker():
    """Starts the background trend refresh thread."""
    import threading

    def _worker():
        while True:
            try:
                scraper.get_trending_blueprints()
                logger.info("[Scout] Trend blueprints refreshed.")
            except Exception as e:
                logger.error(f"[Scout] Trend worker error: {e}")
            time.sleep(6 * 3600)  # Refresh every 6 hours

    t = threading.Thread(target=_worker, daemon=True)
    t.start()
    logger.info("[Scout] Trend worker thread started.")
