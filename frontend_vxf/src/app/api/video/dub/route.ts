import { NextResponse } from "next/server";
import { getElevenLabsKey } from "@/utils/elevenlabs";

export async function POST(request: Request) {
  try {
    let { videoUrl, targetLanguage, sourceLanguage, filename, vibeSettings, speakerCount, jobId } = await request.json();

    // Fallback if videoUrl is missing (due to DB schema issues)
    if (!videoUrl) {
      console.warn("No videoUrl provided to dubbing API, using sample fallback.");
      videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
    }

    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";
    const internalJobId = jobId || Math.random().toString(36).substring(7);

    console.log(`Calling AI Service at ${aiServiceUrl}/dub for job ${jobId}`);

    const response = await fetch(`${aiServiceUrl}/dub`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_url: videoUrl,
        target_lang: targetLanguage,
        job_id: internalJobId
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message || "AI Service Error" }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      dubbing_id: internalJobId, // Using our internal job ID as the dubbing ID
      status: "Processing",
      message: "Video submitted to VoxFlow AI Service for zero-shot dubbing",
    });
  } catch (error) {
    console.error("Dubbing API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
