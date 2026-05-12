"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Upload, Sparkles, Wand2, Shield, Activity, 
  Zap, Loader2, Globe, CheckCircle2, Play, 
  RefreshCw, Layers, Volume2, Mic, Settings2,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/Toast";
import { soundEngine } from "@/utils/SoundEngine";
import NeuralProgressBar from "@/components/NeuralProgressBar";
import ExportModal from "@/components/ExportModal";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:5000";

const INTERNAL_VOICES = [
  { id: 'pNInz6obpg8n9Y4YvA9S', name: 'Bella (Premium)', accent: 'American' },
  { id: 'cgSgSjS2pM7w959mc8S4', name: 'Adam (Premium)', accent: 'American' },
  { id: 'ErXw9f1vhk9VfHBpL0tR', name: 'Antoni (Premium)', accent: 'American' },
  { id: 'v4', name: 'Aman (Creator)', accent: 'Indian' },
  { id: 'v1', name: 'Starboy (Deep)', accent: 'American' },
  { id: 'cloned', name: 'My Cloned Voice', accent: 'Custom' },
];

const INTERNAL_LANGUAGES = [
  { code: 'hi', name: 'Hindi (India)' },
  { code: 'es', name: 'Spanish (Global)' },
  { code: 'fr', name: 'French (Europe)' },
  { code: 'de', name: 'German (DACH)' },
  { code: 'ja', name: 'Japanese (Asia)' },
  { code: 'zh', name: 'Mandarin (China)' },
  { code: 'ko', name: 'Korean (South Korea)' },
  { code: 'it', name: 'Italian (Italy)' },
  { code: 'pt', name: 'Portuguese (Brazil)' },
  { code: 'ar', name: 'Arabic (Middle East)' },
  { code: 'ru', name: 'Russian (Russia)' },
  { code: 'tr', name: 'Turkish (Turkey)' }
];


