import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Simulate backend fetching delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock data for the fetched video
    // In a real app, you'd use yt-dlp or a scraper API here
    const mockVideoId = `fetched_${Math.random().toString(36).substring(7)}`;
    const mockVideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4"; // Sample high-res MP4
    const mockFilename = url.split('/').pop()?.split('?')[0] || "Linked_Video.mp4";

    // Simulate "AI Shorts Architect" logic
    // If it's a YouTube link, assume it's long-form and needs repurposing
    const needsRepurposing = url.includes('youtube.com') || url.includes('youtu.be');

    return NextResponse.json({
      success: true,
      videoId: mockVideoId,
      videoUrl: mockVideoUrl,
      filename: mockFilename,
      repurposed: needsRepurposing,
      message: needsRepurposing ? "Long-form detected. Triggering AI Shorts Architect..." : "Short-form video fetched successfully."
    });

  } catch (error: any) {
    console.error('Fetch API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch video' }, { status: 500 });
  }
}
