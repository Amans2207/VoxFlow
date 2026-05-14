import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

export const useAutoSave = (state: any, key: string, interval: number = 10000) => {
  const lastSavedState = useRef(JSON.stringify(state));

  useEffect(() => {
    const timer = setInterval(() => {
      const currentState = JSON.stringify(state);
      
      if (currentState !== lastSavedState.current) {
        localStorage.setItem(`voxflow_autosave_${key}`, currentState);
        lastSavedState.current = currentState;
        
        // Subtle confirmation for high-value states
        console.log(`[VOXFLOW] Neural Save: ${key} synchronized.`);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [state, key, interval]);

  // Recovery Logic
  const recover = () => {
    const saved = localStorage.getItem(`voxflow_autosave_${key}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Neural Recovery Failure:", e);
        return null;
      }
    }
    return null;
  };

  return { recover };
};
