/**
 * Tool pages whose translated versions stay out of the index even when a
 * reviewed locale fully covers the body (MM86 would otherwise index them).
 * English keeps its own rule (the review allowlist); every other locale is
 * `noindex, follow`, gets no hreflang alternates and no sitemap alternate.
 *
 * Mitch, 2026-11-04: hold the Aperture landing's uk/ru/de versions out of the
 * index while the AdSense review runs. Remove `aperture` here after approval to
 * restore the MM86 rule (no other change needed). Dependency-free on purpose.
 */
export const LOCALE_INDEX_HOLD_SLUGS: ReadonlySet<string> = new Set(['aperture']);

export function isLocaleIndexHeld(slug: string): boolean {
  return LOCALE_INDEX_HOLD_SLUGS.has(slug);
}
