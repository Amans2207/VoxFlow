"use client";

import React, { useState, useCallback } from "react";
import { Upload, X, File, CheckCircle2, CloudLightning } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { toast } from "react-hot-toast";

interface UniversalDropzoneProps {
  onUploadComplete: (files: any[]) => void;
  accept?: string;
}

export default function UniversalDropzone({ onUploadComplete, accept = "video/*,image/*,audio/*" }: UniversalDropzoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { setUploadProgress, uploadingAssets } = useEditorStore();

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadAll = async () => {
    if (files.length === 0) return;
    
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    toast.loading(`Uploading ${files.length} assets...`, { id: "upload" });

    try {
      // Simulation of parallel upload
      for (let i = 0; i < files.length; i++) {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(files[i].name, progress);
          if (progress >= 100) clearInterval(interval);
        }, 200);
      }

      // Mocking API response
      setTimeout(() => {
        toast.success("All assets uploaded successfully!", { id: "upload" });
        onUploadComplete(files);
        setFiles([]);
      }, 3000);

    } catch (error) {
      toast.error("Upload failed. Try again.", { id: "upload" });
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`w-full h-64 border-2 border-dashed rounded-[40px] flex flex-col items-center justify-center gap-4 transition-all ${
          isDragging ? "border-[#00e5ff] bg-[#00e5ff05] scale-[1.02]" : "border-white/10 bg-black/50"
        }`}
      >
        <div className="w-16 h-16 bg-[#00e5ff22] rounded-full flex items-center justify-center text-[#00e5ff] mb-2">
          <Upload size={32} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-[12px] font-black text-white uppercase tracking-widest">Drag & Drop Multiple Assets</p>
          <p className="text-[9px] font-medium text-zinc-600 uppercase tracking-widest text-center">Video, Audio, Images (Up to 1GB each)</p>
        </div>
        <input 
          type="file" 
          multiple 
          accept={accept} 
          className="hidden" 
          id="multi-upload" 
          onChange={handleFileSelect}
        />
        <label htmlFor="multi-upload" className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white cursor-pointer hover:bg-white/10 transition-all">
          Browse Files
        </label>
      </div>

      {files.length > 0 && (
        <div className="bg-[#0A0A0B] border border-white/5 rounded-[40px] p-8 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-2">
              <h4 className="text-xl font-black text-white uppercase tracking-tighter">Upload Queue</h4>
              <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">{files.length} Assets Ready</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setFiles([])} className="text-[9px] font-black text-red-500 uppercase tracking-widest">Clear All</button>
              <button onClick={uploadAll} className="px-8 py-3 bg-[#00e5ff] text-black text-[9px] font-black uppercase rounded-xl flex items-center gap-2">
                <CloudLightning size={14} />
                Upload All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
            {files.map((file, idx) => (
              <div key={idx} className="p-4 bg-black border border-white/5 rounded-2xl flex items-center gap-4 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-zinc-600">
                  <File size={20} />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-white uppercase truncate w-32">{file.name}</span>
                    <span className="text-[8px] font-bold text-[#00e5ff]">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#00e5ff] shadow-[0_0_10px_#00e5ff] transition-all duration-500" 
                      style={{ width: `${uploadingAssets[file.name] || 0}%` }}
                    ></div>
                  </div>
                </div>
                <button onClick={() => removeFile(idx)} className="p-2 text-zinc-800 hover:text-red-500">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
