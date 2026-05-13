-- SUPABASE NEURAL VAULT: CREDIT LOGIC
-- Run this in your Supabase SQL Editor

-- 1. Ensure the credits column exists in profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS credit_balance DECIMAL DEFAULT 10.0;

-- 2. Create the Atomic Credit Decrement Function
CREATE OR REPLACE FUNCTION decrement_credits(target_email TEXT, amount DECIMAL)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET credit_balance = credit_balance - amount
  WHERE email = target_email AND credit_balance >= amount;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Neural Balance Insufficient or Profile Not Found';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create a helper to fetch current balance for the badge
CREATE OR REPLACE FUNCTION get_credit_balance(target_email TEXT)
RETURNS DECIMAL AS $$
DECLARE
  balance DECIMAL;
BEGIN
  SELECT credit_balance INTO balance FROM public.profiles WHERE email = target_email;
  RETURN COALESCE(balance, 0.0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
