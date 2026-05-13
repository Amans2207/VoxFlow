-- VOXFLOW ECOSYSTEM OVERHAUL MIGRATION
-- Adds Referral Logic and Pro Status

-- 1. Add Columns to Profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.profiles(id);

-- 2. Update handle_new_user Trigger for Referral Bonuses
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    referrer_id UUID;
BEGIN
    -- Extract referrer ID from raw_user_meta_data if present
    -- Expected metadata: { "referred_by": "uuid-of-referrer" }
    BEGIN
        referrer_id := (new.raw_user_meta_data->>'referred_by')::UUID;
    EXCEPTION WHEN OTHERS THEN
        referrer_id := NULL;
    END;

    -- Insert into profiles
    INSERT INTO public.profiles (
        id, 
        email, 
        full_name, 
        avatar_url, 
        referred_by, 
        credit_balance
    )
    VALUES (
        new.id, 
        new.email, 
        new.raw_user_meta_data->>'full_name', 
        new.raw_user_meta_data->>'avatar_url',
        referrer_id,
        CASE WHEN referrer_id IS NOT NULL THEN 25.0 ELSE 15.0 END -- 15 base + 10 referral bonus
    );

    -- If there's a referrer, give them 10 credits too
    IF referrer_id IS NOT NULL THEN
        UPDATE public.profiles 
        SET credit_balance = credit_balance + 10 
        WHERE id = referrer_id;

        -- Log in ledger
        INSERT INTO public.credit_ledger (user_id, amount, type, action_type, description)
        VALUES (referrer_id, 10, 'credit', 'Referral', 'Bonus for referring ' || new.email);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
