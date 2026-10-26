/**
 * MM54: the translation-PR path guard (`scripts/check-i18n-pr-paths.mjs`).
 */
import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

import { checkI18nPrPaths, escapeWorkflowData } from "./check-i18n-pr-paths.mjs";

const SCRIPT = join(__dirname, "check-i18n-pr-paths.mjs");
const DIRS = ["de-de", "pt-br", "ja-jp"];

describe("checkI18nPrPaths", () => {
  it("passes a PR touching one locale only", () => {
    const r = checkI18nPrPaths(["i18n/locales/de-de/interface/_core.json", "i18n/locales/de-de/error/_core.json"], DIRS);
    expect(r).toEqual({ ok: true, localeDir: "de-de", offending: [], reason: null });
  });

  it("fails a synthetic diff that touches app/", () => {
    const r = checkI18nPrPaths(["app/page.tsx", "i18n/locales/de-de/interface/_core.json"], DIRS);
    expect(r.ok).toBe(false);
    expect(r.offending).toEqual(["app/page.tsx"]);
  });

  it("fails two locales and names the dirs", () => {
    const r = checkI18nPrPaths(["i18n/locales/de-de/a.json", "i18n/locales/pt-br/a.json"], DIRS);
    expect(r.ok).toBe(false);
    expect(r.reason).toContain("de-de");
    expect(r.reason).toContain("pt-br");
  });

  it("fails en-us and unknown dirs", () => {
    expect(checkI18nPrPaths(["i18n/locales/en-us/interface/_core.json"], DIRS).offending).toHaveLength(1);
    expect(checkI18nPrPaths(["i18n/locales/xx-xx/a.json"], DIRS).ok).toBe(false);
  });

  it("fails the English-only interface/metadata.json shard", () => {
    const r = checkI18nPrPaths(["i18n/locales/de-de/interface/metadata.json"], DIRS);
    expect(r.ok).toBe(false);
    expect(r.offending).toEqual(["i18n/locales/de-de/interface/metadata.json"]);
  });

  it.each([
    "i18n/locales/de-de/../en-us/a.json",
    "i18n/locales/de-de/../../../app/x.json",
    "i18n/locales/de-de\\a.json",
    "/i18n/locales/de-de/a.json",
    "i18n/locales/de-de/a\0.json",
    "i18n/locales/de-de//a.json",
  ])("fails a traversal or malformed path %j", (p) => {
    expect(checkI18nPrPaths([p], DIRS).ok).toBe(false);
  });

  it("fails a non-.json file in the locale dir", () => {
    expect(checkI18nPrPaths(["i18n/locales/de-de/interface/notes.md"], DIRS).ok).toBe(false);
    expect(checkI18nPrPaths(["i18n/locales/de-de/toolPages.ts"], DIRS).ok).toBe(false);
  });

  it("fails a file directly in i18n/locales/ and the bare locale dir", () => {
    expect(checkI18nPrPaths(["i18n/locales/de-de.json"], DIRS).ok).toBe(false);
    expect(checkI18nPrPaths(["i18n/locales/a.json"], DIRS).ok).toBe(false);
  });

  it("fails an empty list", () => {
    const r = checkI18nPrPaths([], DIRS);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("no changed files");
  });
});

describe("escapeWorkflowData", () => {
  it("escapes %, CR and LF", () => {
    expect(escapeWorkflowData("a%b\r\nc")).toBe("a%25b%0D%0Ac");
  });
});

describe("scripts/check-i18n-pr-paths.mjs CLI", () => {
  const run = (stdin: string, env: Record<string, string> = {}) =>
    spawnSync(process.execPath, [SCRIPT], { input: stdin, encoding: "utf8", env: { ...process.env, GITHUB_ACTIONS: "", ...env } });

  it("exits 0 for one real locale dir (derived from locales.ts), tolerating blank lines and CRLF", () => {
    const r = run("i18n/locales/de-de/interface/_core.json\r\n\n");
    expect(r.status).toBe(0);
    expect(r.stdout).toContain("de-de");
  });

  it("exits 1 for app/page.tsx and emits ::error:: only under GITHUB_ACTIONS", () => {
    const plain = run("app/page.tsx\n");
    expect(plain.status).toBe(1);
    expect(plain.stdout).not.toContain("::error::");
    expect(plain.stderr).toContain("app/page.tsx");
    const gha = run("app/page.tsx\n", { GITHUB_ACTIONS: "true" });
    expect(gha.status).toBe(1);
    expect(gha.stdout).toContain("::error::Not allowed in a translation PR: app/page.tsx");
  });

  it("exits 1 for two locales and for empty stdin", () => {
    expect(run("i18n/locales/de-de/a.json\ni18n/locales/pt-br/a.json\n").status).toBe(1);
    expect(run("").status).toBe(1);
  });
});
