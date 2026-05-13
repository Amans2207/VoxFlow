"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, Search, Filter, MoreHorizontal, UserPlus, 
  Building2, CreditCard, ShieldAlert, History, Mail,
  ExternalLink, Ban, CheckCircle2, ChevronDown, Plus,
  LayoutGrid, List, Zap, Shield
} from "lucide-react";
import { toast } from "react-hot-toast";
import apiClient from "@/utils/apiClient";
import { useUserStore } from "@/store/useUserStore";

export default function AdminUsers() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'Users' | 'Agencies'>('Users');

  const [users, setUsers] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const { updateCredits } = useUserStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData: any = await apiClient.get('/api/admin/users');
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to sync neural profiles:", error);
        toast.error("Neural Sync Failure. Check Backend Connection.");
      }
    };
    fetchData();
  }, []);

  const handleUpdateCredits = async (email: string) => {
    const amount = parseFloat(prompt("Enter credits to inject:") || "0");
    if (amount > 0) {
      try {
        await apiClient.post('/api/admin/credits', { email, amount, action: 'add' });
        toast.success(`INJECTED ${amount} CREDITS to ${email}`, {
          style: { background: '#0a0a0b', color: '#00e5ff', border: '1px solid rgba(0, 229, 255, 0.2)', fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase' }
        });
        // Refresh local state or rely on socket
      } catch (error) {
        toast.error("Credit Injection Failed.");
      }
    }
  };

  const handleUpdateStatus = async (email: string, status: string) => {
    try {
      await apiClient.put('/api/admin/status', { email, status });
      toast.success(`STATUS UPDATED: ${email} is now ${status}`);
    } catch (error) {
      toast.error("Status Sync Failed.");
    }
  };

  const handleUpdateRole = async (email: string) => {
    const role = prompt("Enter Role (STANDARD, VIP, SUPER_USER):", "VIP")?.toUpperCase();
    if (!role) return;
    
    let custom_credit_limit = null;
    if (role === 'VIP') {
      custom_credit_limit = parseFloat(prompt("Enter Custom Monthly Credit Limit (Override):", "500") || "0");
    }

    try {
      await apiClient.put('/api/admin/role', { email, role, custom_credit_limit });
      toast.success(`ROLE ELEVATED: ${email} is now ${role}`);
    } catch (error) {
      toast.error("Role Elevation Failed.");
    }
  };

  const handleCreateAgency = () => {
    toast.success("AGENCY INITIALIZED: Creating neural workspace partition...", {
      style: { background: '#0a0a0b', color: '#00e5ff', border: '1px solid rgba(0, 229, 255, 0.2)', fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase' }
    });
  };

  const handleInviteUser = (agencyId: string) => {
    const userId = prompt("Enter User ID to link to this Agency umbrella:");
    if (userId) {
      toast.success(`USER LINKED: ${userId} is now part of the corporate pool.`, {
        style: { background: '#0a0a0b', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase' }
      });
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="flex flex-col gap-3">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#00e5ff] rounded-full animate-pulse shadow-[0_0_10px_#00e5ff]"></div>
              <span className="text-[10px] font-black text-[#00e5ff] uppercase tracking-[6px]">Omnipotent Tenant Control</span>
           </div>
           <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Workspace Master</h2>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="flex-1 md:w-[400px] h-16 bg-[#0a0a0b] border border-white/5 rounded-2xl flex items-center px-6 gap-4 group focus-within:border-[#00e5ff33] transition-all relative">
              <div className="absolute inset-0 bg-[#00e5ff02] opacity-0 group-focus-within:opacity-100 transition-opacity rounded-2xl"></div>
              <Search size={18} className="text-zinc-500 group-focus-within:text-[#00e5ff] relative z-10" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Identity, Email, or Organization..." 
                className="bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-widest placeholder:text-zinc-500 w-full relative z-10"
              />
           </div>
           <button 
             onClick={handleCreateAgency}
             className="h-16 px-8 bg-[#00e5ff] text-black rounded-2xl flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all group shadow-[0_0_20px_rgba(0,229,255,0.3)]"
           >
              <Building2 size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Create New Agency</span>
           </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex bg-[#0A0A0B] p-2 rounded-[32px] border border-white/5 w-fit">
         {['Users', 'Agencies'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab as any)}
              className={`px-10 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${
                activeTab === tab ? "bg-white/5 text-[#00e5ff] shadow-[inset_0_0_20px_rgba(0,229,255,0.05)]" : "text-zinc-600 hover:text-white"
              }`}
            >
               {tab}
            </button>
         ))}
      </div>

      {/* DATA TABLE */}
      <div className="bg-[#0A0A0B] border border-white/5 rounded-[48px] overflow-hidden shadow-2xl">
         {activeTab === 'Users' ? (
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-white/5">
                     <th className="p-8 text-[9px] font-black text-zinc-400 uppercase tracking-widest">User Details</th>
                     <th className="p-8 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Workspace</th>
                     <th className="p-8 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Tier</th>
                     <th className="p-8 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Credits</th>
                     <th className="p-8 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                     <th className="p-8 text-[9px] font-black text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {users.map(user => (
                     <tr key={user.id} className="border-b border-white/2 hover:bg-white/[0.01] transition-colors group">
                        <td className="p-8">
                           <div className="flex items-center gap-5">
                              <div className="w-12 h-12 bg-white/2 border border-white/5 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-[#00e5ff] transition-all">
                                 <Users size={20} />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[11px] font-black text-white uppercase tracking-tight">{user.name}</span>
                                 <span className="text-[9px] font-bold text-zinc-700">{user.email}</span>
                              </div>
                           </div>
                        </td>
                        <td className="p-8">
                           <div className="flex items-center gap-3">
                              <Building2 size={14} className="text-zinc-800" />
                              <span className="text-[10px] font-black text-zinc-500 uppercase">{user.company}</span>
                           </div>
                        </td>
                        <td className="p-8">
                           <span className="text-[9px] font-black text-white uppercase tracking-widest px-3 py-1 bg-white/2 border border-white/5 rounded-full">{user.tier}</span>
                        </td>
                        <td className="p-8">
                           <div className="flex items-center gap-2 text-[#00e5ff]">
                              <button onClick={() => handleUpdateCredits(user.email)} className="flex items-center gap-2 hover:scale-105 transition-all">
                                 <CreditCard size={14} />
                                 <span className="text-[11px] font-black">{user.credits?.toLocaleString('en-US') || 0}m</span>
                              </button>
                           </div>
                        </td>
                        <td className="p-8">
                           <button 
                             onClick={() => handleUpdateStatus(user.email, user.status === 'Active' ? 'Banned' : 'Active')}
                             className={`flex items-center gap-2 transition-all hover:scale-105 ${user.status === 'Active' ? 'text-[#10b981]' : 'text-red-500'}`}
                           >
                              {user.status === 'Active' ? <CheckCircle2 size={14} /> : <Ban size={14} />}
                              <span className="text-[9px] font-black uppercase tracking-widest">{user.status}</span>
                           </button>
                        </td>
                        <td className="p-8 text-right">
                           <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleUpdateCredits(user.email)} className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-zinc-500 hover:text-[#00e5ff] transition-all" title="Inject Credits">
                                 <Plus size={16} />
                              </button>
                              <button onClick={() => handleUpdateRole(user.email)} className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-zinc-500 hover:text-[#a855f7] transition-all" title="Promote Role">
                                 <Shield size={16} />
                              </button>
                              <button onClick={() => handleUpdateStatus(user.email, user.status === 'Active' ? 'Banned' : 'Active')} className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-zinc-500 hover:text-red-500 transition-all" title="Ban User">
                                 <Ban size={16} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         ) : (
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-white/5">
                     <th className="p-8 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Organization</th>
                     <th className="p-8 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Owner</th>
                     <th className="p-8 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Seat Count</th>
                     <th className="p-8 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Shared Pool</th>
                     <th className="p-8 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Plan</th>
                     <th className="p-8 text-[9px] font-black text-zinc-600 uppercase tracking-widest text-right">Control</th>
                  </tr>
               </thead>
               <tbody>
                  {agencies.map(agency => (
                     <tr key={agency.id} className="border-b border-white/2 hover:bg-white/[0.01] transition-colors group">
                        <td className="p-8">
                           <div className="flex items-center gap-5">
                              <div className="w-12 h-12 bg-[#00e5ff11] border border-[#00e5ff22] rounded-xl flex items-center justify-center text-[#00e5ff]">
                                 <Building2 size={20} />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[11px] font-black text-white uppercase tracking-tight">{agency.name}</span>
                                 <span className="text-[8px] font-bold text-zinc-800 tracking-widest uppercase">TX-{agency.id.toUpperCase()}</span>
                              </div>
                           </div>
                        </td>
                        <td className="p-8">
                           <span className="text-[10px] font-black text-zinc-500 uppercase">{agency.owners[0]}</span>
                        </td>
                        <td className="p-8">
                           <span className="text-[11px] font-black text-white">{agency.members} / 50</span>
                        </td>
                        <td className="p-8">
                           <div className="flex items-center gap-2 text-[#f59e0b]">
                              <Zap size={14} />
                              <span className="text-[11px] font-black">{agency.credits.toLocaleString('en-US')}m</span>
                           </div>
                        </td>
                        <td className="p-8">
                           <span className="text-[9px] font-black text-black uppercase tracking-widest px-4 py-1 bg-[#00e5ff] rounded-full shadow-[0_0_15px_rgba(0,229,255,0.3)]">{agency.plan}</span>
                        </td>
                        <td className="p-8 text-right">
                           <div className="flex items-center justify-end gap-3">
                              <button 
                                onClick={() => handleInviteUser(agency.id)}
                                className="h-10 px-6 bg-white/2 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:border-[#00e5ff33] transition-all"
                              >
                                Manage
                              </button>
                              <button className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500 transition-all hover:text-white">
                                 <Ban size={16} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         )}
      </div>

      {/* QUICK ACTIONS FOOTER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-gradient-to-br from-[#a855f711] to-transparent border border-[#a855f722] rounded-[40px] p-8 flex flex-col gap-4 group cursor-pointer hover:border-[#a855f755] transition-all">
            <ShieldAlert size={24} className="text-[#a855f7]" />
            <h4 className="text-sm font-black text-white uppercase italic">Security Audit</h4>
            <p className="text-[9px] font-black text-zinc-700 uppercase leading-relaxed">Review login anomalies and suspicious account behavior across the node.</p>
         </div>
         <div className="bg-gradient-to-br from-[#10b98111] to-transparent border border-[#10b98122] rounded-[40px] p-8 flex flex-col gap-4 group cursor-pointer hover:border-[#10b98155] transition-all">
            <History size={24} className="text-[#10b981]" />
            <h4 className="text-sm font-black text-white uppercase italic">Access Logs</h4>
            <p className="text-[9px] font-black text-zinc-700 uppercase leading-relaxed">Immutable ledger of all administrative identity changes and provisioning.</p>
         </div>
         <div className="bg-gradient-to-br from-[#00e5ff11] to-transparent border border-[#00e5ff22] rounded-[40px] p-8 flex flex-col gap-4 group cursor-pointer hover:border-[#00e5ff55] transition-all">
            <Mail size={24} className="text-[#00e5ff]" />
            <h4 className="text-sm font-black text-white uppercase italic">Global Invite</h4>
            <p className="text-[9px] font-black text-zinc-700 uppercase leading-relaxed">Deploy bulk invitations for Enterprise white-glove onboarding sequences.</p>
         </div>
      </div>
    </div>
  );
}
