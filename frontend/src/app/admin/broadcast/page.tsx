"use client";

import React, { useState } from "react";
import { 
  Bell, Send, ShieldAlert, Zap, Radio, Globe, 
  MessageSquare, X, Smartphone, Megaphone,
  CheckCircle2, Clock, Activity, Cpu, Brain
} from "lucide-react";
import { toast } from "react-hot-toast";
import apiClient from "@/utils/apiClient";

export default function AdminBroadcast() {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<'info' | 'warn' | 'alert'>('info');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleBroadcast = async () => {
    if (!message) return;
    setIsBroadcasting(true);
    
    try {
      await apiClient.post('/api/admin/broadcast', { message, type });
      setIsBroadcasting(false);
      toast.success("Global Broadcast Deployed: Neon Banner is now active on all user dashboards.", {
        style: { background: '#0A0A0B', color: '#00e5ff', border: '1px solid rgba(0, 229, 255, 0.2)', fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase' }
      });
      setMessage("");
    } catch (error) {
      setIsBroadcasting(false);
      toast.error("Broadcast Failed to propagate.");
    }
  };

  const handleClearBroadcast = async () => {
    if (isClearing) return;
    setIsClearing(true);
    try {
      await apiClient.post('/api/admin/broadcast/clear');
      toast.success("NUCLEAR STOP: ALL SIGNALS TERMINATED", { icon: '🛑' });
      setMessage("");
    } catch (e) {
      toast.error("Signal Termination Failed");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="flex flex-col gap-3">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#f59e0b] rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-[#f59e0b] uppercase tracking-[6px]">Neural Communication Node</span>
           </div>
           <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Broadcast Center</h2>
        </div>

        <div className="flex items-center gap-6 px-8 py-4 bg-white/2 border border-white/5 rounded-[32px]">
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Active Listeners</span>
              <span className="text-[12px] font-black text-[#10b981]">14,284 SOULS</span>
           </div>
           <div className="w-10 h-10 bg-[#10b98111] rounded-2xl flex items-center justify-center text-[#10b981]">
              <Radio size={20} className="animate-pulse" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* LEFT: BROADCAST TOOL */}
         <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="bg-[#0A0A0B] border border-white/5 rounded-[56px] p-12 flex flex-col gap-10 shadow-3xl">
               <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Universal Messaging</span>
                  <h3 className="text-2xl font-black text-white uppercase italic">Deploy System Alert</h3>
               </div>

               <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-4">
                     <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Alert Level</label>
                     <div className="grid grid-cols-3 gap-4">
                        {[
                          { id: 'info', icon: <Zap size={16} />, label: 'Standard', color: '#00e5ff' },
                          { id: 'warn', icon: <Megaphone size={16} />, label: 'Maintenance', color: '#f59e0b' },
                          { id: 'alert', icon: <ShieldAlert size={16} />, label: 'Emergency', color: '#ef4444' },
                        ].map(level => (
                           <button 
                             key={level.id} 
                             onClick={() => setType(level.id as any)}
                             className={`h-20 rounded-[24px] border flex flex-col items-center justify-center gap-2 transition-all ${
                                type === level.id 
                                ? "bg-white/5 border-white/20 text-white shadow-[0_0_30px_rgba(255,255,255,0.05)]" 
                                : "bg-white/2 border-white/5 text-zinc-600 hover:border-white/10"
                             }`}
                           >
                              <div style={{ color: type === level.id ? level.color : 'inherit' }}>{level.icon}</div>
                              <span className="text-[9px] font-black uppercase tracking-widest">{level.label}</span>
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="flex flex-col gap-4">
                     <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Message Payload</label>
                     <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="VoxFlow will go offline for 10 mins for an Ultra-Upgrade..." 
                        className="h-40 bg-white/2 border border-white/5 rounded-[32px] p-8 text-[12px] font-bold text-white uppercase tracking-widest placeholder:text-zinc-800 focus:border-white/20 outline-none transition-all resize-none"
                     />
                  </div>

                  <div className="flex gap-6 w-full">
                        <button 
                          onClick={handleBroadcast}
                          disabled={isBroadcasting || !message}
                          className={`h-24 flex-1 rounded-[32px] font-black text-[12px] uppercase tracking-[4px] transition-all flex items-center justify-center gap-4 group ${
                            isBroadcasting ? "bg-white/5 text-zinc-600" : "bg-[#10b981] text-black hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(16,185,129,0.3)]"
                          }`}
                        >
                           {isBroadcasting ? (
                              <>
                                 <Radio size={20} className="animate-ping" />
                                 DEPLOYING...
                              </>
                           ) : (
                              <>
                                 <Send size={20} className="group-hover:translate-x-2 transition-transform" />
                                 Execute Global Broadcast
                              </>
                           )}
                        </button>

                        <button 
                          onClick={() => handleClearBroadcast()}
                          disabled={isClearing}
                          className="h-24 w-24 bg-[#ff2d55]/10 border border-[#ff2d55]/30 text-[#ff2d55] rounded-[32px] flex items-center justify-center hover:bg-[#ff2d55] hover:text-black transition-all group shadow-[0_0_30px_rgba(255,45,85,0.2)] disabled:opacity-50"
                          title="Nuclear Kill Switch"
                        >
                           {isClearing ? <Radio size={24} className="animate-spin" /> : <Zap size={24} className="group-hover:rotate-12 transition-transform" />}
                        </button>
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT: PREVIEW & HISTORY */}
         <div className="lg:col-span-5 flex flex-col gap-10">
            {/* LIVE PREVIEW */}
            <div className="bg-[#0A0A0B] border border-white/5 rounded-[48px] p-10 flex flex-col gap-8">
               <h4 className="text-[10px] font-black text-zinc-700 uppercase tracking-widest italic">Dashboard Preview</h4>
               <div className="bg-black border border-white/5 rounded-[32px] aspect-video relative overflow-hidden p-6 flex flex-col gap-4">
                  {/* Neon Banner Mock */}
                  {message && (
                     <div className={`absolute top-0 left-0 w-full p-4 flex items-center justify-between border-b animate-in slide-in-from-top duration-500 ${
                        type === 'info' ? 'bg-[#00e5ff11] border-[#00e5ff33] text-[#00e5ff]' :
                        type === 'warn' ? 'bg-[#f59e0b11] border-[#f59e0b33] text-[#f59e0b]' :
                        'bg-red-500/10 border-red-500/30 text-red-500'
                     }`}>
                        <div className="flex items-center gap-3">
                           <Zap size={12} className="animate-pulse" />
                           <span className="text-[8px] font-black uppercase tracking-widest truncate max-w-[200px]">{message}</span>
                        </div>
                        <X size={10} className="text-zinc-600" />
                     </div>
                  )}
                  <div className="flex-1 flex flex-col gap-4 pt-10">
                     <div className="h-6 w-1/3 bg-white/5 rounded-full"></div>
                     <div className="h-24 w-full bg-white/2 rounded-3xl"></div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="h-20 bg-white/2 rounded-3xl"></div>
                        <div className="h-20 bg-white/2 rounded-3xl"></div>
                     </div>
                  </div>
               </div>
            </div>

            {/* BROADCAST LOGS */}
            <div className="bg-[#0A0A0B] border border-white/5 rounded-[48px] p-10 flex flex-col gap-8">
               <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black text-zinc-700 uppercase tracking-widest italic">Recent Deployments</h4>
                  <button className="text-[8px] font-black text-[#a855f7] uppercase tracking-widest underline decoration-[#a855f744]">Clear Log</button>
               </div>
               
               <div className="flex flex-col gap-4">
                  {[
                    { msg: 'System Upgrade: Vocal Latency Reduced', time: '14h ago', icon: <CheckCircle2 size={12} /> },
                    { msg: 'Maintenance Window: 04:00 UTC', time: '2d ago', icon: <Clock size={12} /> },
                    { msg: 'Neural Sync Initialized', time: '5d ago', icon: <Activity size={12} /> },
                  ].map((log, i) => (
                     <div key={i} className="p-5 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                           <div className="text-zinc-700 group-hover:text-white transition-colors">{log.icon}</div>
                           <span className="text-[9px] font-bold text-zinc-500 uppercase group-hover:text-white transition-colors truncate max-w-[150px]">{log.msg}</span>
                        </div>
                        <span className="text-[8px] font-black text-zinc-800 uppercase">{log.time}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
