from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# USER & AUTH
class UserProfile(BaseModel):
    id: str
    email: EmailStr
    name: Optional[str] = None
    credit_balance: float = 0.0
    role: str = "STANDARD"  # 'STANDARD', 'VIP', 'SUPER_USER'
    custom_credit_limit: Optional[float] = None # Overrides default plan limits for VIPs
    status: str = "Active"
    is_pro: bool = False
    last_login: Optional[datetime] = None
    created_at: Optional[datetime] = None

# PROMO CODES
class PromoCode(BaseModel):
    id: str
    code: str
    amount: float # Credits (e.g. 10.0 for 10 mins)
    is_active: bool = True
    usage_count: int = 0
    max_uses: Optional[int] = None
    expiry: Optional[datetime] = None
    created_at: datetime

# PROJECTS (AI Studio / Neural Dubs)
class Project(BaseModel):
    id: str
    user_id: str
    name: str
    type: str  # 'Dubbing', 'Studio', 'Marketplace'
    status: str  # 'Draft', 'Processing', 'Completed', 'Failed'
    config: Dict[str, Any]
    output_url: Optional[str] = None
    created_at: datetime

# ASSETS (Global & User-specific)
class Asset(BaseModel):
    id: str
    name: str
    type: str  # 'LUT', 'SFX', 'Transition'
    url: str
    category: str
    status: str = "Private"  # 'Private', 'Global'
    owner_id: Optional[str] = None  # None if Global
    uses: int = 0
    created_at: datetime

# TRANSACTIONS (Financial Tracking)
class Transaction(BaseModel):
    id: str
    user_id: str
    amount: float
    type: str  # 'Credit_Purchase', 'Subscription', 'Refund'
    status: str  # 'Success', 'Failed', 'Pending'
    provider: str  # 'Stripe', 'Razorpay'
    timestamp: datetime

# AGENCY / WORKSPACE
class Agency(BaseModel):
    id: str
    name: str
    owner_id: str
    members: List[str]
    credit_pool: float
    plan: str  # 'Enterprise', 'Pro'
    created_at: datetime
