import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json();

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

    // 2. Create/Update Profile with Studio tier and 1000 Credits
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        email: email,
        role: 'VIP_Creator',
        credit_balance: 1000,
        plan_tier: 'Studio'
      });

    if (profileError) throw profileError;

    // 3. Log to Credit Ledger
    await supabaseAdmin.from('credit_ledger').insert({
      user_id: userId,
      amount: 1000,
      action_type: 'SUPER_USER_GEN',
      description: `Super User Account Generation for ${fullName}`
    });

    return NextResponse.json({ 
      success: true, 
      message: `Super User ${fullName} registered with 1000 mins and Studio access.` 
    });

  } catch (error: any) {
    console.error("Admin Super User Creation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
