/**
 * MM26 legal-copy guard. Key/placeholder parity is enforced by localeParity.test.ts; this adds the
 * retention-specific expectations for the Privacy Policy and Terms in every registered locale.
 * Legal sections are arrays (the page renders them in order), so the retention section is the
 * entry with id "retention" and the old "temporary storage" entry must be gone.
 */
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { locales } from "./locales";

type Section = { id?: string; title: string; paragraphs?: string[]; bullets?: string[]; subsections?: Section[]; afterBullets?: string[] };
type Pages = {
  legalCommon: Record<string, string>;
  privacyPolicy: { sections: Section[] };
  termsOfService: { sections: Section[] };
};

const load = (code: string): Pages =>
  JSON.parse(readFileSync(join(__dirname, "locales", code.toLowerCase(), "interface", "pages.json"), "utf8"));
const flatten = (v: unknown): string => JSON.stringify(v);
const en = load("en-US");

describe("legal retention copy", () => {
  it("covers every registered locale, one locale directory each", () => {
    const dirs = readdirSync(join(__dirname, "locales"), { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();
    expect(locales.map((l) => l.code.toLowerCase()).sort()).toEqual(dirs);
  });

  for (const { code, translated } of locales) {
    describe(code, () => {
      const pages = load(code);
      const privacy = pages.privacyPolicy.sections.filter((s) => s.id === "retention");
      const terms = pages.termsOfService.sections.filter((s) => s.id === "retention");

      it("has exactly one retention section in each document", () => {
        expect(privacy).toHaveLength(1);
        expect(terms).toHaveLength(1);
      });

      it("keeps the retention section at the old storage position with its subsections", () => {
        expect(pages.privacyPolicy.sections[2].id).toBe("retention");
        expect(pages.termsOfService.sections[4].id).toBe("retention");
        expect(privacy[0].subsections?.length).toBe(6);
        expect(terms[0].paragraphs?.length).toBe(5);
      });

      it("has the what-changed note and the bumped dates", () => {
        expect(pages.legalCommon.whatChangedTitle?.length).toBeGreaterThan(10);
        expect(pages.legalCommon.whatChangedBody?.length).toBeGreaterThan(50);
        expect(pages.legalCommon.effectiveDate).toMatch(/2026/);
        expect(pages.legalCommon.effectiveDate).toMatch(/24/);
        expect(pages.legalCommon.lastUpdated).toMatch(/24/);
      });

      it("states the 6 month default and the 2 year ceiling", () => {
        const text = flatten(privacy[0]);
        expect(text).toMatch(/6/);
        expect(text).toMatch(/24/);
        expect(text).toMatch(/Amazon S3/);
      });

      // Byte-copy locales (`translated: false`, MM51) are English by design; the
      // check switches on when a translation session flips the flag (MM57–MM67).
      it("does not leave the English retention text untranslated in other locales", () => {
        if (code.toLowerCase() === "en-us" || !translated) return;
        expect(flatten(privacy[0])).not.toBe(flatten(en.privacyPolicy.sections[2]));
        expect(pages.legalCommon.whatChangedBody).not.toBe(en.legalCommon.whatChangedBody);
        expect(flatten(pages)).not.toMatch(/TODO\(i18n\)/);
      });
    });
  }

  it("en-us no longer promises a universal 24 hour maximum", () => {
    const legal = flatten([en.privacyPolicy, en.termsOfService]);
    expect(legal).not.toMatch(/maximum of 24 hours/i);
    expect(legal).not.toMatch(/up to 24 hours/i);
    expect(legal).not.toMatch(/24-hour temporary/i);
  });
});
