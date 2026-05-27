import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  getLocalizedToolPages,
  getLocalizedToolBySlug,
  getLocalizedToolCategories,
} from "./toolPageContent";
import { defaultLanguage } from "./resources";

/**
 * React hook exposing the tool-page content localized to the active language.
 * Falls back to the English default when a language has no overrides (see
 * `toolPageContent.ts`). Memoized on the active language so list identity is
 * stable across re-renders.
 */
export function useToolPages() {
  const { i18n } = useTranslation();
  const lang = i18n.language || defaultLanguage;

  const toolPages = useMemo(() => getLocalizedToolPages(lang), [lang]);
  const toolCategories = useMemo(() => getLocalizedToolCategories(lang), [lang]);
  const getToolBySlug = useMemo(
    () => (slug: string) => getLocalizedToolBySlug(slug, lang),
    [lang],
  );

  return { toolPages, toolCategories, getToolBySlug, language: lang };
}

export default useToolPages;
