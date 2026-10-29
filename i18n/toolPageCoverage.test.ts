/**
 * MM86 Decision 3: a tool page whose body falls back to English is never
 * indexable under a non-English URL, and its hreflang lists only the reviewed
 * locales that cover the whole body.
 *
 * The report test prints the coverage table (run with --silent=false): per
 * reviewed locale, how many of the 24 copy-bar pages are fully covered, and
 * the count of indexable non-English tool pages that fall back to English,
 * which must be 0.
 */
import { afterEach, describe, expect, it, vi } from "vitest";

import { PENDING_ALLOWLIST, REVIEW_CATALOG_SLUGS, REVIEW_INDEXED_TOOL_SLUGS } from "@/content/reviewAllowlist";
import { TOOL_PAGES } from "@/content/toolPages";
import { locales, reviewedLocales, unreviewedLocales } from "@/i18n/locales";
import { buildToolMetadata, isToolPageIndexable } from "@/lib/metadata";
import sitemap from "@/app/sitemap";
import {
  TOOL_BODY_FIELDS,
  fullyCoveredLocaleCodes,
  getLocalizedToolBySlug,
  localeBodyCoverage,
} from "./toolPageContent";

const ORIGIN = "https://www.media-manipulator.com";
const nonEnglish = locales.filter((l) => l.code !== "en-US");

afterEach(() => vi.unstubAllEnvs());

describe("localeBodyCoverage", () => {
  it("English is always complete and lists the fields the page renders", () => {
    const c = localeBodyCoverage("compress-image", "en-US");
    expect(c.complete).toBe(true);
    expect(c.missing).toEqual([]);
    for (const f of ["intro", "whatItDoes", "whyItMatters", "useCases", "faq", "flowSteps", "privacyNote", "workedExamples", "whenNotToUse"]) {
      expect(c.required).toContain(f);
    }
  });

  it("an unknown slug is never complete", () => {
    expect(localeBodyCoverage("no-such-tool", "de-DE").complete).toBe(false);
  });

  it("every required field is one of TOOL_BODY_FIELDS, and covered + missing = required", () => {
    for (const slug of REVIEW_CATALOG_SLUGS) {
      for (const l of locales) {
        const c = localeBodyCoverage(slug, l.code);
        expect([...c.covered, ...c.missing].sort()).toEqual([...c.required].sort());
        for (const f of c.required) expect(TOOL_BODY_FIELDS).toContain(f);
      }
    }
  });

  it("a locale with only name + tagline (a model-written locale) is not complete", () => {
    const c = localeBodyCoverage("compress-image", "fr-FR");
    expect(c.complete).toBe(false);
    expect(c.missing).toContain("privacyNote");
    expect(c.missing).toContain("faq");
  });

  it("only reviewed locales can be fully covered locales of a page", () => {
    for (const slug of REVIEW_CATALOG_SLUGS) {
      const codes = fullyCoveredLocaleCodes(slug);
      expect(codes[0]).toBe("en-US");
      for (const c of codes) expect(reviewedLocales.map((l) => l.code)).toContain(c);
    }
  });
});

describe("tool-page indexing follows coverage (MM86 Decision 3)", () => {
  it("report: 0 indexable non-English tool pages fall back to English", () => {
    const leaks: string[] = [];
    const rows: string[] = [];
    for (const l of nonEnglish) {
      let indexable = 0;
      let complete = 0;
      for (const slug of REVIEW_CATALOG_SLUGS) {
        const c = localeBodyCoverage(slug, l.code);
        if (c.complete) complete += 1;
        if (isToolPageIndexable(slug, l.code)) {
          indexable += 1;
          if (!c.complete) leaks.push(`${l.prefix}/tools/${slug} (missing ${c.missing.join(", ")})`);
        }
      }
      rows.push(`${l.code.padEnd(6)} reviewed=${String(l.reviewed).padEnd(5)} complete ${String(complete).padStart(2)}/24  indexable ${indexable}`);
    }
    console.log(["MM86 tool-body coverage (24 copy-bar pages):", ...rows, `indexable non-English pages with English fallback: ${leaks.length}`].join("\n"));
    expect(leaks).toEqual([]);
  });

  it.each(REVIEW_INDEXED_TOOL_SLUGS.map((s) => [s]))("%s: robots and hreflang per locale", (slug) => {
    const covered = fullyCoveredLocaleCodes(slug);
    for (const l of locales) {
      const meta = buildToolMetadata(slug, l.code);
      const indexable = l.code === "en-US" || (l.translated && l.reviewed && localeBodyCoverage(slug, l.code).complete);
      expect(meta.robots, `${l.code}`).toEqual({ index: indexable, follow: true });
      if (indexable) {
        expect(Object.keys(meta.alternates?.languages ?? {}).sort(), l.code).toEqual([...covered, "x-default"].sort());
      } else {
        expect(meta.alternates?.languages, l.code).toBeUndefined();
      }
    }
  });

  it("unreviewed locales are noindex, follow on every allowlisted tool page, with no hreflang", () => {
    for (const l of unreviewedLocales) {
      for (const slug of REVIEW_INDEXED_TOOL_SLUGS) {
        const meta = buildToolMetadata(slug, l.code);
        expect(meta.robots, `${l.code} ${slug}`).toEqual({ index: false, follow: true });
        expect(meta.alternates?.languages).toBeUndefined();
      }
    }
  });

  it("the English hreflang of a page never names an unreviewed locale", () => {
    for (const slug of REVIEW_INDEXED_TOOL_SLUGS) {
      const langs = Object.keys(buildToolMetadata(slug, "en-US").alternates?.languages ?? {});
      for (const l of unreviewedLocales) expect(langs, slug).not.toContain(l.code);
    }
  });

  it("pending pages stay noindex, nofollow in every locale; aliases noindex, follow", () => {
    vi.stubEnv("NEXT_PUBLIC_SEO_FULL_INDEX", "");
    for (const slug of PENDING_ALLOWLIST) {
      for (const l of locales) expect(buildToolMetadata(slug, l.code).robots).toEqual({ index: false, follow: false });
    }
    const alias = TOOL_PAGES.find((t) => t.aliasOf)!;
    for (const l of locales) {
      const meta = buildToolMetadata(alias.slug, l.code);
      expect(meta.robots).toEqual({ index: false, follow: true });
      expect(meta.alternates?.languages).toBeUndefined();
    }
  });

  it("an indexable translated page uses its own title; a noindex one keeps the English title", () => {
    for (const slug of REVIEW_INDEXED_TOOL_SLUGS) {
      const en = buildToolMetadata(slug, "en-US");
      for (const l of nonEnglish) {
        const meta = buildToolMetadata(slug, l.code);
        if (isToolPageIndexable(slug, l.code)) {
          expect(meta.title, `${l.code} ${slug}`).toBe(getLocalizedToolBySlug(slug, l.code)!.metaTitle);
          expect(meta.title, `${l.code} ${slug}`).not.toBe(en.title);
        }
      }
    }
  });

  it("sitemap tool entries list English plus the fully covered reviewed locales", () => {
    vi.stubEnv("NEXT_PUBLIC_SEO_FULL_INDEX", "");
    for (const e of sitemap()) {
      const path = new URL(e.url).pathname;
      if (!path.startsWith("/tools/")) continue;
      const slug = path.slice("/tools/".length);
      expect(Object.keys(e.alternates?.languages ?? {}).sort(), path).toEqual([...fullyCoveredLocaleCodes(slug), "x-default"].sort());
      expect(e.alternates?.languages?.["x-default"]).toBe(`${ORIGIN}${path}`);
    }
  });
});
