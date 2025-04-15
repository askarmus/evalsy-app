declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

let gtagLoaded = false;

const GA_MEASUREMENT_ID = "G-XXXXXXX"; // Replace this

function loadGtagScript() {
  if (gtagLoaded || typeof window === "undefined") return;
  gtagLoaded = true;

  const script1 = document.createElement("script");
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  const script2 = document.createElement("script");
  script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}');
    `;
  document.head.appendChild(script2);
}

export function trackPageView(pagePath: string) {
  loadGtagScript();
  window.gtag?.("event", "page_view", {
    page_path: pagePath,
  });
}
