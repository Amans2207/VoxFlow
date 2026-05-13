"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Building2,
  Zap, Monitor, Users, CreditCard, Box, Bell, Shield, 
  Terminal, BarChart3, Globe, Settings, LogOut, Command,
  ChevronRight, Cpu, Activity, Sparkles, LayoutDashboard
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Quick Client-side Auth Check
  useEffect(() => {
    const auth = sessionStorage.getItem("vxf_admin_auth");
    if (auth !== "verified") {
      router.push("/admin_login");
    }
  }, [router]);

  const navItems = [
    { name: 'OVERWATCH', icon: <LayoutDashboard size={20} />, href: '/admin' },
    { name: 'FINANCE HUB', icon: <BarChart3 size={20} />, href: '/admin/finance' },
    { name: 'AGENCIES', icon: <Building2 size={20} />, href: '/admin/agencies' },
    { name: 'ASSET VAULT', icon: <Box size={20} />, href: '/admin/assets' },
    { name: 'BROADCAST', icon: <Bell size={20} />, href: '/admin/broadcast' },
    { name: 'TITAN-X QUEUE', icon: <Terminal size={20} />, href: '/admin/queue' },
    { name: 'PROMO CODES', icon: <Zap size={20} />, href: '/admin/promos' },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("vxf_admin_auth");
    document.cookie = "vxf_admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin_login");
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-white font-sans overflow-hidden selection:bg-[#00e5ff] selection:text-black relative">
      <Toaster position="top-right" />
      
      {/* HIGH-TECH GRID BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `linear-gradient(#00e5ff 1px, transparent 1px), linear-gradient(90deg, #00e5ff 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
      </div>
      
      {/* GLOWING SIDEBAR */}
      <aside className={`${isSidebarCollapsed ? 'w-24' : 'w-72'} bg-[#0a0a0b] border-r border-white/5 flex flex-col shrink-0 z-50 transition-all duration-500 ease-in-out relative group`}>
        {/* Glow Effect */}
        <div className="absolute right-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#00e5ff33] to-transparent"></div>
        
        <div className="p-8 flex items-center justify-between">
           <Link href="/admin" className="flex items-center gap-3 no-underline text-white group">
              <Shield size={32} className="text-[#00e5ff] drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]" />
              {!isSidebarCollapsed && (
                 <span className="text-2xl font-black tracking-tighter uppercase italic">GOD<span className="text-[#00e5ff]">MODE</span></span>
              )}
           </Link>
        </div>

        <nav className="flex-1 px-4 py-8 flex flex-col gap-2 overflow-y-auto no-scrollbar">
           {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 relative group ${
                  pathname === item.href
                    ? "bg-white/5 text-[#00e5ff] shadow-[inset_0_0_20px_rgba(0,229,255,0.05)]"
                    : "text-zinc-600 hover:text-white hover:bg-white/2"
                }`}
              >
                {pathname === item.href && (
                   <div className="absolute left-0 top-1/4 h-1/2 w-1 bg-[#00e5ff] rounded-r-full shadow-[0_0_10px_#00e5ff]"></div>
                )}
                <div className={`${pathname === item.href ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
                   {item.icon}
                </div>
                {!isSidebarCollapsed && (
                   <span className="text-[10px] font-black uppercase tracking-[2px] leading-none">{item.name}</span>
                )}
                {isSidebarCollapsed && (
                   <div className="absolute left-20 bg-[#00e5ff] text-black text-[10px] font-black px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100]">
                      {item.name}
                   </div>
                )}
              </Link>
           ))}
        </nav>

        <div className="p-8 border-t border-white/5 flex flex-col gap-4">
           {!isSidebarCollapsed && (
              <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                 <div className="w-10 h-10 bg-[#00e5ff11] rounded-xl flex items-center justify-center text-[#00e5ff] animate-pulse">
                    <Activity size={18} />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">System Status</span>
                    <span className="text-[10px] font-black text-[#10b981] uppercase">Optimal</span>
                 </div>
              </div>
           )}
           <button 
             onClick={handleLogout}
             className="flex items-center gap-4 px-5 py-4 rounded-2xl text-zinc-600 hover:text-red-500 hover:bg-red-500/5 transition-all group"
           >
              <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
              {!isSidebarCollapsed && <span className="text-[10px] font-black uppercase tracking-[2px]">TERMINATE SESSION</span>}
           </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col min-w-0 relative h-screen overflow-hidden">
         {/* HEADER */}
         <header className="h-24 flex items-center justify-between px-12 bg-transparent shrink-0 border-b border-white/5">
            <div className="flex items-center gap-6">
               <button 
                 onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                 className="p-3 bg-white/2 border border-white/5 rounded-xl text-zinc-500 hover:text-white transition-all"
               >
                  <Command size={18} />
               </button>
               <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse shadow-[0_0_10px_#00e5ff]"></div>
                     <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[6px]">Architect Console</span>
                  </div>
                  <h2 className="text-[11px] font-black uppercase tracking-[8px] text-white">
                     SYSTEM / <span className="text-[#00e5ff]">{pathname.split('/').pop()?.toUpperCase() || 'OVERWATCH'}</span>
                  </h2>
               </div>
            </div>

            <div className="flex items-center gap-8">
               <div className="flex items-center gap-10 border-r border-white/5 pr-10">
                  <div className="flex flex-col items-end">
                     <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Global Load</span>
                     <span className="text-[12px] font-black text-[#00e5ff]">12.4%</span>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Active Nodes</span>
                     <span className="text-[12px] font-black text-white">42 / 64</span>
                  </div>
               </div>
               
               <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end mr-2">
                     <span className="text-[10px] font-black text-white uppercase italic">Aman <span className="text-[#00e5ff]">Studio</span></span>
                     <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-tighter">Root Administrator</span>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00e5ff22] to-transparent rounded-2xl border border-[#00e5ff33] flex items-center justify-center text-[#00e5ff]">
                     <Cpu size={24} />
                  </div>
               </div>
            </div>
         </header>

         {/* CONTENT SCROLL AREA */}
         <div className="flex-1 overflow-y-auto no-scrollbar p-12">
            <div className="max-w-[1600px] mx-auto">
               {children}
            </div>
         </div>

         {/* BACKGROUND DECORATIONS */}
         <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-[#00e5ff05] blur-[150px] -z-10 pointer-events-none"></div>
         <div className="fixed bottom-0 left-0 w-1/4 h-1/4 bg-[#00e5ff03] blur-[120px] -z-10 pointer-events-none"></div>
      </main>
    </div>
  );
}
