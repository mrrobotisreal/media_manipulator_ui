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
  if (word && /^(ноября|листопада|November|noviembre)$/iu.test(word[2])) return `${word[3]}-11-${word[1].padStart(2, "0")}`;
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
        expect(legalDay(pages.legalCommon.lastUpdated)).toBe("2026-11-04"); // MM107 bumped it from the 3rd (MM100 from the 1st)
        expect(legalDay(pages.legalCommon.whatChangedTitle)).toBe("2026-11-04");
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
        expect(ip.paragraphs).toHaveLength(7); // MM100 appends the Aperture sentence
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
      // MM85 appends §1.11 (contact messages) after §1.10.
      expect(p110.length).toBeGreaterThanOrEqual(10);
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
      expect(pages.termsOfService.sections[0].bullets).toHaveLength(12);
      expect(pages.termsOfService.sections[0].bullets?.[9]).toContain("8.11");
      expect(pages.privacyPolicy.sections[3].afterBullets?.[1]).toContain("Chatterbox");
      expect(pages.privacyPolicy.sections[3].afterBullets?.[1]).toContain("Qwen3-TTS");
      expect(legalDay(pages.legalCommon.lastUpdated)).toBe("2026-11-04"); // MM107 (MM100 set the 3rd)
      expect(legalDay(pages.legalCommon.whatChangedTitle)).toBe("2026-11-04");
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
    // MM85's contact-form sentence leads the note since the MM85 merge; MM87's follows it.
    expect(en.legalCommon.whatChangedBody).toContain("Added the advertising-cookie disclosures Google requires and the opt-out links.");
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

      expect(legalDay(pages.legalCommon.lastUpdated)).toBe("2026-11-04"); // MM107 (MM100 the 3rd, MA09 the 1st)
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

describe("MM85 contact-form legal copy", () => {
  it("en-us names what the form collects, where it goes and how long it is kept", () => {
    const p111 = flatten(en.privacyPolicy.sections[0].subsections?.[10]);
    for (const fact of ["contact form", "your name, your email address", "Resend", "not stored in our application database", "until the conversation is closed", "12 months", "rate-limited"]) {
      expect(p111).toContain(fact);
    }
    expect(en.privacyPolicy.sections[15].paragraphs?.[0]).toContain("media-manipulator.com/contact");
    expect(en.legalCommon.whatChangedBody).toContain("We added a contact form");
  });

  for (const { code } of locales) {
    it(`${code}: §1.11 after §1.10, §16 points to the form, the what-changed note leads with it`, () => {
      const pages = load(code);
      const subs = pages.privacyPolicy.sections[0].subsections ?? [];
      expect(subs.length).toBeGreaterThanOrEqual(12); // MM107 added 1.13
      expect(subs[10].title).toMatch(/^1\.11 /);
      expect(subs[10].paragraphs).toHaveLength(2);
      expect(flatten(subs[10])).toContain("Resend");
      expect(flatten(subs[10])).toMatch(/12/);
      expect(flatten(subs[10])).toContain("media-manipulator.com/contact");
      const contact = pages.privacyPolicy.sections[15];
      expect(contact.paragraphs).toHaveLength(2);
      expect(contact.paragraphs?.[0]).toContain("media-manipulator.com/contact");
      expect(contact.paragraphs?.[0]).toContain("1.11");
      expect(pages.legalCommon.whatChangedBody).toContain("1.11");
      // Terms are unchanged by MM85 (decision 11).
      expect(flatten(pages.termsOfService)).not.toContain("media-manipulator.com/contact");
    });
  }
});

// MA09: Sign in with Apple. Privacy §1.7 (+ reset sentence), §8 sharing bullet and Terms §9 name
// Apple in every locale, the stale "or with Google." sentence is gone, and the note is on top.
describe("MA09 Sign in with Apple legal copy", () => {
  it("en-US has the exact new sentences", () => {
    expect(en.privacyPolicy.sections[0].subsections?.[6].paragraphs?.[0]).toContain("with your Apple Account");
    expect(en.privacyPolicy.sections[0].subsections?.[6].paragraphs?.[0]).toContain("Hide My Email");
    expect(en.privacyPolicy.sections[0].subsections?.[6].paragraphs?.[0]).toContain("Firebase sends a reset link");
    expect(en.termsOfService.sections[8].paragraphs?.[1]).toContain("with Google or with Apple");
    expect(flatten(en)).not.toContain("or with Google.");
  });

  for (const { code } of locales) {
    it(`${code}: names Apple in §1.7, §8 and Terms §9, with their note in the body`, () => {
      const pages = load(code);
      expect(pages.privacyPolicy.sections[0].subsections?.[6].paragraphs?.[0]).toMatch(/Apple/);
      expect(pages.privacyPolicy.sections[7].bullets?.some((b) => /Apple/.test(b))).toBe(true);
      expect(pages.termsOfService.sections[8].paragraphs?.[1]).toMatch(/Apple/);
      expect(pages.legalCommon.whatChangedBody).toMatch(/Apple/);
      expect(legalDay(pages.legalCommon.lastUpdated)).toBe("2026-11-04");
      expect(pages.legalCommon.whatChangedBody).toMatch(/1\.7/);
    });
  }
});

