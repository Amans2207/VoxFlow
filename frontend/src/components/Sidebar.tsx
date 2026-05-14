"use client";

import React, { useState, useEffect } from 'react';
import { 
  Database, Play, Globe, Link as LinkIcon, 
  Zap, HardDrive, Layers, RefreshCcw, 
  Upload, Cloud, Video, FileVideo, 
  Trash2, Sparkles, CheckCircle2, Loader2,
  Power, User, Activity, Video as YoutubeIcon,
  ShieldCheck, AlertCircle, Signal, TrendingUp,
  Flame, LayoutGrid, Smartphone, ChevronRight,
  ShieldAlert, Settings, Terminal
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

export default function NeuralCommandCenterSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUserStore();
  const { data: session } = useSession();
  const [isMobile, setIsMobile] = useState(false);
  
  const [moduleHealth, setModuleHealth] = useState({
    auth: 'online',
    factory: 'online',
    brain: 'online',
    scout: 'online',
    mobile: 'online',
    admin: 'online'
  });

  const menuItems = [
    { name: 'DASHBOARD', icon: <LayoutGrid size={20} />, href: '/dashboard', chamber: 'auth' },
    { name: 'AI STUDIO', icon: <Database size={20} />, href: '/ai-studio', chamber: 'factory' },
    { name: 'EDITOR PRO', icon: <Play size={20} />, href: '/editor', chamber: 'factory' },
    { name: 'MOBILE SYNC', icon: <Smartphone size={20} />, href: '/mobile/upload', chamber: 'mobile' },
    { name: 'ORCHESTRATOR', icon: <Zap size={20} />, href: '/orchestrator', chamber: 'scout' },
    { name: 'NEURAL VAULT', icon: <HardDrive size={20} />, href: '/vault', chamber: 'auth' },
    { name: 'ADMIN CORE', icon: <ShieldCheck size={20} />, href: '/admin', chamber: 'admin' },
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const checkPulse = async () => {
      try {
        const res: any = await api.get('/api/health');
        if (res.chambers) setModuleHealth(res.chambers);
      } catch (e) {
        setModuleHealth(prev => ({ ...prev, auth: 'offline' }));
      }
    };
    checkPulse();
    const interval = setInterval(checkPulse, 10000);
    return () => clearInterval(interval);
  }, []);

  if (pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname.includes('/mobile/upload')) return null;

  // 📱 MOBILE BOTTOM NAVIGATION
  if (isMobile) {
    return (
      <nav className="fixed bottom-6 left-6 right-6 h-20 bg-black/40 backdrop-blur-3xl border border-white/10 z-[100] rounded-[32px] px-8 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {menuItems.slice(0, 5).map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-all ${pathname === item.href ? 'text-blue-500 scale-110' : 'text-zinc-600'}`}
          >
            {item.icon}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <aside className="w-80 h-screen bg-[#050505] border-r border-white/5 p-8 flex flex-col justify-between shrink-0 sticky top-0 z-50">
      <div className="space-y-12">
        <div className="flex flex-col gap-1">
           <div className="flex items-center justify-between">
              <div className="font-black text-2xl text-white tracking-tighter uppercase italic group cursor-pointer" onClick={() => router.push('/dashboard')}>
                 VOX<span className="text-blue-500 group-hover:text-white transition-colors">FLOW</span>
              </div>
              <div className="px-2 py-0.5 bg-blue-500/10 rounded text-[7px] font-black text-blue-500 uppercase tracking-widest italic tracking-[3px]">PRO MASTER</div>
           </div>
           <div className="flex items-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[4px]">System Heartbeat: Stable</span>
           </div>
        </div>
        
        <nav className="space-y-1">
          <label className="text-[9px] font-black text-zinc-700 uppercase tracking-[5px] mb-6 block px-4 italic">Command Modules</label>
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`flex items-center justify-between group px-5 h-14 rounded-2xl transition-all relative ${
                pathname === item.href || pathname.startsWith(item.href + '/')
                ? "bg-white/5 text-white border border-white/10" 
                : "text-zinc-500 hover:text-zinc-200 hover:bg-white/2"
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`${pathname === item.href ? 'text-blue-500 scale-110' : 'text-zinc-700 group-hover:text-zinc-400'} transition-all duration-300`}>
                   {item.icon}
                </div>
                <span className="text-[10px] font-black tracking-[3px] uppercase italic">{item.name}</span>
              </div>
              <div className={`w-1.5 h-1.5 rounded-full ${moduleHealth[item.chamber as keyof typeof moduleHealth] === 'online' || moduleHealth[item.chamber as keyof typeof moduleHealth] === 'stable' ? 'bg-[#10b981]' : 'bg-red-500'} shadow-[0_0_8px_currentColor] animate-pulse`} />
            </Link>
          ))}
        </nav>
      </div>

      <div className="space-y-10">
        <div className="bg-[#0A0A0B] p-6 rounded-[32px] border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-[9px] text-zinc-600 font-black tracking-widest uppercase italic">Neural Vault</span>
            <Database size={12} className="text-blue-500" />
          </div>
          <div className="text-3xl font-black text-white relative z-10 flex items-end gap-1 tracking-tighter">
            {(user?.credits || 0).toFixed(0)} 
            <span className="text-blue-500 text-[10px] mb-1 font-bold tracking-tighter italic">CR</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-zinc-500 border border-white/5 transition-all">
                <User size={20} />
              </div>
              <div className="flex flex-col">
                 <span className="text-[11px] font-black text-white uppercase truncate max-w-[100px]">{session?.user?.name || "Neural Operator"}</span>
                 <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-[2px] italic tracking-tight">Active Session</span>
              </div>
            </div>
            <button onClick={() => signOut()} className="p-3 bg-white/5 rounded-xl text-zinc-700 hover:text-white hover:bg-red-500 transition-all duration-300">
              <Power size={18} />
            </button>
        </div>
      </div>
    </aside>
  );
}
