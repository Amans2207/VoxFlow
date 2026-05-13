"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Zap, Shield, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeSwitcher() {
  const { currentTheme, setTheme, setPreviewTheme } = useTheme();

  const themes = [
    { id: 'starboy', name: 'Starboy', icon: <Zap size={14} />, color: '#00f2ff' },
    { id: 'executive', name: 'Executive', icon: <Shield size={14} />, color: '#2563EB' },
    { id: 'cyber-sunset', name: 'Cyber-Sunset', icon: <Sparkles size={14} />, color: '#FF0080' },
  ];

  return (
    <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-full border border-white/5 backdrop-blur-md">
      {themes.map((t) => (
        <motion.button
          key={t.id}
          onClick={() => setTheme(t.id as any)}
          onMouseEnter={() => setPreviewTheme(t.id as any)}
          onMouseLeave={() => setPreviewTheme(null)}
          className={`relative p-2 rounded-full transition-all ${currentTheme === t.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {currentTheme === t.id && (
            <motion.div 
              layoutId="activeTheme"
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: t.color, opacity: 0.2 }}
            />
          )}
          <div className="relative z-10">
            {t.icon}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
