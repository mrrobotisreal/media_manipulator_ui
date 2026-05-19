import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './Router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import mixpanel from "mixpanel-browser"
import { initWebVitals } from '@/lib/webVitals'

// Mixpanel is initialized lazily after first paint so it never blocks LCP.
// Events fired before init are buffered by mixpanel-browser internally.
const initMixpanel = () => {
  if (!import.meta.env.VITE_MP_TOKEN) return;
  if (typeof window === 'undefined') return;
  try {
    mixpanel.init(import.meta.env.VITE_MP_TOKEN, {
      debug: false,
      track_pageview: true,
      persistence: "localStorage",
    });
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
    ric(initMixpanel, { timeout: 3000 });
  } else {
    window.setTimeout(initMixpanel, 1500);
  }
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
