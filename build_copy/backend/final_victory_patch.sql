-- VOXFLOW FINAL VICTORY PATCH (V8.0)
-- Target: Supabase (PostgreSQL)
-- This script fixes all remaining 400/406 column errors.

-- 1. PROFILES HARDENING
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan_tier TEXT DEFAULT 'Free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS selected_theme_id TEXT DEFAULT 'starboy';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS credit_balance DECIMAL DEFAULT 15.0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'STANDARD';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;

-- 2. SYSTEM SETTINGS (The 'Sannate' Breaker)
CREATE TABLE IF NOT EXISTS public.system_settings (
    id BIGINT PRIMARY KEY DEFAULT 1,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    paid_user_count INT DEFAULT 0,
    early_bird_limit INT DEFAULT 100,
    api_burn_limit FLOAT DEFAULT 5000.0,
    global_alert_message TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initialize Singleton Settings
INSERT INTO public.system_settings (id, maintenance_mode, paid_user_count, early_bird_limit)
SELECT 1, FALSE, 0, 100
WHERE NOT EXISTS (SELECT 1 FROM public.system_settings WHERE id = 1);

-- 3. PERMISSIONS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Settings: Public Read" ON public.system_settings;
CREATE POLICY "Settings: Public Read" ON public.system_settings FOR SELECT USING (TRUE);

-- 4. PROJECTS INDEXING (For fast GET /api/user/projects)
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
