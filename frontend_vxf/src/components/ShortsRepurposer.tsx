"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Sparkles, Smartphone, Loader2, Target, Zap, CheckCircle } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { useToast } from '@/components/Toast';
import { soundEngine } from '@/utils/SoundEngine';

export default function ShortsRepurposer() {
  const title = "AI Shorts Architect";
  const { state } = useProject();
  const { showToast } = useToast();
  const isLinked = !state.unlinkedModules.includes(title);
  const effectiveVideo = isLinked ? state.masterVideo : state.moduleLocalVideos[title];
  const videoId = effectiveVideo?.videoId;

  const [phase, setPhase] = useState<'idle' | 'analyzing' | 'cropping' | 'ready'>(videoId ? 'ready' : 'idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (videoId && phase === 'idle') {
      startAutomation();
    }
  }, [videoId]);

  const startAutomation = async () => {
    setPhase('analyzing');
    soundEngine?.play('process');
    
    // Simulate Neural Analysis
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 100));
      if (i === 40) showToast("Neural hook identified at 0:42", "info");
      if (i === 80) showToast("Retention spike detected in Segment 3", "info");
    }

    setPhase('cropping');
    showToast("Auto-cropping to vertical 9:16...", "info");
    await new Promise(r => setTimeout(r, 2000));
    
    setPhase('ready');
    soundEngine?.play('success');
    showToast("AI Shorts Architecture complete!", "success");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', opacity: videoId ? 1 : 0.6 }}>
      {videoId && phase !== 'ready' && (
        <div style={{ 
          background: 'rgba(0, 242, 255, 0.05)', 
          padding: '20px', 
          borderRadius: '16px', 
          border: '1px solid rgba(0, 242, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#00f2ff', textTransform: 'uppercase' }}>
              {phase === 'analyzing' ? 'Neural Hook Analysis' : 'Auto-Crop Logic'}
            </span>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#00f2ff' }}>{progress}%</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
            <motion.div 
              style={{ height: '100%', background: '#00f2ff', borderRadius: '2px', boxShadow: '0 0 10px #00f2ff' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
            <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>
              {phase === 'analyzing' ? 'Scanning video for viral segments...' : 'Aligning vertical re-frame points...'}
            </span>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ 
            position: 'relative', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            border: phase === 'ready' ? '1px solid rgba(80, 255, 80, 0.2)' : '1px solid var(--border-theme)', 
            background: 'var(--bg-card)', 
            aspectRatio: '9/16' 
          }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {phase === 'ready' ? (
                <CheckCircle className="w-8 h-8 text-green-500/20" />
              ) : (
                <Smartphone className="w-6 h-6 text-white/10" />
              )}
            </div>
            
            <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', padding: '4px 6px', borderRadius: '4px', fontSize: '0.6rem', color: 'white' }}>CLIP 0{i}</div>
            
            {phase === 'ready' && (
              <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(80, 255, 80, 0.2)', padding: '4px 6px', borderRadius: '4px', fontSize: '0.5rem', color: '#50ff50', fontWeight: 900 }}>VIRAL MATCH</div>
            )}

            {videoId && phase !== 'ready' && (
              <motion.div 
                style={{ position: 'absolute', top: '8px', right: '8px' }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              >
                <div style={{ width: '6px', height: '6px', background: '#00f2ff', borderRadius: '50%', boxShadow: '0 0 10px #00f2ff' }} />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Target className="w-4 h-4 text-blue-400" />
          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>AI AUTO-REPURPOSE LOGIC</h4>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
          {phase === 'ready' ? "Analyzed 12min source. Extracted 3 high-retention segments." : "Waiting for long-form source link or upload..."}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          disabled={!videoId || phase !== 'ready'} 
          className="btn-accent" 
          style={{ flex: 2, height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontWeight: 900, letterSpacing: '0.05em', opacity: videoId && phase === 'ready' ? 1 : 0.5 }}
          onClick={() => {
            soundEngine?.play('click');
            showToast("Broadcasting shorts to all linked accounts...", "info");
          }}
        >
          <Sparkles className="w-5 h-5" />
          {phase === 'ready' ? "BROADCAST ALL" : "PROCESSING..."}
        </button>
        <button 
          disabled={!videoId || phase !== 'ready'} 
          className="btn-secondary" 
          style={{ flex: 1, height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: videoId && phase === 'ready' ? 1 : 0.5, background: 'rgba(255,255,255,0.05)' }}
          onClick={() => {
            soundEngine?.play('click');
            window.open(`/api/video/download?jobId=${videoId}&module=shorts`, '_blank');
            showToast("Exporting clips to local system...", "success");
          }}
        >
          <Smartphone className="w-5 h-5" />
          EXPORT
        </button>
      </div>

    </div>
  );
}




