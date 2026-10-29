/**
 * MM51: the locale registry and its href helpers, including hyphenated
 * prefixes and the second RTL locale. MM72 added es-MX next to es-ES (18 locales).
 */
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  codeToUrlPrefix,
  getLocaleDef,
  isIndexableLocale,
  isSupportedPrefix,
  localePrefixes,
  locales,
  localizeHref,
  reviewedLocales,
  stripLocalePrefix,
  translatedLocales,
  unreviewedLocales,
  translatorHomeLocale,
  urlPrefixToCode,
} from "./locales";

// The eleven MM51 locales: all translated by MM57–MM67.
const MM51_LOCALES = [
  ["fr-FR", "fr"],
  ["it-IT", "it"],
  ["ja-JP", "ja"],
  ["zh-CN", "zh-cn"],
  ["zh-TW", "zh-tw"],
  ["ko-KR", "ko"],
  ["ar-SA", "ar"],
  ["hi-IN", "hi"],
  ["pt-PT", "pt-pt"],
  ["pt-BR", "pt-br"],
  ["vi-VN", "vi"],
] as const;

describe("locale registry", () => {
  it("registers 18 locales with unique codes and prefixes", () => {
    expect(locales).toHaveLength(18);
    expect(new Set(locales.map((l) => l.code)).size).toBe(locales.length);
    expect(new Set(localePrefixes).size).toBe(locales.length);
  });

  it.each(MM51_LOCALES)("%s is registered at /%s and translated", (code, prefix) => {
    const def = getLocaleDef(code)!;
    expect(def.prefix).toBe(prefix);
    expect(def.translated).toBe(true);
    expect(urlPrefixToCode(prefix)).toBe(code);
    expect(codeToUrlPrefix(code)).toBe(prefix);
    expect(isSupportedPrefix(prefix)).toBe(true);
  });

  it("does not register bare pt or zh", () => {
    expect(isSupportedPrefix("pt")).toBe(false);
    expect(isSupportedPrefix("zh")).toBe(false);
  });

  it("marks only Hebrew and Arabic right-to-left", () => {
    expect(locales.filter((l) => l.dir === "rtl").map((l) => l.code)).toEqual(["he-IL", "ar-SA"]);
  });

  it("marks all 18 locales as translated", () => {
    expect(translatedLocales.map((l) => l.code)).toEqual(["en-US", "uk-UA", "ru-RU", "he-IL", "de-DE", "es-ES", "es-MX", "fr-FR", "it-IT", "ja-JP", "zh-CN", "zh-TW", "ko-KR", "ar-SA", "hi-IN", "pt-PT", "pt-BR", "vi-VN"]);
  });

  it("MM68: every registered locale is translated", () => {
    expect(translatedLocales.length).toBe(locales.length);
    expect(locales.filter((l) => !l.translated)).toEqual([]);
  });

  it("MM86: Mitch's reviewed list is exactly en-US, uk-UA, ru-RU, de-DE (ticket log 2026-10-28)", () => {
    expect(reviewedLocales.map((l) => l.code)).toEqual(["en-US", "uk-UA", "ru-RU", "de-DE"]);
    expect(unreviewedLocales.map((l) => l.code)).toEqual(["he-IL", "es-ES", "es-MX", "fr-FR", "it-IT", "ja-JP", "zh-CN", "zh-TW", "ko-KR", "ar-SA", "hi-IN", "pt-PT", "pt-BR", "vi-VN"]);
    expect(reviewedLocales.length + unreviewedLocales.length).toBe(locales.length);
  });

  it("MM86: indexable = translated && reviewed", () => {
    for (const l of locales) expect(isIndexableLocale(l.code), l.code).toBe(l.translated && l.reviewed);
    expect(isIndexableLocale("xx-XX")).toBe(false);
  });

  it("es-MX is registered at /es-mx after es-ES, which keeps /es (MM72)", () => {
    const mx = getLocaleDef("es-MX")!;
    expect(mx.prefix).toBe("es-mx");
    expect(mx.translated).toBe(true);
    expect(mx.label).toBe("Español (Latinoamérica)");
    expect(mx.englishLabel).toBe("Spanish (Latin America)");
    expect(mx.flag).toBe("🇲🇽");
    expect(urlPrefixToCode("es-mx")).toBe("es-MX");
    expect(isSupportedPrefix("es-mx")).toBe(true);
    const es = getLocaleDef("es-ES")!;
    expect(es.prefix).toBe("es");
    expect(es.label).toBe("Español (España)");
    expect(es.englishLabel).toBe("Spanish (Spain)");
    expect(locales.map((l) => l.code).indexOf("es-MX")).toBe(locales.map((l) => l.code).indexOf("es-ES") + 1);
    expect(localizeHref("/tools/compress-video", "es-MX")).toBe("/es-mx/tools/compress-video");
    expect(stripLocalePrefix("/es-mx/about")).toBe("/about");
    expect(stripLocalePrefix("/es/about")).toBe("/about");
  });

  it("fr-FR is registered at /fr and translated (MM57)", () => {
    const def = getLocaleDef("fr-FR")!;
    expect(def.prefix).toBe("fr");
    expect(def.translated).toBe(true);
    expect(urlPrefixToCode("fr")).toBe("fr-FR");
    expect(isSupportedPrefix("fr")).toBe(true);
  });
});

