import os
import psutil
import logging

logger = logging.getLogger("VoxFlow.PortManager")

def kill_port(port: int):
    """
    Automatically identifies and terminates any process holding the target port.
    Prevents the dreaded [WinError 10048] on Windows.
    """
    logger.info(f"Checking port {port}...")
    for proc in psutil.process_iter(['pid', 'name']):
        try:
            for conn in proc.connections(kind='inet'):
                if conn.laddr.port == port and proc.pid != os.getpid():
                    logger.warning(f"Port {port} held by {proc.name()} (PID: {proc.pid}). Terminating...")
                    proc.terminate()
                    proc.wait(timeout=3)
                    logger.info(f"Port {port} liberated.")
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.Error):
            pass
