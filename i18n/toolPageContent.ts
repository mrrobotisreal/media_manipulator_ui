/**
 * Localization layer for the data-driven /tools landing pages.
 *
 * The canonical English content lives in `src/content/toolPages.ts` — that file
 * is the source of truth for structure (slug, category, embedded-panel config)
 * AND the English ("en-US") copy. Rather than copy 2,400+ lines of structured
 * content into JSON, other languages register *partial overrides* here: a map
 * of slug → deep-partial `ToolPageContent` containing only the fields a
 * translator wants to localize. Anything omitted falls back to English.
 *
 * To add a language:
 *   1. Create `toolPageOverrides['<code>'] = { '<slug>': { h1: '…', … } }`
 *      (a separate file you import here keeps this tidy as it grows).
 *   2. That's it — `getLocalizedToolPages(code)` deep-merges the override over
 *      the English default, so partial translations degrade gracefully.
 *
 * This module is framework-agnostic (no React) so `src/lib/seo.ts` can localize
 * SEO metadata at route-change time, and `useLocalizedToolPages` (a thin hook)
 * can drive the React pages.
 */
import {
  TOOL_PAGES,
  TOOL_CATEGORIES,
  type ToolPageContent,
} from "@/content/toolPages";

/** Recursive deep-partial so overrides only need the fields they change. */
type DeepPartial<T> = T extends (infer U)[]
  ? U[] | undefined
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

export type ToolPageOverride = DeepPartial<ToolPageContent>;

export interface ToolCategoryOverride {
  label?: string;
  description?: string;
}

interface LanguageToolContent {
  /** slug → partial content override. */
  pages?: Record<string, ToolPageOverride>;
  /** category id → label/description override. */
  categories?: Partial<Record<ToolPageContent["category"], ToolCategoryOverride>>;
}

/**
 * Per-language override registry. en-US is intentionally empty — the English
 * copy in toolPages.ts is already the en-US content. Drop new languages in
 * here (or import them from `locales/<code>/toolPages.ts`).
 */
const TOOL_PAGE_OVERRIDES: Record<string, LanguageToolContent> = {
  "en-US": {},
};

/** Arrays are replaced wholesale (a translated list is provided in full or not
 * at all); plain objects merge key-by-key; primitives override. */
const deepMerge = <T>(base: T, override: unknown): T => {
  if (override === undefined || override === null) return base;
  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }
  if (typeof base === "object" && base !== null && typeof override === "object") {
    const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [key, value] of Object.entries(override as Record<string, unknown>)) {
      result[key] = deepMerge((base as Record<string, unknown>)[key], value);
    }
    return result as T;
  }
  return override as T;
};

const localizeTool = (tool: ToolPageContent, langCode: string): ToolPageContent => {
  const override = TOOL_PAGE_OVERRIDES[langCode]?.pages?.[tool.slug];
  if (!override) return tool;
  return deepMerge(tool, override);
};

/** Localized copy of every tool page for the given language. */
export const getLocalizedToolPages = (langCode: string): ToolPageContent[] => {
  if (!TOOL_PAGE_OVERRIDES[langCode]?.pages) return TOOL_PAGES;
  return TOOL_PAGES.map((tool) => localizeTool(tool, langCode));
};

/** Localized single tool page, or undefined if the slug is unknown. */
export const getLocalizedToolBySlug = (
  slug: string,
  langCode: string,
): ToolPageContent | undefined => {
  const tool = TOOL_PAGES.find((t) => t.slug === slug);
  if (!tool) return undefined;
  return localizeTool(tool, langCode);
};

/** Localized tool-category labels for the /tools index grouping. */
export const getLocalizedToolCategories = (langCode: string) => {
  const overrides = TOOL_PAGE_OVERRIDES[langCode]?.categories;
  if (!overrides) return TOOL_CATEGORIES;
  return TOOL_CATEGORIES.map((category) => {
    const o = overrides[category.id];
    if (!o) return category;
    return {
      ...category,
      label: o.label ?? category.label,
      description: o.description ?? category.description,
    };
  });
};
