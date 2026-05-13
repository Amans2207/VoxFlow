import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .or('status.eq.Pending,status.eq.Processing')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { jobId } = await request.json();
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('jobs')
      .update({ 
        status: 'Pending', 
        dubbing_id: null, 
        output_url: null 
      })
      .eq('id', jobId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
