"use client";

import React from "react";
import { Zap, Loader2, Cpu, Activity, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function NeuralModuleLoading({ 
  moduleName = "Neural Module" 
}: { 
  moduleName?: string 
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full bg-[#000000] p-10 overflow-hidden relative" style={{ color: 'white' }}>
      
      {/* CENTRAL LOGO BOX */}
      <div className="w-28 h-28 bg-[#0A0A0B] rounded-[32px] flex items-center justify-center border border-white/5 relative mb-12 shadow-3xl group">
         <div className="absolute inset-0 bg-[#00e5ff] blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
         <Zap size={48} className="text-[#00e5ff] drop-shadow-[0_0_15px_#00e5ff] relative z-10" />
      </div>

      {/* TYPOGRAPHY LIKE IMAGE 1 */}
      <div className="flex flex-col items-center gap-6 text-center mb-16">
         <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">
            INITIALIZING <span className="text-[#00e5ff]">{moduleName.toUpperCase()}</span> <br />
            <span className="text-white/90">ENGINE</span>
         </h1>
         <p className="text-[10px] font-black uppercase tracking-[8px] text-[#262626]">TITAN-X NEURAL CORE V4.2</p>
      </div>

      {/* STATS GRID LIKE IMAGE 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl px-4">
         {[
           { label: "NEURAL LOAD", val: "88%", icon: <Cpu size={14} /> },
           { label: "SYNC STATUS", val: "Active", icon: <Activity size={14} /> },
           { label: "STABILITY", val: "99.9%", icon: <ShieldCheck size={14} /> }
         ].map(stat => (
            <div key={stat.label} className="bg-[#0A0A0B] border border-white/5 p-8 rounded-[32px] flex flex-col items-center gap-4 shadow-2xl">
               <div className="text-[#262626]">{stat.icon}</div>
               <span className="text-[9px] font-black uppercase text-[#262626] tracking-[3px]">{stat.label}</span>
               <span className="text-[12px] font-black text-[#00e5ff] tracking-widest">{stat.val.toUpperCase()}</span>
            </div>
         ))}
      </div>

      {/* LOADING INDICATOR */}
      <div className="flex flex-col items-center gap-6 mt-20">
         <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-[#00e5ff] rounded-full animate-ping"></div>
            <span className="text-[10px] font-black uppercase text-white tracking-[6px]">DEPLOYING MODULE INFRASTRUCTURE...</span>
         </div>
         {/* Pulsing Bar */}
         <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-[#00e5ff] w-2/3 shadow-[0_0_10px_#00e5ff] animate-[pulse_2s_infinite]"></div>
         </div>
      </div>

      {/* RETURN ACTION */}
      <Link href="/dashboard" className="mt-16 text-[10px] font-black uppercase text-[#262626] hover:text-[#00e5ff] transition-all tracking-[4px]">
         Terminate Handshake
      </Link>
    </div>
  );
}
