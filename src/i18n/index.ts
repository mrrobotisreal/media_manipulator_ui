import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources, supportedLanguages, defaultLanguage } from "./resources";

const LANGUAGE_STORAGE_KEY = "mm-language";

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
  void i18n.use(initReactI18next).init({
    resources,
    lng: detectInitialLanguage(),
    fallbackLng: defaultLanguage,
    ns: ["interface", "error", "accessibility"],
    defaultNS: "interface",
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  });
}

export { LANGUAGE_STORAGE_KEY, supportedLanguages, defaultLanguage };
export default i18n;
