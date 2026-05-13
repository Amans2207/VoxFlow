"use client";

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Zap, QrCode, Upload, CheckCircle2, 
  ShieldCheck, AlertCircle, Sparkles, 
  ArrowRight, Lock, Wallet, History, IndianRupee, Loader2
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import { soundEngine } from '@/utils/SoundEngine';
import { createClient } from '@/utils/supabase/client';

const AI_SERVICE_URL = "http://localhost:5001";

export default function BillingPage() {
  const { showToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [utr, setUtr] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: profile } = await supabase.from('profiles').select('credit_balance').eq('id', user.id).single();
        if (profile) setCurrentBalance(profile.credit_balance || 0);
      }
    };
    fetchUserData();
  }, []);

  const plans = [
    { id: 'lite', name: 'Lite', price: 499, credits: 100, color: '#3b82f6' },
    { id: 'pro', name: 'Creator Pro', price: 999, credits: 250, color: '#10b981' },
    { id: 'studio', name: 'Studio', price: 2499, credits: 700, color: '#a855f7' },
  ];

  const handleApplyPromo = async () => {
    if (!promoCode) {
      showToast("Bhai, code toh likho!", "error");
      return;
    }
    
    setIsApplyingPromo(true);
    soundEngine?.play("processing");
    
    try {
      const response = await fetch(`${AI_SERVICE_URL}/api/admin/promo/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode, email: userId }) // Using userId as email for now, will fix to email
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Promo Failed");
      
      showToast(`PROMO ACTIVATED: ${data.amount}m Credits Added!`, "success");
      soundEngine?.play("success");
      setPromoCode('');
      // Refresh balance
      const supabase = createClient();
      const { data: profile } = await supabase.from('profiles').select('credit_balance').eq('id', userId).single();
      if (profile) setCurrentBalance(profile.credit_balance || 0);
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleSync = async () => {
    if (!utr || utr.length < 10) {
      showToast("Please enter a valid 12-digit Transaction ID", "error");
      return;
    }
    if (!userId) {
      showToast("User Session Expired", "error");
      return;
    }

    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    console.log(`[Billing] Submitting Neural Payment Verification for UTR: ${utr}`);
    console.log(`[Billing] Target Service: ${AI_SERVICE_URL}/api/payments/submit`);
    
    setIsSyncing(true);
    soundEngine?.play("processing");
    
    try {
      const url = `${AI_SERVICE_URL}/api/payments/submit`;
      console.log('Bhai, request ja rahi hai to:', url);
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          utr_number: utr,
          screenshot_url: "pending_upload", // Placeholder for now
          amount: plan.price,
          credits_requested: plan.credits
        }),
      });

      if (!response.ok) throw new Error("Payment Submission Failed");

      const data = await response.json();
      console.log("[Billing] Submission Success:", data);
      
      showToast("Verification Request Sent Successfully!", "success");
      soundEngine?.play("success");
      setUtr('');
    } catch (error: any) {
      console.error("[Billing] Critical Submission Error:", error);
      alert(`SUBMISSION FAILED: ${error.message}`);
      showToast("Neural Link Interrupted", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 lg:gap-16 pb-24 lg:pb-20">
       
       {/* Header Pillar */}
       <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-8">
          <div>
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-white m-0 leading-none">
                Billing <span className="text-[#3b82f6]">Hub</span>
             </h1>
             <p className="text-[10px] font-black text-[#404040] uppercase tracking-[4px] mt-4 flex items-center gap-2">
                <CreditCard className="text-[#3b82f6]" size={14} /> Neural Financial Layer v4.2 PRO
             </p>
          </div>
          <div className="w-full md:w-auto flex items-center gap-6 bg-[#3b82f61a] p-6 rounded-2xl border border-[#3b82f633] shadow-2xl">
             <div className="text-right flex-1 md:flex-none">
                <p className="text-[9px] font-black text-[#3b82f6] uppercase tracking-widest mb-1">Current Balance</p>
                <p className="text-2xl font-black text-white uppercase tracking-tighter">{currentBalance.toFixed(1)} <span className="text-[10px] opacity-40">MINS</span></p>
             </div>
             <div className="w-12 h-12 bg-[#3b82f6] rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_#3b82f666]">
                <Wallet size={24} />
             </div>
          </div>
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Main Area: Plans Pillar */}
          <div className="lg:col-span-8 flex flex-col gap-10 lg:gap-12">
             
             {/* Plans Restored */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div 
                    key={plan.id}
                    onClick={() => { setSelectedPlan(plan.id); soundEngine?.play("click"); }}
                    className={`p-8 rounded-[40px] cursor-pointer transition-all border-2 relative overflow-hidden group ${selectedPlan === plan.id ? 'bg-white/5 border-current shadow-2xl scale-[1.02]' : 'bg-[#0A0A0B] border-white/5 opacity-40 hover:opacity-100 hover:border-white/20'}`}
                    style={{ color: plan.color }}
                  >
                     <div className="flex justify-between items-start mb-10">
                        <p className="text-[10px] font-black uppercase tracking-widest">{plan.name}</p>
                        {selectedPlan === plan.id && <CheckCircle2 size={20} />}
                     </div>
                     <h2 className="text-5xl font-black text-white mb-10 tracking-tighter leading-none group-hover:scale-110 transition-transform">₹{plan.price}</h2>
                     <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                        <Zap size={16} fill="currentColor" />
                        <span className="text-xs font-black uppercase tracking-tighter">{plan.credits} Production Mins</span>
                     </div>
                  </div>
                ))}
             </div>

             {/* UPI Merchant Pillar */}
             <div className="p-8 lg:p-12 bg-[#0A0A0B] rounded-[56px] border border-white/5 flex flex-col md:flex-row items-center gap-12 lg:gap-16 shadow-2xl">
                <div className="p-2 bg-white rounded-[44px] shadow-[0_0_60px_rgba(255,255,255,0.1)] overflow-hidden shrink-0 group hover:rotate-2 transition-transform">
                   <div className="w-52 h-52 lg:w-60 lg:h-60 bg-[#f0f0f0] rounded-[36px] flex items-center justify-center overflow-hidden">
                      <img src="/qr_code.jpg" className="w-full h-full object-cover" alt="Secure Merchant QR" />
                   </div>
                </div>
                <div className="flex flex-col gap-10 text-center md:text-left w-full">
                   <div>
                      <p className="text-[10px] font-black text-[#404040] uppercase tracking-widest mb-3">Verified Merchant</p>
                      <h3 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter">Aman Santosh Singh</h3>
                   </div>
                   <div className="w-full">
                      <p className="text-[10px] font-black text-[#404040] uppercase tracking-widest mb-3">Direct VPA</p>
                      <div className="w-full h-16 lg:h-20 flex items-center justify-center md:justify-start px-8 bg-white/2 rounded-3xl border border-white/5 text-[#3b82f6] text-lg lg:text-xl font-black tracking-[4px] shadow-inner select-all">
                         8766083129@ptyes
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Verification Pillar Restored */}
          <div className="lg:col-span-4 p-8 lg:p-10 bg-[#0A0A0B] rounded-[56px] border border-white/5 flex flex-col gap-10 shadow-2xl">
             <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                <ShieldCheck className="text-[#3b82f6]" size={28} /> Verification
             </h2>
             
             <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                   <label className="text-[10px] font-black text-[#404040] uppercase tracking-widest pl-2">Transaction ID (UTR)</label>
                   <input 
                     type="text" 
                     value={utr}
                     onChange={(e) => setUtr(e.target.value)}
                     placeholder="12-DIGIT HASH" 
                     className="h-16 lg:h-20 px-8 bg-white/2 border border-white/5 rounded-2xl text-white text-lg font-black tracking-[6px] outline-none focus:border-[#3b82f6]/50 transition-colors placeholder:text-white/5 uppercase"
                   />
                </div>

                <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black text-[#404040] uppercase tracking-widest pl-2">Upload Evidence</label>
                    <div 
                     onClick={() => document.getElementById('utr-upload')?.click()}
                     className="h-44 border-2 border-dashed border-white/5 rounded-[40px] text-center flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/2 transition-all group"
                    >
                       <div className="w-14 h-14 bg-white/3 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                          <Upload size={24} className="text-[#404040] group-hover:text-white" />
                       </div>
                       <p className="text-[10px] font-black text-[#404040] uppercase tracking-widest group-hover:text-white transition-colors">Select Screenshot</p>
                    </div>
                    <input id="utr-upload" type="file" className="hidden" accept="image/*" onChange={() => showToast("Screenshot Loaded", "success")} />
                 </div>

                <button 
                  disabled={isSyncing}
                  onClick={handleSync}
                  className={`h-16 lg:h-20 w-full font-black rounded-3xl text-[12px] uppercase tracking-[6px] border-none shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 ${isSyncing ? 'bg-white/5 text-[#404040] cursor-not-allowed' : 'bg-[#3b82f6] text-white cursor-pointer shadow-[0_20px_40px_rgba(59,130,246,0.3)] hover:translate-y-[-4px]'}`}
                >
                   {isSyncing ? (
                       <>
                           <Loader2 size={20} className="animate-spin" />
                           VERIFYING
                       </>
                   ) : (
                       <>
                          <Zap size={20} fill="currentColor" />
                          Initialize Sync
                       </>
                   )}
                </button>
             </div>

             {/* PROMO ENGINE PILLAR */}
             <div className="p-8 lg:p-10 bg-[#0A0A0B] border border-white/5 rounded-[40px] flex flex-col gap-6">
                <div className="flex items-center gap-3">
                   <Tag className="text-[#00e5ff]" size={20} />
                   <h3 className="text-[10px] font-black text-white uppercase tracking-[4px]">Neural Boost Voucher</h3>
                </div>
                <div className="flex gap-4">
                   <input 
                     type="text" 
                     value={promoCode}
                     onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                     placeholder="e.g. STARBOY" 
                     className="flex-1 h-14 px-6 bg-white/2 border border-white/5 rounded-2xl text-white text-[12px] font-black tracking-[4px] outline-none focus:border-[#00e5ff33] transition-colors placeholder:text-white/5"
                   />
                   <button 
                     onClick={handleApplyPromo}
                     disabled={isApplyingPromo}
                     className="h-14 px-10 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                   >
                      {isApplyingPromo ? "SYNCING..." : "APPLY"}
                   </button>
                </div>
             </div>

             <div className="p-6 bg-[#10b9810d] rounded-3xl border border-[#10b9811a] flex gap-5">
                <AlertCircle className="text-[#10b981] shrink-0" size={24} />
                <p className="text-[10px] font-bold text-[#404040] uppercase tracking-wider leading-relaxed">
                   Credits are applied instantly after neural verification. Multi-node security active.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}