// MM100: Aperture's data categories (Privacy §1.12) and its Terms sentences (§1 bullet, §13), in every locale.
describe("MM100 Aperture legal copy", () => {
  it("en-us: browser edit, uploads only on request, project storage, own GPU, counted jobs, outputs belong to you", () => {
    const sub = flatten(en.privacyPolicy.sections[0].subsections?.[11]);
    for (const fact of [
      "1.12 Aperture Projects and Exports",
      "drawn on your own device",
      "a preview copy of it at up to 1920 pixels",
      "follow the retention period you choose",
      "listed in your data export",
      "kept only in your browser",
      "kept for 24 hours",
      "our own GPU server",
      "none of your photos is sent to a third-party service",
      "hashed IP address",
    ]) {
      expect(sub).toContain(fact);
    }
    expect(flatten(en.privacyPolicy.sections[2])).toContain("Aperture projects");
    expect(flatten(en.privacyPolicy.sections[3])).toContain("rembg and LaMa");
    expect(flatten(en.termsOfService.sections[0].bullets)).toContain("Aperture");
    const terms = en.termsOfService.sections[12].paragraphs ?? [];
    expect(terms).toHaveLength(7);
    expect(terms[6]).toContain("belong to you");
    expect(terms[6]).toContain("never changes the original file");
    expect(en.legalCommon.whatChangedBody.includes("We added Aperture")).toBe(true);
  });

  for (const { code } of locales) {
    it(`${code}: §1.12, the §1 bullet, §13, §3 / §3.3 / §3.4 and §4 name Aperture; the note leads with it`, () => {
      const pages = load(code);
      const sub = pages.privacyPolicy.sections[0].subsections ?? [];
      expect(sub.length).toBeGreaterThanOrEqual(12); // MM107 added 1.13
      expect(sub[11].title).toMatch(/^1\.12 /);
      expect(sub[11].title).toContain("Aperture");
      expect(sub[11].paragraphs).toHaveLength(3);
      // The numbers and technical terms that must survive translation.
      expect(flatten(sub[11])).toMatch(/1920/);
      expect(flatten(sub[11])).toMatch(/24/);
      expect(flatten(sub[11])).toContain("IndexedDB");
      expect(flatten(sub[11])).toContain("GPU");
      expect(flatten(pages.privacyPolicy.sections[2])).toContain("Aperture");
      expect(flatten(pages.privacyPolicy.sections[3])).toContain("LaMa");
      expect(pages.termsOfService.sections[0].bullets).toHaveLength(12);
      expect(pages.termsOfService.sections[0].bullets?.[8]).toContain("Aperture");
      expect(pages.termsOfService.sections[12].paragraphs).toHaveLength(7);
      expect(pages.termsOfService.sections[12].paragraphs?.[6]).toContain("Aperture");
      expect(pages.legalCommon.whatChangedBody).toContain("Aperture");
      expect(pages.legalCommon.whatChangedBody).toContain("1.12");
      expect(legalDay(pages.legalCommon.lastUpdated)).toBe("2026-11-04");
      expect(legalDay(pages.legalCommon.whatChangedTitle)).toBe("2026-11-04");
      // Same day in every locale.
      expect(legalDay(pages.legalCommon.lastUpdated)).toBe(legalDay(en.legalCommon.lastUpdated));
    });

    it(`${code}: the Aperture legal text is translated, not copied (non-English locales)`, () => {
      if (code.toLowerCase() === "en-us") return;
      const pages = load(code);
      expect(flatten(pages.privacyPolicy.sections[0].subsections?.[11])).not.toBe(flatten(en.privacyPolicy.sections[0].subsections?.[11]));
      expect(pages.termsOfService.sections[12].paragraphs?.[6]).not.toBe(en.termsOfService.sections[12].paragraphs?.[6]);
      expect(pages.termsOfService.sections[0].bullets?.[8]).not.toBe(en.termsOfService.sections[0].bullets?.[8]);
      expect(pages.legalCommon.whatChangedBody).not.toBe(en.legalCommon.whatChangedBody);
    });
  }
});

