"use client";

import React, { useState, useEffect } from "react";
import { 
  Scissors, Wand2, Type, Layers, Play, Pause, SkipBack, SkipForward,
  Plus, Minus, Target, Cpu, Activity, Sparkles, ChevronRight, Settings,
  RotateCcw, Download, Save, MousePointer2, Zap, Wind, Eye, Video,
  PlusCircle, Trash2, Image as ImageIcon, Music, Film, FileVideo,
  Volume2, FastForward, Maximize, AlertCircle, Sparkle, Brain, Layout,
  TrendingUp, BarChart3, Radio, MessageSquare, Share2, Music2, GitBranch,
  Smile, User2, ZapOff, Fingerprint, Box, Clock, X, Smartphone, Mic
} from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { toast } from "react-hot-toast";
import apiClient from "@/utils/apiClient";

import { soundEngine } from "@/utils/SoundEngine";
import { executeNeuralTask } from "@/utils/NeuralShield";

interface TimelineClipProps {
   clip: any;
   selectedClipId: string | null;
   onClipClick: (id: string) => void;
   onExtractAudio: (id: string, name: string) => void;
}

const TimelineClip = React.memo(({ clip, selectedClipId, onClipClick, onExtractAudio }: TimelineClipProps) => {
   return (
      <div 
         onClick={() => onClipClick(clip.id)}
         onContextMenu={(e) => {
            e.preventDefault();
            soundEngine.play('processing');
            if (confirm(`Extract Neural Audio from ${clip.name}?`)) {
               onExtractAudio(clip.id, clip.name);
            }
         }}
         style={{ width: `${clip.duration * 2}px` }} 
         className={`rounded-lg flex items-center px-4 text-[8px] font-black uppercase tracking-widest relative transition-all cursor-pointer ${selectedClipId === clip.id ? "bg-[#00e5ff] text-black shadow-[0_0_20px_rgba(0,229,255,0.2)]" : "bg-white/5 border border-white/10 text-zinc-500 hover:bg-white/10"}`}
      >
         <Film size={10} className="mr-2" />
         <span className="truncate">{clip.name}</span>
      </div>
   );
});

TimelineClip.displayName = "TimelineClip";

