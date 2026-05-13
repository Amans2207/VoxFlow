-- VOXFLOW PRODUCTION SCHEMA v4
-- Handles AI Task Tracking and Financial Transactions

-- 1. Tasks Table (AI Job Tracking)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'processing', -- processing, completed, failed
    task_type TEXT, -- dubbing, generation, sfx
    input_params JSONB,
    output_url TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

-- 2. Transactions Table (Revenue Tracking)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    amount_paid DECIMAL(10, 2),
    credits_added DECIMAL(10, 2),
    currency TEXT DEFAULT 'USD',
    payment_status TEXT DEFAULT 'pending', -- pending, success, failed
    utr_number TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
