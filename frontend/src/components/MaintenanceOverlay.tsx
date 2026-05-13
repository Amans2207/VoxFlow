"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Sparkles, Loader2 } from 'lucide-react';

export default function MaintenanceOverlay() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: '#050505',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center'
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(0, 102, 255, 0.15) 0%, transparent 70%)',
        filter: 'blur(60px)',
        zIndex: -1
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.03)', 
          padding: '40px', 
          borderRadius: '32px', 
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          maxWidth: '500px'
        }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
             <Settings className="w-16 h-16 text-blue-500 animate-spin" style={{ animationDuration: '8s' }} />
             <Sparkles className="w-6 h-6 text-blue-400 absolute -top-2 -right-2 animate-pulse" />
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Upgrading <span style={{ color: 'var(--accent-blue)' }}>VoxFlow</span>
          </h1>
          
          <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.5)', lineHeight: 1.6, marginBottom: '32px' }}>
            We're currently deploying a massive AI engine update to enhance your production quality. This should only take a few moments.
          </p>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '12px 24px',
            borderRadius: '16px',
            fontSize: '0.85rem',
            color: 'var(--accent-blue)',
            fontWeight: 700
          }}>
            <Loader2 className="w-4 h-4 animate-spin" />
            NEURAL SYNCHRONIZATION IN PROGRESS
          </div>
        </div>
      </motion.div>

      <div style={{ position: 'absolute', bottom: '40px', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.2)', fontWeight: 600 }}>
        © 2026 VOXFLOW AI STUDIO • AMAN STUDIO GLOBAL
      </div>
    </div>
  );
}
