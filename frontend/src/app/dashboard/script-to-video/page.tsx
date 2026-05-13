"use client";

import React, { useState } from "react";
import { 
  Zap, Wand2, Sparkles, Cpu, Activity, Play, 
  Settings, Layers, Video, Mic, Layout, ChevronRight,
  Monitor, BarChart3, Radio, MessageSquare, Share2, 
  Send, Calendar, CheckCircle2, Loader2, Brain
} from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { toast } from "react-hot-toast";
import { executeNeuralTask } from "@/utils/NeuralShield";

export default function ScriptToVideoPage() {
  const { deductCredits, incrementRenders, setIsProcessing, isProcessing } = useEditorStore();
  const [topic, setTopic] = useState("");
  const [step, setStep] = useState<'idle' | 'writing' | 'voice' | 'orchestrating' | 'ready'>('idle');
  const [activeTab, setActiveTab] = useState<'Director' | 'BrandKit' | 'Bridge'>('Director');
  const [inputMode, setInputMode] = useState<'Topic' | 'Script'>('Topic');

  const handleCreateVideo = async () => {
    if (!topic) return toast.error("Please enter a topic for the Neural Director");
    
    setIsProcessing(true);
    setStep('writing');
    
    const task = async () => {
      const userStore = (await import("@/store/useUserStore")).useUserStore.getState();
      const response = await fetch(`${(await import("@/utils/api")).default}/api/video/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic, 
          mode: inputMode,
          user_email: userStore.user?.email || "anonymous"
        }),
      });
      if (!response.ok) throw new Error("Neural Director is currently over-leveraged. Retrying in 10s...");
      return await response.json();
    };

    const data = await executeNeuralTask(
      task,
      "Neural Director: Orchestrating Cinema...",
      "Empire Video Rendered! ⚡"
    );

    // Mock progress transition for UI feedback
    setStep('writing');
    setTimeout(() => {
      setStep('voice');
      setTimeout(() => {
        setStep('orchestrating');
        setTimeout(() => {
          setStep('ready');
          deductCredits(25.0);
          setIsProcessing(false);
        }, 3000);
      }, 3000);
    }, 3000);
  };

  return (
    <div className="w-full min-h-screen bg-[#000000] flex flex-col gap-10 p-2 overflow-hidden">
      <div className="flex flex-col gap-3">
         <p className="text-[10px] font-black text-[#262626] uppercase tracking-[6px]">Empire Protocol v2.0</p>
         <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
            NEURAL <span className="text-[#00e5ff]">DIRECTOR</span>.
         </h1>
      </div>

      <div className="flex bg-[#0A0A0B] p-3 rounded-[32px] border border-white/5 w-fit gap-4">
         {['Director', 'BrandKit', 'Bridge'].map(tab => (
            <button 
               key={tab} 
               onClick={() => setActiveTab(tab as any)}
               className={`px-10 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${
                  activeTab === tab ? "bg-[#00e5ff] text-black" : "text-zinc-600 hover:text-white"
               }`}
            >
               {tab}
            </button>
         ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 flex-1">
         
         {/* Automation Controls */}
         <div className="xl:col-span-4 flex flex-col gap-8">
            {activeTab === 'Director' && (
               <div className="bg-[#0A0A0B] border border-white/5 rounded-[48px] p-10 flex flex-col gap-10 shadow-3xl animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="flex flex-col gap-2">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-[#00e5ff] uppercase tracking-widest">Neural Input</span>
                        <div className="flex bg-black p-1 rounded-xl border border-white/5">
                           <button 
                             onClick={() => setInputMode('Topic')}
                             className={`px-4 py-1.5 text-[8px] font-black uppercase rounded-lg transition-all ${inputMode === 'Topic' ? 'bg-[#00e5ff] text-black' : 'text-zinc-600'}`}
                           >Topic</button>
                           <button 
                             onClick={() => setInputMode('Script')}
                             className={`px-4 py-1.5 text-[8px] font-black uppercase rounded-lg transition-all ${inputMode === 'Script' ? 'bg-[#00e5ff] text-black' : 'text-zinc-600'}`}
                           >Script</button>
                        </div>
                     </div>
                     <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                        {inputMode === 'Topic' ? "What's the Topic?" : "Forge Your Script"}
                     </h3>
                  </div>
                  
                  <textarea 
                     value={topic}
                     onChange={(e) => setTopic(e.target.value)}
                     placeholder={inputMode === 'Topic' 
                        ? "e.g. 'Top 5 mind-blowing facts about the James Webb Telescope'..." 
                        : "Paste your master script here for precise neural synthesis..."}
                     className="w-full h-48 bg-black/50 border border-white/10 rounded-3xl p-6 text-[12px] text-white focus:outline-none focus:border-[#00e5ff33] transition-all resize-none font-medium leading-relaxed placeholder:text-zinc-700"
                  />
                  
                  <div className="grid grid-cols-2 gap-6">
                     <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-black text-zinc-500 uppercase">Style</span>
                        <select className="h-12 bg-white/2 rounded-2xl border border-white/5 px-4 text-[10px] font-black uppercase text-zinc-400 focus:outline-none focus:border-[#00e5ff33]">
                           <option>Cinematic</option>
                           <option>Viral Shorts</option>
                           <option>Educational</option>
                           <option>Documentary</option>
                        </select>
                     </div>
                     <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-black text-zinc-500 uppercase">Neural Voice</span>
                        <select className="h-12 bg-white/2 rounded-2xl border border-white/5 px-4 text-[10px] font-black uppercase text-zinc-400 focus:outline-none focus:border-[#00e5ff33]">
                           <option>Starboy (Male)</option>
                           <option>Nova (Female)</option>
                           <option>Empire (Deep)</option>
                        </select>
                     </div>
                  </div>
                  <button 
                     onClick={handleCreateVideo}
                     disabled={step !== 'idle' && step !== 'ready'}
                     className="h-16 bg-[#10b981] text-black text-[11px] font-black uppercase rounded-2xl flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50"
                  >
                     {step === 'idle' ? <><Wand2 size={20} /> Build Empire Video</> : <><Loader2 size={20} className="animate-spin" /> Orchestrating...</>}
                  </button>
               </div>
            )}

            {activeTab === 'BrandKit' && (
               <div className="bg-[#0A0A0B] border border-white/5 rounded-[48px] p-10 flex flex-col gap-10 animate-in fade-in slide-in-from-left-4">
                  <div className="flex flex-col gap-2">
                     <span className="text-[10px] font-black text-[#00e5ff] uppercase tracking-widest">DNA LOCK</span>
                     <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Brand Consistency</h3>
                  </div>
                  <div className="flex flex-col gap-6">
                     <div className="p-6 bg-white/2 border border-white/5 rounded-3xl flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-zinc-500">Primary Colors</span>
                        <div className="flex gap-2">
                           <div className="w-6 h-6 rounded-lg bg-[#00e5ff]"></div>
                           <div className="w-6 h-6 rounded-lg bg-[#a855f7]"></div>
                        </div>
                     </div>
                     <div className="p-6 bg-white/2 border border-white/5 rounded-3xl flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-zinc-500">Brand Logo</span>
                        <div className="w-10 h-10 bg-white/5 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-zinc-700 font-black text-[8px]">LOGO</div>
                     </div>
                  </div>
                  <button className="h-14 bg-[#a855f7]/10 border border-[#a855f7]/30 text-[#a855f7] text-[10px] font-black uppercase rounded-2xl hover:bg-[#a855f7] hover:text-black transition-all">Apply Global DNA</button>
               </div>
            )}
         </div>

         {/* Monitoring Viewport */}
         <div className="xl:col-span-8 flex flex-col gap-8">
            <div className="flex-1 bg-[#0A0A0B] border border-white/5 rounded-[64px] relative overflow-hidden flex items-center justify-center shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-br from-[#00e5ff05] to-transparent"></div>
               
               {step === 'idle' ? (
                  <div className="flex flex-col items-center gap-6 text-zinc-800">
                     <Monitor size={80} />
                     <span className="text-[12px] font-black uppercase tracking-[20px]">Awaiting Commands</span>
                  </div>
               ) : step === 'ready' ? (
                  <div className="w-full h-full p-10 flex flex-col gap-8">
                     <div className="flex-1 bg-black rounded-[48px] border border-white/5 relative overflow-hidden group">
                        <div className="absolute inset-0 flex items-center justify-center">
                           <Play size={64} className="text-[#00e5ff] animate-pulse" />
                        </div>
                     </div>
                     <div className="h-20 bg-white/2 border border-white/5 rounded-3xl flex items-center justify-between px-10">
                        <div className="flex items-center gap-6">
                           <CheckCircle2 className="text-[#10b981]" />
                           <span className="text-[11px] font-black uppercase text-white tracking-widest">Project: {topic.substring(0, 20)}...</span>
                        </div>
                        <button className="h-10 px-8 bg-[#a855f7] text-white text-[9px] font-black uppercase rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)]">Edit in Precision Studio</button>
                     </div>
                  </div>
               ) : (
                  <div className="flex flex-col items-center gap-12">
                     <div className="relative">
                        <div className="w-40 h-40 bg-[#00e5ff] rounded-full animate-ping opacity-10"></div>
                        <Brain size={80} className="text-[#00e5ff] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_30px_#00e5ff]" />
                     </div>
                     <div className="flex flex-col items-center gap-4">
                        <p className="text-[14px] font-black text-[#00e5ff] uppercase tracking-[20px] animate-pulse">
                           {step.toUpperCase()}...
                        </p>
                        <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-[#00e5ff] animate-progress" style={{ width: '60%' }}></div>
                        </div>
                     </div>
                  </div>
               )}
            </div>

            {/* Empire Bridge (Publishing) */}
            {activeTab === 'Bridge' && (
               <div className="h-64 bg-[#0A0A0B] border border-white/5 rounded-[48px] p-10 flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-center">
                     <div className="flex flex-col gap-2">
                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter">The Bridge</h4>
                        <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Multi-Platform Publishing</p>
                     </div>
                     <div className="flex gap-4">
                        {[<Share2 size={18} />, <Send size={18} />, <Calendar size={18} />].map((icon, i) => (
                           <div key={i} className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-zinc-500 hover:text-[#00e5ff] cursor-pointer transition-all">
                              {icon}
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="flex gap-8 overflow-x-auto no-scrollbar">
                     {[
                        { name: 'YouTube', color: '#ff0000', label: 'Y' },
                        { name: 'Instagram', color: '#ff2d55', label: 'I' },
                        { name: 'TikTok', color: '#a855f7', label: 'T' },
                        { name: 'Twitter', color: '#00e5ff', label: 'X' }
                     ].map(platform => (
                        <div key={platform.name} className={`min-w-[180px] p-6 bg-white/2 border border-white/5 rounded-[32px] flex items-center gap-4 group cursor-pointer transition-all hover:border-[${platform.color}33]`}>
                           <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-zinc-700 group-hover:text-white transition-all capitalize font-black text-[10px]" style={{ color: platform.color }}>{platform.label}</div>
                           <span className="text-[10px] font-black uppercase text-zinc-500 group-hover:text-white transition-all">{platform.name}</span>
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </div>

      </div>
    </div>
  );
}
