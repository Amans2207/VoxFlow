"use client";

import React, { useState } from 'react';
import { 
  Globe, Mic, Wand2, Play, Sparkles, 
  Languages, Volume2, Cpu, Zap, Loader2,
  ChevronRight, ArrowRight, Shield, Download,
  CheckCircle2, RefreshCcw, Search, Music,
  User, Star, Heart, Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

export default function NeuralDubbing() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLang, setSelectedLang] = useState('Hindi');
  const [selectedVoice, setSelectedVoice] = useState('Neural Starboy');
  const [videoUrl, setVideoUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const languages = [
    { name: 'Hindi', code: 'hi', flag: '🇮🇳' },
    { name: 'Spanish', code: 'es', flag: '🇪🇸' },
    { name: 'Arabic', code: 'ar', flag: '🇦🇪' },
    { name: 'French', code: 'fr', flag: '🇫🇷' },
    { name: 'German', code: 'de', flag: '🇩🇪' },
    { name: 'Japanese', code: 'ja', flag: '🇯🇵' },
    { name: 'Russian', code: 'ru', flag: '🇷🇺' },
    { name: 'Portuguese', code: 'pt', flag: '🇧🇷' },
    { name: 'Italian', code: 'it', flag: '🇮🇹' },
    { name: 'Korean', code: 'ko', flag: '🇰🇷' },
    { name: 'Chinese', code: 'zh', flag: '🇨🇳' },
    { name: 'Turkish', code: 'tr', flag: '🇹🇷' },
    { name: 'Vietnamese', code: 'vi', flag: '🇻🇳' },
    { name: 'Dutch', code: 'nl', flag: '🇳🇱' },
    { name: 'Polish', code: 'pl', flag: '🇵🇱' },
    { name: 'Swedish', code: 'sv', flag: '🇸🇪' },
    { name: 'Indonesian', code: 'id', flag: '🇮🇩' },
    { name: 'Thai', code: 'th', flag: '🇹🇭' },
  ];

  const neuralPersonas = [
    { name: 'Neural Starboy', desc: 'Moody, Deep, Cinematic', icon: <Star size={16} /> },
    { name: 'Podcast King', desc: 'Warm, Authoritative, Clear', icon: <Radio size={16} /> },
    { name: 'The Narrator', desc: 'Neutral, Steady, Narrative', icon: <User size={16} /> },
    { name: 'Cyber Whisper', desc: 'Synthetic, Smooth, Intimate', icon: <Mic size={16} /> },
    { name: 'Hyper Hype', desc: 'High-Energy, Fast, Dynamic', icon: <Zap size={16} /> },
    { name: 'Emotional Soul', desc: 'Vulnerable, Soft, Human', icon: <Heart size={16} /> },
  ];

  const filteredLangs = languages.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleStartDubbing = async () => {
    if (!videoUrl) {
      toast.error("Please provide a video source.");
      return;
    }

    setIsProcessing(true);
    toast.success(`Synthesizing ${selectedVoice} identity in ${selectedLang}...`);

    try {
      await api.post('/api/v1/dub-global', {
        video_url: videoUrl,
        target_lang: languages.find(l => l.name === selectedLang)?.code,
        persona: selectedVoice
      });
      
      await new Promise(r => setTimeout(r, 5000));
      toast.success("Global Dubbing Complete: Identity Fused.");
    } catch (e) {
      toast.error("Neural Bridge Failure.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black p-6 lg:p-12 gap-10 font-sans selection:bg-blue-500/30 overflow-x-hidden pb-32">
      
      {/* 🌏 HEADER */}
      <div className="flex flex-col gap-4">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[6px]">Omnipotent Sound Engine Active</span>
         </div>
         <h1 className="text-6xl lg:text-9xl font-black text-white tracking-tighter uppercase leading-[0.85] italic">NEURAL <span className="text-blue-500">VOICE.</span></h1>
         <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest leading-relaxed max-w-2xl">Access every language and every persona. Our Neural Engine reconstructs identity across a global spectrum of dialects and vocal frequencies.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
         
         {/* LEFT: COMPREHENSIVE SELECTION */}
         <div className="xl:col-span-8 space-y-10">
            
            {/* NEURAL PERSONAS (VOICES) */}
            <div className="bg-[#0A0A0B] border border-white/5 p-8 rounded-[48px] space-y-8">
               <div className="flex justify-between items-center px-2">
                  <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[4px]">Neural Persona Gallery</h3>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Infinite Variety</span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {neuralPersonas.map((persona) => (
                    <button 
                      key={persona.name}
                      onClick={() => setSelectedVoice(persona.name)}
                      className={`p-6 rounded-3xl border transition-all flex flex-col gap-4 text-left group ${selectedVoice === persona.name ? 'bg-blue-600 border-blue-500 shadow-2xl' : 'bg-white/2 border-white/5 hover:bg-white/5'}`}
                    >
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedVoice === persona.name ? 'bg-white text-blue-600' : 'bg-blue-500/10 text-blue-500'}`}>
                          {persona.icon}
                       </div>
                       <div className="space-y-1">
                          <span className={`text-[11px] font-black uppercase tracking-tighter ${selectedVoice === persona.name ? 'text-white' : 'text-zinc-200'}`}>{persona.name}</span>
                          <p className={`text-[8px] font-bold uppercase tracking-widest ${selectedVoice === persona.name ? 'text-blue-200' : 'text-zinc-600'}`}>{persona.desc}</p>
                       </div>
                    </button>
                  ))}
               </div>
            </div>

            {/* EXPANDED LANGUAGES */}
            <div className="bg-[#0A0A0B] border border-white/5 p-8 rounded-[48px] space-y-8">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                  <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[4px]">Global Dialect Matrix</h3>
                  <div className="relative w-full md:w-64 group">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-blue-500 transition-colors" size={14} />
                     <input 
                       type="text" 
                       placeholder="SEARCH 50+ LANGUAGES..."
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full h-10 bg-white/2 border border-white/5 rounded-full pl-12 pr-4 text-[9px] font-black text-white uppercase tracking-widest outline-none focus:border-blue-500/30 transition-all"
                     />
                  </div>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {filteredLangs.map((lang) => (
                    <button 
                      key={lang.name}
                      onClick={() => setSelectedLang(lang.name)}
                      className={`h-16 rounded-2xl border transition-all flex items-center justify-center gap-3 ${selectedLang === lang.name ? 'bg-blue-600 border-blue-500 shadow-xl' : 'bg-white/2 border-white/5 hover:border-white/10 hover:bg-white/5'}`}
                    >
                       <span className="text-xl">{lang.flag}</span>
                       <span className={`text-[9px] font-black uppercase tracking-tighter ${selectedLang === lang.name ? 'text-white' : 'text-zinc-500'}`}>{lang.code}</span>
                    </button>
                  ))}
               </div>
            </div>
         </div>

         {/* RIGHT: ORCHESTRATION HUB */}
         <div className="xl:col-span-4 bg-[#0A0A0B] border border-white/5 rounded-[64px] p-8 flex flex-col gap-10">
            <div className="bg-[#050505] p-8 rounded-[48px] border border-white/5 flex flex-col items-center justify-center text-center gap-8 relative overflow-hidden group min-h-[300px]">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.05)_0%,_transparent_70%)] opacity-50" />
               <div className="w-28 h-28 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 relative z-10 shadow-2xl">
                  {isProcessing ? <Loader2 size={40} className="animate-spin" /> : <Volume2 size={40} />}
               </div>
               <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-center gap-2">
                     <span className="text-[8px] font-black text-blue-500 uppercase tracking-[4px]">Synthesizing Identity</span>
                  </div>
                  <p className="text-xl font-black text-white uppercase italic tracking-tighter">{selectedVoice}</p>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[4px]">{selectedLang} Reconstruction</p>
               </div>
            </div>

            <div className="space-y-6">
               <div className="relative group">
                  <input 
                    type="text" 
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="ENTER ASSET LINK FROM VAULT..." 
                    className="w-full h-16 bg-white/2 border border-white/5 rounded-2xl px-8 text-[9px] font-black text-white uppercase tracking-widest outline-none focus:border-blue-500/30 transition-all"
                  />
               </div>

               <button 
                 onClick={handleStartDubbing}
                 disabled={isProcessing}
                 className="h-20 w-full bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-3xl hover:bg-[#CCFF00] transition-all flex items-center justify-center gap-4 shadow-2xl disabled:opacity-50"
               >
                  {isProcessing ? "Reconstructing Voice..." : "Fuse Neural Identity"}
                  <ArrowRight size={18} />
               </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-white/2 rounded-2xl border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500"><Shield size={16} /></div>
                  <span className="text-[7px] font-black text-zinc-600 uppercase">Emotion Preserved</span>
               </div>
               <div className="p-4 bg-white/2 rounded-2xl border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500"><Zap size={16} /></div>
                  <span className="text-[7px] font-black text-zinc-600 uppercase">Ultra Latency</span>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}
