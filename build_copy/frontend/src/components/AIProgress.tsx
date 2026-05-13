"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';

interface AIProgressProps {
  isVisible: boolean;
  message: string;
}

export default function AIProgress({ isVisible, message }: AIProgressProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-t-2 border-r-2 border-[#CCFF00] rounded-full shadow-[0_0_30px_rgba(204,255,0,0.3)]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[#CCFF00] animate-pulse" />
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <h3 className="text-white font-black text-xl tracking-tighter uppercase mb-2">Neural Engine Active</h3>
              <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" /> {message}
              </p>
            </div>

            <div className="w-64 h-1 bg-zinc-900 rounded-full overflow-hidden">
               <motion.div 
                 animate={{ x: [-256, 256] }}
                 transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                 className="w-1/2 h-full bg-[#00f2ff] shadow-[0_0_10px_#00f2ff]"
               />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
