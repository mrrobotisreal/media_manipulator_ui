/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ANALYTICS_BASE_URL?: string;
  readonly VITE_MP_TOKEN?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_FB_API_KEY?: string;
  readonly VITE_FB_AUTH_DOMAIN?: string;
  readonly VITE_FB_PROJECT_ID?: string;
  readonly VITE_FB_STORAGE_BUCKET?: string;
  readonly VITE_FB_MESSAGING_SENDER_ID?: string;
  readonly VITE_FB_APP_ID?: string;
  readonly VITE_FB_MEASUREMENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

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
