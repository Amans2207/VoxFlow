"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Eye, ExternalLink, ShieldAlert, Clock, IndianRupee } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function AdminPayments() {
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/admin/payments/pending');
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      showToast("Failed to fetch tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: string, action: 'approve' | 'reject', credits: number) => {
    showToast(`Neural ${action} in progress...`, "info");
    try {
      const res = await fetch('http://127.0.0.1:8000/api/admin/payments/resolve', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction_id: id, action, credits })
      });
      const data = await res.json();
      if (data.status === 'success') {
        showToast(`Transaction ${action}ed successfully`, "success");
        setTransactions(transactions.filter(t => t.id !== id));
      }
    } catch (err) {
      showToast("Resolution failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] p-10 text-white font-sans">
      <header className="mb-12 flex justify-between items-end">
         <div>
            <div className="flex items-center gap-2 mb-4">
               <ShieldAlert className="text-[#CCFF00]" size={18} />
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Admin Control Layer</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter">PAYMENT <span className="text-[#CCFF00]">VERIFICATION</span>.</h1>
         </div>
         <div className="text-right">
            <span className="text-zinc-500 text-[10px] font-black uppercase">Pending Queue</span>
            <div className="text-2xl font-black text-white">{transactions.length}</div>
         </div>
      </header>

      <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="border-b border-white/5 bg-white/5">
                  <th className="p-6 text-[10px] font-black text-zinc-500 uppercase">User ID</th>
                  <th className="p-6 text-[10px] font-black text-zinc-500 uppercase">UTR Number</th>
                  <th className="p-6 text-[10px] font-black text-zinc-500 uppercase">Amount</th>
                  <th className="p-6 text-[10px] font-black text-zinc-500 uppercase">Screenshot</th>
                  <th className="p-6 text-[10px] font-black text-zinc-500 uppercase text-right">Actions</th>
               </tr>
            </thead>
            <tbody>
               {transactions.map((t) => (
                 <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-6 text-xs font-bold text-zinc-400 font-mono">{t.user_id.slice(0, 8)}...</td>
                    <td className="p-6 text-sm font-black text-white">{t.utr_number}</td>
                    <td className="p-6">
                       <div className="flex items-center gap-1 text-[#CCFF00] font-black">
                          <IndianRupee size={12} /> {t.amount}
                       </div>
                    </td>
                    <td className="p-6">
                       <button 
                         onClick={() => setSelectedImage(t.screenshot_url)}
                         className="flex items-center gap-2 text-[10px] font-black text-zinc-500 hover:text-white transition-colors"
                       >
                          <Eye size={14} /> VIEW PROOF
                       </button>
                    </td>
                    <td className="p-6 text-right">
                       <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => handleResolve(t.id, 'reject', 0)}
                            className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                          >
                             <X size={16} />
                          </button>
                          <button 
                            onClick={() => handleResolve(t.id, 'approve', t.credits_requested)}
                            className="p-3 bg-[#39FF141A] border border-[#39FF1433] text-[#39FF14] rounded-xl hover:bg-[#39FF14] hover:text-black transition-all"
                          >
                             <Check size={16} />
                          </button>
                       </div>
                    </td>
                 </tr>
               ))}
               {transactions.length === 0 && (
                 <tr>
                    <td colSpan={5} className="p-20 text-center text-zinc-600 font-black uppercase text-xs tracking-widest">
                       No pending verifications. Neural queue is empty.
                    </td>
                 </tr>
               )}
            </tbody>
         </table>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
         {selectedImage && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={() => setSelectedImage(null)}
             className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-10 cursor-zoom-out"
           >
              <motion.img 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                src={selectedImage}
                className="max-w-full max-h-full rounded-2xl shadow-2xl border border-white/10"
              />
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
