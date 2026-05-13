import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Webhook payload from HeyGen/Rask
    const { jobId, status, resultUrl } = body;

    if (status === "completed") {
      // 1. Update job status in Database
      // 2. Atomic transaction to deduct credits using transaction_id to prevent double-spending
      console.log(`Job ${jobId} completed. Result: ${resultUrl}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }
}
