"use client";

import React, { useState, useEffect } from "react";
import { createClient } from '@/utils/supabase/client';
import { 
  Shield, Zap, Globe, Activity, Users, CreditCard, Terminal, 
  AlertTriangle, TrendingUp, Cpu, Server, ShieldCheck, 
  Database, History, CheckCircle2, XCircle, Loader2, RefreshCw 
} from 'lucide-react';
import InteractiveGlobe from "@/components/InteractiveGlobe";
import { useToast } from '@/components/Toast';
import { soundEngine } from '@/utils/SoundEngine';

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [vipCredits, setVipCredits] = useState(500);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [vipEmail, setVipEmail] = useState("");
  const [vipName, setVipName] = useState("");
   const [isInjecting, setIsInjecting] = useState(false);
   const [systemHealth, setSystemHealth] = useState<any>({ database: 'offline', neural_link: 'offline' });


  useEffect(() => {
    const fetchAdminData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile?.role === 'Admin' || user.email === 'admin@voxflow.ai') {
          setIsAdmin(true);
          
          // Fetch Maintenance Status
          const maint = await safeFetch('/api/admin/maintenance');
          setIsMaintenance(maint.active);

          // Fetch System Health
          const health = await safeFetch('/api/health');
          setSystemHealth(health);

          // Fetch Pending Transactions
          setPendingTransactions([
            { id: '1', amount: 999, utr: '876608312901', user_id: 'User_442', user_email: 'test@user.com', user_name: 'Test User' },
            { id: '2', amount: 2499, utr: 'UTR_88229911', user_id: 'User_901', user_email: 'creator@vfx.io', user_name: 'Creator' }
          ]);

          // Fetch Users (Mock for now)
          setUsers([
            { id: '1', email: 'aman@voxflow.ai', credits: 500, role: 'Admin' },
            { id: '2', email: 'user@test.com', credits: 45, role: 'Free' }
          ]);
        }
      }
      setLoading(false);
    };
    fetchAdminData();
  }, []);

  const handleToggleMaintenance = async () => {
    const newState = !isMaintenance;
    try {
      await safeFetch('/api/admin/maintenance/toggle', {
        method: 'POST',
        body: JSON.stringify({ active: newState })
      });
      setIsMaintenance(newState);
      showToast(newState ? "Maintenance Activated" : "System Restored", newState ? "error" : "success");
      soundEngine?.play(newState ? "alert" : "success");
    } catch (e) {
      showToast("Sync Failed", "error");
    }
  };

  const handleRefreshQueue = () => {
    console.log("[Admin Hub] Refreshing Verification Queue...");
    setIsRefreshing(true);
    soundEngine?.play("processing");
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("Queue Synced Successfully", "success");
      soundEngine?.play("success");
    }, 1500);
  };

  const handleApproveTransaction = async (id: string, utr: string, userId: string, amount: number, email: string, name: string) => {
    console.log(`[Admin Hub] Approving Transaction ID: ${id} | UTR: ${utr}`);
    try {
      await safeFetch('/api/admin/approve-payment', {
        method: 'POST',
        body: JSON.stringify({
          transactionId: id,
          userId: userId,
          amount: amount,
          userName: name,
          userEmail: email
        })
      });
      setPendingTransactions(prev => prev.filter(t => t.id !== id));
      showToast(`Approved Transaction ${utr}`, "success");
      soundEngine?.play("success");
    } catch (e) {
      showToast("Approval Failed", "error");
    }
  };

  const handleRejectTransaction = (id: string, utr: string) => {
    console.log(`[Admin Hub] Rejecting Transaction ID: ${id} | UTR: ${utr}`);
    setPendingTransactions(prev => prev.filter(t => t.id !== id));
    showToast(`Rejected Transaction ${utr}`, "error");
    soundEngine?.play("click");
  };

  const handleInjectVip = async () => {
    if (!vipEmail || !vipName) {
      showToast("Please fill all VIP fields", "error");
      return;
    }
    console.log(`[Admin Hub] Injecting ${vipCredits} credits into VIP account...`);
    setIsInjecting(true);
    soundEngine?.play("processing");
    try {
      await safeFetch('/api/admin/create-vip', {
        method: 'POST',
        body: JSON.stringify({
          email: vipEmail,
          fullName: vipName,
          password: "temporary_vip_pass", // In real app, user would set this
          initialCredits: vipCredits
        })
      });
      showToast(`Injected ${vipCredits} Credits into ${vipEmail}`, "success");
      setVipEmail("");
      setVipName("");
    } catch (e) {
      showToast("Injection Failed", "error");
    } finally {
      setIsInjecting(false);
    }
  };

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#050505]">
       <Loader2 size={48} className="text-[#10b981] animate-spin" />
    </div>
  );

  if (!isAdmin) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#050505] gap-8 p-6 text-center">
       <AlertTriangle size={80} className="text-[#ef4444] animate-pulse" />
       <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-widest">Unauthorized</h1>
       <p className="text-[10px] font-black text-[#404040] uppercase tracking-[4px]">Security Clearance Level 5 Required</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-10 lg:gap-16 pb-24 lg:pb-20">
       
       {/* Header */}
       <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-8">
          <div>
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-white m-0 leading-none">
                Command <span className="text-[#10b981]">Center</span>
             </h1>
             <p className="text-[10px] font-black text-[#404040] uppercase tracking-[4px] mt-4 flex items-center gap-2">
                <ShieldCheck className="text-[#10b981]" size={14} /> Security Clearance: L5 Admin Access
             </p>
          </div>
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
             <button 
               onClick={handleToggleMaintenance}
               className={`h-16 px-8 rounded-2xl border flex items-center gap-4 transition-all ${isMaintenance ? 'bg-[#ef4444] border-[#ef4444] text-white' : 'bg-white/3 border-white/5 text-[#404040] hover:text-white'}`}
             >
                <Shield size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">{isMaintenance ? "Maintenance ACTIVE" : "Toggle Maintenance"}</span>
             </button>
             <div className="bg-white/3 p-4 md:p-5 rounded-2xl border border-white/5 text-right">
                <p className="text-[9px] font-black text-[#404040] uppercase tracking-widest">Neural Engine</p>
                <p className="text-lg font-black text-[#10b981] uppercase">OPTIMIZED</p>
             </div>
          </div>
       </header>

       {/* Map & Logs */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          <div className="lg:col-span-2 h-[350px] lg:h-[500px] bg-[#0A0A0B] rounded-[48px] border border-white/5 overflow-hidden relative shadow-2xl">
             <div className="absolute top-6 lg:top-8 left-6 lg:left-10 z-10">
                <h3 className="text-xs lg:text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                   <Globe size={18} className="text-[#3b82f6]" /> AI Traffic Heatmap
                </h3>
             </div>
             <InteractiveGlobe />
          </div>

          <div className="p-8 lg:p-10 bg-[#0A0A0B] rounded-[48px] border border-white/5 flex flex-col shadow-2xl">
             <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                <Terminal size={18} className="text-[#10b981]" /> Neural Stream
             </h3>
             <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 max-h-[300px] lg:max-h-none">
                {[
                  "User [aman@voxflow] started render.",
                  "Mumbai Node sync complete.",
                  "Viral peak detected in JP market.",
                  "Optimizing GPU Cluster 08.",
                  "Security audit [L5] initiated."
                ].map((log, i) => (
                  <div key={i} className="p-4 bg-white/2 rounded-xl text-[9px] lg:text-[10px] text-[#404040] font-mono leading-relaxed">
                     <span className="text-[#262626]">[{new Date().toLocaleTimeString()}]</span> {log}
                  </div>
                ))}
             </div>
          </div>
       </div>

         {/* Middle Row: Analytics & Infrastructure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
           {/* Production Analytics */}
           <div className="p-8 lg:p-12 bg-[#0A0A0B] rounded-[48px] border border-white/5 shadow-2xl flex flex-col gap-10">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                    <Activity className="text-[#CCFF00]" size={24} /> Growth Metrics
                 </h3>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-[#CCFF00] rounded-full"></div>
                       <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Videos Made</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-[#3b82f6] rounded-full"></div>
                       <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Signups</span>
                    </div>
                 </div>
              </div>
              <div className="flex items-end justify-between h-40 gap-4 px-4">
                 {[45, 62, 85, 34, 95, 78, 55].map((val, i) => (
                   <div key={i} className="flex-1 flex flex-col items-center gap-3">
                      <div className="w-full flex gap-1 items-end h-full">
                         <motion.div 
                           initial={{ height: 0 }}
                           animate={{ height: `${val}%` }}
                           className="flex-1 bg-gradient-to-t from-[#CCFF0033] to-[#CCFF00] rounded-t-lg"
                         />
                         <motion.div 
                           initial={{ height: 0 }}
                           animate={{ height: `${val * 0.6}%` }}
                           className="flex-1 bg-gradient-to-t from-[#3b82f633] to-[#3b82f6] rounded-t-lg"
                         />
                      </div>
                      <span className="text-[8px] font-black text-[#202020] uppercase">{['M','T','W','T','F','S','S'][i]}</span>
                   </div>
                 ))}
              </div>
           </div>

           {/* Infrastructure Pillar */}
           <div className="p-8 lg:p-12 bg-[#0A0A0B] rounded-[48px] border border-white/5 shadow-2xl flex flex-col gap-10">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                 <Cpu className="text-[#3b82f6]" size={24} /> Infrastructure
              </h3>
              <div className="flex flex-col gap-6">
                 {[
                   { label: 'NEURAL LINK', val: systemHealth.neural_link?.toUpperCase(), color: systemHealth.neural_link === 'online' ? '#10b981' : '#ef4444' },
                   { label: 'DATABASE', val: systemHealth.database?.toUpperCase(), color: systemHealth.database === 'online' ? '#10b981' : '#ef4444' },
                   { label: 'CACHE SIZE', val: `${systemHealth.cache_size} ENTRIES`, color: '#3b82f6' },
                   { label: 'VRAM UTILIZATION', val: '68%', color: '#a855f7' }
                 ].map(stat => (
                   <div key={stat.label} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-none">
                      <span className="text-[10px] font-black text-[#404040] uppercase tracking-widest">{stat.label}</span>
                      <span className="text-sm font-black text-white" style={{ color: stat.color }}>{stat.val}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Management Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
           
           {/* User Management */}
           <div className="p-8 lg:p-12 bg-[#0A0A0B] rounded-[48px] border border-white/5 shadow-2xl flex flex-col gap-10">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                 <Users className="text-[#3b82f6]" size={24} /> Neural Users
              </h3>
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] no-scrollbar">
                 {users.map(u => (
                   <div key={u.id} className="p-5 bg-white/2 border border-white/5 rounded-2xl flex justify-between items-center">
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black text-white uppercase tracking-tight">{u.email}</span>
                         <span className="text-[8px] font-bold text-zinc-600 uppercase">{u.credits} Credits</span>
                      </div>
                      <div className="flex gap-2">
                         <button className="p-2 bg-white/5 rounded-lg text-zinc-600 hover:text-white"><AlertTriangle size={14} /></button>
                         <button className="p-2 bg-white/5 rounded-lg text-zinc-600 hover:text-white"><CreditCard size={14} /></button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* VIP Generator */}
           <div className="p-8 lg:p-12 bg-[#0A0A0B] rounded-[48px] border border-white/5 shadow-2xl flex flex-col gap-10">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                 <Zap className="text-[#10b981]" size={24} /> VIP Injector
              </h3>
              <div className="flex flex-col gap-6">
                 <input 
                   type="text" 
                   placeholder="FULL NAME" 
                   value={vipName}
                   onChange={(e) => setVipName(e.target.value)}
                   className="h-14 px-6 bg-white/2 border border-white/5 rounded-2xl text-white text-[11px] font-black uppercase tracking-widest outline-none focus:border-white/10" 
                 />
                 <input 
                   type="email" 
                   placeholder="CREATOR EMAIL" 
                   value={vipEmail}
                   onChange={(e) => setVipEmail(e.target.value)}
                   className="h-14 px-6 bg-white/2 border border-white/5 rounded-2xl text-white text-[11px] font-black uppercase tracking-widest outline-none focus:border-white/10" 
                 />
                 <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span className="text-[#404040]">CREDITS</span>
                       <span className="text-[#10b981]">{vipCredits} MINS</span>
                    </div>
                    <input 
                     type="range" 
                     min="100" 
                     max="2000" 
                     step="100" 
                     value={vipCredits} 
                     onChange={(e) => setVipCredits(parseInt(e.target.value))} 
                     className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#10b981]" 
                    />
                 </div>
                 <button 
                   onClick={handleInjectVip}
                   disabled={isInjecting}
                   className="h-14 mt-4 bg-[#10b981] text-black font-black rounded-2xl text-[11px] uppercase tracking-[2px] border-none shadow-xl active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                 >
                   {isInjecting ? "Processing..." : "Inject Access"}
                 </button>
              </div>
           </div>

           {/* Pending Queue */}
           <div className="p-8 lg:p-12 bg-[#0A0A0B] rounded-[48px] border border-white/5 shadow-2xl flex flex-col gap-10">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                    <Database className="text-[#3b82f6]" size={24} /> Payments
                 </h3>
                 <RefreshCw 
                   onClick={handleRefreshQueue}
                   className={`text-[#404040] cursor-pointer hover:text-white transition-all ${isRefreshing ? 'animate-spin' : ''}`} 
                   size={20} 
                 />
              </div>
              <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar max-h-[400px]">
                 {pendingTransactions.map(t => (
                   <div key={t.id} className="p-6 bg-white/2 border border-white/5 rounded-[32px] flex flex-col gap-4 hover:border-white/10 transition-all">
                      <div>
                         <p className="text-lg font-black text-white tracking-tighter">₹{t.amount}</p>
                         <p className="text-[8px] font-black text-[#404040] uppercase tracking-widest mt-1">UTR: {t.utr}</p>
                      </div>
                      <div className="flex items-center gap-3">
                         <button 
                           onClick={() => handleApproveTransaction(t.id, t.utr, t.user_id, t.amount, t.user_email, t.user_name)}
                           className="h-12 flex-1 bg-[#10b981] rounded-xl flex items-center justify-center border-none shadow-xl active:scale-90 transition-all cursor-pointer"
                         >
                            <CheckCircle2 size={20} className="text-black" />
                         </button>
                         <button 
                           onClick={() => handleRejectTransaction(t.id, t.utr)}
                           className="h-12 flex-1 bg-[#ef44441a] border border-[#ef444433] rounded-xl flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                         >
                            <XCircle size={20} className="text-[#ef4444]" />
                         </button>
                      </div>
                   </div>
                 ))}
                 {pendingTransactions.length === 0 && (
                   <div className="text-center py-10">
                      <p className="text-[9px] font-black text-[#404040] uppercase tracking-widest">Queue Clear</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

       <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
       `}</style>
    </div>
  );
}
