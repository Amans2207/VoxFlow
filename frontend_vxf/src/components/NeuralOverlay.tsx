"use client";

import { motion, AnimatePresence } from "framer-motion";

import { Zap } from "lucide-react";

export default function NeuralOverlay({ isVisible, message }: { isVisible: boolean; message?: string }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="neural-overlay"
        >
          <div className="flex flex-col items-center gap-8">
            <div className="relative">
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 rounded-full border-2 border-dashed border-blue-500/30 flex items-center justify-center"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-10 h-10 text-blue-400 animate-pulse shadow-[0_0_20px_rgba(0,102,255,0.5)]" />
              </div>
            </div>

            {/* Frequency Visualizer */}
            <div className="flex items-end gap-1 h-6">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 16, 8, 20, 4] }}
                  transition={{ 
                    duration: 0.6, 
                    repeat: Infinity, 
                    delay: i * 0.05,
                    ease: "easeInOut" 
                  }}
                  className="w-1 bg-blue-400/50 rounded-full"
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <h3 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase italic">Neural Processing</h3>
              <p className="text-blue-400 text-xs font-bold tracking-[0.2em] uppercase">
                {message || "Syncing voice vectors & mapping lip movements..."}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

  );
}

