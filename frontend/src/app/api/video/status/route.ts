import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';
import { getElevenLabsKey } from "@/utils/elevenlabs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: "Missing dubbing_id" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    
    // Fetch job status from database
    const { data: job, error } = await supabase
      .from('jobs')
      .select('status, output_url, user_id, duration, target_lang')
      .eq('id', id)
      .or(`dubbing_id.eq.${id}`) // Support both internal ID and dubbing_id
      .single();

    if (error || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.status === "Completed") {
      // Credit deduction logic (only if not already done)
      // Note: In a production app, we'd check if credits were already deducted for this job
      
      const currentJobLang = job.target_lang || 'hi';
      const finalOutputUrl = job.output_url || `/api/video/download?dubbingId=${id}&langCode=${currentJobLang}`;

      return NextResponse.json({
        dubbing_id: id,
        status: "Completed",
        output_url: finalOutputUrl,
      });
    }

    if (job.status === "Failed") {
      return NextResponse.json({ dubbing_id: id, status: "Failed", message: "AI Processing Failed" });
    }

    return NextResponse.json({
      dubbing_id: id,
      status: "Processing",
      progress: 50, // Mock progress for now
    });
    
  } catch (error) {
    console.error("Status API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
