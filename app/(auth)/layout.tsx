import { AuthLayoutWrapper } from '@/components/auth/authLayout';
import '@/styles/globals.css';
import { Suspense } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="home_v2">
      <Suspense>
        <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
      </Suspense>
    </div>
  );
}
