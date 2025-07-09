'use client';

import { useEffect } from 'react';
import { GoogleAnalytic } from '@/components/GoogleAnalytic';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Inject Tidio
    const script = document.createElement('script');
    script.src = '//code.tidio.co/vpfusp81s6dcbg2k75locpwid8f1pmjl.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up Tidio DOM elements and script
      const tidioScript = document.querySelector('script[src*="tidio"]');
      if (tidioScript) tidioScript.remove();

      const tidioIframe = document.getElementById('tidio-chat');
      if (tidioIframe) tidioIframe.remove();

      // Optional: if Tidio injects multiple children, clean by class
      document.querySelectorAll('[class^="tidio"]').forEach((el) => el.remove());
    };
  }, []);

  return (
    <>
      <GoogleAnalytic />
      {children}
    </>
  );
}
