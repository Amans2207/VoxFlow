import { Resend } from 'resend';

const resend = new Resend('re_QqJo2yHb_BvnhEZGaYVeHNMqbLgNAw1dM');

async function sendTestEmail() {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'singhaman22435@gmail.com',
      subject: 'VoxFlow Setup Complete! 🚀',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0066FF;">Your Keys are Active!</h2>
          <p>Congratulations Aman! Your Resend API key and ElevenLabs API keys have been successfully integrated into VoxFlow.</p>
          <p>When users dub videos, they will receive automated emails just like this one.</p>
        </div>
      `
    });
    console.log("Email Sent Successfully!", data);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

sendTestEmail();
