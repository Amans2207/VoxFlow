"use client";

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Camera, Upload, Smartphone, Zap, 
  CheckCircle2, Loader2, Image as ImageIcon,
  Video, CloudLightning, ArrowUpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '@/utils/SoundEngine';

export default function MobileNeuralLink() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    soundEngine?.play("click");
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'video/*': [], 'image/*': [] } });

  const handleUpload = async () => {
    setUploading(true);
    soundEngine?.play("processing");
    // Simulate mobile to cloud upload
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
      soundEngine?.play("success");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center font-sans overflow-hidden">
      <div className="absolute inset-0 bg-blue-500/5 blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-10 relative z-10"
      >
        <div className="text-center space-y-2">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
              <Smartphone size={14} className="text-blue-500" />
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Neural Mobile Link</span>
           </div>
           <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">VoxFlow <span className="text-blue-500">Cloud.</span></h1>
           <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Shoot on phone. Edit on Desktop.</p>
        </div>

        {success ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0A0A0B] border border-green-500/30 p-12 rounded-[40px] flex flex-col items-center text-center gap-6"
          >
             <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={40} />
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-black uppercase text-white">Upload Ingested!</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Check your Desktop Neural Vault.</p>
             </div>
             <button onClick={() => setSuccess(false)} className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest">Upload More</button>
          </motion.div>
        ) : (
          <div className="space-y-6">
             <div 
               {...getRootProps()}
               className="h-64 border-2 border-dashed border-white/5 bg-[#0A0A0B] rounded-[40px] flex flex-col items-center justify-center gap-4 transition-all active:scale-95"
             >
                <input {...getInputProps()} />
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                   <Camera size={32} />
                </div>
                <div className="text-center">
                   <p className="text-xs font-black text-white uppercase tracking-widest">Capture or Select Files</p>
                   <p className="text-[9px] text-zinc-700 font-bold uppercase mt-1 tracking-widest">Multiple gallery assets supported</p>
                </div>
             </div>

             {files.length > 0 && (
                <div className="grid grid-cols-4 gap-3 max-h-32 overflow-y-auto">
                   {files.map((f, i) => (
                      <div key={i} className="aspect-square bg-white/5 rounded-xl flex items-center justify-center text-zinc-600 border border-white/5">
                         {f.type.startsWith('video') ? <Video size={16} /> : <ImageIcon size={16} />}
                      </div>
                   ))}
                </div>
             )}

             <button 
               onClick={handleUpload}
               disabled={files.length === 0 || uploading}
               className="w-full h-16 bg-blue-600 text-white rounded-[24px] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl hover:bg-blue-500 transition-all"
             >
                {uploading ? <Loader2 size={18} className="animate-spin" /> : <ArrowUpCircle size={18} />}
                {uploading ? "Neural Sync in Progress..." : `Upload ${files.length} Assets`}
             </button>
          </div>
        )}

        <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 text-center">
           <div className="flex items-center justify-center gap-2 mb-2">
              <CloudLightning size={12} className="text-blue-500" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">End-to-End Encrypted</span>
           </div>
           <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-[2px]">Secured by Neural Link v4.0</p>
        </div>
      </motion.div>
    </div>
  );
}
