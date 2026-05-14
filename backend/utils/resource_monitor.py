import psutil
import logging
import functools
import time
from fastapi import HTTPException

logger = logging.getLogger("VoxFlow.Resilience")

class ResourceMonitor:
    @staticmethod
    def check_availability(min_ram_mb: int = 500, max_cpu_percent: int = 90):
        """
        Validates system resources before accepting high-intensity tasks.
        """
        ram = psutil.virtual_memory()
        cpu = psutil.cpu_percent(interval=0.1)
        
        available_ram_mb = ram.available / (1024 * 1024)
        
        if cpu > max_cpu_percent:
            logger.warning(f"High CPU usage detected: {cpu}%. Queuing task...")
            return False, f"Neural CPU at capacity ({cpu}%). Task queued."
            
        if available_ram_mb < min_ram_mb:
            logger.warning(f"Low RAM detected: {available_ram_mb}MB. Queuing task...")
            return False, f"Neural RAM exhausted ({available_ram_mb:.0f}MB free). Task queued."
            
        return True, "Resources Optimal."

def retry_neural_call(retries: int = 3, delay: float = 1.0, backoff: float = 2.0):
    """
    Exponential Backoff Decorator for AI API calls.
    Ensures temporary glitches don't break the user's workflow.
    """
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            m_retries, m_delay = retries, delay
            while m_retries > 1:
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    logger.error(f"Neural Bridge Glitch: {str(e)}. Retrying in {m_delay}s...")
                    time.sleep(m_delay)
                    m_retries -= 1
                    m_delay *= backoff
            return await func(*args, **kwargs)
        return wrapper
    return decorator
