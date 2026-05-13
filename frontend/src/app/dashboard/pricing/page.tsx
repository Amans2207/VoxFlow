"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Shield, Globe, Rocket, 
  Check, CreditCard, Sparkles, Star
} from 'lucide-react';
import { soundEngine } from '@/utils/SoundEngine';
import { useToast } from '@/components/Toast';

const PLANS = [
  {
    name: "Standard",
    price: "$29",
    credits: "500",
    description: "Perfect for social media creators.",
    features: ["500 Neural Credits", "720p Video Exports", "Standard Voice Library", "Community Support"],
    color: "#3b82f6",
    highlight: false
  },
  {
    name: "Pro",
    price: "$79",
    credits: "2000",
    description: "Our most popular engine for agencies.",
    features: ["2000 Neural Credits", "4K Ultra-HD Exports", "Premium Voice Cloning", "Priority Render Queue"],
    color: "#a855f7",
    highlight: true
  },
  {
    name: "Enterprise",
    price: "$199",
    credits: "5000",
    description: "Scale your content production to the moon.",
    features: ["5000 Neural Credits", "API Access", "Dedicated Neural Node", "24/7 VIP Concierge"],
    color: "#CCFF00",
    highlight: false
  }
];

export default function PricingPage() {
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = (plan: string) => {
    setIsProcessing(true);
    soundEngine?.play("processing");
    setTimeout(() => {
        showToast(`Checkout for ${plan} plan initialized. Redirecting to Payment Gateway...`, "info");
        setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-16 pb-24">
       <header className="text-center flex flex-col items-center gap-6">
          <div className="px-6 py-2 bg-[#CCFF001a] border border-[#CCFF0033] rounded-full">
             <span className="text-[10px] font-black text-[#CCFF00] uppercase tracking-[5px]">Neural Monetization</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase m-0 leading-none">
             Fuel Your <span className="text-[#a855f7]">Creativity</span>
          </h1>
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest max-w-xl leading-relaxed">
             Unlock the full potential of the Titan-X Neural Engine. Choose a plan that fuels your content empire.
          </p>
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 lg:px-0">
          {PLANS.map((plan) => (
             <motion.div 
               key={plan.name}
               whileHover={{ y: -10 }}
               className={`p-10 rounded-[56px] border flex flex-col gap-10 relative overflow-hidden transition-all ${
                 plan.highlight ? 'bg-[#0A0A0B] border-[#a855f733] shadow-[0_0_50px_rgba(168,85,247,0.1)]' : 'bg-white/2 border-white/5'
               }`}
             >
                {plan.highlight && (
                   <div className="absolute top-8 right-8 px-4 py-1 bg-[#a855f7] rounded-full">
                      <span className="text-[8px] font-black text-white uppercase tracking-widest">Popular</span>
                   </div>
                )}

                <div className="flex flex-col gap-2">
                   <h3 className="text-xl font-black text-white uppercase tracking-tight">{plan.name}</h3>
                   <div className="flex items-end gap-2">
                      <span className="text-5xl font-black text-white tracking-tighter">{plan.price}</span>
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pb-3">/ Lifetime</span>
                   </div>
                </div>

                <div className="flex flex-col gap-6">
                   <div className="flex items-center gap-4 p-5 bg-white/3 rounded-3xl border border-white/5">
                      <Zap size={24} className="text-[#CCFF00]" />
                      <div className="flex flex-col">
                         <span className="text-lg font-black text-white leading-none">{plan.credits}</span>
                         <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-1">Neural Credits</span>
                      </div>
                   </div>

                   <ul className="flex flex-col gap-4 list-none p-0 m-0">
                      {plan.features.map(feat => (
                         <li key={feat} className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-[#10b9811a] rounded-full flex items-center justify-center text-[#10b981]">
                               <Check size={12} strokeWidth={4} />
                            </div>
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">{feat}</span>
                         </li>
                      ))}
                   </ul>
                </div>

                <button 
                  onClick={() => handlePurchase(plan.name)}
                  disabled={isProcessing}
                  className={`h-16 w-full rounded-2xl font-black text-[10px] uppercase tracking-[4px] transition-all flex items-center justify-center gap-4 ${
                    plan.highlight ? 'bg-white text-black hover:scale-[1.02]' : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                   {plan.highlight ? <Rocket size={18} /> : <Zap size={18} />}
                   Secure Credits
                </button>
             </motion.div>
          ))}
       </div>

       <div className="p-12 bg-[#050505] border border-white/5 rounded-[56px] flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-8">
             <div className="w-20 h-20 bg-white/2 rounded-[32px] flex items-center justify-center text-[#CCFF00]">
                <Shield size={36} />
             </div>
             <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Enterprise Power</h3>
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed max-w-md">
                   Need a custom solution for your creative agency? Contact our neural architects for a bespoke setup.
                </p>
             </div>
          </div>
          <button className="h-16 px-12 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[4px] text-white hover:bg-white/5 transition-all">
             Contact Architects
          </button>
       </div>
    </div>
  );
}
