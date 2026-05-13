import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: settings, error } = await supabase
      .from('system_settings')
      .select('paid_user_count, early_bird_limit')
      .single();

    if (error) throw error;

    const price = settings.paid_user_count < settings.early_bird_limit ? 999 : 1499;

    return new NextResponse(JSON.stringify({
      price,
      count: settings.paid_user_count,
      limit: settings.early_bird_limit,
      remaining: Math.max(0, settings.early_bird_limit - settings.paid_user_count)
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    });

  } catch (error) {
    return NextResponse.json({ price: 1499, error: "Pricing Fallback" }, { status: 200 });
  }
}
