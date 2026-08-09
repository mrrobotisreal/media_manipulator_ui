// Inline bootstrap scripts shared by both root layouts
// (`app/(localized)/[lang]/layout.tsx` and `app/(system)/layout.tsx`).
// Extracted so the two layouts cannot drift.

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
export const THEME_INIT = `
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
export const GTAG_CONSENT_BOOTSTRAP = `
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
