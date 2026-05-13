"use client";

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { useUserStore } from '@/store/useUserStore';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser } = useUserStore();

  const [activeSocket, setActiveSocket] = React.useState<Socket | null>(null);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    const socket = io(API_BASE);
    setActiveSocket(socket);

    socket.on('connect', () => {
      console.log('[Neural Link] Connected to Titan-X Bridge');
      if (user?.email) {
        socket.emit('join_room', user.email);
      }
    });

    socket.on('system_broadcast', (data: { message: string, type: string }) => {
      toast(data.message, {
        icon: data.type === 'alert' ? '🚨' : data.type === 'warn' ? '⚠️' : '📢',
        style: {
          background: '#0A0A0B',
          color: data.type === 'alert' ? '#ef4444' : data.type === 'warn' ? '#f59e0b' : '#00e5ff',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '10px',
          fontWeight: 'black',
          textTransform: 'uppercase'
        },
        duration: 5000
      });
    });

    socket.on('credit_update', (data: { new_balance: number, message: string }) => {
      // 1. Update User Store (Account Balance)
      if (user) {
        setUser({ ...user, credits: data.new_balance });
      }
      
      // 2. Update Editor Store (Creative Credits)
      const { setCreditBalance } = require('@/store/useEditorStore').useEditorStore.getState();
      setCreditBalance(data.new_balance);

      toast.success(data.message, {
        icon: '⚡',
        style: { background: '#0A0A0B', color: '#00e5ff', border: '1px solid rgba(0, 229, 255, 0.2)', fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase' }
      });
    });

    // GLOBAL NEURAL ERROR LISTENER (From api.ts)
    const handleNeuralError = (e: any) => {
      toast.error(`Neural Link Failure: ${e.detail}`, {
        id: 'global-error',
        style: { background: '#0A0A0B', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase' }
      });
    };
    window.addEventListener('neural_error', handleNeuralError);

    return () => {
      socket.disconnect();
      window.removeEventListener('neural_error', handleNeuralError);
    };
  }, [user, setUser]);

  return (
    <SocketContext.Provider value={activeSocket}>
      {children}
    </SocketContext.Provider>
  );
};
