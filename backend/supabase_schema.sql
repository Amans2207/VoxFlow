-- ==========================================
-- VOXFLOW NEURAL VAULT: A-Z DATABASE SCHEMA
-- ==========================================
-- Instructions: 
-- 1. Open Supabase Dashboard -> SQL Editor
-- 2. Paste this entire script
-- 3. Click "RUN"
-- ==========================================

-- ✅ 1. PROFILES TABLE & CREDIT COLUMN
-- Ensures the profiles table exists and has the neural balance column.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  credit_balance DECIMAL DEFAULT 10.0,
  role TEXT DEFAULT 'Free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ✅ 2. ATOMIC CREDIT DECREMENT FUNCTION
-- This is a 'Database Function' that handles credit deduction securely.
-- Usage from Flask: supabase.rpc('decrement_credits', {'target_user_id': '...', 'amount': 1.0})
CREATE OR REPLACE FUNCTION decrement_credits(target_user_id UUID, amount DECIMAL DEFAULT 1.0)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET credit_balance = credit_balance - amount
  WHERE id = target_user_id AND credit_balance >= amount;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Neural Balance Insufficient or Profile Not Found';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ✅ 3. CREDIT BALANCE FETCHER
-- Usage from Flask: supabase.rpc('get_credit_balance', {'target_user_id': '...'})
CREATE OR REPLACE FUNCTION get_credit_balance(target_user_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  balance DECIMAL;
BEGIN
  SELECT credit_balance INTO balance FROM public.profiles WHERE id = target_user_id;
  RETURN COALESCE(balance, 0.0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ✅ 4. AUTOMATIC PROFILE CREATION (TRIGGER)
-- Automatically creates a profile when a new user signs up via Google/Email.
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, credit_balance)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url', 
    10.0 -- Initial Welcome Credits
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ✅ 5. SECURITY (RLS)
-- Enables Row Level Security so users can only see THEIR OWN profile.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- ==========================================
-- SYSTEM SYNC COMPLETE 🚀
-- ==========================================
