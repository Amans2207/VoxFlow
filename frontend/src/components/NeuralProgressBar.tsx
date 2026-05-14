"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Loader2, Sparkles, Activity } from 'lucide-react';
import { socket } from '@/utils/socket'; // Assuming socket.ts exists

export const NeuralProgressBar = () => {
    const [task, setTask] = useState<{ job_id: string; progress: number; message: string; status: string } | null>(null);

    useEffect(() => {
        const handleStatus = (data: any) => {
            setTask(data);
            if (data.status === 'Completed' || data.status === 'Failed') {
                setTimeout(() => setTask(null), 5000);
            }
        };

        if (socket) {
            socket.on('render_status', handleStatus);
            return () => { socket.off('render_status', handleStatus); };
        }
    }, []);

    if (!task) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-xl"
            >
                <div className="bg-[#0A0A0B]/80 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 shadow-2xl shadow-blue-500/10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 animate-pulse">
                                <Zap size={20} fill="currentColor" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[4px]">Neural Link Active</span>
                                <span className="text-xs font-bold text-white truncate max-w-[200px]">{task.message}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-xl font-black text-white italic">{task.progress}%</span>
                            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Job: {task.job_id.slice(0, 8)}</span>
                        </div>
                    </div>

                    <div className="relative h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${task.progress}%` }}
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                        />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex gap-2">
                            {[1, 2, 3].map(i => (
                                <motion.div 
                                    key={i}
                                    animate={{ opacity: [0.2, 1, 0.2] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                    className="w-1 h-1 bg-blue-500 rounded-full"
                                />
                            ))}
                        </div>
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Titan-X Neural Engine v10.0</span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
