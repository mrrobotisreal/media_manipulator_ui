/**
 * MM51: byte-copy locales (`translated: false`) stay out of hreflang and are
 * noindex, so adding them adds no indexable page (AdSense review safety).
 * MM86: the same holds for translated locales no human has reviewed yet
 * (`reviewed: false`): only `translated && reviewed` locales are public.
 */
import { describe, expect, it } from "vitest";

import { buildMetadata, languageAlternates } from "@/lib/metadata";
import { locales, reviewedLocales } from "@/i18n/locales";

const untranslated = locales.filter((l) => !l.translated);
const nonPublic = locales.filter((l) => !(l.translated && l.reviewed));

describe("SEO for untranslated locales", () => {
  it("all registered locales are translated (MM57–MM67)", () => {
    expect(untranslated).toHaveLength(0);
  });

  it("hreflang alternates contain no untranslated locale", () => {
    for (const path of ["/", "/about", "/tools/compress-image"]) {
      const alt = languageAlternates(path);
      for (const l of untranslated) {
        expect(alt[l.code], `${path} ${l.code}`).toBeUndefined();
        expect(Object.values(alt).some((u) => u.includes(`/${l.prefix}/`) || u.endsWith(`/${l.prefix}`))).toBe(false);
      }
    }
  });

  // Empty once every locale is translated (vitest rejects an empty it.each table); kept for future byte-copy locales.
  if (untranslated.length > 0) {
    it.each(untranslated.map((l) => [l.code]))("%s pages are noindex", (code) => {
      for (const path of ["/", "/about", "/pricing"]) {
        expect(buildMetadata(path, code).robots, `${path}`).toEqual({ index: false, follow: true });
      }
    });
  }

  it("MM86: hreflang alternates are exactly the reviewed locales plus x-default", () => {
    for (const path of ["/", "/about", "/pricing"]) {
      expect(Object.keys(languageAlternates(path)).sort()).toEqual([...reviewedLocales.map((l) => l.code), "x-default"].sort());
    }
  });

  it.each(nonPublic.map((l) => [l.code]))("MM86: %s (unreviewed) pages are noindex, follow with no hreflang", (code) => {
    for (const path of ["/", "/about", "/tools", "/privacy-policy"]) {
      const meta = buildMetadata(path, code);
      expect(meta.robots, path).toEqual({ index: false, follow: true });
      expect(meta.alternates?.languages, path).toBeUndefined();
    }
  });

  it.each(reviewedLocales.map((l) => [l.code]))("%s (reviewed) pages are indexable with hreflang", (code) => {
    const meta = buildMetadata("/about", code);
    expect(meta.robots).toEqual({ index: true, follow: true });
    expect(Object.keys(meta.alternates?.languages ?? {})).toContain("x-default");
  });

  it("reviewed locales stay indexable", () => {
    expect(buildMetadata("/about", "de-DE").robots).toEqual({ index: true, follow: true });
  });
});
