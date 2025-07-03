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
    <body className={clsx('font-sans antialiased scroll-smooth min-h-screen h-full', fontSans.className, isHome ? 'bg-[#fbfbfb]' : 'bg-gray-100 dark:bg-black')}>
      <GoogleAnalytic />
      <Providers>{children}</Providers>
      <script src="//code.tidio.co/vpfusp81s6dcbg2k75locpwid8f1pmjl.js" async></script>
    </body>
  );
}
