import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { fontSans } from '@/config/fonts';
import clsx from 'clsx';
import { GoogleAnalytic } from '@/components/GoogleAnalytic';

export const metadata: Metadata = {
  title: 'Evalsy – AI Interview Platform for Smarter, Faster Hiring',
  description: 'Automate your hiring with Evalsy’s AI interview platform. Screen candidates 75% faster, reduce costs by 80%, and achieve 99% match accuracy. Try a free demo today.',
  icons: {
    icon: '/favicon-32x32.png',
  },
  openGraph: {
    title: 'Evalsy – AI Interview Platform for Smarter, Faster Hiring',
    description: 'Evalsy automates interviews and screens candidates using AI — saving 80% hiring costs and improving match accuracy to 99%. Hire better, faster.',
    url: 'https://www.evalsy.com',
    siteName: 'Evalsy',
    images: [
      {
        url: 'https://www.evalsy.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Evalsy – AI Interview Platform',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Evalsy – Smarter Hiring with AI Interviews',
    description: 'Screen candidates 75% faster and improve hiring accuracy with Evalsy’s AI-powered interview automation. Try a free demo today.',
    images: ['https://www.evalsy.com/og-image.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={clsx('font-sans antialiased', fontSans.className, 'scroll-smooth', 'bg-gray-100 dark:bg-black', 'min-h-screen h-full')}>
        <GoogleAnalytic />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
