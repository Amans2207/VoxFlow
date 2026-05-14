"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Music, Trash2, ExternalLink, Plus, Search } from 'lucide-react';
import apiClient from '@/utils/apiClient';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

export const MediaLibrary = () => {
    const { data: session } = useSession();
    const [assets, setAssets] = useState<{ avatars: string[], voices: string[] }>({ avatars: [], voices: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const res: any = await apiClient.get(`/api/user/assets?email=${session?.user?.email || 'anonymous'}`);
                setAssets(res);
            } catch (e) {
                toast.error("Neural Library Sync Failed");
            } finally {
                setLoading(false);
            }
        };
        fetchAssets();
    }, [session]);

    return (
        <div className="flex flex-col gap-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Media <span className="text-blue-500">Vault</span></h2>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Your cloud-synced neural assets</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search Assets..." 
                            className="w-full h-11 pl-10 pr-4 bg-[#0A0A0B] border border-white/5 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest outline-none focus:border-blue-500/30 transition-all"
                        />
                    </div>
                    <button className="h-11 px-6 bg-blue-500 text-black text-[10px] font-black uppercase rounded-2xl hover:scale-105 transition-all">Upload Asset</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Avatars Section */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <ImageIcon size={18} className="text-zinc-500" />
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[4px]">Neural Avatars</h3>
                        <span className="ml-auto text-[8px] font-black text-zinc-600 uppercase tracking-widest">{assets.avatars.length} Items</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {assets.avatars.map((url, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className="aspect-square bg-[#0A0A0B] border border-white/5 rounded-[32px] overflow-hidden relative group"
                            >
                                <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button className="p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all">
                                        <ExternalLink size={14} />
                                    </button>
                                    <button className="p-3 bg-red-500/10 rounded-xl text-red-500 hover:bg-red-500/20 transition-all">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                        <button className="aspect-square border-2 border-dashed border-white/5 rounded-[32px] flex flex-col items-center justify-center gap-3 text-zinc-600 hover:border-blue-500/20 hover:text-blue-500 transition-all group">
                            <div className="w-10 h-10 rounded-full bg-white/2 flex items-center justify-center group-hover:bg-blue-500/10 transition-all">
                                <Plus size={20} />
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest">New Avatar</span>
                        </button>
                    </div>
                </div>

                {/* Voice Section */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <Music size={18} className="text-zinc-500" />
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[4px]">Neural Voices</h3>
                        <span className="ml-auto text-[8px] font-black text-zinc-600 uppercase tracking-widest">{assets.voices.length} Items</span>
                    </div>

                    <div className="flex flex-col gap-3">
                        {assets.voices.map((voice, i) => (
                            <div key={i} className="p-5 bg-[#0A0A0B] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-blue-500/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/2 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-blue-500 transition-all">
                                        <Music size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-white uppercase">{voice}</span>
                                        <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest italic">ElevenLabs Premium Engine</span>
                                    </div>
                                </div>
                                <button className="h-10 px-5 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">
                                    Test Sample
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
