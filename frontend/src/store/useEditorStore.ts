import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

export interface Clip {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'image' | 'text';
  startTime: number;
  duration: number;
  properties?: {
    volume: number;
    speed: number;
    scale: number;
    opacity: number;
  };
}

export interface Track {
  id: string;
  clips: Clip[];
}

interface EditorState {
  selectedTool: 'V' | 'C' | 'B' | 'T' | 'P';
  activeProjectTab: 'Layers' | 'Bin' | 'Analytics' | 'Nodes' | 'Color';
  engineStatus: 'Online' | 'Offline' | 'Connecting' | 'Reconnecting';
  creditBalance: number;
  renderCount: number;
  videoTracks: Track[];
  audioTracks: Track[];
  selectedClipId: string | null;
  isProcessing: boolean;
  lipsyncSync: boolean;
  smartBRoll: boolean;
  viralScore: number;
  engagementAdvice: string;
  uploadingAssets: Record<string, number>;
  globalUploadQueue: string[];
  retryQueue: string[];
  lastSaved: number | null;
  uploadedVideoUrl: string | null;
  activeJobId: string | null;
  targetLang: string;
  selectedVoice: string;

  // Actions
  setSelectedTool: (tool: 'V' | 'C' | 'B' | 'T' | 'P') => void;
  setEngineStatus: (status: 'Online' | 'Offline' | 'Connecting' | 'Reconnecting') => void;
  setVideoTracks: (tracks: Track[]) => void;
  setAudioTracks: (tracks: Track[]) => void;
  setSelectedClipId: (id: string | null) => void;
  setIsProcessing: (loading: boolean) => void;
  setLipsyncSync: (sync: boolean) => void;
  setSmartBRoll: (active: boolean) => void;
  incrementRenders: () => void;
  deductCredits: (amount: number) => void;
  setUploadProgress: (fileName: string, progress: number) => void;
  addToUploadQueue: (fileName: string) => void;
  removeFromUploadQueue: (fileName: string) => void;
  splitClip: (trackId: string, clipId: string, time: number) => void;
  extractAudioFromClip: (clipId: string) => void;
  generateMagicProject: (prompt: string) => void;
  resetProject: () => void;
  addAssetsToQueue: (files: File[]) => void;
  triggerAutoSave: () => void;
  setUploadedVideoUrl: (url: string | null) => void;
  setActiveJobId: (id: string | null) => void;
  setTargetLang: (lang: string) => void;
  setSelectedVoice: (voice: string) => void;
  addToRetryQueue: (fileName: string) => void;
  removeFromRetryQueue: (fileName: string) => void;
  setCreditBalance: (amount: number) => void;
  fetchCreditBalance: (email: string) => Promise<void>;
  setUploadedVideoUrl: (url: string | null) => void;
  setActiveJobId: (id: string | null) => void;
  setUploadProgress: (fileName: string, progress: number) => void;
  addToUploadQueue: (fileName: string) => void;
  removeFromUploadQueue: (fileName: string) => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      selectedTool: 'V',
      activeProjectTab: 'Layers',
      engineStatus: 'Online',
      videoTracks: [
        { id: 'V1', clips: [{ id: 'c1', name: 'Raw_Footage_01.mp4', duration: 60, startTime: 0, type: 'video' }] },
        { id: 'V2', clips: [] },
      ],
      audioTracks: [
        { id: 'A1', clips: [] },
        { id: 'A2', clips: [] },
      ],
      selectedClipId: null,
      isProcessing: false,
      lipsyncSync: false,
      smartBRoll: false,
      viralScore: 85,
      engagementAdvice: '',
      uploadingAssets: {},
      globalUploadQueue: [],
      retryQueue: [],
      lastSaved: Date.now(),
      creditBalance: 500.0,
      renderCount: 12,
      uploadedVideoUrl: null,
      activeJobId: null,
      targetLang: 'hi',
      selectedVoice: 'v1',

      setSelectedTool: (tool) => set({ selectedTool: tool }),
      setEngineStatus: (status) => set({ engineStatus: status }),
      setVideoTracks: (tracks) => set({ videoTracks: tracks }),
      setAudioTracks: (tracks) => set({ audioTracks: tracks }),
      setSelectedClipId: (id) => set({ selectedClipId: id }),
      setIsProcessing: (loading) => set({ isProcessing: loading }),
      setLipsyncSync: (sync) => set({ lipsyncSync: sync }),
      setSmartBRoll: (active) => set({ smartBRoll: active }),
      incrementRenders: () => set((state) => ({ renderCount: state.renderCount + 1 })),
      deductCredits: async (amount) => {
        const email = "aman@voxflow.ai"; // In production, get from session
        try {
          const response: any = await api.post('/user/credits/deduct', {
            email,
            amount
          });
          if (response.status === 'success') {
            set({ creditBalance: response.new_balance });
          }
        } catch (error) {
          console.error("[Neural Bridge] Credit deduction failure:", error);
          set((state) => ({ creditBalance: state.creditBalance - amount }));
        }
      },

