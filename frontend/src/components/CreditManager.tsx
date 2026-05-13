"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertCircle, CheckCircle2, Loader2, Plus } from 'lucide-react';
import { useCredits } from '@/context/CreditsContext';
import { useToast } from '@/components/Toast';
import { api } from '@/lib/api';

export default function CreditManager() {
    const { balance, refreshBalance } = useCredits();
    const { showToast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleDeductionTest = async () => {
        setIsProcessing(true);
        try {
            const res = await api.post('/api/user/credits/deduct', { 
                email: 'user_from_store', // Placeholder for actual user email
                amount: 5 
            });
            showToast("5 Credits Deducted Successfully", "success");
            refreshBalance();
        } catch (error: any) {
            showToast(error.message || "Deduction Failed", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-[#0A0A0B] border border-white/5 rounded-[32px] p-8 flex flex-col gap-8 shadow-2xl">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-[#404040] uppercase tracking-[4px]">Neural Bank</span>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Credit <span className="text-[#CCFF00]">Vault</span></h2>
                </div>
                <div className="w-12 h-12 bg-[#CCFF001a] border border-[#CCFF0033] rounded-2xl flex items-center justify-center text-[#CCFF00]">
                    <Zap size={24} fill="currentColor" />
                </div>
            </div>

            <div className="flex items-end gap-3">
                <span className="text-6xl font-black text-white tracking-tighter">{balance.toFixed(1)}</span>
                <span className="text-[10px] font-black text-[#404040] uppercase tracking-widest pb-3">Available Production Mins</span>
            </div>

            <div className="flex flex-col gap-4">
                <button 
                    onClick={handleDeductionTest}
                    disabled={isProcessing || balance < 5}
                    className={`h-16 w-full rounded-2xl font-black text-[10px] uppercase tracking-[4px] transition-all flex items-center justify-center gap-4 ${balance < 5 ? 'bg-red-500/10 text-red-500 cursor-not-allowed border border-red-500/20' : 'bg-white text-black hover:scale-[1.02] active:scale-95'}`}
                >
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Plus size={18} />}
                    {balance < 5 ? "Insufficient Balance (Min 5)" : "Test 5 Min Deduction"}
                </button>
                
                <div className="p-4 bg-white/2 border border-white/5 rounded-xl flex gap-3">
                    <AlertCircle className="text-zinc-600 shrink-0" size={16} />
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider leading-relaxed">
                        Credits are consumed based on neural processing time. 1 Credit = 1 Minute of Titan-X GPU time.
                    </p>
                </div>
            </div>
        </div>
    );
}
