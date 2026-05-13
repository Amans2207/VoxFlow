-- EMERGENCY RECOVERY SQL (TASK 3)
-- Execute this in Supabase SQL Editor to resolve 400/406 Errors.

-- 1. SYSTEM SETTINGS (Maintenance & Global Alerts)
CREATE TABLE IF NOT EXISTS public.system_settings (
    id BIGINT PRIMARY KEY DEFAULT 1,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    global_alert_message TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS maintenance_mode BOOLEAN DEFAULT FALSE;
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS global_alert_message TEXT;

-- 2. USER PROFILES (Theme & Plan Tier)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS selected_theme_id TEXT DEFAULT 'starboy';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan_tier TEXT DEFAULT 'Free'; -- 'Free', 'Pro', 'Enterprise'
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS credit_balance DECIMAL DEFAULT 10.0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'User'; -- 'User', 'Admin'

-- 3. INITIALIZATION
INSERT INTO public.system_settings (id, maintenance_mode) 
VALUES (1, FALSE) 
ON CONFLICT (id) DO NOTHING;