export default function PrecisionStudio() {
  const { 
    selectedTool, setSelectedTool, creditBalance, 
    deductCredits, videoTracks, setVideoTracks,
    selectedClipId, setSelectedClipId, lipsyncSync, setLipsyncSync,
    audioTracks
  } = useEditorStore();
  
  const [activeTab, setActiveTab] = useState<'Layers' | 'Bin' | 'Color' | 'Nodes'>('Layers');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFaceSwap, setShowFaceSwap] = useState(false);
  const [showExportHub, setShowExportHub] = useState(false);

  const handleToolSwitch = (tool: 'V' | 'C' | 'B' | 'T' | 'P') => {
    soundEngine.play('click');
    setSelectedTool(tool);
    if (tool === 'B') setActiveTab('Nodes');
    else if (tool === 'V') setActiveTab('Layers');
  };

  const handleClipClick = async (clipId: string) => {
    if (selectedTool === 'C') {
      soundEngine.play('cut');
      try {
        await apiClient.post('/api/video/split', { clip_id: clipId, time: 0 }); // Split at start for demo
        toast.success("Razor Cut: Neural Split Executed", { icon: '✂️' });
      } catch (e) {
        toast.error("Razor Alignment Failed");
      }
    } else {
      soundEngine.play('click');
      setSelectedClipId(clipId);
    }
  };

  const handleNeuralCaptions = async () => {
    const task = async () => {
      return await apiClient.post('/api/audio/caption', { video_url: 'mock_url' });
    };

    await executeNeuralTask(
      task,
      "Neural Core: Transcribing & Animating...",
      "Captions Synchronized! (Hormozi Style) ⚡"
    );
  };

  const handleNeuralSFX = async () => {
    const task = async () => {
       return await apiClient.post('/api/audio/enhance', { video_url: 'mock_url' });
    };
    await executeNeuralTask(
       task,
       "Neural SFX: Mapping Soundscape...",
       "Soundscape Synchronized! 🔊"
    );
  };

  const handleStartDubbing = async () => {
    const task = async () => {
       const userStore = (await import("@/store/useUserStore")).useUserStore.getState();
       return await apiClient.post('/api/dub', { 
         video_url: 'mock_url', 
         target_lang: 'Hindi',
         user_email: userStore.user?.email || "anonymous"
       });
    };
    await executeNeuralTask(
       task,
       "Neural Dubbing: Synthesizing Vocals...",
       "Dubbing Synchronized! 🎙️"
    );
  };

  const handleApplyTransition = () => {
     soundEngine.play('snap');
     toast.success("AI: 'Zoom-In' Transition Applied!");
  };

  const selectedClip = videoTracks.flatMap(t => t.clips).find(c => c.id === selectedClipId);

  return (
    <div className={`flex h-full w-full bg-[#000000] gap-4 md:gap-6 overflow-hidden p-2 transition-all ${selectedTool === 'C' ? 'cursor-knife' : 'cursor-default'}`}>
      
      {/* LEFT TOOLBAR */}
      <aside className="hidden md:flex w-20 bg-[#0c0c0d] border border-white/10 rounded-[40px] flex-col items-center py-10 gap-8 shadow-3xl shrink-0">
         {( [
           { id: 'V', icon: <MousePointer2 size={22} />, label: 'Selection' },
           { id: 'C', icon: <Scissors size={22} />, label: 'Razor' },
           { id: 'B', icon: <GitBranch size={22} />, label: 'Nodes' },
           { id: 'T', icon: <Type size={22} />, label: 'Text' },
           { id: 'P', icon: <Sparkles size={22} />, label: 'AI FX' },
         ] as const).map(tool => (
            <button 
              key={tool.id}
              onClick={() => handleToolSwitch(tool.id)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                (selectedTool === tool.id)
                ? "bg-[#00e5ff] text-black shadow-[0_0_30px_rgba(0,229,255,0.4)] scale-110" 
                : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tool.icon}
            </button>
         ))}
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col gap-4 md:gap-6 min-w-0">
         {/* MONITOR */}
         <div className="flex-1 bg-[#0c0c0d] border border-white/10 rounded-[40px] md:rounded-[56px] relative overflow-hidden group shadow-inner flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
            
            {activeTab === 'Nodes' ? (
               <div className="w-full h-full p-10 flex flex-col gap-10 animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex justify-between items-center text-white">
                     <h3 className="text-2xl font-black uppercase tracking-tighter italic">Pro-Node Master</h3>
                  </div>
                  <div className="flex-1 border border-dashed border-white/5 rounded-[48px] bg-black/40 flex items-center justify-center">
                     <Cpu size={64} className="text-zinc-900" />
                  </div>
               </div>
            ) : (
               <div className="w-full h-full flex flex-col items-center justify-center group/play relative">
                  <div className="absolute top-10 left-10 flex flex-col gap-2">
                     <div className="px-4 py-2 bg-black/60 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md">REC 4K PRORES 422</div>
                  </div>
                  <Play size={80} className="text-white/5 group-hover/play:text-[#00e5ff] transition-all cursor-pointer group-hover/play:scale-110" />
               </div>
            )}
         </div>

         {/* TIMELINE */}
         <div className="h-[300px] md:h-[350px] bg-[#0c0c0d] border border-white/10 rounded-[40px] md:rounded-[56px] p-6 md:p-8 flex flex-col gap-6 shadow-2xl overflow-hidden relative">
            <div className="flex justify-between items-center px-4">
               <div className="flex items-center gap-6">
                  <p className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest">Titan-X Master Timeline</p>
                  <div className="flex items-center gap-2">
                     <Clock size={12} className="text-[#00e5ff]" />
                     <span className="text-[10px] font-mono text-zinc-500">00:00:45:12</span>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <button 
                     onClick={() => {
                        soundEngine.play('click');
                        toast.success("Magnetic Snapping: ENABLED");
                     }} 
                     className="p-2 bg-white/5 border border-white/10 rounded-lg text-[#f59e0b] hover:bg-[#f59e0b] hover:text-black transition-all shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                     title="Magnetic Snapping"
                  >
                     <Zap size={14} />
                  </button>
                  <button 
                     onClick={handleNeuralSFX}
                     className="flex items-center gap-3 px-6 py-2 bg-white/5 border border-[#00e5ff33] rounded-full text-[#00e5ff] hover:bg-[#00e5ff11] transition-all"
                  >
                     <Radio size={14} />
                     <span className="text-[9px] font-black uppercase tracking-widest">Neural SFX</span>
                  </button>
                  <button onClick={handleNeuralCaptions} className="flex items-center gap-3 px-6 py-2 bg-[#00e5ff] text-black rounded-full shadow-[0_0_20px_#00e5ff33] hover:scale-105 transition-all">
                     <Type size={14} />
                     <span className="text-[9px] font-black uppercase tracking-widest">Neural Captions</span>
                  </button>
                  <button onClick={() => setShowFaceSwap(true)} className="flex items-center gap-3 px-6 py-2 bg-[#a855f7]/10 border border-[#a855f7]/30 rounded-full text-[#a855f7] hover:bg-[#a855f7] hover:text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                     <Smile size={14} />
                     <span className="text-[9px] font-black uppercase tracking-widest">Face Sync</span>
                  </button>
               </div>
            </div>

            <div className="flex-1 bg-black/40 border border-white/5 rounded-[32px] overflow-hidden relative p-4 flex flex-col gap-3 overflow-y-auto no-scrollbar">
               <div className="absolute top-0 left-1/3 h-full w-[2px] bg-[#00e5ff] shadow-[0_0_15px_#00e5ff] z-10 pointer-events-none"></div>
               
               {/* Video Tracks */}
               {videoTracks.map(track => (
                  <div key={track.id} className="flex gap-2 items-center min-h-[50px]">
                     <div className="w-12 text-[8px] font-black text-zinc-500 uppercase">{track.id}</div>
                     <div className="flex-1 flex gap-2 h-12 relative">
                        {track.clips.map((clip, i) => (
                           <React.Fragment key={clip.id}>
                              <TimelineClip 
                                 clip={clip} 
                                 selectedClipId={selectedClipId} 
                                 onClipClick={handleClipClick}
                              onExtractAudio={async (id) => {
                                    try {
                                       await apiClient.post('/api/media/extract', { 
                                    clip_id: id, 
                                    video_url: 'mock',
                                    email: useUserStore.getState().user?.email || "anonymous" 
                                 });
                                       useEditorStore.getState().extractAudioFromClip(id);
                                       toast.success("Magic Strip: Audio Extracted");
                                    } catch (e) {
                                       toast.error("Audio Extraction Failed");
                                    }
                                 }}
                              />
                              {/* AI Transition Button */}
                              {i < track.clips.length - 1 && (
                                 <button 
                                    onClick={handleApplyTransition}
                                    className="w-6 h-6 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#00e5ff] hover:text-black transition-all z-20 -mx-3"
                                 >
                                    <Sparkles size={10} />
                                 </button>
                              )}
                           </React.Fragment>
                        ))}
                     </div>
                  </div>
               ))}

               {/* Audio Tracks with Waveforms */}
               {audioTracks.map(track => (
                  <div key={track.id} className="flex gap-2 items-center min-h-[40px] mt-2 border-t border-white/2 pt-2">
                     <div className="w-12 text-[8px] font-black text-zinc-500 uppercase">{track.id}</div>
                     <div className="flex-1 flex gap-2 h-10 relative">
                        {track.clips.map(clip => (
                           <div 
                              key={clip.id} 
                              style={{ width: `${clip.duration * 2}px` }} 
                              className="bg-[#10b98111] border border-[#10b98133] rounded-lg flex items-center px-4 text-[7px] font-black text-[#10b981] uppercase tracking-tighter relative overflow-hidden group"
                           >
                              <Music size={10} className="mr-2 relative z-10" />
                              <span className="truncate relative z-10">{clip.name}</span>
                              <div className="absolute inset-0 flex items-center justify-around px-2 opacity-30">
                                 {[...Array(20)].map((_, i) => (
                                    <div key={i} className="w-[1px] bg-[#10b981]" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
                                 ))}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* RIGHT INSPECTOR */}
      <aside className="hidden xl:flex w-[400px] bg-[#0c0c0d] border border-white/10 rounded-[56px] p-8 flex flex-col gap-10 shadow-3xl shrink-0 overflow-hidden">
         <div className="flex bg-black/50 p-2 rounded-3xl border border-white/5">
            {['Layers', 'Bin', 'Color', 'Nodes'].map(tab => (
               <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-2xl transition-all ${activeTab === tab ? "bg-white/5 text-white" : "text-zinc-400 hover:text-white"}`}>
                  {tab}
               </button>
            ))}
         </div>

         {/* COLOR TAB (LUTs) */}
         {activeTab === 'Color' && (
            <div className="flex-1 flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 overflow-hidden">
               <div className="flex flex-col gap-2">
                  <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">Cinematic LUTs</h4>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Neural Color Grading</p>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  {[
                     { name: 'STARBOY', color: '#ff3b3b' },
                     { name: 'CYBERPUNK', color: '#00e5ff' },
                     { name: 'BOLLYWOOD', color: '#f59e0b' },
                     { name: 'VINTAGE', color: '#a855f7' },
                  ].map(lut => (
                     <div key={lut.name} onClick={() => { soundEngine.play('click'); toast.success(`${lut.name} LUT Applied!`); }} className="aspect-video bg-white/2 border border-white/5 rounded-3xl p-6 flex flex-col justify-end gap-2 group cursor-pointer hover:border-[#00e5ff33] transition-all relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-all" style={{ backgroundColor: lut.color }}></div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest relative z-10">{lut.name}</span>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {/* AI FX TAB */}
         {activeTab === 'Nodes' && (
            <div className="flex-1 flex flex-col gap-10 animate-in fade-in slide-in-from-right-4 duration-500 overflow-hidden">
               <div className="flex flex-col gap-2">
                  <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">Neural FX HUD</h4>
                  <p className="text-[9px] font-black text-[#00e5ff] uppercase tracking-widest italic">LPU Orchestration Active</p>
               </div>
               
               <div className="flex flex-col gap-4">
                  {[
                     { name: '4K Neural Upscale', icon: <Sparkles size={16} />, endpoint: '/api/design/upscale' },
                     { name: 'Background Neuralizer', icon: <Box size={16} />, endpoint: '/api/design/upscale' },
                     { name: 'Voice Clone Match', icon: <Mic size={16} />, endpoint: '/api/audio/dubbing' },
                     { name: 'Dynamic Frame Expand', icon: <Maximize size={16} />, endpoint: '/api/design/upscale' },
                  ].map(fx => (
                     <div 
                        key={fx.name} 
                        onClick={async () => {
                           const task = async () => await apiClient.post(fx.endpoint, { video_url: 'mock' });
                           await executeNeuralTask(task, `Orchestrating ${fx.name}...`, `${fx.name} Active!`);
                        }}
                        className="p-6 bg-white/2 border border-white/5 rounded-3xl flex items-center justify-between group hover:border-[#00e5ff33] transition-all cursor-pointer"
                     >
                        <div className="flex items-center gap-4 text-zinc-400 group-hover:text-white transition-all">
                           {fx.icon}
                           <span className="text-[10px] font-black uppercase tracking-widest">{fx.name}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {activeTab === 'Layers' && selectedClip && (
            <div className="flex-1 flex flex-col gap-10 animate-in fade-in slide-in-from-right-4 duration-500 overflow-hidden">
               <div className="flex flex-col gap-2">
                  <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">Properties</h4>
                  <p className="text-[9px] font-black text-[#00e5ff] uppercase tracking-widest italic">{selectedClip.name}</p>
               </div>
               <div className="bg-white/2 border border-white/5 rounded-3xl p-6 flex flex-col gap-8">
                  <div className="flex flex-col gap-4">
                     <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Transform</span>
                     <div className="flex justify-between items-center text-[10px] uppercase">
                        <span className="text-zinc-500">Scale</span>
                        <span className="text-white">100%</span>
                     </div>
                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#00e5ff]" style={{ width: '100%' }}></div>
                     </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                     <button 
                        onClick={() => {
                           if (selectedClip) {
                              const task = async () => {
                                 await apiClient.post('/api/media/extract', { 
                                    clip_id: selectedClip.id, 
                                    video_url: 'mock',
                                    email: useUserStore.getState().user?.email 
                                 });
                                 useEditorStore.getState().extractAudioFromClip(selectedClip.id);
                              };
                              executeNeuralTask(task, "Neural Core: Extracting Audio...", "Audio Strip Synchronized! 🎙️");
                           }
                        }}
                        className="h-14 bg-white/5 border border-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                     >
                        <Volume2 size={14} className="text-[#00e5ff]" />
                        Extract Neural Audio
                     </button>

                     <button 
                        onClick={handleStartDubbing}
                        className="h-14 bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-[#00e5ff] hover:text-black transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,229,255,0.1)]"
                     >
                        <Mic size={14} />
                        Start Neural Dubbing
                     </button>
                  </div>
               </div>
            </div>
         )}

         <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-6">
             <button 
                onClick={() => { soundEngine.play('success'); setShowExportHub(true); }}
                className="h-16 bg-[#10b981] text-black text-[11px] font-black uppercase rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all"
             >
                <Download size={18} />
                Final Master Export
             </button>
         </div>
      </aside>

      {/* EXPORT HUB MODAL */}
      {showExportHub && (
         <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 animate-in fade-in duration-500">
            <div className="w-full max-w-2xl bg-[#0A0A0B] border border-white/10 rounded-[64px] p-12 flex flex-col gap-10 shadow-3xl relative">
               <button onClick={() => setShowExportHub(false)} className="absolute top-10 right-10 text-zinc-700 hover:text-white transition-all"><X size={32} /></button>
               <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-[#00e5ff] uppercase tracking-[6px]">Master Export Hub</span>
                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Render Engine</h3>
                  <div className="grid grid-cols-3 gap-6">
                   {[
                      { id: 'reel', name: 'Instagram Reel', icon: <Smartphone size={24} />, res: '1080x1920' },
                      { id: '4k', name: 'YouTube 4K', icon: <Video size={24} />, res: '3840x2160' },
                      { id: 'raw', name: 'Raw Master', icon: <Cpu size={24} />, res: 'Original' }
                   ].map(format => (
                      <div 
                         key={format.name} 
                         onClick={async () => {
                            const task = async () => {
                               const userStore = (await import("@/store/useUserStore")).useUserStore.getState();
                               return await apiClient.post('/api/admin/credits', { 
                                  email: userStore.user?.email, 
                                  amount: 15.0, 
                                  action: 'deduct' 
                               });
                            };
                            const success = await executeNeuralTask(task, "Authorizing Master Export...", "Credits Synchronized! Rendering Started.");
                            if (success) {
                               setShowExportHub(false);
                               toast.success(`Master Render Dispatched: ${format.name}`);
                            }
                         }}
                         className="p-8 bg-white/2 border border-white/5 rounded-3xl flex flex-col items-center gap-4 group cursor-pointer hover:border-[#10b98133] hover:bg-[#10b98105] transition-all"
                      >
                         <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-zinc-700 group-hover:text-[#10b981] transition-all">{format.icon}</div>
                         <div className="text-center">
                            <p className="text-[10px] font-black text-white uppercase tracking-tighter">{format.name}</p>
                            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">{format.res}</p>
                         </div>
                      </div>
                   ))}
                </div>
               </div>
               <div className="flex flex-col gap-6">
                  <button 
                     onClick={() => {
                        soundEngine.play('processing');
                        toast.success("Titan-X Job Created: JOB-812Z. Background rendering active.");
                        setShowExportHub(false);
                     }}
                     className="h-20 bg-[#00e5ff] text-black text-[12px] font-black uppercase rounded-[24px] shadow-[0_0_50px_rgba(0,229,255,0.2)] flex flex-col items-center justify-center gap-1 group overflow-hidden relative"
                  >
                     <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                     <span className="relative z-10">Start Cloud Background Render</span>
                     <span className="text-[8px] font-bold opacity-40 relative z-10">Notify via Titan-X Bridge on completion</span>
                  </button>
                  <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[4px] text-center italic">Processing on 8x NVIDIA H100 Cluster</p>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
