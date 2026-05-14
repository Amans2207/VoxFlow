"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Minimize2, Type, Palette } from 'lucide-react';

interface Style {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    preview: string;
}

const styles: Style[] = [
    { 
        id: 'Starboy', 
        name: 'The Starboy', 
        description: 'Moody, cinematic with cyan neon accents and dynamic bounce.',
        icon: <Zap className="text-cyan-400" />,
        color: 'from-cyan-500/20 to-blue-500/20',
        preview: 'CYAN NEON BOUNCE'
    },
    { 
        id: 'Hormozi', 
        name: 'The Motivator', 
        description: 'High-energy, big yellow captions with impact styling.',
        icon: <Sparkles className="text-yellow-400" />,
        color: 'from-yellow-500/20 to-orange-500/20',
        preview: 'BIG YELLOW IMPACT'
    },
    { 
        id: 'Minimalist', 
        name: 'The Minimalist', 
        description: 'Clean, elegant white subtitles with subtle typography.',
        icon: <Minimize2 className="text-zinc-400" />,
        color: 'from-zinc-500/20 to-zinc-800/20',
        preview: 'Clean White Sans'
    }
];

interface StyleGalleryProps {
    selectedStyle: string;
    onSelect: (id: string) => void;
}

export const StyleGallery = ({ selectedStyle, onSelect }: StyleGalleryProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {styles.map((style) => (
                <motion.div
                    key={style.id}
                    whileHover={{ y: -5 }}
                    whileActive={{ scale: 0.98 }}
                    onClick={() => onSelect(style.id)}
                    className={`relative p-6 rounded-[32px] border cursor-pointer transition-all overflow-hidden group ${
                        selectedStyle === style.id 
                        ? 'bg-white/5 border-white/20' 
                        : 'bg-[#0A0A0B] border-white/5 hover:border-white/10'
                    }`}
                >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    
                    <div className="relative z-10 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/5`}>
                                {style.icon}
                            </div>
                            {selectedStyle === style.id && (
                                <motion.div 
                                    layoutId="active-style"
                                    className="px-3 py-1 bg-white text-black text-[8px] font-black uppercase rounded-full tracking-tighter"
                                >
                                    Selected
                                </motion.div>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <h3 className="text-sm font-black text-white uppercase tracking-tighter italic">{style.name}</h3>
                            <p className="text-[10px] font-medium text-zinc-500 leading-relaxed uppercase tracking-wider">{style.description}</p>
                        </div>

                        {/* Preview Box */}
                        <div className="mt-2 h-16 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${
                                style.id === 'Starboy' ? 'text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' :
                                style.id === 'Hormozi' ? 'text-yellow-400' : 'text-white'
                            }`}>
                                {style.preview}
                            </span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
