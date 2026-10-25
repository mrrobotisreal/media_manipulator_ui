/**
 * MM51: the 17-locale registry and its href helpers, including hyphenated
 * prefixes and the second RTL locale.
 */
import { describe, expect, it } from "vitest";

import {
  codeToUrlPrefix,
  getLocaleDef,
  isSupportedPrefix,
  localePrefixes,
  locales,
  localizeHref,
  stripLocalePrefix,
  translatedLocales,
  urlPrefixToCode,
} from "./locales";

const NEW_LOCALES = [
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
  it("registers 17 locales with unique codes and prefixes", () => {
    expect(locales).toHaveLength(17);
    expect(new Set(locales.map((l) => l.code)).size).toBe(17);
    expect(new Set(localePrefixes).size).toBe(17);
  });

  it.each(NEW_LOCALES)("%s is registered at /%s, untranslated", (code, prefix) => {
    const def = getLocaleDef(code)!;
    expect(def.prefix).toBe(prefix);
    expect(def.translated).toBe(false);
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

  it("keeps the six original locales as the only translated ones", () => {
    expect(translatedLocales.map((l) => l.code)).toEqual(["en-US", "uk-UA", "ru-RU", "he-IL", "de-DE", "es-ES"]);
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
