// Ambient global declarations shared across the app.
//
// These mirror the runtime globals injected by the Google Tag / GA4 snippet
// and AdSense's adsbygoogle.js (loaded in app/layout.tsx). Declared here so
// components can read window.gtag / window.adsbygoogle / window.googlefc
// without per-file casts.

// Google Funding Choices runtime — exposed by AdSense's adsbygoogle.js when
// Privacy & messaging is enabled in the AdSense dashboard. Used by the
// "Cookie settings" link in the footer to re-show the consent banner.
interface GoogleFundingChoices {
  callbackQueue?: Array<(() => void) | { [key: string]: unknown }>;
  showRevocationMessage?: () => void;
}

interface Window {
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
  adsbygoogle: Record<string, unknown>[];
  googlefc?: GoogleFundingChoices;
}
