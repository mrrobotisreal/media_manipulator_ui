/**
 * Per-request locale resolution for React Server Components.
 *
 * The client persists the visitor's language choice into the `mm-language`
 * cookie (see `changeLanguage` in `i18n/useLocalization.tsx`). Static views
 * read it here and pass the result to `getServerT()` / `<ServerTrans>` so the
 * server-rendered copy matches the client-rendered chrome around it.
 *
 * ⚠️ Reading `cookies()` opts the calling route into dynamic rendering. That is
 * deliberate for the copy-only static views (they are cheap per-request
 * renders), but do NOT call this from the root layout — that would make every
 * route on the site dynamic.
 *
 * Crawlers and first-time visitors send no cookie and get the default English
 * page, so SEO/AdSense-visible HTML is unchanged.
 */
import { cookies } from "next/headers";

import { supportedLanguages, defaultLanguage } from "@/i18n/resources";

// Must match LANGUAGE_COOKIE_KEY in `i18n/index.ts` (not imported from there to
// keep react-i18next out of the server-component module graph).
const LANGUAGE_COOKIE_KEY = "mm-language";

export async function getRequestLocale(): Promise<string> {
  const store = await cookies();
  const value = store.get(LANGUAGE_COOKIE_KEY)?.value;
  if (value) {
    let decoded = value;
    try {
      decoded = decodeURIComponent(value);
    } catch {
      // Malformed escape — treat the raw value as the candidate.
    }
    if (supportedLanguages.some((l) => l.code === decoded)) return decoded;
  }
  return defaultLanguage;
}

export default getRequestLocale;
