from fastapi import APIRouter, Request, HTTPException
from credits_mgr import get_balance, deduct_credits, refund_credits
from core_engine import supabase, logger
import datetime

router = APIRouter(prefix="/api/credits", tags=["Credits"])

@router.get("/balance")
async def fetch_balance(email: str):
    return {"email": email, "credits": get_balance(email)}

@router.post("/daily-bonus")
async def claim_bonus(request: Request):
    data = await request.json()
    email = data.get("email")
    if not email: raise HTTPException(status_code=400, detail="Email required")
    
    try:
        user = supabase.table("profiles").select("last_login_bonus", "credit_balance").eq("email", email).single().execute()
        if user.data:
            last_bonus = user.data.get("last_login_bonus")
            now = datetime.datetime.utcnow()
            
            if not last_bonus or (now - datetime.datetime.fromisoformat(last_bonus)).days >= 1:
                new_balance = float(user.data["credit_balance"]) + 2.0
                supabase.table("profiles").update({
                    "credit_balance": new_balance,
                    "last_login_bonus": now.isoformat()
                }).eq("email", email).execute()
                return {"status": "success", "message": "Daily Bonus +2 Credits Granted!", "new_balance": new_balance}
            
            return {"status": "error", "message": "Bonus already claimed for today."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/approve-payment")
async def approve_payment(request: Request):
    # Admin logic moved here
    data = await request.json()
    t_id = data.get("transactionId")
    email = data.get("userEmail")
    amount = data.get("amount")
    
    credits_to_add = amount / 10.0
    try:
        supabase.table("transactions").update({"status": "Approved"}).eq("id", t_id).execute()
        user_res = supabase.table("profiles").select("id", "credit_balance").eq("email", email).single().execute()
        if user_res.data:
            new_balance = float(user_res.data["credit_balance"]) + credits_to_add
            supabase.table("profiles").update({"credit_balance": new_balance}).eq("id", user_res.data["id"]).execute()
        return {"status": "success", "message": f"Injected {credits_to_add} Credits"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
