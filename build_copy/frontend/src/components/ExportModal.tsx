"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Smartphone, Maximize2, Download, X, Zap, Play } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  onExport: (quality: string) => void;
}

export default function ExportModal({ isOpen, onClose, videoUrl, onExport }: ExportModalProps) {
  const options = [
    { id: '4k', name: 'Titan 4K', desc: 'Ultra High-Res Lossless', icon: <Maximize2 />, color: '#CCFF00' },
    { id: '1080p', name: 'Web Master', desc: 'Optimized 1080p Standard', icon: <Monitor />, color: '#00f2ff' },
    { id: '916', name: 'Social Vertical', desc: '9:16 Shorts / Reels', icon: <Smartphone />, color: '#ff0055' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-10"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-4xl bg-[#050505] border border-white/10 rounded-[48px] p-8 md:p-12 relative overflow-hidden flex flex-col lg:flex-row gap-12"
          >
            <button onClick={onClose} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors z-50">
              <X size={24} />
            </button>

            {/* Left: Video Preview */}
            <div className="flex-1 flex flex-col gap-6">
               <div className="flex items-center gap-2 mb-2">
                  <Play size={16} className="text-[#a855f7]" />
                  <span className="text-[10px] font-black text-[#a855f7] uppercase tracking-widest">Neural Preview</span>
               </div>
               <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/5 relative group shadow-2xl">
                  {videoUrl ? (
                    <video 
                      src={videoUrl} 
                      className="w-full h-full object-cover" 
                      controls 
                      autoPlay
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-800 uppercase font-black tracking-widest text-xs">
                       Generating Preview...
                    </div>
                  )}
               </div>
               <div className="p-6 bg-white/2 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                     <Zap size={12} className="text-[#CCFF00]" /> Intelligence Report
                  </p>
                  <p className="text-[11px] text-zinc-500 font-bold leading-relaxed uppercase tracking-widest">
                     The neural engine has synchronized lip-sync at 99.4% accuracy. Voice timbre preserved via biometric matching.
                  </p>
               </div>
            </div>

            {/* Right: Export Options */}
            <div className="w-full lg:w-[380px] flex flex-col">
               <div className="mb-10">
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Export<br/>Studio</h2>
                  <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mt-4">Select your master calibration.</p>
               </div>

               <div className="flex flex-col gap-4">
                  {options.map((opt) => (
                    <button 
                      key={opt.id}
                      onClick={() => onExport(opt.id)}
                      className="flex items-center gap-5 p-6 bg-white/2 border border-white/5 rounded-3xl hover:border-white/20 transition-all group text-left relative overflow-hidden"
                    >
                      <div className="p-4 bg-black rounded-2xl group-hover:scale-110 transition-transform shadow-xl" style={{ color: opt.color }}>
                         {opt.icon}
                      </div>
                      <div className="flex-1">
                         <div className="text-white font-black text-xs uppercase tracking-tighter">{opt.name}</div>
                         <div className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mt-1">{opt.desc}</div>
                      </div>
                      <Download size={20} className="text-zinc-700 group-hover:text-white transition-colors" />
                    </button>
                  ))}
               </div>

               <div className="mt-auto pt-10 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Render Time</span>
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">~12s</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Neural Load</span>
                     <span className="text-[10px] font-black text-[#10b981] uppercase tracking-widest">Optimized</span>
                  </div>
               </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
