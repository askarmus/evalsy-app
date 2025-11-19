'use client';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { usePathname } from 'next/navigation';

export const GoogleAnalytic = () => {
  const pathname = usePathname();

  // ✅ Only load GA on homepage, terms, and privacy-policy pages
  const allowedPaths = ['/', '/terms', '/privacy-policy'];

  if (!allowedPaths.includes(pathname!)) return null;

  return <GoogleAnalytics trackPageViews gaMeasurementId="G-LSFGG83LRT" debugMode={false} />;
};
