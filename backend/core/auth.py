"""
VoxFlow Neural Chamber: AUTH & CREDITS
=======================================
Sole authority for user identity and credit management.
"""

import os
import jwt
from functools import wraps
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core_engine import supabase
from utils.logger import vox_logger

security = HTTPBearer()

def verify_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, options={"verify_signature": False})
        return payload.get("email")
    except Exception:
        return None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    FastAPI Dependency to get the current user's neural identity.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(token, options={"verify_signature": False})
        email = payload.get("email")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid Neural Identity")
        return {"email": email}
    except Exception:
        raise HTTPException(status_code=401, detail="Neural Handshake Failed")

def require_credits(amount: float = 1.0):
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            try:
                body = await request.json()
                async def mock_json(): return body
                request.json = mock_json
            except:
                body = {}
            
            email = body.get("user_email") or body.get("email") or await verify_token(request)
            if not email or email == "anonymous":
                raise HTTPException(status_code=401, detail="Neural Identity Required")

            if supabase:
                res = supabase.table("profiles").select("credit_balance").eq("email", email).single().execute()
                if not res.data:
                    raise HTTPException(status_code=404, detail="Neural Profile Not Found")
                
                balance = float(res.data.get("credit_balance", 0))
                if balance < amount:
                    raise HTTPException(status_code=402, detail=f"Insufficient Balance: {balance} CR")
            
            return await func(request, *args, **kwargs)
        return wrapper
    return decorator

def deduct_credits_sync(email: str, amount: float):
    if not supabase or not email or email == "anonymous": return
    try:
        user = supabase.table("profiles").select("id").eq("email", email).single().execute()
        if user.data:
            supabase.rpc("decrement_credits", {"target_user_id": user.data["id"], "amount": amount}).execute()
            vox_logger.info(f"[Bank] Deducted {amount} from {email}")
    except Exception as e:
        vox_logger.error(f"[Bank] Deduction failed: {e}")

def refund_credits_sync(email: str, amount: float):
    if not supabase or not email or email == "anonymous": return
    try:
        user = supabase.table("profiles").select("id").eq("email", email).single().execute()
        if user.data:
            supabase.rpc("increment_credits", {"target_user_id": user.data["id"], "amount": amount}).execute()
            vox_logger.info(f"[Bank] Refunded {amount} to {email}")
    except Exception as e:
        vox_logger.error(f"[Bank] Refund failed: {e}")
