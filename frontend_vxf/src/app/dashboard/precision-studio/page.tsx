"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Scissors, Layers, Play, Pause, SkipBack, SkipForward, 
  Upload, CheckCircle2, Loader2, Monitor, Smartphone, 
  Square, Settings2, Plus, Volume2, Type, Film, Image as ImageIcon,
  Wand2, Music, Mic, Power, Star, Download, Layout, Globe, Zap, Shield, Activity
} from "lucide-react";
import { useToast } from "@/components/Toast";
import { signout } from "@/app/actions/auth";
import { useSession } from "next-auth/react";
import { User as UserIcon } from "lucide-react";

interface Track {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'overlay';
  color: string;
  width: string;
  offset: string;
}

export default function PrecisionStudio() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [activeMode, setActiveMode] = useState<'manual' | 'ai'>('manual');
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('Normal');
  const [warpStyle, setWarpStyle] = useState<string>('None');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [audioDucking, setAudioDucking] = useState(false);
  const [isCaptioning, setIsCaptioning] = useState(false);
  const [faceFollow, setFaceFollow] = useState(false);
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [selectedTone, setSelectedTone] = useState<string>('Professional');
  const [selectedDialect, setSelectedDialect] = useState<string>('Standard');
  const [isExtracting, setIsExtracting] = useState(false);
  const [viralScore, setViralScore] = useState(88);
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [vibeUrl, setVibeUrl] = useState("");
  const [brandLocked, setBrandLocked] = useState(false);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'properties' | 'assets' | 'ghostwriter' | 'avatar'>('properties');
  const [intensity, setIntensity] = useState<number>(85);
  const [aiFiles, setAiFiles] = useState<string[]>([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [targetLang, setTargetLang] = useState("hi-IN");

  const INDIAN_LANGUAGES = [
    { code: 'hi-IN', name: 'Hindi (हिंदी)', flag: '🇮🇳' },
    { code: 'mr-IN', name: 'Marathi (मराठी)', flag: '🇮🇳' },
    { code: 'ta-IN', name: 'Tamil (தமிழ்)', flag: '🇮🇳' },
    { code: 'te-IN', name: 'Telugu (తెలుగు)', flag: '🇮🇳' },
    { code: 'bn-IN', name: 'Bengali (বাংলা)', flag: '🇮🇳' },
    { code: 'gu-IN', name: 'Gujarati (ગુજરાતી)', flag: '🇮🇳' },
    { code: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)', flag: '🇮🇳' },
    { code: 'ml-IN', name: 'Malayalam (മലയാളം)', flag: '🇮🇳' },
    { code: 'pa-IN', name: 'Punjabi (ਪੰਜਾਬੀ)', flag: '🇮🇳' },
    { code: 'ur-IN', name: 'Urdu (اردو)', flag: '🇮🇳' },
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' }
  ];

  const [tracks, setTracks] = useState<Track[]>([
    { id: 't1', name: 'Primary Video', type: 'video', color: '#10b981', width: '80%', offset: '0%' },
    { id: 't2', name: 'Background Audio', type: 'audio', color: '#3b82f6', width: '100%', offset: '0%' },
    { id: 't3', name: 'Neural Overlays', type: 'overlay', color: '#a855f7', width: '40%', offset: '10%' }
  ]);

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

  useEffect(() => {
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

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isSystemOnline) return;

    const localUrl = URL.createObjectURL(file);
    setVideoFile(localUrl);
    showToast("Source Media Ingested", "success");

    const fd = new FormData();
    fd.append('file', file);
    try {
      const data = await safeFetch(`${API_BASE}/api/upload`, { method: 'POST', body: fd });
      console.log("Server Upload Success:", data.url);
    } catch (err) {
      showToast("Upload Connection Failed", "error");
    }
  };

  const handleAiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !isSystemOnline) return;
    setIsAiProcessing(true);
    showToast(`Ingesting ${files.length} Assets...`, "info");
    try {
      const urls = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        const data = await safeFetch(`${API_BASE}/api/upload`, { method: 'POST', body: fd });
        urls.push(data.url);
      }
      setAiFiles(prev => [...prev, ...urls]);
      showToast("Media Ready for Auto-Pilot", "success");
    } catch (err) {
      showToast("Upload Failed - Check Connection", "error");
    } finally {
      setIsAiProcessing(false);
    }
  };

  const checkSafety = (text: string) => {
    const sensitiveNames = ['Modi', 'Kohli', 'Dhoni', 'SRK', 'Salman', 'Modiji', 'Amitabh', 'Celebrity', 'Artist'];
    return sensitiveNames.some(name => text.toLowerCase().includes(name.toLowerCase()));
  };

  const startAutoPilot = async () => {
    if (!isSystemOnline) return;

    // Legal Safety Check
    const hasSensitiveContent = aiFiles.some(f => checkSafety(f)); // Mock check on filenames
    if (hasSensitiveContent) {
      showToast("Legal: Ensure you have rights for commercial voice usage.", "info");
    }

    setIsAiProcessing(true);
    showToast("Neural Auto-Pilot Initialized", "info");
    try {
      const data = await safeFetch(`${API_BASE}/api/studio/auto-pilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_urls: aiFiles })
      });
      if (data.status === 'success') {
        setTimeout(() => {
          setResultUrl(`${API_BASE}/exports/demo_viral_clip.mp4`);
          setIsAiProcessing(false);
          showToast("AI Assembly Complete", "success");
        }, 5000);
      }
    } catch (err) {
      showToast("Assembly Failed - Backend Unreachable", "error");
      setIsAiProcessing(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#050505] text-white overflow-hidden font-sans">
      {!isSystemOnline && (
        <div className="fixed top-0 left-0 w-full h-12 bg-red-600/20 backdrop-blur-3xl border-b border-red-600/30 z-[9999] flex items-center justify-center gap-4">
           <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
           <p className="text-[10px] font-black uppercase tracking-[3px] text-red-200">System Maintenance: Neural Pipeline Offline. Please check your connection.</p>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0 bg-[#050505] relative">
        
        {/* Header with Mode Toggle */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#050505]/80 backdrop-blur-3xl z-40">
           <div className="flex items-center gap-8">
              <h1 className="text-xl font-black text-white uppercase tracking-tighter">Precision <span className="text-[#10b981]">Studio</span></h1>
              
              {/* Mode Toggle Switch */}
              <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/5 shadow-2xl">
                 <button 
                    onClick={() => setActiveMode('manual')}
                    className={`h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'manual' ? 'bg-white text-black shadow-xl' : 'text-[#404040] hover:text-white'}`}
                 >
                    Manual
                 </button>
                 <button 
                    onClick={() => setActiveMode('ai')}
                    className={`h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'ai' ? 'bg-[#10b981] text-black shadow-xl' : 'text-[#404040] hover:text-white'}`}
                 >
                    Auto-Pilot
                 </button>
              </div>

              {/* Share Review Button */}
              <button 
                onClick={() => showToast("Review Link: https://voxflow.ai/review/xr72k", "success")}
                className="h-10 px-6 rounded-xl bg-white/2 border border-white/5 text-[9px] font-black uppercase tracking-widest text-white hover:bg-[#a855f71a] hover:border-[#a855f733] transition-all flex items-center gap-2 group"
              >
                 <Globe size={14} className="text-[#a855f7] group-hover:drop-shadow-[0_0_8px_#a855f7]" /> Share Review
              </button>

              <button 
                onClick={() => showToast("Social Scheduler Active. Select Date/Time.", "info")}
                className="h-10 px-6 rounded-xl bg-[#10b981] text-black text-[9px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_#10b98166] transition-all flex items-center gap-2"
              >
                 <Play size={14} /> Publish & Schedule
              </button>

              {/* Aspect Ratio Switcher */}
              <div className="hidden lg:flex items-center bg-white/2 p-1 rounded-xl border border-white/5">
                 {['16:9', '9:16', '1:1'].map(r => (
                   <button 
                      key={r}
                      onClick={() => setAspectRatio(r)}
                      className={`h-8 px-4 rounded-lg text-[9px] font-black transition-all ${aspectRatio === r ? 'bg-white/10 text-white' : 'text-[#404040] hover:text-white/60'}`}
                   >
                      {r}
                   </button>
                 ))}
              </div>
           </div>

           <div className="flex items-center gap-6">
              {session?.user && (
                <div className="flex items-center gap-4 mr-4 border-r border-white/5 pr-6 hidden md:flex">
                   <div className="text-right">
                      <p className="text-[9px] font-black text-white uppercase tracking-widest">{session.user.name}</p>
                      <p className="text-[7px] font-black text-[#404040] uppercase tracking-[2px]">Pro Creator</p>
                   </div>
                   {session.user.image ? (
                     <img src={session.user.image} alt="Profile" className="w-10 h-10 rounded-xl border border-white/10 shadow-2xl object-cover" />
                   ) : (
                     <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                       <UserIcon size={16} className="text-[#404040]" />
                     </div>
                   )}
                </div>
              )}
              <div className="flex items-center gap-3 bg-white/2 px-4 h-12 rounded-2xl border border-white/5">
                 <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#404040]">Neural Engine Online</span>
              </div>
              <button 
                onClick={() => {
                  if (window.confirm("Disconnect from Neural Vault?")) {
                     signout();
                  }
                }}
                className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#404040] hover:text-white transition-all border border-white/5"
              >
                 <Power size={18} />
              </button>
           </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Editing Area */}
          <div className="flex-1 flex flex-col p-8 lg:p-12 overflow-y-auto no-scrollbar scroll-smooth">
             {activeMode === 'manual' ? (
               <div className="flex flex-col gap-10">
                  {/* Player & Preview Area */}
                  <div 
                    className="min-h-[500px] bg-[#0A0A0B] rounded-[64px] border border-white/5 relative overflow-hidden group shadow-2xl flex items-center justify-center transition-all duration-500"
                    style={{ 
                      aspectRatio: aspectRatio === '16:9' ? '16/9' : aspectRatio === '9:16' ? '9/16' : '1/1',
                      maxWidth: aspectRatio === '9:16' ? '400px' : '100%',
                      margin: '0 auto'
                    }}
                  >
                     {!videoFile ? (
                        <div className="flex flex-col items-center gap-8">
                           <div 
                             onClick={() => document.getElementById('studio-upload')?.click()}
                             className="w-28 h-28 bg-white/5 rounded-full flex items-center justify-center text-[#404040] hover:text-white hover:bg-white/10 transition-all cursor-pointer border border-white/5 hover:scale-110 shadow-2xl"
                           >
                              <Upload size={36} />
                           </div>
                           <div className="text-center">
                              <p className="text-[11px] font-black text-white uppercase tracking-[4px] mb-2">Initialize Source Media</p>
                              <p className="text-[9px] font-black text-[#404040] uppercase tracking-[3px]">MP4, MOV, WEBM up to 2GB</p>
                           </div>
                           <input id="studio-upload" type="file" className="hidden" accept="video/*" onChange={handleVideoUpload} />
                        </div>
                     ) : (
                        <video 
                           ref={videoRef}
                           src={videoFile} 
                           className={`max-w-full max-h-full rounded-2xl transition-all duration-700 shadow-2xl ${selectedFilter === 'Grayscale' ? 'grayscale' : selectedFilter === 'Sepia' ? 'sepia' : selectedFilter === 'Contrast' ? 'contrast-150' : selectedFilter === 'Vibrant' ? 'saturate-200 contrast-125' : ''}`}
                        />
                     )}
                  </div>

                  {/* Manual Tools: Filters Gallery */}
                  <div className="flex flex-col gap-6">
                     <p className="text-[10px] font-black text-[#404040] uppercase tracking-[4px]">Neural Filter Gallery</p>
                     <div className="flex gap-4 overflow-x-auto no-scrollbar">
                        {['Normal', 'Grayscale', 'Sepia', 'Contrast', 'Vibrant', 'Neural Bloom', 'Cyber-Rush'].map(f => (
                          <button 
                             key={f}
                             onClick={() => setSelectedFilter(f)}
                             className={`h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${selectedFilter === f ? 'bg-white text-black border-white shadow-xl' : 'bg-white/2 text-[#404040] border-white/5 hover:border-white/20'}`}
                          >
                             {f}
                          </button>
                        ))}
                     </div>
                  </div>

                  {/* Timeline Area */}
                  <div className="bg-[#0A0A0B] rounded-[48px] border border-white/5 p-10 flex flex-col gap-10 shadow-2xl mb-20">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                           <button onClick={togglePlay} className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-black hover:scale-110 transition-all shadow-xl">
                              {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
                           </button>
                           <div className="flex flex-col gap-2">
                              <p className="text-[10px] font-black text-white font-mono tracking-widest">00:12:45 / 00:45:00</p>
                              <div className="h-1.5 w-80 bg-white/5 rounded-full relative">
                                 <div className="absolute left-0 top-0 h-full w-1/3 bg-[#10b981] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                              </div>
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <button 
                              onClick={() => { setIsCaptioning(true); setTimeout(() => { setIsCaptioning(false); showToast("Neural Captions Burned", "success"); }, 4000); }}
                              className={`h-14 px-8 rounded-2xl bg-[#10b9811a] text-[10px] font-black uppercase tracking-widest text-[#10b981] hover:bg-[#10b98122] transition-all border border-[#10b98133] flex items-center gap-3 ${isCaptioning ? 'animate-pulse' : ''}`}
                           >
                              {isCaptioning ? <Loader2 size={16} className="animate-spin" /> : <Type size={16} />}
                              {isCaptioning ? "Transcribing..." : "Auto-Caption"}
                           </button>
                           <button 
                              onClick={() => { showToast("Analyzing Script for B-Roll...", "info"); setTimeout(() => showToast("4K B-Roll Assets Matched", "success"), 3000); }}
                              className="h-14 px-8 rounded-2xl bg-white/2 text-[10px] font-black uppercase tracking-widest text-[#404040] hover:text-[#a855f7] transition-all border border-white/5 flex items-center gap-3 hover:shadow-[0_0_20px_#a855f733] hover:border-[#a855f733]"
                           >
                              <Star size={16} className="text-[#a855f7]" /> Suggest B-Roll
                           </button>
                           <button 
                              onClick={() => { setIsExtracting(true); setTimeout(() => { setIsExtracting(false); showToast("3 Viral Shorts Extracted", "success"); }, 5000); }}
                              className={`h-14 px-8 rounded-2xl bg-[#a855f71a] text-[10px] font-black uppercase tracking-widest text-[#a855f7] hover:bg-[#a855f722] transition-all border border-[#a855f733] flex items-center gap-3 ${isExtracting ? 'animate-pulse shadow-[0_0_15px_#a855f733]' : ''}`}
                           >
                              {isExtracting ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                              {isExtracting ? "Extracting..." : "AI Short-Maker"}
                           </button>
                           <button className="h-14 px-8 rounded-2xl bg-white/2 text-[10px] font-black uppercase tracking-widest text-[#404040] hover:text-white transition-all border border-white/5 flex items-center gap-3">
                              <Scissors size={16} /> Split
                           </button>
                        </div>
                     </div>
                     
                     {/* Tracks */}
                     <div className="flex flex-col gap-6">
                        {tracks.map((track) => (
                           <div key={track.id} className="h-20 bg-white/2 rounded-[24px] border border-white/5 flex items-center px-8 gap-8 group hover:border-[#10b98133] transition-all">
                              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#404040] group-hover:text-white transition-colors">
                                 {track.type === 'video' ? <Monitor size={18} /> : track.type === 'audio' ? <Mic size={18} /> : <Scissors size={18} />}
                              </div>
                              <div className="flex-1 h-10 bg-white/2 rounded-xl relative overflow-hidden">
                                 <div className="absolute left-10 right-32 top-0 h-full bg-[#10b98122] border-x-2 border-[#10b981] rounded-sm"></div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center gap-12 max-w-4xl mx-auto w-full mb-20">
                  <div className="text-center">
                     <h2 className="text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">Neural <span className="text-[#10b981]">Auto-Pilot</span></h2>
                     <p className="text-[12px] text-[#404040] font-black uppercase tracking-[6px]">Architecting your viral sequence with zero manual friction.</p>
                  </div>

                  {!resultUrl ? (
                    <div className="w-full flex flex-col gap-10">
                       <div 
                          onClick={() => !isAiProcessing && document.getElementById('ai-upload')?.click()}
                          className="h-96 w-full bg-[#0A0A0B] border-2 border-dashed border-white/5 rounded-[80px] flex flex-col items-center justify-center gap-10 cursor-pointer hover:border-[#10b98133] transition-all group shadow-3xl"
                       >
                          {isAiProcessing ? (
                             <div className="flex flex-col items-center gap-6">
                                <Loader2 size={64} className="text-[#10b981] animate-spin" />
                                <p className="text-[10px] font-black text-[#10b981] uppercase tracking-[8px] animate-pulse">Analyzing Waveforms...</p>
                             </div>
                          ) : aiFiles.length > 0 ? (
                             <div className="flex flex-col items-center gap-6">
                                <div className="w-24 h-24 bg-[#10b9811a] rounded-full flex items-center justify-center text-[#10b981] shadow-2xl">
                                   <CheckCircle2 size={48} />
                                </div>
                                <p className="text-3xl font-black text-white uppercase tracking-tighter">{aiFiles.length} Assets Ingested</p>
                                <p className="text-[10px] font-black text-[#404040] uppercase tracking-[4px]">Click to add more media</p>
                             </div>
                          ) : (
                             <div className="flex flex-col items-center gap-6">
                                <div className="w-24 h-24 bg-white/2 rounded-full flex items-center justify-center text-[#404040] group-hover:text-white group-hover:scale-110 transition-all border border-white/5">
                                   <Upload size={40} />
                                </div>
                                <p className="text-[11px] font-black text-[#404040] uppercase tracking-[6px]">Drop Files to Initialize Auto-Pilot</p>
                             </div>
                          )}
                          <input id="ai-upload" type="file" className="hidden" multiple accept="video/*" onChange={handleAiFileUpload} />
                       </div>

                       <button 
                          disabled={aiFiles.length === 0 || isAiProcessing}
                          onClick={startAutoPilot}
                          className={`h-24 w-full rounded-[40px] font-black text-[14px] uppercase tracking-[10px] shadow-3xl transition-all border-none ${aiFiles.length === 0 || isAiProcessing ? 'bg-white/2 text-[#262626] cursor-not-allowed' : 'bg-[#10b981] text-black cursor-pointer hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] hover:scale-[1.02]'}`}
                       >
                          {isAiProcessing ? "Assembling Masterpiece..." : "Initialize Assembly"}
                       </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-12 text-center bg-[#0A0A0B] p-20 rounded-[80px] border border-white/5 shadow-3xl w-full">
                       <div className="w-32 h-32 bg-[#10b9811a] rounded-full flex items-center justify-center text-[#10b981] mb-4 shadow-inner">
                          <CheckCircle2 size={64} />
                       </div>
                       <div className="flex flex-col gap-4">
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Assembly Complete</h3>
                          <p className="text-[11px] text-[#404040] font-black uppercase tracking-[4px]">Neural beats synced. Trending filters applied.</p>
                       </div>
                       <div className="flex flex-col gap-6 w-full max-w-md">
                          <a 
                             href={resultUrl} 
                             download 
                             className="h-24 w-full bg-white text-black rounded-[32px] font-black text-[14px] uppercase tracking-[8px] flex items-center justify-center no-underline hover:shadow-3xl transition-all hover:scale-[1.02]"
                          >
                             Download Final Render
                          </a>
                          <button onClick={() => { setResultUrl(null); setAiFiles([]); }} className="h-16 w-full rounded-[24px] text-[10px] font-black text-[#404040] uppercase tracking-widest hover:text-white transition-colors bg-white/2 border border-white/5">Start New Session</button>
                       </div>
                    </div>
                  )}
               </div>
             )}
          </div>

          {/* Right Inspector */}
          {activeMode === 'manual' && (
             <aside className="w-[400px] border-l border-white/5 flex flex-col bg-[#050505]/50 backdrop-blur-3xl overflow-y-auto no-scrollbar shadow-2xl">
                {/* Tabs */}
                <div className="flex border-b border-white/5 h-16 shrink-0 overflow-x-auto no-scrollbar">
                   {[
                     { id: 'properties', label: 'Props', icon: Settings2 },
                     { id: 'assets', label: 'Assets', icon: Layers },
                     { id: 'ghostwriter', label: 'Ghost', icon: Type },
                     { id: 'avatar', label: 'Avatar', icon: Monitor }
                   ].map(tab => (
                     <button 
                        key={tab.id}
                        onClick={() => setActiveInspectorTab(tab.id as any)}
                        className={`flex-1 min-w-[80px] flex flex-col items-center justify-center gap-1 transition-all ${activeInspectorTab === tab.id ? 'text-white border-b-2 border-white' : 'text-[#404040] hover:text-white/60'}`}
                     >
                        <tab.icon size={14} />
                        <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
                     </button>
                   ))}
                </div>

                <div className="p-10 flex flex-col gap-12">
                {activeInspectorTab === 'properties' ? (
                   <>
                <div>
                   <p className="text-[10px] font-black text-[#404040] uppercase tracking-[5px] mb-10">Neural Intelligence</p>
                   <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-3">
                         <p className="text-[10px] font-black text-white uppercase tracking-widest">Vibe-Cloner (Link Style Analysis)</p>
                         <input 
                           type="text" 
                           placeholder="Paste Viral Video Link..."
                           value={vibeUrl}
                           onChange={(e) => setVibeUrl(e.target.value)}
                           className="w-full h-14 bg-white/2 border border-white/5 rounded-2xl px-6 text-[10px] font-black text-white outline-none focus:border-[#a855f733] transition-all"
                         />
                      </div>
                      
                      <div className="flex items-center justify-between p-6 bg-white/2 rounded-2xl border border-white/5 group hover:border-[#3b82f633] transition-all cursor-pointer" onClick={() => setBrandLocked(!brandLocked)}>
                         <div className="flex items-center gap-4">
                            <Shield size={16} className={brandLocked ? 'text-[#3b82f6] drop-shadow-[0_0_8px_#3b82f6]' : 'text-[#404040]'} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${brandLocked ? 'text-white' : 'text-[#404040]'}`}>Brand Guard™ Locked</span>
                         </div>
                         <div 
                            className={`w-10 h-5 rounded-full relative transition-all duration-300 ${brandLocked ? 'bg-[#3b82f6]' : 'bg-white/5'}`}
                         >
                            <div className={`absolute w-3.5 h-3.5 bg-white rounded-full top-0.75 transition-all duration-300 ${brandLocked ? 'right-0.75' : 'left-0.75'}`} style={{ top: '3px' }} />
                         </div>
                      </div>
                   </div>
                </div>

                <div>
                   <p className="text-[10px] font-black text-[#404040] uppercase tracking-[5px] mb-10">Neural Pro Effects</p>
                   <div className="flex flex-col gap-6">
                      <div className="grid grid-cols-2 gap-4">
                         <div 
                           onClick={() => showToast("Magic Eraser Initialized", "info")}
                           className="p-6 bg-white/2 border border-white/5 rounded-2xl flex flex-col items-center gap-3 hover:border-[#a855f733] hover:shadow-[0_0_15px_#a855f722] transition-all cursor-pointer group"
                         >
                            <Wand2 size={20} className="text-[#a855f7] group-hover:scale-110 transition-transform" />
                            <span className="text-[9px] font-black text-white uppercase tracking-widest text-center">Magic Eraser</span>
                         </div>
                         <div 
                           onClick={() => showToast("Eye Contact Calibration Active", "info")}
                           className="p-6 bg-white/2 border border-white/5 rounded-2xl flex flex-col items-center gap-3 hover:border-[#3b82f633] hover:shadow-[0_0_15px_#3b82f622] transition-all cursor-pointer group"
                         >
                            <Monitor size={20} className="text-[#3b82f6] group-hover:scale-110 transition-transform" />
                            <span className="text-[9px] font-black text-white uppercase tracking-widest text-center">Eye Contact</span>
                         </div>
                      </div>

                      <div className="flex items-center justify-between p-6 bg-white/2 rounded-2xl border border-white/5 group hover:border-[#10b98133] transition-all">
                         <div className="flex items-center gap-4">
                            <Activity size={16} className={faceFollow ? 'text-[#10b981]' : 'text-[#404040]'} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${faceFollow ? 'text-white' : 'text-[#404040]'}`}>Smart Face Follow</span>
                         </div>
                         <div 
                            onClick={() => setFaceFollow(!faceFollow)}
                            className={`w-10 h-5 rounded-full relative transition-all duration-300 cursor-pointer ${faceFollow ? 'bg-[#10b981]' : 'bg-white/5'}`}
                         >
                            <div className={`absolute w-3.5 h-3.5 bg-white rounded-full top-0.75 transition-all duration-300 ${faceFollow ? 'right-0.75' : 'left-0.75'}`} style={{ top: '3px' }} />
                         </div>
                      </div>
                   </div>
                </div>

                <div>
                   <p className="text-[10px] font-black text-[#404040] uppercase tracking-[5px] mb-10">Voice Lab 2.0</p>
                   <div className="flex flex-col gap-8">
                      <div className="flex flex-col gap-4">
                         <p className="text-[10px] font-black text-white uppercase tracking-widest">Regional Dialects</p>
                         <div className="grid grid-cols-2 gap-3">
                            {['Bambaiya', 'Hyderabadi', 'Bihari', 'Standard'].map(d => (
                              <button 
                                key={d}
                                onClick={() => setSelectedDialect(d)}
                                className={`h-10 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border ${selectedDialect === d ? 'bg-white text-black border-white' : 'bg-white/2 text-[#404040] border-white/5'}`}
                              >
                                 {d}
                              </button>
                            ))}
                         </div>
                      </div>
                      <div className="flex flex-col gap-4">
                         <p className="text-[10px] font-black text-white uppercase tracking-widest">Emotional Tone</p>
                         <div className="grid grid-cols-2 gap-3">
                            {['Professional', 'Excited', 'Sarcastic', 'Angry', 'Whisper', 'News'].map(tone => (
                              <button 
                                key={tone}
                                onClick={() => setSelectedTone(tone)}
                                className={`h-10 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border ${selectedTone === tone ? 'bg-[#a855f7] text-white border-[#a855f7] shadow-[0_0_15px_#a855f733]' : 'bg-white/2 text-[#404040] border-white/5 hover:border-white/20'}`}
                              >
                                 {tone}
                              </button>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>

                <div>
                   <p className="text-[10px] font-black text-[#404040] uppercase tracking-[5px] mb-10">Neural Effects</p>
                   <div className="flex flex-col gap-12">
                      <div className="flex flex-col gap-6">
                         <p className="text-[10px] font-black text-white uppercase tracking-widest mb-2">Neural Warp Style</p>
                         <select 
                            value={warpStyle}
                            onChange={(e) => setWarpStyle(e.target.value)}
                            className="w-full h-14 bg-white/2 border border-white/5 rounded-2xl px-6 text-[10px] font-black text-white uppercase tracking-widest outline-none focus:border-[#10b98133] transition-all cursor-pointer appearance-none"
                         >
                            <option>None</option>
                            <option>Cyberpunk</option>
                            <option>Manga</option>
                            <option>Retro 80s</option>
                            <option>Liquid Dream</option>
                         </select>
                      </div>

                      <div className="flex items-center justify-between p-6 bg-white/2 rounded-2xl border border-white/5">
                         <div className="flex items-center gap-4">
                            <Shield size={16} className={watermarkEnabled ? 'text-[#404040]' : 'text-[#10b981]'} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${watermarkEnabled ? 'text-[#404040]' : 'text-white'}`}>Clean Export (No Watermark)</span>
                         </div>
                         <div 
                            onClick={() => setWatermarkEnabled(!watermarkEnabled)}
                            className={`w-10 h-5 rounded-full relative transition-all duration-300 cursor-pointer ${!watermarkEnabled ? 'bg-[#10b981]' : 'bg-white/5'}`}
                         >
                            <div className={`absolute w-3.5 h-3.5 bg-white rounded-full top-0.75 transition-all duration-300 ${!watermarkEnabled ? 'right-0.75' : 'left-0.75'}`} style={{ top: '3px' }} />
                         </div>
                      </div>

                      <div className="p-6 bg-gradient-to-br from-[#a855f71a] to-transparent rounded-2xl border border-[#a855f71a] flex flex-col gap-4">
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2"><Zap size={14} className="text-[#a855f7]" /> Viral Pulse AI</span>
                            <span className="text-xl font-black text-[#a855f7]">{viralScore}%</span>
                         </div>
                         <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-[#a855f7] shadow-[0_0_10px_#a855f7]" style={{ width: `${viralScore}%` }} />
                         </div>
                         <p className="text-[8px] font-bold text-[#404040] uppercase tracking-widest">High scene density detected. Potential for 1M+ views.</p>
                      </div>
                   </div>
                </div>
                </>
                ) : null}

                {activeInspectorTab === 'assets' && (
                  <div className="flex flex-col gap-10">
                     <div>
                        <p className="text-[10px] font-black text-[#404040] uppercase tracking-[5px] mb-8">Asset Categories</p>
                        <div className="grid grid-cols-2 gap-4">
                           {['Stickers', 'Overlays', 'SFX', 'Music'].map(cat => (
                             <div key={cat} className="h-24 bg-white/2 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-[#10b98133] transition-all cursor-pointer group">
                                <Plus size={16} className="text-[#404040] group-hover:text-white" />
                                <span className="text-[9px] font-black text-white uppercase tracking-widest">{cat}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-[#404040] uppercase tracking-[5px] mb-8">Trending Overlays</p>
                        <div className="flex flex-col gap-4">
                           {['Film Grain v2', 'Neural Dust', 'Light Leak 80s'].map(ov => (
                             <div key={ov} className="h-16 px-6 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-white/20 transition-all cursor-move">
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{ov}</span>
                                <Plus size={14} className="text-[#404040]" />
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
                )}

                {activeInspectorTab === 'ghostwriter' && (
                  <div className="flex flex-col gap-10">
                     <div>
                        <p className="text-[10px] font-black text-[#404040] uppercase tracking-[5px] mb-8">AI Metadata Generator</p>
                        <button 
                          onClick={() => showToast("Generating SEO Hook...", "info")}
                          className="w-full h-16 rounded-[24px] bg-[#a855f7] text-white text-[10px] font-black uppercase tracking-widest mb-10 shadow-[0_0_30px_#a855f744]"
                        >
                           Scan Video & Write Copy
                        </button>
                        <div className="flex flex-col gap-6">
                           <div className="p-6 bg-white/2 border border-white/5 rounded-2xl">
                              <p className="text-[9px] font-black text-[#404040] uppercase tracking-widest mb-3">Viral SEO Title</p>
                              <p className="text-[11px] font-bold text-white leading-relaxed">How I Mastered the Titan-X AI Pipeline (Insane Results) 🚀</p>
                           </div>
                           <div className="p-6 bg-white/2 border border-white/5 rounded-2xl">
                              <p className="text-[9px] font-black text-[#404040] uppercase tracking-widest mb-3">IG/TikTok Caption</p>
                              <p className="text-[11px] font-bold text-white leading-relaxed">Stop wasting hours on editing. VoxFlow just changed the game. Check the link in bio for early access. #AI #Editing #Viral</p>
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                {activeInspectorTab === 'avatar' && (
                  <div className="flex flex-col gap-10">
                     <div>
                        <p className="text-[10px] font-black text-[#404040] uppercase tracking-[5px] mb-8">Indian Avatar Studio</p>
                        <div className="grid grid-cols-2 gap-4">
                           {[
                             { name: 'Arjun (Delhi)', role: 'Tech Guru' },
                             { name: 'Priya (Mumbai)', role: 'Lifestyle' },
                             { name: 'Rohan (Bangalore)', role: 'Business' },
                             { name: 'Ananya (Kolkata)', role: 'News' }
                           ].map(av => (
                             <div key={av.name} className="p-5 bg-white/2 border border-white/5 rounded-2xl flex flex-col gap-2 hover:border-[#10b98133] transition-all cursor-pointer group">
                                <div className="w-full aspect-square bg-white/5 rounded-xl flex items-center justify-center">
                                   <Smartphone size={24} className="text-[#404040] group-hover:text-white" />
                                </div>
                                <span className="text-[9px] font-black text-white uppercase tracking-widest">{av.name}</span>
                                <span className="text-[7px] font-black text-[#404040] uppercase tracking-widest">{av.role}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
                )}

                <div className="mt-auto flex flex-col gap-4">
                   <div className="flex items-center justify-between p-5 bg-white/2 rounded-[24px] border border-white/5 group hover:border-[#a855f733] transition-all cursor-pointer" onClick={() => setIsUpscaling(!isUpscaling)}>
                      <div className="flex items-center gap-3">
                         <Zap size={16} className={isUpscaling ? 'text-[#a855f7] drop-shadow-[0_0_8px_#a855f7]' : 'text-[#404040]'} />
                         <span className={`text-[10px] font-black uppercase tracking-widest ${isUpscaling ? 'text-white' : 'text-[#404040]'}`}>Neural 4K Upscaler</span>
                      </div>
                      <div className={`w-8 h-4 rounded-full relative transition-all duration-300 ${isUpscaling ? 'bg-[#a855f7]' : 'bg-white/5'}`}>
                         <div className={`absolute w-2.5 h-2.5 bg-white rounded-full top-0.75 transition-all duration-300 ${isUpscaling ? 'right-0.75' : 'left-0.75'}`} style={{ top: '3px' }} />
                      </div>
                   </div>
                    <button 
                       disabled={isRendering || !videoFile}
                       onClick={() => {
                          if (checkSafety(videoFile || "")) {
                             showToast("Legal: Celebrity Voice Check Active. Ensure you have commercial rights.", "info");
                          }
                          setIsRendering(true);
                       }}
                       className={`h-24 w-full rounded-[32px] font-black text-[12px] uppercase tracking-[8px] shadow-3xl transition-all border-none ${isRendering || !videoFile ? 'bg-white/5 text-[#262626] cursor-not-allowed' : 'bg-white text-black cursor-pointer hover:bg-[#10b981] hover:text-white hover:scale-[1.02] active:scale-95'}`}
                    >
                       {isRendering ? "Finalizing Masterpiece..." : "Export Neural Render"}
                    </button>
                </div>
                </div>
             </aside>
          )}
        </div>
      </div>
    </div>
  );
}
