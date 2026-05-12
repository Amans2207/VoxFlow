-- RPC to resolve payment atomically
CREATE OR REPLACE FUNCTION resolve_payment(
    p_transaction_id UUID,
    p_action TEXT,
    p_credits_to_add INTEGER
) RETURNS VOID AS $$
DECLARE
    v_user_id UUID;
    v_status TEXT;
BEGIN
    -- 1. Check current status
    SELECT user_id, status INTO v_user_id, v_status FROM public.transactions WHERE id = p_transaction_id;
    
    IF v_status != 'pending' THEN
        RAISE EXCEPTION 'Transaction already resolved';
    END IF;

    IF p_action = 'approve' THEN
        -- A. Update Transaction Status
        UPDATE public.transactions SET status = 'approved' WHERE id = p_transaction_id;
        
        -- B. Inject Credits to User Profile
        UPDATE public.profiles 
        SET credit_balance = credit_balance + p_credits_to_add 
        WHERE id = v_user_id;
        
    ELSIF p_action = 'reject' THEN
        UPDATE public.transactions SET status = 'rejected' WHERE id = p_transaction_id;
    END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
