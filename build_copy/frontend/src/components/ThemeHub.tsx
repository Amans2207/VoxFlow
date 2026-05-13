"use client";

import React from "react";
import { Sparkles, Lock, Check } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const THEMES = [
  { id: "starboy", name: "Starboy", color: "#0066FF", tier: "Lite" },
  { id: "cyber-rush", name: "Cyber-Rush", color: "#ff00ff", tier: "Lite" },
  { id: "crimson-fury", name: "Crimson Fury", color: "#ff3333", tier: "Lite" },
  { id: "clean-studio", name: "Clean Studio", color: "#666", tier: "Lite" },
  { id: "executive-gold", name: "Executive Gold", color: "#d4af37", tier: "Studio" },
  { id: "emerald-phantom", name: "Emerald Phantom", color: "#00ff66", tier: "Studio" },
] as const;

export default function ThemeHub() {
  const { currentTheme, setTheme, setPreviewTheme, userTier } = useTheme();

  return (
    <div className="p-8 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="w-5 h-5 text-blue-400" />
        <h3 className="text-xl font-bold">Studio Aesthetics</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onMouseEnter={() => setPreviewTheme(theme.id)}
            onMouseLeave={() => setPreviewTheme(null)}
            onClick={() => setTheme(theme.id)}
            className="group relative flex flex-col items-center gap-3"
          >
            <div 
              className={`w-16 h-16 rounded-2xl border-2 transition-all duration-500 flex items-center justify-center ${currentTheme === theme.id ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:border-white/40'}`}
              style={{ 
                backgroundColor: theme.color, 
                boxShadow: currentTheme === theme.id ? `0 0 30px ${theme.color}66` : 'none' 
              }}
            >
              {currentTheme === theme.id && <Check className="w-8 h-8 text-black" />}
              {theme.tier === "Studio" && userTier !== "Studio" && (
                <div className="absolute -top-2 -right-2 bg-black/80 backdrop-blur-md p-1.5 rounded-xl border border-white/20">
                  <Lock className="w-4 h-4 text-yellow-500" />
                </div>
              )}
            </div>
            <div className="text-center">
                <div className="text-xs font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{theme.name}</div>
                <div className="text-[10px] text-white/30 uppercase tracking-tighter">{theme.tier} Plan</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
