"""
VoxFlow Credits Manager — THE WALLET
====================================
Isolated authority for credit transactions, ledger, and monetization status.
"""

import logging
from datetime import datetime
from core_engine import supabase, logger

def get_balance(email: str) -> float:
    if not supabase or email == "anonymous":
        return 0.0
    try:
        res = supabase.table("profiles").select("credit_balance").eq("email", email).single().execute()
        return float(res.data.get("credit_balance", 0.0)) if res.data else 0.0
    except Exception as e:
        logger.error(f"[Credits] Fetch failed for {email}: {e}")
        return 0.0

def deduct_credits(email: str, amount: float) -> bool:
    """Atomic deduction via Supabase RPC."""
    if not supabase or not email or email == "anonymous":
        return True
    try:
        user = supabase.table("profiles").select("id").eq("email", email).single().execute()
        if user.data:
            supabase.rpc("decrement_credits", {
                "target_user_id": user.data["id"],
                "amount": amount
            }).execute()
            logger.info(f"[Credits] Deducted {amount} from {email}")
            return True
        return False
    except Exception as e:
        logger.error(f"[Credits] Deduction failed: {e}")
        return False

def refund_credits(email: str, amount: float) -> bool:
    """Atomic refund on failure."""
    if not supabase or not email or email == "anonymous":
        return True
    try:
        user = supabase.table("profiles").select("id").eq("email", email).single().execute()
        if user.data:
            supabase.rpc("increment_credits", {
                "target_user_id": user.data["id"],
                "amount": amount
            }).execute()
            logger.info(f"[Credits] Refunded {amount} to {email}")
            return True
        return False
    except Exception as e:
        logger.error(f"[Credits] Refund failed: {e}")
        return False

def check_has_fuel(email: str, required: float) -> bool:
    return get_balance(email) >= required
