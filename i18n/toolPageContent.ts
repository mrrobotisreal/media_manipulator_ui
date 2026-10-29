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
 * To add a language's overrides: create `i18n/locales/<code-lowercase>/toolPages.ts`
 * (default-exporting `{ pages, categories }`) and run `npm run i18n:gen`; the
 * generated `i18n/generated/toolPages.generated.ts` picks it up (MM51). A
 * locale without the file renders English tool pages. `getLocalizedToolPages`
 * deep-merges the override over the English default, so partial translations
 * degrade gracefully.
 *
 * This module is framework-agnostic (no React) so `src/lib/seo.ts` can localize
 * SEO metadata at route-change time, and `useLocalizedToolPages` (a thin hook)
 * can drive the React pages.
 *
 * MM86: `localeBodyCoverage(slug, locale)` reports which rendered body fields
 * a locale's override supplies. A tool page whose coverage is incomplete
 * renders English prose under a translated URL, so it is `noindex, follow`
 * with no hreflang there (`buildToolMetadata` in `lib/metadata.ts`), and the
 * sitemap lists only fully covered locales as its alternates.
 */
import {
  TOOL_PAGES,
  TOOL_CATEGORIES,
  type ToolPageContent,
} from "@/content/toolPages";
import { toolPageOverrideModules } from "@/i18n/generated/toolPages.generated";
import { defaultLocale, reviewedLocales } from "@/i18n/locales";

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
 * copy in toolPages.ts is already the en-US content. Every other entry comes
 * from a locale's optional `locales/<code>/toolPages.ts` via the generated map
 * (the five shipped files hold name + tagline for the review-allowlisted
 * slugs; full page bodies are deferred, see the header of any shipped file).
 */
const TOOL_PAGE_OVERRIDES: Record<string, LanguageToolContent> = {
  "en-US": {},
  ...(toolPageOverrideModules as Record<string, LanguageToolContent>),
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

/**
 * MM86: every field `ToolLandingPage` renders as prose (plus the panel's
 * heading and the page's own <title>/description). A locale fully covers a
 * page when its override supplies each of these that the English entry has.
 * Decision 3 named the seven original body fields; MM84 added worked
 * examples, "When not to use this", technical details and page-specific
 * notes, which render too, so they count.
 */
export const TOOL_BODY_FIELDS = [
  "name",
  "h1",
  "tagline",
  "metaTitle",
  "metaDescription",
  "intro",
  "whatItDoes",
  "flowSteps",
  "advancedDetails",
  "whyItMatters",
  "useCases",
  "workedExamples",
  "whenNotToUse",
  "whyMediaManipulator",
  "privacyNote",
  "faq",
  "supportedFormats",
  "related",
  "embed",
  "featureList",
] as const;

export type ToolBodyField = (typeof TOOL_BODY_FIELDS)[number];

export interface LocaleBodyCoverage {
  /** Fields the English page renders (what a full translation must supply). */
  required: ToolBodyField[];
  /** Required fields the locale's override supplies. */
  covered: ToolBodyField[];
  /** Required fields that fall back to English. */
  missing: ToolBodyField[];
  /** True when nothing on the page falls back to English. */
  complete: boolean;
}

const nonEmpty = (v: unknown): boolean =>
  Array.isArray(v) ? v.length > 0 : typeof v === "string" ? v.trim().length > 0 : v !== undefined && v !== null;

/** Does the English entry render this field? */
const englishHas = (tool: ToolPageContent, field: ToolBodyField): boolean => {
  if (field === "supportedFormats") {
    const sf = tool.supportedFormats;
    return !!sf && (nonEmpty(sf.maxFileNotes) || nonEmpty(sf.processingNotes));
  }
  if (field === "embed") return nonEmpty(tool.embed.title) || nonEmpty(tool.embed.description);
  return nonEmpty(tool[field]);
};

/** Does the override supply this field in full (arrays as long as English)? */
const overrideSupplies = (tool: ToolPageContent, override: ToolPageOverride, field: ToolBodyField): boolean => {
  if (field === "supportedFormats") {
    const sf = override.supportedFormats;
    const en = tool.supportedFormats;
    if (!sf || !en) return false;
    return (["maxFileNotes", "processingNotes"] as const).every(
      (k) => !nonEmpty(en[k]) || (Array.isArray(sf[k]) && sf[k]!.length === en[k]!.length),
    );
  }
  if (field === "embed") {
    const e = override.embed;
    return !!e && (!nonEmpty(tool.embed.title) || nonEmpty(e.title)) && (!nonEmpty(tool.embed.description) || nonEmpty(e.description));
  }
  const value = override[field];
  const en = tool[field];
  if (Array.isArray(en)) return Array.isArray(value) && value.length === en.length && en.every((item, i) => sameShape(item, value[i]));
  return nonEmpty(value);
};

/**
 * Arrays are replaced wholesale by `deepMerge`, so an override item must carry
 * every non-empty string the English item has (a FAQ item without its answer
 * would render blank, not English).
 */
const sameShape = (en: unknown, item: unknown): boolean => {
  if (typeof en === "string") return typeof item === "string" && (en.trim() === "" || item.trim().length > 0);
  if (!en || typeof en !== "object") return true;
  if (!item || typeof item !== "object") return false;
  return Object.entries(en as Record<string, unknown>).every(
    ([k, v]) => typeof v !== "string" || v.trim() === "" || nonEmpty((item as Record<string, unknown>)[k]),
  );
};

/**
 * MM86: which rendered body fields `locale`'s override supplies for `slug`.
 * English is always complete; an unknown slug is never complete.
 */
export function localeBodyCoverage(slug: string, locale: string): LocaleBodyCoverage {
  const tool = TOOL_PAGES.find((t) => t.slug === slug);
  if (!tool) return { required: [], covered: [], missing: [], complete: false };
  const required = TOOL_BODY_FIELDS.filter((f) => englishHas(tool, f));
  if (locale === defaultLocale) return { required, covered: required, missing: [], complete: true };
  const override = TOOL_PAGE_OVERRIDES[locale]?.pages?.[slug] ?? {};
  const covered = required.filter((f) => overrideSupplies(tool, override, f));
  const missing = required.filter((f) => !covered.includes(f));
  return { required, covered, missing, complete: missing.length === 0 };
}

/**
 * MM86: the public locales (translated and reviewed) whose override fully
 * covers `slug`, English first. These are a tool page's hreflang alternates
 * and the only locales in which it may be indexed.
 */
export function fullyCoveredLocaleCodes(slug: string): string[] {
  return reviewedLocales.filter((l) => localeBodyCoverage(slug, l.code).complete).map((l) => l.code);
}

/** MM86: the raw override's own OG lines, so metadata can tell "supplied" from "inherited". */
export function toolOverrideOg(slug: string, locale: string): { ogTitle?: string; ogDescription?: string } {
  const o = TOOL_PAGE_OVERRIDES[locale]?.pages?.[slug];
  return { ogTitle: o?.ogTitle, ogDescription: o?.ogDescription };
}
