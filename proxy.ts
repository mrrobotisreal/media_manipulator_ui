import { NextResponse, type NextRequest } from 'next/server';

import { isSupportedPrefix } from './i18n/locales';

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
 * - `/ru|uk|he|de|es/...` pass through untouched and hit their static pages.
 * - `/dr/**`, `/embed/**`, `/api/**`, Next internals and static files are
 *   excluded via the matcher (and re-checked below, defensively).
 *
 * Deliberately NO locale detection: no Accept-Language sniffing, no cookie
 * reads, no automatic redirects. A crawler and a user requesting the same URL
 * always receive identical content (SEO/AdSense safety). The visitor's stored
 * language preference only informs client-side UI.
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
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // /en/... → permanent redirect to the canonical unprefixed URL.
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice('/en'.length) || '/';
    return NextResponse.redirect(url, 308);
  }

  const first = pathname.split('/')[1];

  // /ru/..., /uk/..., /he/..., /de/..., /es/... — already locale-prefixed.
  if (first && isSupportedPrefix(first)) {
    return NextResponse.next();
  }

  // Unprefixed public path → serve the prerendered English tree.
  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? '/en' : `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, API routes, the non-localized /dr and /embed trees,
  // and anything with a file extension (static assets, sw.js, robots.txt,
  // sitemap.xml, icons). Everything else flows through the locale logic above.
  matcher: ['/((?!_next|api/|dr$|dr/|embed$|embed/|.*\\.).*)'],
};
