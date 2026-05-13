"use client";

import React, { useState } from 'react';
import { 
  Film, Zap, Sparkles, TrendingUp, Share2, Download, 
  Eye, Play, Search, Filter, ArrowUpRight, Clock,
  Flame, BarChart3, ChevronRight, Activity 
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import { soundEngine } from '@/utils/SoundEngine';

export default function ViralVault() {
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState('ALL');

  const viralClips = [
    { id: 'v1', title: 'The Hormozi Paradox', views: '2.4M', score: 98, type: 'Reel', duration: '0:58', color: '#CCFF00' },
    { id: 'v2', title: 'Neural Dub: Spanish 101', views: '1.1M', score: 94, type: 'Dubbed', duration: '1:20', color: '#00f2ff' },
    { id: 'v3', title: 'Future of AI Design', views: '4.8M', score: 99, type: 'Shorts', duration: '0:15', color: '#ff453a' },
    { id: 'v4', title: 'Productivity Hacks v4', views: '950K', score: 89, type: 'Reel', duration: '0:45', color: '#CCFF00' },
  ];

  const handleLaunchMaster = () => {
    console.log("[Viral Vault] Launching Master Sequence: The Hormozi Paradox");
    soundEngine?.play("processing");
    showToast("Master Sequence Loading...", "info");
  };

  const handleShare = (title: string) => {
    console.log(`[Viral Vault] Sharing clip: ${title}`);
    soundEngine?.play("click");
    showToast("Share Link Copied", "success");
  };

  const handleOpenStats = (title: string) => {
    console.log(`[Viral Vault] Opening Neural Insights for: ${title}`);
    soundEngine?.play("click");
    showToast("Opening Analytics...", "info");
  };

  return (
    <div className="flex flex-col gap-10 lg:gap-16 pb-24 lg:pb-20">
       
       {/* Header */}
       <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-8">
          <div>
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-white m-0 leading-none">
                Viral <span className="text-[#CCFF00]">Vault</span>
             </h1>
             <p className="text-[10px] font-black text-[#404040] uppercase tracking-[4px] mt-4 flex items-center gap-2">
                <Flame size={14} className="text-[#CCFF00]" /> High-Retention Neural Archive v4.2 PRO
             </p>
          </div>
          <div className="w-full md:w-auto flex items-center gap-4 bg-[#CCFF001a] p-5 rounded-2xl border border-[#CCFF0033] shadow-xl">
             <div className="text-right flex-1 md:flex-none">
                <p className="text-[9px] font-black text-[#CCFF00] uppercase tracking-widest">Network Status</p>
                <p className="text-lg font-black text-white uppercase tracking-tighter">LIVE SYNCING</p>
             </div>
             <Activity size={24} className="text-[#CCFF00] animate-pulse" />
          </div>
       </header>

       {/* Hero / Latest - Responsive Column/Row Stack */}
       <div className="p-8 lg:p-16 bg-[#0A0A0B] rounded-[48px] lg:rounded-[56px] border border-white/5 flex flex-col-reverse lg:grid lg:grid-cols-12 gap-12 lg:gap-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-gradient-to-l from-[#CCFF000d] to-transparent pointer-events-none" />
          
          <div className="lg:col-span-7 flex flex-col justify-center">
             <div className="flex items-center gap-3 mb-8">
                <div className="px-4 py-1.5 bg-[#CCFF001a] text-[#CCFF00] text-[9px] font-black rounded-full border border-[#CCFF0033] flex items-center gap-2 tracking-widest">
                   <Zap size={10} /> TRENDING MASTER
                </div>
             </div>
             <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-8">
                THE HORMOZI<br/>PARADOX.
             </h2>
             <p className="text-base lg:text-lg font-medium text-[#404040] leading-relaxed mb-10 max-w-[500px] uppercase tracking-wide">
                High-retention neural edit optimized with deep-learning beat sync and dynamic captions.
             </p>
             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                <button 
                  onClick={handleLaunchMaster}
                  className="h-16 px-10 bg-[#CCFF00] text-black font-black rounded-2xl text-[11px] uppercase tracking-[4px] border-none shadow-[0_20px_40px_rgba(204,255,0,0.2)] active:scale-95 transition-all flex items-center gap-3 w-full sm:w-auto"
                >
                   Launch Master <ArrowUpRight size={18} />
                </button>
                <div className="flex items-center gap-4">
                   <div className="flex -space-x-3">
                      {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-[#1A1A1B] border-2 border-[#0A0A0B]" />)}
                   </div>
                   <span className="text-[9px] font-black text-[#262626] uppercase tracking-widest">+12.4K DEPLOYED</span>
                </div>
             </div>
          </div>

          <div className="lg:col-span-5 flex items-center justify-center">
             <div className="w-full max-w-[320px] aspect-[9/16] bg-black rounded-[40px] border border-white/10 overflow-hidden lg:rotate-[4deg] shadow-[0_40px_80px_rgba(0,0,0,0.5)] relative group cursor-pointer" onClick={handleLaunchMaster}>
                <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-16 h-16 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center border border-white/20 group-hover:scale-125 transition-transform">
                      <Play size={28} className="text-white fill-white translate-x-0.5" />
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* Filter Hub - Scrollable */}
       <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="w-full md:w-auto flex gap-2 p-1.5 bg-[#0A0A0B] rounded-2xl border border-white/5 overflow-x-auto no-scrollbar snap-x">
             {['ALL', 'REELS', 'DUBBED', 'SHORTS'].map((cat) => (
               <button 
                key={cat} 
                onClick={() => { setActiveCategory(cat); soundEngine?.play("click"); }} 
                className={`h-11 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer border-none transition-all snap-center whitespace-nowrap ${activeCategory === cat ? 'bg-[#CCFF00] text-black shadow-lg' : 'bg-transparent text-[#404040] hover:text-white/60'}`}
               >
                 {cat}
               </button>
             ))}
          </div>
          <div className="w-full md:w-auto flex items-center gap-4 bg-[#0A0A0B] p-4 lg:px-6 rounded-2xl border border-white/5 shadow-xl">
             <Search size={18} className="text-[#404040]" />
             <input type="text" placeholder="SEARCH VAULT..." className="bg-transparent border-none text-white text-[11px] font-black uppercase tracking-widest outline-none flex-1 md:w-48" />
          </div>
       </div>

       {/* Grid Switcher */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {viralClips.map((clip) => (
            <div key={clip.id} className="bg-[#0A0A0B] rounded-[48px] border border-white/5 overflow-hidden flex flex-col shadow-2xl group hover:border-white/10 transition-all">
               <div className="aspect-[3/4] relative bg-black overflow-hidden">
                  <img src={`https://picsum.photos/seed/${clip.id + "vault"}/400/600`} className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 left-6">
                     <div className="px-3 py-1.5 bg-black/60 backdrop-blur-xl text-[8px] font-black rounded-full border border-white/10 flex items-center gap-2 tracking-widest" style={{ color: clip.color }}>
                        <div className="w-1.5 h-1.5 bg-current rounded-full" /> {clip.type}
                     </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                     <h4 className="text-xl lg:text-2xl font-black text-white uppercase tracking-tighter mb-4">{clip.title}</h4>
                     <div className="flex justify-between items-end">
                        <div>
                           <p className="text-[8px] font-black text-[#404040] uppercase tracking-widest mb-1">VIRAL SCORE</p>
                           <p className="text-2xl font-black" style={{ color: clip.color }}>{clip.score}%</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[8px] font-black text-[#404040] uppercase tracking-widest mb-1">VIEWS</p>
                           <p className="text-sm font-black text-white">{clip.views}</p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="p-6 flex gap-3">
                  <button 
                    onClick={() => handleShare(clip.title)}
                    className="h-14 flex-1 bg-white/2 border border-white/5 rounded-2xl text-white text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all hover:bg-white/5"
                  >
                    SHARE
                  </button>
                  <button 
                    onClick={() => handleOpenStats(clip.title)}
                    className="w-14 h-14 bg-[#CCFF001a] border border-[#CCFF0033] rounded-2xl flex items-center justify-center text-[#CCFF00] active:scale-95 transition-all hover:bg-[#CCFF002a]"
                  >
                    <BarChart3 size={20} />
                  </button>
               </div>
            </div>
          ))}
       </div>

       <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
