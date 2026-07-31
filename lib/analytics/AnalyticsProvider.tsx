'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/lib/auth/AuthProvider';
import { initConsent } from '@/lib/consent';

import { analytics } from './client';
import { EngagementTracker } from './engagement';
import { initGlobalErrorHandlers } from './errors';
import { EVENTS, pageTypeFromPathname } from './events';
import { initGA4Bridge } from './ga4';
import { initWebVitals } from './webVitals';

/**
 * The single mount point for the analytics SDK.
 *
 * Mounted INSIDE AuthProvider and ONLY in the non-chromeless branch of
 * `app/providers.tsx`. Both constraints matter: inside AuthProvider so it can read the
 * tier and the sign-in state, and non-chromeless because `/embed/*` (the CreaTV iframe)
 * and `/dr/*` (the Double Raven portal) must remain 100% analytics-free — no SDK, no
 * consent UI, no GA4.
 *
 * Responsibilities:
 *   - start the client (outbox recovery, heartbeat, flush triggers)
 *   - resolve consent
 *   - page_view / page_leave on every route change
 *   - the engagement tracker that produces `active_ms`
 *   - identify on sign-in, reset on sign-out, tier into context
 *   - wire web vitals, global error handlers, and the GA4 bridge
 */

/**
 * Dev QA harness (Phase 7E): the event inspector panel, lazy-loaded.
 *
 * The literal NODE_ENV check is the ENTIRE production story: bundlers evaluate
 * it at build time, the ternary collapses to `null`, and the `import()` —
 * along with devTools, devValidation, and zod's runtime — is dead-code
 * -eliminated. If the inspector chunk ever appears in `next build` output,
 * this guard is what broke.
 *
 * A conditionally-rendered lazy component next to {children} rather than a
 * portal: same visual result (the panel is position:fixed anyway), no portal
 * container management, and nothing for the React Compiler lint to object to.
 * AnalyticsProvider only mounts in the non-chromeless branch of
 * app/providers.tsx, so /embed/* and /dr/* never load any of this — the same
 * structural guarantee the rest of the SDK relies on.
 */
const DevEventInspector =
  process.env.NODE_ENV !== 'production'
    ? React.lazy(() => import('@/components/analytics/dev-event-inspector'))
    : null;

