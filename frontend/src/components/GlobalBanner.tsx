"use client";

import React, { useState, useEffect } from "react";
import { X, Zap, Megaphone, ShieldAlert, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GlobalBannerProps {
  message?: string;
  type?: 'info' | 'warn' | 'alert';
  onClose?: () => void;
}

export default function GlobalBanner({ message: initialMessage, type = 'info', onClose }: GlobalBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState(initialMessage || "");
  const [alertType, setAlertType] = useState(type);

  // Simulation of WebSocket Listener for Global Broadcasts
  useEffect(() => {
    // In a real app, this would be a socket.on('global_broadcast')
    const timer = setTimeout(() => {
      // Simulate a broadcast coming in after 10 seconds for demo
      if (!initialMessage) {
        setMessage("TITAN-X ALERT: System maintenance scheduled for 04:00 UTC. Expect 10m downtime.");
        setAlertType('warn');
        setIsVisible(true);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [initialMessage]);

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
      setAlertType(type);
      setIsVisible(true);
    }
  }, [initialMessage, type]);

  const styles = {
    info: "bg-[#00e5ff11] border-[#00e5ff33] text-[#00e5ff] shadow-[0_0_30px_rgba(0,229,255,0.1)]",
    warn: "bg-[#f59e0b11] border-[#f59e0b33] text-[#f59e0b] shadow-[0_0_30px_rgba(245,158,11,0.1)]",
    alert: "bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.1)]"
  };

  const icons = {
    info: <Zap size={14} className="animate-pulse" />,
    warn: <Megaphone size={14} className="animate-bounce" />,
    alert: <ShieldAlert size={14} className="animate-ping" />
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className={`fixed top-0 left-0 right-0 z-[1000] p-4 flex items-center justify-center border-b backdrop-blur-3xl ${styles[alertType]}`}
        >
          <div className="flex items-center gap-6 max-w-4xl w-full">
             <div className="flex items-center gap-3 shrink-0">
                {icons[alertType]}
                <span className="text-[10px] font-black uppercase tracking-[4px]">SYSTEM BROADCAST</span>
             </div>
             <p className="flex-1 text-[11px] font-black uppercase tracking-widest text-center">
                {message}
             </p>
             <button 
               onClick={() => { setIsVisible(false); if (onClose) onClose(); }}
               className="p-2 hover:bg-white/10 rounded-full transition-all group"
             >
                <X size={14} className="group-hover:rotate-90 transition-transform" />
             </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
