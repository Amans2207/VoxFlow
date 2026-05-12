"use client";

import React, { useState } from 'react';
import { 
  Upload, Zap, Loader2, Play, CheckCircle2, 
  Scissors, Music, Sparkles, Wand2, Rocket, 
  Share2, ChevronRight, Activity, Cpu 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/Toast';
import { soundEngine } from '@/utils/SoundEngine';

export default function AutoPilot() {
  const { showToast } = useToast();
  const [clips, setClips] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('Hype Style');

  const startOrchestration = () => {
    if (clips.length === 0) {
      showToast("Please inject raw sequence clips first", "error");
      return;
    }
    console.log(`[Auto-Pilot] Initializing Orchestration with style: ${selectedStyle}`);
    setIsProcessing(true);
    setProgress(0);
    soundEngine?.play("process");
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setGeneratedVideo("https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-neon-lights-42531-large.mp4");
          setIsProcessing(false);
          soundEngine?.play("success");
          showToast("Neural Orchestration Complete!", "success");
          return 100;
        }
        return p + 2;
      });
    }, 80);
  };

  const handleClipSelection = () => {
    console.log("[Auto-Pilot] Clip selection triggered");
    setClips([1, 2, 3]);
    soundEngine?.play("click");
    showToast("3 Clips Queued for Analysis", "info");
  };

  return (
    <div className="flex flex-col gap-10 lg:gap-16 pb-24 lg:pb-20">
       
       {/* Header */}
       <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-8">
          <div>
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-white m-0 leading-none">
                Auto <span className="text-[#00f2ff]">Pilot</span>
             </h1>
             <p className="text-[10px] font-black text-[#404040] uppercase tracking-[4px] mt-4 flex items-center gap-2">
                <Zap size={14} className="text-[#00f2ff]" /> Zero-Effort Neural Production v4.2 PRO
             </p>
          </div>
          <div className="w-full md:w-auto flex items-center gap-4 bg-[#00f2ff1a] p-5 rounded-2xl border border-[#00f2ff33] shadow-xl">
             <div className="text-right flex-1 md:flex-none">
                <p className="text-[9px] font-black text-[#00f2ff] uppercase tracking-widest">System Status</p>
                <p className="text-lg font-black text-white uppercase tracking-tighter">ORCHESTRATING</p>
             </div>
             <Activity size={24} className="text-[#00f2ff] animate-pulse" />
          </div>
       </header>

       <AnimatePresence mode="wait">
         {isProcessing ? (
           <motion.div 
            key="processing" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-[400px] lg:h-[500px] flex flex-col items-center justify-center gap-10"
           >
              <div className="w-32 h-32 rounded-full border-2 border-[#00f2ff1a] flex items-center justify-center relative">
                 <div className="absolute inset-[-10px] border-2 border-[#00f2ff] border-t-transparent rounded-full animate-spin" />
                 <Cpu className="text-[#00f2ff] animate-pulse" size={48} />
              </div>
              <div className="text-center">
                 <h2 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter">Neural Stitching... {progress}%</h2>
                 <p className="text-[10px] font-black text-[#404040] uppercase tracking-[4px] mt-4">Syncing Energy Peaks & Hype Tracks</p>
              </div>
           </motion.div>
         ) : !generatedVideo ? (
           <motion.div 
            key="upload" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16"
           >
              <div 
                className="lg:col-span-2 h-[350px] lg:h-[450px] bg-white/2 border-2 border-dashed border-white/5 rounded-[48px] flex flex-col items-center justify-center text-center cursor-pointer active:scale-[0.98] transition-transform p-8 shadow-2xl"
                onClick={handleClipSelection}
              >
                 <div className="w-20 h-20 bg-white/3 rounded-3xl flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
                    <Upload size={32} className="text-[#00f2ff]" />
                 </div>
                 <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Inject Raw Sequence</h2>
                 <p className="text-[11px] text-[#404040] font-bold uppercase tracking-widest max-w-[300px] my-6 leading-relaxed">
                    Upload 3+ raw clips for automatic neural orchestration.
                 </p>
                 {clips.length > 0 && <span className="text-[#00f2ff] text-[10px] font-black tracking-widest">{clips.length} CLIPS QUEUED</span>}
              </div>

              <div className="flex flex-col gap-8">
                 <div className="p-8 lg:p-10 bg-[#0A0A0B] rounded-[48px] border border-white/5 shadow-2xl">
                    <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-8">Orchestration Style</h3>
                    <div className="flex flex-col gap-4">
                       {['Hype Style', 'Educational', 'Cinematic'].map((s) => (
                         <button 
                            key={s} 
                            onClick={() => { setSelectedStyle(s); soundEngine?.play("click"); }}
                            className={`h-14 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest text-left border transition-all ${selectedStyle === s ? 'bg-[#00f2ff0d] border-[#00f2ff] text-[#00f2ff]' : 'bg-transparent border-white/5 text-[#404040]'}`}
                         >
                            {s}
                         </button>
                       ))}
                    </div>
                 </div>
                 <button 
                   onClick={startOrchestration}
                   className="h-16 w-full bg-[#00f2ff] text-black font-black rounded-2xl text-[11px] uppercase tracking-[4px] border-none shadow-[0_20px_40px_rgba(0,242,255,0.2)] active:scale-95 transition-all cursor-pointer"
                 >
                   Launch Orchestration
                 </button>
              </div>
           </motion.div>
         ) : (
           <motion.div 
            key="result" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16"
           >
              <div className="lg:col-span-2 flex flex-col gap-8 lg:gap-10">
                 <div className="aspect-video lg:h-[500px] bg-black rounded-[48px] border border-white/5 overflow-hidden shadow-2xl relative">
                    <video src={generatedVideo} className="w-full h-full object-cover" controls autoPlay />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="h-14 lg:h-16 bg-white text-black font-black rounded-2xl text-[10px] uppercase tracking-[4px] shadow-2xl active:scale-95 transition-all">Export Pro</button>
                    <button className="h-14 lg:h-16 bg-[#00f2ff1a] text-[#00f2ff] border border-[#00f2ff33] font-black rounded-2xl text-[10px] uppercase tracking-[4px] active:scale-95 transition-all">Open in Studio</button>
                 </div>
              </div>

              <div className="flex flex-col gap-8 lg:gap-10">
                 <div className="p-8 lg:p-10 bg-[#0A0A0B] rounded-[48px] border border-white/5 shadow-2xl">
                    <p className="text-[10px] font-black text-[#00f2ff] uppercase tracking-widest mb-10">Neural Metadata</p>
                    <div className="flex flex-col gap-8">
                       <div>
                          <p className="text-[9px] font-black text-[#404040] uppercase tracking-widest mb-2">TITLE</p>
                          <p className="text-xl font-black text-white tracking-tighter">How to Scale AI Production in 2026 🚀</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-[#404040] uppercase tracking-widest mb-2">DESCRIPTION</p>
                          <p className="text-xs font-bold text-[#404040] uppercase tracking-widest leading-relaxed">Stop wasting hours on manual edits. VoxFlow's proprietary engine just stitched these clips with 0.5s cross-fades...</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-[#404040] uppercase tracking-widest mb-2">VIRAL SCORE</p>
                          <p className="text-5xl lg:text-6xl font-black text-[#ccff00] tracking-tighter">92%</p>
                       </div>
                    </div>
                 </div>
                 <button className="h-16 w-full bg-[#ccff00] text-black font-black rounded-2xl text-[11px] uppercase tracking-[4px] shadow-[0_20px_40px_rgba(204,255,0,0.2)] active:scale-95 transition-all">Publish Directly</button>
              </div>
           </motion.div>
         )}
       </AnimatePresence>

       <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
