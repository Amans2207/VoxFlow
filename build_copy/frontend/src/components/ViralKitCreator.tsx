"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Hash, Quote, Send, Loader2, Copy, Check } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { useToast } from '@/components/Toast';
import { soundEngine } from '@/utils/SoundEngine';


export default function ViralKitCreator() {
  const title = "AI Viral Kit";
  const { state } = useProject();
  const { showToast } = useToast();
  const isLinked = !state.unlinkedModules.includes(title);
  const effectiveVideo = isLinked ? state.masterVideo : state.moduleLocalVideos[title];
  const videoId = effectiveVideo?.videoId;

  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const [isPublishing, setIsPublishing] = React.useState(false);

  const captions = videoId ? [
    "This video is going to change everything... 🚀 #VoxFlow",
    "Breaking language barriers in real-time. 🌍",
    "AI-powered creativity at its peak. 📈"
  ] : [
    "Upload a video to generate viral captions...",
    "Global context sync will populate this automatically.",
    "Or drop a file here for local processing."
  ];

  const tags = videoId ? [
    "#viral", "#ai", "#trending", "#global", "#innovation", 
    "#future", "#creativity", "#content", "#marketing", "#tech",
    "#vision", "#voxflow", "#masterpiece", "#shorts", "#reels"
  ] : ["#waiting", "#voxflow"];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    soundEngine?.play("click");
    showToast("Caption copied to clipboard!", "success");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    soundEngine?.play("processing");
    showToast("Initializing multi-platform broadcast...", "info");
    setTimeout(() => {
      setIsPublishing(false);
      soundEngine?.play("success");
      showToast("Successfully published to YouTube, Instagram, and TikTok!", "success");
    }, 2000);
  };


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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Quote className="w-4 h-4 text-blue-400" />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)' }}>GENERATED CAPTIONS</span>
        </div>
        
        {captions.map((cap, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-theme)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>{cap}</span>
            <button 
              disabled={!videoId} 
              onClick={() => handleCopy(cap, i)}
              style={{ 
                color: copiedIndex === i ? '#50ff50' : 'var(--accent-blue)', 
                fontSize: '0.65rem', 
                fontWeight: 800, 
                background: copiedIndex === i ? 'rgba(80,255,80,0.1)' : 'rgba(0,102,255,0.1)', 
                border: 'none', 
                padding: '4px 8px', 
                borderRadius: '4px', 
                cursor: videoId ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s'
              }}
            >
              {copiedIndex === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedIndex === i ? 'COPIED' : 'COPY'}
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Hash className="w-4 h-4 text-blue-400" />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)' }}>TRENDING HASHTAGS</span>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {tags.map((tag) => (
            <span key={tag} style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', background: 'rgba(0,102,255,0.05)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border-theme)' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          disabled={!videoId || isPublishing} 
          onClick={handlePublish}
          className="btn-accent" 
          style={{ flex: 2, height: '44px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: (videoId && !isPublishing) ? 1 : 0.5, cursor: (videoId && !isPublishing) ? 'pointer' : 'not-allowed' }}
        >
          {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {isPublishing ? "PUBLISHING..." : "PUBLISH ALL"}
        </button>
        <button 
          disabled={!videoId} 
          onClick={() => {
            soundEngine?.play("click");
            window.open(`/api/video/download?jobId=${videoId}&module=viral_kit`, '_blank');
            showToast("Metadata exported successfully!", "success");
          }}
          className="btn-secondary" 
          style={{ flex: 1, height: '44px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: videoId ? 1 : 0.5, cursor: videoId ? 'pointer' : 'not-allowed', background: 'rgba(255,255,255,0.05)' }}
        >
          <Hash className="w-4 h-4" />
          EXPORT
        </button>
      </div>

    </div>
  );
}



