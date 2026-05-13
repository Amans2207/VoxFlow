import { create } from 'zustand';

interface Clip {
  id: string;
  name: string;
  start: number;
  duration: number;
  track: number;
}

interface TimelineState {
  clips: Clip[];
  selectedClipId: string | null;
  playheadPosition: number;
  addClip: (clip: Clip) => void;
  removeClip: (id: string) => void;
  setPlayhead: (pos: number) => void;
  setSelectedClip: (id: string | null) => void;
  clearTimeline: () => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  clips: [],
  selectedClipId: null,
  playheadPosition: 0,
  
  addClip: (clip) => set((state) => ({ 
    clips: [...state.clips, clip] 
  })),
  
  removeClip: (id) => set((state) => ({ 
    clips: state.clips.filter(c => c.id !== id) 
  })),
  
  setPlayhead: (pos) => set({ playheadPosition: pos }),
  
  setSelectedClip: (id) => set({ selectedClipId: id }),
  
  clearTimeline: () => set({ clips: [], selectedClipId: null, playheadPosition: 0 }),
}));
