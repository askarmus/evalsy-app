import { LayoutWrapper } from '@/components/LayoutWrapper';
import '@/styles/globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Evalsy – AI Interview Platform for Smarter, Faster Hiring',
  description: 'Automate your hiring with Evalsy’s AI interview platform...',
  icons: {
    icon: '/favicon-32x32.png',
  },
  openGraph: {
    title: 'Evalsy – AI Interview Platform for Smarter, Faster Hiring',
    description: 'Evalsy automates interviews...',
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
    description: 'Screen candidates 75% faster...',
    images: ['https://www.evalsy.com/og-image.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <LayoutWrapper>{children}</LayoutWrapper>
    </html>
  );
}
