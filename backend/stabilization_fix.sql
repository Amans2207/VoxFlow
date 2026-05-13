-- VOXFLOW TITAN-X STABILIZATION SQL (MODULE 2)
-- Execute this to resolve 400/406 errors and unlock the UI.

-- 1. PROFILES HARDENING
-- Adding missing columns to the profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan_tier TEXT DEFAULT 'Free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS selected_theme_id TEXT DEFAULT 'starboy';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS credit_balance DECIMAL DEFAULT 10.0;

-- 2. SYSTEM SETTINGS (The 'Sannate' Breaker)
-- Creating the core settings table for global status orchestration
CREATE TABLE IF NOT EXISTS public.system_settings (
    id BIGINT PRIMARY KEY DEFAULT 1,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    global_alert_message TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initialize settings if empty
INSERT INTO public.system_settings (id, maintenance_mode)
SELECT 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.system_settings WHERE id = 1);

-- 3. PERMISSIONS (Health Check)
-- Ensure system_settings is readable by all (public) for the frontend health check
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Settings: Public Read" ON public.system_settings;
CREATE POLICY "Settings: Public Read" ON public.system_settings FOR SELECT USING (TRUE);