/** Run non-critical setup when the browser is idle, with a timeout fallback. */
function onIdle(callback: () => void, timeout = 2000): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const ric = (
    window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    }
  ).requestIdleCallback;

  if (typeof ric === 'function') {
    const handle = ric(callback, { timeout });
    return () => {
      const cancel = (window as typeof window & { cancelIdleCallback?: (h: number) => void })
        .cancelIdleCallback;
      if (typeof cancel === 'function') cancel(handle);
    };
  }
  const timer = window.setTimeout(callback, Math.min(timeout, 1500));
  return () => window.clearTimeout(timer);
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Tolerates null: this provider is only mounted inside AuthProvider today, but a
  // component that throws when its optional parent is absent is a trap for whoever moves
  // it next.
  const auth = useAuth();

  const trackerRef = React.useRef<EngagementTracker | null>(null);
  const initialViewSentRef = React.useRef(false);
  const identifiedUidRef = React.useRef<string | null>(null);
  // Gates the lazy inspector so its chunk loads on IDLE rather than at
  // hydration — the harness must never compete with the page for first paint,
  // even in dev.
  const [devToolsReady, setDevToolsReady] = React.useState(false);

  /* --- Start the client + resolve consent ------------------------------- */
  React.useEffect(() => {
    const stop = analytics.start();
    // Resolve consent immediately, not on idle: until it resolves nothing is captured, so
    // deferring it would deliberately discard the first seconds of every visit.
    void initConsent();

    const detachErrors = initGlobalErrorHandlers(analytics);
    const detachGA4 = initGA4Bridge(analytics);
    // Vitals are the one genuinely deferrable piece: their observers do real work and
    // nothing depends on them being attached in the first frame.
    const cancelIdle = onIdle(() => initWebVitals(analytics));

    // Dev-only + idle + dynamic import: the QA harness (validation warner +
    // inspector controller). The literal guard is what dead-code-eliminates
    // all of it — including zod — from the production bundle.
    let detachDevTools: (() => void) | undefined;
    let cancelDevIdle: (() => void) | undefined;
    if (process.env.NODE_ENV !== 'production') {
      cancelDevIdle = onIdle(() => {
        import('./devTools')
          .then((mod) => {
            detachDevTools = mod.initDevTools(analytics);
            setDevToolsReady(true);
          })
          .catch(() => {
            // House rule: analytics (and its tooling) never throws.
          });
      });
    }

    return () => {
      cancelDevIdle?.();
      detachDevTools?.();
      cancelIdle();
      detachGA4();
      detachErrors();
      stop();
    };
  }, []);

  /* --- Tier into context ------------------------------------------------ */
  React.useEffect(() => {
    if (!auth) return;
    // Every event snapshots the tier, so this must be current BEFORE the page_view below
    // fires. Effect order within a component is declaration order, which is why this sits
    // above the route effect.
    analytics.setContext({ tier: auth.tier });
  }, [auth, auth?.tier]);

  /* --- identify / reset on auth state ---------------------------------- */
  React.useEffect(() => {
    if (!auth) return;
    const uid = auth.user?.uid ?? null;

    if (uid && uid !== identifiedUidRef.current) {
      identifiedUidRef.current = uid;
      analytics.identify(uid, { tier: auth.tier });
      return;
    }
    if (!uid && identifiedUidRef.current) {
      identifiedUidRef.current = null;
      analytics.reset();
    }
  }, [auth, auth?.user?.uid, auth?.tier]);

  /* --- Route tracking: page_view + page_leave --------------------------- */
  React.useEffect(() => {
    if (!pathname) return;

    // Close out the previous page first. On the initial mount there is no previous page,
    // so this is a no-op.
    const previous = trackerRef.current;
    if (previous) {
      analytics.track(EVENTS.PAGE_LEAVE, previous.snapshot());
      previous.stop();
    }

    const tracker = new EngagementTracker((pct) => analytics.track(EVENTS.SCROLL_DEPTH, { pct }));
    trackerRef.current = tracker;
    tracker.start();

    const sendPageView = () => {
      analytics.setContext({ page_type: pageTypeFromPathname(pathname) });
      analytics.track(EVENTS.PAGE_VIEW, {
        // The title is owned by the Next.js Metadata API, so it is only correct after the
        // route commits — which is why the non-initial fire waits a frame.
        page_title: typeof document !== 'undefined' ? document.title : undefined,
        is_initial: !initialViewSentRef.current,
      });
    };

    // Preserved from the previous implementation, and the reasoning still holds: the
    // FIRST page view fires synchronously so it is not lost if the visitor leaves
    // immediately, while subsequent ones wait a frame for the new document.title to be in
    // place. Firing the first one a frame late loses the bounce visits entirely.
    if (!initialViewSentRef.current) {
      initialViewSentRef.current = true;
      sendPageView();
      return () => undefined;
    }

    const raf = requestAnimationFrame(sendPageView);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  /* --- page_leave on teardown ------------------------------------------ */
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const flushLeave = () => {
      const tracker = trackerRef.current;
      if (!tracker) return;
      analytics.track(EVENTS.PAGE_LEAVE, tracker.snapshot());
      // The client's own pagehide handler does the synchronous flush; this only has to
      // make sure the event is in the queue before it runs. Listener order within the same
      // event type is registration order, and the client registers first (its effect runs
      // above this one), so belt-and-braces: ask for a flush explicitly.
      analytics.flushSync();
    };

    const onPageHide = () => flushLeave();
    const onHidden = () => {
      if (document.visibilityState === 'hidden') flushLeave();
    };

    window.addEventListener('pagehide', onPageHide);
    document.addEventListener('visibilitychange', onHidden);
    return () => {
      window.removeEventListener('pagehide', onPageHide);
      document.removeEventListener('visibilitychange', onHidden);
    };
  }, []);

  /* --- Stop the tracker on unmount ------------------------------------- */
  React.useEffect(
    () => () => {
      trackerRef.current?.stop();
      trackerRef.current = null;
    },
    [],
  );

  return (
    <>
      {children}
      {DevEventInspector && devToolsReady ? (
        <React.Suspense fallback={null}>
          <DevEventInspector />
        </React.Suspense>
      ) : null}
    </>
  );
}

export default AnalyticsProvider;
