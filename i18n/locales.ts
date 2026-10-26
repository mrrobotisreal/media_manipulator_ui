/**
 * Single source of truth for the site's locales.
 *
 * Everything that needs to know "which languages exist" derives from this file:
 * the client resource registry (`i18n/resources.ts`), the lazy shard loaders
 * (`lib/i18n/ensureShard.ts`), the server bundles (`lib/i18n/server.tsx`), the
 * `[lang]` route segment (`generateStaticParams` + validation), `proxy.ts`,
 * and the SEO layer (canonical/hreflang/sitemap).
 *
 * URL scheme: English lives at the existing unprefixed URLs (its `/en/...`
 * static output is reached via a proxy rewrite and never exposed publicly);
 * every other locale is served under its short prefix (`/ru/...`, `/he/...`).
 *
 * `translated` gates the SEO surface, not availability: a locale whose shard
 * files are still byte-copies of en-US stays fully routable and selectable,
 * but is kept out of the sitemap + hreflang alternates and marked `noindex`
 * until its real translations land. Flipping this flag is the ONE switch a
 * later translation session throws after overwriting the locale's files.
 *
 * NOTE: this module must stay dependency-free (no JSON imports, no i18next) —
 * it is imported by `proxy.ts` and by server + client code alike. It must also
 * stay erasable TypeScript (no enums, namespaces or parameter properties):
 * `scripts/gen-i18n-registry.mjs` and `scripts/list-locales.mjs` import it on
 * bare Node 24 through built-in type stripping.
 *
 * Adding a locale (MM51): add its row below, copy `locales/en-us/` to
 * `locales/<code lowercased>/` (without `interface/metadata.json`), then run
 * `npm run i18n:gen`. Nothing else is hand-edited.
 */

export interface LocaleDef {
  /** BCP-47 code used as the i18next language key (`en-US`). */
  code: string;
  /** URL path prefix (`ru`); English's `en` is internal-only (rewrite target). */
  prefix: string;
  /** Native language label shown in the language selector. */
  label: string;
  /** English description, shown as a tooltip / secondary label. */
  englishLabel: string;
  /** Flag emoji rendered next to the label. */
  flag: string;
  /** Text direction. */
  dir: "ltr" | "rtl";
  /**
   * True once the locale's shard files hold real translations. Drives the
   * sitemap/hreflang allowlist and per-page `noindex` for copied locales.
   */
  translated: boolean;
}

export const locales: LocaleDef[] = [
  { code: "en-US", prefix: "en", label: "English", englishLabel: "English", flag: "🇺🇸", dir: "ltr", translated: true },
  { code: "uk-UA", prefix: "uk", label: "Українська", englishLabel: "Ukrainian", flag: "🇺🇦", dir: "ltr", translated: true },
  { code: "ru-RU", prefix: "ru", label: "Русский", englishLabel: "Russian", flag: "🇷🇺", dir: "ltr", translated: true },
  { code: "he-IL", prefix: "he", label: "עברית", englishLabel: "Hebrew", flag: "🇮🇱", dir: "rtl", translated: true },
  { code: "de-DE", prefix: "de", label: "Deutsch", englishLabel: "German", flag: "🇩🇪", dir: "ltr", translated: true },
  { code: "es-ES", prefix: "es", label: "Español", englishLabel: "Spanish", flag: "🇪🇸", dir: "ltr", translated: true },
  // MM51: byte-copies of en-US until their translation sessions (MM57–MM67).
  { code: "fr-FR", prefix: "fr", label: "Français", englishLabel: "French", flag: "🇫🇷", dir: "ltr", translated: true },
  { code: "it-IT", prefix: "it", label: "Italiano", englishLabel: "Italian", flag: "🇮🇹", dir: "ltr", translated: false },
  { code: "ja-JP", prefix: "ja", label: "日本語", englishLabel: "Japanese", flag: "🇯🇵", dir: "ltr", translated: false },
  { code: "zh-CN", prefix: "zh-cn", label: "简体中文", englishLabel: "Chinese (Simplified)", flag: "🇨🇳", dir: "ltr", translated: false },
  { code: "zh-TW", prefix: "zh-tw", label: "繁體中文", englishLabel: "Chinese (Traditional)", flag: "🇹🇼", dir: "ltr", translated: false },
  { code: "ko-KR", prefix: "ko", label: "한국어", englishLabel: "Korean", flag: "🇰🇷", dir: "ltr", translated: false },
  { code: "ar-SA", prefix: "ar", label: "العربية", englishLabel: "Arabic", flag: "🇸🇦", dir: "rtl", translated: false },
  { code: "hi-IN", prefix: "hi", label: "हिन्दी", englishLabel: "Hindi", flag: "🇮🇳", dir: "ltr", translated: false },
  { code: "pt-PT", prefix: "pt-pt", label: "Português (Portugal)", englishLabel: "Portuguese (Portugal)", flag: "🇵🇹", dir: "ltr", translated: false },
  { code: "pt-BR", prefix: "pt-br", label: "Português (Brasil)", englishLabel: "Portuguese (Brazil)", flag: "🇧🇷", dir: "ltr", translated: false },
  { code: "vi-VN", prefix: "vi", label: "Tiếng Việt", englishLabel: "Vietnamese", flag: "🇻🇳", dir: "ltr", translated: false },
];

