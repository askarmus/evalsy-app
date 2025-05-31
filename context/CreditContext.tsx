'use client';

import { getCreditBalance } from '@/services/credits.service';
import React, { createContext, useContext, useEffect, useState } from 'react';

type CreditContextType = {
  credits: number;
  loading: boolean;
  refreshCredits: () => Promise<void>;
};

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export const CreditProvider = ({ children }: { children: React.ReactNode }) => {
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshCredits = async () => {
    setLoading(true);
    try {
      const balance = await getCreditBalance();
      setCredits(balance);
    } catch (err) {
      console.error('Failed to fetch credits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCredits();
  }, []);

  return <CreditContext.Provider value={{ credits, loading, refreshCredits }}>{children}</CreditContext.Provider>;
};

export const useCredits = () => {
  const context = useContext(CreditContext);
  if (!context) throw new Error('useCredits must be used within CreditProvider');
  return context;
};
