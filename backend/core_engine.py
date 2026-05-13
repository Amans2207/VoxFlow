import os
import logging
import socketio
from supabase import create_client, Client
from slowapi import Limiter
from slowapi.util import get_remote_address
from editor import VideoEditor
from vision_engine import VisionEngine

# --- NEURAL CORE ENGINES ---

# Initialize Logging
logger = logging.getLogger("VoxFlow.Core")

# Supabase Vault
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = None

if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("Core Engine: Supabase Vault Linked")
    except Exception as e:
        logger.error(f"Core Engine: Supabase Connection Failed - {e}")

# Rate Limiter
REDIS_URL = os.environ.get("REDIS_URL", "memory://")
limiter = Limiter(key_func=get_remote_address, storage_uri=REDIS_URL)

# Socket.io Neural Bridge
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

# Shared Instances
editor = VideoEditor()
vision_engine = VisionEngine()

# Connection Manager for WebSockets
class ConnectionManager:
    def __init__(self):
        self.active_connections = []
    async def connect(self, websocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    def disconnect(self, websocket):
        self.active_connections.remove(websocket)
    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()
