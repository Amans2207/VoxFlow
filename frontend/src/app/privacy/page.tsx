"use client";

import React from 'react';
import Link from 'next/link';
import { Shield, ChevronLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans p-8 md:p-24 selection:bg-[#00e5ff] selection:text-black">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-[#00e5ff] font-black uppercase text-[10px] tracking-[4px] mb-12 hover:gap-4 transition-all">
          <ChevronLeft size={16} /> Neural Return
        </Link>
        
        <header className="mb-16">
          <div className="w-16 h-16 bg-[#00e5ff1a] rounded-2xl flex items-center justify-center text-[#00e5ff] mb-8">
            <Shield size={32} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4">Privacy <span className="text-[#00e5ff]">Protocol</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Last Synchronized: May 13, 2026</p>
        </header>

        <section className="space-y-12 text-sm leading-relaxed">
          <div>
            <h2 className="text-white font-black uppercase tracking-widest mb-4">1. Data Ingestion</h2>
            <p>VoxFlow ("The Neural Engine") processes media assets provided by the user for the sole purpose of AI-driven synthesis, dubbing, and video generation. All uploaded assets are stored in encrypted neural vaults.</p>
          </div>

          <div>
            <h2 className="text-white font-black uppercase tracking-widest mb-4">2. Facial & Voice Biometrics</h2>
            <p>Our AI models analyze facial geometry and voice frequencies to synchronize speech and lip movements. This biometric data is processed ephemerally and is never sold to third-party data brokers. It is used exclusively to facilitate the user's creative requests.</p>
          </div>

          <div>
            <h2 className="text-white font-black uppercase tracking-widest mb-4">3. Storage & Retention</h2>
            <p>Generated assets are retained on our cloud infrastructure for a period determined by the user's plan. Users maintain full ownership of their intellectual property produced via the Titan-X pipeline.</p>
          </div>

          <div>
            <h2 className="text-white font-black uppercase tracking-widest mb-4">4. Security Infrastructure</h2>
            <p>We implement bank-grade encryption (AES-256) for all data at rest and TLS 1.3 for data in transit. Your neural signature is protected by the most advanced security protocols available.</p>
          </div>

          <footer className="pt-24 border-t border-white/5">
            <p className="text-zinc-600">For legal inquiries regarding the Neural Protocol, contact <a href="mailto:legal@voxflow.ai" className="text-[#00e5ff]">legal@voxflow.ai</a></p>
          </footer>
        </section>
      </div>
    </div>
  );
}
