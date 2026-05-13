"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signout } from "@/app/actions/auth";
import { 
  Zap, Monitor, Scissors, Mic, ShoppingBag, CreditCard, Settings, 
  Power, User, Bell, Video, Layers, Sparkles, Wand2, LogOut, Wallet,
  Activity, Cpu, Box, Search, Share2, Image as ImageIcon, Music, Film,
  Type, ChevronRight, Smartphone, Command, X, Shield, History, LayoutDashboard
} from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { useUserStore } from "@/store/useUserStore";
import { useSession } from "next-auth/react";
import { Toaster, toast } from "react-hot-toast";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";
import { useHardRefresh } from "@/hooks/useNeuralPolling";
import MobileConnectModal from "@/components/MobileConnectModal";
import GlobalBanner from "@/components/GlobalBanner";
import { API_BASE_URL } from "@/lib/apiConfig";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useHardRefresh();
  const { data: session, status } = useSession();
  const { creditBalance, engineStatus, triggerAutoSave } = useEditorStore();
  const pathname = usePathname();
  const router = useRouter();
  
  const [showMobileConnect, setShowMobileConnect] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // STABILITY: Auto-Save Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAutoSaving(true);
      triggerAutoSave();
      setTimeout(() => setIsAutoSaving(false), 2000);
    }, 30000);
    return () => clearInterval(interval);
  }, [triggerAutoSave]);

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#000000]">
        <Zap size={64} className="text-[#00e5ff] animate-pulse" />
      </div>
    );
  }

  const sections = [
    {
      title: "NEURAL SUITE",
      items: [
        { name: 'DASHBOARD', icon: <LayoutDashboard size={18} />, href: '/dashboard' },
        { name: 'AI STUDIO', icon: <Zap size={18} />, href: '/dashboard/ai-studio' },
        { name: 'HISTORY', icon: <History size={18} />, href: '/dashboard/history' },
        { name: 'FUEL', icon: <CreditCard size={18} />, href: '/dashboard/pricing' },
        { name: 'CORE', icon: <Shield size={18} />, href: '/dashboard/admin_vxf' },
      ]
    },
    {
      title: "TITAN-X BRIDGE",
      items: [
        { name: 'CONNECT MOBILE', icon: <Smartphone size={18} />, onClick: () => setShowMobileConnect(true) },
        { name: 'ASSET VAULT', icon: <Box size={18} />, href: '/dashboard/asset-vault' },
      ]
    }
  ];

  return (
    <div className="flex h-screen w-full bg-[#000000] text-white font-sans overflow-hidden">
      <Toaster position="top-right" />
      <GlobalBanner />
      
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-[300px] bg-[#0A0A0B] border-r border-white/5 flex-col shrink-0 z-50 h-screen overflow-hidden">
        <div className="p-10 pb-8">
           <Link href="/dashboard" className="flex flex-col no-underline text-white group">
              <div className="flex items-center gap-3">
                 <Zap size={36} className="text-[#00e5ff] drop-shadow-[0_0_10px_#00e5ff]" />
                 <span className="text-3xl font-black tracking-tighter uppercase leading-none">TITANX</span>
              </div>
           </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-2 no-scrollbar">
          <div className="flex flex-col gap-10">
            {sections.map((section, idx) => (
              <div key={idx} className="flex flex-col gap-3">
                <h3 className="px-5 text-[9px] font-black uppercase tracking-[3px] text-zinc-500">
                  {section.title}
                </h3>
                <div className="flex flex-col gap-1.5">
                  {section.items.map((item) => (
                    <div
                      key={item.name}
                      onClick={() => item.onClick ? item.onClick() : router.push(item.href!)}
                      className={`w-full h-12 px-6 rounded-2xl flex items-center gap-4 transition-all cursor-pointer ${
                         pathname === item.href 
                         ? "bg-white/10 text-white border border-white/20 shadow-xl" 
                         : "text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      {item.icon}
                      <span className="text-[10px] font-black uppercase tracking-[2px]">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        <div className="p-8 border-t border-white/5 bg-[#0A0A0B]">
           <div className="bg-[#050505] border border-white/5 rounded-[32px] p-6 flex items-center justify-between mb-8 group min-w-[240px]">
              <div className="flex flex-col gap-1 overflow-hidden">
                 <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[2px]">BALANCE</p>
                 <span className="text-2xl font-black text-white leading-none">
                    {creditBalance?.toFixed(1) || "0.0"}
                 </span>
              </div>
              <div className="w-10 h-10 bg-[#10b98122] rounded-2xl flex items-center justify-center text-[#10b981]"><Wallet size={20} /></div>
           </div>
           
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 bg-white/5 rounded-full border border-white/10 flex items-center justify-center text-zinc-600"><User size={16} /></div>
                 <span className="text-[9px] font-black uppercase text-white">{session?.user?.name || 'AMAN'}</span>
              </div>
              <button onClick={() => signout()} className="p-2 text-zinc-500 hover:text-red-500 transition-colors"><Power size={18} /></button>
           </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#000000] relative h-screen overflow-hidden">
         <header className="h-20 md:h-24 flex items-center justify-between px-6 md:px-12 bg-transparent shrink-0 border-b border-white/5">
            <div className="flex flex-col">
               <div className="flex items-center gap-3 mb-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${engineStatus === 'Online' ? 'bg-[#00e5ff]' : 'bg-red-500'} animate-pulse shadow-[0_0_10px_#00e5ff]`}></div>
                  <span className="text-[8px] md:text-[9px] font-black text-zinc-700 uppercase tracking-[6px]">Neural Orchestration</span>
               </div>
               <h2 className="text-[10px] md:text-[11px] font-black uppercase tracking-[8px] text-white">
                  TITAN-X / <span className="text-[#00e5ff]">{pathname.split('/').pop()?.toUpperCase() || 'DASHBOARD'}</span>
               </h2>
            </div>

            <div className="flex items-center gap-4">
               <div className="flex items-center gap-3 px-4 py-2 bg-white/2 border border-white/5 rounded-full">
                  <div className={`w-1 h-1 rounded-full ${isAutoSaving ? 'bg-[#00e5ff] animate-ping' : 'bg-[#10b981]'}`}></div>
                  <span className="text-[7px] font-black uppercase tracking-widest text-zinc-400">
                     {isAutoSaving ? 'Neural Syncing...' : 'Project Secured'}
                  </span>
               </div>
               <button onClick={() => setShowMobileConnect(true)} className="p-3 bg-white/5 border border-white/10 rounded-full text-zinc-700 hover:text-white transition-all">
                  <Smartphone size={18} />
               </button>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-10">
            <GlobalErrorBoundary>{children}</GlobalErrorBoundary>
         </div>
      </main>

      <MobileConnectModal 
        isOpen={showMobileConnect}
        onClose={() => setShowMobileConnect(false)}
        sessionId="alpha-sync-99"
      />
    </div>
  );
}
