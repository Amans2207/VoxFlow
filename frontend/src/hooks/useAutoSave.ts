"use client";

import { useEffect } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { toast } from 'react-hot-toast';

/**
 * useAutoSave: Background Persistence Logic
 * Triggers a state save every 30 seconds to ensure zero data loss.
 */
export function useAutoSave(intervalMs: number = 30000) {
    const triggerAutoSave = useEditorStore((state) => state.triggerAutoSave);
    const lastSaved = useEditorStore((state) => state.lastSaved);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log("[Stability Protocol] Triggering 30s Auto-Save...");
            triggerAutoSave();
            
            // Subtle toast for user confidence (can be disabled if too noisy)
            // toast.success("Neural State Persisted", { 
            //     id: 'autosave', 
            //     icon: '💾',
            //     style: { fontSize: '10px', background: '#0A0A0B', color: '#fff', border: '1px solid rgba(255,255,255,0.05)' } 
            // });
        }, intervalMs);

        return () => clearInterval(interval);
    }, [triggerAutoSave, intervalMs]);

    return { lastSaved };
}
