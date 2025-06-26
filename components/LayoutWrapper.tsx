'use client';

import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { fontSans } from '@/config/fonts';
import { GoogleAnalytic } from '@/components/GoogleAnalytic';
import { Providers } from '@/app/providers';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <body className={clsx('font-sans antialiased scroll-smooth min-h-screen h-full', fontSans.className, isHome ? 'bg-gray-100' : 'bg-gray-100 dark:bg-black')}>
      <GoogleAnalytic />
      <Providers>{children}</Providers>
    </body>
  );
}
