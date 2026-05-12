"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Loader2, CheckCircle2 } from 'lucide-react';

interface ProgressBarProps {
  taskId: string;
  onComplete: (data: any) => void;
}

export default function NeuralProgressBar({ taskId, onComplete }: ProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    if (!taskId) return;

    // Connect to Server-Sent Events (SSE)
    const eventSource = new EventSource(`http://127.0.0.1:8000/api/autopilot/progress/${taskId}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setProgress(data.progress);
      
      if (data.progress < 100) {
        setStatus(`Neural Processing: ${data.progress}%`);
      } else {
        setStatus('Analysis Complete!');
        eventSource.close();
        onComplete(data);
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
        />
      </div>
      
      <div className="mt-4 flex items-center gap-2 opacity-30">
        <Zap size={12} />
        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-tighter">GPU Optimized Rendering Active</span>
      </div>
    </div>
  );
}
