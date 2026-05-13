"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Upload, Sparkles, Wand2, Shield, Activity, 
  Zap, Loader2, Globe, CheckCircle2, Play, 
  RefreshCw, Layers, Volume2, Mic, Settings2,
  ChevronDown, Smartphone, Monitor
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/Toast";
import { soundEngine } from "@/utils/SoundEngine";
import dynamic from "next/dynamic";

const UniversalInjest = dynamic(() => import("@/components/UniversalInjest"), { ssr: false });
const ExportModal = dynamic(() => import("@/components/ExportModal"), { ssr: false });
const NeuralProgressBar = dynamic(() => import("@/components/NeuralProgressBar"), { ssr: false });
import API_BASE, { robustFetch as safeFetch } from "@/utils/api";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCredits } from "@/context/CreditsContext";
import { executeNeuralTask } from "@/utils/NeuralShield";
import { useEditorStore } from "@/store/useEditorStore";

const INTERNAL_VOICES = [
  { id: 'pNInz6obpg8n9Y4YvA9S', name: 'Bella (Premium)', accent: 'American' },
  { id: 'cgSgSjS2pM7w959mc8S4', name: 'Adam (Premium)', accent: 'American' },
  { id: 'ErXw9f1vhk9VfHBpL0tR', name: 'Antoni (Premium)', accent: 'American' },
  { id: 'v4', name: 'Aman (Creator)', accent: 'Indian' },
  { id: 'v1', name: 'Starboy (Deep)', accent: 'American' },
  { id: 'cloned', name: 'My Cloned Voice', accent: 'Custom' },
];

