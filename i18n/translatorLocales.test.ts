/**
 * MM51: the translator locale list consumed by the workbench (MM52–MM55).
 * `scripts/list-locales.mjs` prints it for workflows; prefixes double as git
 * branch components (`translate/<prefix>`) and DNS labels.
 */
import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

import { defaultLocale, locales, translatorLocales } from "./locales";
import { format } from "../scripts/list-locales.mjs";

const ROOT = join(__dirname, "..");
const PREFIX_RE = /^[a-z]+(-[a-z]+)?$/;

describe("translatorLocales", () => {
  it("is every locale except English", () => {
    expect(translatorLocales.length).toBe(locales.length - 1);
    expect(translatorLocales.some((l) => l.code === defaultLocale)).toBe(false);
  });

  it("keeps locales.ts order", () => {
    expect(translatorLocales.map((l) => l.code)).toEqual(
      locales.filter((l) => l.code !== defaultLocale).map((l) => l.code),
    );
  });

  it.each(translatorLocales.map((l) => [l.prefix]))("%s is a valid branch component and DNS label", (prefix) => {
    expect(prefix).toMatch(PREFIX_RE);
    expect(prefix.length).toBeLessThanOrEqual(63);
  });

  it("has unique prefixes", () => {
    expect(new Set(translatorLocales.map((l) => l.prefix)).size).toBe(translatorLocales.length);
  });
});

describe("scripts/list-locales.mjs", () => {
  const sample = [
    { prefix: "de", code: "de-DE" },
    { prefix: "pt-br", code: "pt-BR" },
  ];

  it("formats one prefix per line by default", () => {
    expect(format(sample)).toBe("de\npt-br");
  });

  it("formats a JSON array with --json", () => {
    expect(JSON.parse(format(sample, ["--json"]))).toEqual(["de", "pt-br"]);
  });

  it("formats prefix=code with --codes", () => {
    expect(format(sample, ["--codes"])).toBe("de=de-DE\npt-br=pt-BR");
  });

  it("runs on bare Node and prints the registry's translator prefixes, nothing on stderr", () => {
    const run = spawnSync(process.execPath, [join(ROOT, "scripts", "list-locales.mjs")], { encoding: "utf8" });
    expect(run.status).toBe(0);
    expect(run.stderr).toBe("");
    expect(run.stdout.trimEnd().split("\n")).toEqual(translatorLocales.map((l) => l.prefix));
  });
});
