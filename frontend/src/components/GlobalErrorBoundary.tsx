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
 * NEURAL ERROR BOUNDARY (v16.2.6 Sync)
 * Hardened to prevent ReferenceErrors from crashing the entire app.
 */
export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Neural Error Boundary] Caught Failure:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen bg-black flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-[#0A0A0B] border border-red-500/20 rounded-[32px] p-10 flex flex-col items-center gap-6 shadow-2xl">
            <AlertTriangle size={48} className="text-red-500" />
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">System Error Detected</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
              The Neural Link has encountered an anomaly. Access to this module is temporarily restricted.
            </p>
            <div className="w-full flex flex-col gap-3 mt-4">
              <button 
                onClick={() => window.location.reload()}
                className="w-full h-12 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[3px] flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} /> Reboot Interface
              </button>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="w-full h-12 bg-white/5 border border-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-[3px] flex items-center justify-center gap-2"
              >
                <Home size={14} /> Return to Core
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
