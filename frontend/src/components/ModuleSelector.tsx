"use client";

import React from "react";
import { Search, Type, Mic, Check, X, Wifi, WifiOff } from "lucide-react";

interface ModuleSelectorProps {
  engines: {
    scraper: boolean;
    captions: boolean;
    dubbing: boolean;
  };
  setEngines: React.Dispatch<React.SetStateAction<{
    scraper: boolean;
    captions: boolean;
    dubbing: boolean;
  }>>;
  status: {
    scout: string;
    factory: string;
    brain: string;
  };
}

export function ModuleSelector({ engines, setEngines, status }: ModuleSelectorProps) {
  const toggle = (key: keyof typeof engines) => {
    setEngines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const modules = [
    { 
      id: 'scraper', 
      label: 'Trend Scraper', 
      icon: <Search size={18} />, 
      desc: 'Internet Data Fetch', 
      statusKey: 'scout',
      color: 'text-blue-400' 
    },
    { 
      id: 'captions', 
      label: 'Viral Captions', 
      icon: <Type size={18} />, 
      desc: 'Neural Text Layer', 
      statusKey: 'factory',
      color: 'text-[#CCFF00]' 
    },
    { 
      id: 'dubbing', 
      label: 'Neural Voice', 
      icon: <Mic size={18} />, 
      desc: 'AI Voice Cloning', 
      statusKey: 'brain',
      color: 'text-purple-400' 
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-8 bg-[#0A0A0B] border border-white/5 rounded-[40px] shadow-2xl">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black text-[#404040] uppercase tracking-[4px]">Plug-and-Play Manager</span>
        <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Independent <span className="text-purple-500">Chambers</span></h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className={`p-6 rounded-[32px] border flex flex-col gap-4 transition-all relative overflow-hidden ${engines[mod.id as keyof typeof engines] ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5 opacity-40 grayscale'}`}
          >
            {/* Status Heartbeat */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${status[mod.statusKey as keyof typeof status] === 'online' || status[mod.statusKey as keyof typeof status] === 'stable' ? 'bg-[#10b981]' : 'bg-red-500'}`} />
              <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">
                {status[mod.statusKey as keyof typeof status] === 'online' || status[mod.statusKey as keyof typeof status] === 'stable' ? 'Connected' : 'Offline'}
              </span>
            </div>

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-black/40 mt-4 ${mod.color}`}>
              {mod.icon}
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-black text-white uppercase tracking-widest">{mod.label}</span>
              <span className="text-[9px] font-bold text-zinc-600 uppercase">{mod.desc}</span>
            </div>

            <button
              onClick={() => toggle(mod.id as any)}
              className={`mt-4 h-10 w-full rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${engines[mod.id as keyof typeof engines] ? 'bg-white text-black' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
            >
              {engines[mod.id as keyof typeof engines] ? 'ON' : 'OFF'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
