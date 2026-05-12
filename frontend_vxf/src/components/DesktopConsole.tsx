"use client";

import React, { useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { Monitor, Camera, Download, Trash2, CheckCircle2, ShieldCheck } from "lucide-react";

export default function DesktopConsole() {
  const [isNative, setIsNative] = useState(typeof window !== 'undefined' && !!(window as any).electronAPI);
  const [showRecorder, setShowRecorder] = useState(false);

  const [gpuBoost, setGpuBoost] = useState(true);
  const [liveMonitor, setLiveMonitor] = useState(false);
  const { soundEngine } = require("@/utils/SoundEngine");
  const { showToast } = require("@/components/Toast").useToast();

  const toggleGpu = () => {
    soundEngine?.play("click");
    setGpuBoost(!gpuBoost);
    showToast(`Hardware Acceleration ${!gpuBoost ? 'Optimized' : 'Paused'}`, "info");
  };

  const toggleMonitor = () => {
    soundEngine?.play("click");
    setLiveMonitor(!liveMonitor);
    if (!liveMonitor) {
       soundEngine?.play("process");
       showToast("Initializing High-Fidelity Signal Monitor...", "info");
    }
  };

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl,
  } = useReactMediaRecorder({ screen: true, audio: true });


  if (!isNative) return null;

  return (
    <div className="mt-8 p-6 bg-blue-600/10 border border-blue-500/30 rounded-3xl backdrop-blur-xl relative overflow-hidden">
      {/* GPU Badge */}
      <div className="absolute top-4 right-6 flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
        <ShieldCheck className="w-4 h-4 text-blue-400" />
        <span className="text-[10px] font-bold text-blue-400 tracking-widest uppercase">GPU Acceleration Active</span>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
          <Monitor className="text-white w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Titan Desktop Console</h3>
          <p className="text-sm text-blue-400">Native Screen Recording & Hardware Encoding enabled.</p>
        </div>
      </div>

      <div className="flex gap-6 mb-8 p-4 bg-black/20 rounded-2xl border border-white/5">
        <div className="flex items-center gap-4">
          <div 
            onClick={toggleGpu}
            className={`w-12 h-6 rounded-full cursor-pointer transition-all relative ${gpuBoost ? 'bg-blue-600' : 'bg-white/10'}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all ${gpuBoost ? 'translate-x-6' : ''}`} />
          </div>
          <span className="text-xs font-bold text-white uppercase tracking-widest">GPU Boost</span>
        </div>

        <div className="flex items-center gap-4 border-l border-white/10 pl-6">
          <div 
            onClick={toggleMonitor}
            className={`w-12 h-6 rounded-full cursor-pointer transition-all relative ${liveMonitor ? 'bg-blue-600' : 'bg-white/10'}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all ${liveMonitor ? 'translate-x-6' : ''}`} />
          </div>
          <span className="text-xs font-bold text-white uppercase tracking-widest">Live Monitor</span>
        </div>
      </div>


      <div className="flex gap-4">
        {!showRecorder ? (
          <button 
            onClick={() => setShowRecorder(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all"
          >
            <Camera className="w-5 h-5" />
            Open Screen Recorder
          </button>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-between mb-4 p-4 bg-black/40 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${status === 'recording' ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
                <span className="text-sm font-medium capitalize text-white">{status}</span>
              </div>
              <div className="flex gap-2">
                {status !== 'recording' ? (
                  <button onClick={startRecording} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold">Start Capture</button>
                ) : (
                  <button onClick={stopRecording} className="px-4 py-2 bg-white text-black rounded-lg text-sm font-bold">Stop & Save</button>
                )}
                <button onClick={() => setShowRecorder(false)} className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm">Close</button>
              </div>
            </div>

            {mediaBlobUrl && (
              <div className="mt-4 p-4 bg-black/40 rounded-2xl border border-blue-500/20">
                <p className="text-xs font-bold text-blue-400 mb-2 tracking-widest uppercase">Recording Captured</p>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <video src={mediaBlobUrl} className="w-32 h-20 rounded-lg object-cover border border-white/10" controls />
                      <span className="text-xs text-white/60">VoxFlow_Capture_{new Date().getTime()}.mp4</span>
                   </div>
                   <div className="flex gap-2">
                      <a href={mediaBlobUrl} download={`VoxFlow_Capture_${new Date().getTime()}.mp4`} className="p-2 bg-blue-600 text-white rounded-lg hover:scale-105 transition-transform">
                        <Download className="w-5 h-5" />
                      </a>
                      <button onClick={clearBlobUrl} className="p-2 bg-white/5 text-white/60 rounded-lg hover:text-red-400 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
