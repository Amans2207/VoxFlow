"use client";

import React, { useState, useEffect } from 'react';
import { Bell, X, Zap, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    const supabase = createClient();
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(Math.max(0, unreadCount - 1));
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all relative group"
      >
        <Bell size={20} className="text-zinc-500 group-hover:text-[#00f2ff] transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff3030] text-white text-[8px] font-black flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(255,48,48,0.5)]">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute top-16 right-0 w-[400px] bg-[#0A0A0B]/90 backdrop-blur-[50px] border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] z-[2000] overflow-hidden"
          >
            <div className="p-8 border-bottom border-white/5 flex justify-between items-center">
               <div>
                  <h4 className="text-xl font-black text-white tracking-tighter uppercase leading-none">Neural Alerts</h4>
                  <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em] mt-1">Status: System Nominal</p>
               </div>
               <button onClick={() => setIsOpen(false)} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all"><X size={16} className="text-zinc-500" /></button>
            </div>

            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-20 px-10 text-center">
                   <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                      <Zap size={32} className="text-zinc-800" />
                   </div>
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">No neural drift detected. Your pipeline is synchronized.</p>
                </div>
              ) : (
                notifications.map((n, i) => (
                  <motion.div 
                    key={n.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => markAsRead(n.id)}
                    className={`p-8 border-b border-white/5 cursor-pointer transition-all hover:bg-white/[0.02] flex gap-6 ${n.is_read ? 'opacity-40' : 'opacity-100'}`}
                  >
                    <div className={`p-4 rounded-2xl border ${n.type === 'StyleUpdate' ? 'bg-[#00f2ff1A] border-[#00f2ff33] text-[#00f2ff]' : n.type === 'MarketplaceSale' ? 'bg-[#CCFF001A] border-[#CCFF0033] text-[#CCFF00]' : 'bg-[#39FF141A] border-[#39FF1433] text-[#39FF14]'}`}>
                       {n.type === 'StyleUpdate' ? <Zap size={18} /> : n.type === 'MarketplaceSale' ? <ShoppingCart size={18} /> : <CheckCircle2 size={18} />}
                    </div>
                    <div>
                       <div className="flex items-center gap-3 mb-1">
                          <p className="text-xs font-black text-white uppercase tracking-widest">{n.title}</p>
                          {!n.is_read && <div className="w-1.5 h-1.5 bg-[#00f2ff] rounded-full animate-pulse shadow-[0_0_8px_#00f2ff]" />}
                       </div>
                       <p className="text-[10px] font-medium text-zinc-500 leading-relaxed uppercase tracking-wider">{n.message}</p>
                       <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mt-3 block">Received 2m ago</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            <div className="p-8 bg-black/40 text-center">
               <button className="text-[9px] font-black text-[#00f2ff] uppercase tracking-[0.3em] hover:tracking-[0.5em] transition-all">Synchronize Global Feed</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
