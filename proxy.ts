import { NextResponse, type NextRequest } from 'next/server';

import { isSupportedPrefix, translatorHomeLocale } from './i18n/locales';

/**
 * Locale routing proxy (Next 16's successor to middleware.ts).
 *
 * The localized route tree lives at `app/(localized)/[lang]/**`, prerendered
 * for every locale. Public URLs map onto it like this:
 *
 * - English keeps its original unprefixed URLs: `/about` is REWRITTEN
 *   (internally, invisibly) to `/en/about`. Existing indexed URLs never change.
 * - An explicit `/en/...` request is permanently REDIRECTED to the unprefixed
 *   URL so English never serves the same content at two live URLs.
 * - Any registered prefix (`/ru/...`, `/zh-cn/...`, `/pt-br/...`; the list is
 *   `i18n/locales.ts`) passes through untouched and hits its static pages.
 * - `/dr/**`, `/embed/**`, `/motion/**` (the chromeless Motion editor, MM42),
 *   `/api/**`, Next internals and static files are excluded via the matcher
 *   (and re-checked below, defensively). The checks are exact (`/motion` or
 *   `/motion/…`), so a future `/motion-*` page and `/tools/motion` stay localized.
 *
 * Deliberately NO locale detection: no Accept-Language sniffing, no cookie
 * reads, no automatic redirects. A crawler and a user requesting the same URL
 * always receive identical content (SEO/AdSense safety). The visitor's stored
 * language preference only informs client-side UI.
 *
 * Translator deployments (MM56; `NEXT_PUBLIC_DEPLOY_ROLE=translator` with a
 * valid `NEXT_PUBLIC_TRANSLATOR_LOCALE`, resolved by `translatorHomeLocale()`)
 * open in their own locale instead: an unprefixed path is TEMPORARILY
 * redirected (307) to the locale's prefix (`/` → `/de`, `/about` → `/de/about`,
 * query kept), and `/en/...` is served as-is so the translator can still read
 * the English source (the language selector links there). The decision is env
 * based, not visitor based, so the no-detection rule above still holds. In
 * production the role is inlined as `''`, `translatorHomeLocale()` is `null`
 * and both branches below are skipped.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Defensive re-checks of what the matcher already excludes.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname === '/dr' ||
    pathname.startsWith('/dr/') ||
    pathname === '/embed' ||
    pathname.startsWith('/embed/') ||
    pathname === '/motion' ||
    pathname.startsWith('/motion/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const translatorHome = translatorHomeLocale();

  // /en/... → permanent redirect to the canonical unprefixed URL (production).
  // Translator deployments serve it instead: it is their English view.
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    if (translatorHome) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice('/en'.length) || '/';
    return NextResponse.redirect(url, 308);
  }

  const first = pathname.split('/')[1];

  // Any registered prefix (i18n/locales.ts) — already locale-prefixed.
  if (first && isSupportedPrefix(first)) {
    return NextResponse.next();
  }

  // Translator deployment: unprefixed → the deployment's locale (temporary, so
  // nothing caches it beyond the deployment that issued it).
  if (translatorHome) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/' ? `/${translatorHome.prefix}` : `/${translatorHome.prefix}${pathname}`;
    return NextResponse.redirect(url, 307);
  }

  // Unprefixed public path → serve the prerendered English tree.
  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? '/en' : `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, API routes, the non-localized /dr, /embed and /motion trees,
  // and anything with a file extension (static assets, sw.js, robots.txt,
  // sitemap.xml, icons). Everything else flows through the locale logic above.
  matcher: ['/((?!_next|api/|dr$|dr/|embed$|embed/|motion$|motion/|.*\\.).*)'],
};
