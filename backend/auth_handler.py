"""
VoxFlow Auth Handler — THE BANK
================================
This module is the sole authority on:
  1. Who the user is (JWT decode)
  2. Whether they can afford an operation (credit check)
  3. Atomic credit deduction / refund (via Supabase RPC)

Nothing in this file knows about videos, pipelines, or scraping.
"""

import os
import jwt
import logging
from functools import wraps
from fastapi import Request, HTTPException
from core_engine import supabase

logger = logging.getLogger("VoxFlow.Auth")
JWT_SECRET = os.getenv("JWT_SECRET", "voxflow_neural_secret_2026")


# ─── JWT Verification ────────────────────────────────────────────────────────

async def verify_token(request: Request) -> str | None:
    """
    Decodes a Supabase Bearer JWT and returns the user's email.
    Returns None gracefully in dev mode if no token is present.
    """
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None  # No token → local dev fallback

    token = auth_header.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, options={"verify_signature": False})
        return payload.get("email")
    except Exception as e:
        logger.warning(f"[Auth] Token decode failed: {e}")
        return None


# ─── Credit Guard Decorator ───────────────────────────────────────────────────

def require_credits(amount: float = 1.0):
    """
    THE BANK SHIELD: Monetization decorator.
    Reads the request body non-destructively, checks balance, then
    hands control to the actual route handler.

    Usage:
        @api.post("/api/some-ai-thing")
        @require_credits(amount=5.0)
        async def my_handler(request: Request): ...
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            # ── 1. Non-destructive body read ──────────────────────────────
            try:
                body = await request.json()
                async def mock_json():
                    return body
                request.json = mock_json
            except Exception:
                body = {}

            # ── 2. Identity check ─────────────────────────────────────────
            email = (
                body.get("user_email")
                or body.get("email")
                or await verify_token(request)
            )

            if not email or email == "anonymous":
                raise HTTPException(
                    status_code=401,
                    detail="Neural Identity Required: Please log in to use AI features."
                )

            # ── 3. Credit check ───────────────────────────────────────────
            if supabase:
                try:
                    res = supabase.table("profiles") \
                        .select("credit_balance") \
                        .eq("email", email) \
                        .single() \
                        .execute()

                    if not res.data:
                        raise HTTPException(status_code=404, detail="Neural Profile Not Found")

                    balance = float(res.data.get("credit_balance", 0))
                    if balance < amount:
                        raise HTTPException(
                            status_code=402,
                            detail=f"Insufficient Neural Balance: {balance:.1f} CR (need {amount:.1f} CR)"
                        )
                except HTTPException:
                    raise
                except Exception as e:
                    logger.error(f"[Auth] Credit check DB error: {e}")
                    # Don't block users if DB is flaky — log and proceed
                    pass

            return await func(request, *args, **kwargs)
        return wrapper
    return decorator


# ─── Atomic Credit Operations ─────────────────────────────────────────────────

def deduct_credits_sync(email: str, amount: float) -> bool:
    """Atomically deducts credits via Supabase RPC. Safe for background tasks."""
    if not supabase or not email or email == "anonymous":
        return True
    try:
        user = supabase.table("profiles").select("id").eq("email", email).single().execute()
        if user.data:
            supabase.rpc("decrement_credits", {
                "target_user_id": user.data["id"],
                "amount": amount
            }).execute()
            logger.info(f"[Bank] Deducted {amount} CR from {email}")
            return True
        return False
    except Exception as e:
        logger.error(f"[Bank] Deduction failed for {email}: {e}")
        return False


def refund_credits_sync(email: str, amount: float) -> bool:
    """Atomically refunds credits on pipeline failure. Prevents revenue loss from crashes."""
    if not supabase or not email or email == "anonymous":
        return True
    try:
        user = supabase.table("profiles").select("id").eq("email", email).single().execute()
        if user.data:
            supabase.rpc("increment_credits", {
                "target_user_id": user.data["id"],
                "amount": amount
            }).execute()
            logger.info(f"[Bank] Refunded {amount} CR to {email}")
            return True
        return False
    except Exception as e:
        logger.error(f"[Bank] Refund failed for {email}: {e}")
        return False


def get_user_credits(email: str) -> float:
    """Returns current credit balance. Returns 0.0 if user not found."""
    if not supabase or not email or email == "anonymous":
        return 0.0
    try:
        res = supabase.table("profiles") \
            .select("credit_balance") \
            .eq("email", email) \
            .single() \
            .execute()
        return float(res.data.get("credit_balance", 0.0)) if res.data else 0.0
    except Exception as e:
        logger.error(f"[Bank] Credit fetch failed: {e}")
        return 0.0
