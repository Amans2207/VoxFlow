"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Zap, ShieldAlert, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-[#050505] p-10">
          <div className="flex flex-col items-center gap-10 max-w-xl text-center">
             <div className="w-24 h-24 bg-red-600/10 rounded-[32px] flex items-center justify-center border border-red-600/20 shadow-[0_0_50px_rgba(220,38,38,0.1)]">
                <ShieldAlert size={48} className="text-red-600" />
             </div>
             <div className="flex flex-col gap-4">
                <h1 className="text-4xl font-black uppercase tracking-[-2px] text-white">Neural Engine <span className="text-red-600">Interrupted</span></h1>
                <p className="text-[10px] font-black uppercase tracking-[6px] text-[#404040]">Quantum Runtime Error Detected</p>
             </div>
             <button 
               onClick={() => window.location.reload()}
               className="flex items-center gap-3 px-8 py-3 bg-white text-black text-[10px] font-black uppercase rounded-xl hover:bg-red-600 hover:text-white transition-all"
             >
                <RotateCcw size={14} /> Restart Neural Core
             </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