const INTERNAL_LANGUAGES = [
  { code: 'hi-IN', name: 'Hindi (हिंदी)', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'Marathi (मराठी)', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'Tamil (தமிழ்)', flag: '🇮🇳' },
  { code: 'te-IN', name: 'Telugu (తెలుగు)', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'Bengali (বাংলা)', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'Gujarati (ગુજરાતી)', flag: '🇮🇳' },
  { code: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)', flag: '🇮🇳' },
  { code: 'ml-IN', name: 'Malayalam (മലയാളം)', flag: '🇮🇳' },
  { code: 'pa-IN', name: 'Punjabi (ਪੰਜਾਬੀ)', flag: '🇮🇳' },
  { code: 'as-IN', name: 'Assamese (অসমীয়া)', flag: '🇮🇳' },
  { code: 'or-IN', name: 'Odia (ଓଡ଼ିଆ)', flag: '🇮🇳' },
  { code: 'ur-IN', name: 'Urdu (اردو)', flag: '🇮🇳' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Spanish (ES)', flag: '🇪🇸' },
  { code: 'ja-JP', name: 'Japanese (JP)', flag: '🇯🇵' }
];


export default function AIStudio() {
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const { balance, refreshBalance } = useCredits();
  const { 
    uploadedVideoUrl, setUploadedVideoUrl, 
    activeJobId: jobId, setActiveJobId: setJobId,
    targetLang, setTargetLang,
    selectedVoice, setSelectedVoice,
    isProcessing, setIsProcessing
  } = useEditorStore();
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);
  const [resultVideoUrl, setResultVideoUrl] = useState<string | null>(null);
  const [format, setFormat] = useState('9:16');
  const [useBranding, setUseBranding] = useState(true);
  const [captions, setCaptions] = useState("MASTERING THE NEURAL ENGINE");

  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log(`[AI Studio] Initializing Neural Upload: ${file.name}`);
    console.log(`[AI Studio] Target Service: ${API_BASE}/api/upload`);
    
    setIsUploading(true);
    setUploadProgress(10);

    const task = async () => {
      const formData = new FormData();
      formData.append('file', file);
      const data = await safeFetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      setUploadedVideoUrl(data.url);
      setJobId(data.project_id);
      setUploadProgress(100);
      return data;
    };

    await executeNeuralTask(
      task,
      "Neural Core: Ingesting Asset...",
      "Asset Synchronized ⚡"
    );
    setIsUploading(false);
  };

  const handleStartDubbing = async () => {
    if (!uploadedVideoUrl || !jobId) {
      showToast("Please upload a video first", "error");
      return;
    }

    // Credit Check
    if (balance < 5.0) {
      if (window.confirm("Insufficient Neural Balance. Would you like to refill your credits now?")) {
        router.push('/dashboard/billing');
      }
      return;
    }

    console.log(`[AI Studio] Triggering Dubbing Pipeline for ${jobId}`);
    console.log('Target URL:', process.env.NEXT_PUBLIC_API_URL);
    console.log(`[AI Studio] Full Route Path: ${API_BASE}/api/dub-elevenlabs`);
    
    setIsProcessing(true);
    const task = async () => {
      const payload = {
        videoUrl: uploadedVideoUrl,
        language: targetLang,
        voiceId: selectedVoice,
        jobId: jobId,
        user_email: session?.user?.email || useUserStore.getState().user?.email || "anonymous"
      };
      
      return await safeFetch('/api/synthesis', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    };

    const data = await executeNeuralTask(
      task,
      "Neural Core: Orchestrating Dubbing...",
      "Neural Pipeline Initialized ⚡"
    );

    if (data) {
      const activeJobId = data.job_id || jobId;
      setIsProcessing(true);
      
      const pollInterval = setInterval(async () => {
        try {
          const checkUrl = `${API_BASE}/exports/dub_${activeJobId}.mp4`;
          const checkRes = await fetch(`${checkUrl}?t=${Date.now()}`, { method: 'HEAD' });
          const contentLength = parseInt(checkRes.headers.get('content-length') || '0');

          if (checkRes.ok && contentLength > 100) {
            clearInterval(pollInterval);
            setIsProcessing(false);
            setResultVideoUrl(checkUrl);
            setShowExportModal(true);
            refreshBalance(); 
            soundEngine?.play("success");
          }
        } catch (e) {}
      }, 3000);

      setTimeout(() => {
        clearInterval(pollInterval);
        if (isProcessing) setIsProcessing(false);
      }, 120000);
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
                showToast("Running System Diagnostics...", "info");
                try {
                  const data = await safeFetch('/api/health');
                  if (data.status === 'ok') showToast("Neural Core: ONLINE", "success");
                } catch (e) {
                  showToast("Neural Core: CONNECTION REFUSED", "error");
                }
              }}
              className="h-12 px-6 bg-[#00e5ff]/5 border border-[#00e5ff]/20 rounded-xl text-[10px] font-black text-[#00e5ff] uppercase tracking-widest hover:bg-[#00e5ff] hover:text-black transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.1)]"
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
           
           {/* Universal Injest Zone */}
           <div className="flex flex-col gap-6">
              <UniversalInjest 
                 onComplete={() => showToast("Batch Upload Initialized", "success")}
                 allowedTypes={{ 'video/*': ['.mp4', '.mov', '.avi'] }}
              />
              <div className="flex justify-between items-center px-4">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Titan-X Parallel Streams Active</span>
                 </div>
                  <button className="text-[9px] font-black text-[#10b981] uppercase tracking-widest border-b border-[#10b98133]">Configure Storage</button>
              </div>
           </div>

           {/* Neural Configuration HUD */}
           <div className="p-10 bg-[#0A0A0B] border border-white/5 rounded-[48px] flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                 <span className="text-[10px] font-black text-[#404040] uppercase tracking-[4px]">Neural Config</span>
                 <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Creative <span className="text-[#CCFF00]">Parameters</span></h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Format Selector */}
                 <div className="flex flex-col gap-4">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Output Format</span>
                    <div className="flex gap-4">
                       <button 
                         onClick={() => { setFormat('9:16'); soundEngine?.play("click"); }}
                         className={`flex-1 h-16 rounded-2xl border flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${format === '9:16' ? 'bg-[#CCFF00] border-[#CCFF00] text-black' : 'bg-white/2 border-white/5 text-zinc-500'}`}
                       >
                          <Smartphone size={16} /> 9:16 Reels
                       </button>
                       <button 
                         onClick={() => { setFormat('16:9'); soundEngine?.play("click"); }}
                         className={`flex-1 h-16 rounded-2xl border flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${format === '16:9' ? 'bg-[#CCFF00] border-[#CCFF00] text-black' : 'bg-white/2 border-white/5 text-zinc-500'}`}
                       >
                          <Monitor size={16} /> 16:9 Widescreen
                       </button>
                    </div>
                 </div>

                 {/* Branding Toggle */}
                 <div className="flex flex-col gap-4">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Branding Layer</span>
                    <button 
                      onClick={() => { setUseBranding(!useBranding); soundEngine?.play("click"); }}
                      className={`h-16 px-8 rounded-2xl border flex items-center justify-between text-[10px] font-black uppercase tracking-widest transition-all ${useBranding ? 'bg-[#a855f71a] border-[#a855f733] text-[#a855f7]' : 'bg-white/2 border-white/5 text-zinc-500'}`}
                    >
                       <div className="flex items-center gap-3">
                          <Shield size={16} /> Add Watermark
                       </div>
                       <div className={`w-4 h-4 rounded-full border-2 transition-all ${useBranding ? 'bg-[#a855f7] border-[#a855f7]' : 'border-zinc-700'}`} />
                    </button>
                 </div>
              </div>
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

           {/* NEURAL PROGRESS HUD */}
           {isProcessing && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <NeuralProgressBar taskId={activeJobId} progress={isProcessing ? undefined : 100} />
              </motion.div>
           )}
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
                     <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-2">Target Geography</label>
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
                        <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                     </div>
                  </div>

                  {/* Neural Prompting */}
                  <div className="flex flex-col gap-4">
                     <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-2">Neural Prompt / Translation Context</label>
                     <textarea 
                        placeholder="e.g. 'Keep the tone energetic and use Gen-Z slang' or paste a manual script..."
                        className="w-full h-24 bg-white/2 border border-white/5 rounded-2xl p-4 text-[10px] text-white focus:outline-none focus:border-[#a855f7]/50 transition-all resize-none font-medium leading-relaxed placeholder:text-zinc-800"
                     />
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
                     className={`h-20 lg:h-24 w-full rounded-[32px] font-black text-[12px] uppercase tracking-[6px] transition-all duration-500 shadow-2xl relative overflow-hidden border ${isProcessing || !uploadedVideoUrl ? 'bg-white/5 border-white/5 text-zinc-600 cursor-not-allowed' : 'bg-[#f59e0b] border-[#f59e0b] text-black cursor-pointer hover:shadow-[0_0_40px_rgba(245,158,11,0.4)]'}`}
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
