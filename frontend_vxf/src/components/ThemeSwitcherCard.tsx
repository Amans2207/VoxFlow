"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';

export default function ThemeSwitcherCard() {
  const { setTheme, currentTheme } = useTheme();

  const themes = [
    { id: 'starboy', color: '#00f2ff', name: 'Starboy Blue' },
    { id: 'cyber-rush', color: '#ff00ff', name: 'Cyber Pink' },
    { id: 'executive-gold', color: '#ffd700', name: 'Gold' },
    { id: 'emerald-phantom', color: '#50ff50', name: 'Green' },
    { id: 'crimson-fury', color: '#ff3030', name: 'Red' },
    { id: 'clean-studio', color: '#ffffff', name: 'Minimalist' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        {themes.map((t) => (
          <motion.button
            key={t.id}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(t.id as any)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: t.color,
              border: currentTheme === t.id ? '2px solid var(--text-main)' : '2px solid transparent',
              boxShadow: currentTheme === t.id ? `0 0 15px ${t.color}` : 'none',
              cursor: 'pointer'
            }}
            title={t.name}
          />
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>PERSONALIZE YOUR CONSOLE</h4>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Selected Theme: <span style={{ color: 'var(--accent-blue)', fontWeight: 800, textTransform: 'uppercase' }}>{currentTheme.replace('-', ' ')}</span></p>
      </div>

      <button 
        className="btn-accent" 
        style={{ width: '100%', height: '50px', borderRadius: '12px', fontWeight: 900, fontSize: '0.9rem', boxShadow: '0 0 20px var(--primary-glow)' }}
        onClick={() => {
           const nextIndex = (themes.findIndex(t => t.id === currentTheme) + 1) % themes.length;
           setTheme(themes[nextIndex].id as any);
        }}
      >
        CHANGE CONSOLE THEME
      </button>
    </div>
  );
}
