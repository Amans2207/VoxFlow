"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, CheckCircle2, Loader2, X, Smartphone, RefreshCcw, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

export default function MobileCapture() {
  const [isRecording, setIsRecording] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setPreviewUrl(URL.createObjectURL(file));
    uploadToNeuralVault(file);
  };

  const uploadToNeuralVault = async (file: File) => {
    setUploadStatus('uploading');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 10 : prev));
      }, 300);

      const res: any = await api.upload('/api/v1/mobile/upload', formData);
      clearInterval(interval);
      
      setProgress(100);
      setUploadStatus('completed');
      toast.success("Sync Complete: Asset land in Desktop Vault.");
    } catch (e) {
      setUploadStatus('idle');
      toast.error("Handshake Failed. Retry.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center font-sans overflow-hidden">
      
      <div className="w-full max-w-md space-y-12 text-center">
        {/* V8.0 HEADER */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">Neural <span className="text-blue-500">Capture</span></h1>
          <div className="flex items-center justify-center gap-2">
             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
             <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[4px]">V8.0 Cross-Device Bridge</span>
          </div>
        </div>

        {/* CAPTUBE CORE */}
        <div className="relative group">
           <div className="absolute inset-0 bg-blue-500/10 blur-3xl opacity-50 rounded-full" />
           <div className="relative aspect-square w-64 h-64 bg-[#0A0A0B] border border-white/5 rounded-full mx-auto flex items-center justify-center shadow-2xl overflow-hidden group">
              <AnimatePresence mode="wait">
                {uploadStatus === 'idle' && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    key="idle"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-4 cursor-pointer"
                  >
                     <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500">
                        <Camera size={40} />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Tap to Shoot</span>
                  </motion.div>
                )}

                {uploadStatus === 'uploading' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key="uploading"
                    className="flex flex-col items-center gap-6"
                  >
                     <Loader2 size={48} className="text-blue-500 animate-spin" />
                     <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white mb-2">Syncing to PC...</span>
                        <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                           <motion.div animate={{ width: `${progress}%` }} className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                        </div>
                     </div>
                  </motion.div>
                )}

                {uploadStatus === 'completed' && (
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key="completed"
                    className="flex flex-col items-center gap-4"
                  >
                     <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                        <CheckCircle2 size={40} />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Linked to Vault</span>
                     <button onClick={() => setUploadStatus('idle')} className="mt-4 px-6 py-2 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-zinc-500">Capture New</button>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        {/* DASHBOARD PREVIEW MOCK */}
        <div className="grid grid-cols-2 gap-4 pt-12">
           <div className="p-6 bg-[#0A0A0B] border border-white/5 rounded-[32px] space-y-4">
              <Smartphone size={24} className="text-blue-500 mx-auto" />
              <div className="space-y-1">
                 <p className="text-[9px] font-black uppercase text-white">Active Bridge</p>
                 <p className="text-[8px] font-bold uppercase text-zinc-600">iPhone 15 Pro</p>
              </div>
           </div>
           <div className="p-6 bg-[#0A0A0B] border border-white/5 rounded-[32px] space-y-4">
              <Zap size={24} className="text-blue-500 mx-auto" />
              <div className="space-y-1">
                 <p className="text-[9px] font-black uppercase text-white">Neural Speed</p>
                 <p className="text-[8px] font-bold uppercase text-zinc-600">850 Mbps</p>
              </div>
           </div>
        </div>

        <input 
          type="file" 
          accept="video/*,image/*" 
          capture="environment"
          ref={fileInputRef} 
          onChange={handleCapture} 
          className="hidden" 
        />
      </div>

      {/* FOOTER NAV MOCK */}
      <div className="fixed bottom-10 left-10 right-10 flex items-center justify-center gap-12 text-zinc-600 text-[10px] font-black uppercase tracking-widest italic opacity-50">
         <span>Capture</span>
         <span className="text-white border-b-2 border-blue-500 pb-2">Vault</span>
         <span>Post</span>
      </div>
    </div>
  );
}
