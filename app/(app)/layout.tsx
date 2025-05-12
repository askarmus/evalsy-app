'use client';

import { Layout } from '@/components/layout/layout';
import { CreditManager } from '@/components/settings/components/credits/credits/CreditManager';
import { Logo } from '@/components/shared/logo';
import { AuthContext } from '@/context/AuthContext';
import { CreditProvider } from '@/context/CreditContext';
import { useAuth } from '@/hooks/useAuth';
import '@/styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { loading, authenticated, user } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Logo />
        <div className="text-center space-y-2">
          <div className="text-xl font-semibold text-gray-700 mt-6">Loading...</div>
        </div>
      </div>
    );
  }

  // If not authenticated after loading, prevent render (user already redirected)
  if (!authenticated) {
    return null; // Don't render anything, wait for redirect
  }

  return (
    <AuthContext.Provider value={{ user, loading, authenticated }}>
      <CreditProvider>
        <CreditManager />
        <Layout>{children}</Layout>
      </CreditProvider>
    </AuthContext.Provider>
  );
}
