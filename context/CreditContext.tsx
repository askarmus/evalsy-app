'use client';

import { getCreditBalance } from '@/services/credits.service';
import React, { createContext, useContext, useEffect, useState } from 'react';

type CreditContextType = {
  credits: number;
  refreshCredits: () => Promise<void>;
};

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export const CreditProvider = ({ children }: { children: React.ReactNode }) => {
  const [credits, setCredits] = useState(0);

  const refreshCredits = async () => {
    try {
      const balance = await getCreditBalance();
      setCredits(balance);
    } catch (err) {
      console.error('Failed to fetch credits:', err);
    }
  };

  useEffect(() => {
    refreshCredits();
  }, []);

  return <CreditContext.Provider value={{ credits, refreshCredits }}>{children}</CreditContext.Provider>;
};

export const useCredits = () => {
  const context = useContext(CreditContext);
  if (!context) throw new Error('useCredits must be used within CreditProvider');
  return context;
};
