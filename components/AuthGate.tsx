// components/wrappers/AuthGate.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { AuthContext } from '@/context/AuthContext';
import { CreditProvider } from '@/context/CreditContext';
import { Layout } from '@/components/layout/layout';
import { Logo } from '@/components/shared/logo';
import { Providers } from '@/app/providers';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { loading, authenticated, user } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Logo />
        <div className="text-center space-y-2">
          <div className="text-lg font-semibold text-gray-700 mt-6">Loading...</div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, loading, authenticated }}>
      <CreditProvider>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </CreditProvider>
    </AuthContext.Provider>
  );
}
