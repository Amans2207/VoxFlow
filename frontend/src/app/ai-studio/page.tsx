"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, Cloud, Video, FileVideo, 
  Trash2, Play, Sparkles, CheckCircle2, Loader2,
  Globe, Link as LinkIcon, Database, HardDrive,
  ChevronRight, Zap, Layers, RefreshCcw, 
  Activity, ArrowUpRight, Cpu, Video as YoutubeIcon,
  Tag, Film, Music, Star, Signal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { soundEngine } from '@/utils/SoundEngine';
import api from '@/lib/api';
import { useUserStore } from '@/store/useUserStore';
import { socket } from '@/utils/socket';

interface IngestTask {
  id: string;
  name: string;
  size: string;
  status: 'uploading' | 'queued' | 'processing' | 'completed' | 'error';
  progress: number;
  format: string;
  retries: number;
  labels: string[];
}

export default function AIStudioEternal() {
  const { user } = useUserStore();
  const [tasks, setTasks] = useState<IngestTask[]>([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  useEffect(() => {
    socket.on('batch_progress', (data) => {
      setTasks(prev => prev.map(t => 
        t.name === data.file ? { ...t, progress: data.progress, status: 'processing' } : t
      ));
    });

    socket.on('batch_complete', (data) => {
      setTasks(prev => prev.map(t => ({ ...t, status: 'completed', progress: 100, labels: data.labels || ['Cinematic', 'Viral'] })));
      setIsBulkProcessing(false);
      toast.success("Eternal Synchronization Complete: Assets Labeled & Vaulted.");
    });

    return () => {
      socket.off('batch_progress');
      socket.off('batch_complete');
    };
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newTasks: IngestTask[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + 'MB',
      status: 'uploading',
      progress: 0,
      format: file.name.split('.').pop()?.toUpperCase() || 'MP4',
      retries: 0,
      labels: []
    }));

    setTasks(prev => [...newTasks, ...prev]);
    soundEngine?.play("processing");

    // Upload with Auto-Retry Logic (3x)
    const uploadFile = async (file: File, taskId: string) => {
      const formData = new FormData();
      formData.append('files', file);
      
      let attempt = 0;
      while (attempt < 3) {
        try {
          await api.upload('/api/v1/batch/upload', formData);
          setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'queued', progress: 100 } : t));
          return;
        } catch (e) {
          attempt++;
          setTasks(prev => prev.map(t => t.id === taskId ? { ...t, retries: attempt } : t));
          if (attempt === 3) {
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'error' } : t));
            toast.error(`Upload Failed: ${file.name}. Exhausted retries.`);
          } else {
            await new Promise(r => setTimeout(r, 2000 * attempt)); // Exponential backoff
          }
        }
      }
    };

    acceptedFiles.forEach((file, i) => uploadFile(file, newTasks[i].id));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] p-8 lg:p-12 gap-12 font-sans selection:bg-blue-500/30">
      
      {/* 🚀 ETERNAL HUB HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
         <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[6px]">Eternal Synchronizer Active</span>
            </div>
            <h1 className="text-7xl lg:text-9xl font-black text-white tracking-tighter uppercase leading-[0.85] italic">NEURAL <span className="text-blue-500">VAULT.</span></h1>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest leading-relaxed max-w-xl">Unified Asset Orchestration. AI-labeled, cloud-hardened, and synced across the Eternal Ecosystem.</p>
         </div>
         
         <div className="flex gap-4">
            <div className="p-10 bg-white/2 border border-white/5 rounded-[48px] backdrop-blur-3xl flex flex-col gap-2 min-w-[240px] shadow-2xl">
               <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Active Neural Jobs</span>
               <div className="flex items-end gap-3">
                  <span className="text-5xl font-black text-white">{tasks.filter(t => t.status !== 'completed').length}</span>
                  <div className="flex items-center gap-1 mb-2 px-2 py-0.5 bg-blue-500/10 rounded-full">
                     <Activity size={10} className="text-blue-500" />
                     <span className="text-[7px] font-black text-blue-500 uppercase">Live</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         
         {/* LEFT: ETERNAL INGEST */}
         <div className="lg:col-span-7 space-y-12">
            <div 
              {...getRootProps()} 
              className={`relative h-[550px] border-2 border-dashed rounded-[72px] backdrop-blur-2xl transition-all flex flex-col items-center justify-center gap-10 cursor-pointer group overflow-hidden ${isDragActive ? 'border-blue-500 bg-blue-500/5' : 'border-white/10 bg-white/2 hover:border-blue-500/20 shadow-2xl'}`}
            >
               <input {...getInputProps()} />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.05)_0%,_transparent_70%)]" />
               
               <div className="w-28 h-28 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 shadow-3xl group-hover:scale-110 transition-transform duration-1000 border border-blue-500/20">
                  <Upload size={56} />
               </div>
               
               <div className="text-center space-y-3 relative z-10">
                  <p className="text-3xl font-black text-white uppercase italic tracking-tighter">Eternal Drop Zone</p>
                  <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-[5px]">Neural Ingest Engine v11.0</p>
               </div>

               <div className="flex gap-16 mt-4 opacity-30 group-hover:opacity-100 transition-opacity duration-1000">
                  <Film size={32} />
                  <Music size={32} />
                  <Star size={32} />
               </div>
            </div>

            {/* NEURAL CLOUD BRIDGE */}
            <div className="bg-white/2 border border-white/5 p-12 rounded-[64px] backdrop-blur-3xl space-y-12 shadow-2xl">
               <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[5px]">Neural Cloud Bridge</h3>
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/10">
                     <Signal size={12} className="text-blue-500" />
                     <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Handshake Active</span>
                  </div>
               </div>
               
               <div className="relative group">
                  <div className="absolute inset-y-0 left-8 flex items-center text-zinc-600 group-focus-within:text-blue-500 transition-colors">
                     <LinkIcon size={24} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="PASTE YOUTUBE / DRIVE / DROPBOX LINK..." 
                    className="w-full h-24 bg-black border border-white/5 rounded-[40px] pl-24 pr-12 text-sm font-black text-white uppercase tracking-widest outline-none focus:border-blue-500/30 transition-all placeholder:text-zinc-800 shadow-inner"
                  />
                  <button className="absolute right-4 top-4 bottom-4 px-10 bg-blue-600 text-white text-[11px] font-black uppercase rounded-3xl hover:bg-blue-500 transition-all shadow-xl italic tracking-widest">
                     Ingest
                  </button>
               </div>

               <div className="flex flex-wrap gap-6">
                  {[
                    { icon: <YoutubeIcon size={20} />, label: 'YouTube' },
                    { icon: <Globe size={20} />, label: 'Google Drive' },
                    { icon: <HardDrive size={20} />, label: 'Dropbox' }
                  ].map(btn => (
                    <button key={btn.label} className="flex-1 min-w-[160px] h-16 bg-white/2 border border-white/5 rounded-3xl flex items-center justify-center gap-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all shadow-xl">
                       {btn.icon} {btn.label}
                    </button>
                  ))}
               </div>
            </div>
         </div>

         {/* RIGHT: SMART ASSETS & QUEUE */}
         <div className="lg:col-span-5 bg-white/2 border border-white/5 rounded-[72px] backdrop-blur-3xl p-12 flex flex-col gap-12 sticky top-12 h-fit max-h-[85vh] shadow-3xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
               <div className="flex flex-col gap-1">
                  <h3 className="text-[11px] font-black text-white uppercase tracking-[5px]">Neural Job Queue</h3>
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[3px] italic">AI Auto-Labeling Enabled</span>
               </div>
               <button className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-zinc-700 hover:text-red-500 transition-all"><Trash2 size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
               <AnimatePresence initial={false}>
                  {tasks.length === 0 ? (
                    <div className="py-40 flex flex-col items-center justify-center text-center opacity-20 gap-8">
                       <RefreshCcw size={64} className="animate-spin-slow text-blue-500" />
                       <span className="text-[11px] font-black uppercase tracking-[6px]">Awaiting Neural Data</span>
                    </div>
                  ) : (
                    tasks.map(task => (
                      <motion.div 
                        key={task.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 bg-black/40 border border-white/5 rounded-[48px] space-y-6 group hover:border-blue-500/30 transition-all shadow-2xl relative overflow-hidden"
                      >
                         <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-5">
                               <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/10">
                                  {task.status === 'processing' ? <Loader2 size={24} className="animate-spin" /> : <FileVideo size={24} />}
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-[11px] font-black text-white uppercase truncate max-w-[180px] tracking-widest">{task.name}</span>
                                  <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[3px]">{task.size} • {task.format}</span>
                               </div>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${task.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                               {task.status} {task.retries > 0 && `(Retry ${task.retries})`}
                            </div>
                         </div>

                         {/* SMART LABELS */}
                         {task.labels.length > 0 && (
                            <div className="flex flex-wrap gap-2 relative z-10">
                               {task.labels.map(label => (
                                 <div key={label} className="px-3 py-1 bg-white/5 rounded-lg flex items-center gap-2 border border-white/5">
                                    <Tag size={10} className="text-blue-500" />
                                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
                                 </div>
                               ))}
                            </div>
                         )}

                         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${task.progress}%` }}
                              className="h-full bg-blue-500 shadow-[0_0_20px_#3b82f6]"
                            />
                         </div>
                      </motion.div>
                    ))
                  )}
               </AnimatePresence>
            </div>

            <button className="h-20 w-full bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-3xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-5 shadow-3xl italic">
               <Cpu size={20} />
               Engage Neural Synchronization
            </button>
         </div>

      </div>
    </div>
  );
}
