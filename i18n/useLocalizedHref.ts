'use client';

import { useCallback } from "react";
import { useLocalization } from "./useLocalization";
import { localizeHref } from "./locales";

/**
 * Returns a function that prefixes site-internal hrefs with the active locale
 * (`/tools` → `/ru/tools` when Russian is active; English stays unprefixed).
 * External URLs, `mailto:`, `/dr` and `/embed` pass through unchanged.
 *
 * Client-component counterpart of calling `localizeHref(href, locale)` in a
 * server component. Use it on every `<Link>` to a public page so navigation
 * stays inside the visitor's language.
 */
export function useLocalizedHref(): (href: string) => string {
  const { language } = useLocalization();
  const code = language.code;
  return useCallback((href: string) => localizeHref(href, code), [code]);
}

export default useLocalizedHref;
