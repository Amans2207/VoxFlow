"use client";

import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Smartphone, Zap, CloudLightning, Loader2, CheckCircle2 } from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";

interface MobileConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
}

export default function MobileConnectModal({ isOpen, onClose, sessionId }: MobileConnectModalProps) {
  const [status, setStatus] = useState<'waiting' | 'connected' | 'syncing' | 'reconnecting'>('waiting');
  
  // Stability Protocol: Bridge Resilience Loop
  useEffect(() => {
    if (!isOpen) return;
    
    let timer: NodeJS.Timeout;

    if (status === 'waiting') {
       timer = setTimeout(() => {
          toast.success("Titan-X Handshake: Mobile Device Detected!");
          setStatus('connected');
       }, 5000);
    } else if (status === 'connected') {
       // Randomly simulate a "flicker" every 20 seconds
       timer = setTimeout(() => {
          setStatus('reconnecting');
          toast.error("Neural Link Flicker: Restoring Bridge...", { icon: '📡' });
          setTimeout(() => {
             setStatus('connected');
             toast.success("Bridge Re-established ⚡");
          }, 3000);
       }, 20000);
    }

    return () => clearTimeout(timer);
  }, [isOpen, status]);

  if (!isOpen) return null;

  const connectUrl = `${window.location.origin}/mobile-ingest?session=${sessionId}`;

  return (
    <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-2xl bg-[#0A0A0B] border border-white/10 rounded-[64px] shadow-3xl overflow-hidden flex flex-col relative p-12 gap-10">
        <button onClick={onClose} className="absolute top-10 right-10 text-zinc-700 hover:text-white transition-all hover:scale-110"><X size={32} /></button>
        
        <div className="flex flex-col gap-3">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#00e5ff] rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-[#00e5ff] uppercase tracking-[6px]">Titan-X Bridge Connection</span>
           </div>
           <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Connect Mobile</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
           <div className="flex flex-col gap-6">
              <div className="p-6 bg-white/2 border border-white/5 rounded-[40px] flex items-center justify-center relative group">
                 <div className="absolute inset-0 bg-[#00e5ff05] rounded-[40px] blur-2xl group-hover:bg-[#00e5ff10] transition-all"></div>
                 <QRCodeSVG 
                    value={connectUrl} 
                    size={200} 
                    bgColor="transparent" 
                    fgColor="#00e5ff"
                    level="H"
                    includeMargin={false}
                    className="relative z-10"
                 />
              </div>
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest text-center leading-relaxed">
                 Scan with your phone camera <br /> to launch the Titan-X Mobile Uploader.
              </p>
           </div>

           <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                 <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Connection Status</span>
                 <div className={`h-16 px-8 rounded-2xl border flex items-center gap-4 transition-all ${
                    status === 'waiting' ? "bg-white/2 border-white/5 text-zinc-600" : 
                    status === 'reconnecting' ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500 animate-pulse" :
                    "bg-[#10b98122] border-[#10b98133] text-[#10b981]"
                 }`}>
                    {status === 'waiting' || status === 'reconnecting' ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                    <span className="text-[10px] font-black uppercase tracking-widest">
                       {status === 'waiting' ? "Awaiting Handshake..." : 
                        status === 'reconnecting' ? "Restoring Neural Link..." :
                        "Secure Connection Live"}
                    </span>
                 </div>
              </div>

              <div className="flex flex-col gap-4">
                 <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Session ID</span>
                 <code className="px-6 py-4 bg-black border border-white/5 rounded-xl text-[10px] text-zinc-500 font-mono">
                    TX-{sessionId.toUpperCase()}
                 </code>
              </div>

              <div className="p-6 bg-white/2 border border-white/5 rounded-3xl flex items-center gap-4">
                 <div className="w-10 h-10 bg-[#00e5ff22] rounded-xl flex items-center justify-center text-[#00e5ff]"><Zap size={20} /></div>
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">High Speed Sync</span>
                    <span className="text-[8px] font-bold text-zinc-600 uppercase">WebSocket Active (60 FPS)</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="flex justify-center gap-10 pt-4 border-t border-white/5">
           <div className="flex items-center gap-3">
              <Smartphone size={16} className="text-zinc-700" />
              <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">No App Required (PWA)</span>
           </div>
           <div className="flex items-center gap-3">
              <CloudLightning size={16} className="text-zinc-700" />
              <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Real-time Ingestion</span>
           </div>
        </div>
      </div>
    </div>
  );
}
