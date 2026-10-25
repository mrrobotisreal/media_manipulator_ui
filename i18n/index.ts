import { createInstance, type i18n as I18nInstance, type Resource } from "i18next";
import { initReactI18next } from "react-i18next";
import { resources, supportedLanguages, defaultLanguage } from "./resources";
import type { ClientBundle } from "./clientBundle";
import { loadTranslatorMarkerRuntime } from "@/lib/translator/mode";

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
export function createI18nInstance(
  locale: string = defaultLanguage,
  localeResources?: ClientBundle,
): I18nInstance {
  const instance = createInstance();
  // English is bundled; any other locale's eager bundle is passed in by the
  // `[lang]` layout (see `i18n/localeResources.ts`, MM51).
  const initial: Resource =
    localeResources && locale !== defaultLanguage ? { ...resources, [locale]: localeResources } : resources;
  // Translator deployments only (MM52): every resolved string gets a zero-width
  // key marker. Always null in production (the env check folds at build time).
  const markers = loadTranslatorMarkerRuntime();
  if (markers) instance.use(markers.postProcessor);
  void instance.use(initReactI18next).init({
    resources: initial,
    lng: locale,
    fallbackLng: defaultLanguage,
    ns: ["interface", "error", "accessibility"],
    defaultNS: "interface",
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
    // `postProcessPassResolved` hands the plugin the RESOLVED key (`foo_few`).
    ...(markers ? { postProcess: [markers.postProcessor.name], postProcessPassResolved: true } : {}),
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
 * browser singleton on the client.
 *
 * MUST stay render-pure — it is called from a `useState` initializer in
 * `app/providers.tsx`, i.e. during the render phase. Calling `changeLanguage`
 * here fires i18next's `languageChanged` event synchronously, which setStates
 * every mounted `useTranslation` listener mid-render ("Cannot update a
 * component while rendering a different component"). When the URL locale
 * changes on a client-side navigation, the post-render `useEffect` in
 * `app/providers.tsx` performs the switch instead.
 */
export function getI18nForLocale(locale: string, localeResources?: ClientBundle): I18nInstance {
  if (typeof window === "undefined") return createI18nInstance(locale, localeResources);
  if (!browserI18n) {
    browserI18n = createI18nInstance(locale, localeResources);
  } else {
    // An instance created earlier (getBrowserI18n, or a previous locale's
    // layout) still needs this locale's strings before it can switch to it.
    // Silent, so this stays render-pure (no store events fire).
    addLocaleResources(browserI18n, locale, localeResources);
  }
  return browserI18n;
}

/**
 * Merges a locale's eager bundle into an existing instance before switching to
 * it (client-side navigation to another locale reuses the browser singleton).
 * Idempotent per instance + locale; silent (no store events), so it is safe
 * during render, and the caller's `changeLanguage` re-renders anyway.
 */
const mergedLocales = new WeakMap<I18nInstance, Set<string>>();

export function addLocaleResources(instance: I18nInstance, locale: string, localeResources?: ClientBundle): void {
  if (!localeResources || locale === defaultLanguage) return;
  const merged = mergedLocales.get(instance) ?? new Set<string>();
  mergedLocales.set(instance, merged);
  if (merged.has(locale)) return;
  merged.add(locale);
  // deep + no overwrite: lazily merged forms/panels keys (ensureShard.ts) for
  // this locale, if any arrived first, are kept; the eager keys fill in.
  for (const [ns, bundle] of Object.entries(localeResources)) {
    instance.addResourceBundle(locale, ns, bundle, true, false, { silent: true, skipCopy: false });
  }
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
