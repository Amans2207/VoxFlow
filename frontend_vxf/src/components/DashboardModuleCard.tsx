"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from '@/app/dashboard/dashboard.module.css';
import { Upload, Loader2, Link as LinkIcon, Link2Off, Zap } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useProject } from '@/context/ProjectContext';

interface DashboardModuleCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  gridColumn?: string;
  onUploadSuccess?: (videoId: string, videoUrl: string, filename: string) => void;
}

export default function DashboardModuleCard({ 
  title, 
  icon, 
  children, 
  gridColumn = 'span 4',
  onUploadSuccess 
}: DashboardModuleCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { state, setModuleLocalProject, toggleModuleLink } = useProject();
  const isLinked = !state.unlinkedModules.includes(title);
  const localVideo = state.moduleLocalVideos[title];
  const effectiveVideo = isLinked ? state.masterVideo : localVideo;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const supabase = createClient();
      
      // Credit Logic: Modular Upload = 1 Credit
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('credit_balance').eq('id', user.id).single();
        if (profile && profile.credit_balance < 1) {
          alert("Insufficient credits for modular upload (1 credit required).");
          setIsUploading(false);
          return;
        }
        
        // Deduct 1 credit
        await supabase.from('profiles').update({ credit_balance: profile!.credit_balance - 1 }).eq('id', user.id);
        window.dispatchEvent(new Event('creditsUpdated'));
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_local_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      const videoUrl = publicUrlData.publicUrl;
      const videoId = fileName;

      // Update module-specific local project state
      setModuleLocalProject(title, videoId, videoUrl, file.name);
      
      if (onUploadSuccess) {
        onUploadSuccess(videoId, videoUrl, file.name);
      }
    } catch (err) {
      console.error("Local upload failed:", err);
      alert("Failed to upload local file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div 
      className={`
        ${styles.starboyCard} 
        ${isDragging ? styles.starboyCardLocalGlow : ''}
        ${isUploading ? styles.cardShimmer : ''}
      `} 
      style={{ 
        gridColumn,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >

      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <span>{icon}</span> {title}
          {state.masterVideo && (
            <button 
              onClick={() => toggleModuleLink(title)}
              className={styles.linkToggleBtn}
              title={isLinked ? "Unlink from master video" : "Link to master video"}
            >
              {isLinked ? <LinkIcon className="w-3 h-3 text-cyan-400" /> : <Link2Off className="w-3 h-3 text-red-400" />}
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className={styles.creditBadge}>
            <Zap className="w-3 h-3" /> 1
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              cursor: 'pointer',
              padding: '4px'
            }}
            title="Module-specific upload"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-blue-400" /> : <Upload className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      <div style={{ position: 'relative', flex: 1 }}>
        {children}
        
        {isDragging && (
          <div className={styles.localDragOverlay}>
            <p>DROP TO INITIALIZE MODEL</p>
          </div>
        )}

        {!effectiveVideo && !isUploading && (
          <div className={styles.unlinkedEmptyState}>
            <Upload className="w-8 h-8 mb-2 opacity-20" />
            <p>{isLinked ? "Link to master or upload local file" : "Upload a local file to start"}</p>
          </div>
        )}
      </div>

      <input 
        type="file" 
        accept="video/*" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
      />
    </div>
  );
}


