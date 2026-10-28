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

/**
 * The calendar day a localized legal date names, as YYYY-MM-DD: ISO (2026-10-26), D.M.Y /
 * D/M/Y (26.10.2026, 26/10/2026) or "26 <month> 2026" (the month is the only word-month in
 * these strings, so day + year are enough once the month is checked to be October).
 */
function legalDay(text: string): string {
  const iso = text.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const dmy = text.match(/(\d{1,2})[./](\d{1,2})[./](\d{4})/);
  if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
  const word = text.match(/(\d{1,2})\s+(\p{L}+)\.?\s+(\d{4})/u);
  if (word && /^(октября|жовтня|October|Oktober|octubre)$/iu.test(word[2])) return `${word[3]}-10-${word[1].padStart(2, "0")}`;
  return `unparsed:${text}`;
}

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
        // MM48: Motion was added on 2026-10-26 (MM40's Pro update was the 25th); MM78's
        // voices update is 2026-10-28, and its note keeps the 2026-10-26 one.
        expect(pages.legalCommon.lastUpdated).toMatch(/28/);
        expect(pages.legalCommon.whatChangedTitle).toMatch(/28/);
        expect(pages.legalCommon.whatChangedBody).toMatch(/2026-10-26/);
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

      // MM69 decision 8: USD or EUR at identical numerals, and the mm-currency cookie.
      it("names both currencies in ToS §10 and the mm-currency cookie in Privacy §1.6 and the what-changed note", () => {
        const first = payments.paragraphs?.[0] ?? "";
        expect(first).toContain("$");
        expect(first).toContain("€");
        expect(flatten(paymentData)).toContain("mm-currency");
        expect(flatten(paymentData)).toMatch(/usd/);
        expect(flatten(paymentData)).toMatch(/eur/);
        expect(pages.legalCommon.whatChangedBody).toContain("mm-currency");
        expect(pages.legalCommon.whatChangedBody).toContain("1.6");
        expect(pages.legalCommon.whatChangedBody).toMatch(/\b10\b/);
        if (code.toLowerCase() === "en-us" || !translated) return;
        expect(first).not.toBe(en.termsOfService.sections[9].paragraphs?.[0]);
        expect(flatten(paymentData)).not.toBe(flatten(en.privacyPolicy.sections[0].subsections?.[5]));
        expect(pages.legalCommon.whatChangedBody).not.toBe(en.legalCommon.whatChangedBody);
      });

      it("explains the period-end downgrade and keeps the 14-day refund", () => {
        expect(payments.paragraphs).toHaveLength(6);
        expect(flatten(payments)).toMatch(/14/);
        expect(flatten(payments)).toMatch(/7/);
      });

      // MM48 decision 6: Motion's data categories (Privacy §1.9) and its ToS sentences (§13).
      const motionPrivacy = pages.privacyPolicy.sections[0].subsections?.[8];
      const ip = pages.termsOfService.sections[12];

      it("has the Motion sentences in Privacy §1.9 and ToS §13 (MM48 key presence)", () => {
        // MM78 adds §1.10 (voices) after Motion's §1.9.
        expect(pages.privacyPolicy.sections[0].subsections?.length).toBeGreaterThanOrEqual(9);
        expect(motionPrivacy?.title).toMatch(/^1\.9 /);
        expect(motionPrivacy?.title).toContain("Motion");
        // Browser-made exports; account projects like Darkroom's; counted export metadata.
        expect(motionPrivacy?.paragraphs).toHaveLength(3);
        expect(flatten(motionPrivacy)).toMatch(/IndexedDB/);
        expect(flatten(motionPrivacy)).toMatch(/Darkroom/);
        expect(flatten(motionPrivacy)).toMatch(/Amazon S3/);
        expect(flatten(motionPrivacy)).toMatch(/\b3\b/);
        expect(ip.title).toMatch(/^13\./);
        expect(ip.paragraphs).toHaveLength(6);
        expect(ip.paragraphs?.[4]).toMatch(/Motion/);
        expect(ip.paragraphs?.[4]).toMatch(/anime\.js/);
        expect(ip.paragraphs?.[4]).toMatch(/\bMIT\b/);
        expect(ip.paragraphs?.[5]).toMatch(/mediabunny/);
        expect(ip.paragraphs?.[5]).toMatch(/2\.0/);
        expect(ip.paragraphs?.[5]).toContain("https://www.media-manipulator.com/licenses");
        expect(flatten(pages.termsOfService.sections[0])).toMatch(/Motion/);
        expect(flatten(pages.privacyPolicy.sections[2])).toMatch(/Motion/);
        expect(pages.legalCommon.whatChangedBody).toMatch(/Motion/);
      });

      it("keeps lastUpdated on the same day as en-US (identical across locales)", () => {
        expect(legalDay(pages.legalCommon.lastUpdated)).toBe(legalDay(en.legalCommon.lastUpdated));
        expect(legalDay(pages.legalCommon.whatChangedTitle)).toBe(legalDay(en.legalCommon.whatChangedTitle));
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
        expect(flatten(motionPrivacy)).not.toBe(flatten(en.privacyPolicy.sections[0].subsections?.[8]));
        expect(ip.paragraphs?.[4]).not.toBe(en.termsOfService.sections[12].paragraphs?.[4]);
        expect(flatten(pages)).not.toMatch(/TODO\(i18n\)/);
      });
    });
  }

  it("en-us ToS §10 names $15 and $150 for Pro beside $8 and $80 for Premium (MM40)", () => {
    const payments = en.termsOfService.sections[9];
    const first = payments.paragraphs?.[0] ?? "";
    expect(first).toContain("Premium is $8 or €8 per month, or $80 or €80 per year");
    expect(first).toContain("Pro is $15 or €15 per month, or $150 or €150 per year");
    expect(first).toContain("billed in US dollars or euros");
    expect(first).toContain("euros by default to visitors in Europe");
    expect(first).toContain("cannot change while it is active");
    expect(first).toContain("no tax is added on top");
    const billing = flatten(en.privacyPolicy.sections[0].subsections?.[5]);
    expect(billing).toContain("the currency you are billed in (US dollars or euros)");
    expect(billing).toContain("mm-currency");
    expect(en.legalCommon.whatChangedBody).toContain("mm-currency");
    expect(flatten(payments)).toMatch(/downgrade from Pro to Premium takes effect at the end of the period/);
    expect(flatten(payments)).toMatch(/nothing is refunded for the rest of that period/);
    expect(flatten(payments)).toMatch(/within 14 days.*This applies to Premium and to Pro/);
  });

  it("en-us Motion copy (MM48): browser-made, never uploaded unless saved, counts stored, MIT notice kept", () => {
    const motion = flatten(en.privacyPolicy.sections[0].subsections?.[8]);
    expect(motion).toContain("produced in your browser");
    expect(motion).toContain("never reach our servers");
    expect(motion).toContain("in the same way as a Darkroom project");
    expect(motion).toContain("listed in your data export");
    expect(motion).toContain("the format, the output height, frame rate and length, the time");
    const terms = en.termsOfService.sections[12].paragraphs ?? [];
    expect(terms[4]).toContain("belong to you");
    expect(terms[4]).toContain("you must keep that notice");
    expect(terms[5]).toContain("Mozilla Public License 2.0");
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

// MM56 decision 4 (design §2.16): Privacy §8 says translator submissions are GitHub
// PRs made by CreaTV Ltd.'s GitHub App and carry only translation text. Own block
// so other legal tickets' edits above stay independent.
describe("MM56 translator-submission sentence (Privacy §8)", () => {
  const EN_SENTENCE =
    "Translators we hire submit their work as GitHub pull requests made by CreaTV Ltd.'s GitHub App; those submissions contain only translation text, no personal data about visitors.";

  it("en-us has the sentence verbatim after §8's bullets, and the What-changed note mentions it", () => {
    const sharing = en.privacyPolicy.sections[7];
    expect(sharing.title).toMatch(/^8\./);
    expect(sharing.afterBullets).toEqual(["We do not sell uploaded files.", EN_SENTENCE]);
    expect(en.legalCommon.whatChangedBody).toContain("GitHub App");
  });

  for (const { code, translated } of locales) {
    it(`${code}: §8 has the sentence (GitHub App, CreaTV Ltd.) and the note names it`, () => {
      const pages = load(code);
      const sharing = pages.privacyPolicy.sections[7];
      expect(sharing.afterBullets).toHaveLength(2);
      const sentence = sharing.afterBullets?.[1] ?? "";
      expect(sentence).toMatch(/GitHub/);
      expect(sentence).toContain("CreaTV Ltd.");
      expect(pages.legalCommon.whatChangedBody).toMatch(/GitHub/);
      if (!translated) expect(sentence).toBe(EN_SENTENCE);
      else if (code !== "en-US") expect(sentence).not.toBe(EN_SENTENCE);
    });
  }
});

/**
 * MM69 guard (ticket decision 6): outside the legal text, no copy names a price with a
 * currency symbol ("$8", "${{price}}", "{{price}} $", "€15"). Every price arrives through
 * formatPrice, already in the visitor's currency; a hard-coded "$" would show dollars to a
 * euro customer. The legal pages (privacyPolicy, termsOfService) are allowed to name both.
 */
describe("no currency-symbol price literals in UI copy outside legal text (MM69)", () => {
  const PRICE_LITERAL = /[$€]\s?(\d|\{\{)|(\d|\}\})\s?[$€]/;
  // Example sentences inside articles are content, not prices (e.g. "revenue jumped by $18,000").
  const CONTENT_SHARDS = new Set(["articles.json"]);
  const strings = (v: unknown, path: string, out: [string, string][]) => {
    if (typeof v === "string") out.push([path, v]);
    else if (Array.isArray(v)) v.forEach((x, i) => strings(x, `${path}[${i}]`, out));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) strings(x, `${path}.${k}`, out);
    return out;
  };
  for (const { code } of locales) {
    it(`${code}: interface shards carry no "$8" / "\${{price}}" style literals`, () => {
      const dir = join(__dirname, "locales", code.toLowerCase(), "interface");
      const offenders: string[] = [];
      for (const file of readdirSync(dir).filter((f) => f.endsWith(".json") && !CONTENT_SHARDS.has(f))) {
        const json = JSON.parse(readFileSync(join(dir, file), "utf8")) as Record<string, unknown>;
        if (file === "pages.json") {
          delete json.privacyPolicy;
          delete json.termsOfService;
        }
        for (const [path, text] of strings(json, file, [])) if (PRICE_LITERAL.test(text)) offenders.push(`${path}: ${text}`);
      }
      expect(offenders).toEqual([]);
    });
  }

  it("price code paths format through formatPrice, never a '$' template", () => {
    for (const rel of [
      "../views/pricing.tsx",
      "../components/pricing/premium-cta.tsx",
      "../components/account/billing-panel.tsx",
      "../components/account/plan-summary.tsx",
      "../components/account/plan-change-dialog.tsx",
      "../components/account/yearly-nudge.tsx",
      "../components/account/checkout-return.tsx",
      "../components/account/upgrade-interstitial.tsx",
      "../components/auth-modal.tsx",
      "../lib/llmsTxt.ts",
    ]) {
      const src = readFileSync(join(__dirname, rel), "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
      expect(src, rel).not.toMatch(/`\$\$\{|'\$'|"\$"|\$\d/);
      // The legacy /api/tiers *PriceUSD fields are read only by lib/billing/price.ts planPrices.
      expect(src, rel).not.toMatch(/\b(premium|pro)Price(Yearly)?USD\b/);
    }
  });
});

// MM78 (voices): Privacy §1.10 "voice samples and designed voices", ToS §8.11 "Voices",
// the §1 bullet, the §3/§3.4/§3.5/§4 mentions, and lastUpdated 2026-10-28 in every locale.
// The consent text version in the Terms is the UI constant (lib/voices/consent.ts) and the
// API's VOICES_CONSENT_TEXT_VERSION default. Own block so other legal tickets stay independent.
describe("MM78 voices legal copy", () => {
  const CONSENT_VERSION = "2026-10-28";

  it("the UI consent constant is the version the Terms name", async () => {
    const { VOICE_CONSENT_TEXT_VERSION, VOICE_CONSENT_TEXT_EN } = await import("@/lib/voices/consent");
    expect(VOICE_CONSENT_TEXT_VERSION).toBe(CONSENT_VERSION);
    const voices = en.termsOfService.sections[7].subsections?.[10];
    expect(voices?.paragraphs?.[1]).toContain(VOICE_CONSENT_TEXT_EN);
    const panels = JSON.parse(readFileSync(join(__dirname, "locales", "en-us", "interface", "panels.json"), "utf8"));
    expect(panels.voiceTools.consent.label).toBe(VOICE_CONSENT_TEXT_EN);
  });

  it("en-us says exactly what the system does", () => {
    const terms = flatten(en.termsOfService.sections[7].subsections?.[10]);
    expect(terms).toContain("only create a voice from a recording of your own voice");
    expect(terms).toContain("impersonate a real person");
    expect(terms).toContain("political deepfakes");
    expect(terms).toContain("harass");
    expect(terms).toContain("fraud");
    expect(terms).toContain("carry an inaudible watermark (PerTh)");
    expect(terms).toContain("Audio changed with the pitch shifter is ordinary signal processing and is not watermarked");
    expect(terms).toContain("suspend or terminate an account");
    expect(terms).toContain(`the current version is ${CONSENT_VERSION}`);
    const privacy = flatten(en.privacyPolicy.sections[0].subsections?.[9]);
    expect(privacy).toContain("explicit consent");
    expect(privacy).toContain("special-category (biometric)");
    expect(privacy).toContain("Amazon S3 under voices/");
    expect(privacy).toContain("follow the retention period you choose");
    expect(privacy).toContain("never shared with a third-party AI provider and are never used to train any model");
    expect(privacy).toContain("from Account, Voices");
    expect(privacy).toContain("deleted when you delete your account");
    expect(privacy).toContain("Your data export lists your saved voices");
    expect(privacy).not.toMatch(/indistinguishable/i);
  });

  for (const { code } of locales) {
    it(`${code}: §1.10, §8.11, the §1 bullet, §3.4, §3.5, §4 models and the 2026-10-28 dates`, () => {
      const pages = load(code);
      const p110 = pages.privacyPolicy.sections[0].subsections ?? [];
      expect(p110).toHaveLength(10);
      expect(p110[9].title).toMatch(/^1\.10 /);
      expect(p110[9].paragraphs).toHaveLength(4);
      expect(flatten(p110[9])).toContain("voices/");
      expect(flatten(p110[9])).toContain("Amazon S3");
      const t8 = pages.termsOfService.sections[7].subsections ?? [];
      expect(t8).toHaveLength(11);
      expect(t8[10].title).toMatch(/^8\.11 /);
      expect(t8[10].paragraphs).toHaveLength(3);
      expect(t8[10].bullets).toHaveLength(6);
      expect(t8[10].afterBullets).toHaveLength(2);
      expect(t8[10].paragraphs?.[1]).toContain(CONSENT_VERSION);
      expect(t8[10].afterBullets?.[0]).toContain("PerTh");
      expect(pages.termsOfService.sections[0].bullets).toHaveLength(10);
      expect(pages.termsOfService.sections[0].bullets?.[8]).toContain("8.11");
      expect(pages.privacyPolicy.sections[3].afterBullets?.[1]).toContain("Chatterbox");
      expect(pages.privacyPolicy.sections[3].afterBullets?.[1]).toContain("Qwen3-TTS");
      expect(legalDay(pages.legalCommon.lastUpdated)).toBe("2026-10-28");
      expect(legalDay(pages.legalCommon.whatChangedTitle)).toBe("2026-10-28");
      expect(pages.legalCommon.whatChangedBody).toContain("1.10");
      expect(pages.legalCommon.whatChangedBody).toContain("8.11");
      // The consent sentence in the Terms is the one the checkbox shows.
      const panels = JSON.parse(readFileSync(join(__dirname, "locales", code.toLowerCase(), "interface", "panels.json"), "utf8"));
      const label = String(panels.voiceTools.consent.label).replace(/[.。।۔]\s*$/u, "");
      expect(t8[10].paragraphs?.[1]).toContain(label.slice(0, 40));
    });
  }
});

// MM87 (AdSense "Required content"): Privacy §5.1 "Advertising cookies and Google AdSense",
// the advertising-identifier row in §1.5, the ToS §8.9 who-sees-ads sentence, the pricing
// FAQ placement promise, and the what-changed note, in every locale. The links are
// byte-identical everywhere; the page renders them as anchors (views/privacy-policy.test.tsx).
// Own block so other legal tickets (MM82's §5 sentence) stay independent.
describe("MM87 advertising disclosures", () => {
  const OPT_OUT_URLS = [
    "https://adssettings.google.com",
    "https://www.aboutads.info/choices",
    "https://youronlinechoices.eu",
    "https://policies.google.com/technologies/partner-sites",
  ];
  const COOKIES_URL = "https://policies.google.com/technologies/cookies";
  const ADS_TXT_URL = "https://www.media-manipulator.com/ads.txt";
  /** Occurrences of `needle` not followed by another URL character (so `…/choices` ≠ `…/choicesX`). */
  const enA3 = (en as unknown as { pricing: { faq: Record<string, string> } }).pricing.faq.a3;
  const countUrl = (hay: string, needle: string) =>
    hay.split(needle).slice(1).filter((rest) => !/^[A-Za-z0-9\-_~/]/.test(rest)).length;

  it("en-us §5.1 carries Google's vendor-cookie and advertising-cookie sentences", () => {
    const sub = en.privacyPolicy.sections[4].subsections?.[0];
    const text = flatten(sub);
    expect(text).toContain("Google, as a third-party vendor, uses cookies to serve ads on Media Manipulator");
    expect(text).toContain("enables it and its partners to serve ads to you based on your visits to Media Manipulator and/or other sites on the Internet");
    expect(text).toContain("non-personalised ads");
    expect(text).toContain("frequency capping");
    expect(text).toContain("(TCF) v2.2");
    expect(text).toContain("Our own cookie bar asks about our first-party analytics only");
    expect(text).toContain("“Cookie settings” in the footer");
    expect(text).toContain("Premium and Pro subscribers never see ads");
    expect(en.legalCommon.whatChangedBody.startsWith("Added the advertising-cookie disclosures Google requires and the opt-out links.")).toBe(true);
    expect(enA3).toContain("There are never more than two ads on a page, never over the tools, and never on the home, pricing, account or legal pages.");
    expect(en.termsOfService.sections[7].subsections?.[8].paragraphs?.[0]).toContain(
      "Ads are shown only to visitors who are not signed in and to free accounts; the paid plans, Premium and Pro, remove them.",
    );
  });

  for (const { code, translated } of locales) {
    it(`${code}: §5.1, the §1.5 identifiers, ToS §8.9, the pricing FAQ and the note`, () => {
      const pages = load(code) as Pages & { pricing: { faq: Record<string, string> } };
      const ads = pages.privacyPolicy.sections[4];
      expect(ads.title).toMatch(/^5\./);
      expect(ads.paragraphs).toHaveLength(en.privacyPolicy.sections[4].paragraphs?.length ?? -1);
      expect(ads.subsections).toHaveLength(1);
      const sub = ads.subsections![0];
      expect(sub.title).toMatch(/^5\.1 /);
      expect(sub.title).toMatch(/AdSense/);
      expect(sub.paragraphs).toHaveLength(4);
      expect(sub.bullets).toHaveLength(4);
      expect(sub.afterBullets).toHaveLength(2);
      expect(flatten(sub)).toMatch(/TCF/);
      expect(flatten(sub)).toMatch(/2\.2/);

      // Each opt-out link exactly once in its own bullet, byte-identical, and nowhere else in the policy.
      const policy = flatten(pages.privacyPolicy);
      OPT_OUT_URLS.forEach((url, i) => {
        expect(sub.bullets?.[i]).toContain(url);
        expect(countUrl(policy, url), url).toBe(1);
      });
      expect(sub.afterBullets?.[1]).toContain(ADS_TXT_URL);

      const cookies = pages.privacyPolicy.sections[0].subsections?.[4];
      expect(cookies?.title).toMatch(/^1\.5 /);
      expect(cookies?.afterBullets).toHaveLength(2);
      const idRow = cookies?.afterBullets?.[1] ?? "";
      for (const name of ["__gads", "__gpi", "IDE", "doubleclick.net", "13", "24", "5.1"]) expect(idRow).toContain(name);
      expect(countUrl(idRow, COOKIES_URL)).toBe(1);

      const t89 = pages.termsOfService.sections[7].subsections?.[8];
      expect(t89?.title).toMatch(/^8\.9 /);
      expect(t89?.paragraphs).toHaveLength(2);
      expect(t89?.paragraphs?.[0]).toMatch(/Premium/);
      expect(t89?.paragraphs?.[0]).toMatch(/\bPro\b/);

      // The placement promise is a sentence of its own (review §3 policy) between the plan
      // sentence and the "no interstitials" sentence, so a3 has one more sentence than before.
      const sentences = (s: string) => s.split(/[.。।۔]\s*/u).filter((x) => x.trim().length > 0).length;
      expect(pages.pricing.faq.a3).toMatch(/Pro/);
      expect(sentences(pages.pricing.faq.a3)).toBe(sentences(enA3));

      expect(legalDay(pages.legalCommon.lastUpdated)).toBe("2026-10-28");
      const note = pages.legalCommon.whatChangedBody;
      for (const s of ["5.1", "1.5", "8.9", "aboutads.info", "youronlinechoices.eu", "ads.txt"]) expect(note).toContain(s);
      // The earlier 2026-10-28 voices note is kept after the new one.
      expect(note.indexOf("5.1")).toBeLessThan(note.indexOf("1.10"));

      if (code === "en-US" || !translated) return;
      expect(flatten(sub)).not.toBe(flatten(en.privacyPolicy.sections[4].subsections?.[0]));
      expect(idRow).not.toBe(en.privacyPolicy.sections[0].subsections?.[4].afterBullets?.[1]);
      expect(t89?.paragraphs?.[0]).not.toBe(en.termsOfService.sections[7].subsections?.[8].paragraphs?.[0]);
      expect(pages.pricing.faq.a3).not.toBe(enA3);
    });
  }
});
