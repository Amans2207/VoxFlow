"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface CreditsContextType {
  balance: number;
  refreshBalance: () => Promise<void>;
  deductCredits: (amount: number) => Promise<void>;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const CreditsProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [balance, setBalance] = useState<number>(305.0);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

  const refreshBalance = async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(`${API_BASE}/api/user/credits?email=${session.user.email}`);
      const data = await res.json();
      setBalance(data.credits);
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  };

  const deductCredits = async (amount: number) => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(`${API_BASE}/api/user/credits/deduct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email, amount }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setBalance(data.new_balance);
      }
    } catch (err) {
      console.error("Failed to deduct credits:", err);
    }
  };

  useEffect(() => {
    refreshBalance();
  }, [session]);

  return (
    <CreditsContext.Provider value={{ balance, refreshBalance, deductCredits }}>
      {children}
    </CreditsContext.Provider>
  );
};

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (!context) throw new Error("useCredits must be used within a CreditsProvider");
  return context;
};
