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
import { NeuralProgressBar } from "@/components/NeuralProgressBar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { user, setUser, fetchUserCredits } = useUserStore();

  React.useEffect(() => {
    if (session?.user?.email && !user) {
      // Sync NextAuth session to Neural Store
      setUser({
        email: session.user.email,
        name: session.user.name || "Neural User",
        credits: 0, // Will be fetched
        role: 'STANDARD'
      });
      fetchUserCredits(session.user.email);
    }
  }, [session, user, setUser, fetchUserCredits]);

  const navItems = [
    { name: 'DASHBOARD', icon: <LayoutDashboard size={18} />, href: '/dashboard' },
    { name: 'AI STUDIO', icon: <Zap size={18} />, href: '/ai-studio' },
    { name: 'HISTORY', icon: <History size={18} />, href: '/vault' },
    { name: 'FUEL', icon: <CreditCard size={18} />, href: '/dashboard/pricing' },
    { name: 'CORE', icon: <Shield size={18} />, href: '/admin_vxf' },
    { name: 'SETTINGS', icon: <Settings size={18} />, href: '/dashboard/settings' },
  ];

  return (
    <div className="flex h-screen w-full bg-[#000000] text-white font-sans overflow-hidden">
      <Toaster position="top-right" />
      <NeuralProgressBar />
      


      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#000000] relative h-screen overflow-hidden">
         <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-[#0A0A0B]/50 backdrop-blur-md">
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-blue-500 uppercase tracking-[4px]">System Active</span>
               <h2 className="text-[11px] font-black uppercase tracking-widest text-white">
                  / {pathname.split('/').pop()?.toUpperCase() || 'CORE'}
               </h2>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                   <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[2px]">Neural Balance</span>
                   <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">{(user?.credits || 0).toFixed(1)}</span>
                      <Zap size={14} className="text-blue-500 animate-pulse" />
                   </div>
                </div>
               <div className="w-px h-8 bg-white/5"></div>
               <button className="p-3 bg-white/5 border border-white/10 rounded-full text-zinc-500 hover:text-white transition-all">
                  <Shield size={18} />
               </button>
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
