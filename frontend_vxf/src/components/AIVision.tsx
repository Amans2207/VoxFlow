"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  Image as ImageIcon, 
  Video, 
  Mic, 
  Download, 
  Share2, 
  CheckCircle2,
  Zap
} from 'lucide-react';
import SocialPublish from "@/components/SocialPublish";
import { useProject } from '@/context/ProjectContext';
import { useToast } from '@/components/Toast';
import { soundEngine } from '@/utils/SoundEngine';

const STYLES = [
  { id: 'cinematic', name: 'Cinematic', thumb: '/styles/cinematic.png' },
  { id: 'anime', name: 'Anime', thumb: '/styles/anime.png' },
  { id: 'cyberpunk', name: 'Cyberpunk', thumb: '/styles/cyberpunk.png' },
];

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function AIVision() {
  const { setGlobalProject } = useProject();
  const { showToast } = useToast();
  
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState('cinematic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedVideo, setGeneratedVideo] = useState<any>(null);
  const [voiceoverEnabled, setVoiceoverEnabled] = useState(true);
  const [viralKitEnabled, setViralKitEnabled] = useState(true);

  // Simulate progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + (100 / (8000 / 100)); // 8 seconds total
          return next > 99 ? 99 : next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isGenerating, progress]);

  const handleGenerate = async () => {
    if (!prompt) {
      showToast("Please enter a prompt first!", "error");
      return;
    }

    soundEngine?.play("process");
    setIsGenerating(true);
    setProgress(0);
    setGeneratedVideo(null);

    try {
      const res = await fetch("/api/ai-vision/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt, 
          style: selectedStyle,
          settings: { voiceover: voiceoverEnabled, viralKit: viralKitEnabled }
        }),
      });

      const data = await res.json();

      if (data.success) {
        setProgress(100);
        setTimeout(() => {
          setIsGenerating(false);
          setGeneratedVideo(data);
          setGlobalProject(data.jobId, data.videoUrl, data.filename);
          soundEngine?.play("success");
          showToast("Your masterpiece is ready!", "success");
          
          if (viralKitEnabled) {
            showToast("AI Viral Kit triggered automatically.", "info");
          }
        }, 500);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setIsGenerating(false);
      showToast("Generation failed. Try again.", "error");
      soundEngine?.play("error");
    }
  };

  const handleDownloadResult = () => {
    if (!generatedVideo) return;
    soundEngine?.play("process");
    showToast("Preparing your high-res export...", "info");
    
    const a = document.createElement('a');
    a.href = generatedVideo.videoUrl;
    a.download = generatedVideo.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    setTimeout(() => {
      soundEngine?.play("success");
      showToast("Download started successfully.", "success");
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Input Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vision Prompt</span>
        </div>
        <textarea 
          placeholder="Describe the scene you want to bring to life... (e.g., 'A cyberpunk street racer drifting through neon rain')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ 
            width: '100%', 
            height: '100px', 
            background: 'var(--bg-card)', 
            border: '1px solid var(--border-theme)', 
            borderRadius: '12px', 
            padding: '12px',
            fontSize: '0.85rem',
            color: 'var(--text-main)',
            resize: 'none',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#00f2ff'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-theme)'}
        />
      </div>

      {/* Style Picker */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <ImageIcon className="w-4 h-4 text-blue-400" />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Style Picker</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {STYLES.map(style => (
            <motion.div
              key={style.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedStyle(style.id)}
              style={{ 
                position: 'relative',
                height: '80px',
                borderRadius: '10px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: selectedStyle === style.id ? '2px solid #00f2ff' : '1px solid rgba(255,255,255,0.1)',
                boxShadow: selectedStyle === style.id ? '0 0 15px rgba(0, 242, 255, 0.3)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <img src={style.thumb} alt={style.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: selectedStyle === style.id ? 1 : 0.6 }} />
              <div style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                padding: '4px', 
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                fontSize: '0.65rem',
                fontWeight: 700,
                textAlign: 'center',
                color: 'white'
              }}>
                {style.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Post-Processing Toggles */}
      <div style={{ display: 'flex', gap: '15px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-theme)' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input 
            type="checkbox" 
            id="voiceover" 
            checked={voiceoverEnabled} 
            onChange={(e) => setVoiceoverEnabled(e.target.checked)}
            style={{ accentColor: '#00f2ff' }}
          />
          <label htmlFor="voiceover" style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer' }}>AI Voiceover</label>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input 
            type="checkbox" 
            id="viralkit" 
            checked={viralKitEnabled} 
            onChange={(e) => setViralKitEnabled(e.target.checked)}
            style={{ accentColor: '#00f2ff' }}
          />
          <label htmlFor="viralkit" style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer' }}>AI Viral Kit</label>
        </div>
      </div>

      {/* Action Button / Progress */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {!isGenerating && !generatedVideo ? (
            <motion.button
              key="gen-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleGenerate}
              className="btn-accent haptic-pulse"
              style={{ width: '100%', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 800, fontSize: '0.9rem' }}
            >
              <Video className="w-5 h-5" />
              GENERATE VISION
            </motion.button>
          ) : isGenerating ? (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ padding: '20px', background: 'rgba(0, 242, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(0, 242, 255, 0.2)' }}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00f2ff' }}>GENERATING YOUR MASTERPIECE...</span>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#00f2ff' }}>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                <motion.div 
                  style={{ height: '100%', background: 'linear-gradient(90deg, #0072ff, #00f2ff)', width: `${progress}%` }} 
                  layoutId="progress-fill"
                />
              </div>
              
              {/* Frame Previews */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ flex: 1, height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    {progress > (i * 25) && (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 0.4 }} 
                        style={{ width: '100%', height: '100%', background: 'var(--accent-blue)' }} 
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #50ff50', boxShadow: '0 0 20px rgba(80, 255, 80, 0.1)' }}>
                <img 
                  src={generatedVideo.previewFrames[0]} 
                  alt="Result" 
                  style={{ width: '100%', height: '160px', objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                <button 
                  onClick={handleDownloadResult}
                  className="btn-secondary"
                  style={{ height: '50px', borderRadius: '12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid var(--accent-blue)', color: 'var(--accent-blue)' }}
                >
                  <Download className="w-5 h-5" /> DOWNLOAD HIGH-RES MASTER (.MP4)
                </button>
                
                <SocialPublish 
                  jobId={generatedVideo.jobId} 
                  videoUrl={generatedVideo.videoUrl}
                  captions={["✨ Just created this masterpiece with VoxFlow AI Vision!", "🚀 The future of video production is here."]}
                  hashtags="#VoxFlow #AIVision #NextGenCreative #NeuralVideo"
                />
              </div>

              <button 
                onClick={() => { setGeneratedVideo(null); setPrompt(""); setProgress(0); }}
                style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
              >
                CREATE ANOTHER VISION
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Credit Info */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', opacity: 0.6 }}>
        <Zap className="w-3 h-3 text-blue-400" />
        <span style={{ fontSize: '0.6rem', fontWeight: 600, color: 'var(--text-secondary)' }}>PREMIUM GENERATION • 10 CREDITS / MIN</span>
      </div>

    </div>
  );
}
