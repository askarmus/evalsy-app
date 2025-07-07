import AuthGate from '@/components/AuthGate';

import '@/styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
