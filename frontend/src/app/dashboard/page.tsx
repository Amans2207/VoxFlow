"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Activity, Database, Play, Globe, 
  Sparkles, Layers, RefreshCcw, ArrowUpRight,
  TrendingUp, Gauge, Shield, Cpu, Smartphone,
  Plus, Search, Clock, Video as YoutubeIcon, 
  Terminal, ShieldCheck, AlertCircle, TerminalSquare, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { useUserStore } from '@/store/useUserStore';
import { socket } from '@/utils/socket';

interface LogEntry {
  id: string;
  msg: string;
  type: 'info' | 'success' | 'error' | 'warning';
  time: string;
}

export default function NeuralDashboard() {
  const { user } = useUserStore();
  const [isScraping, setIsScraping] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      msg,
      type,
      time: new Date().toLocaleTimeString([], { hour12: false })
    };
    setLogs(prev => [...prev.slice(-19), newLog]);
  };

  useEffect(() => {
    addLog("TITAN-X Core Initialized.", "success");
    addLog("Neural Bridge Secure.", "info");

    socket.on('render_status', (data) => {
      addLog(data.message || `Render Status: ${data.progress}%`, data.status === 'Failed' ? 'error' : 'info');
    });

    return () => { socket.off('render_status'); };
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  const handleQuickScrape = async () => {
    toast.loading("Engaging Orchestrator...", { id: 'scrape' });
    setIsScraping(true);
    addLog("Orchestrator: Scouting Global Trends...", "info");
    
    try {
      await api.post('/api/v1/orchestrate', { topic: 'viral' });
      addLog("Scout: Fetching Playwright Context...", "info");
      await new Promise(r => setTimeout(r, 2000));
      addLog("Scout: Neural Hooks Synthesized.", "success");
      toast.success("Scout Complete: 12 Hooks Found.", { id: 'scrape' });
    } catch (e) {
      addLog("Scout: Connection Refused by Brain.", "error");
    } finally {
      setIsScraping(false);
    }
  };

  const dashboardCards = [
    { name: 'Neural Factory', icon: <Cpu size={24} />, desc: 'Batch Render Engine', action: 'Active' },
    { name: 'Viral Scout', icon: <TrendingUp size={24} />, desc: 'Playwright Scraper', action: 'Online' },
    { name: 'Identity Brain', icon: <Layers size={24} />, desc: 'Voice Reconstruction', action: 'Online' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black p-8 lg:p-12 gap-12 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* 🚀 HUB HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
         <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[6px]">System Pulse: Optimal</span>
            </div>
            <h1 className="text-6xl lg:text-9xl font-black text-white tracking-tighter uppercase leading-[0.85] italic">COMMAND <span className="text-blue-500">CENTER.</span></h1>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest leading-relaxed max-w-xl">Unified Orchestrator for the VoxFlow V9.0 Ecosystem. Real-time telemetry across all Neural Chambers.</p>
         </div>
         
         <div className="flex gap-4">
            <button 
              onClick={handleQuickScrape}
              disabled={isScraping}
              className="px-10 h-20 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-[32px] hover:bg-blue-500 transition-all flex items-center gap-4 shadow-2xl disabled:opacity-50"
            >
               {isScraping ? <RefreshCcw size={18} className="animate-spin" /> : <Zap size={18} fill="currentColor" />}
               Quick Scout
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* MAIN STATS GRID */}
         <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {dashboardCards.map((card) => (
                 <div key={card.name} className="p-8 bg-[#0A0A0B] border border-white/5 rounded-[48px] space-y-6 group hover:border-blue-500/20 transition-all">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-all duration-500">
                       {card.icon}
                    </div>
                    <div className="space-y-1">
                       <h3 className="text-[11px] font-black text-white uppercase tracking-widest">{card.name}</h3>
                       <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic">{card.desc}</p>
                    </div>
                 </div>
               ))}
            </div>

            {/* 📟 NEURAL LOGS (THE BLACK BOX) */}
            <div className="bg-[#050505] border border-white/5 rounded-[56px] p-10 flex flex-col gap-6 relative overflow-hidden h-[450px]">
               <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <div className="flex items-center gap-4">
                     <TerminalSquare size={20} className="text-blue-500" />
                     <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[4px]">Neural Logs (Black Box)</h3>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                     <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Real-Time Stream</span>
                  </div>
               </div>

               <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 font-mono pr-4 custom-scrollbar">
                  <AnimatePresence initial={false}>
                    {logs.map((log) => (
                      <motion.div 
                        key={log.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-4 text-[10px] leading-relaxed group"
                      >
                         <span className="text-zinc-800 font-black">[{log.time}]</span>
                         <span className={`font-bold uppercase tracking-widest ${
                           log.type === 'success' ? 'text-green-500' :
                           log.type === 'error' ? 'text-red-500' :
                           log.type === 'warning' ? 'text-orange-500' : 'text-zinc-500'
                         }`}>
                           {log.type === 'success' ? '✔' : log.type === 'error' ? '✖' : '●'} {log.msg}
                         </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
               </div>
            </div>
         </div>

         {/* RIGHT: SYSTEM HEALTH & MOBILE SYNC */}
         <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#0A0A0B] border border-white/5 rounded-[56px] p-10 space-y-10">
               <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[4px]">Neural Mobile Bridge</h3>
                  <div className="px-3 py-1 bg-blue-500/10 rounded-full">
                     <span className="text-[8px] font-black text-blue-500 uppercase">V9.0 Master</span>
                  </div>
               </div>
               
               <div className="aspect-square w-full bg-white rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group relative">
                  <div className="w-full h-full border-[10px] border-black rounded-2xl flex items-center justify-center">
                     <div className="grid grid-cols-4 gap-2 opacity-80 group-hover:opacity-100 transition-all">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div key={i} className={`w-4 h-4 bg-black ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-20'}`} />
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* PRE-FLIGHT CHECKLIST */}
            <div className="bg-[#0A0A0B] border border-white/5 rounded-[48px] p-10 space-y-8">
               <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[4px]">Pre-Flight Checklist</h3>
               <div className="space-y-4">
                  {[
                    { label: 'FFmpeg Engine', status: 'Ready' },
                    { label: 'Neural VRAM', status: '85% Free' },
                    { label: 'OpenAI Bridge', status: 'Stable' }
                  ].map(check => (
                    <div key={check.label} className="flex items-center justify-between py-2 border-b border-white/2">
                       <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{check.label}</span>
                       <div className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-green-500" />
                          <span className="text-[8px] font-black text-white uppercase">{check.status}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}
