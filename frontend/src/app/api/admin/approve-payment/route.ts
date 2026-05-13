import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { transactionId, userId, amount, userName, userEmail } = await request.json();

    if (!transactionId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Update User Status
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ user_status: 'Active' })
      .eq('id', userId);

    if (profileError) throw profileError;

    // 2. Update Transaction Status
    // Assuming a transactions table exists as per the admin UI
    const { error: txnError } = await supabase
      .from('transactions')
      .update({ status: 'Approved' })
      .eq('id', transactionId);

    // 3. Increment Paid User Count (FOMO Engine)
    const { data: settings, error: settingsError } = await supabase
      .from('system_settings')
      .select('*')
      .single();

    if (settingsError) throw settingsError;

    const newCount = (settings.paid_user_count || 0) + 1;
    await supabase
      .from('system_settings')
      .update({ paid_user_count: newCount })
      .eq('id', settings.id);

    // 4. Instant Notifications
    // Email via Resend
    await resend.emails.send({
      from: 'VoxFlow <onboarding@voxflow.studio>',
      to: userEmail || 'user@example.com',
      subject: '🚀 Your Titan-X Dashboard is ACTIVE!',
      html: `<p>Hi ${userName || 'Creator'},</p><p>Your payment of ₹${amount} is approved! 🚀 Your Titan-X dashboard is now <b>ACTIVE</b>.</p><p>Login here: <a href="https://voxflow.studio/login">voxflow.studio/login</a></p>`
    });

    // WhatsApp Webhook (Mock/Placeholder)
    // In a real scenario, this would hit Twilio's API
    if (process.env.TWILIO_WEBHOOK_URL) {
       await fetch(process.env.TWILIO_WEBHOOK_URL, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           to: 'whatsapp:+91...', // User's phone would be needed here
           message: `Hi ${userName}, Your payment of ₹${amount} is approved! 🚀 Your Titan-X dashboard is now ACTIVE. Login here: https://voxflow.studio/login`
         })
       });
    }

    // 5. Founder Alert (50th Slot)
    if (newCount === 50 || newCount === settings.early_bird_limit) {
      await resend.emails.send({
        from: 'System <alerts@voxflow.studio>',
        to: 'aman@amanstudio.in',
        subject: '🎯 MILESTONE: 50th Slot Filled!',
        html: `<h1>Target Reached!</h1><p>The early bird limit of ${settings.early_bird_limit} has been hit. Price is now automatically ₹1,499.</p>`
      });
    }

    return NextResponse.json({ success: true, newCount });

  } catch (error: any) {
    console.error("Approval Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
