import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources, supportedLanguages, defaultLanguage } from "./resources";

const LANGUAGE_STORAGE_KEY = "mm-language";

// Same name is used as a cookie so the server-rendered static views (see
// `lib/i18n/requestLocale.ts`) can resolve the visitor's language per request.
const LANGUAGE_COOKIE_KEY = "mm-language";

const readLanguageCookie = (): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${LANGUAGE_COOKIE_KEY}=`));
  if (!match) return null;
  try {
    return decodeURIComponent(match.slice(LANGUAGE_COOKIE_KEY.length + 1));
  } catch {
    return null;
  }
};

const detectInitialLanguage = (): string => {
  if (typeof window === "undefined") return defaultLanguage;
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && supportedLanguages.some((l) => l.code === stored)) {
      return stored;
    }
  } catch {
    // localStorage may be unavailable (private mode, SSR). Fall through.
  }
  const cookie = readLanguageCookie();
  if (cookie && supportedLanguages.some((l) => l.code === cookie)) {
    return cookie;
  }
  const navLang = window.navigator?.language?.toLowerCase();
  if (navLang) {
    const exact = supportedLanguages.find((l) => l.code.toLowerCase() === navLang);
    if (exact) return exact.code;
    const prefix = navLang.split("-")[0];
    const prefixMatch = supportedLanguages.find((l) => l.code.toLowerCase().startsWith(prefix));
    if (prefixMatch) return prefixMatch.code;
  }
  return defaultLanguage;
};

if (!i18n.isInitialized) {
  const initialLanguage = detectInitialLanguage();
  void i18n.use(initReactI18next).init({
    resources,
    lng: initialLanguage,
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
  // The prerendered HTML ships with the default `lang`; correct the document
  // as soon as the client picks a stored/browser language. Later switches are
  // handled by `changeLanguage` in useLocalization.
  if (typeof document !== "undefined" && initialLanguage !== defaultLanguage) {
    const entry = supportedLanguages.find((l) => l.code === initialLanguage);
    document.documentElement.lang = initialLanguage;
    document.documentElement.dir = entry?.dir ?? "ltr";
  }
}

export { LANGUAGE_STORAGE_KEY, LANGUAGE_COOKIE_KEY, supportedLanguages, defaultLanguage };
export default i18n;
