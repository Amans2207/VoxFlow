-- VOXFLOW TITAN-X MASTER SCHEMA (VERSION 8.0 - FINAL STABILIZATION)
-- Target: Supabase (PostgreSQL)
-- This script is safe to run multiple times.

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SYSTEM SETTINGS (Global Orchestration)
CREATE TABLE IF NOT EXISTS public.system_settings (
    id BIGINT PRIMARY KEY DEFAULT 1,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist for existing tables (Module 2 Fixes)
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS paid_user_count INT DEFAULT 0;
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS early_bird_limit INT DEFAULT 100;
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS api_burn_limit FLOAT DEFAULT 5000.0;
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS global_alert_message TEXT;

-- Initialize Singleton Settings
INSERT INTO public.system_settings (id, maintenance_mode, paid_user_count, early_bird_limit)
SELECT 1, FALSE, 0, 100
WHERE NOT EXISTS (SELECT 1 FROM public.system_settings WHERE id = 1);

-- 2. USER PROFILES & AUTHORIZATION
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist for existing tables (The "First Blood" Columns)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS credit_balance DECIMAL DEFAULT 15.0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_status TEXT DEFAULT 'Active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'STANDARD'; -- 'STANDARD', 'VIP', 'SUPER_USER'
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan_tier TEXT DEFAULT 'Free'; -- 'Free', 'Pro', 'Enterprise'
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS selected_theme_id TEXT DEFAULT 'starboy';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 3. PROJECTS & CREATIVE STATE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Untitled Project',
    type TEXT DEFAULT 'Studio', -- 'Dubbing', 'Studio', 'Marketplace'
    status TEXT DEFAULT 'Draft', -- 'Draft', 'Processing', 'Completed', 'Failed'
    video_url TEXT,
    timeline_state JSONB DEFAULT '[]'::jsonb,
    caption_settings JSONB DEFAULT '{}'::jsonb,
    audio_settings JSONB DEFAULT '{}'::jsonb,
    config JSONB DEFAULT '{}'::jsonb,
    output_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TEAM ACCESS & VERSIONS
CREATE TABLE IF NOT EXISTS public.project_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    shared_with_email TEXT NOT NULL,
    permission_level TEXT NOT NULL CHECK (permission_level IN ('Viewer', 'Editor')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    version_name TEXT,
    state JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. NEURAL MARKETPLACE & ASSETS
CREATE TABLE IF NOT EXISTS public.marketplace_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price_credits DECIMAL DEFAULT 50,
    config JSONB NOT NULL,
    preview_url TEXT,
    sales_count INTEGER DEFAULT 0,
    rating DECIMAL DEFAULT 5.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'LUT', 'SFX', 'Transition', 'Overlay'
    category TEXT,
    url TEXT NOT NULL,
    status TEXT DEFAULT 'Private', -- 'Private', 'Global'
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    uses INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. JOBS (Live AI Production Queue)
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT,
    job_id TEXT UNIQUE,
    type TEXT CHECK (type IN ('dub', 'autopilot', 'export', 'clip', 'generate')),
    status TEXT DEFAULT 'Pending',
    progress INT DEFAULT 0,
    input_url TEXT,
    output_url TEXT,
    error TEXT,
    engine TEXT DEFAULT 'Titan-X',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. FINANCIAL HUD: LEDGER & TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.promo_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_name TEXT UNIQUE NOT NULL,
    reward_amount DECIMAL NOT NULL,
    reward_type TEXT DEFAULT 'Fixed',
    total_uses INT DEFAULT 0,
    max_uses INT DEFAULT 1000,
    is_active BOOLEAN DEFAULT TRUE,
    expiry_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.credit_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT,
    amount DECIMAL NOT NULL,
    type TEXT CHECK (type IN ('credit', 'debit')),
    action_type TEXT, -- 'PROMO', 'VIP', 'TASK', 'PURCHASE'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT,
    upi_id TEXT,
    utr TEXT UNIQUE,
    amount DECIMAL NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    provider TEXT DEFAULT 'UPI',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SECURITY: RLS & POLICIES (Hardened)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Dynamic Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Profiles: Private View" ON public.profiles;
    CREATE POLICY "Profiles: Private View" ON public.profiles FOR SELECT USING (auth.uid() = id);
    
    DROP POLICY IF EXISTS "Profiles: Self Update" ON public.profiles;
    CREATE POLICY "Profiles: Self Update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

    DROP POLICY IF EXISTS "Projects: Owner Manage" ON public.projects;
    CREATE POLICY "Projects: Owner Manage" ON public.projects FOR ALL USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Marketplace: Global View" ON public.marketplace_templates;
    CREATE POLICY "Marketplace: Global View" ON public.marketplace_templates FOR SELECT USING (TRUE);

    DROP POLICY IF EXISTS "Jobs: Private View" ON public.jobs;
    CREATE POLICY "Jobs: Private View" ON public.jobs FOR SELECT USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Settings: Public Read" ON public.system_settings;
    CREATE POLICY "Settings: Public Read" ON public.system_settings FOR SELECT USING (TRUE);
END $$;

-- 9. AUTOMATION & LOGIC (RPC / Triggers)

-- Trigger: Handle New User Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, credit_balance, plan_tier)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 15.0, 'Free');
  
  -- Log initial credits
  INSERT INTO public.credit_ledger (user_id, user_email, amount, type, action_type, description)
  VALUES (new.id, new.email, 15.0, 'credit', 'SIGNUP', 'Neural Welcome Package (Sync V8)');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-attach Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Performance Indexing
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
