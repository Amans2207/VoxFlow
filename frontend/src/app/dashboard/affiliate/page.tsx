"use client";

import React, { useState } from "react";
import { Users, DollarSign, Rocket, Share2, Copy, BarChart3, TrendingUp, Award, ChevronRight, Zap } from "lucide-react";
import { useToast } from "@/components/Toast";
import { soundEngine } from "@/utils/SoundEngine";

export default function AffiliateDashboard() {
  const { showToast } = useToast();

  const copyRef = () => {
    navigator.clipboard.writeText("https://voxflow.ai/ref=aman_vip");
    console.log("[Affiliate] Link copied to clipboard.");
    showToast("Affiliate Link Copied!", "success");
    soundEngine?.play("success");
  };

  const handleShareBroadcast = () => {
    console.log("[Affiliate] Initializing Share Broadcast sequence...");
    soundEngine?.play("processing");
    showToast("Preparing Broadcast Materials", "info");
  };

  return (
    <div className="flex flex-col gap-10 lg:gap-16 pb-24 lg:pb-20">
       
       {/* Header */}
       <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-8">
          <div>
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-white m-0 leading-none">
                Ambassador <span className="text-[#CCFF00]">Portal</span>
             </h1>
             <p className="text-[10px] font-black text-[#404040] uppercase tracking-[4px] mt-4 flex items-center gap-2">
                <Award className="text-[#CCFF00]" size={14} /> VIP Ambassador Tier | 30% Lifetime Commission
             </p>
          </div>
          <div className="w-full md:w-auto flex items-center gap-4 bg-[#CCFF001a] p-5 rounded-2xl border border-[#CCFF0033] shadow-xl">
             <div className="text-right flex-1 md:flex-none">
                <p className="text-[9px] font-black text-[#CCFF00] uppercase tracking-widest">Total Earnings</p>
                <p className="text-2xl font-black text-white uppercase tracking-tighter">₹42,500</p>
             </div>
             <div className="w-12 h-12 bg-[#CCFF00] rounded-xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                <DollarSign size={24} />
             </div>
          </div>
       </header>

       {/* Stats Grid */}
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {[
            { label: "Total Referrals", value: "142", color: '#3b82f6', icon: <Users size={20} /> },
            { label: "Active Subs", value: "28", color: '#ef4444', icon: <Rocket size={20} /> },
            { label: "Conversion Rate", value: "12.4%", color: '#10b981', icon: <TrendingUp size={20} /> },
            { label: "Payout Due", value: "₹8,200", color: '#CCFF00', icon: <Zap size={20} /> }
          ].map((stat, i) => (
            <div key={i} className="p-6 lg:p-8 bg-[#0A0A0B] rounded-[32px] border border-white/5 shadow-2xl">
               <div className="flex justify-between items-center mb-6">
                  <span className="text-[9px] font-black text-[#404040] uppercase tracking-widest">{stat.label}</span>
                  <div style={{ color: stat.color }}>{stat.icon}</div>
               </div>
               <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
            </div>
          ))}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          
          {/* Chart Area */}
          <div className="lg:col-span-2 p-8 lg:p-12 bg-[#0A0A0B] rounded-[48px] border border-white/5 shadow-2xl flex flex-col gap-10">
             <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                   <BarChart3 className="text-[#3b82f6]" size={24} /> Earnings Velocity
                </h3>
             </div>
             <div className="h-60 flex items-end gap-3 lg:gap-5 pb-6 overflow-x-auto no-scrollbar snap-x">
                {[40, 60, 45, 90, 65, 80, 100].map((h, i) => (
                  <div key={i} className="flex-1 min-w-[30px] snap-center rounded-xl transition-all duration-700 shadow-2xl" style={{ height: `${h}%`, backgroundColor: i === 6 ? '#CCFF00' : 'rgba(255,255,255,0.03)', border: i === 6 ? 'none' : '1px solid rgba(255,255,255,0.05)' }} />
                ))}
             </div>
             <div className="flex justify-between text-[9px] font-black text-[#404040] uppercase tracking-widest">
                <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
             </div>
          </div>

          {/* Referral Kit */}
          <div className="flex flex-col gap-8 lg:gap-10">
             <div className="p-8 lg:p-10 bg-[#0A0A0B] rounded-[48px] border border-white/5 shadow-2xl">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-10">Referral Kit</h3>
                
                <div className="flex flex-col gap-8">
                   <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-black text-[#404040] uppercase tracking-widest pl-2">Unique Link</label>
                      <div className="flex gap-2">
                         <input readOnly value="voxflow.ai/ref=aman_vip" className="h-14 px-5 flex-1 bg-white/2 border border-white/5 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest outline-none" />
                         <button onClick={copyRef} className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-black active:scale-90 transition-all border-none cursor-pointer"><Copy size={18} /></button>
                      </div>
                   </div>
                   
                   <button 
                    onClick={handleShareBroadcast}
                    className="h-16 w-full bg-[#3b82f6] text-white font-black rounded-2xl text-[10px] uppercase tracking-[4px] border-none shadow-[0_20px_40px_rgba(59,130,246,0.2)] active:scale-95 transition-all flex items-center justify-center gap-3"
                   >
                      <Share2 size={20} /> Share Broadcast
                   </button>
                </div>
             </div>

             <div className="p-8 lg:p-10 bg-[#CCFF000d] border border-[#CCFF001a] rounded-[48px] shadow-xl">
                <Award className="text-[#CCFF00] mb-6" size={32} />
                <h4 className="text-xl lg:text-2xl font-black text-white uppercase tracking-tighter leading-none">Ambassador<br/>Bounty</h4>
                <p className="text-[10px] text-[#404040] font-black uppercase tracking-widest mt-6 leading-relaxed">Refer 50 users this month to unlock a 50% commission boost.</p>
             </div>
          </div>
       </div>

       <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
