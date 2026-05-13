"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import API_BASE, { robustFetch as safeFetch } from '@/utils/api';

interface CreditsContextType {
  balance: number;
  refreshBalance: () => Promise<void>;
  deductCredits: (amount: number) => Promise<boolean>;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const CreditsProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [balance, setBalance] = useState<number>(305.0);


  const refreshBalance = async () => {
    if (!session?.user?.email) return;
    try {
      const data = await safeFetch(`/api/user/credits?email=${session.user.email}`);
      setBalance(data.credits);
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  };

  const deductCredits = async (amount: number) => {
    if (!session?.user?.email) return false;
    try {
      const data = await safeFetch(`/api/user/credits/deduct?email=${session.user.email}&amount=${amount}`, {
        method: 'POST',
      });
      if (data.status === 'success') {
        setBalance(data.new_balance);
        return true;
      } else {
        throw new Error(data.message || "Insufficient Balance");
      }
    } catch (err: any) {
      console.error("Failed to deduct credits:", err);
      throw err;
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
