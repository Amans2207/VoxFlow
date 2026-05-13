import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin (requires Service Role Key)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, password, fullName, initialCredits } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Create Auth User
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    });

    if (authError) throw authError;

    const userId = authData.user.id;

    // 2. Create/Update Profile with VIP role and Credits
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        email: email,
        role: 'VIP_Creator',
        credit_balance: initialCredits || 500,
        plan_tier: 'VIP'
      });

    if (profileError) throw profileError;

    // 3. Log to Credit Ledger
    await supabaseAdmin.from('credit_ledger').insert({
      user_id: userId,
      amount: initialCredits || 500,
      action_type: 'VIP_GEN',
      description: `Manual VIP Account Generation for ${fullName}`
    });

    return NextResponse.json({ 
      success: true, 
      message: `VIP Creator ${fullName} registered with ${initialCredits} mins.` 
    });

  } catch (error: any) {
    console.error("Admin VIP Creation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
