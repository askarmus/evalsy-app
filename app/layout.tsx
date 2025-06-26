'use client';

import '@/styles/globals.css';
import { usePathname } from 'next/navigation';
import { Providers } from './providers';
import { fontSans } from '@/config/fonts';
import clsx from 'clsx';
import { GoogleAnalytic } from '@/components/GoogleAnalytic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={clsx('font-sans antialiased scroll-smooth min-h-screen h-full', fontSans.className, isHome ? 'bg-gray-100' : 'bg-gray-100 dark:bg-black')}>
        <GoogleAnalytic />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
