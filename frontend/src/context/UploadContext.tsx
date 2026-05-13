"use client";

import React, { createContext, useContext, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/components/Toast';

interface UploadAsset {
  id: string;
  name: string;
  type: string;
  url: string;
  thumbnail: string;
  progress: number;
}

interface UploadContextType {
  assets: UploadAsset[];
  isUploading: boolean;
  uploadFile: (file: File) => Promise<void>;
  importFromUrl: (url: string) => Promise<void>;
  deleteAsset: (id: string) => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export function UploadProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<UploadAsset[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useToast();

  const uploadFile = async (file: File) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showToast("Please login to upload", "error");
      return;
    }

    setIsUploading(true);
    const fileId = Math.random().toString(36).substring(7);
    const fileName = `${user.id}/${fileId}_${file.name}`;

    const { data, error } = await supabase.storage
      .from('videos')
      .upload(fileName, file);

    if (error) {
      showToast(`Upload failed: ${error.message}`, "error");
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl(fileName);

    const newAsset: UploadAsset = {
      id: fileId,
      name: file.name,
      type: file.type.includes('video') ? 'video' : 'audio',
      url: publicUrl,
      thumbnail: publicUrl,
      progress: 100
    };

    setAssets(prev => [newAsset, ...prev]);
    setIsUploading(false);
    showToast(`${file.name} added to Media Vault`, "success");
  };

  const importFromUrl = async (url: string) => {
    setIsUploading(true);
    // In production, we'd proxy this to the backend to download and upload to S3
    // For now, simulate the import
    const fileId = Math.random().toString(36).substring(7);
    const newAsset: UploadAsset = {
      id: fileId,
      name: `Imported_${fileId}.mp4`,
      type: 'video',
      url: url,
      thumbnail: url,
      progress: 100
    };

    setTimeout(() => {
      setAssets(prev => [newAsset, ...prev]);
      setIsUploading(false);
      showToast("Media imported from URL", "success");
    }, 1500);
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  return (
    <UploadContext.Provider value={{ assets, isUploading, uploadFile, importFromUrl, deleteAsset }}>
      {children}
    </UploadContext.Provider>
  );
}

export function useUpload() {
  const context = useContext(UploadContext);
  if (!context) throw new Error('useUpload must be used within UploadProvider');
  return context;
}
