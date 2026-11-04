/**
 * Where the Medi guide button may appear (MM107 decision 1). Pure, so the rule is tested
 * without a DOM. The guide lives on the public localized pages; it is hidden on the chromeless
 * surfaces (they never mount it anyway: app/providers.tsx), on the Darkroom page (whose
 * editor gets the copilot panel instead, MM109), on translator workbench routes, and on
 * the shared-result viewer.
 */
import { stripLocalePrefix } from '@/i18n/locales';

const HIDDEN_PREFIXES = ['/dr', '/embed', '/translator', '/translate-guide', '/motion', '/photo', '/r/'];
const HIDDEN_EXACT = new Set(['/tools/content-studio']);

export function guideAllowedOn(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const p = stripLocalePrefix(pathname.split(/[?#]/)[0] || '/');
  if (HIDDEN_EXACT.has(p)) return false;
  for (const prefix of HIDDEN_PREFIXES) {
    if (prefix.endsWith('/') ? p.startsWith(prefix) : p === prefix || p.startsWith(`${prefix}/`)) return false;
  }
  return true;
}

/** Tool pages of an editor whose copilot the guide advertises (decision 4): slug → surface. */
export function editorTeaserFor(pathname: string | null | undefined, photoSlugs: ReadonlySet<string>): 'studio' | 'vector' | 'photo' | null {
  if (!pathname) return null;
  const p = stripLocalePrefix(pathname.split(/[?#]/)[0] || '/');
  const m = /^\/tools\/([a-z0-9-]+)$/.exec(p);
  if (!m) return null;
  if (m[1] === 'motion') return 'vector';
  if (m[1] === 'aperture' || photoSlugs.has(m[1])) return 'photo';
  return null;
}

/** Where each editor opens (unlocalized editor routes stay unprefixed; see localizeHref). */
export const EDITOR_HREF: Record<'studio' | 'vector' | 'photo', string> = {
  studio: '/tools/content-studio',
  vector: '/motion/new',
  photo: '/photo/new',
};
