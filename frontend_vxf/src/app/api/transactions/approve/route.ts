import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { transactionId, action } = await request.json();
    const supabase = await createClient();

    // 1. Get transaction details
    const { data: transaction, error: transError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (transError || !transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    if (action === 'approve') {
      // 2. Update transaction status
      await supabase
        .from('transactions')
        .update({ status: 'Approved' })
        .eq('id', transactionId);

      // 3. Credit user balance (assuming 1 INR = 1 Credit, and 20 Credits = 1 Minute)
      // For simplicity, let's just add minutes directly if that's the model
      const minutesToAdd = transaction.amount / 20; // Example: 500 INR = 25 Minutes

      const { data: profile } = await supabase
        .from('profiles')
        .select('minute_balance')
        .eq('id', transaction.user_id)
        .single();

      await supabase
        .from('profiles')
        .update({ minute_balance: (profile?.minute_balance || 0) + minutesToAdd })
        .eq('id', transaction.user_id);
      
      // 4. Send Email Notification via Resend
      try {
        await resend.emails.send({
          from: 'VoxFlow Finance <onboarding@resend.dev>',
          to: transaction.email || 'singhaman22435@gmail.com', // Fallback for demo
          subject: 'Credits Injected! ⚡ VoxFlow Billing',
          html: `
            <div style="font-family: sans-serif; background: #050505; color: white; padding: 40px; border-radius: 20px;">
              <h2 style="color: #00f2ff;">Payment Verified</h2>
              <p>Hello Creator,</p>
              <p>Your transaction of <b>₹${transaction.amount}</b> has been verified. <b>${minutesToAdd} Minutes</b> have been added to your Titan-X production balance.</p>
              <p style="color: #666; font-size: 0.8rem;">Transaction ID: ${transactionId}</p>
              <div style="margin-top: 30px; padding: 20px; border-top: 1px solid #333;">
                <p>Happy Creating!<br/><b>VoxFlow Root Control</b></p>
              </div>
            </div>
          `
        });
      } catch (emailErr) {
        console.error("Email notification failed:", emailErr);
      }
      
      return NextResponse.json({ success: true, message: "Transaction approved and minutes credited." });
    } else {
      await supabase
        .from('transactions')
        .update({ status: 'Rejected' })
        .eq('id', transactionId);
      
      return NextResponse.json({ success: true, message: "Transaction rejected." });
    }
  } catch (error) {
    console.error("Approval API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
