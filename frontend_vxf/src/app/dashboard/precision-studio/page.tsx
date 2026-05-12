"use client";

import React, { useState, useEffect } from 'react';
import { 
  Film, Monitor, Smartphone, Square, Scissors, 
  Play, Pause, SkipBack, SkipForward, Layers, 
  Settings2, Wand2, Plus, Music, ChevronRight,
  Type, Image as ImageIcon, Volume2, Trash2, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/Toast';
import { soundEngine } from '@/utils/SoundEngine';

const BASE_URL = "http://127.0.0.1:5000";

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
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:12:45');
  const [activeLayers, setActiveLayers] = useState(['VFX_Core', 'Audio_Master']);
  
  const [tracks, setTracks] = useState<Track[]>([
    { id: 't1', name: 'Master Video', type: 'video', color: '#10b981', width: '80%', offset: '0%' },
    { id: 't2', name: 'Neural Dub', type: 'audio', color: '#3b82f6', width: '70%', offset: '10%' },
    { id: 't3', name: 'Smart Captions', type: 'overlay', color: '#a855f7', width: '60%', offset: '15%' },
  ]);

  const handleAspectRatioChange = (ratio: string) => {
    console.log(`[Precision Studio] Changing aspect ratio to: ${ratio}`);
    setAspectRatio(ratio);
    soundEngine?.play("click");
  };

  const handleTogglePlayback = () => {
    console.log(`[Precision Studio] Playback ${!isPlaying ? 'Started' : 'Paused'}`);
    setIsPlaying(!isPlaying);
    soundEngine?.play("click");
  };

  const handleInitializeRender = async () => {
    console.log("[Precision Studio] Initializing Global Render Sequence...");
    setIsRendering(true);
    showToast("Initializing Neural Render Engine...", "info");
    soundEngine?.play("process");

    try {
      const url = `${BASE_URL}/api/edit`;
      console.log('Bhai, request ja rahi hai to:', url);
      console.log('Sending request to Backend...');
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          project_id: `studio_${Date.now()}`,
          config: {
            aspect_ratio: aspectRatio,
            layers: activeLayers,
            tracks: tracks
          }
        }),
      });

      if (!response.ok) throw new Error("Render initialization failed");

      showToast("Render Orchestration Started", "success");
      
      // Simulate render time
      setTimeout(() => {
        setIsRendering(false);
        showToast("Render Complete! Syncing to Vault.", "success");
        soundEngine?.play("success");
      }, 4000);

    } catch (error) {
      console.error("[Precision Studio] Render Crash:", error);
      showToast("Render Engine Failure", "error");
    } finally {
      setIsRendering(false);
    }
  };

  const handleToggleLayer = (layer: string) => {
    console.log(`[Precision Studio] Toggling layer: ${layer}`);
    setActiveLayers(prev => 
      prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
    );
    soundEngine?.play("click");
  };

  const handleTrim = () => {
    console.log("[Precision Studio] Triggering Trim Logic at current playhead");
    showToast("Segment Trimmed", "info");
    soundEngine?.play("click");
  };

  const handleSplit = () => {
    console.log("[Precision Studio] Triggering Split Logic at current playhead");
    showToast("Track Split Successfully", "info");
    soundEngine?.play("click");
  };

  return (
    <div className="flex flex-col gap-8 lg:gap-12 pb-24 lg:pb-20">
       
       {/* Header */}
       <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 lg:gap-12">
             <div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-white m-0 leading-none">
                   Precision <span className="text-[#10b981]">Studio</span>
                </h1>
                <p className="text-[10px] font-black text-[#404040] uppercase tracking-[4px] mt-4 flex items-center gap-2">
                   <Layers className="text-[#10b981]" size={14} /> Neural Render Engine v4.2 PRO
                </p>
             </div>
             <div className="hidden lg:block w-px h-16 bg-white/5" />
             <div className="flex bg-white/2 p-1.5 rounded-2xl border border-white/5">
                {[Monitor, Smartphone, Square].map((Icon, i) => {
                  const ratio = i === 0 ? '16:9' : i === 1 ? '9:16' : '1:1';
                  return (
                    <button 
                      key={i} 
                      onClick={() => handleAspectRatioChange(ratio)}
                      className={`p-3 lg:p-4 rounded-xl transition-all border-none cursor-pointer ${aspectRatio === ratio ? 'bg-white text-black shadow-lg' : 'bg-transparent text-[#404040] hover:text-white/40'}`}
                    >
                      <Icon size={18} />
                    </button>
                  );
                })}
             </div>
          </div>
          <button 
            disabled={isRendering}
            onClick={handleInitializeRender}
            className={`h-14 lg:h-16 px-10 lg:px-14 font-black rounded-2xl text-[11px] uppercase tracking-[4px] border-none shadow-2xl active:scale-95 transition-all w-full md:w-auto ${isRendering ? 'bg-white/5 text-[#404040] cursor-not-allowed' : 'bg-[#10b981] text-black cursor-pointer shadow-[0_20px_40px_rgba(16,185,129,0.2)]'}`}
          >
             {isRendering ? (
               <div className="flex items-center gap-3">
                  <Loader2 size={16} className="animate-spin" />
                  RENDERING
               </div>
             ) : "Initialize Render"}
          </button>
       </header>

       {/* Editor Layout */}
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Main Monitor Area */}
          <div className="lg:col-span-8 flex flex-col gap-8 lg:gap-10">
             <div 
               className="bg-black rounded-[48px] border border-white/5 overflow-hidden relative mx-auto w-full shadow-2xl transition-all duration-500 group"
               style={{ 
                 aspectRatio: aspectRatio === '16:9' ? '16/9' : aspectRatio === '9:16' ? '9/16' : '1/1', 
                 maxHeight: '600px'
               }}
             >
                <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s]" />
                
                {/* Transport Controls */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 p-4 lg:p-5 bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/10 flex items-center gap-6 lg:gap-10 shadow-2xl">
                   <SkipBack size={20} className="text-white cursor-pointer active:scale-75 transition-transform hover:text-[#10b981]" onClick={() => console.log("[Precision Studio] Seek Back")} />
                   <button 
                    onClick={handleTogglePlayback} 
                    className="w-12 h-12 lg:w-14 lg:h-14 bg-white rounded-full flex items-center justify-center cursor-pointer border-none shadow-xl active:scale-90 transition-transform hover:bg-[#10b981]"
                   >
                      {isPlaying ? <Pause size={24} className="text-black" fill="black" /> : <Play size={24} className="text-black translate-x-0.5" fill="black" />}
                   </button>
                   <SkipForward size={20} className="text-white cursor-pointer active:scale-75 transition-transform hover:text-[#10b981]" onClick={() => console.log("[Precision Studio] Seek Forward")} />
                </div>
             </div>

             {/* Multi-Track Timeline */}
             <div className="p-8 lg:p-10 bg-[#0A0A0B] rounded-[48px] border border-white/5 shadow-2xl flex flex-col gap-8">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-6">
                      <p className="text-[10px] font-black text-[#404040] uppercase tracking-[4px]">Precision Timeline</p>
                      <div className="flex items-center gap-3 bg-white/2 p-2 rounded-xl border border-white/5">
                         <button onClick={handleTrim} className="p-2 text-[#404040] hover:text-white transition-colors border-none bg-transparent cursor-pointer" title="Trim">
                            <Scissors size={18} />
                         </button>
                         <button onClick={handleSplit} className="p-2 text-[#404040] hover:text-white transition-colors border-none bg-transparent cursor-pointer" title="Split">
                            <Layers size={18} />
                         </button>
                      </div>
                   </div>
                   <p className="text-lg lg:text-xl font-black text-[#10b981] font-mono tracking-tighter">{currentTime}</p>
                </div>

                <div className="flex flex-col gap-4">
                   {tracks.map((track) => (
                     <div key={track.id} className="flex items-center gap-6 group">
                        <div className="w-24 shrink-0 text-[10px] font-black text-[#404040] uppercase tracking-widest group-hover:text-white transition-colors">
                           {track.name}
                        </div>
                        <div className="flex-1 h-12 lg:h-14 bg-white/2 rounded-2xl border border-white/5 relative overflow-hidden">
                           <div 
                             className="absolute h-full rounded-xl transition-all duration-700 opacity-20 border-r-2"
                             style={{ 
                               width: track.width, 
                               left: track.offset, 
                               backgroundColor: track.color,
                               borderColor: track.color
                             }}
                           />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Right Sidebar Inspector */}
          <div className="lg:col-span-4 flex flex-col gap-8 lg:gap-10">
             <div className="p-8 lg:p-10 bg-[#0A0A0B] rounded-[48px] border border-white/5 flex-1 shadow-2xl">
                <h3 className="text-xl lg:text-2xl font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-3">
                   <Settings2 size={24} className="text-[#10b981]" /> Inspector
                </h3>
                
                <div className="flex flex-col gap-10">
                   {/* Layer Management */}
                   <div className="flex flex-col gap-4">
                      <p className="text-[10px] font-black text-[#404040] uppercase tracking-widest pl-2">Track Types</p>
                      <div className="grid grid-cols-2 gap-4">
                         {[
                           { id: 'video', name: 'Video', icon: <Film size={16} /> },
                           { id: 'audio', name: 'Audio', icon: <Volume2 size={16} /> },
                           { id: 'text', name: 'Captions', icon: <Type size={16} /> },
                           { id: 'asset', name: 'Asset', icon: <ImageIcon size={16} /> }
                         ].map(type => (
                           <div key={type.id} className="p-4 bg-white/2 border border-white/5 rounded-2xl flex flex-col items-center gap-2 hover:border-white/10 transition-all cursor-pointer">
                              <div className="text-[#404040]">{type.icon}</div>
                              <span className="text-[9px] font-black text-white uppercase tracking-widest">{type.name}</span>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* Neural Layers Toggles */}
                   <div className="flex flex-col gap-4">
                      <p className="text-[10px] font-black text-[#404040] uppercase tracking-widest pl-2">Neural Overlays</p>
                      <div className="flex flex-col gap-4">
                        {[
                          { id: 'VFX_Core', name: 'Neural Warp', icon: <Wand2 size={16} />, color: '#10b981' },
                          { id: 'Audio_Master', name: 'Ambience AI', icon: <Music size={16} />, color: '#3b82f6' }
                        ].map(layer => {
                          const isActive = activeLayers.includes(layer.id);
                          return (
                            <div 
                              key={layer.id} 
                              onClick={() => handleToggleLayer(layer.id)}
                              className={`flex items-center justify-between p-5 lg:p-6 rounded-2xl border transition-all cursor-pointer active:scale-95 ${isActive ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5'}`}
                            >
                               <div className="flex items-center gap-4">
                                  <div style={{ color: isActive ? layer.color : '#404040' }}>{layer.icon}</div>
                                  <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-white' : 'text-[#404040]'}`}>{layer.name}</span>
                               </div>
                               <div className={`w-10 h-5 rounded-full relative transition-all duration-300 ${isActive ? 'bg-[#10b981]' : 'bg-[#1a1a1a]'}`}>
                                  <div className={`absolute w-3.5 h-3.5 bg-white rounded-full top-0.75 transition-all duration-300 ${isActive ? 'right-0.75' : 'left-0.75'}`} style={{ top: '3px' }} />
                               </div>
                            </div>
                          );
                        })}
                      </div>
                   </div>
                </div>
             </div>

             {/* Smart Composition Action */}
             <div 
              onClick={() => { console.log("[Precision Studio] Smart Composition triggered"); showToast("Optimizing Scene Graph...", "info"); }}
              className="p-8 lg:p-10 bg-gradient-to-br from-[#3b82f61a] to-transparent border border-[#3b82f633] rounded-[48px] cursor-pointer hover:bg-[#3b82f615] active:scale-95 transition-all shadow-xl group"
             >
                <Plus className="text-[#3b82f6] mb-6 group-hover:rotate-90 transition-transform" size={32} />
                <h4 className="text-xl lg:text-2xl font-black text-white uppercase tracking-tighter leading-none">Add Track</h4>
                <p className="text-[10px] text-[#404040] font-black uppercase tracking-widest mt-4">Expand Creative Space.</p>
             </div>
          </div>
       </div>
    </div>
  );
}
