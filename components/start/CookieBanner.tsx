'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else if (consent === 'accept') {
      loadAnalytics();
    }
  }, []);

  const loadAnalytics = () => {
    // Example: Load Google Analytics
    if (document.getElementById('ga-script')) return;

    const script = document.createElement('script');
    script.id = 'ga-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    script.onload = () => {
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
      }
      (window as any).gtag = gtag;
      gtag('js', new Date());
      gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
    };
  };

  const handleConsent = (choice: 'accept' | 'reject') => {
    localStorage.setItem('cookieConsent', choice);
    setShowBanner(false);

    if (choice === 'accept') {
      loadAnalytics();
    } else {
      // Remove all cookies
      document.cookie.split(';').forEach((c) => {
        document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-3xl mx-auto bg-gray-900 text-white p-4 rounded-lg shadow-lg z-50 flex items-center justify-between">
      <p className="text-sm text-gray-200 max-w-2xl leading-snug">
        We use cookies to improve your experience and analyze traffic. You can accept or reject non-essential cookies.{' '}
        <Link href="/privacy-policy" className="underline text-blue-400">
          Learn more
        </Link>
        .
      </p>
      <div className="flex gap-2 ml-4 shrink-0">
        <button onClick={() => handleConsent('accept')} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition">
          Accept
        </button>
        <button onClick={() => handleConsent('reject')} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition">
          Reject
        </button>
      </div>
    </div>
  );
}
