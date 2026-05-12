"use client";

import React, { useState } from 'react';
import { 
  Scissors, Play, Pause, SkipBack, SkipForward, 
  Type, Music, Wand2, Filter, Layers, 
  Trash2, Sliders, ChevronLeft, Share2, 
  Split, Eraser, Zap, Gauge, Crop, Plus, Cpu, Activity,
  Download, CheckCircle2
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import { soundEngine } from '@/utils/SoundEngine';

export default function MobileStudio() {
  const { showToast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTool, setActiveTool] = useState('Edit');

  const tools = [
    { name: 'Edit', icon: <Scissors size={20} /> },
    { name: 'Audio', icon: <Music size={20} /> },
    { name: 'Text', icon: <Type size={20} /> },
    { name: 'Overlay', icon: <Layers size={20} /> },
    { name: 'Effects', icon: <Wand2 size={20} /> },
    { name: 'Split', icon: <Split size={20} /> },
    { name: 'Speed', icon: <Gauge size={20} /> },
  ];

  const handleToolSelect = (name: string) => {
    console.log(`[Mobile Studio] Tool activated: ${name}`);
    setActiveTool(name);
    soundEngine?.play("click");
  };

  const handleAiSync = () => {
    console.log("[Mobile Studio] Initializing Neural AI Sync...");
    soundEngine?.play("process");
    showToast("AI Sync Sequence Active", "success");
  };

  const handleExport = () => {
    console.log("[Mobile Studio] Export sequence triggered.");
    soundEngine?.play("process");
    showToast("Exporting 4K Master...", "info");
  };

  return (
    <div className="flex flex-col gap-8 lg:gap-16 pb-24 lg:pb-20">
       
       {/* Header */}
       <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div>
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-white m-0 leading-none">
                Mobile <span className="text-[#CCFF00]">Studio</span>
             </h1>
             <p className="text-[10px] font-black text-[#404040] uppercase tracking-[4px] mt-4 flex items-center gap-2">
                <Activity size={14} className="text-[#CCFF00]" /> Neural Precision Interface v4.2 PRO
             </p>
          </div>
          <div className="w-full md:w-auto flex items-center gap-4 bg-white/3 p-4 md:p-5 rounded-2xl border border-white/5 shadow-xl">
             <Cpu size={18} className="text-[#CCFF00]" />
             <div className="text-right flex-1 md:flex-none">
                <p className="text-[9px] font-black text-[#404040] uppercase tracking-widest">Precision Mode</p>
                <p className="text-sm font-black text-white uppercase tracking-tighter">HAPTIC SYNC</p>
             </div>
          </div>
       </header>

       {/* Editor Layout - Column on Mobile, Grid on Desktop */}
       <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Main Workspace (Preview + Timeline) */}
          <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-10">
             
             {/* Preview Area */}
             <div className="aspect-[9/16] md:aspect-video lg:h-[500px] bg-black rounded-[48px] border border-white/5 relative overflow-hidden flex items-center justify-center shadow-2xl group">
                <div className="h-full lg:h-[90%] aspect-[9/16] bg-[#0A0A0B] rounded-3xl border border-white/10 overflow-hidden relative shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                   <img src="https://images.pexels.com/photos/3129634/pexels-photo-3129634.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="w-full h-full object-cover opacity-80" alt="Preview" />
                   {!isPlaying && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity">
                        <div onClick={() => setIsPlaying(true)} className="w-20 h-20 bg-[#CCFF00] rounded-full flex items-center justify-center text-black cursor-pointer shadow-[0_0_50px_rgba(204,255,0,0.4)] active:scale-90 transition-all">
                           <Play size={32} className="fill-current translate-x-1" />
                        </div>
                     </div>
                   )}
                </div>
                
                {/* Control Bar Overlay */}
                <div className="absolute bottom-8 flex items-center gap-8 bg-black/60 backdrop-blur-2xl px-8 py-4 rounded-[32px] border border-white/10 shadow-2xl transition-transform group-hover:translate-y-[-10px]">
                   <SkipBack size={20} className="text-[#404040] hover:text-white cursor-pointer active:scale-90 transition-all" />
                   <button onClick={() => { setIsPlaying(!isPlaying); soundEngine?.play("click"); }} className="bg-transparent border-none cursor-pointer active:scale-90 transition-all">
                      {isPlaying ? <Pause size={28} className="text-white fill-white" /> : <Play size={28} className="text-white fill-white" />}
                   </button>
                   <SkipForward size={20} className="text-[#404040] hover:text-white cursor-pointer active:scale-90 transition-all" />
                </div>
             </div>

             {/* Timeline View */}
             <div className="p-6 bg-[#0A0A0B] rounded-[48px] border border-white/5 flex flex-col gap-6 overflow-hidden relative shadow-2xl">
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white z-10 shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                
                {/* Audio Track */}
                <div className="h-10 bg-[#3b82f61a] rounded-2xl border border-[#3b82f633] flex items-center px-4 overflow-hidden">
                   <Music size={14} className="text-[#3b82f6] mr-4 shrink-0" />
                   <div className="flex-1 flex gap-[2px] items-center h-full">
                      {Array.from({ length: 60 }).map((_, i) => <div key={i} className="flex-1 rounded-full bg-[#3b82f6] transition-all duration-500" style={{ height: `${Math.random() * 60 + 20}%` }} />)}
                   </div>
                </div>

                {/* Video Track */}
                <div className="h-20 bg-[#CCFF000d] rounded-2xl border border-[#CCFF001a] flex gap-2 p-2 overflow-x-auto no-scrollbar snap-x">
                   {Array.from({ length: 12 }).map((_, i) => (
                     <div key={i} className="h-full aspect-square bg-black rounded-lg overflow-hidden border border-white/10 shrink-0 snap-center">
                        <img src={`https://picsum.photos/seed/${i + 20 + "studio"}/200/200`} className="w-full h-full object-cover opacity-60" />
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Tools Panel */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-10">
             <div className="p-8 lg:p-10 bg-[#0A0A0B] rounded-[48px] border border-white/5 flex flex-col shadow-2xl h-full">
                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-10">Tool Orchestrator</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4 lg:gap-6 overflow-y-auto max-h-[400px] lg:max-h-none no-scrollbar">
                   {tools.map((tool) => (
                     <div 
                        key={tool.name} 
                        onClick={() => handleToolSelect(tool.name)}
                        className={`p-6 rounded-[32px] border flex flex-col items-center gap-4 cursor-pointer active:scale-95 transition-all group ${activeTool === tool.name ? 'bg-white/5 border-white/20' : 'bg-white/2 border-white/5 hover:border-white/10'}`}
                     >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${activeTool === tool.name ? 'bg-white text-black' : 'bg-black text-[#404040] group-hover:text-white'}`}>
                           {tool.icon}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${activeTool === tool.name ? 'text-white' : 'text-[#404040]'}`}>{tool.name}</span>
                     </div>
                   ))}
                   <div 
                    onClick={handleAiSync}
                    className="p-6 bg-[#CCFF000d] rounded-[32px] border border-[#CCFF00] flex flex-col items-center gap-4 cursor-pointer active:scale-95 transition-all group shadow-[0_0_20px_rgba(204,255,0,0.1)]"
                   >
                        <div className="w-14 h-14 bg-[#CCFF00] rounded-2xl flex items-center justify-center text-black shadow-lg">
                           <Zap size={24} />
                        </div>
                        <span className="text-[10px] font-black text-[#CCFF00] uppercase tracking-widest">AI SYNC</span>
                   </div>
                </div>
             </div>
             
             <button 
                onClick={handleExport}
                className="h-16 lg:h-20 w-full bg-white text-black font-black rounded-[24px] text-[11px] uppercase tracking-[4px] border-none shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95 transition-all cursor-pointer"
             >
                Export Master
             </button>
          </div>
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
