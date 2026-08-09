/**
 * `[lang]` URL-segment → locale-code resolution for the localized route tree.
 *
 * This replaced the cookie-based `getRequestLocale()`: locale now lives in the
 * URL (`/ru/about`) and arrives as the `lang` route param, so pages stay
 * statically prerenderable — no request-time API reads.
 */
import { notFound } from "next/navigation";

import { urlPrefixToCode } from "@/i18n/locales";

/**
 * Resolve the `lang` route param (`"ru"`) to a locale code (`"ru-RU"`).
 * Unknown segments 404: the only way an unknown value reaches a page is a
 * direct hit on a URL the proxy passed through (e.g. `/dr/there-is-no-page`
 * backtracking into the dynamic segment), which must not render content.
 */
export function resolveLangParam(lang: string): string {
  const code = urlPrefixToCode(lang);
  if (!code) notFound();
  return code;
}

export default resolveLangParam;
