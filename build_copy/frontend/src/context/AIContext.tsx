"use client";

import React, { createContext, useContext, useState } from 'react';

interface AIContextType {
  isProcessing: boolean;
  message: string;
  startProcessing: (msg: string) => void;
  stopProcessing: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const startProcessing = (msg: string) => {
    setMessage(msg);
    setIsProcessing(true);
  };

  const stopProcessing = () => {
    setIsProcessing(false);
  };

  return (
    <AIContext.Provider value={{ isProcessing, message, startProcessing, stopProcessing }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (!context) throw new Error('useAI must be used within AIProvider');
  return context;
}
