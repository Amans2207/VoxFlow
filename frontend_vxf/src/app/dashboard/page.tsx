"use client";

import React, { useState, useEffect } from "react";
import { createClient } from '@/utils/supabase/client';
import { 
  Zap, TrendingUp, Activity, Play, Globe, Wallet, Wand2
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardOverview() {
  const router = useRouter();
  const [balance, setBalance] = useState<number>(305.0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('credit_balance').eq('id', user.id).single();
          if (profile) setBalance(profile.credit_balance);
        }
      } catch (err) {
        console.error("Failed to fetch balance:", err);
      }
    };
    fetchBalance();
  }, []);

  const stats = [
    { label: 'Pipeline', value: '17', icon: <Zap size={20} />, color: '#10b981' },
    { label: 'Renders', value: '1.2k', icon: <Play size={20} />, color: '#3b82f6' },
    { label: 'Views', value: '840k', icon: <Globe size={20} />, color: '#a855f7' },
    { label: 'Health', value: '98.4%', icon: <Activity size={20} />, color: '#f59e0b' }
  ];

  return (
    <div className="flex flex-col gap-12 lg:gap-16 pb-20 w-full" suppressHydrationWarning>
      
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
        <div className="flex-1">
           <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase text-white m-0 leading-[0.8] mb-6">
              COMMAND <span className="text-[#10b981]">CENTER</span>
           </h1>
           <p className="text-[11px] font-black text-[#262626] uppercase tracking-[6px] leading-none">Neural Orchestrator v4.2</p>
        </div>
        
        <div className="bg-[#0A0A0B] border border-white/5 p-8 rounded-[40px] flex items-center gap-8 shadow-2xl shrink-0 group hover:border-[#10b98133] transition-all cursor-pointer">
           <div className="text-right">
              <p className="text-[10px] font-black text-[#404040] uppercase tracking-widest mb-1">Balance</p>
              <p className="text-3xl font-black text-white leading-none tracking-tighter">{balance.toFixed(1)} <span className="text-[10px] text-[#262626]">MINS</span></p>
           </div>
           <div className="w-14 h-14 bg-white/3 border border-white/10 rounded-2xl flex items-center justify-center text-[#10b981] group-hover:scale-110 transition-transform">
              <Wallet size={28} />
           </div>
        </div>
      </div>

      {/* Stats - Grid with explicit grid-cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
         {stats.map((stat, i) => (
           <div 
             key={i} 
             className="min-h-[140px] p-8 bg-[#0A0A0B] border border-white/5 rounded-[48px] flex items-center justify-between shadow-2xl group hover:border-white/10 transition-all cursor-pointer"
           >
              <div className="flex flex-col gap-2">
                 <p className="text-[11px] font-black text-[#262626] uppercase tracking-[2px]">{stat.label}</p>
                 <h2 className="text-4xl font-black text-white tracking-tighter leading-none">{stat.value}</h2>
              </div>
              <div className="w-12 h-12 bg-black border border-white/5 rounded-xl flex items-center justify-center transition-all group-hover:bg-white/5" style={{ color: stat.color }}>
                 {stat.icon}
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 mt-4">
         
         {/* Neural Pulse */}
         <div className="xl:col-span-8 flex flex-col gap-10">
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
               <TrendingUp className="text-[#10b981]" size={32} /> Neural Pulse
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
               {[
                 { id: 1, title: 'CYBER DRIFT', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80', score: 98, color: '#10b981' },
                 { id: 2, title: 'NEON CORE', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80', score: 92, color: '#3b82f6' },
               ].map(item => (
                 <div 
                   key={item.id} 
                   className="relative h-[320px] rounded-[56px] overflow-hidden border border-white/5 bg-[#050505] shadow-2xl group cursor-pointer hover:border-white/10 transition-all"
                 >
                    <img src={item.img} className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-110 transition-transform duration-1000" alt={item.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-12 left-12">
                       <p className="text-white font-black text-4xl uppercase tracking-tighter leading-none mb-4">{item.title}</p>
                       <p className="text-[11px] font-black uppercase tracking-[4px]" style={{ color: item.color }}>{item.score}% Match</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Synthesis Launcher */}
         <div className="xl:col-span-4 flex flex-col">
            <div className="flex-1 p-10 lg:p-14 bg-[#0A0A0B] border border-white/5 rounded-[64px] shadow-2xl flex flex-col justify-between gap-16 relative overflow-hidden group hover:border-[#10b98133] transition-all">
               <div className="absolute top-0 right-0 w-60 h-60 bg-[#10b98108] rounded-full blur-[100px] -mr-20 -mt-20" />
               <div>
                  <div className="w-20 h-20 bg-[#10b9811a] border border-[#10b98133] rounded-3xl flex items-center justify-center text-[#10b981] mb-10 shadow-2xl group-hover:scale-110 transition-transform">
                     <Wand2 size={40} />
                  </div>
                  <h4 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[0.85]">Neural<br/>Synthesis</h4>
                  <p className="text-[11px] text-[#262626] font-black uppercase tracking-[4px] mt-8">LPU-driven engine active.</p>
               </div>
               <button 
                 onClick={() => router.push('/dashboard/ai-studio')}
                 className="w-full h-24 bg-white text-black font-black rounded-[32px] text-[14px] uppercase tracking-[6px] cursor-pointer border-none shadow-[0_30px_60px_rgba(255,255,255,0.15)] active:scale-95 transition-all hover:translate-y-[-6px]"
               >
                 Launch Studio
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
