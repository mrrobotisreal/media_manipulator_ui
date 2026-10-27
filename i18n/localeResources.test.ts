/**
 * MM51: non-English eager bundles travel from the server layout to the client
 * instance instead of being bundled. These tests pin the contract: same shape
 * as the bundled English resources, English-only client bundle, and a client
 * instance that renders a locale synchronously from the passed bundle.
 */
import { describe, expect, it } from "vitest";

import { addLocaleResources, createI18nInstance } from "./index";
import { getClientResources } from "./localeResources";
import { resources } from "./resources";
import { defaultLocale, locales } from "./locales";

describe("client resources", () => {
  it("bundles English only", () => {
    expect(Object.keys(resources)).toEqual([defaultLocale]);
  });

  it("returns nothing for English and unknown codes", () => {
    expect(getClientResources(defaultLocale)).toBeUndefined();
    expect(getClientResources("xx-XX")).toBeUndefined();
  });

  it.each(locales.filter((l) => l.code !== defaultLocale).map((l) => [l.code]))(
    "%s has the same namespaces and top-level keys as the English bundle",
    (code) => {
      const bundle = getClientResources(code)!;
      const en = resources[defaultLocale];
      expect(Object.keys(bundle)).toEqual(Object.keys(en));
      for (const ns of Object.keys(en) as (keyof typeof en)[]) {
        expect(Object.keys(bundle[ns]).sort()).toEqual(Object.keys(en[ns]).sort());
      }
    },
  );

  it("byte-copy locales resolve to the English strings", () => {
    expect(getClientResources("pt-BR")).toEqual(resources[defaultLocale]);
  });

  it("a server-passed bundle is usable synchronously at init", () => {
    const de = getClientResources("de-DE")!;
    const i18n = createI18nInstance("de-DE", de);
    const key = Object.keys(de.interface).find((k) => typeof de.interface[k] === "object")!;
    expect(i18n.language).toBe("de-DE");
    expect(i18n.getResourceBundle("de-DE", "interface")[key]).toEqual(de.interface[key]);
  });

  it("addLocaleResources merges once, keeps lazily added keys, and skips English", () => {
    const i18n = createI18nInstance(defaultLocale);
    i18n.addResourceBundle("ru-RU", "interface", { lazyOnly: "x" }, true, true);
    const ru = getClientResources("ru-RU")!;
    addLocaleResources(i18n, "ru-RU", ru);
    addLocaleResources(i18n, "ru-RU", ru);
    const bundle = i18n.getResourceBundle("ru-RU", "interface");
    expect(bundle.lazyOnly).toBe("x");
    expect(Object.keys(bundle)).toEqual(expect.arrayContaining(Object.keys(ru.interface)));
    addLocaleResources(i18n, defaultLocale, ru);
    expect(i18n.getResourceBundle(defaultLocale, "interface")).toEqual(resources[defaultLocale].interface);
  });
});
