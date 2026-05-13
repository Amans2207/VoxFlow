"use client";

import React, { useState, useEffect } from "react";
import { 
  Zap, Sparkles, Wand2, Activity, Cpu, Play, 
  Plus, Search, Clock, ArrowUpRight, BarChart3,
  Monitor, Video, Share2, Layers, Brain, Layout,
  X, Send, Mic, Film, CloudLightning, Loader2, ChevronRight
} from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import apiClient from "@/utils/apiClient";
import { useUserStore } from "@/store/useUserStore";

export default function Dashboard() {
  const router = useRouter();
  const { 
    creditBalance, renderCount, engineStatus, 
    generateMagicProject
  } = useEditorStore();
  const { user } = useUserStore();
  const [showMagicBox, setShowMagicBox] = useState(false);
  const [magicPrompt, setMagicPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiCommand, setAiCommand] = useState("");
  const [recentProjects, setRecentProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await apiClient.get(`/api/user/projects?email=${user?.email || 'anonymous'}`);
        setRecentProjects(res.data.slice(0, 3));
      } catch (e) {
        // Fallback for mock mode
        setRecentProjects([
          { id: '1', name: 'Neural_Cinematic_V1.mp4', date: '2h ago' },
          { id: '2', name: 'Viral_Short_Orchestration.mp4', date: '5h ago' },
          { id: '3', name: 'Brand_Identity_Master.mp4', date: '1d ago' },
        ]);
      }
    };
    fetchHistory();
  }, [user]);

  const handleMagicCreate = async () => {
    if (!magicPrompt) return toast.error("Bhai, prompt toh likho!");
    
    const task = async () => {
      const res = await apiClient.post('/api/video/generate', { prompt: magicPrompt, email: user?.email });
      generateMagicProject(magicPrompt); // Local store update
      return res;
    };

    const success = await executeNeuralTask(
      task,
      "Neural Director: Orchestrating Scenes...",
      "Empire Video Ready! Opening Studio... 🎬"
    );

    if (success) {
      setShowMagicBox(false);
      router.push('/dashboard/precision-studio');
    }
  };

  const handleAiCommand = async (e: React.KeyboardEvent | React.MouseEvent) => {
    if ((e as React.KeyboardEvent).key === 'Enter' || e.type === 'click') {
       if (!aiCommand) return;
       
       const task = async () => {
          const res = await apiClient.post('/api/video/generate', { prompt: aiCommand, email: user?.email });
          generateMagicProject(aiCommand);
          return res;
       };

       const success = await executeNeuralTask(
          task,
          `Neural Hub: Executing "${aiCommand}"`,
          "Project Built Successfully ⚡"
       );

       if (success) {
          setAiCommand("");
          router.push('/dashboard/precision-studio');
       }
    }
  };

  return (
    <div className="flex flex-col gap-12 p-2 min-h-screen pb-20">
      
      {/* AI COMMAND BAR */}
      <div className="w-full bg-[#0A0A0B] border border-white/10 rounded-3xl p-4 flex items-center gap-4 shadow-3xl group focus-within:border-[#00e5ff33] transition-all">
        <div className="w-10 h-10 bg-[#00e5ff22] rounded-full flex items-center justify-center text-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.2)]">
          <Zap size={20} className="group-focus-within:animate-pulse" />
        </div>
        <input 
          type="text" 
          value={aiCommand}
          onChange={(e) => setAiCommand(e.target.value)}
          onKeyDown={handleAiCommand}
          placeholder="Command the Titan-X Engine... (e.g. 'Build a 30s TikTok about Crypto trends')" 
          className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder:text-zinc-600 font-bold text-sm tracking-wide"
        />
        <div className="flex items-center gap-2 pr-4">
           <span className="hidden md:block px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black text-zinc-500 uppercase tracking-widest border border-white/5">Auto-Detect ON</span>
           <button onClick={() => handleAiCommand({ key: 'Enter' } as any)} className="px-6 py-2 bg-[#00e5ff] text-black text-[10px] font-black uppercase rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)]">Run Command</button>
        </div>
      </div>
      
      {/* MAGIC BOX MODAL */}
      {showMagicBox && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
           <div className="w-full max-w-3xl bg-[#0A0A0B] border border-white/10 rounded-[48px] shadow-3xl overflow-hidden flex flex-col relative">
              <button onClick={() => setShowMagicBox(false)} className="absolute top-10 right-10 text-zinc-500 hover:text-white transition-all"><X size={24} /></button>
              
              <div className="p-12 flex flex-col gap-10">
                 <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                       <Sparkles size={24} className="text-[#00e5ff]" />
                       <span className="text-[10px] font-black text-[#00e5ff] uppercase tracking-[6px]">Neural Magic Box</span>
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Generative AI Director</h2>
                 </div>

                 <textarea 
                    value={magicPrompt}
                    onChange={(e) => setMagicPrompt(e.target.value)}
                    placeholder="Describe your vision: 'A cinematic 1-minute video about how AI will change the world, fast-paced edits, epic music'..." 
                    className="w-full h-40 bg-black/50 border border-white/5 rounded-[32px] p-8 text-[14px] text-white focus:outline-none focus:border-[#00e5ff33] transition-all resize-none font-medium leading-relaxed placeholder:text-zinc-700"
                 />

                 <div className="grid grid-cols-2 gap-6">
                    <button className="h-16 bg-white/2 border border-white/5 rounded-2xl flex items-center px-6 gap-4 group hover:bg-white/5 transition-all">
                       <Mic size={18} className="text-zinc-500 group-hover:text-[#00e5ff]" />
                       <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Use Voiceover</span>
                    </button>
                    <button className="h-16 bg-white/2 border border-white/5 rounded-2xl flex items-center px-6 gap-4 group hover:bg-white/5 transition-all">
                       <Film size={18} className="text-zinc-500 group-hover:text-[#00e5ff]" />
                       <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Neural Stock</span>
                    </button>
                 </div>

                 <button 
                    onClick={handleMagicCreate}
                    disabled={isGenerating}
                    className="h-20 bg-[#00e5ff] text-black text-[12px] font-black uppercase rounded-2xl flex items-center justify-center gap-4 shadow-[0_0_40px_rgba(0,229,255,0.2)] hover:shadow-[0_0_60px_rgba(0,229,255,0.5)] transition-all disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 size={24} className="animate-spin" /> : <Wand2 size={24} />}
                    {isGenerating ? "Neural Synthesizing..." : "Initialize Magic Creation"}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* HEADER HUD */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
         <div className="md:col-span-8 flex flex-col gap-4">
            <div className="flex items-center gap-4">
               <div className="w-2 h-2 bg-[#00e5ff] rounded-full animate-pulse shadow-[0_0_10px_#00e5ff]"></div>
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[6px]">System Status: {engineStatus}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.85]">
               TITAN-X <br /> <span className="text-[#00e5ff] italic italic-glow">COMMAND.</span>
            </h1>
         </div>
         <div className="md:col-span-4 flex items-center justify-end">
            <button 
               onClick={() => setShowMagicBox(true)}
               className="h-20 px-10 bg-[#a855f7]/5 border border-[#a855f7]/20 rounded-[32px] flex items-center gap-6 group hover:bg-[#a855f7] hover:text-black transition-all duration-500 shadow-2xl"
            >
               <Sparkles size={24} className="text-[#a855f7] group-hover:text-black transition-all group-hover:scale-125" />
               <div className="flex flex-col items-start text-left">
                  <span className="text-[11px] font-black uppercase tracking-widest leading-none">Magic Box</span>
                  <span className="text-[8px] font-bold uppercase tracking-[2px] opacity-40 group-hover:opacity-100">Create with AI</span>
               </div>
            </button>
         </div>
      </div>

      {/* TELEMETRY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {[
            { label: 'Neural Balance', value: `${creditBalance.toFixed(1)}m`, icon: Activity, color: '#00e5ff' },
            { label: 'Active Renders', value: renderCount, icon: Cpu, color: '#a855f7' },
            { label: 'Uptime', value: '99.9%', icon: Zap, color: '#10b981' },
            { label: 'Neural Core', value: 'Titan-X', icon: Brain, color: '#ff2d55' },
         ].map((card, i) => (
            <div key={i} className="p-8 bg-[#0A0A0B] border border-white/10 rounded-[40px] flex flex-col gap-4 group hover:border-[#00e5ff33] transition-all shadow-xl">
               <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-white/2 rounded-2xl flex items-center justify-center text-zinc-500 group-hover:text-white transition-all" style={{ color: card.color }}>
                     <card.icon size={20} />
                  </div>
                  <ArrowUpRight size={20} className="text-zinc-800 group-hover:text-white transition-all" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">{card.label}</span>
                  <span className="text-3xl font-black text-white tracking-tighter">{card.value}</span>
               </div>
            </div>
         ))}
      </div>

      {/* RECENT ORCHESTRATIONS */}
      <div className="flex flex-col gap-8 mt-10">
         <div className="flex justify-between items-end px-4">
            <div className="flex flex-col gap-2">
               <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Recent Orchestrations</h3>
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Neural Master Timeline Records</p>
            </div>
            <button className="text-[10px] font-black text-[#00e5ff] uppercase tracking-widest border-b border-[#00e5ff33]">View All Records</button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentProjects.map((proj, i) => (
               <div key={proj.id} className="aspect-video bg-[#0A0A0B] border border-white/10 rounded-[48px] overflow-hidden group relative cursor-pointer shadow-2xl hover:border-[#00e5ff33] transition-all">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                     <div className="w-16 h-16 bg-[#00e5ff] rounded-full flex items-center justify-center text-black shadow-[0_0_30px_#00e5ff66]">
                        <Play size={24} fill="currentColor" />
                     </div>
                  </div>
                  <div className="absolute bottom-8 left-8 right-8 flex flex-col gap-2">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-[#00e5ff] rounded-full animate-pulse"></div>
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Rendered {proj.date}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-lg font-black text-white uppercase tracking-tighter truncate w-40">{proj.name}</span>
                        <ChevronRight size={18} className="text-zinc-600 group-hover:text-[#00e5ff] transition-all" />
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}

