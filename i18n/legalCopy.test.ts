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
        // MM40: Pro was added on 2026-10-25.
        expect(pages.legalCommon.lastUpdated).toMatch(/25/);
        expect(pages.legalCommon.whatChangedTitle).toMatch(/25/);
      });

      // MM40 decision 8: both plan names in ToS §10 and Privacy §1.6, and the four prices in §10.
      const payments = pages.termsOfService.sections[9];
      const paymentData = pages.privacyPolicy.sections[0].subsections?.[5];

      it("names Premium and Pro in ToS §10 (payments) and Privacy §1.6 (payment data)", () => {
        expect(payments.title).toMatch(/^10\./);
        expect(paymentData?.title).toMatch(/^1\.6/);
        expect(flatten(payments)).toMatch(/\bPro\b/);
        expect(flatten(paymentData)).toMatch(/\bPro\b/);
      });

      it("states both plans' prices in ToS §10 and nothing else", () => {
        const text = flatten(payments);
        for (const n of ["8", "80", "15", "150"]) expect(text).toMatch(new RegExp(`(?<![\\d.,])${n}(?![\\d.,])`));
        // The price paragraph names no other price (the pre-2026-10-24 $7/$70 must not linger).
        expect(payments.paragraphs?.[0] ?? "").not.toMatch(/(?<![\d.,])(7|70)(?![\d.,])/);
      });

      it("explains the period-end downgrade and keeps the 14-day refund", () => {
        expect(payments.paragraphs).toHaveLength(6);
        expect(flatten(payments)).toMatch(/14/);
        expect(flatten(payments)).toMatch(/7/);
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

  it("en-us ToS §10 names $15 and $150 for Pro beside $8 and $80 for Premium (MM40)", () => {
    const payments = en.termsOfService.sections[9];
    const first = payments.paragraphs?.[0] ?? "";
    expect(first).toContain("$8 per month or $80 per year for Premium");
    expect(first).toContain("$15 per month or $150 per year for Pro");
    expect(first).toContain("no tax is added on top");
    expect(flatten(payments)).toMatch(/downgrade from Pro to Premium takes effect at the end of the period/);
    expect(flatten(payments)).toMatch(/nothing is refunded for the rest of that period/);
    expect(flatten(payments)).toMatch(/within 14 days.*This applies to Premium and to Pro/);
  });

  it("en-us Privacy §1.6 names both plans and the stored plan", () => {
    const text = flatten(en.privacyPolicy.sections[0].subsections?.[5]);
    expect(text).toContain("Premium or Pro");
    expect(text).toContain("your plan (Premium or Pro)");
  });

  it("en-us no longer promises a universal 24 hour maximum", () => {
    const legal = flatten([en.privacyPolicy, en.termsOfService]);
    expect(legal).not.toMatch(/maximum of 24 hours/i);
    expect(legal).not.toMatch(/up to 24 hours/i);
    expect(legal).not.toMatch(/24-hour temporary/i);
  });
});