describe("href helpers with hyphenated prefixes", () => {
  it.each([
    ["zh-CN", "/zh-cn"],
    ["pt-BR", "/pt-br"],
    ["ar-SA", "/ar"],
  ])("localizeHref for %s", (code, base) => {
    expect(localizeHref("/", code)).toBe(base);
    expect(localizeHref("/tools/compress-image", code)).toBe(`${base}/tools/compress-image`);
    expect(localizeHref("/dr/x", code)).toBe("/dr/x");
    expect(localizeHref("https://example.com", code)).toBe("https://example.com");
  });

  it.each(["zh-cn", "zh-tw", "pt-pt", "pt-br", "ar"])("stripLocalePrefix removes /%s", (prefix) => {
    expect(stripLocalePrefix(`/${prefix}`)).toBe("/");
    expect(stripLocalePrefix(`/${prefix}/about`)).toBe("/about");
  });

  it("does not strip a look-alike first segment", () => {
    expect(stripLocalePrefix("/pt/about")).toBe("/pt/about");
    expect(stripLocalePrefix("/zh-cnx/about")).toBe("/zh-cnx/about");
  });

  it("round-trips a path between two hyphenated locales", () => {
    const zh = localizeHref("/pricing", "zh-TW");
    expect(localizeHref(stripLocalePrefix(zh), "pt-PT")).toBe("/pt-pt/pricing");
  });
});

describe("localizeHref and the Motion editor (MM42)", () => {
  it("leaves /motion/x unchanged for ru-RU while /tools/motion is prefixed", () => {
    expect(localizeHref("/motion/x", "ru-RU")).toBe("/motion/x");
    expect(localizeHref("/tools/motion", "ru-RU")).toBe("/ru/tools/motion");
  });

  it.each(locales.map((l) => [l.code]))("never prefixes the editor route for %s", (code) => {
    for (const href of ["/motion", "/motion/new", "/motion/abc?x=1", "/motion#top", "/motion?from=tools"]) {
      expect(localizeHref(href, code)).toBe(href);
    }
  });

  it("still localizes look-alikes", () => {
    expect(localizeHref("/motion-graphics", "de-DE")).toBe("/de/motion-graphics");
    expect(localizeHref("/motions", "de-DE")).toBe("/de/motions");
  });
});

/** MM56: on a translator deployment English is reached under `/en` (proxy lands `/` on the locale). */
describe("translator deployment hrefs (MM56)", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("production: English stays unprefixed and /en is not a public prefix", () => {
    vi.stubEnv("NEXT_PUBLIC_DEPLOY_ROLE", "");
    expect(translatorHomeLocale()).toBeNull();
    expect(localizeHref("/about", "en-US")).toBe("/about");
    expect(stripLocalePrefix("/en/about")).toBe("/en/about");
  });

  it("translator de-DE: English links carry /en, and /en is stripped like any prefix", () => {
    vi.stubEnv("NEXT_PUBLIC_DEPLOY_ROLE", "translator");
    vi.stubEnv("NEXT_PUBLIC_TRANSLATOR_LOCALE", "de-DE");
    expect(translatorHomeLocale()?.code).toBe("de-DE");
    expect(localizeHref("/", "en-US")).toBe("/en");
    expect(localizeHref("/about", "en-US")).toBe("/en/about");
    expect(localizeHref("/dr/x", "en-US")).toBe("/dr/x");
    expect(localizeHref("/about", "de-DE")).toBe("/de/about");
    expect(stripLocalePrefix("/en/about")).toBe("/about");
    expect(stripLocalePrefix("/en")).toBe("/");
  });

  it("an unknown locale or English as the translator locale resolves to null", () => {
    vi.stubEnv("NEXT_PUBLIC_DEPLOY_ROLE", "translator");
    for (const bad of ["", "xx-XX", "en-US"]) {
      vi.stubEnv("NEXT_PUBLIC_TRANSLATOR_LOCALE", bad);
      expect(translatorHomeLocale(), bad).toBeNull();
    }
  });
});
