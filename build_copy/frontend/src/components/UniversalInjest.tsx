"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, Folder, CloudLightning, X, CheckCircle2 } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { toast } from "react-hot-toast";

interface UniversalInjestProps {
  onComplete?: () => void;
  allowedTypes?: Record<string, string[]>;
}

export default function UniversalInjest({ onComplete, allowedTypes }: UniversalInjestProps) {
  const { addAssetsToQueue, globalUploadQueue } = useEditorStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    toast.success(`Ingesting ${acceptedFiles.length} Assets into Titan-X...`);
    addAssetsToQueue(acceptedFiles);
    
    if (onComplete) onComplete();
  }, [addAssetsToQueue, onComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: allowedTypes,
    noClick: false,
    noKeyboard: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`relative min-h-[300px] bg-[#0A0A0B] rounded-[48px] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center p-10 cursor-pointer group overflow-hidden ${
        isDragActive ? "border-[#00e5ff] bg-[#00e5ff0a] scale-[0.98]" : "border-white/5 hover:border-white/20"
      }`}
    >
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
          isDragActive ? "bg-[#00e5ff] text-black rotate-12" : "bg-white/2 text-zinc-700 group-hover:text-white"
        }`}>
          {isDragActive ? <CloudLightning size={32} /> : <Upload size={32} />}
        </div>
        
        <div className="flex flex-col items-center gap-2">
           <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
              {isDragActive ? "Release for Ingestion" : "Universal Injest"}
           </h3>
           <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[4px] max-w-[250px] text-center leading-relaxed">
              Drag Files or Folders to Sync with Titan-X Cloud Storage
           </p>
        </div>

        <div className="flex gap-4">
           <div className="px-4 py-2 bg-white/2 rounded-xl border border-white/5 flex items-center gap-2">
              <File size={12} className="text-zinc-600" />
              <span className="text-[8px] font-black text-zinc-600 uppercase">Batch Files</span>
           </div>
           <div className="px-4 py-2 bg-white/2 rounded-xl border border-white/5 flex items-center gap-2">
              <Folder size={12} className="text-zinc-600" />
              <span className="text-[8px] font-black text-zinc-600 uppercase">Full Folders</span>
           </div>
        </div>
      </div>

      {/* Neural Background Decoration */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <div className="absolute top-0 left-0 w-32 h-32 bg-[#00e5ff] rounded-full blur-[100px]"></div>
         <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#a855f7] rounded-full blur-[100px]"></div>
      </div>

      <input {...getInputProps()} />
    </div>
  );
}
