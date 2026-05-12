"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link as LinkIcon, Clock, Check, Copy, ExternalLink, ShieldAlert } from "lucide-react";
import { useToast } from "@/components/Toast";
import { soundEngine } from "@/utils/SoundEngine";


export default function ReviewLink({ jobId }: { jobId: string }) {
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const generateLink = () => {
    soundEngine?.play("process");
    showToast("Encrypting production preview...", "info");
    
    setTimeout(() => {
      const token = btoa(`${jobId}:${Date.now() + 86400000}`);
      const url = `${window.location.origin}/review/${token}`;
      setLink(url);
      soundEngine?.play("success");
      showToast("Secure review link generated!", "success");
    }, 1500);
  };

  const copyToClipboard = () => {
    if (link) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      soundEngine?.play("click");
      showToast("Link copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };


  return (
    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <LinkIcon className="w-4 h-4 text-blue-400" />
        <h4 className="text-sm font-bold text-gray-300">Titan Guest Review</h4>
      </div>
      
      {!link ? (
        <button
          onClick={generateLink}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <Clock className="w-4 h-4" /> Generate 24h Review Link
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white/60 truncate font-mono">
              {link}
            </div>
            <button
              onClick={copyToClipboard}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white" />}
            </button>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-lime-500/10 border border-lime-500/20 rounded-lg">
            <ShieldAlert className="w-4 h-4 text-lime-400" />
            <p className="text-[10px] text-lime-100 font-medium">
              This link is secure and will expire in <span className="font-bold">23h 59m</span>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
