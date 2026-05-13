"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Trash2, Check, Sliders } from 'lucide-react';
import { useToast } from '@/components/Toast';

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob, takeName: string) => void;
  script?: string;
}

export default function VoiceRecorder({ onRecordingComplete, script }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [takes, setTakes] = useState<{ id: string, blob: Blob, name: string }[]>([]);
  const [showTeleprompter, setShowTeleprompter] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(20);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const { showToast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const takeName = `Take ${takes.length + 1}`;
        setTakes(prev => [...prev, { id: Math.random().toString(36).substring(7), blob: audioBlob, name: takeName }]);
        showToast(`${takeName} saved to temporary storage`, "success");
      };

      mediaRecorder.start();
      setIsRecording(true);
      if (script) setShowTeleprompter(true);
      startVisualizer(stream);
    } catch (err) {
      showToast("Microphone access denied", "error");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    setShowTeleprompter(false);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  };

  const startVisualizer = (stream: MediaStream) => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;
    source.connect(analyzer);

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyzer.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        ctx.fillStyle = `rgba(0, 242, 255, ${barHeight / 100})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };
    draw();
  };

  return (
    <div className="flex flex-col gap-4 bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
          <Mic size={14} className={isRecording ? "text-[#ff453a] animate-pulse" : "text-zinc-500"} />
          {isRecording ? "RECORDING LIVE" : "VOICE OVER STUDIO"}
        </h3>
        <div className="flex gap-2">
           <button 
             onClick={() => setShowTeleprompter(!showTeleprompter)}
             className={`p-2 rounded-lg text-[10px] font-black uppercase transition-all ${showTeleprompter ? 'bg-[#CCFF00] text-black' : 'bg-zinc-800 text-zinc-500'}`}
           >
             Teleprompter
           </button>
        </div>
      </div>

      <div className="relative h-24 bg-black rounded-2xl overflow-hidden border border-white/5 mb-4">
        <canvas ref={canvasRef} width={400} height={100} className="w-full h-full" />
        {!isRecording && (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-700 font-bold text-[10px] uppercase tracking-widest">
            Ready to capture take
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4">
        {!isRecording ? (
          <button 
            onClick={startRecording}
            className="w-16 h-16 bg-[#ff453a] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,69,58,0.3)] hover:scale-110 transition-all"
          >
            <div className="w-6 h-6 bg-white rounded-full" />
          </button>
        ) : (
          <button 
            onClick={stopRecording}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-110 transition-all"
          >
            <Square className="text-black" fill="currentColor" />
          </button>
        )}
      </div>

      {takes.length > 0 && (
        <div className="mt-6 border-t border-white/5 pt-4">
          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3 block">Recent Takes</span>
          <div className="flex flex-col gap-2">
             {takes.map((take) => (
               <div key={take.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl border border-white/5">
                 <span className="text-white font-bold text-[11px]">{take.name}</span>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => onRecordingComplete(take.blob, take.name)}
                      className="p-2 bg-[#CCFF00] text-black rounded-lg hover:scale-105 transition-all"
                    >
                      <Check size={14} />
                    </button>
                    <button 
                      onClick={() => setTakes(prev => prev.filter(t => t.id !== take.id))}
                      className="p-2 bg-zinc-700 text-zinc-400 rounded-lg hover:text-[#ff453a] transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                 </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* Floating Teleprompter */}
      <AnimatePresence>
        {showTeleprompter && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-black/90 border border-[#CCFF00]/30 rounded-3xl p-8 backdrop-blur-xl z-[2000] shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex justify-between items-center mb-6">
               <span className="text-[10px] font-black text-[#CCFF00] uppercase tracking-widest">Teleprompter Logic</span>
               <div className="flex items-center gap-4">
                  <Sliders size={14} className="text-zinc-500" />
                  <input 
                    type="range" 
                    min="5" max="50" 
                    value={scrollSpeed} 
                    onChange={(e) => setScrollSpeed(parseInt(e.target.value))}
                    className="w-24 h-1 bg-zinc-800 rounded-full appearance-none"
                  />
               </div>
            </div>
            <div className="h-64 overflow-hidden relative">
               <motion.div 
                 animate={isRecording ? { y: -1000 } : { y: 0 }}
                 transition={{ duration: 60 - scrollSpeed, ease: "linear" }}
                 className="text-2xl font-bold text-white text-center leading-relaxed"
               >
                 {script || "Welcome to VoxFlow Voice Studio. Prepare your script here and press record to start your session. The text will auto-scroll as you speak."}
               </motion.div>
               <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black via-transparent to-black" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
