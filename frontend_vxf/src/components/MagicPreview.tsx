"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Languages, Volume2, ShieldCheck } from "lucide-react";

const DEMO_VIDEOS = {
  english: "https://v1.production.be/demo_en.mp4", // Replace with real assets
  hindi: "https://v1.production.be/demo_hi.mp4",
  spanish: "https://v1.production.be/demo_es.mp4",
};

export default function MagicPreview() {
  const [activeLang, setActiveLang] = useState<keyof typeof DEMO_VIDEOS>("english");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { soundEngine } = require("@/utils/SoundEngine");

  const togglePlay = () => {
    soundEngine?.play("click");
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  const handleLangChange = (lang: keyof typeof DEMO_VIDEOS) => {
    if (lang === activeLang) return;
    
    soundEngine?.play("process");
    setIsSyncing(true);
    const currentTime = videoRef.current?.currentTime || 0;
    setTimeout(() => {
      setActiveLang(lang);
      setIsSyncing(false);
      soundEngine?.play("success");
      
      // Seamless transition logic
      if (videoRef.current) {
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.currentTime = currentTime;
            if (isPlaying) videoRef.current.play();
          }
        }, 50);
      }
    }, 1200);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-20 group">
      {/* Cinematic Frame */}
      <div className={`relative aspect-video rounded-2xl overflow-hidden border transition-all duration-700 shadow-2xl bg-black/40 backdrop-blur-3xl ${isSyncing ? 'border-blue-500 scale-[1.01] shadow-[0_0_50px_rgba(0,102,255,0.3)]' : 'border-white/10'}`}>
        {/* The Video */}
        <video
          ref={videoRef}
          key={activeLang}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isSyncing ? 'opacity-40' : 'opacity-100'}`}
          poster="/dashboard_preview.png"
          playsInline
        >
          <source src={DEMO_VIDEOS[activeLang]} type="video/mp4" />
        </video>

        {/* Syncing Overlay */}
        <AnimatePresence>
          {isSyncing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-blue-600/10 backdrop-blur-[2px] z-20"
            >
               <div className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-white/10 animate-spin mb-4" />
               <h4 className="text-xl font-black text-white tracking-[0.3em] uppercase italic">Neural Syncing</h4>
               <p className="text-blue-400 text-xs font-bold mt-2">ALIGHING VOICE VECTORS...</p>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Overlay UI */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-8">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/20 rounded-full mb-6 overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button 
                  onClick={togglePlay}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
                </button>
                
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-blue-400 tracking-widest uppercase">Now Dubbing</span>
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={activeLang}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-lg font-semibold text-white capitalize"
                    >
                      {activeLang} • Ultra HD
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-2 p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
                {Object.keys(DEMO_VIDEOS).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLangChange(lang as keyof typeof DEMO_VIDEOS)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      activeLang === lang 
                        ? "bg-blue-600 text-white shadow-lg" 
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-lime-400" />
          <span className="text-xs font-bold text-white tracking-wider">STARBOY FIDELITY</span>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute -inset-4 bg-blue-500/10 blur-3xl -z-10 rounded-3xl" />
    </div>
  );
}
