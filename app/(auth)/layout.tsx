import { AuthLayoutWrapper } from '@/components/auth/authLayout';
import '@/styles/globals.css';
import { Suspense } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[url('/02.svg')] bg-cover bg-center">
      <Suspense>
        <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
      </Suspense>
    </div>
  );
}
