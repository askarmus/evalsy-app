'use client';

import { useEffect } from 'react';

export default function TidioChat() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//code.tidio.co/vpfusp81s6dcbg2k75locpwid8f1pmjl.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
