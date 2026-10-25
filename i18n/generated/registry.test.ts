/**
 * MM51 staleness guard for the generated i18n registry.
 *
 * `scripts/gen-i18n-registry.mjs` writes `i18n/generated/*.generated.ts` from
 * `i18n/locales.ts`. These tests re-run its pure `render()` in memory and fail
 * when a checked-in file differs (a hand edit, or a locale row added without
 * `npm run i18n:gen`), and check that every registered locale has a directory
 * holding the full shard set the generated imports point at.
 */
import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { defaultLocale, locales } from "../locales";
import {
  EAGER_SHARDS,
  LAZY_SHARDS,
  SERVER_SHARDS,
  codeToDir,
  collectInput,
  render,
} from "../../scripts/gen-i18n-registry.mjs";

const ROOT = join(__dirname, "..", "..");
const LOCALES_DIR = join(ROOT, "i18n", "locales");
const expected = render(collectInput(ROOT, locales, defaultLocale)) as Record<string, string>;

describe("generated i18n registry", () => {
  it("emits exactly the files present in i18n/generated", () => {
    const onDisk = readdirSync(join(ROOT, "i18n", "generated"))
      .filter((f) => f.endsWith(".generated.ts"))
      .map((f) => `i18n/generated/${f}`)
      .sort();
    expect(onDisk).toEqual(Object.keys(expected).sort());
  });

  for (const [rel, content] of Object.entries(expected)) {
    it(`${rel} is up to date`, () => {
      const current = existsSync(join(ROOT, rel)) ? readFileSync(join(ROOT, rel), "utf8") : "";
      expect(
        current === content,
        `${rel} is stale or hand-edited — run \`npm run i18n:gen\` and commit the result`,
      ).toBe(true);
    });
  }

  it("marks every generated file DO NOT EDIT", () => {
    for (const content of Object.values(expected)) {
      expect(content.startsWith("// DO NOT EDIT")).toBe(true);
    }
  });

  it("ships only the default locale's eager shards to the client", () => {
    const client = expected["i18n/generated/resources.generated.ts"];
    const dirs = [...client.matchAll(/\.\.\/locales\/([^/]+)\//g)].map((m) => m[1]);
    expect(new Set(dirs)).toEqual(new Set([codeToDir(defaultLocale)]));
  });

  it("lists every registered locale in the server and lazy maps", () => {
    for (const { code } of locales) {
      expect(expected["i18n/generated/serverBundles.generated.ts"]).toContain(`"${code}": {`);
      expect(expected["i18n/generated/shardLoaders.generated.ts"]).toContain(`"${code}": () =>`);
    }
  });

  it("keeps forms/panels lazy and server-only shards out of the client map", () => {
    const client = expected["i18n/generated/resources.generated.ts"];
    for (const shard of ["forms", "panels", "pages", "articles", "metadata"]) {
      expect(client).not.toContain(`/interface/${shard}.json`);
    }
    expect(expected["i18n/generated/shardLoaders.generated.ts"]).not.toMatch(/^import /m);
    expect(expected["i18n/generated/serverBundles.generated.ts"]).not.toContain("metadata.json");
  });
});

describe("every registered locale has its shard directory", () => {
  const shards = [...new Set([...EAGER_SHARDS, ...LAZY_SHARDS, ...SERVER_SHARDS])];
  for (const { code } of locales) {
    it(`${code} → i18n/locales/${codeToDir(code)}/ has all ${shards.length} shards`, () => {
      const missing = shards.filter((s) => !existsSync(join(LOCALES_DIR, codeToDir(code), `${s}.json`)));
      expect(missing).toEqual([]);
    });
  }
});
