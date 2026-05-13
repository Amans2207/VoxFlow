"use client";

import { useEffect, useState } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { toast } from 'react-hot-toast';

/**
 * Neural Core: Status Polling System
 * Listens for task completion in the background to prevent infinite loading.
 */
export function useNeuralPolling(jobId: string | null) {
  const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'COMPLETED' | 'FAILED'>('IDLE');
  const [progress, setProgress] = useState(0);
  const { setEngineStatus } = useEditorStore();

  useEffect(() => {
    if (!jobId) return;

    setStatus('PROCESSING');
    setEngineStatus('Online');

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/status/${jobId}`);
        const data = await response.json();

        if (data.status === 'completed') {
          setStatus('COMPLETED');
          setProgress(100);
          toast.success("Neural Render Complete ⚡");
          clearInterval(interval);
        } else if (data.status === 'failed') {
          setStatus('FAILED');
          toast.error("Neural Core Failure");
          clearInterval(interval);
        } else {
          setProgress(data.progress || 0);
        }
      } catch (err) {
        console.warn("[Polling] Connection lost, retrying...");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId, setEngineStatus]);

  return { status, progress };
}

/**
 * Neural Core: Hard Refresh Logic
 * Handles ChunkLoadError to prevent HMR crashes during production scaling.
 */
export function useHardRefresh() {
  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      if (e.message.includes("ChunkLoadError") || e.message.includes("Loading chunk")) {
        console.warn("[Neural Core] Critical Chunk Failure. Executing Hard Refresh...");
        window.location.reload();
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
}
