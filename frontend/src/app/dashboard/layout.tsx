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
import { showAIRecommendationToast } from "@/utils/RecommendationEngine";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useHardRefresh();
  const { data: session, status } = useSession();
  const { creditBalance, engineStatus, setSelectedTool, triggerAutoSave } = useEditorStore();
  const pathname = usePathname();
  const router = useRouter();
  
  const [showAssetBrowser, setShowAssetBrowser] = useState(false);
  const [showMobileConnect, setShowMobileConnect] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // STABILITY PROTOCOL: 30s Auto-Save Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAutoSaving(true);
      triggerAutoSave();
      setTimeout(() => setIsAutoSaving(false), 2000);
    }, 30000);
    return () => clearInterval(interval);
  }, [triggerAutoSave]);

  // GLOBAL IDENTITY SYNC: Bridging NextAuth to Neural Stores
  useEffect(() => {
    // Identity Sync & Health Check
    if (session?.user?.email) {
      const userEmail = session.user.email;
      const userName = session.user.name || "Titan";
      
      // 1. Health Handshake
      fetch(`${API_BASE_URL}/api/health`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'online') {
            console.log("%c Neural Link: Online ⚡", "color: #00e5ff; font-weight: bold; font-size: 14px;");
          }
        })
        .catch(() => console.error("Neural Link: Offline ⚠️"));

      // 2. Sync User Store
      const userStore = useUserStore.getState();
      if (!userStore.user || userStore.user.email !== userEmail) {
        userStore.setUser({
          email: userEmail,
          name: userName,
          credits: creditBalance, // Use current store balance or fetch
          role: 'STANDARD'
        });
        // Trigger background sync
        userStore.fetchUserCredits(userEmail);
      }

      // 3. AI Recommendation Protocol (Hook User)
      const credits = creditBalance || 0;
      setTimeout(() => {
        showAIRecommendationToast({ 
          credits, 
          lastAction: pathname.includes('studio') ? 'upload_complete' : undefined 
        });
      }, 5000);
    }
  }, [session, creditBalance, pathname]);

  // Global Command (Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') setShowSearch(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        { name: 'DASHBOARD', icon: <Monitor size={18} />, href: '/dashboard' },
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
    },
    {
      title: "CREATIVE HUB",
      items: [
        { name: 'DIRECTOR', icon: <Wand2 size={18} />, href: '/dashboard/script-to-video' },
        { name: 'DESIGN LAB', icon: <ImageIcon size={18} />, href: '/dashboard/design-lab' },
      ]
    }
  ];

  return (
    <div className="flex h-screen w-full bg-[#000000] text-white font-sans overflow-hidden selection:bg-[#00e5ff] selection:text-black">
      <Toaster position="top-right" />
      <GlobalBanner />
      
      {/* GLOBAL SEARCH OVERLAY */}
      {showSearch && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-3xl flex items-center justify-center p-4 md:p-20 animate-in fade-in duration-300">
           <div className="w-full max-w-3xl bg-[#0A0A0B] border border-white/10 rounded-[48px] shadow-3xl overflow-hidden flex flex-col">
              <div className="p-8 border-b border-white/5 flex items-center gap-6">
                 <Command size={24} className="text-[#00e5ff]" />
                 <input 
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tools, assets, or effects... (e.g. 'Razor', 'Lofi Music')" 
                    className="flex-1 bg-transparent border-none text-xl font-bold outline-none placeholder:text-zinc-600 uppercase tracking-tighter"
                 />
                 <button onClick={() => setShowSearch(false)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
              </div>
              <div className="p-8 flex flex-col gap-4">
                 <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[5px]">Neural Suggestions</span>
                 <div className="flex flex-col gap-2">
                    {['Razor Tool (C)', 'Selection Tool (V)', 'AI Frame Expander', 'Neural Lipsync'].map(item => (
                       <div key={item} className="p-5 bg-white/2 hover:bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group cursor-pointer transition-all">
                          <span className="text-[11px] font-black uppercase text-zinc-400 group-hover:text-white transition-all">{item}</span>
                          <ChevronRight size={14} className="text-zinc-500 group-hover:text-[#00e5ff]" />
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}
      
      {/* SIDEBAR - Responsive Hide on Mobile */}
      <aside className="hidden lg:flex w-[300px] bg-[#0A0A0B] border-r border-white/5 flex-col shrink-0 z-50 h-screen overflow-hidden">
        <div className="p-10 pb-8">
           <Link href="/dashboard" className="flex flex-col no-underline text-white group">
              <div className="flex items-center gap-3">
                 <Zap size={36} className="text-[#00e5ff] drop-shadow-[0_0_10px_#00e5ff]" />
                 <span className="text-3xl font-black tracking-tighter leading-none uppercase">TITANX</span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-[5.5px] text-[#00e5ff] mt-2 ml-1">Universal ecosystem</span>
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
                      onClick={() => {
                        if (item.onClick) item.onClick();
                        else if (item.href) router.push(item.href);
                      }}
                      className={`w-full h-12 px-6 rounded-2xl flex items-center gap-4 transition-all group relative overflow-hidden ${
                         pathname === item.href 
                         ? item.name === 'DASHBOARD' ? "bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.1)]" :
                           item.name === 'AI STUDIO' ? "bg-[#a855f7]/10 border border-[#a855f7]/30 text-[#a855f7] shadow-[0_0_20px_rgba(168,85,247,0.1)]" :
                           item.name === 'PRECISION' ? "bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.1)]" :
                           item.name === 'HISTORY' ? "bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] shadow-[0_0_20px_rgba(204,255,0,0.1)]" :
                           item.name === 'ASSET VAULT' ? "bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b] shadow-[0_0_20px_rgba(245,158,11,0.1)]" :
                           item.name === 'DIRECTOR' ? "bg-[#ff2d55]/10 border border-[#ff2d55]/30 text-[#ff2d55] shadow-[0_0_20px_rgba(255,45,85,0.1)]" :
                           "bg-white/10 text-white border border-white/20"
                         : "text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <div className={`transition-transform group-hover:scale-110 ${
                         pathname === item.href ? "" : 
                         item.name === 'DASHBOARD' ? "text-[#00e5ff]" :
                         item.name === 'AI STUDIO' ? "text-[#a855f7]" :
                         item.name === 'PRECISION' ? "text-[#10b981]" :
                         item.name === 'HISTORY' ? "text-[#CCFF00]" :
                         item.name === 'ASSET VAULT' ? "text-[#f59e0b]" :
                         item.name === 'DIRECTOR' ? "text-[#ff2d55]" :
                         "text-white"
                      }`}>
                         {item.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[2px]">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        <div className="p-8 border-t border-white/5 bg-[#0A0A0B]">
           <div className="bg-[#050505] border border-white/5 rounded-[32px] p-6 flex items-center justify-between mb-8 group cursor-pointer hover:border-[#00e5ff33] transition-all min-w-[240px]">
              <div className="flex flex-col gap-1 overflow-hidden">
                 <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[2px]">BALANCE</p>
                 <span className="text-2xl font-black text-white leading-none truncate">
                    {typeof creditBalance === 'number' && !isNaN(creditBalance) ? creditBalance.toFixed(1) : "0.0"}
                 </span>
              </div>
              <div className="w-10 h-10 bg-[#10b98122] rounded-2xl flex items-center justify-center text-[#10b981] shrink-0"><Wallet size={20} /></div>
           </div>
           
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 bg-white/5 rounded-full border border-white/10 flex items-center justify-center text-zinc-600"><User size={16} /></div>
                 <div className="flex flex-col">
                    <div className="flex items-center gap-2">
  <span className="text-[9px] font-black uppercase tracking-wider text-white">{session?.user?.name || 'AMAN'}</span>
  {useUserStore.getState().isSuperUser() && (
    <span className="text-[7px] font-black bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-1.5 py-0.5 rounded uppercase tracking-tighter shadow-[0_0_5px_rgba(234,179,8,0.2)]">GOLD</span>
  )}
  {useUserStore.getState().isVip() && (
    <span className="text-[7px] font-black bg-zinc-400/10 text-zinc-400 border border-zinc-400/20 px-1.5 py-0.5 rounded uppercase tracking-tighter">SILVER</span>
  )}
</div>
                    <span className="text-[7px] font-bold text-[#10b981] uppercase tracking-tighter">
  {useUserStore.getState().isSuperUser() ? 'Infinite Access' : 'Enterprise Active'}
</span>
                 </div>
              </div>
              <button onClick={() => signout()} className="p-2 text-[#222] hover:text-red-500 transition-colors"><Power size={18} /></button>
           </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#000000] relative h-screen overflow-hidden">
         <header className="h-20 md:h-24 flex items-center justify-between px-6 md:px-12 bg-transparent shrink-0 border-b border-white/5">
            <div className="flex flex-col">
               <div className="flex items-center gap-3 mb-1">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_10px_#00e5ff] ${engineStatus === 'Online' ? 'bg-[#00e5ff]' : 'bg-red-500'}`}></div>
                  <span className="text-[8px] md:text-[9px] font-black text-zinc-700 uppercase tracking-[6px]">Neural Orchestration</span>
               </div>
               <h2 className="text-[10px] md:text-[11px] font-black uppercase tracking-[8px] text-white">
                  TITAN-X / <span className="text-[#00e5ff]">{pathname.split('/').pop()?.toUpperCase() || 'DASHBOARD'}</span>
               </h2>
            </div>

            <div className="flex items-center gap-4 md:gap-10">
               {/* PROJECT SAVED INDICATOR */}
               <div className="flex items-center gap-3 px-4 py-2 bg-white/2 border border-white/5 rounded-full">
                  <div className={`w-1 h-1 rounded-full ${isAutoSaving ? 'bg-[#00e5ff] animate-ping' : 'bg-[#10b981]'}`}></div>
                  <span className="text-[7px] font-black uppercase tracking-widest text-zinc-400">
                     {isAutoSaving ? 'Neural Syncing...' : 'Project Secured'}
                  </span>
               </div>

               <div 
                  onClick={() => setShowSearch(true)}
                  className="hidden md:flex items-center gap-4 px-6 py-3 bg-white/2 border border-white/10 rounded-full cursor-pointer hover:bg-white/5 transition-all group"
               >
                  <Command size={14} className="text-zinc-700 group-hover:text-[#00e5ff]" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Ctrl+K Search</span>
               </div>
               <button onClick={() => toast.success("Mobile Sync Active 📱")} className="p-3 bg-white/5 border border-white/10 rounded-xl md:rounded-full text-zinc-700 hover:text-white transition-all">
                  <Smartphone size={18} />
               </button>
               <div className="flex items-center gap-4 md:gap-8 border-l border-white/10 pl-4 md:pl-10">
                  <div className="w-10 h-10 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center cursor-pointer">
                     <User size={18} className="text-zinc-700" />
                  </div>
               </div>
            </div>
         </header>

         <MobileConnectModal 
            isOpen={showMobileConnect}
            onClose={() => setShowMobileConnect(false)}
            sessionId="alpha-sync-99"
         />


         {/* CONTENT VIEWPORT */}
          <div className="flex-1 overflow-y-auto no-scrollbar relative p-4 md:p-10 pb-40">
             <GlobalErrorBoundary>{children}</GlobalErrorBoundary>
          </div>

          {/* GLOBAL PROGRESS HUD (BOTTOM RIGHT) */}
          {Object.keys(useEditorStore.getState().uploadingAssets).length > 0 && (
             <div className="fixed bottom-10 right-10 z-[200] animate-in slide-in-from-right-10 duration-500">
                <div className="bg-[#0A0A0B] border border-[#00e5ff33] rounded-[32px] p-6 shadow-[0_0_50px_rgba(0,229,255,0.1)] flex flex-col gap-4 min-w-[320px] backdrop-blur-3xl">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 bg-[#00e5ff] rounded-full animate-pulse"></div>
                         <span className="text-[10px] font-black text-white uppercase tracking-widest">Titan-X Syncing</span>
                      </div>
                      <span className="text-[10px] font-black text-zinc-500 uppercase">
                         {Object.keys(useEditorStore.getState().uploadingAssets).length} Streams
                      </span>
                   </div>
                   
                   <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-end">
                         <span className="text-xl font-black text-white uppercase tracking-tighter italic">Alpha Mission</span>
                         <span className="text-[10px] font-black text-[#00e5ff]">
                            {Math.round(Object.values(useEditorStore.getState().uploadingAssets).reduce((a, b) => a + b, 0) / Object.keys(useEditorStore.getState().uploadingAssets).length)}%
                         </span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-[#00e5ff] transition-all duration-500" 
                           style={{ width: `${Object.values(useEditorStore.getState().uploadingAssets).reduce((a, b) => a + b, 0) / Object.keys(useEditorStore.getState().uploadingAssets).length}%` }}
                         ></div>
                      </div>
                      <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mt-1">
                         Orchestrating {Object.keys(useEditorStore.getState().uploadingAssets).length} Multi-Part Streams...
                      </p>
                   </div>
                </div>
             </div>
          )}
       </main>
    </div>
  );
}
