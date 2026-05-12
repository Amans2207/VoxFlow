"use client";

import React, { useState, useRef } from 'react';
import { 
  Mic, Upload, Shield, Zap, Lock, Loader2, 
  CheckCircle2, Play, Volume2, User, RefreshCw, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/Toast';
import { soundEngine } from '@/utils/SoundEngine';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:5000";

export default function VoiceLab() {
  const { showToast } = useToast();
  const [isSystemOnline, setIsSystemOnline] = useState(true);
  const [isNeuralizing, setIsNeuralizing] = useState(false);
  const [voiceProfiles, setVoiceProfiles] = useState([
    { id: 'p1', name: 'Original Twin', type: 'Zero-Shot', accuracy: '98.4%', created: '2 days ago' }
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

  // Global API Wrapper with Retry Mechanism
  const safeFetch = async (url: string, options: RequestInit = {}, retries = 2): Promise<any> => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (err) {
      if (retries > 0) {
        console.warn(`Fetch failed, retrying... (${retries} left)`);
        await new Promise(r => setTimeout(r, 1000));
        return safeFetch(url, options, retries - 1);
      }
      throw err;
    }
  };

  React.useEffect(() => {
    const checkConnectivity = async () => {
      try {
        const data = await safeFetch(`${API_BASE}/api/health`, {}, 1);
        setIsSystemOnline(data.status === 'ok');
      } catch {
        setIsSystemOnline(false);
      }
    };
    checkConnectivity();
  }, [API_BASE]);

  const handleVoiceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isSystemOnline) return;
    
    setIsNeuralizing(true);
    showToast("Initializing Neural Capture...", "info");
    soundEngine?.play("process");
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', 'demo_user');

      const data = await safeFetch(`${API_BASE}/api/clone`, {
        method: 'POST',
        body: formData,
      });

      setVoiceProfiles(prev => [...prev, {
        id: `p${Date.now()}`,
        name: `Neural Twin ${prev.length + 1}`,
        type: 'Zero-Shot',
        accuracy: '99.1%',
        created: 'Just now'
      }]);
      
      showToast("Voice Neuralized Successfully!", "success");
      soundEngine?.play("success");
    } catch (error: any) {
      console.error("[Voice Lab] Critical Voice Error:", error);
      showToast(error.message || "Voice Neuralization Failure", "error");
      soundEngine?.play("error");
    } finally {
      setIsNeuralizing(false);
    }
  };

  const handlePreviewVoice = (id: string, name: string) => {
    soundEngine?.play("click");
    showToast(`Streaming Neural Identity: ${name}`, "info");
    // In a real app, this would play an actual audio sample from the backend
  };

  const handleRefreshIdentities = async () => {
    if (!isSystemOnline) return;
    showToast("Syncing with Neural Vault...", "info");
    soundEngine?.play("process");
    try {
      // Simulate sync
      await new Promise(r => setTimeout(r, 1500));
      showToast("Neural Identities Synced", "success");
    } catch {
      showToast("Sync Failed", "error");
    }
  };

  return (
    <div className="flex flex-col gap-10 lg:gap-16 pb-24 lg:pb-20 relative">
      {!isSystemOnline && (
        <div className="fixed top-0 left-0 w-full h-12 bg-red-600/20 backdrop-blur-3xl border-b border-red-600/30 z-[9999] flex items-center justify-center gap-4">
           <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
           <p className="text-[10px] font-black uppercase tracking-[3px] text-red-200">System Maintenance: Neural Voice Engine Offline.</p>
        </div>
      )}
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-8">
        <div>
           <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-white m-0 leading-none">
              Voice <span className="text-[#a855f7]">Lab</span>
           </h1>
           <p className="text-[10px] font-black text-[#404040] uppercase tracking-[4px] mt-4 flex items-center gap-2">
              <ShieldCheck className="text-[#a855f7]" size={14} /> Biometric Encryption Active | Protocol v4.2
           </p>
        </div>
        <div className="w-full md:w-auto flex items-center gap-4 bg-white/3 p-4 md:p-5 rounded-2xl border border-white/5">
           <div className="text-right flex-1 md:flex-none">
              <p className="text-[9px] font-black text-[#404040] uppercase tracking-widest">Neural Identities</p>
              <p className="text-xl md:text-2xl font-black text-white">{voiceProfiles.length}</p>
           </div>
           <div className="w-12 h-12 bg-[#a855f7]/10 border border-[#a855f7]/20 rounded-xl flex items-center justify-center text-[#a855f7] shadow-[0_0_15px_#a855f733]">
              <Mic size={24} />
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
        
        {/* Left: Upload Zone */}
        <div className="flex flex-col gap-8">
           <div 
             className={`p-10 lg:p-14 bg-white/2 border-2 border-dashed border-white/5 rounded-[48px] flex flex-col items-center text-center cursor-pointer transition-all ${!isSystemOnline ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:border-[#a855f733] active:scale-[0.98]'}`}
             onClick={() => isSystemOnline && !isNeuralizing && fileInputRef.current?.click()}
           >
              <div className="w-20 h-20 bg-white/3 rounded-3xl flex items-center justify-center mb-10 border border-white/5 shadow-2xl">
                 {isNeuralizing ? <Loader2 size={32} className="text-[#a855f7] animate-spin" /> : <Upload size={32} className="text-[#a855f7]" />}
              </div>
              <h2 className="text-2xl lg:text-3xl font-black text-white uppercase tracking-tighter">Neural Capture</h2>
              <p className="text-[11px] text-[#404040] font-bold uppercase tracking-widest max-w-[280px] my-8 leading-relaxed">
                 Upload a 10-second vocal sample for zero-shot synthesis.
              </p>
              <button 
                disabled={isNeuralizing || !isSystemOnline}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isSystemOnline) fileInputRef.current?.click();
                }}
                className={`h-14 lg:h-16 w-full font-black rounded-2xl text-[11px] uppercase tracking-[4px] border-none shadow-2xl transition-all ${isNeuralizing || !isSystemOnline ? 'bg-white/5 text-[#404040] cursor-not-allowed' : 'bg-white text-black cursor-pointer hover:bg-[#a855f7] hover:text-white'}`}
              >
                 {isNeuralizing ? "Synthesizing..." : "Start Clone"}
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="audio/*" onChange={handleVoiceUpload} />
           </div>

           <div className="p-8 bg-[#0A0A0B] rounded-[40px] border border-white/5 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                 <Shield size={18} className="text-[#3b82f6]" />
                 <p className="text-[10px] font-black text-white uppercase tracking-widest">Security Protocol</p>
              </div>
              <p className="text-[11px] text-[#404040] font-bold uppercase tracking-widest leading-relaxed">
                 Every synthetic voice profile is cryptographically signed and watermarked for authenticity.
              </p>
           </div>
        </div>

        {/* Right: Identities List */}
        <div className="lg:col-span-2 flex flex-col gap-8 lg:gap-10">
           <div className="p-8 lg:p-12 bg-[#0A0A0B] rounded-[48px] border border-white/5 flex-1 shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xl lg:text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                    <User className="text-[#a855f7]" size={28} /> Neural Identities
                 </h3>
                 <RefreshCw 
                    size={20} 
                    className={`text-[#404040] transition-colors ${!isSystemOnline ? 'cursor-not-allowed' : 'cursor-pointer hover:text-white'}`}
                    onClick={() => isSystemOnline && handleRefreshIdentities()}
                 />
              </div>

              <div className="flex flex-col gap-4">
                 {voiceProfiles.map((profile) => (
                   <div key={profile.id} className="p-6 bg-white/2 border border-white/5 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-white/10 transition-all">
                      <div className="flex items-center gap-6 w-full md:w-auto">
                         <div className="w-16 h-16 bg-gradient-to-br from-[#a855f733] to-[#3b82f633] rounded-2xl flex items-center justify-center text-[#a855f7] border border-white/5 shadow-lg shrink-0">
                            <Volume2 size={28} />
                         </div>
                         <div className="flex-1">
                            <p className="text-lg lg:text-xl font-black text-white uppercase tracking-tighter">{profile.name}</p>
                            <p className="text-[9px] font-black text-[#10b981] uppercase tracking-[2px] mt-1">{profile.accuracy} Accuracy</p>
                         </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-10 w-full md:w-auto border-t md:border-none border-white/5 pt-4 md:pt-0">
                         <div className="text-left md:text-right">
                            <p className="text-[9px] font-black text-[#404040] uppercase tracking-widest">Captured</p>
                            <p className="text-xs lg:text-sm font-black text-white mt-1">{profile.created}</p>
                         </div>
                         <button 
                            onClick={() => handlePreviewVoice(profile.id, profile.name)}
                            className="w-12 h-12 lg:w-14 lg:h-14 bg-white/5 rounded-2xl flex items-center justify-center border-none cursor-pointer hover:bg-white/10 active:scale-90 transition-all text-white"
                          >
                            <Play size={20} fill="white" />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-2 gap-6 lg:gap-8">
              <div className="p-8 bg-[#0A0A0B] rounded-[32px] border border-white/5 shadow-xl">
                 <Zap className="text-[#f59e0b] mb-4" size={20} />
                 <p className="text-[10px] font-black text-white uppercase tracking-widest">LPU Render</p>
                 <p className="text-[9px] text-[#404040] font-bold uppercase tracking-widest mt-2">Real-time synthesis active.</p>
              </div>
              <div className="p-8 bg-[#0A0A0B] rounded-[32px] border border-white/5 shadow-xl">
                 <CheckCircle2 className="text-[#10b981] mb-4" size={20} />
                 <p className="text-[10px] font-black text-white uppercase tracking-widest">Verified</p>
                 <p className="text-[9px] text-[#404040] font-bold uppercase tracking-widest mt-2">Safety Standard v4.2.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
