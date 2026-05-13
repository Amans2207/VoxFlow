"use client";

import React, { useState } from "react";
import { 
  ImageIcon, Wand2, Type, Layout, MousePointer2, 
  Download, Save, Sparkles, Cpu, Layers, Maximize2, Trash2
} from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { toast } from "react-hot-toast";
import { soundEngine } from "@/utils/SoundEngine";

export default function DesignLabPage() {
  const { creditBalance, deductCredits, selectedTool, setSelectedTool } = useEditorStore();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeLayer, setActiveLayer] = useState<string | null>("Background");

  const handleToolClick = (toolId: string, label: string) => {
    soundEngine.play('click');
    setSelectedTool(toolId as any);
    toast.success(`${label} Activated`);
  };

  const handleGenerateThumbnail = () => {
    if (!prompt) return toast.error("Please enter a neural prompt");
    soundEngine.play('processing');
    setIsGenerating(true);
    toast.loading("Generating Neural Thumbnail...", { id: "design" });
    
    setTimeout(() => {
      setIsGenerating(false);
      soundEngine.play('success');
      toast.success("AI Thumbnail Ready ⚡", { id: "design" });
      deductCredits(5.0);
    }, 5000);
  };

  return (
    <div className="w-full min-h-screen bg-[#000000] flex flex-col gap-10 p-2 overflow-hidden">
      <div className="flex flex-col gap-3">
         <p className="text-[10px] font-black text-[#262626] uppercase tracking-[6px]">Neural Design Studio</p>
         <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
            THUMBNAIL <span className="text-[#00e5ff]">GEN</span>.
         </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 flex-1">
         
         {/* Design Tools Sidebar */}
         <div className="xl:col-span-3 flex flex-col gap-8">
            <div className="bg-[#0A0A0B] border border-white/5 rounded-[48px] p-8 flex flex-col gap-8 shadow-3xl">
               <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Toolbox</span>
                  <div className="grid grid-cols-2 gap-4">
                     {[
                        { id: 'select', icon: <MousePointer2 size={18} />, label: 'Pointer' },
                        { id: 'text', icon: <Type size={18} />, label: 'Text' },
                        { id: 'assets', icon: <Layout size={18} />, label: 'Shapes' },
                        { id: 'ai', icon: <Sparkles size={18} />, label: 'AI Draw' },
                     ].map(tool => (
                         <button 
                            key={tool.id} 
                            onClick={() => handleToolClick(tool.id, tool.label)}
                            className={`h-16 border rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group ${
                               selectedTool === tool.id ? "bg-[#00e5ff] border-[#00e5ff] text-black shadow-lg" : "bg-white/2 border-white/5 hover:border-white/10"
                            }`}
                         >
                            <div className={selectedTool === tool.id ? "text-black" : "text-zinc-600 group-hover:text-[#00e5ff]"}>{tool.icon}</div>
                            <span className={`text-[8px] font-black uppercase ${selectedTool === tool.id ? 'text-black/60' : 'text-zinc-700'}`}>{tool.label}</span>
                         </button>
                     ))}
                  </div>
               </div>

               <div className="flex flex-col gap-4 pt-8 border-t border-white/5">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Neural Prompt</span>
                  <textarea 
                     value={prompt}
                     onChange={(e) => setPrompt(e.target.value)}
                     placeholder="A futuristic cyber-hacker in a neon city, cinematic lighting, 8k resolution..."
                     className="w-full h-32 bg-black/50 border border-white/5 rounded-2xl p-4 text-[11px] text-white focus:outline-none focus:border-[#00e5ff33] transition-all resize-none font-medium"
                  />
                  <button 
                     onClick={handleGenerateThumbnail}
                     disabled={isGenerating}
                     className="h-14 bg-[#00e5ff] text-black text-[10px] font-black uppercase rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50"
                  >
                     <Wand2 size={16} />
                     Generate Base
                  </button>
               </div>
            </div>

            <div className="bg-[#0A0A0B] border border-white/5 rounded-[48px] p-8 flex flex-col gap-6 shadow-3xl">
               <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Layer Stack</span>
               <div className="flex flex-col gap-3">
                  {['Overlay Glow', 'Text: VOXFLOW', 'AI Subject', 'Background'].map(layer => (
                     <div 
                        key={layer}
                        onClick={() => setActiveLayer(layer)}
                        className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                           activeLayer === layer ? "bg-[#00e5ff] border-[#00e5ff] text-black" : "bg-white/2 border-white/5 text-zinc-500"
                        }`}
                     >
                        <div className="flex items-center gap-3">
                           <Layers size={14} />
                           <span className="text-[9px] font-black uppercase tracking-widest">{layer}</span>
                        </div>
                        <Trash2 size={12} className={activeLayer === layer ? "text-black" : "text-zinc-800"} />
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* MAIN CANVAS VIEWPORT */}
         <div className="xl:col-span-9 flex flex-col gap-8">
            <div className="flex-1 bg-[#0A0A0B] border border-white/5 rounded-[64px] relative overflow-hidden flex items-center justify-center group shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-br from-[#00e5ff05] to-transparent"></div>
               
               {/* THE CANVAS */}
               <div className="w-[80%] aspect-video bg-black border border-white/5 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden flex items-center justify-center group/canvas transition-all hover:scale-[1.02]">
                  {isGenerating ? (
                     <div className="flex flex-col items-center gap-6">
                        <Cpu size={48} className="text-[#00e5ff] animate-spin" />
                        <span className="text-[10px] font-black text-[#00e5ff] uppercase tracking-[10px] animate-pulse">Neural Synthesizing</span>
                     </div>
                  ) : (
                     <div className="flex flex-col items-center gap-4 text-zinc-800">
                        <ImageIcon size={64} />
                        <span className="text-[11px] font-black uppercase tracking-[15px]">Viewport Active</span>
                     </div>
                  )}
                  
                  {/* Floating Selection Box Mock */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-[#00e5ff] border-dashed rounded-xl opacity-0 group-hover/canvas:opacity-100 transition-opacity">
                     <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#00e5ff] rounded-md shadow-[0_0_10px_#00e5ff]"></div>
                     <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#00e5ff] rounded-md shadow-[0_0_10px_#00e5ff]"></div>
                  </div>
               </div>

               {/* Canvas Toolbar */}
               <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8 px-10 py-5 bg-black/60 border border-white/10 rounded-full backdrop-blur-3xl shadow-3xl">
                  <div className="flex items-center gap-4 border-r border-white/10 pr-8">
                     <button className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-zinc-600 hover:text-white transition-all"><Maximize2 size={18} /></button>
                     <button className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-zinc-600 hover:text-white transition-all"><Download size={18} /></button>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Res: 1920 x 1080</span>
                  </div>
                  <button className="h-12 px-10 bg-[#00e5ff] text-black text-[10px] font-black uppercase rounded-2xl shadow-[0_0_20px_rgba(0,229,255,0.2)]">Save Project</button>
               </div>
            </div>

            {/* QUICK PRESETS */}
            <div className="h-48 flex flex-col gap-6">
               <span className="text-[10px] font-black text-white uppercase tracking-widest px-2">Design Presets</span>
               <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
                  {[
                     { name: 'Viral Hook', color: '#ff3b3b' },
                     { name: 'Cinematic Blue', color: '#00e5ff' },
                     { name: 'Dark Mode Elite', color: '#a855f7' },
                     { name: 'Gamer Neon', color: '#10b981' },
                     { name: 'Retro Wave', color: '#f59e0b' },
                     { name: 'TitanX Official', color: '#ffffff' },
                  ].map(preset => (
                     <div key={preset.name} className="min-w-[200px] h-32 bg-[#0A0A0B] border border-white/5 rounded-[32px] p-6 flex flex-col justify-end gap-2 group cursor-pointer hover:border-white/20 transition-all">
                        <div className="w-8 h-1 bg-zinc-800 rounded-full group-hover:w-16 transition-all" style={{ backgroundColor: preset.color }}></div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{preset.name}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}
