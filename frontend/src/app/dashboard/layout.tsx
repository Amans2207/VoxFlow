"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, History, CreditCard, Shield, Settings,
  Zap, LogOut, User, Wallet, Power
} from "lucide-react";
import { GlobalErrorBoundary } from "@/components/GlobalErrorBoundary";
import { useUserStore } from "@/store/useUserStore";
import { useEditorStore } from "@/store/useEditorStore";
import { useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { creditBalance } = useEditorStore();

  const navItems = [
    { name: 'DASHBOARD', icon: <LayoutDashboard size={18} />, href: '/dashboard' },
    { name: 'AI STUDIO', icon: <Zap size={18} />, href: '/dashboard/ai-studio' },
    { name: 'HISTORY', icon: <History size={18} />, href: '/dashboard/history' },
    { name: 'FUEL', icon: <CreditCard size={18} />, href: '/dashboard/pricing' },
    { name: 'CORE', icon: <Shield size={18} />, href: '/dashboard/admin_vxf' },
    { name: 'SETTINGS', icon: <Settings size={18} />, href: '/dashboard/settings' },
  ];

  return (
    <div className="flex h-screen w-full bg-[#000000] text-white font-sans overflow-hidden">
      <Toaster position="top-right" />
      
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-[#0A0A0B] border-r border-white/5 flex-col shrink-0">
        <div className="p-8 pb-10">
          <Link href="/dashboard" className="text-xl font-black tracking-tighter text-blue-500 uppercase no-underline">
            VOXFLOW
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 h-12 rounded-xl transition-all ${
                pathname === item.href 
                ? "bg-white/10 text-white" 
                : "text-zinc-500 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-[#0A0A0B]">
          <div className="bg-[#050505] rounded-2xl p-4 flex items-center justify-between mb-6 border border-white/5">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-zinc-500 uppercase">Credits</span>
              <span className="text-lg font-black">{creditBalance?.toFixed(1) || "0.0"}</span>
            </div>
            <Wallet size={18} className="text-blue-500" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-zinc-500"><User size={14} /></div>
              <span className="text-[9px] font-bold truncate max-w-[80px] uppercase">{session?.user?.name || "User"}</span>
            </div>
            <button className="text-zinc-500 hover:text-red-500 transition-colors"><Power size={18} /></button>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#000000] relative h-screen overflow-hidden">
         <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-[#0A0A0B]/50 backdrop-blur-md">
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-blue-500 uppercase tracking-[4px]">System Active</span>
               <h2 className="text-[11px] font-black uppercase tracking-widest text-white">
                  / {pathname.split('/').pop()?.toUpperCase() || 'CORE'}
               </h2>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto p-8">
            <GlobalErrorBoundary>
               {children}
            </GlobalErrorBoundary>
         </div>
      </main>
    </div>
  );
}
