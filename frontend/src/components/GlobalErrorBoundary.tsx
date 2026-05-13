"use client";

import React from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { AlertTriangle, RefreshCcw } from "lucide-react";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-10 bg-[#0A0A0B] border border-red-500/20 rounded-[48px] text-center gap-6 shadow-2xl">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 animate-pulse">
        <AlertTriangle size={40} />
      </div>
      <div className="flex flex-col gap-2">
         <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Neural Module Crash</h2>
         <p className="text-[10px] font-black text-[#404040] uppercase tracking-widest max-w-md">
            The neural engine encountered an unhandled exception. <br />
            Error: <span className="text-red-500/80">{(error as any)?.message || String(error)}</span>
         </p>
      </div>
      <button 
        onClick={resetErrorBoundary}
        className="flex items-center gap-3 px-8 py-4 bg-white text-black text-[11px] font-black uppercase rounded-2xl hover:bg-red-500 hover:text-white transition-all"
      >
        <RefreshCcw size={16} />
        Restart Module
      </button>
    </div>
  );
}

export default function GlobalErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app so the error doesn't happen again
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
