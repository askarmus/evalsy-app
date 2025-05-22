import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { fontSans } from '@/config/fonts';
import clsx from 'clsx';
import { GoogleAnalytic } from '@/components/GoogleAnalytic';

export const metadata: Metadata = {
  title: 'Evalsy - AI-Powered Intelligent Interview Automation',
  description: 'From resume-to-role matching to dynamic interview creation, Evalsy helps you find top talent faster—boosting efficiency and reducing hiring friction.',
  openGraph: {
    title: 'Evalsy - AI-Powered Intelligent Interview Automation',
    description: '75% Faster Hiring • 80% Cost Savings • 99% Match Accuracy. Evalsy makes hiring smart, fast, and scalable.',
    url: 'https://www.Evalsy.com', // Replace with your actual domain
    siteName: 'Evalsy',
    images: [
      {
        url: 'https://www.evalsy.com/og-image.jpg', // Replace with your image path
        width: 1200,
        height: 630,
        alt: 'Evalsy – AI Interview Automation',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Evalsy - AI-Powered Intelligent Interview Automation',
    description: 'Smarter hiring with Evalsy. 75% faster, 80% cheaper, 99% match accuracy.',
    images: ['https://www.Evalsy.com/og-image.jpg'], // Same or different image
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
