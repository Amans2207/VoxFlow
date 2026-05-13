"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, Video, CreditCard, Cpu, TrendingUp, ArrowUpRight, 
  ArrowDownRight, Activity, Zap, DollarSign, Wallet, 
  Clock, CheckCircle2, AlertTriangle, Shield
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, LineChart, Line 
} from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000, renders: 240 },
  { name: 'Tue', revenue: 3000, renders: 198 },
  { name: 'Wed', revenue: 2000, renders: 980 },
  { name: 'Thu', revenue: 2780, renders: 3908 },
  { name: 'Fri', revenue: 1890, renders: 4800 },
  { name: 'Sat', revenue: 2390, renders: 3800 },
  { name: 'Sun', revenue: 3490, renders: 4300 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    liveEditors: 42,
    totalRenders: 8492,
    creditsBurned: 12450.5,
    serverLoad: 12.4
  });

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-700">
      
      {/* PRIMARY HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Live Editors', value: stats.liveEditors, icon: <Users size={20} />, color: '#00e5ff', trend: '+12%', sub: 'Active in last 5m' },
          { label: 'Total Renders (24h)', value: stats.totalRenders, icon: <Video size={20} />, color: '#a855f7', trend: '+24%', sub: 'Neural Tasks' },
          { label: 'Credits Burned', value: `${stats.creditsBurned.toLocaleString('en-US')}m`, icon: <Zap size={20} />, color: '#f59e0b', trend: '+8.1%', sub: 'API Consumption' },
          { label: 'Server/GPU Load', value: `${stats.serverLoad}%`, icon: <Cpu size={20} />, color: '#10b981', trend: 'STABLE', sub: 'H100 Cluster' },
        ].map((stat, i) => (
          <div key={i} className="group relative">
             <div className="absolute inset-0 bg-gradient-to-br from-[#00e5ff10] to-transparent rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             <div className="bg-[#0A0A0B] border border-white/5 p-8 rounded-[32px] flex flex-col gap-6 relative z-10 hover:border-[#00e5ff33] transition-all duration-300">
                <div className="flex justify-between items-start">
                   <div className="p-3 bg-white/2 rounded-2xl text-zinc-500 group-hover:text-white transition-colors" style={{ color: stat.color }}>
                      {stat.icon}
                   </div>
                   <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${stat.trend.startsWith('+') ? 'bg-[#10b98122] text-[#10b981]' : 'bg-white/5 text-zinc-500'}`}>
                      {stat.trend}
                   </div>
                </div>
                <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[2px]">{stat.label}</span>
                   <h3 className="text-4xl font-black text-white tracking-tighter italic">{stat.value}</h3>
                </div>
                <div className="flex items-center gap-2">
                   <Activity size={12} className="text-zinc-800" />
                   <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest">{stat.sub}</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* CHARTS & REVENUE HUD */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Revenue Chart */}
        <div className="xl:col-span-2 bg-[#0A0A0B] border border-white/5 rounded-[48px] p-10 flex flex-col gap-10">
           <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Revenue Architecture</h3>
                 <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[4px]">7-Day Growth Metrics</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00e5ff]"></div>
                    <span className="text-[8px] font-black text-zinc-500 uppercase">Revenue</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/10"></div>
                    <span className="text-[8px] font-black text-zinc-500 uppercase">Renders</span>
                 </div>
              </div>
           </div>
           
           <div className="h-[400px] w-full">
              {isMounted && (
                <ResponsiveContainer width="100%" aspect={2}>
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#404040', fontSize: 10, fontWeight: 900}} 
                      dy={15}
                    />
                    <YAxis 
                      hide 
                    />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#0A0A0B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px'}}
                      itemStyle={{fontWeight: 'black', textTransform: 'uppercase'}}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#00e5ff" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="renders" stroke="rgba(255,255,255,0.1)" strokeWidth={2} fillOpacity={0} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
           </div>
        </div>

        {/* Financial Sidebar */}
        <div className="flex flex-col gap-8">
           <div className="bg-gradient-to-br from-[#00e5ff11] to-transparent border border-[#00e5ff22] rounded-[48px] p-10 flex flex-col gap-8 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#00e5ff11] blur-[80px] rounded-full group-hover:bg-[#00e5ff22] transition-all"></div>
              
              <div className="flex flex-col gap-2">
                 <span className="text-[10px] font-black text-[#00e5ff] uppercase tracking-[6px]">Financial Summary</span>
                 <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">MRR Console</h3>
              </div>

              <div className="flex flex-col gap-6">
                 <div className="flex justify-between items-end border-b border-white/5 pb-6">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Active MRR</span>
                       <span className="text-4xl font-black text-white">$124,500</span>
                    </div>
                    <ArrowUpRight className="text-[#10b981] mb-1" size={24} />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                       <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Daily Sales</span>
                       <span className="text-lg font-black text-white">$8,420</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Refund Rate</span>
                       <span className="text-lg font-black text-white">0.42%</span>
                    </div>
                 </div>
              </div>

              <button className="h-16 w-full bg-white text-black text-[10px] font-black uppercase rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-[1.02] transition-all">
                 Download Fiscal Report
              </button>
           </div>

           <div className="bg-[#0A0A0B] border border-white/5 rounded-[40px] p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Recent Webhooks</span>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></div>
                    <span className="text-[8px] font-black text-zinc-700 uppercase">Live Listener</span>
                 </div>
              </div>
              
              <div className="flex flex-col gap-3">
                 {[
                    { event: 'payment.succeeded', provider: 'Stripe', time: '2m ago', status: 'OK' },
                    { event: 'subscription.created', provider: 'Razorpay', time: '14m ago', status: 'OK' },
                    { event: 'payment.failed', provider: 'Stripe', time: '42m ago', status: 'WARN' },
                 ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/2 rounded-xl border border-white/2 hover:border-white/5 transition-all cursor-pointer group">
                       <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${log.status === 'OK' ? 'bg-[#10b98111] text-[#10b981]' : 'bg-red-500/10 text-red-500'}`}>
                             {log.event[0].toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[9px] font-black text-white uppercase group-hover:text-[#00e5ff] transition-colors">{log.event}</span>
                             <span className="text-[7px] font-bold text-zinc-600 uppercase">{log.provider}</span>
                          </div>
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
