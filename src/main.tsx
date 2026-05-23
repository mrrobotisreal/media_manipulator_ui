import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './Router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import mixpanel from "mixpanel-browser"
import { initWebVitals } from '@/lib/webVitals'
import { hasAnalyticsConsent, initConsentListener, onConsentChange } from '@/lib/consent'

// Hook into gtag's consent updates before any tracker is set up so Mixpanel
// / GA event helpers can early-return when consent is denied.
initConsentListener();

// Mixpanel is initialized lazily after first paint so it never blocks LCP,
// and only after the user has granted analytics consent. Mixpanel SDK calls
// fired before init are buffered internally.
let mixpanelInitialized = false;
const tryInitMixpanel = () => {
  if (mixpanelInitialized) return;
  if (typeof window === 'undefined') return;
  if (!import.meta.env.VITE_MP_TOKEN) return;
  if (!hasAnalyticsConsent()) return;
  try {
    mixpanel.init(import.meta.env.VITE_MP_TOKEN, {
      debug: false,
      // Page-view tracking is owned by RouteAnalytics (Router.tsx). Letting
      // the SDK auto-track here would double-fire.
      track_pageview: false,
      persistence: "localStorage",
    });
    mixpanelInitialized = true;
  } catch {
    // Mixpanel must never block the editing flow.
  }
};

if (typeof window !== 'undefined') {
  const ric = (
    window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }
  ).requestIdleCallback;
  if (typeof ric === 'function') {
    ric(tryInitMixpanel, { timeout: 3000 });
  } else {
    window.setTimeout(tryInitMixpanel, 1500);
  }
  // Re-attempt init when the user grants consent later in the session.
  onConsentChange(tryInitMixpanel);
}

initWebVitals();

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
