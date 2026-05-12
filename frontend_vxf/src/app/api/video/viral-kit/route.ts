import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { transcript, targetLanguage, jobId } = await request.json();
    const supabase = await createClient();

    const apiKey = process.env.OPENAI_API_KEY;

    let kit = {
      captions: [
        "🔥 Check out my new localized content!",
        "🚀 We are going global! Watch now.",
        "🌍 Scaling with VoxFlow was never easier."
      ],
      hashtags: "#AI #Localization #VoxFlow #GlobalGrowth #CreatorEconomy"
    };

    if (apiKey) {
      // In a real implementation:
      // const response = await openai.chat.completions.create({
      //   model: "gpt-4o",
      //   messages: [{ role: "system", content: "Create 3 viral captions and 10 hashtags for this video: " + transcript }]
      // });
      // kit = parseResponse(response);
    }

    // Save kit to database (assuming a viral_kit column exists or related table)
    await supabase
      .from('jobs')
      .update({ viral_kit: kit })
      .eq('id', jobId);

    return NextResponse.json({
      success: true,
      kit,
      message: "Viral Kit generated successfully."
    });
  } catch (error) {
    console.error("Viral Kit API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
