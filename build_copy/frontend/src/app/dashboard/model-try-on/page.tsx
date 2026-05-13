"use client";

import React, { useState } from "react";
import { Upload, Wand2, Image as ImageIcon, Send, Sparkles, Cpu } from "lucide-react";
import NeuralModuleLoading from "@/components/NeuralModuleLoading";
import UniversalInjest from "@/components/UniversalInjest";
import { toast } from "react-hot-toast";

export default function ModelTryOnPage() {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  if (loading) return <NeuralModuleLoading moduleName="Neural Cloth Engine" />;

  return (
    <div className="w-full min-h-screen bg-[#000000] flex flex-col gap-12 p-2">
      <div className="flex flex-col gap-3">
         <p className="text-[10px] font-black text-[#262626] uppercase tracking-[6px]">AI Vision Lab</p>
         <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
            MODEL <span className="text-[#00e5ff]">TRY-ON</span>.
         </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
         {/* Upload Zone */}
         <div className="xl:col-span-7 flex flex-col gap-8">
            <UniversalInjest 
               onComplete={() => toast.success("Reference Models Synchronized")}
               allowedTypes={{ 'image/*': ['.jpg', '.png', '.webp'] }}
            />

            <div className="bg-[#0A0A0B] border border-white/5 rounded-[48px] p-10 flex flex-col gap-6">
               <div className="flex items-center gap-4">
                  <Sparkles size={20} className="text-[#00e5ff]" />
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">Neural Cloth Prompt</p>
               </div>
               <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the clothing, fabric, and fit (e.g., Oversized black silk hoodie with neon accents)..."
                  className="w-full h-40 bg-black/50 border border-white/5 rounded-3xl p-6 text-sm text-white focus:outline-none focus:border-[#00e5ff33] transition-all resize-none font-medium"
               />
               <button 
                  onClick={handleGenerate}
                  className="h-16 bg-[#00e5ff] text-black text-[11px] font-black uppercase rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all"
               >
                  <Wand2 size={18} />
                  Initiate Neural Fit
               </button>
            </div>
         </div>

         {/* Preview Sidebar */}
         <div className="xl:col-span-5 flex flex-col gap-8">
            <div className="bg-[#0A0A0B] border border-white/5 rounded-[48px] p-10 h-full flex flex-col gap-8">
               <div className="flex justify-between items-center">
                  <h4 className="text-xl font-black text-white uppercase">Generation Vault</h4>
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[#00e5ff]">
                     <Cpu size={18} />
                  </div>
               </div>

               <div className="flex-1 flex flex-col items-center justify-center gap-6 border border-white/5 rounded-[32px] bg-black/50">
                  <ImageIcon size={48} className="text-[#262626]" />
                  <p className="text-[10px] font-black text-[#262626] uppercase tracking-widest">Neural Preview Offline</p>
               </div>

               <div className="flex flex-col gap-4 p-6 bg-white/2 rounded-3xl border border-white/5">
                  <div className="flex justify-between text-[9px] font-black uppercase text-[#404040]">
                     <span>Inference Speed</span>
                     <span className="text-[#00e5ff]">4.2s / it</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-[#00e5ff] w-3/4 shadow-[0_0_10px_#00e5ff]"></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