// MM103: the preset sentence in Privacy 1.12 (second paragraph) and the account strings, in every locale.
describe("MM103 presets copy", () => {
  for (const { code } of locales) {
    it(`${code}: Privacy 1.12 carries the preset sentence, and the new keys exist`, () => {
      const pages = load(code);
      const sub = pages.privacyPolicy.sections[0].subsections?.[11];
      expect(sub?.title).toMatch(/^1\.12/);
      expect(sub?.paragraphs).toHaveLength(3);
      if (code.toLowerCase() === "en-us") {
        expect(sub?.paragraphs?.[1]).toContain("Presets you save are stored with your account until you delete them or the account.");
      } else {
        // translated: the paragraph grew by one sentence over the MM100 text
        expect(sub?.paragraphs?.[1].length).toBeGreaterThan(en.privacyPolicy.sections[0].subsections?.[11]?.paragraphs?.[1].length ? 200 : 0);
      }
      const proj = (pages as unknown as { account: { projects: Record<string, unknown> } }).account.projects;
      for (const k of ["presetsHeading", "presetsIntro", "presetsEmpty", "presetDeleteBody", "presetDeleted", "presetRenamed", "presetCategory"]) expect(proj[k], k).toBeTruthy();
      const rows = (pages as unknown as { pricing: { rows: Record<string, string> } }).pricing.rows;
      expect(rows.photoPresets).toContain("{{brand}}");
    });
  }
});

describe("MA26 mobile app legal sections", () => {
  it("en-US no longer says Firebase is used only for account sign-in", () => {
    expect(flatten(en.privacyPolicy)).not.toMatch(/Firebase is now used only for account sign-in/);
    expect(flatten(en.privacyPolicy)).toContain("Firebase Crashlytics");
  });
  for (const { code } of locales) {
    it(`${code}: Privacy has 17 sections (17.1-17.7), Terms 25, and the what-changed note names the app`, () => {
      const pages = load(code);
      expect(pages.privacyPolicy.sections).toHaveLength(17);
      expect(pages.termsOfService.sections).toHaveLength(25);
      expect(pages.privacyPolicy.sections[16].subsections).toHaveLength(7);
      expect(pages.privacyPolicy.sections[16].title).toMatch(/^17\./);
      expect(pages.termsOfService.sections[24].title).toMatch(/^25\./);
      expect(pages.legalCommon.whatChangedBody).toMatch(/\b17\b/);
      expect(flatten(pages.privacyPolicy.sections[16])).toContain("https://www.media-manipulator.com/delete-account");
    });
  }
});

