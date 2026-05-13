"use client";

import React, { useState } from "react";
import { 
  Mic, Wand2, AudioLines, Sparkles, Play, Pause, 
  Download, Plus, Settings, Brain, Radio, Volume2,
  Trash2, Save, CloudLightning
} from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { toast } from "react-hot-toast";
import UniversalInjest from "@/components/UniversalInjest";
import { executeNeuralTask } from "@/utils/NeuralShield";

export default function VoiceLabPage() {
  const { deductCredits } = useEditorStore();
  const [script, setScript] = useState("");
  const [isCloning, setIsCloning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeVoice, setActiveVoice] = useState("Titan-X Pro");

  const voices = [
    { name: 'Titan-X Pro', type: 'System', emotion: 'Professional' },
    { name: 'Cyber Neon', type: 'Neural', emotion: 'Excited' },
    { name: 'Aman (Clone)', type: 'Custom', emotion: 'Calm' },
  ];

  const handleCloneVoice = async () => {
    const task = async () => {
      setIsCloning(true);
      await new Promise(resolve => setTimeout(resolve, 5000));
      deductCredits(25.0);
      setIsCloning(false);
      return true;
    };

    await executeNeuralTask(
      task,
      "Neural Core: Analyzing Vocal Samples...",
      "Voice Identity Cloned Successfully ⚡"
    );
  };

  const handleGenerateSpeech = async () => {
    if (!script) return toast.error("Bhai, script toh likho!");
    
    const task = async () => {
      await new Promise(resolve => setTimeout(resolve, 2500));
      return true;
    };

    const success = await executeNeuralTask(
      task,
      "Neural Synthesizing...",
      "Speech Synthesis Complete! 🎧"
    );

    if (success) setIsPlaying(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#000000] flex flex-col gap-10 p-2 overflow-hidden">
      <div className="flex flex-col gap-3">
         <p className="text-[10px] font-black text-[#262626] uppercase tracking-[6px]">Neural Vocalist Engine</p>
         <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
            VOICE <span className="text-[#00e5ff]">LAB</span>.
         </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 flex-1">
         
         {/* LEFT: CLONING & SELECTION */}
         <div className="xl:col-span-4 flex flex-col gap-8">
            <div className="bg-[#0A0A0B] border border-white/5 rounded-[48px] p-10 flex flex-col gap-10 shadow-3xl">
               <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-[#00e5ff] uppercase tracking-widest">Clone Identity</span>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Vocal Blueprint</h3>
               </div>
               <div className="flex flex-col gap-6">
                  <UniversalInjest 
                     onComplete={() => toast.success("Voice Samples Ingested")}
                     allowedTypes={{ 'audio/*': ['.wav', '.mp3', '.m4a'] }}
                  />
                  <div className="flex justify-between items-center px-4">
                     <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Parallel Sample Analysis: ON</span>
                     <span className="text-[8px] font-black text-[#00e5ff] uppercase tracking-widest italic">Titan-X Bridge Ready</span>
                  </div>
               </div>
               <button 
                  onClick={handleCloneVoice}
                  disabled={isCloning}
                  className="h-16 bg-[#00e5ff] text-black text-[11px] font-black uppercase rounded-2xl flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(0,229,255,0.2)] hover:shadow-[0_0_50px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50"
               >
                  {isCloning ? <CloudLightning size={20} className="animate-pulse" /> : <Sparkles size={20} />}
                  {isCloning ? "Neural Cloning..." : "Start Vocal Cloning"}
               </button>
            </div>

            <div className="bg-[#0A0A0B] border border-white/5 rounded-[48px] p-10 flex flex-col gap-8 shadow-3xl">
               <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Active Voice Identities</span>
               <div className="flex flex-col gap-4">
                  {voices.map(voice => (
                     <div 
                        key={voice.name}
                        onClick={() => setActiveVoice(voice.name)}
                        className={`p-6 rounded-3xl border flex items-center justify-between cursor-pointer transition-all ${
                           activeVoice === voice.name ? "bg-[#00e5ff] border-[#00e5ff] text-black" : "bg-white/2 border-white/5 text-zinc-500"
                        }`}
                     >
                        <div className="flex flex-col gap-1">
                           <span className="text-[11px] font-black uppercase tracking-widest">{voice.name}</span>
                           <span className={`text-[7px] font-bold uppercase ${activeVoice === voice.name ? 'text-black/60' : 'text-zinc-700'}`}>{voice.type} • {voice.emotion}</span>
                        </div>
                        <Radio size={16} className={activeVoice === voice.name ? "text-black" : "text-zinc-800"} />
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* RIGHT: TEXT TO SPEECH */}
         <div className="xl:col-span-8 flex flex-col gap-8">
            <div className="flex-1 bg-[#0A0A0B] border border-white/5 rounded-[64px] p-12 flex flex-col gap-10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#00e5ff05] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
               
               <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">Target Voice: {activeVoice}</span>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Script to Neural Speech</h3>
               </div>

               <textarea 
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="Paste your script here. Our Titan-X engine will synthesize it with human-like prosody and emotional depth..."
                  className="flex-1 bg-black/50 border border-white/5 rounded-[48px] p-10 text-[16px] text-white focus:outline-none focus:border-[#00e5ff33] transition-all resize-none font-medium leading-relaxed"
               />

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white/2 border border-white/5 rounded-3xl p-6 flex flex-col gap-3">
                     <span className="text-[9px] font-black text-zinc-700 uppercase">Emotion Strength</span>
                     <div className="h-1 bg-zinc-800 rounded-full relative overflow-hidden">
                        <div className="h-full bg-[#00e5ff] w-[70%]"></div>
                     </div>
                  </div>
                  <div className="bg-white/2 border border-white/5 rounded-3xl p-6 flex flex-col gap-3">
                     <span className="text-[9px] font-black text-zinc-700 uppercase">Vocal Clarity</span>
                     <div className="h-1 bg-zinc-800 rounded-full relative overflow-hidden">
                        <div className="h-full bg-[#00e5ff] w-[95%]"></div>
                     </div>
                  </div>
                  <button 
                     onClick={handleGenerateSpeech}
                     className="h-full bg-white/5 border border-white/10 rounded-3xl text-white text-[10px] font-black uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                  >
                     <AudioLines size={18} className="text-[#00e5ff]" />
                     Sync to Studio
                  </button>
               </div>

               <button 
                  onClick={handleGenerateSpeech}
                  className="h-24 bg-[#00e5ff] text-black text-[13px] font-black uppercase rounded-3xl flex items-center justify-center gap-6 shadow-[0_0_40px_rgba(0,229,255,0.2)] hover:shadow-[0_0_60px_rgba(0,229,255,0.5)] transition-all"
               >
                  {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                  {isPlaying ? "Synthesized Output Playing..." : "Synthesize Neural Speech"}
               </button>
            </div>

            {/* QUICK TELEMETRY */}
            <div className="h-32 flex gap-8">
               <div className="flex-1 bg-[#0A0A0B] border border-white/5 rounded-[32px] p-8 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                     <div className="w-12 h-12 bg-[#10b98122] rounded-2xl flex items-center justify-center text-[#10b981]"><Volume2 size={24} /></div>
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Global Output</span>
                        <span className="text-[12px] font-black text-white uppercase tracking-tighter">HD Pro Stereo</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     {[...Array(8)].map((_, i) => (
                        <div key={i} className={`w-1.5 bg-[#10b981] rounded-full animate-pulse`} style={{ height: `${Math.random() * 20 + 5}px`, animationDelay: `${i * 0.1}s` }}></div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}