      fetchCreditBalance: async (email: string) => {
        try {
          const response: any = await api.get(`/user/credits?email=${email}`);
          if (response.credits !== undefined) {
            set({ creditBalance: response.credits });
          }
        } catch (error) {
          console.error("[Neural Bridge] Credit fetch failure:", error);
        }
      },
      
      setCreditBalance: (amount) => set({ creditBalance: amount }),
      setUploadedVideoUrl: (url) => set({ uploadedVideoUrl: url }),
      setActiveJobId: (id) => set({ activeJobId: id }),
      setUploadProgress: (fileName, progress) => set((state) => ({
        uploadingAssets: { ...state.uploadingAssets, [fileName]: progress }
      })),
      
      addToUploadQueue: (fileName) => set((state) => ({
        globalUploadQueue: [...state.globalUploadQueue, fileName]
      })),
      
      removeFromUploadQueue: (fileName) => set((state) => ({
        globalUploadQueue: state.globalUploadQueue.filter(f => f !== fileName)
      })),

      addToRetryQueue: (fileName) => set((state) => ({
        retryQueue: [...state.retryQueue, fileName]
      })),

      removeFromRetryQueue: (fileName) => set((state) => ({
        retryQueue: state.retryQueue.filter(f => f !== fileName)
      })),

      addAssetsToQueue: (files: File[]) => {
        files.forEach(file => {
          set((state) => ({
            uploadingAssets: { ...state.uploadingAssets, [file.name]: 0 }
          }));
          
          let progress = 0;
          const interval = setInterval(() => {
            // Stability Protocol: Simulated Network Flicker
            const flickerOccurred = Math.random() < 0.05; // 5% chance of flicker
            
            if (flickerOccurred) {
               clearInterval(interval);
               set((state) => ({
                  retryQueue: [...state.retryQueue, file.name]
               }));
               console.warn(`[Neural Bridge] Flicker detected for ${file.name}. Queued for retry.`);
               return;
            }

            progress += Math.random() * 20;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              set((state) => {
                const newAssets = { ...state.uploadingAssets };
                delete newAssets[file.name];
                return { uploadingAssets: newAssets };
              });
            } else {
              set((state) => ({
                uploadingAssets: { ...state.uploadingAssets, [file.name]: Math.round(progress) }
              }));
            }
          }, 800);
        });
      },

      retryFailedUploads: () => set((state) => {
         const toRetry = [...state.retryQueue];
         // Logic to restart uploads... (Simplified for demo)
         return { retryQueue: [] };
      }),

      extractAudioFromClip: (clipId: string) => set((state) => {
        const sourceClip = state.videoTracks.flatMap(t => t.clips).find(c => c.id === clipId);
        if (!sourceClip) return state;

        const newAudioClip: Clip = {
          id: `a-${Date.now()}`,
          name: `Extracted: ${sourceClip.name}`,
          type: 'audio',
          startTime: sourceClip.startTime,
          duration: sourceClip.duration,
          properties: { volume: 1.0, speed: 1.0, scale: 1.0, opacity: 1.0 }
        };

        const newAudioTracks = [...state.audioTracks];
        if (newAudioTracks.length > 0) {
          newAudioTracks[0].clips.push(newAudioClip);
        }

        return { 
          audioTracks: newAudioTracks,
          creditBalance: state.creditBalance - 5.0
        };
      }),

      splitClip: (trackId, clipId, time) => set((state) => {
        return { ...state };
      }),

      generateMagicProject: (prompt: string) => {
        set({ isProcessing: true });
        setTimeout(() => {
          set((state) => ({
            videoTracks: [
              { id: 'V1', clips: [
                { id: 'm1', name: 'Scene 1: Intro', duration: 10, startTime: 0, type: 'video' },
                { id: 'm2', name: 'Scene 2: Core Concept', duration: 25, startTime: 10, type: 'video' }
              ] },
              { id: 'V2', clips: [{ id: 'b1', name: 'B-Roll: Cinematic', duration: 15, startTime: 15, type: 'video' }] }
            ],
            audioTracks: [
              { id: 'A1', clips: [{ id: 'au1', name: 'AI Voiceover', duration: 35, startTime: 0, type: 'audio' }] },
              { id: 'A2', clips: [{ id: 'au2', name: 'Background Beats', duration: 35, startTime: 0, type: 'audio' }] }
            ],
            creditBalance: state.creditBalance - 50.0,
            isProcessing: false
          }));
        }, 3000);
      },

      triggerAutoSave: () => set({ lastSaved: Date.now() }),

      resetProject: () => set({
        videoTracks: [{ id: 'V1', clips: [] }, { id: 'V2', clips: [] }],
        audioTracks: [{ id: 'A1', clips: [] }, { id: 'A2', clips: [] }],
        selectedClipId: null
      }),
    }),
    {
      name: 'voxflow-titan-storage',
    }
  )
);
