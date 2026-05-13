"use client";

import React from 'react';
import Link from 'next/link';
import { FileText, ChevronLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans p-8 md:p-24 selection:bg-[#a855f7] selection:text-black">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-[#a855f7] font-black uppercase text-[10px] tracking-[4px] mb-12 hover:gap-4 transition-all">
          <ChevronLeft size={16} /> Neural Return
        </Link>
        
        <header className="mb-16">
          <div className="w-16 h-16 bg-[#a855f71a] rounded-2xl flex items-center justify-center text-[#a855f7] mb-8">
            <FileText size={32} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4">Service <span className="text-[#a855f7]">Mandate</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Last Synchronized: May 13, 2026</p>
        </header>

        <section className="space-y-12 text-sm leading-relaxed">
          <div>
            <h2 className="text-white font-black uppercase tracking-widest mb-4">1. License of Use</h2>
            <p>By accessing the Titan-X Neural Engine, you are granted a non-exclusive, non-transferable license to use our AI tools for content creation. Misuse of the engine for generating deepfakes without consent or harmful misinformation will result in immediate termination of access.</p>
          </div>

          <div>
            <h2 className="text-white font-black uppercase tracking-widest mb-4">2. Neural Credits</h2>
            <p>Credits are consumed upon the successful initiation of a neural task. Credits are non-refundable once consumed. Subscriptions recur monthly unless canceled 24 hours prior to the renewal date.</p>
          </div>

          <div>
            <h2 className="text-white font-black uppercase tracking-widest mb-4">3. Ethical Compliance</h2>
            <p>Users must comply with all local and international laws regarding AI-generated content. You must disclose when content has been synthesized by AI where required by law.</p>
          </div>

          <div>
            <h2 className="text-white font-black uppercase tracking-widest mb-4">4. Liability Limitation</h2>
            <p>Aman Studio and VoxFlow are not liable for any creative failures, server downtimes, or loss of credits due to user error. We provide the engine "as is" with the highest standard of neural availability.</p>
          </div>

          <footer className="pt-24 border-t border-white/5">
            <p className="text-zinc-600">By using VoxFlow, you agree to these terms in their entirety. For disputes, contact <a href="mailto:support@voxflow.ai" className="text-[#a855f7]">support@voxflow.ai</a></p>
          </footer>
        </section>
      </div>
    </div>
  );
}
