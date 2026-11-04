/**
 * Link and action safety for Medi answers (design §13, MM107 decision 3). Model text can name any
 * URL; only same-site paths survive, re-prefixed with the visitor's locale so a click stays in
 * their language. Action targets come from the API (already checked against `routes.json`) and are
 * prefixed the same way.
 */
import { localizeHref, stripLocalePrefix } from '@/i18n/locales';
import { SITE_ORIGIN } from '@/lib/seo';

import type { AssistantLinkTargetProp } from '@/lib/analytics/events';

const SITE_HOSTS = new Set(['media-manipulator.com', 'www.media-manipulator.com']);

/**
 * A safe, locale-prefixed site path for an href from model text, or null (render as text).
 * Accepts `/path`, `https://(www.)media-manipulator.com/path` and the site origin; rejects other
 * hosts, protocol-relative `//x`, `javascript:` and anything that is not http(s) or a path.
 */
export function safeSiteHref(href: string | undefined | null, localeCode: string): string | null {
  if (!href) return null;
  const raw = href.trim();
  let path: string;
  if (raw.startsWith('/') && !raw.startsWith('//')) {
    path = raw;
  } else {
    let url: URL;
    try {
      url = new URL(raw);
    } catch {
      return null;
    }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    const host = url.hostname.toLowerCase();
    const own = (() => {
      try {
        return new URL(SITE_ORIGIN).hostname.toLowerCase();
      } catch {
        return '';
      }
    })();
    if (!SITE_HOSTS.has(host) && host !== own) return null;
    path = `${url.pathname}${url.search}${url.hash}`;
  }
  if (/[\s\\]/.test(path) || path.startsWith('/api') || path.startsWith('/dr') || path.startsWith('/embed') || path.startsWith('/translator')) {
    return null;
  }
  // Drop any locale prefix the model wrote and apply the visitor's.
  const [pathname, ...rest] = path.split(/(?=[?#])/);
  return localizeHref(stripLocalePrefix(pathname || '/') + rest.join(''), localeCode);
}

/** What kind of page a site path is, for `assistant_link_clicked`. */
export function linkTargetKind(path: string): AssistantLinkTargetProp {
  const p = stripLocalePrefix(path.split(/[?#]/)[0] || '/');
  if (p === '/pricing' || p.startsWith('/pricing/')) return 'pricing';
  if (p === '/motion' || p.startsWith('/motion/') || p === '/photo' || p.startsWith('/photo/') || p === '/tools/content-studio') {
    return 'editor';
  }
  if (p.startsWith('/tools/')) return 'tool';
  return 'page';
}

/** The href an `open_tool` / `navigate` action opens (null when the params are unusable). */
export function actionHref(kind: string, params: Record<string, unknown> | null | undefined, localeCode: string): string | null {
  const p = params ?? {};
  if (kind === 'navigate') {
    return typeof p.target === 'string' ? safeSiteHref(p.target, localeCode) : null;
  }
  if (kind === 'open_tool') {
    const slug = typeof p.slug === 'string' && /^[a-z0-9][a-z0-9-]{0,79}$/.test(p.slug) ? p.slug : null;
    const route = typeof p.route === 'string' ? p.route : slug ? `/tools/${slug}` : null;
    if (!route) return null;
    const base = safeSiteHref(route, localeCode);
    if (!base) return null;
    const preset = typeof p.preset === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(p.preset) ? p.preset : null;
    return preset ? `${base}${base.includes('?') ? '&' : '?'}preset=${encodeURIComponent(preset)}` : base;
  }
  return null;
}
