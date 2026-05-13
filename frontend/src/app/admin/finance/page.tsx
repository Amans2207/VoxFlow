"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, 
  CreditCard, Wallet, Activity, Globe, Zap, 
  ArrowUpRight, ArrowDownRight, Filter, Search,
  CheckCircle2, AlertCircle, Clock, ShieldCheck,
  Receipt, Landmark, Briefcase, PieChart, ShieldAlert
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, PieChart as RePieChart, Pie, Cell 
} from 'recharts';
import { toast } from "react-hot-toast";
import apiClient from "@/utils/apiClient";

const revenueData = [
  { name: 'May 07', mrr: 112000, new: 4500 },
  { name: 'May 08', mrr: 115000, new: 5200 },
  { name: 'May 09', mrr: 118000, new: 3800 },
  { name: 'May 10', mrr: 121000, new: 6100 },
  { name: 'May 11', mrr: 123000, new: 4900 },
  { name: 'May 12', mrr: 124500, new: 4200 },
];

const planData = [
  { name: 'Enterprise', value: 65, color: '#00e5ff' },
  { name: 'Studio', value: 25, color: '#a855f7' },
  { name: 'Creator', value: 10, color: '#f59e0b' },
];

export default function AdminBilling() {
  const [stats, setStats] = useState({
    mrr: 124500,
    churn: 0.84,
    ltv: 1450,
    cac: 124
  });

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRevokeAccess = async (email: string) => {
    try {
      await apiClient.put('/api/admin/status', { email, status: 'Suspended' });
      toast.error(`ACCESS REVOKED: ${email}'s Pro features have been locked.`, {
        style: { background: '#0a0a0b', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase' }
      });
    } catch (error) {
      toast.error("Status Update Failed.");
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="flex flex-col gap-3">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
              <span className="text-[10px] font-black text-[#10b981] uppercase tracking-[6px]">Omnipotent Fiscal Stream</span>
           </div>
           <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Finance Architecture</h2>
        </div>

        <div className="flex items-center gap-4">
           <button className="h-16 px-8 bg-white/2 border border-white/5 rounded-2xl flex items-center gap-3 text-zinc-500 hover:text-white transition-all">
              <Receipt size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Tax Ledger</span>
           </button>
           <button className="h-16 px-8 bg-[#10b981] text-black rounded-2xl flex items-center gap-3 hover:scale-[1.02] transition-all font-black uppercase tracking-widest text-[10px]">
              <Landmark size={18} />
              Withdrawal Center
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
         {/* LEFT: FINANCIAL CORE */}
         <div className="xl:col-span-8 flex flex-col gap-10">
            {/* STAT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               {[
                 { label: 'Total MRR', value: `$${stats.mrr.toLocaleString('en-US')}`, trend: '+14.2%', icon: <DollarSign size={18} />, color: '#00e5ff' },
                 { label: 'Churn Rate', value: `${stats.churn}%`, trend: '-0.12%', icon: <TrendingDown size={18} />, color: '#ef4444' },
                 { label: 'Avg LTV', value: `$${stats.ltv.toLocaleString('en-US')}`, trend: '+$84', icon: <Briefcase size={18} />, color: '#10b981' },
                 { label: 'CAC (Blended)', value: `$${stats.cac.toLocaleString('en-US')}`, trend: '-$12', icon: <Zap size={18} />, color: '#f59e0b' },
               ].map((stat, i) => (
                  <div key={i} className="bg-[#0A0A0B] border border-white/5 p-8 rounded-[32px] flex flex-col gap-4">
                     <div className="flex justify-between items-center">
                        <div className="p-2 bg-white/2 rounded-xl text-zinc-600" style={{ color: stat.color }}>{stat.icon}</div>
                        <span className={`text-[8px] font-black uppercase tracking-widest ${stat.trend.startsWith('+') ? 'text-[#10b981]' : 'text-red-500'}`}>{stat.trend}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">{stat.label}</span>
                        <span className="text-2xl font-black text-white italic">{stat.value}</span>
                     </div>
                  </div>
               ))}
            </div>

            {/* MRR GROWTH CHART */}
            <div className="bg-[#0A0A0B] border border-white/5 rounded-[48px] p-10 flex flex-col gap-10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5">
                  <PieChart size={200} />
               </div>
               
               <div className="flex justify-between items-center relative z-10">
                  <div className="flex flex-col gap-1">
                     <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">MRR Expansion Curve</h3>
                     <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[4px]">Verified Recurring Revenue</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <button className="h-10 px-6 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white">Daily</button>
                     <button className="h-10 px-6 bg-transparent text-[9px] font-black uppercase tracking-widest text-zinc-700">Monthly</button>
                  </div>
               </div>

                <div className="h-[350px] w-full relative z-10">
                   {isMounted && (
                     <ResponsiveContainer width="100%" height={300}>
                       <AreaChart data={revenueData}>
                         <defs>
                           <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                           </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#404040', fontSize: 10, fontWeight: 900}} dy={15} />
                         <Tooltip contentStyle={{backgroundColor: '#0A0A0B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px'}} />
                         <Area type="monotone" dataKey="mrr" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorMRR)" />
                       </AreaChart>
                     </ResponsiveContainer>
                   )}
                </div>
            </div>
         </div>

         {/* RIGHT: DISTRIBUTION & LOGS */}
         <div className="xl:col-span-4 flex flex-col gap-10">
            {/* PLAN DISTRIBUTION */}
            <div className="bg-[#0A0A0B] border border-white/5 rounded-[48px] p-10 flex flex-col gap-8">
               <h4 className="text-[10px] font-black text-zinc-700 uppercase tracking-widest italic">Plan Distribution</h4>
                <div className="h-[200px] w-full flex items-center justify-center relative">
                   {isMounted && (
                     <ResponsiveContainer width="100%" height={300}>
                       <RePieChart>
                         <Pie
                           data={planData}
                           cx="50%"
                           cy="50%"
                           innerRadius={60}
                           outerRadius={80}
                           paddingAngle={10}
                           dataKey="value"
                         >
                           {planData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                           ))}
                         </Pie>
                       </RePieChart>
                     </ResponsiveContainer>
                   )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-[9px] font-black text-zinc-700 uppercase">Top Plan</span>
                     <span className="text-xl font-black text-white italic">Enterprise</span>
                  </div>
               </div>
               <div className="flex flex-col gap-3">
                  {planData.map((item, i) => (
                     <div key={i} className="flex justify-between items-center p-3 bg-white/2 rounded-xl">
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                           <span className="text-[9px] font-black text-white uppercase">{item.name}</span>
                        </div>
                        <span className="text-[10px] font-black text-zinc-600">{item.value}%</span>
                     </div>
                  ))}
               </div>
            </div>

            {/* RECENT SETTLEMENTS */}
            <div className="bg-[#0A0A0B] border border-white/5 rounded-[40px] p-8 flex flex-col gap-6">
               <span className="text-[10px] font-black text-white uppercase tracking-widest">Recent Transactions</span>
               <div className="flex flex-col gap-3">
                  {[
                    { id: 'TXN-8812', amount: 1499, user: 'james@vfx.io', status: 'PAID' },
                    { id: 'TXN-8811', amount: 499, user: 'sarah@design.co', status: 'PAID' },
                    { id: 'TXN-8810', amount: 1499, user: 'elena@agency.net', status: 'PAID' },
                  ].map((tx, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-white/2 rounded-xl group hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-[#10b98111] rounded-xl flex items-center justify-center text-[#10b981]">
                              <ArrowDownRight size={16} />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[9px] font-black text-white uppercase group-hover:text-[#00e5ff] transition-colors">${tx.amount}</span>
                              <span className="text-[7px] font-bold text-zinc-700 uppercase">{tx.user}</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="px-3 py-1 bg-[#10b98122] rounded-full text-[7px] font-black text-[#10b981] uppercase">{tx.status}</div>
                           <button 
                             onClick={() => handleRevokeAccess(tx.user)}
                             className="opacity-0 group-hover:opacity-100 p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                           >
                              <ShieldAlert size={12} />
                           </button>
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
