import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency } = body;

    // Mock response for Stripe/Razorpay Payment Intent
    return NextResponse.json({
      clientSecret: `pi_mock_${Math.random().toString(36).substring(7)}`,
      amount,
      currency,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
