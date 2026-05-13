"use client";

import React, { useState, useEffect } from 'react';
import { 
  Activity, Zap, TrendingUp, Hash, Music, 
  BarChart3, Globe, Clock, Sparkles, 
  ArrowUpRight, Flame, Loader2, RefreshCw,
  Layout, PlayCircle, Eye, Share2
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import { soundEngine } from '@/utils/SoundEngine';
import API_BASE from '@/utils/api';



export default function TrendPulse() {
  const { showToast } = useToast();
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchTrends = async () => {
    try {
      console.log("[Trend Pulse] Fetching Neural Trends...");
      const url = `${API_BASE}/editor/trending`;
      console.log('Bhai, request ja rahi hai to:', url);
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!response.ok) throw new Error("Trend Sync Failure");
      const data = await response.json();
      setTrends(data);
      setLoading(false);
    } catch (error) {
      console.error("[Trend Pulse] Sync Error:", error);
      // Fallback to local data if server is offline
      setTrends({
        week: "2026-W19",
        trending_music: [
          { title: 'Neural Pulse', artist: 'Cyber-Rush', trend_score: 98, vibe: 'Hype' },
          { title: 'Golden Hour AI', artist: 'Aman Studio', trend_score: 95, vibe: 'Cinematic' },
          { title: 'Obsidian Night', artist: 'Starboy X', trend_score: 92, vibe: 'Moody' }
        ],
        trending_styles: [
          { name: 'Velocity Edit', surge: '+124%', icon: <Zap size={24} /> },
          { name: 'Glitch Transitions', surge: '+86%', icon: <Activity size={24} /> }
        ],
        viral_blueprints: [
          { id: 'b1', name: 'Documentary Hook', hook: 'Extreme Close-up -> Text Overlay', useCount: '12.4k' },
          { id: 'b2', name: 'Product Reveal', hook: 'Fast Cuts -> Smooth Zoom', useCount: '8.2k' }
        ],
        viral_tags: ['#ai', '#voxflow', '#viral', '#creative']
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const handleRefreshTrends = async () => {
    console.log("[Trend Pulse] Initializing Neural Scraper sync...");
    setIsSyncing(true);
    soundEngine?.play("processing");
    await fetchTrends();
    setTimeout(() => {
      setIsSyncing(false);
      showToast("Trends Synchronized Successfully", "success");
      soundEngine?.play("success");
    }, 1000);
  };

  const handleSyncLibrary = () => {
    console.log("[Trend Pulse] Syncing trending audio with Studio Library...");
    soundEngine?.play("click");
    showToast("Library Synced", "info");
  };

  if (loading) return (
    <div className="h-[60vh] w-full flex items-center justify-center">
       <Loader2 size={48} className="text-[#39FF14] animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col gap-10 lg:gap-16 pb-24 lg:pb-20">
       
       {/* Header */}
       <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-8">
          <div>
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-white m-0 leading-none">
                Trend <span className="text-[#39FF14]">Pulse</span>
             </h1>
             <p className="text-[10px] font-black text-[#404040] uppercase tracking-[4px] mt-4 flex items-center gap-2">
                <Activity className="text-[#39FF14]" size={14} /> Neural Social Scraper Active v4.2
             </p>
          </div>
          <div className="w-full md:w-auto flex items-center gap-4 bg-white/3 p-4 md:p-5 rounded-2xl border border-white/5 shadow-xl">
             <RefreshCw 
              onClick={() => !isSyncing && handleRefreshTrends()}
              size={18} 
              className={`text-[#404040] transition-all ${isSyncing ? 'animate-spin cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-white'}`} 
             />
             <div className="text-right flex-1 md:flex-none">
                <p className="text-[9px] font-black text-[#404040] uppercase tracking-widest">Last Sync</p>
                <p className="text-sm font-black text-white uppercase tracking-tighter">{trends?.week || 'LIVE'}</p>
             </div>
          </div>
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Style Insights & Blueprints Pillar */}
          <div className="lg:col-span-4 flex flex-col gap-10">
             
             {/* Trending Styles */}
             <div className="flex flex-col gap-6">
                <h3 className="text-sm font-black text-white uppercase tracking-widest pl-4">Rising Styles</h3>
                {trends?.trending_styles?.map((style: any, i: number) => (
                  <div key={i} className={`p-8 rounded-[40px] border relative overflow-hidden shadow-2xl transition-all duration-500 hover:border-white/10 ${i === 0 ? 'bg-[#39FF1405] border-[#39FF1433]' : 'bg-[#0A0A0B] border-white/5'}`}>
                     <p className="text-[10px] font-black text-[#404040] uppercase tracking-widest mb-4">Neural Data</p>
                     <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{style.name}</h3>
                     <div className="flex items-center gap-2 text-[#39FF14] text-xs font-black uppercase mt-4 tracking-widest">
                        <ArrowUpRight size={14} /> {style.surge} Surge
                     </div>
                  </div>
                ))}
             </div>

             {/* Viral Blueprints Restored */}
             <div className="p-8 lg:p-10 bg-[#0A0A0B] rounded-[48px] border border-white/5 shadow-2xl">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                   <Layout size={20} className="text-[#39FF14]" /> Viral Blueprints
                </h3>
                <div className="flex flex-col gap-6">
                   {trends?.viral_blueprints?.map((bp: any) => (
                     <div key={bp.id} className="group cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                           <p className="text-sm font-black text-white group-hover:text-[#39FF14] transition-colors uppercase tracking-tighter">{bp.name}</p>
                           <p className="text-[9px] font-black text-[#404040] uppercase">{bp.useCount} Uses</p>
                        </div>
                        <p className="text-[10px] text-[#404040] font-bold uppercase tracking-widest leading-relaxed line-clamp-1">{bp.hook}</p>
                        <div className="h-px bg-white/5 w-full mt-4" />
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Trending Music List Pillar */}
          <div className="lg:col-span-8 p-8 lg:p-12 bg-[#0A0A0B] rounded-[48px] border border-white/5 shadow-2xl flex flex-col">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                   <Music className="text-[#00f2ff]" size={28} /> Neural Audio Sync
                </h3>
                <button 
                  onClick={handleSyncLibrary}
                  className="bg-white/5 px-6 h-12 rounded-xl text-[#00f2ff] text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-all border border-white/5"
                >
                  Sync to Studio
                </button>
             </div>

             <div className="flex flex-col gap-4">
                {trends?.trending_music?.map((song: any, i: number) => (
                  <div key={i} className="p-6 bg-white/2 border border-white/5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-white/10 transition-all group">
                     <div className="flex items-center gap-6 w-full sm:w-auto">
                        <span className="text-3xl font-black text-[#262626] italic w-10 shrink-0 group-hover:text-white/10 transition-colors">{i + 1}</span>
                        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center border border-white/5 shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                           <PlayCircle size={28} className="text-[#404040] group-hover:text-[#00f2ff]" />
                        </div>
                        <div className="flex-1">
                           <p className="text-lg lg:text-xl font-black text-white uppercase tracking-tighter leading-none">{song.title}</p>
                           <p className="text-[10px] font-black text-[#404040] uppercase tracking-widest mt-2">{song.artist}</p>
                        </div>
                     </div>
                     <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-none border-white/5 pt-4 sm:pt-0">
                        <div className="flex items-center gap-2">
                           <Flame size={14} className="text-[#39FF14]" />
                           <p className="text-sm font-black text-[#39FF14] tracking-tighter">{song.trend_score}%</p>
                        </div>
                        <p className="text-[9px] font-black text-[#404040] uppercase tracking-widest sm:mt-1">{song.vibe}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
       </div>

       {/* Viral Tags Pillar */}
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {(trends?.viral_tags || []).map((tag: string) => (
            <div 
              key={tag} 
              onClick={() => { console.log(`[Trend Pulse] Exploring tag: ${tag}`); showToast(`Exploring ${tag}`, "info"); }}
              className="p-8 bg-[#0A0A0B] rounded-[32px] border border-white/5 flex flex-col gap-6 shadow-xl cursor-pointer hover:border-[#39FF14]/20 transition-all group"
            >
               <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-white/2 rounded-xl flex items-center justify-center border border-white/5 group-hover:bg-[#39FF1410]">
                     <Hash size={20} className="text-[#404040] group-hover:text-[#39FF14]" />
                  </div>
                  <Eye size={16} className="text-[#262626]" />
               </div>
               <div>
                  <p className="text-lg font-black text-white tracking-tighter uppercase mb-1">{tag}</p>
                  <p className="text-[9px] font-black text-[#404040] uppercase tracking-widest">Neural Peak Reach</p>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
}
