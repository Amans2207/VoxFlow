import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { platform, jobId, metadata } = await request.json();

    // Simulate real API latencies for YouTube/Instagram
    await new Promise(r => setTimeout(r, 3000));

    console.log(`[API MOCK] Publishing to ${platform}...`);
    console.log(`[API MOCK] Metadata:`, metadata);

    // Mock successful publishing
    return NextResponse.json({
      success: true,
      platform,
      postUrl: platform === 'YouTube' 
        ? `https://youtube.com/shorts/mock_${jobId}` 
        : `https://instagram.com/p/mock_${jobId}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Publishing failed' }, { status: 500 });
  }
}
