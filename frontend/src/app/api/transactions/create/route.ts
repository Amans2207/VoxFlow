import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { amount, utr, userId } = await request.json();

    if (!amount || !utr) {
      return NextResponse.json({ error: "Amount and UTR are required" }, { status: 400 });
    }

    // Trigger Mobile Webhook Notification if configured
    const webhookUrl = process.env.ADMIN_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `🚨 **NEW PAYMENT PENDING** 🚨\n\n**Amount**: ₹${amount}\n**User ID**: ${userId || 'Unknown'}\n**UTR**: ${utr}\n\nApprove via Admin Panel: https://voxflow.studio/admin_vxf`
          })
        });
      } catch (err) {
        console.error("Failed to trigger webhook notification", err);
      }
    }

    // AUTOMATION: Automatically add credits based on amount
    // ₹999 -> 30 mins, ₹2499 -> 100 mins, ₹4999 -> 250 mins
    const amountNum = parseInt(amount);
    let creditsToAdd = 0;
    if (amountNum >= 4999) creditsToAdd = 250;
    else if (amountNum >= 2499) creditsToAdd = 100;
    else if (amountNum >= 999) creditsToAdd = 30;

    if (creditsToAdd > 0 && userId) {
      const { createClient } = await import('@/utils/supabase/server');
      const supabase = await createClient();
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('credit_balance')
        .eq('id', userId)
        .single();

      if (profile) {
        await supabase
          .from('profiles')
          .update({ 
            credit_balance: (profile.credit_balance || 0) + creditsToAdd 
          })
          .eq('id', userId);
      }
    }

    return NextResponse.json({
      success: true,
      transaction_id: `txn_${Math.random().toString(36).substring(7)}`,
      status: "Approved",
      message: `Successfully added ${creditsToAdd} minutes to your account!`,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
