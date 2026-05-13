"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, Zap, Play, CheckCircle2, Loader2, Sparkles, Wand2 } from "lucide-react";

interface Short {
  id: string;
  timestamp: string;
  hookScore: number;
  description: string;
  status: "pending" | "processing" | "ready";
}

export default function ShortsGenerator({ jobId }: { jobId: string }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [shorts, setShorts] = useState<Short[] | null>(null);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate AI hook detection
    setTimeout(() => {
      setShorts([
        { id: "1", timestamp: "00:45 - 01:15", hookScore: 98, description: "Key takeaway: Market disruption", status: "ready" },
        { id: "2", timestamp: "02:10 - 02:40", hookScore: 92, description: "Controversial statement on growth", status: "ready" },
        { id: "3", timestamp: "04:15 - 04:45", hookScore: 89, description: "The 'Aha' moment of the tutorial", status: "ready" },
      ]);
      setIsAnalyzing(false);
    }, 4000);
  };

  return (
    <div className="mt-8 p-6 bg-white/5 rounded-3xl border border-white/10 overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
        <Scissors className="w-24 h-24 text-blue-400" />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-lime-400" /> AI Shorts Architect
          </h3>
          <p className="text-xs text-white/50 mt-1">Identify viral hooks & crop to 9:16 vertical.</p>
        </div>
        {!shorts && !isAnalyzing && (
          <button 
            onClick={startAnalysis}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <Sparkles className="w-3 h-3" /> Analyze for Hooks
          </button>
        )}
      </div>

      {isAnalyzing && (
        <div className="py-12 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <div className="text-center">
            <p className="text-sm font-bold text-white mb-1">Analyzing Transcript Sentiment</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Identifying high-retention segments...</p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {shorts && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {shorts.map((short) => (
              <div key={short.id} className="p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between group/item hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-xs">
                    {short.hookScore}%
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{short.description}</h4>
                    <span className="text-[10px] text-white/40 font-mono">{short.timestamp}</span>
                  </div>
                </div>
                <button className="p-3 bg-white/5 hover:bg-blue-600 rounded-xl transition-all opacity-0 group-item-hover:opacity-100">
                  <Play className="w-4 h-4 fill-current" />
                </button>
              </div>
            ))}
            
            <div className="mt-6 flex gap-2">
              <button className="flex-1 py-3 bg-lime-500 text-black text-xs font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                <Wand2 className="w-4 h-4" /> Render All as 9:16 Shorts
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
