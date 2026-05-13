"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Sliders, Loader2 } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { useToast } from '@/components/Toast';


export default function LipSyncCorrection() {
  const title = "Visual Lip-Sync Correction";
  const [syncValue, setSyncValue] = useState(0);
  const { state } = useProject();
  const { showToast } = useToast();
  const isLinked = !state.unlinkedModules.includes(title);

  const effectiveVideo = isLinked ? state.masterVideo : state.moduleLocalVideos[title];
  const videoId = effectiveVideo?.videoId;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', opacity: videoId ? 1 : 0.6 }}>
      {videoId && (
        <div style={{ 
          background: 'rgba(0, 242, 255, 0.1)', 
          padding: '8px 12px', 
          borderRadius: '6px', 
          fontSize: '0.65rem', 
          color: '#00f2ff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid rgba(0, 242, 255, 0.2)'
        }}>
          <Loader2 className="w-3 h-3 animate-spin" />
          {isLinked ? "MASTER SYNC ACTIVE" : "LOCAL MODEL SESSION ACTIVE"}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ width: '100%', aspectRatio: '16/9', background: '#111', borderRadius: '8px', border: '1px solid var(--border-theme)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>{videoId ? "PREVIEW LOADED" : "ORIGINAL TRACK"}</span>
            <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.6rem', color: 'white', fontWeight: 800 }}>RAW</div>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ width: '100%', aspectRatio: '16/9', background: '#111', borderRadius: '8px', border: '1px solid rgba(0, 242, 255, 0.2)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 20px rgba(0, 242, 255, 0.1)' }}>
            <span style={{ color: 'rgba(0, 242, 255, 0.4)', fontSize: '0.8rem' }}>{videoId ? "SYNC READY" : "LOCALISED OUTPUT"}</span>
            <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0, 242, 255, 0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.6rem', color: '#00f2ff', fontWeight: 800 }}>TITAN-X SYNC</div>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-theme)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders className="w-4 h-4 text-blue-400" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>PHONEME ALIGNMENT</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontWeight: 800 }}>{syncValue > 0 ? `+${syncValue}` : syncValue}ms OFFSET</span>
        </div>
        <input 
          disabled={!videoId}
          type="range" 
          min="-500" 
          max="500" 
          step="10" 
          value={syncValue} 
          onChange={(e) => setSyncValue(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: '#00f2ff', cursor: videoId ? 'pointer' : 'not-allowed' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>-500ms</span>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>+500ms</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          disabled={!videoId} 
          className="btn-accent" 
          style={{ flex: 2, height: '40px', fontSize: '0.8rem', opacity: videoId ? 1 : 0.5 }}
          onClick={() => {
            showToast("Sync parameters applied. Re-rendering phoneme alignment...", "info");
            setTimeout(() => showToast("Lip-sync correction complete!", "success"), 3000);
          }}
        >
          APPLY SYNC RE-RENDER
        </button>
        <button 
          disabled={!videoId} 
          className="btn-secondary" 
          style={{ flex: 1, height: '40px', fontSize: '0.8rem', opacity: videoId ? 1 : 0.5, background: 'rgba(0, 242, 255, 0.1)', border: '1px solid rgba(0, 242, 255, 0.2)', color: '#00f2ff' }}
          onClick={() => {
             window.open(`/api/video/download?jobId=${videoId}&module=lip_sync`, '_blank');
             showToast("Syncing download to local system...", "info");
          }}
        >
          EXPORT SYNC
        </button>
        <button 
          disabled={!videoId} 
          style={{ width: '40px', height: '40px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-theme)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: videoId ? 1 : 0.5 }}
          onClick={() => {
            setSyncValue(0);
            showToast("Sync offset reset to 0ms.", "info");
          }}
        >
          <RotateCcw className="w-4 h-4 text-theme" style={{ color: 'var(--text-main)' }} />
        </button>
      </div>


    </div>
  );
}