export const defaultLocale = "en-US";

const byPrefix = new Map(locales.map((l) => [l.prefix, l]));
const byCode = new Map(locales.map((l) => [l.code, l]));

/** All URL prefixes, including English's internal `en`. */
export const localePrefixes = locales.map((l) => l.prefix);

/** Prefixes that appear in public URLs (everything but English). */
export const publicLocalePrefixes = locales.filter((l) => l.code !== defaultLocale).map((l) => l.prefix);

/**
 * Locales a translator deployment can serve (every non-English locale). The
 * translator workbench (MM52–MM56) derives its `translate/<prefix>` branches,
 * `<prefix>.translate.media-manipulator.com` domains and per-branch env from
 * this list via `scripts/list-locales.mjs`; never hand-list locales elsewhere.
 */
export const translatorLocales = locales.filter((l) => l.code !== defaultLocale);

/** Locales allowed into sitemap/hreflang (en + genuinely translated ones). */
export const translatedLocales = locales.filter((l) => l.translated);

export function isSupportedPrefix(prefix: string): boolean {
  return byPrefix.has(prefix);
}

/** `"ru"` → `"ru-RU"`; unknown prefixes return undefined. */
export function urlPrefixToCode(prefix: string): string | undefined {
  return byPrefix.get(prefix)?.code;
}

/** `"ru-RU"` → `"ru"`; unknown codes return the default's prefix. */
export function codeToUrlPrefix(code: string): string {
  return byCode.get(code)?.prefix ?? "en";
}

export function getLocaleDef(code: string): LocaleDef | undefined {
  return byCode.get(code);
}

/**
 * Prepend the locale's URL prefix to a site-internal href. English (and any
 * unknown code) returns the href unchanged, preserving the unprefixed URLs.
 * External URLs, `mailto:`, hashes, `/dr`, `/embed`, `/api` and the Motion
 * editor (`/motion`, `/motion/…`; MM42) are returned as-is. The Motion check is
 * exact, so `/tools/motion` and any `/motion-*` page are still localized.
 */
export function localizeHref(href: string, code: string): string {
  if (!href.startsWith("/")) return href;
  if (href.startsWith("/dr") || href.startsWith("/embed") || href.startsWith("/api")) return href;
  if (isMotionEditorHref(href)) return href;
  const def = byCode.get(code);
  if (!def || def.code === defaultLocale) return href;
  return href === "/" ? `/${def.prefix}` : `/${def.prefix}${href}`;
}

/** `/motion`, `/motion/…`, `/motion?…`, `/motion#…`: the chromeless editor route. */
function isMotionEditorHref(href: string): boolean {
  return href === "/motion" || /^\/motion[/?#]/.test(href);
}

/**
 * Strip a leading public locale prefix from a pathname, returning the
 * locale-neutral path (`/ru/about` → `/about`, `/ru` → `/`). Unprefixed paths
 * come back unchanged.
 */
export function stripLocalePrefix(pathname: string): string {
  const first = pathname.split("/")[1];
  const def = first ? byPrefix.get(first) : undefined;
  if (!def || def.code === defaultLocale) return pathname;
  return pathname.slice(def.prefix.length + 1) || "/";
}