// MM107: Medi (Privacy §1.13, the §4 exception, the §8 processors bullet, Terms §6) and the
// 2026-11-04 dates, in every locale; the assistant shard exists everywhere with every key.
describe("MM107 Medi legal copy", () => {
  it("en-us says what goes where, and nothing stronger than the providers promise", () => {
    const sub = flatten(en.privacyPolicy.sections[0].subsections?.[12]);
    for (const fact of [
      "1.13 Medi, the AI Assistant",
      "OpenRouter, Inc.",
      "Anthropic",
      "at most 1024 pixels",
      "Medi does not send your original files",
      "only to Anthropic",
      "excludes providers that collect user data",
      "OpenRouter states that it does not use your inputs or outputs to train models",
      "within 30 days",
      "follow the retention period you choose",
      "included in your data export",
      "deleted with your account",
      "we do not store your conversation",
      "Preview images are never stored by us",
      "kept for 13 months",
      "can be wrong",
    ]) {
      expect(sub).toContain(fact);
    }
    // Never claim zero retention or that the providers never store anything.
    expect(sub).not.toMatch(/zero (data )?retention|never (store|keep)s? (any|your) (data|messages)/i);
    expect(en.privacyPolicy.sections[3].afterBullets?.at(-1)).toContain("Medi");
    expect(en.privacyPolicy.sections[7].bullets?.[7]).toContain("OpenRouter, Inc. and Anthropic");
    expect(en.termsOfService.sections[5].afterBullets?.at(-1)).toContain("can be wrong");
    expect(en.legalCommon.whatChangedBody.startsWith("We added Medi")).toBe(true);
  });

  for (const { code } of locales) {
    it(`${code}: §1.13, §4, §8, Terms §6 and the 2026-11-04 dates`, () => {
      const pages = load(code);
      const sub = pages.privacyPolicy.sections[0].subsections ?? [];
      expect(sub).toHaveLength(13);
      expect(sub[12].title).toMatch(/^1\.13 /);
      expect(sub[12].title).toContain("Medi");
      expect(sub[12].paragraphs).toHaveLength(4);
      const text = flatten(sub[12]);
      for (const k of ["OpenRouter", "Anthropic", "1024", "30", "13"]) expect(text).toContain(k);
      expect(pages.privacyPolicy.sections[3].afterBullets?.at(-1)).toContain("Medi");
      expect(pages.privacyPolicy.sections[7].bullets).toHaveLength(12);
      expect(pages.privacyPolicy.sections[7].bullets?.[7]).toContain("Anthropic");
      expect(pages.termsOfService.sections[5].afterBullets?.at(-1)).toContain("Medi");
      expect(pages.legalCommon.whatChangedBody).toContain("Medi");
      expect(pages.legalCommon.whatChangedBody).toContain("1.13");
      expect(legalDay(pages.legalCommon.lastUpdated)).toBe("2026-11-04");
      expect(legalDay(pages.legalCommon.whatChangedTitle)).toBe("2026-11-04");
      if (code.toLowerCase() === "en-us") return;
      expect(flatten(sub[12])).not.toBe(flatten(en.privacyPolicy.sections[0].subsections?.[12]));
      expect(pages.termsOfService.sections[5].afterBullets?.at(-1)).not.toBe(en.termsOfService.sections[5].afterBullets?.at(-1));
    });
  }
});

describe("MM107 Medi UI shard", () => {
  const shard = (code: string) =>
    JSON.parse(readFileSync(join(__dirname, "locales", code.toLowerCase(), "interface", "assistant.json"), "utf8"));
  const keys = (o: unknown, p = ""): string[] =>
    o && typeof o === "object" ? Object.entries(o as Record<string, unknown>).flatMap(([k, v]) => keys(v, p ? `${p}.${k}` : k)) : [p];
  const get = (o: unknown, path: string): unknown => path.split(".").reduce<unknown>((a, k) => (a as Record<string, unknown>)?.[k], o);
  const enShard = shard("en-US");
  // i18next plural siblings (`key_one`, `key_few`, …) are one logical key: locales have different forms (MM108).
  const plural = (k: string) => k.replace(/_(zero|one|two|few|many|other)$/, "_#plural");
  const logical = (o: unknown) => Array.from(new Set(keys(o).map(plural))).sort();
  // Colour names spelled the same in some languages (es "magenta", it "magenta") (MM108).
  // MM116b: the job card's unit symbols and the loanwords/cognates a locale spells like English (jazz, rock, mono, codec...).
  const COGNATE = /^assistant\.(copilot\.colors\.(magenta|aqua)|jobCard\.(units\.[A-Za-z]+|file|fields\.(bitrate|codec|equalizerPreset|fadeIn|fadeOut|filter|output|overlayText|pageSelection|rotation|saturation|startTime|volume)|values\.(auto|image|jazz|lin|mono|point|rock|sepia|standard|stereo|video|vintage|vocal)))$/;
  for (const { code } of locales) {
    it(`${code}: assistant.json has every key, no English left (brand names aside)`, () => {
      const s = shard(code);
      expect(logical(s)).toEqual(logical(enShard));
      if (code.toLowerCase() === "en-us") return;
      for (const k of keys(enShard)) {
        if (k.startsWith("assistant.editors.") || COGNATE.test(k)) continue;
        // Placeholder-only or punctuation-only values (the title, "{{brand}}: {{summary}}").
        if (!/[A-Za-z]{2}/.test(String(get(enShard, k)).replace(/\{\{\s*\w+\s*\}\}/g, "").replace("Ctrl+J", ""))) continue;
        const got = get(s, k) ?? get(s, k.replace(/_(one|other)$/, "_other"));
        expect(got, `${code} ${k}`).not.toBe(get(enShard, k));
      }
    });
  }
});
