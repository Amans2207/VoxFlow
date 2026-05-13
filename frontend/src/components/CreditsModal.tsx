"use client";

import React, { useState } from "react";
import { X, Zap, CreditCard, ShieldCheck, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { soundEngine } from "@/utils/SoundEngine";
import { toast } from "react-hot-toast";

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreditsModal({ isOpen, onClose }: CreditsModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    { id: 1, name: "Starter Fuel", credits: 100, price: 999, popular: false },
    { id: 2, name: "Creator Pack", credits: 500, price: 2499, popular: true },
    { id: 3, name: "Empire Bundle", credits: 2000, price: 7999, popular: false },
  ];

  const handlePurchase = () => {
    if (!selectedPlan) return;
    setIsProcessing(true);
    soundEngine?.play("processing");
    
    // Simulate Payment Gateway
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Transaction Initialized. Check your Neural Ledger.");
      soundEngine?.play("success");
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 lg:p-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-3xl"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-[#0A0A0B] border border-white/10 rounded-[48px] shadow-3xl overflow-hidden flex flex-col lg:flex-row"
          >
            {/* Left Panel: visual */}
            <div className="w-full lg:w-2/5 bg-[#00e5ff] p-12 flex flex-col justify-between overflow-hidden relative">
               <div className="absolute top-0 right-0 p-20 opacity-10">
                  <Zap size={300} />
               </div>
               <div className="relative z-10 flex flex-col gap-6">
                  <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center">
                     <CreditCard size={32} className="text-[#00e5ff]" />
                  </div>
                  <h2 className="text-4xl font-black text-black tracking-tighter leading-none uppercase">Neural <br /> Vault</h2>
                  <p className="text-sm font-bold text-black/60 uppercase tracking-widest leading-relaxed">
                     Refuel your creative engine to unlock high-fidelity AI generation.
                  </p>
               </div>
               <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-black/80">
                     <ShieldCheck size={18} />
                     <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encryption</span>
                  </div>
                  <div className="flex items-center gap-3 text-black/80">
                     <CheckCircle2 size={18} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Instant Activation</span>
                  </div>
               </div>
            </div>

            {/* Right Panel: plans */}
            <div className="flex-1 p-10 lg:p-16 flex flex-col gap-10">
               <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[4px]">Select Fuel Grade</h3>
                  <button onClick={onClose} className="text-zinc-500 hover:text-white transition-all"><X size={24} /></button>
               </div>

               <div className="flex flex-col gap-4">
                  {plans.map((plan) => (
                    <div 
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`p-6 rounded-3xl border transition-all cursor-pointer flex justify-between items-center group ${selectedPlan === plan.id ? 'bg-white/5 border-[#00e5ff]' : 'bg-white/2 border-white/5 hover:border-white/10'}`}
                    >
                       <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-3">
                             <span className="text-lg font-black text-white uppercase tracking-tighter">{plan.name}</span>
                             {plan.popular && (
                               <span className="px-2 py-0.5 bg-[#00e5ff] text-black text-[8px] font-black uppercase rounded-full">Best Value</span>
                             )}
                          </div>
                          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{plan.credits} Neural Credits</span>
                       </div>
                       <div className="flex flex-col items-end">
                          <span className="text-xl font-black text-white italic tracking-tighter">₹{plan.price}</span>
                          <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">One-time payment</span>
                       </div>
                    </div>
                  ))}
               </div>

               <button 
                  disabled={!selectedPlan || isProcessing}
                  onClick={handlePurchase}
                  className="h-20 bg-white text-black text-[12px] font-black uppercase rounded-2xl flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
               >
                  {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <ArrowRight size={24} />}
                  {isProcessing ? "Authenticating Neural Bridge..." : "Initialize Purchase"}
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