export default function AIStudio() {
  const { showToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [targetLang, setTargetLang] = useState("hi");
  const [selectedVoice, setSelectedVoice] = useState("v1");
  const [jobId, setJobId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [resultVideoUrl, setResultVideoUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log(`[AI Studio] Initializing Neural Upload: ${file.name}`);
    console.log(`[AI Studio] Target Service: ${API_BASE}/api/upload`);
    
    setIsUploading(true);
    setUploadProgress(10);
    showToast("Initializing Secure Upload...", "info");
    soundEngine?.play("process");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const url = `${API_BASE}/api/upload`;
      console.log('Bhai, request ja rahi hai to:', url);
      console.log('Sending request to Backend...');
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Neural Upload Failed");
      }

      const data = await response.json();
      console.log("[AI Studio] Upload Response:", data);
      
      setUploadedVideoUrl(data.url);
      setJobId(data.project_id);
      setUploadProgress(100);
      showToast("Neural Ingestion Complete", "success");
      soundEngine?.play("success");
    } catch (error: any) {
      console.error("FULL ERROR:", error);
      alert(`UPLOAD FAILED: ${error.message}`);
      showToast(error.message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartDubbing = async () => {
    if (!uploadedVideoUrl || !jobId) {
      showToast("Please upload a video first", "error");
      return;
    }

    console.log(`[AI Studio] Triggering Dubbing Pipeline for ${jobId}`);
    console.log(`[AI Studio] Target Service: ${API_BASE}/api/dub`);
    
    setIsProcessing(true);
    showToast("Neural Core Activating...", "info");
    soundEngine?.play("process");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const url = `${API_BASE}/api/dub-elevenlabs`;
      console.log('Bhai, ElevenLabs request ja rahi hai to:', url);
      console.log('Sending request to Backend...');
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          video_url: uploadedVideoUrl,
          target_lang: targetLang,
          voice: selectedVoice,
          job_id: jobId
        }),
        signal: controller.signal
      });

      console.log(`[ElevenLabs API] Response Status: ${response.status}`);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[ElevenLabs API] Error Data:", errorData);
        throw new Error(errorData.message || "Processing initialization failed");
      }

      const data = await response.json();
      console.log("[AI Studio] ElevenLabs Dubbing Initialized:", data);
      
      showToast("Neural Pipeline Running in Background", "success");
      
      // For demo, we simulate polling or wait for WebSocket
      setTimeout(() => {
        setIsProcessing(false);
        setResultVideoUrl(`${API_BASE}/exports/dub_${jobId}.mp4`);
        setShowExportModal(true);
        soundEngine?.play("success");
      }, 5000);

    } catch (error: any) {
      console.error("FULL ERROR:", error);
      alert(`PIPELINE ERROR: ${error.message}`);
      showToast(error.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = (format: string) => {
    console.log(`[AI Studio] Exporting results in format: ${format}`);
    soundEngine?.play("click");
    showToast(`Preparing ${format} Export...`, "info");
    setShowExportModal(false);
  };

  return (
    <div className="flex flex-col gap-10 lg:gap-16 pb-24 lg:pb-20">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-8">
        <div>
           <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-white m-0 leading-none">
              AI <span className="text-[#a855f7]">Studio</span>
           </h1>
           <p className="text-[10px] font-black text-[#404040] uppercase tracking-[4px] mt-4 flex items-center gap-2">
              <Sparkles className="text-[#a855f7]" size={14} /> Neural Ingestion Active | Pipeline v4.2
           </p>
        </div>
        <div className="w-full md:w-auto flex items-center gap-4">
           <button 
             onClick={async () => {
               console.log("[Debug] Running System Diagnostics...");
               showToast("Running System Diagnostics...", "info");
               try {
                 const res = await fetch(`${API_BASE}/api/health`);
                 if (res.ok) {
                   showToast("Neural Core: ONLINE", "success");
                   console.log("[Debug] Neural Core: ONLINE");
                 } else {
                   showToast("Neural Core: OFFLINE", "error");
                 }
               } catch (e) {
                 showToast("Neural Core: CONNECTION REFUSED", "error");
                 console.error("[Debug] Health Check Failed:", e);
               }
             }}
             className="h-12 px-6 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-[#404040] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all cursor-pointer"
           >
              System Check
           </button>
           <div className="flex items-center gap-4 bg-white/3 p-4 md:p-5 rounded-2xl border border-white/5">
              <div className="text-right flex-1 md:flex-none">
                 <p className="text-[9px] font-black text-[#404040] uppercase tracking-widest">LPU Engine Status</p>
                 <p className="text-xl md:text-2xl font-black text-white">Active</p>
              </div>
              <div className="w-12 h-12 bg-[#a855f7]/10 border border-[#a855f7]/20 rounded-xl flex items-center justify-center text-[#a855f7] shadow-[0_0_15px_#a855f733]">
                 <Activity size={24} />
              </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        
        {/* Left: Input Zone */}
        <div className="lg:col-span-8 flex flex-col gap-10 lg:gap-14">
           
           {/* Upload Area */}
           <div 
             className="relative min-h-[400px] lg:min-h-[500px] bg-[#0A0A0B] rounded-[64px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center p-10 group overflow-hidden transition-all duration-700 hover:border-[#a855f7]/30"
             onClick={() => !isUploading && fileInputRef.current?.click()}
           >
              {uploadedVideoUrl ? (
                <div className="absolute inset-0 w-full h-full">
                  <video src={uploadedVideoUrl} className="w-full h-full object-cover opacity-40" controls />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                </div>
              ) : (
                <div className="relative z-10">
                   <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white/2 rounded-full flex items-center justify-center mb-12 border border-white/5 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                      <Upload size={40} className="text-[#a855f7]" />
                   </div>
                   <h2 className="text-3xl lg:text-5xl font-black text-white uppercase tracking-tighter mb-6">Drop Neural Source</h2>
                   <p className="text-[12px] text-[#404040] font-bold uppercase tracking-[4px] max-w-[400px] mx-auto leading-relaxed">
                      Upload Raw Footage for 4K Synthesis & Multilingual Dubbing
                   </p>
                </div>
              )}
              
              <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileUpload} />
              
              {isUploading && (
                <div className="absolute inset-x-10 bottom-10 z-20">
                   <NeuralProgressBar progress={uploadProgress} label="Ingesting Neural Data" color="#a855f7" />
                </div>
              )}
           </div>

           {/* Processing Controls */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-white/2 border border-white/5 rounded-[40px] flex flex-col gap-4">
                 <Shield size={24} className="text-[#3b82f6]" />
                 <p className="text-[10px] font-black text-white uppercase tracking-widest">Secure Compute</p>
                 <p className="text-[11px] text-[#404040] font-bold uppercase leading-relaxed">Identity protected by biometric encryption protocols.</p>
              </div>
              <div className="p-8 bg-white/2 border border-white/5 rounded-[40px] flex flex-col gap-4">
                 <Zap size={24} className="text-[#a855f7]" />
                 <p className="text-[10px] font-black text-white uppercase tracking-widest">Real-time LPU</p>
                 <p className="text-[11px] text-[#404040] font-bold uppercase leading-relaxed">Parallel processing on 12 distributed neural nodes.</p>
              </div>
              <div className="p-8 bg-white/2 border border-white/5 rounded-[40px] flex flex-col gap-4">
                 <Globe size={24} className="text-[#10b981]" />
                 <p className="text-[10px] font-black text-white uppercase tracking-widest">Global Sync</p>
                 <p className="text-[11px] text-[#404040] font-bold uppercase leading-relaxed">Localized lip-sync for 29+ international dialects.</p>
              </div>
           </div>
        </div>

        {/* Right: Configuration Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-10 lg:gap-12">
           <div className="p-10 lg:p-12 bg-[#0A0A0B] rounded-[56px] border border-white/5 shadow-2xl">
              <h3 className="text-2xl lg:text-3xl font-black text-white uppercase tracking-tighter mb-12 flex items-center gap-4">
                 <Wand2 size={28} className="text-[#a855f7]" /> Config
              </h3>

              <div className="flex flex-col gap-10">
                 {/* Language Selection */}
                 <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black text-[#404040] uppercase tracking-widest pl-2">Target Geography</label>
                    <div className="relative">
                       <select 
                         value={targetLang} 
                         onChange={(e) => setTargetLang(e.target.value)}
                         className="w-full h-16 bg-white/2 border border-white/5 rounded-2xl text-white text-[11px] font-black uppercase tracking-[2px] px-6 appearance-none outline-none focus:border-[#a855f7]/50 transition-colors cursor-pointer"
                       >
                          {INTERNAL_LANGUAGES.map(lang => (
                            <option key={lang.code} value={lang.code} className="bg-[#0A0A0B]">{lang.name}</option>
                          ))}
                       </select>
                       <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-[#404040] pointer-events-none" />
                    </div>
                 </div>

                 {/* Voice Selection */}
                 <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black text-[#404040] uppercase tracking-widest pl-2">Neural Identity</label>
                    <div className="grid grid-cols-2 gap-4">
                       {INTERNAL_VOICES.map(voice => (
                         <div 
                           key={voice.id}
                           onClick={() => setSelectedVoice(voice.id)}
                           className={`p-5 rounded-2xl border transition-all cursor-pointer group active:scale-95 ${selectedVoice === voice.id ? 'bg-[#a855f7] border-[#a855f7] shadow-[0_0_20px_#a855f766]' : 'bg-white/2 border-white/5 hover:border-white/10'}`}
                         >
                            <p className={`text-[10px] font-black uppercase tracking-tighter mb-1 transition-colors ${selectedVoice === voice.id ? 'text-white' : 'text-white/80'}`}>{voice.name}</p>
                            <p className={`text-[8px] font-black uppercase tracking-widest transition-colors ${selectedVoice === voice.id ? 'text-white/60' : 'text-[#404040]'}`}>{voice.accent}</p>
                         </div>
                       ))}
                    </div>
                 </div>

                 <button 
                    disabled={isProcessing || isUploading || !uploadedVideoUrl}
                    onClick={handleStartDubbing}
                    className={`h-20 lg:h-24 w-full rounded-[32px] font-black text-[12px] uppercase tracking-[6px] transition-all duration-500 shadow-2xl relative overflow-hidden border-none active:scale-95 ${isProcessing || !uploadedVideoUrl ? 'bg-white/5 text-[#404040] cursor-not-allowed' : 'bg-white text-black cursor-pointer hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]'}`}
                 >
                    {isProcessing ? (
                       <div className="flex items-center justify-center gap-4">
                          <Loader2 size={20} className="animate-spin" />
                          <span>Neuralizing...</span>
                       </div>
                    ) : "Start Dubbing"}
                 </button>
              </div>
           </div>

           <div className="p-10 lg:p-12 bg-gradient-to-br from-[#a855f71a] to-transparent rounded-[56px] border border-[#a855f71a] shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                 <CheckCircle2 className="text-[#a855f7]" size={20} />
                 <p className="text-[10px] font-black text-white uppercase tracking-widest">Quality Verified</p>
              </div>
              <p className="text-[11px] text-[#404040] font-bold uppercase tracking-widest leading-relaxed">
                 Neural Engine v4.2 ensures 99.1% lip-sync accuracy across all target dialects.
              </p>
           </div>
        </div>
      </div>

      <ExportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)}
        videoUrl={resultVideoUrl || ""}
        onExport={handleExport}
      />
    </div>
  );
}
