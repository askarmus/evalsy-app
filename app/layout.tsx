import { GoogleAnalytic } from '@/components/GoogleAnalytic';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import '@/styles/globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Evalsy – AI Interview Platform for Smarter, Faster Hiring',
  description: 'Evalsy helps companies automate interviews, screen candidates, and generate instant reports — making hiring 75% faster and smarter with AI.',
  openGraph: {
    title: 'Evalsy – AI Interview Platform for Smarter, Faster Hiring',
    description: 'Automate your hiring with Evalsy’s AI-driven interviews, candidate scoring, and instant report sharing.',
    url: 'https://www.evalsy.com',
    siteName: 'Evalsy',
    type: 'article',
    images: [
      {
        url: 'https://www.evalsy.com/og-image-new-v1.png',
        width: 1200,
        height: 630,
        alt: 'Evalsy – AI Interview Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Evalsy – Smarter Hiring with AI Interviews',
    description: 'AI interviews, resume screening, and instant insights — all in one platform. Try Evalsy today!',
    images: ['https://www.evalsy.com/og-image-new.png'],
  },
  authors: [{ name: 'Evalsy Team', url: 'https://www.evalsy.com/about' }],
  metadataBase: new URL('https://www.evalsy.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children} </body>
    </html>
  );
}
