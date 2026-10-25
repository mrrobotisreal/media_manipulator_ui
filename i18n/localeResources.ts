/**
 * SERVER ONLY. The client-eager bundle of a non-English locale, for the
 * `[lang]` root layout to pass to `<Providers resources>` (MM51).
 *
 * Why a prop instead of a client import: with 17 locales, statically importing
 * every locale's eager shards into `i18n/resources.ts` put ~200 KB gzip of
 * JSON nobody reads into the first-load JS of every route. A per-locale
 * dynamic `import()` would fix the size but resolve after hydration, flashing
 * English text in a localized page. The layout is a server component, so it
 * can read the shards at render time and pass the one locale the page needs;
 * the bundle travels in that page's RSC payload, and the i18next instance is
 * still initialised synchronously, exactly as before. English stays in the
 * client bundle (`i18n/resources.ts`) because it is the fallback language
 * every locale and every non-localized route needs.
 *
 * Importing this module from a `'use client'` file would pull every locale's
 * shards into the browser — the thing it exists to prevent.
 */
import { serverShards } from "./generated/serverBundles.generated";
import { buildClientBundle, type ClientBundle } from "./clientBundle";
import { defaultLocale } from "./locales";

/** `undefined` for English (already bundled) and for unregistered codes. */
export function getClientResources(code: string): ClientBundle | undefined {
  if (code === defaultLocale) return undefined;
  const shards = serverShards[code];
  return shards ? buildClientBundle(shards) : undefined;
}
