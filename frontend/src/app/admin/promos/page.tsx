"use client";

import React, { useState, useEffect } from "react";
import { 
  Zap, Plus, Trash2, CheckCircle2, AlertCircle, 
  Clock, Database, Tag, Activity, RefreshCw,
  Eye, MousePointer2, Settings
} from "lucide-react";
import { toast } from "react-hot-toast";
import apiClient from "@/utils/apiClient";

export default function PromoManager() {
  const [promos, setPromos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // New Promo State
  const [newPromo, setNewPromo] = useState({
    code: "",
    amount: 10.0,
    expiry: ""
  });

  const fetchPromos = async () => {
    setIsLoading(true);
    try {
      const data: any = await apiClient.get('/api/admin/promos');
      setPromos(data);
    } catch (error) {
      toast.error("Failed to fetch promos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleCreatePromo = async () => {
    if (!newPromo.code) return toast.error("Bhai, code toh likho!");
    setIsCreating(true);
    try {
      await apiClient.post('/api/admin/promos/create', newPromo);
      toast.success(`Promo '${newPromo.code}' Created! ⚡`);
      setNewPromo({ code: "", amount: 10.0, expiry: "" });
      fetchPromos();
    } catch (error) {
      toast.error("Creation Failed");
    } finally {
      setIsCreating(false);
    }
  };

  const handleTogglePromo = async (id: string, currentStatus: boolean) => {
    try {
      await apiClient.put(`/api/admin/promos/toggle/${id}?active=${!currentStatus}`);
      toast.success(currentStatus ? "Promo Deactivated" : "Promo Activated");
      fetchPromos();
    } catch (error) {
      toast.error("Toggle Failed");
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="flex flex-col gap-3">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#00e5ff] rounded-full animate-pulse shadow-[0_0_10px_#00e5ff]"></div>
              <span className="text-[10px] font-black text-[#00e5ff] uppercase tracking-[6px]">Neural Boost Orchestrator</span>
           </div>
           <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Promo Commands</h2>
        </div>

        <div className="flex items-center gap-4">
           <div className="px-6 py-4 bg-white/2 border border-white/5 rounded-2xl flex flex-col items-end">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Active Boosts</span>
              <span className="text-xl font-black text-white">{promos.filter(p => p.is_active).length}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         {/* LEFT: CREATE PROMO */}
         <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-[#0A0A0B] border border-white/5 rounded-[48px] p-10 flex flex-col gap-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  <Zap size={120} />
               </div>
               
               <div className="flex flex-col gap-2 relative z-10">
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Forge New Code</h3>
                  <p className="text-[11px] text-zinc-500 leading-relaxed max-w-[200px]">Create atomic boosts to reward your top-tier creators.</p>
               </div>

               <div className="flex flex-col gap-6 relative z-10">
                  <div className="flex flex-col gap-2">
                     <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[2px] ml-1">Voucher Name</label>
                     <input 
                        value={newPromo.code}
                        onChange={(e) => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})}
                        placeholder="e.g. STARBOY"
                        className="h-14 bg-white/2 border border-white/5 rounded-2xl px-6 text-[12px] font-bold text-white focus:outline-none focus:border-[#00e5ff33] transition-all"
                     />
                  </div>

                  <div className="flex flex-col gap-2">
                     <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[2px] ml-1">Credit Payload (Mins)</label>
                     <input 
                        type="number"
                        value={newPromo.amount}
                        onChange={(e) => setNewPromo({...newPromo, amount: parseFloat(e.target.value)})}
                        className="h-14 bg-white/2 border border-white/5 rounded-2xl px-6 text-[12px] font-bold text-white focus:outline-none focus:border-[#00e5ff33] transition-all"
                     />
                  </div>

                  <div className="flex flex-col gap-2">
                     <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[2px] ml-1">Expiration Phase</label>
                     <input 
                        type="date"
                        value={newPromo.expiry}
                        onChange={(e) => setNewPromo({...newPromo, expiry: e.target.value})}
                        className="h-14 bg-white/2 border border-white/5 rounded-2xl px-6 text-[12px] font-bold text-white focus:outline-none focus:border-[#00e5ff33] transition-all"
                     />
                  </div>

                  <button 
                    onClick={handleCreatePromo}
                    disabled={isCreating}
                    className="h-16 bg-[#00e5ff] text-black rounded-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all group overflow-hidden mt-4"
                  >
                     <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest">{isCreating ? "Forging..." : "Initialize Code"}</span>
                  </button>
               </div>
            </div>

            <div className="bg-gradient-to-br from-[#00e5ff11] to-transparent border border-[#00e5ff22] rounded-[48px] p-10 flex items-center gap-6">
               <div className="w-12 h-12 bg-[#00e5ff] text-black rounded-2xl flex items-center justify-center">
                  <Activity size={24} />
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white uppercase italic">Neural Sync Active</span>
                  <span className="text-[9px] font-black text-[#00e5ff] uppercase tracking-widest">Global Propagation: 100%</span>
               </div>
            </div>
         </div>

         {/* RIGHT: PROMO LIST */}
         <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="bg-[#0A0A0B] border border-white/5 rounded-[48px] p-4 overflow-hidden">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-white/5">
                        <th className="p-8 text-[9px] font-black text-zinc-400 uppercase tracking-[3px]">Boost Code</th>
                        <th className="p-8 text-[9px] font-black text-zinc-400 uppercase tracking-[3px]">Payload</th>
                        <th className="p-8 text-[9px] font-black text-zinc-400 uppercase tracking-[3px]">Uptime</th>
                        <th className="p-8 text-[9px] font-black text-zinc-400 uppercase tracking-[3px]">Status</th>
                        <th className="p-8 text-[9px] font-black text-zinc-400 uppercase tracking-[3px]">Command</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/2">
                     {promos.map((promo) => (
                        <tr key={promo.id} className="group hover:bg-white/1 transition-colors">
                           <td className="p-8">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-white/2 rounded-xl flex items-center justify-center text-white font-black text-[10px]">
                                    {promo.code.substring(0, 1)}
                                 </div>
                                 <span className="text-[13px] font-black text-white tracking-tighter uppercase">{promo.code}</span>
                              </div>
                           </td>
                           <td className="p-8">
                              <div className="flex flex-col">
                                 <span className="text-[12px] font-black text-white">{promo.amount}m Credits</span>
                                 <span className="text-[9px] text-zinc-600 uppercase tracking-widest">Boost Magnitude</span>
                              </div>
                           </td>
                           <td className="p-8">
                              <div className="flex flex-col">
                                 <span className="text-[12px] font-black text-white">{promo.usage_count} Uses</span>
                                 <span className="text-[9px] text-zinc-600 uppercase tracking-widest">{promo.expiry || 'No Expiry'}</span>
                              </div>
                           </td>
                           <td className="p-8">
                              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                 promo.is_active ? 'bg-[#10b98122] text-[#10b981]' : 'bg-red-500/10 text-red-500'
                              }`}>
                                 <div className={`w-1 h-1 rounded-full ${promo.is_active ? 'bg-[#10b981]' : 'bg-red-500'} animate-pulse`}></div>
                                 {promo.is_active ? 'Active' : 'Offline'}
                              </div>
                           </td>
                           <td className="p-8">
                              <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button 
                                   onClick={() => handleTogglePromo(promo.id, promo.is_active)}
                                   className="p-3 bg-white/2 border border-white/5 rounded-xl text-zinc-500 hover:text-[#00e5ff] hover:border-[#00e5ff33] transition-all"
                                 >
                                    <Settings size={16} />
                                 </button>
                                 <button className="p-3 bg-white/2 border border-white/5 rounded-xl text-zinc-500 hover:text-red-500 hover:border-red-500/30 transition-all">
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

      </div>
    </div>
  );
}
