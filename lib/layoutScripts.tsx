// Bootstrap block shared by both root layouts
// (`app/(localized)/[lang]/layout.tsx` and `app/(system)/layout.tsx`).
// Extracted so the two layouts cannot drift.

import Script from 'next/script';
import { ResourceHints } from '@/components/seo/resource-hints';
import { ADSENSE_ENABLED, ADSENSE_SCRIPT_ORIGIN } from '@/lib/adsenseConfig';

// No-flash theme bootstrap. Runs before first paint so <html> already carries
// the correct class.
//
// Dark is the product default and the assumption in the absence of explicit
// user input. ONLY a stored value of exactly "light" produces light mode —
// the OS `prefers-color-scheme` is deliberately NOT consulted, so a visitor on
// a light desktop still gets the darkroom. A legacy "system" value from the old
// Vite app resolves to dark rather than following the OS.
//
// Keep the storage key in sync with components/theme-provider.tsx
// ("vite-ui-theme") — changing it would reset every returning user's choice.
const THEME_INIT = `
(function(){try{
  var t = localStorage.getItem('vite-ui-theme');
  document.documentElement.classList.add(t === 'light' ? 'light' : 'dark');
}catch(e){document.documentElement.classList.add('dark');}})();
`;

// Consent Mode v2 defaults — every signal denied before any tag runs.
//
// `lib/consent/consentModeBridge.ts` upgrades them via gtag('consent','update')
// once our own first-party state resolves. Note the direction: our state is the
// SOURCE OF TRUTH and Consent Mode is the mirror. The previous implementation had
// this inverted — it wrapped window.gtag and inferred consent from whoever called
// it — which meant consent state depended on a Google API we do not control and
// which never fires at all on the review build (no AdSense script → no Funding
// Choices → no update → everything stayed denied forever).
//
// `wait_for_update: 500` gives our resolution a window before GA4 acts on the
// defaults. functionality_storage and security_storage stay granted: they cover
// the strictly-necessary storage (theme, quota/abuse identifiers) that consent
// does not gate.
const GTAG_CONSENT_BOOTSTRAP = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500
});
gtag('js', new Date());
gtag('config', 'G-6J910CMHRY', { send_page_view: false });
`;

// The two bootstraps as raw HTML, NOT as React-rendered <script> elements.
//
// Why: the `[lang]` segment's value is part of the router tree key, so a locale
// navigation REMOUNTS the localized root layout. React refuses to execute
// <script> host elements it mounts on the client and warns ("Encountered a
// script tag while rendering React component") — previously these were
// `next/script strategy="beforeInteractive"` tags, which render real inline
// <script> elements and tripped that warning on every language switch.
//
// Serving them through `dangerouslySetInnerHTML` on a hidden wrapper means:
//   - initial load: the tags stream inside the server HTML and execute
//     synchronously during parse — before first paint, and earlier than the
//     old `beforeInteractive` queue (`self.__next_s`) processed them;
//   - client remounts: browsers never execute scripts injected via innerHTML,
//     which is exactly the once-only semantics a bootstrap needs, and React
//     never owns a <script> host element so nothing warns.
// Order matters and is preserved: theme first, consent defaults second.
const BOOTSTRAP_SCRIPTS_HTML = `<script id="theme-init">${THEME_INIT}</script><script id="gtag-consent">${GTAG_CONSENT_BOOTSTRAP}</script>`;

/**
 * Resource hints + inline bootstraps + GA4 loader for a root layout `<body>`.
 * Render as the first child of `<body>` in BOTH root layouts.
 */
export function LayoutBootstrap() {
  return (
    <>
      {/*
        Third-party origins worth warming.

        The AdSense preconnect is conditional on ADSENSE_ENABLED, the same
        top-level flag lib/adsenseConfig.ts gates every ad request on. On the
        review build no adsbygoogle.js ever loads, and an unconditional hint
        there holds a socket open for an origin the page never contacts —
        Lighthouse reports it as an unused preconnect and it competes with the
        requests the page does make. When ads are on, the slot is above the
        fold and the DNS+TLS handshake is on the critical path to filling the
        reserved height, so the full preconnect is right.

        googletagmanager gets a DNS prefetch only: GA4 loads lazily, so
        resolving the name early is enough. (ReactDOM float methods dedupe, so
        the layout remount on locale navigation is harmless here.)
      */}
      <ResourceHints
        preconnect={
          ADSENSE_ENABLED
            ? [{ href: ADSENSE_SCRIPT_ORIGIN, crossOrigin: 'anonymous' }]
            : []
        }
        dnsPrefetch={['https://www.googletagmanager.com']}
      />
      {/* Theme class before first paint + consent defaults before GA — see
          BOOTSTRAP_SCRIPTS_HTML above for why this is raw HTML. The wrapper is
          `hidden` so the flex-col <body> never sees it as a layout box. */}
      <div hidden dangerouslySetInnerHTML={{ __html: BOOTSTRAP_SCRIPTS_HTML }} />
      {/*
        gtag/js is 149 KB of third-party JavaScript and nothing on the page
        waits for it — the consent defaults and the dataLayer stub above are
        what matter early, and both are inline. `lazyOnload` moves it past the
        load event instead of competing with the app's own hydration during
        the interactive window. next/script's load cache dedupes by src, so a
        layout remount cannot load it twice.

        GA4 now receives exactly three events (page_view, sign_up,
        job_completed), forwarded by lib/analytics/ga4.ts from the first-party
        SDK. It is a CROSS-CHECK, not a second analytics system: if our own
        numbers and GA4's diverge beyond a sampling-and-blocking band, one of
        them is broken. Events are dispatched through the dataLayer, which
        buffers until the tag arrives, so nothing is lost to the lazy load.
      */}
      <Script
        id="ga4"
        src="https://www.googletagmanager.com/gtag/js?id=G-6J910CMHRY"
        strategy="lazyOnload"
      />
    </>
  );
}
