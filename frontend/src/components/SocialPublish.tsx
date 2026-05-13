"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Loader2, Sparkles, Share2 } from "lucide-react";
import { useToast } from "@/components/Toast";
import { soundEngine } from "@/utils/SoundEngine";


const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

interface SocialPublishProps {
  jobId: string;
  videoUrl: string;
  captions: string[];
  hashtags: string;
}

export default function SocialPublish({ jobId, videoUrl, captions, hashtags }: SocialPublishProps) {
  const [isPublishing, setIsPublishing] = useState<string | null>(null);
  const [published, setPublished] = useState<string[]>([]);
  const { showToast } = useToast();


  const handlePublish = async (platform: string) => {
    setIsPublishing(platform);
    soundEngine?.play("processing");
    
    // Phase 1: Metadata Sync
    showToast(`Syncing viral metadata to ${platform}...`, "info");
    await new Promise(r => setTimeout(r, 1500));

    try {
      const response = await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          platform, 
          jobId, 
          metadata: { captions, hashtags } 
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setPublished(prev => [...prev, platform]);
        soundEngine?.play("success");
        showToast(`Successfully broadcast to ${platform}!`, "success");
      }
    } catch (err) {
      soundEngine?.play("click");
      showToast(`Broadcasting failed for ${platform}`, "error");
    } finally {
      setIsPublishing(null);
    }
  };


  return (
    <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-bold text-gray-300">One-Click Global Publish</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-lime-500/10 border border-lime-500/20 text-[10px] font-bold text-lime-400 uppercase tracking-widest">
          <Sparkles className="w-3 h-3" /> Viral Sync Active
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handlePublish("YouTube")}
          disabled={published.includes("YouTube") || !!isPublishing}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
            published.includes("YouTube")
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-[#FF0000]/10 hover:bg-[#FF0000]/20 text-white border border-[#FF0000]/20"
          }`}
        >
          {isPublishing === "YouTube" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : published.includes("YouTube") ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <YoutubeIcon className="w-4 h-4" />
          )}
          <span className="text-sm font-bold">{published.includes("YouTube") ? "Published" : "YouTube"}</span>
        </button>

        <button
          onClick={() => handlePublish("Instagram")}
          disabled={published.includes("Instagram") || !!isPublishing}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
            published.includes("Instagram")
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-[#E1306C]/10 hover:bg-[#E1306C]/20 text-white border border-[#E1306C]/20"
          }`}
        >
          {isPublishing === "Instagram" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : published.includes("Instagram") ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <InstagramIcon className="w-4 h-4" />
          )}
          <span className="text-sm font-bold">{published.includes("Instagram") ? "Published" : "Instagram"}</span>
        </button>
      </div>

      <AnimatePresence>
        {published.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
              <Send className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-blue-100 leading-relaxed">
                <span className="font-bold">Success!</span> Video posted to your linked accounts with AI-generated metadata.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
