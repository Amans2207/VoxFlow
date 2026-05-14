"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, Volume2, 
  Settings2, Eye, EyeOff, Lock, Unlock,
  Plus, Trash2, Video, Music, Type, Scissors
} from 'lucide-react';

interface Layer {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'text';
  start: number;
  duration: number;
  color: string;
}

interface TimelineProps {
  duration: number;
  currentTime: number;
  layers: Layer[];
  onTimeChange: (time: number) => void;
  onLayerUpdate: (layers: Layer[]) => void;
}

export default function Timeline({ duration, currentTime, layers, onTimeChange, onLayerUpdate }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newTime = (x / rect.width) * duration;
    onTimeChange(Math.max(0, Math.min(newTime, duration)));
  };

  const handleLayerDrag = (id: string, newStart: number) => {
    const updatedLayers = layers.map(l => 
      l.id === id ? { ...l, start: Math.max(0, newStart) } : l
    );
    onLayerUpdate(updatedLayers);
  };

  return (
    <div className="h-full flex flex-col bg-[#050505] border-t border-white/5">
      {/* RULER / HEADER */}
      <div className="h-10 bg-[#0A0A0B] border-b border-white/5 flex items-center px-4">
         <div className="w-48 shrink-0 flex items-center gap-4">
            <span className="text-[10px] font-black text-blue-500 italic tracking-widest">
               {currentTime.toFixed(2)}s
            </span>
         </div>
         <div 
           ref={timelineRef}
           onClick={handleTimelineClick}
           className="flex-1 h-full relative cursor-pointer group"
         >
            {/* Seconds Markers */}
            {Array.from({ length: Math.ceil(duration) }).map((_, i) => (
               <div 
                 key={i} 
                 className="absolute top-0 bottom-0 border-l border-white/5" 
                 style={{ left: `${(i / duration) * 100}%` }}
               >
                  <span className="text-[6px] text-[#404040] ml-1">{i}s</span>
               </div>
            ))}

            {/* Playhead */}
            <motion.div 
               className="absolute inset-y-0 w-px bg-blue-500 z-50 shadow-[0_0_15px_#3b82f6]"
               animate={{ left: `${(currentTime / duration) * 100}%` }}
            >
               <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-blue-500 rotate-45" />
            </motion.div>
         </div>
      </div>

      {/* TRACKS AREA */}
      <div className="flex-1 overflow-y-auto">
         {layers.map((layer) => (
            <div key={layer.id} className="h-14 flex border-b border-white/2 group">
               {/* Track Label */}
               <div className="w-48 bg-[#0A0A0B] border-r border-white/5 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     {layer.type === 'video' ? <Video size={12} className="text-blue-500" /> : layer.type === 'audio' ? <Music size={12} className="text-purple-500" /> : <Type size={12} className="text-yellow-500" />}
                     <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest truncate max-w-[80px]">{layer.name}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Eye size={10} className="text-zinc-700 cursor-pointer hover:text-white" />
                     <Lock size={10} className="text-zinc-700 cursor-pointer hover:text-white" />
                  </div>
               </div>

               {/* Track Channel */}
               <div className="flex-1 relative bg-black/20">
                  <motion.div
                    drag="x"
                    dragMomentum={false}
                    dragElastic={0}
                    onDrag={(_, info) => {
                      if (!timelineRef.current) return;
                      const rect = timelineRef.current.getBoundingClientRect();
                      const xChange = info.delta.x;
                      const timeChange = (xChange / rect.width) * duration;
                      handleLayerDrag(layer.id, layer.start + timeChange);
                    }}
                    className={`absolute inset-y-2 rounded-lg border flex items-center px-4 cursor-move shadow-2xl transition-shadow hover:shadow-blue-500/10 ${layer.color}`}
                    style={{ 
                      left: `${(layer.start / duration) * 100}%`,
                      width: `${(layer.duration / duration) * 100}%`
                    }}
                  >
                     <span className="text-[7px] font-black uppercase text-white/40 truncate">{layer.name}</span>
                     
                     {/* Handles */}
                     <div className="absolute left-0 inset-y-0 w-1.5 bg-white/10 rounded-l-lg hover:bg-white/30 cursor-ew-resize" />
                     <div className="absolute right-0 inset-y-0 w-1.5 bg-white/10 rounded-r-lg hover:bg-white/30 cursor-ew-resize" />
                  </motion.div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
