import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');
  const module = searchParams.get('module') || 'dubbing';
  const format = searchParams.get('format') || 'mp4';
  const langCode = searchParams.get('langCode') || 'hi';

  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    
    // Fetch job details to get the asset URL
    const { data: job, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .or(`dubbing_id.eq.${jobId}`)
      .single();

    if (error || !job) {
      // Fallback for mock jobs
      if (jobId.startsWith('mock_')) {
        return NextResponse.redirect("https://www.w3schools.com/html/mov_bbb.mp4");
      }
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    let assetUrl = job.output_url;
    let filename = `VoxFlow_${module}_${jobId}.mp4`;
    let contentType = "video/mp4";

    if (module === 'license') {
      assetUrl = job.license_url;
      filename = `VoxFlow_License_${jobId}.png`;
      contentType = "image/png";
    } else if (module === 'viral_kit') {
      contentType = "text/plain";
      filename = `VoxFlow_ViralKit_${jobId}.txt`;
      const metadata = `Title: ${job.filename}\nEngine: Aman Studio Proprietary\nLicense: VXF-${jobId.substring(0,8).toUpperCase()}\n\nCaptions: ${JSON.stringify(job.viral_kit?.captions || [])}`;
      return new Response(metadata, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${filename}"`
        }
      });
    }

    if (!assetUrl) {
      return NextResponse.json({ error: "Asset not ready" }, { status: 404 });
    }

    // Stream the asset
    const response = await fetch(assetUrl);
    if (!response.ok) throw new Error("Failed to fetch asset from storage");

    const reader = response.body?.getReader();
    const stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache"
      },
    });

  } catch (error) {
    console.error("Download Error:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}

