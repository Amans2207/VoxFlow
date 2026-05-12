"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from '@/utils/supabase/client';
import { signout } from "@/app/actions/auth";
import { 
  Zap, Monitor, Scissors, Mic, ShoppingBag, CreditCard, Settings, 
  Menu, X, Power, User, Bell, Shield
} from "lucide-react";
import { UploadProvider } from "@/context/UploadContext";
import { useCredits } from "@/context/CreditsContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { balance } = useCredits();
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Admin check logic stays here for now
    const checkAdmin = async () => {
       const supabase = createClient();
       const { data: { user } } = await supabase.auth.getUser();
       if (user?.email === 'admin@voxflow.ai') setIsAdmin(true);
    };
    checkAdmin();
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: <Monitor size={18} />, href: '/dashboard' },
    { name: 'AI Studio', icon: <Zap size={18} />, href: '/dashboard/ai-studio' },
    { name: 'Studio', icon: <Scissors size={18} />, href: '/dashboard/precision-studio' },
    { name: 'Voice Lab', icon: <Mic size={18} />, href: '/dashboard/voice-lab' },
    { name: 'Marketplace', icon: <ShoppingBag size={18} />, href: '/dashboard/marketplace' },
    { name: 'Billing', icon: <CreditCard size={18} />, href: '/dashboard/billing' },
  ];

  if (isAdmin) {
    menuItems.unshift({ name: 'Admin', icon: <Shield size={18} />, href: '/dashboard/admin_vxf' });
  }

  return (
    <div className="flex h-screen w-full bg-[#050505] text-white overflow-hidden font-sans">
      
      {/* Sidebar - Explicitly Visible on Large Screens */}
      <aside className="hidden lg:flex flex-col w-[280px] bg-[#050505] border-r border-white/5 shrink-0 z-50">
        <div className="p-8 pb-12">
           <Link href="/dashboard" className="flex items-center gap-4 no-underline text-white">
              <div className="w-12 h-12 bg-[#10b981] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                 <Zap size={28} color="#000" fill="#000" />
              </div>
              <div className="flex flex-col">
                 <span className="text-2xl font-black tracking-tighter leading-none">VOX<span className="text-[#10b981]">FLOW</span></span>
                 <span className="text-[10px] font-black text-[#525252] uppercase tracking-[4px]">AI Studio</span>
              </div>
           </Link>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto no-scrollbar">
           {menuItems.map((item) => {
             const isActive = pathname === item.href;
             return (
               <Link 
                 key={item.href}
                 href={item.href}
                 className={`flex items-center gap-4 px-6 h-12 rounded-full no-underline transition-all ${isActive ? 'bg-white text-black shadow-xl' : 'text-[#525252] hover:text-white/60'}`}
               >
                 <span className={isActive ? 'text-black' : 'text-[#404040]'}>{item.icon}</span>
                 <span className="text-[10px] font-black uppercase tracking-wider">{item.name}</span>
               </Link>
             );
           })}
        </nav>

        <div className="p-6 shrink-0 flex flex-col gap-4 mb-4">
           <div className="p-6 bg-[#0A0A0B] rounded-[32px] border border-white/5">
              <p className="text-[9px] font-black text-[#404040] uppercase tracking-[3px] mb-2">Neural Balance</p>
              <p className="text-2xl font-black text-white">{balance.toFixed(1)} <span className="text-[10px] text-[#262626]">mins</span></p>
           </div>
           
           <button onClick={() => signout()} className="flex items-center justify-center gap-3 h-12 rounded-full text-[10px] font-black text-[#404040] uppercase tracking-[3px] cursor-pointer hover:text-white transition-colors">
              <Power size={14} /> Terminate
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#050505] relative overflow-hidden">
        
        {/* Header */}
        <header className="h-20 shrink-0 flex items-center justify-between px-6 lg:px-10 border-b border-white/5 bg-[#050505]/95 backdrop-blur-3xl z-40">
           <div className="flex lg:hidden items-center gap-3">
              <div className="w-10 h-10 bg-[#10b981] rounded-lg flex items-center justify-center">
                 <Zap size={20} color="#000" fill="#000" />
              </div>
           </div>
           
           <div className="flex items-center gap-4 lg:gap-8 ml-auto">
              <Bell size={20} className="text-[#404040] hover:text-white transition-colors cursor-pointer" />
              <div className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 text-[#404040] hover:border-white/20 transition-all cursor-pointer">
                 <User size={20} />
              </div>
           </div>
        </header>

        {/* Content Section */}
        <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth p-6 lg:p-10">
           <div className="max-w-[1400px] mx-auto w-full">
              <UploadProvider>
                 {children}
              </UploadProvider>
           </div>
        </main>
      </div>
    </div>
  );
}
