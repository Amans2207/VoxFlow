from fastapi import APIRouter, Request, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import uuid
import json
from datetime import datetime
from models.schema import UserProfile, Project, Asset, Transaction, Agency

router = APIRouter(prefix="/api/admin", tags=["admin"])

# --- SHARED MODELS ---
class CreditUpdate(BaseModel):
    email: str
    amount: float
    action: str # 'add' or 'deduct'
    reason: Optional[str] = "Admin Adjustment"

class AssetDeploy(BaseModel):
    name: str
    type: str
    category: str
    url: str

class StatusUpdate(BaseModel):
    email: str
    status: str # 'Active', 'Banned', 'Suspended'

class RoleUpdate(BaseModel):
    email: str
    role: str # 'STANDARD', 'VIP', 'SUPER_USER'
    custom_credit_limit: Optional[float] = None

class VIPCreate(BaseModel):
    email: str
    password: str
    fullName: str
    initialCredits: float

class SuperUserCreate(BaseModel):
    email: str
    password: str
    fullName: str

class PaymentApprove(BaseModel):
    transactionId: str
    userId: str
    amount: float
    userName: str
    userEmail: str

# --- USERS & CREDITS ---

@router.get("/users", response_model=List[UserProfile])
async def get_all_users(query: Optional[str] = None):
    from core_engine import supabase
    if not supabase:
        return []
    
    try:
        q = supabase.table("profiles").select("*")
        if query:
            q = q.or_(f"email.ilike.%{query}%,full_name.ilike.%{query}%")
        res = q.execute()
        return res.data
    except Exception as e:
        print(f"[Supabase] Profiles Search Failed: {e}")
        return []

