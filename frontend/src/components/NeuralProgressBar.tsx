"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Loader2, CheckCircle2 } from 'lucide-react';

interface ProgressBarProps {
  taskId?: string;
  onComplete?: (data: any) => void;
  progress?: number;
  label?: string;
  color?: string;
}

export default function NeuralProgressBar({ taskId, onComplete, progress: manualProgress, label: manualLabel, color }: ProgressBarProps) {
  const [internalProgress, setInternalProgress] = useState(0);
  const [internalStatus, setInternalStatus] = useState('Initializing...');

  const progress = manualProgress !== undefined ? manualProgress : internalProgress;
  const status = manualLabel !== undefined ? manualLabel : internalStatus;

  useEffect(() => {
    if (!taskId) return;

    // Connect to Server-Sent Events (SSE)
    const AI_SERVICE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    const eventSource = new EventSource(`${AI_SERVICE_URL}/api/autopilot/progress/${taskId}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setInternalProgress(data.progress);
      
      if (data.progress < 100) {
        setInternalStatus(`Neural Processing: ${data.progress}%`);
      } else {
        setInternalStatus('Analysis Complete!');
        eventSource.close();
        if (onComplete) onComplete(data);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Connection Failed:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [taskId]);

  return (
    <div className="w-full bg-zinc-900/50 border border-white/5 p-6 rounded-[2rem] backdrop-blur-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {progress < 100 ? <Loader2 className="animate-spin text-[#CCFF00]" size={16} /> : <CheckCircle2 className="text-[#39FF14]" size={16} />}
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{status}</span>
        </div>
        <span className="text-xs font-black text-white">{progress}%</span>
      </div>

      <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-[#CCFF00] to-[#39FF14] shadow-[0_0_20px_rgba(204,255,0,0.4)]"
          style={color ? { background: color, boxShadow: `0 0 20px ${color}66` } : {}}
        />
      </div>
      
      <div className="mt-4 flex items-center gap-2 opacity-30">
        <Zap size={12} />
        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-tighter">GPU Optimized Rendering Active</span>
      </div>
    </div>
  );
}
