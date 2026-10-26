/**
 * MM51: byte-copy locales (`translated: false`) stay out of hreflang and are
 * noindex, so adding them adds no indexable page (AdSense review safety).
 */
import { describe, expect, it } from "vitest";

import { buildMetadata, languageAlternates } from "@/lib/metadata";
import { locales } from "@/i18n/locales";

const untranslated = locales.filter((l) => !l.translated);

describe("SEO for untranslated locales", () => {
  it("covers the 11 MM51 locales", () => {
    expect(untranslated).toHaveLength(10);
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

  it.each(untranslated.map((l) => [l.code]))("%s pages are noindex", (code) => {
    for (const path of ["/", "/about", "/pricing"]) {
      expect(buildMetadata(path, code).robots, `${path}`).toEqual({ index: false, follow: true });
    }
  });

  it("translated locales stay indexable", () => {
    expect(buildMetadata("/about", "de-DE").robots).toEqual({ index: true, follow: true });
  });
});
