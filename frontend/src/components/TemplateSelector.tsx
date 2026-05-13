"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Layout, Smartphone, Youtube, Linkedin, 
  Sparkles, Check, ChevronRight, PlayCircle
} from 'lucide-react';
import { soundEngine } from '@/utils/SoundEngine';

const TEMPLATES = [
  { id: 'reels', name: 'Viral Reels', icon: <Smartphone size={20} />, ratio: '9:16', style: 'Hormozi / Cinematic Subtitles', color: '#ff2d55' },
  { id: 'shorts', name: 'YT Shorts', icon: <Youtube size={20} />, ratio: '9:16', style: 'High-Retention / Dynamic Cuts', color: '#ff0000' },
  { id: 'linkedin', name: 'Professional Ad', icon: <Linkedin size={20} />, ratio: '1:1', style: 'Executive / Clean Minimal', color: '#0077b5' },
  { id: 'landscape', name: 'Cinematic Wide', icon: <Layout size={20} />, ratio: '16:9', style: 'Epic / Narrative Flow', color: '#CCFF00' },
];

export default function TemplateSelector({ onSelect }: { onSelect: (id: string) => void }) {
  const [selected, setSelected] = useState('reels');

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
         <span className="text-[10px] font-black text-[#404040] uppercase tracking-[4px]">Neural Layouts</span>
         <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Select <span className="text-[#a855f7]">Template</span></h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TEMPLATES.map((tmpl) => (
          <motion.div
            key={tmpl.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelected(tmpl.id);
              onSelect(tmpl.id);
              soundEngine?.play("click");
            }}
            className={`group p-6 rounded-[32px] border transition-all cursor-pointer relative overflow-hidden ${
              selected === tmpl.id ? 'bg-[#111] border-white/20 shadow-2xl' : 'bg-white/2 border-white/5 hover:border-white/10'
            }`}
          >
            {selected === tmpl.id && (
              <div className="absolute top-6 right-6 w-6 h-6 bg-[#CCFF00] rounded-full flex items-center justify-center text-black">
                <Check size={14} strokeWidth={4} />
              </div>
            )}

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 text-zinc-400 group-hover:text-white transition-colors" style={{ color: selected === tmpl.id ? tmpl.color : '' }}>
                   {tmpl.icon}
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[11px] font-black text-white uppercase tracking-wider">{tmpl.name}</span>
                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{tmpl.ratio} Ratio</span>
                 </div>
              </div>

              <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
                 <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={10} className="text-[#CCFF00]" /> {tmpl.style}
                 </p>
                 <div className="flex items-center justify-between mt-2">
                    <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">LPU Optimized</span>
                    <ChevronRight size={14} className="text-zinc-800 group-hover:text-[#CCFF00] transition-colors" />
                 </div>
              </div>
            </div>

            {/* Hover Backdrop Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.div>
        ))}
      </div>

      <div className="p-8 bg-white/2 border border-dashed border-white/10 rounded-[32px] flex items-center justify-center gap-4 group cursor-pointer hover:bg-white/5 transition-all">
         <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-600 group-hover:text-[#CCFF00] transition-colors">
            <PlayCircle size={20} />
         </div>
         <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors">Preview Neural Sample</span>
      </div>
    </div>
  );
}
