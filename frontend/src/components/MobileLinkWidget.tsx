"use client";

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Smartphone, ExternalLink, Zap, 
  Loader2, CheckCircle2, ChevronRight,
  Wifi, Cloud, Monitor, RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileLinkWidget() {
  const [mobileUrl, setMobileUrl] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [lastUpload, setLastUpload] = useState<any>(null);

  useEffect(() => {
    // Generate the URL for the mobile link
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    setMobileUrl(`${baseUrl}/mobile/upload`);
  }, []);

  return (
    <div className="bg-[#0A0A0B] border border-white/5 p-8 rounded-[48px] relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
        {/* QR Section */}
        <div className="flex flex-col items-center gap-4">
           <div className="p-4 bg-white rounded-3xl shadow-2xl border-4 border-blue-500/10">
              <QRCodeSVG value={mobileUrl} size={140} fgColor="#000000" bgColor="#ffffff" />
           </div>
           <div className="flex items-center gap-2 text-[9px] font-black text-blue-500 uppercase tracking-widest animate-pulse">
              <Wifi size={12} /> Neural Link Active
           </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 space-y-6">
           <div className="space-y-2">
              <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Mobile <span className="text-blue-500">Sync.</span></h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest max-w-[240px] leading-relaxed">Scan to bridge your phone and PC. Send 4K assets directly to your timeline.</p>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/2 border border-white/5 rounded-2xl flex flex-col gap-1">
                 <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Device Status</span>
                 <div className="flex items-center gap-2">
                    <Smartphone size={14} className="text-blue-500" />
                    <span className="text-[10px] font-black text-white">READY</span>
                 </div>
              </div>
              <div className="p-4 bg-white/2 border border-white/5 rounded-2xl flex flex-col gap-1">
                 <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Protocol</span>
                 <div className="flex items-center gap-2">
                    <Cloud size={14} className="text-blue-500" />
                    <span className="text-[10px] font-black text-white">END-TO-END</span>
                 </div>
              </div>
           </div>
           
           <button 
             onClick={() => { setSyncing(true); setTimeout(() => setSyncing(false), 2000); }}
             className="w-full h-12 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl"
           >
              {syncing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
              {syncing ? "Refreshing Link..." : "Sync Device Manually"}
           </button>
        </div>
      </div>

      {/* Real-time Queue Bar (Overlay style) */}
      <AnimatePresence>
        {syncing && (
           <motion.div 
             initial={{ y: 100 }}
             animate={{ y: 0 }}
             exit={{ y: 100 }}
             className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 shadow-[0_0_15px_#3b82f6]"
           />
        )}
      </AnimatePresence>
    </div>
  );
}
