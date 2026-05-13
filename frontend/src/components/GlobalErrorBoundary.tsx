"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * NEURAL ERROR BOUNDARY
 * Prevents the entire Titan-X interface from collapsing on component failure.
 * Hardened for Next.js 16.2.6 Production environments.
 */
class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Neural Error] Uncaught failure:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
          <div className="max-w-2xl w-full bg-[#0A0A0B] border border-red-500/20 rounded-[48px] p-12 flex flex-col items-center text-center gap-8 shadow-2xl">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500">
              <AlertTriangle size={40} />
            </div>
            
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Neural Link <span className="text-red-500">Severed</span></h1>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] leading-relaxed">
                A critical failure occurred within the interface pipeline. The core remains stable, but this view has been isolated to prevent corruption.
              </p>
            </div>

            <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl w-full text-left">
               <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Error Signature</p>
               <code className="text-xs text-zinc-400 block break-all font-mono">
                  {this.state.error?.message || "Unknown Neural Anomaly"}
               </code>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full mt-4">
              <button 
                onClick={() => window.location.reload()}
                className="flex-1 h-14 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[4px] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
              >
                <RefreshCw size={16} /> Reconnect
              </button>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="flex-1 h-14 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[4px] flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
              >
                <Home size={16} /> Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