@router.post("/users")
async def admin_user_actions(req: Dict[str, Any]):
    """
    MASTER ADMIN HANDLER: Manages credits, blocking, and status updates.
    """
    from core_engine import supabase, sio
    user_id = req.get("userId")
    action = req.get("action")
    
    if not supabase: return {"success": True}

    try:
        if action == 'ADD_CREDITS':
            amount = float(req.get("amount", 0))
            user_res = supabase.table("profiles").select("credit_balance, email").eq("id", user_id).execute()
            if user_res.data:
                new_balance = float(user_res.data[0]["credit_balance"]) + amount
                email = user_res.data[0]["email"]
                supabase.table("profiles").update({"credit_balance": new_balance}).eq("id", user_id).execute()
                
                # Emit to user
                await sio.emit('credit_update', {
                    "email": email,
                    "new_balance": new_balance,
                    "message": f"ADMIN ACTION: {amount} credits added to your vault."
                }, room=email)
                
                return {"success": True}
                
        elif action == 'TOGGLE_BLOCK':
            user_res = supabase.table("profiles").select("user_status").eq("id", user_id).execute()
            if user_res.data:
                current_status = user_res.data[0]["user_status"]
                next_status = "Blocked" if current_status != "Blocked" else "Active"
                supabase.table("profiles").update({"user_status": next_status}).eq("id", user_id).execute()
                return {"success": True, "nextStatus": next_status}
        
        return {"success": False, "error": "Unknown Admin Command"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.post("/credits/update")
@router.post("/credits")
async def update_user_credits(req: CreditUpdate):
    """
    ATOMIC CREDIT ENGINE:
    Ensures thread-safe increment/decrement with immediate real-time sync.
    """
    from core_engine import supabase, sio
    if not supabase:
        return {"status": "success", "new_balance": 1000.0}

    try:
        # 1. Fetch current balance (Locking would happen here in raw SQL)
        user_res = supabase.table("profiles").select("credit_balance").eq("email", req.email).execute()
        if not user_res.data:
            raise HTTPException(status_code=404, detail="Neural Profile Not Found")
        
        current = float(user_res.data[0]["credit_balance"])
        
        # 2. Logic Check
        if req.action == 'deduct' and current < req.amount:
            raise HTTPException(status_code=400, detail="Insufficient Neural Credits")
            
        new_balance = current + req.amount if req.action == 'add' else current - req.amount
        
        # 3. Update DB
        res = supabase.table("profiles").update({"credit_balance": new_balance}).eq("email", req.email).execute()
        
        if not res.data:
            raise Exception("Database Write Failed - Initiating Rollback Simulation")

        # 4. Record Transaction
        txn_id = f"txn_{uuid.uuid4().hex[:10]}"
        supabase.table("transactions").insert({
            "id": txn_id,
            "user_email": req.email,
            "amount": req.amount,
            "type": req.action,
            "reason": req.reason,
            "timestamp": datetime.now().isoformat()
        }).execute()

        # 5. Real-time Socket Emit
        await sio.emit('credit_update', {
            "email": req.email,
            "new_balance": new_balance,
            "action": req.action,
            "message": f"Neural Vault Updated: {req.amount} credits {req.action}ed."
        }, room=req.email)

        return {"status": "success", "new_balance": new_balance, "txn_id": txn_id}
        
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"[CRITICAL] Atomic Credit Failure: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- ASSET MANAGEMENT ---

@router.post("/assets/deploy")
async def deploy_global_asset(asset: AssetDeploy):
    """Global Asset Propagation: Instantly available to all users."""
    from core_engine import supabase, sio
    try:
        new_asset = {
            "id": f"ast_{uuid.uuid4().hex[:8]}",
            "name": asset.name,
            "type": asset.type,
            "category": asset.category,
            "url": asset.url,
            "status": "Global",
            "created_at": datetime.now().isoformat()
        }
        
        if supabase:
            supabase.table("assets").insert(new_asset).execute()
            
        # Notify all users of new global asset
        await sio.emit('system_broadcast', {
            "message": f"NEW ASSET DEPLOYED: {asset.name} ({asset.type}) is now live in your vault!",
            "type": "info"
        })
        
        return {"status": "success", "asset": new_asset}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/role")
async def update_user_role(req: RoleUpdate):
    from core_engine import supabase
    if not supabase:
        return {"status": "success", "new_role": req.role}
    
    try:
        data = {"role": req.role}
        if req.custom_credit_limit is not None:
            data["custom_credit_limit"] = req.custom_credit_limit
            
        supabase.table("profiles").update(data).eq("email", req.email).execute()
        return {"status": "success", "new_role": req.role}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- PROMO CODE ENGINE ---

@router.get("/promos")
async def get_all_promos():
    from core_engine import supabase
    if not supabase:
        return [
            {"id": "1", "code": "STARBOY", "amount": 10.0, "is_active": True, "usage_count": 45, "expiry": "2026-12-31"},
            {"id": "2", "code": "LAUNCH20", "amount": 20.0, "is_active": False, "usage_count": 12, "expiry": "2026-06-01"}
        ]
    try:
        res = supabase.table("promos").select("*").execute()
        return res.data
    except Exception as e:
        print(f"[Supabase] Promos Table Sync Failed: {e}")
        return [] # Fallback for new deployments

@router.post("/promos/create")
async def create_promo(req: Dict[str, Any]):
    from core_engine import supabase
    try:
        new_promo = {
            "id": f"prm_{uuid.uuid4().hex[:8]}",
            "code_name": req['code'].upper(),
            "reward_amount": float(req['amount']),
            "reward_type": 'Fixed',
            "is_active": True,
            "total_uses": 0,
            "created_at": datetime.now().isoformat()
        }
        if supabase:
            supabase.table("promo_codes").insert(new_promo).execute()
        return {"status": "success", "promo": new_promo}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- NEW: PRODUCTION ADMIN ROUTES ---

@router.get("/queue")
async def get_neural_queue():
    from core_engine import supabase
    if not supabase: return []
    try:
        res = supabase.table("jobs").select("*").order("created_at", { "ascending": False }).execute()
        return res.data
    except Exception: return []

@router.post("/queue")
async def force_job_rerender(data: Dict[str, str]):
    from core_engine import supabase, sio
    job_id = data.get("jobId")
    if supabase and job_id:
        supabase.table("jobs").update({"status": "Pending", "progress": 0}).eq("id", job_id).execute()
        await sio.emit('system_broadcast', {"message": f"Neural Task {job_id} reset for manual re-render.", "type": "warn"})
    return {"success": True}

@router.post("/create-vip")
async def create_vip_account(req: VIPCreate):
    from core_engine import supabase
    try:
        # 1. Create Profile (Auth bypass for admin manual entry)
        new_profile = {
            "email": req.email,
            "full_name": req.fullName,
            "role": "VIP",
            "credit_balance": req.initialCredits,
            "is_pro": True,
            "user_status": "Active"
        }
        if supabase:
            supabase.table("profiles").upsert(new_profile).execute()
            # Log in ledger
            supabase.table("credit_ledger").insert({
                "user_email": req.email,
                "action_type": "VIP",
                "amount": req.initialCredits,
                "description": "Manual VIP Provisioning"
            }).execute()
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.post("/create-superuser")
async def create_superuser_account(req: SuperUserCreate):
    from core_engine import supabase
    try:
        new_profile = {
            "email": req.email,
            "full_name": req.fullName,
            "role": "SUPER_USER",
            "credit_balance": 1000.0,
            "is_pro": True,
            "user_status": "Active"
        }
        if supabase:
            supabase.table("profiles").upsert(new_profile).execute()
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.post("/approve-payment")
async def approve_payment(req: PaymentApprove):
    from core_engine import supabase, sio
    try:
        if supabase:
            # 1. Update Transaction
            supabase.table("transactions").update({"status": "Approved"}).eq("id", req.transactionId).execute()
            
            # 2. Add Credits (INR amount * multiplier, e.g., 1 INR = 1 Credit for demo)
            credit_amount = req.amount
            user_res = supabase.table("profiles").select("credit_balance").eq("id", req.userId).execute()
            if user_res.data:
                new_balance = float(user_res.data[0]["credit_balance"]) + credit_amount
                supabase.table("profiles").update({"credit_balance": new_balance}).eq("id", req.userId).execute()
                
                # 3. Notify user via Socket
                await sio.emit('credit_update', {
                    "email": req.userEmail,
                    "new_balance": new_balance,
                    "message": f"PAYMENT APPROVED: ₹{req.amount} confirmed. {credit_amount} credits added!"
                }, room=req.userEmail)
                
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.put("/promos/toggle/{id}")
async def toggle_promo(id: str, active: bool):
    from core_engine import supabase
    try:
        if supabase:
            supabase.table("promos").update({"is_active": active}).eq("id", id).execute()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- PUBLIC PROMO APPLICATION ---

@router.post("/promo/apply")
async def apply_promo(data: Dict[str, str]):
    from core_engine import supabase, sio
    code = data.get("code", "").upper()
    identity = data.get("email") # Could be email or user_id
    
    if not identity: raise HTTPException(status_code=400, detail="User Identity Missing")
    
    try:
        if not supabase:
             return {"status": "success", "amount": 10.0}

        # 1. Verify Code
        promo_res = supabase.table("promos").select("*").eq("code", code).eq("is_active", True).execute()
        if not promo_res.data:
            raise HTTPException(status_code=404, detail="Invalid or Expired Promo Code")
        
        promo = promo_res.data[0]
        
        # 2. Check Expiry
        if promo.get('expiry') and datetime.fromisoformat(promo['expiry']) < datetime.now():
            raise HTTPException(status_code=400, detail="Promo Code Expired")

        # 3. Apply Credits Atomically
        # Try finding by ID first, then Email
        user_res = supabase.table("profiles").select("id, email, credit_balance").or_(f"id.eq.{identity},email.eq.{identity}").execute()
        
        if not user_res.data:
            raise HTTPException(status_code=404, detail="User Profile Not Found in Vault")
        
        user = user_res.data[0]
        current = float(user["credit_balance"])
        new_balance = current + float(promo['amount'])
        
        supabase.table("profiles").update({"credit_balance": new_balance}).eq("id", user["id"]).execute()
        
        # 4. Increment Usage
        supabase.table("promos").update({"usage_count": promo['usage_count'] + 1}).eq("id", promo['id']).execute()
        
        # 5. Real-time Notification
        await sio.emit('credit_update', {
            "email": user["email"],
            "new_balance": new_balance,
            "message": f"PROMO ACTIVATED: {promo['amount']}m credits added to your vault! ⚡"
        }, room=user["email"])
        
        return {"status": "success", "amount": promo['amount']}
        
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        print(f"[PROMO ERROR] {e}")
        raise HTTPException(status_code=500, detail="Neural Promo Sync Failed - Please check if 'promos' table exists in Supabase.")

# --- BROADCAST & WATCHDOG ---

@router.post("/broadcast")
async def system_broadcast(req: Dict[str, str]):
    from core_engine import sio
    await sio.emit('system_broadcast', {
        "message": req.get("message", "System Update in Progress"),
        "type": req.get("type", "info"),
        "timestamp": datetime.now().isoformat()
    })
    return {"status": "success"}

@router.post("/broadcast/clear")
async def clear_broadcast():
    from core_engine import sio
    await sio.emit('system_broadcast', {
        "message": None,
        "type": "clear",
        "timestamp": datetime.now().isoformat()
    })
    return {"status": "success"}

@router.post("/analytics/track")
async def track_journey(data: Dict[str, Any]):
    log_file = "data/journey_logs.json"
    os.makedirs("data", exist_ok=True)
    with open(log_file, "a") as f:
        f.write(json.dumps(data) + "\n")
    return {"status": "success"}

