"use client";

import { useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Play, RefreshCcw, Globe, Loader2, Sparkles } from "lucide-react";

export default function VoicePlayground() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [clonedAudios, setClonedAudios] = useState<{ lang: string; url: string }[] | null>(null);
  
  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } = 
    useReactMediaRecorder({ audio: true, stopStreamsOnStop: true });

  const handleProcess = async () => {
    if (!mediaBlobUrl) return;
    setIsProcessing(true);
    
    // Simulate AI Processing
    setTimeout(() => {
      setClonedAudios([
        { lang: "Spanish", url: "https://v1.production.be/cloned_es.mp3" },
        { lang: "French", url: "https://v1.production.be/cloned_fr.mp3" },
        { lang: "Japanese", url: "https://v1.production.be/cloned_jp.mp3" },
      ]);
      setIsProcessing(false);
    }, 3000);
  };

  const reset = () => {
    clearBlobUrl();
    setClonedAudios(null);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold tracking-widest uppercase">The Playground</span>
          </motion.div>
          
          <h2 className="text-5xl font-bold mb-6">Clone Your Voice in <span className="text-blue-500">5 Seconds.</span></h2>
          <p className="text-gray-400 text-lg mb-12">Experience Starboy-fidelity cloning. Record a snippet and hear yourself speak global languages instantly.</p>

          <div className="glass-glow p-12 relative">
            {!clonedAudios ? (
              <div className="flex flex-col items-center">
                <div className="relative mb-8">
                  <AnimatePresence>
                    {status === "recording" && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0.2 }}
                        exit={{ scale: 2, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 bg-red-500 rounded-full"
                      />
                    )}
                  </AnimatePresence>
                  
                  <button
                    onClick={status === "recording" ? stopRecording : startRecording}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                      status === "recording" ? "bg-red-500 shadow-red-500/50" : "bg-blue-600 shadow-blue-600/50"
                    } shadow-2xl relative z-10`}
                  >
                    {status === "recording" ? <Square className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
                  </button>
                </div>

                <div className="text-sm font-medium text-gray-500 mb-8">
                  {status === "idle" && "Ready to record"}
                  {status === "recording" && "Listening... speak now"}
                  {status === "stopped" && "Recording captured"}
                </div>

                {mediaBlobUrl && status === "stopped" && !isProcessing && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4"
                  >
                    <button onClick={reset} className="btn-secondary flex items-center gap-2">
                      <RefreshCcw className="w-4 h-4" /> Retake
                    </button>
                    <button onClick={handleProcess} className="btn-primary flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Transform Voice
                    </button>
                  </motion.div>
                )}

                {isProcessing && (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <span className="text-blue-400 font-medium animate-pulse">Neural Processing...</span>
                  </div>
                )}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {clonedAudios.map((audio, idx) => (
                  <div key={idx} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-500/50 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                      <Globe className="w-6 h-6 text-blue-400" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">{audio.lang}</h4>
                    <button className="w-full py-3 bg-white/10 rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
                      <Play className="w-4 h-4" /> Play Demo
                    </button>
                  </div>
                ))}
                <div className="md:col-span-3 mt-8">
                  <button onClick={reset} className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mx-auto font-bold">
                    <RefreshCcw className="w-4 h-4" /> Start Over
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
