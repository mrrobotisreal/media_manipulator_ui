import { createInstance, type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import { resources, supportedLanguages, defaultLanguage } from "./resources";

const LANGUAGE_STORAGE_KEY = "mm-language";

// Same name is used as a cookie. Neither is read for RENDERING anymore — the
// URL's `[lang]` segment is the source of truth (see `app/(localized)/[lang]/`)
// — they persist the visitor's preference for client-side affordances only.
const LANGUAGE_COOKIE_KEY = "mm-language";

/**
 * Builds a fresh i18next instance bound to `locale`.
 *
 * Why a factory instead of the old module-level singleton: client components
 * are also rendered ON THE SERVER (SSR inside the static prerender), and with
 * per-URL locales a singleton shared across concurrent renders is a
 * cross-request race — request A for `/ru/...` could flip the language under
 * request B for `/de/...`. Each server render gets its own instance via
 * `getI18nForLocale`; the browser keeps exactly one.
 */
export function createI18nInstance(locale: string = defaultLanguage): I18nInstance {
  const instance = createInstance();
  void instance.use(initReactI18next).init({
    resources,
    lng: locale,
    fallbackLng: defaultLanguage,
    ns: ["interface", "error", "accessibility"],
    defaultNS: "interface",
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
    // Resources are bundled inline, so namespaces are ready synchronously.
    // Disabling Suspense keeps server prerendering (SSG) from suspending and
    // guarantees real translated text in the initial HTML for SEO.
    react: {
      useSuspense: false,
      // The forms/panels shards arrive after init via `addResourceBundle`
      // (lib/i18n/ensureShard.ts). Re-render on store changes so a language
      // switch that races the lazy shard load settles into translated text
      // instead of staying on the fallback language.
      bindI18n: "languageChanged loaded",
      bindI18nStore: "added removed",
    },
  });
  return instance;
}

let browserI18n: I18nInstance | undefined;

/**
 * The instance for a render at `locale`: per-render on the server, the shared
 * browser singleton on the client (switched in place when the URL locale
 * changes, so already-mounted components re-render into the new language).
 */
export function getI18nForLocale(locale: string): I18nInstance {
  if (typeof window === "undefined") return createI18nInstance(locale);
  if (!browserI18n) {
    browserI18n = createI18nInstance(locale);
  } else if (browserI18n.language !== locale) {
    void browserI18n.changeLanguage(locale);
  }
  return browserI18n;
}

/**
 * Browser-only escape hatch for modules that live outside the provider tree
 * (`lib/i18n/ensureShard.ts` merges lazy shards into the live instance).
 * Never call during server rendering.
 */
export function getBrowserI18n(): I18nInstance {
  if (!browserI18n) browserI18n = createI18nInstance(defaultLanguage);
  return browserI18n;
}

export { LANGUAGE_STORAGE_KEY, LANGUAGE_COOKIE_KEY, supportedLanguages, defaultLanguage };
