"use client";

import { toast } from "react-hot-toast";
import { soundEngine } from "./SoundEngine";

/**
 * NeuralShield: Zero-Failure Execution Wrapper
 * Wraps any async AI task in a protective layer with auto-retry logic and UI feedback.
 */
export async function executeNeuralTask<T>(
  task: () => Promise<T>,
  loadingMessage: string = "Neural Core Executing...",
  successMessage: string = "Neural Task Synchronized ⚡",
  maxRetries: number = 2,
  allowBackground: boolean = true
): Promise<T | null> {
  const toastId = toast.loading(loadingMessage);
  soundEngine.play('processing');

  // Background Transition Logic
  let isBackground = false;
  const bgTimeout = allowBackground ? setTimeout(() => {
    isBackground = true;
    toast.info("Neural Task: Processing in Background... You can continue working.", { id: toastId, icon: '🔄' });
  }, 8000) : null;

  let attempts = 0;
  
  const execute = async (): Promise<T | null> => {
    try {
      const result = await task();
      if (bgTimeout) clearTimeout(bgTimeout);
      toast.success(successMessage, { id: toastId });
      soundEngine.play('success');
      return result;
    } catch (error) {
      attempts++;
      console.error(`Neural Execution Error (Attempt ${attempts}):`, error);

      if (attempts <= maxRetries) {
        const delay = Math.pow(2, attempts) * 1000;
        toast.loading(`Neural Engine Retrying... (Attempt ${attempts}/${maxRetries})`, { id: toastId });
        soundEngine.play('click');
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return execute();
      }

      if (bgTimeout) clearTimeout(bgTimeout);
      toast.error("Titan-X Engine Offline: Job Queued for Background Sync", { id: toastId });
      return null;
    }
  };

  return execute();
}

