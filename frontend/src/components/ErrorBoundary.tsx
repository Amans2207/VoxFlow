"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { RefreshCcw, ShieldAlert, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Neural Bridge Collapse:", error, errorInfo);
  }

  private handleReboot = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-8 font-sans">
          <div className="max-w-xl w-full bg-[#0A0A0B] border border-red-500/20 rounded-[64px] p-12 text-center space-y-10 shadow-[0_0_100px_rgba(239,68,68,0.1)]">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto animate-pulse">
               <ShieldAlert size={48} />
            </div>
            
            <div className="space-y-4">
               <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Neural Bridge Collapse.</h2>
               <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[4px] leading-relaxed">
                  A critical exception was detected in the UI layer. <br />
                  Error: {this.state.error?.message || "Unknown Logic Anomaly"}
               </p>
            </div>

            <button 
              onClick={handleReboot}
              className="h-20 w-full bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-3xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-4 shadow-2xl"
            >
               <RefreshCcw size={18} />
               Engage Neural Reboot
            </button>

            <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest italic">Clearing Local Cache & Resyncing Session...</p>
          </div>
        </div>
      );
    }

    return this.children;
  }
}

export default ErrorBoundary;
