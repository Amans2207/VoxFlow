"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Scissors, Layers, Play, Pause, SkipBack, SkipForward, 
  Upload, CheckCircle2, Loader2, Monitor, Smartphone, 
  Square, Settings2, Plus, Volume2, Type, Film, Image as ImageIcon,
  Wand2, Music, Mic, Power, Star, Download, Layout
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useSound } from "@/hooks/useSound";
import { signout } from "@/app/actions/auth";

interface Track {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'overlay';
  color: string;
  width: string;
  offset: string;
}

export default function PrecisionStudio() {
  const { showToast } = useToast();
  const soundEngine = useSound();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [activeMode, setActiveMode] = useState<'manual' | 'ai'>('manual');
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('Normal');
  const [intensity, setIntensity] = useState<number>(85);
  const [aiFiles, setAiFiles] = useState<string[]>([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  const [tracks, setTracks] = useState<Track[]>([
    { id: 't1', name: 'Primary Video', type: 'video', color: '#10b981', width: '80%', offset: '0%' },
    { id: 't2', name: 'Background Audio', type: 'audio', color: '#3b82f6', width: '100%', offset: '0%' },
    { id: 't3', name: 'Neural Overlays', type: 'overlay', color: '#a855f7', width: '40%', offset: '10%' }
  ]);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:5000";

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setVideoFile(localUrl);
    showToast("Source Media Ingested", "success");
    soundEngine?.play("success");

    // Also upload to server for processing
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      console.log("Server Upload Success:", data.url);
    } catch (err) {
      console.error("Upload Error:", err);
    }
  };

  const handleAiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setIsAiProcessing(true);
    showToast(`Ingesting ${files.length} Assets...`, "info");
    try {
      const urls = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: fd });
        const data = await res.json();
        urls.push(data.url);
      }
      setAiFiles(prev => [...prev, ...urls]);
      showToast("Media Ready for Auto-Pilot", "success");
      soundEngine?.play("success");
    } catch (err) {
      showToast("Upload Failed", "error");
    } finally {
      setIsAiProcessing(false);
    }
  };

  const startAutoPilot = async () => {
    setIsAiProcessing(true);
    showToast("Neural Auto-Pilot Initialized", "info");
    soundEngine?.play("process");
    try {
      const res = await fetch(`${API_BASE}/api/studio/auto-pilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_urls: aiFiles })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setTimeout(() => {
          setResultUrl(`${API_BASE}/exports/demo_viral_clip.mp4`);
          setIsAiProcessing(false);
          showToast("AI Assembly Complete", "success");
          soundEngine?.play("success");
        }, 5000);
      }
    } catch (err) {
      showToast("Assembly Failed", "error");
      setIsAiProcessing(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
      soundEngine?.play("click");
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#050505] text-white overflow-hidden font-sans">
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
           </div>

           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white/2 px-4 h-12 rounded-2xl border border-white/5">
                 <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#404040]">Neural Engine Online</span>
              </div>
              <button 
                onClick={() => signout()}
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
                  <div className="min-h-[500px] bg-[#0A0A0B] rounded-[64px] border border-white/5 relative overflow-hidden group shadow-2xl flex items-center justify-center">
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
                           <button className="h-14 px-8 rounded-2xl bg-white/2 text-[10px] font-black uppercase tracking-widest text-[#404040] hover:text-white transition-all border border-white/5 flex items-center gap-3">
                              <Scissors size={16} /> Split
                           </button>
                           <button className="h-14 px-8 rounded-2xl bg-white/2 text-[10px] font-black uppercase tracking-widest text-[#404040] hover:text-white transition-all border border-white/5 flex items-center gap-3">
                              <Layers size={16} /> Trim
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

          {/* Right Inspector - Only for Manual Mode */}
          {activeMode === 'manual' && (
             <aside className="w-[400px] border-l border-white/5 flex flex-col p-12 gap-12 bg-[#050505]/50 backdrop-blur-3xl overflow-y-auto no-scrollbar shadow-2xl">
                <div>
                   <p className="text-[10px] font-black text-[#404040] uppercase tracking-[5px] mb-10">Neural Properties</p>
                   <div className="flex flex-col gap-12">
                      <div className="flex flex-col gap-8">
                         <div className="flex justify-between items-center">
                            <p className="text-[11px] font-black text-white uppercase tracking-widest">Neural Warp</p>
                            <p className="text-[11px] font-black text-[#10b981] font-mono">{intensity}%</p>
                         </div>
                         <div className="relative pt-1">
                            <input 
                               type="range" 
                               min="0" max="100" 
                               value={intensity}
                               onChange={(e) => setIntensity(parseInt(e.target.value))}
                               className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#10b981]" 
                            />
                            <div className="absolute top-0 h-1.5 bg-[#10b98133] rounded-full pointer-events-none" style={{ width: `${intensity}%` }}></div>
                         </div>
                      </div>
                      <div className="flex flex-col gap-8">
                         <div className="flex justify-between items-center">
                            <p className="text-[11px] font-black text-white uppercase tracking-widest">Ambience AI</p>
                            <p className="text-[11px] font-black text-[#404040] font-mono">42%</p>
                         </div>
                         <input type="range" className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-white/10" />
                      </div>
                      <div className="flex flex-col gap-8">
                         <div className="flex justify-between items-center">
                            <p className="text-[11px] font-black text-white uppercase tracking-widest">Grain Density</p>
                            <p className="text-[11px] font-black text-[#404040] font-mono">12%</p>
                         </div>
                         <input type="range" className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-white/10" />
                      </div>
                   </div>
                </div>

                <div>
                   <p className="text-[10px] font-black text-[#404040] uppercase tracking-[5px] mb-10">Transitions</p>
                   <div className="grid grid-cols-1 gap-4">
                      {['Neural Wipe', 'Cross Bloom', 'Hard Pulse', 'Cyber-Slide'].map(t => (
                        <button key={t} className="h-16 px-8 rounded-2xl bg-white/2 border border-white/5 text-[10px] font-black text-[#404040] uppercase tracking-widest hover:text-white hover:border-white/20 transition-all text-left flex items-center justify-between group">
                           {t}
                           <div className="w-2 h-2 rounded-full bg-white/5 group-hover:bg-[#10b981]"></div>
                        </button>
                      ))}
                   </div>
                </div>

                <div className="mt-auto">
                   <button 
                      disabled={isRendering || !videoFile}
                      onClick={() => setIsRendering(true)}
                      className={`h-24 w-full rounded-[32px] font-black text-[12px] uppercase tracking-[8px] shadow-3xl transition-all border-none ${isRendering || !videoFile ? 'bg-white/5 text-[#262626] cursor-not-allowed' : 'bg-white text-black cursor-pointer hover:bg-[#10b981] hover:text-white hover:scale-[1.02]'}`}
                   >
                      {isRendering ? "Finalizing Masterpiece..." : "Export Neural Render"}
                   </button>
                </div>
             </aside>
          )}
        </div>
      </div>
    </div>
  );
}
