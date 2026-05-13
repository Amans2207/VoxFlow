-- VOXFLOW MASTER DATABASE MIGRATION (CONSOLIDATED & CLEANED)
-- Target: Supabase (PostgreSQL)

-- Enable UUID extension if not present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & CREDITS
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    credit_balance DECIMAL DEFAULT 15.0,
    selected_theme_id TEXT DEFAULT 'starboy',
    terms_accepted BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    role TEXT DEFAULT 'User', -- 'User' or 'Admin'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECTS & STUDIO STATE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Untitled Project',
    video_url TEXT,
    timeline_state JSONB DEFAULT '[]'::jsonb,
    caption_settings JSONB DEFAULT '{}'::jsonb,
    audio_settings JSONB DEFAULT '{}'::jsonb,
    selected_preset TEXT,
    active_fx TEXT DEFAULT 'none',
    active_filter TEXT DEFAULT 'none',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AGENCY / TEAM ACCESS
CREATE TABLE IF NOT EXISTS public.project_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    shared_with_email TEXT NOT NULL,
    permission_level TEXT NOT NULL CHECK (permission_level IN ('Viewer', 'Editor')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROJECT VERSION HISTORY (Snapshot System)
CREATE TABLE IF NOT EXISTS public.project_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    version_name TEXT,
    state JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. VOXFLOW MARKETPLACE TEMPLATES
CREATE TABLE IF NOT EXISTS public.marketplace_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES auth.users ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price_credits DECIMAL DEFAULT 50,
    config JSONB NOT NULL, -- Studio configuration export
    preview_url TEXT,
    sales_count INTEGER DEFAULT 0,
    rating DECIMAL DEFAULT 5.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. JOBS & RENDERING QUEUE
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    job_id TEXT UNIQUE,
    type TEXT CHECK (type IN ('dub', 'autopilot', 'export', 'clip')),
    status TEXT DEFAULT 'Pending',
    input_url TEXT,
    output_url TEXT,
    license_url TEXT,
    error TEXT,
    engine TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. NOTIFICATION CENTER
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('StyleUpdate', 'MarketplaceSale', 'ProjectStatus', 'SystemAlert')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FINANCIALS: LEDGER & TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.credit_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    amount DECIMAL,
    type TEXT CHECK (type IN ('credit', 'debit')),
    action_type TEXT DEFAULT 'Purchase', -- e.g., 'VIP_GEN', 'Marketplace', 'Render'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    upi_id TEXT,
    amount DECIMAL,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SYSTEM SETTINGS (Global Toggles)
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE,
    value INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PROMO CODES
CREATE TABLE IF NOT EXISTS public.promo_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_name TEXT UNIQUE,
    reward_amount INTEGER,
    total_uses INTEGER DEFAULT 0,
    affiliate_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEED DATA
INSERT INTO public.system_settings (key, value) VALUES ('early_bird_slots', 100) ON CONFLICT (key) DO NOTHING;

-- MOCK MARKETPLACE DATA
INSERT INTO public.marketplace_templates (title, description, price_credits, creator_id, preview_url)
SELECT 'Viral Hormozi Pack', 'The ultimate high-retention caption style.', 100, auth.uid(), 'https://images.pexels.com/videos/3129634/free-video-3129634.jpg'
WHERE EXISTS (SELECT 1 FROM auth.users LIMIT 1)
ON CONFLICT DO NOTHING;

-- 11. RLS POLICIES (Hardened Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Projects
DROP POLICY IF EXISTS "Users can manage own projects" ON public.projects;
CREATE POLICY "Users can manage own projects" ON public.projects FOR ALL USING (auth.uid() = user_id);

-- Project Shares
DROP POLICY IF EXISTS "Users can see projects shared with them" ON public.project_shares;
CREATE POLICY "Users can see projects shared with them" ON public.project_shares 
    FOR SELECT USING (shared_with_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Project Versions
DROP POLICY IF EXISTS "Users can manage versions of their projects" ON public.project_versions;
CREATE POLICY "Users can manage versions of their projects" ON public.project_versions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = project_versions.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- Marketplace
DROP POLICY IF EXISTS "Templates are viewable by everyone" ON public.marketplace_templates;
CREATE POLICY "Templates are viewable by everyone" ON public.marketplace_templates FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Creators can manage their templates" ON public.marketplace_templates;
CREATE POLICY "Creators can manage their templates" ON public.marketplace_templates FOR ALL USING (auth.uid() = creator_id);

-- Jobs & Notifications
DROP POLICY IF EXISTS "Users can manage own jobs" ON public.jobs;
CREATE POLICY "Users can manage own jobs" ON public.jobs FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own notifications" ON public.notifications;
CREATE POLICY "Users can manage own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- 10. AUTOMATION TRIGGERS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup existing trigger to avoid duplicate errors
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
-- 11. FINANCIAL AUTOMATION (Auto-Credit Injection)
CREATE OR REPLACE FUNCTION public.handle_transaction_approval()
RETURNS TRIGGER AS 
BEGIN
  IF (OLD.status = 'Pending' AND NEW.status = 'Approved') THEN
    UPDATE public.profiles SET credit_balance = credit_balance + NEW.amount WHERE id = NEW.user_id;
    INSERT INTO public.credit_ledger (user_id, amount, type, description) VALUES (NEW.user_id, NEW.amount, 'credit', 'Payment Approved: ' || NEW.id);
  END IF;
  RETURN NEW;
END;
 LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_transaction_approved ON public.transactions;
CREATE TRIGGER on_transaction_approved AFTER UPDATE ON public.transactions FOR EACH ROW EXECUTE PROCEDURE public.handle_transaction_approval();
