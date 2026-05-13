import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('query') || '';

    const supabase = createAdminClient();

    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query.limit(50);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, action, amount } = await request.json();
    const supabase = createAdminClient();

    if (action === 'ADD_CREDITS') {
      const { data: profile } = await supabase.from('profiles').select('credit_balance').eq('id', userId).single();
      const newBalance = (profile?.credit_balance || 0) + amount;
      
      const { error } = await supabase.from('profiles').update({ credit_balance: newBalance }).eq('id', userId);
      if (error) throw error;

      // Add to Ledger
      await supabase.from('credit_ledger').insert({
        user_id: userId,
        amount: amount,
        action_type: 'Admin Grant',
        description: `Manual credit injection by Admin.`
      });

      return NextResponse.json({ success: true, newBalance });
    }

    if (action === 'TOGGLE_BLOCK') {
      const { data: profile } = await supabase.from('profiles').select('user_status').eq('id', userId).single();
      const nextStatus = profile?.user_status === 'Blocked' ? 'Active' : 'Blocked';
      
      const { error } = await supabase.from('profiles').update({ user_status: nextStatus }).eq('id', userId);
      if (error) throw error;

      return NextResponse.json({ success: true, nextStatus });
    }

    return NextResponse.json({ error: "Invalid Action" }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
