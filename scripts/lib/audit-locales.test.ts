/**
 * MM86 Decision 6 (preferred form): the locale audit as a Vitest file. The
 * synthetic cases pin the rules; the last block runs the same checker over
 * `.next/server/app` when a build exists (after `npm run build`), so
 * `npm test` re-checks the real HTML without needing one.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";

import { REVIEW_INDEXED_TOOL_SLUGS } from "@/content/reviewAllowlist";
import { locales } from "@/i18n/locales";
import { auditLocalePages, hreflangsOf, isIndexableHtml, privacyParagraphOf } from "./audit-locales.mjs";

const privacy = (text: string) =>
  `<section class="mt-12 flex border-l-2 border-l-data" aria-label="Privacy"><svg></svg><div><h2>Privacy</h2><p class="text-sm text-muted-foreground mt-1">${text}</p></div></section>`;
const page = (robots: string, langs: string[], body: string) =>
  `<html><head><meta name="robots" content="${robots}"/>${langs.map((l) => `<link rel="alternate" hrefLang="${l}" href="https://x/${l}"/>`).join("")}</head><body>${body}</body></html>`;

const EN_NOTE = "Your image is stored under uploads/&lt;jobId&gt;/ on our own server.";
const DE_NOTE = "Ihr Bild wird unter uploads/&lt;jobId&gt;/ auf unserem eigenen Server gespeichert.";

const run = (files: Record<string, string>) =>
  auditLocalePages({
    readHtml: (rel: string) => files[rel] ?? null,
    relPaths: Object.keys(files),
    slugs: ["compress-image"],
    locales,
  });

describe("locale audit helpers", () => {
  it("reads robots, hreflang and the privacy paragraph", () => {
    const html = page("index, follow", ["en-US", "de-DE", "x-default"], privacy(EN_NOTE));
    expect(isIndexableHtml(html)).toBe(true);
    expect(isIndexableHtml(page("noindex, follow", [], ""))).toBe(false);
    expect(hreflangsOf(html)).toEqual(["en-US", "de-DE", "x-default"]);
    expect(privacyParagraphOf(html)).toBe(EN_NOTE);
  });
});

describe("locale audit rules", () => {
  const en = page("index, follow", ["en-US", "de-DE", "x-default"], privacy(EN_NOTE));

  it("passes a translated, indexable German page and a noindex French one", () => {
    const r = run({
      "en/tools/compress-image.html": en,
      "de/tools/compress-image.html": page("index, follow", ["en-US", "de-DE", "x-default"], privacy(DE_NOTE)),
      "fr/tools/compress-image.html": page("noindex, follow", [], privacy(EN_NOTE)),
    });
    expect(r.violations).toEqual([]);
    expect(r.checked).toBe(2);
  });

  it("fails an indexable page that renders the English privacy note", () => {
    const r = run({
      "en/tools/compress-image.html": en,
      "de/tools/compress-image.html": page("index, follow", ["en-US", "de-DE", "x-default"], privacy(EN_NOTE)),
    });
    expect(r.violations).toHaveLength(1);
    expect(r.violations[0]).toMatch(/^de\/tools\/compress-image\.html: indexable but renders the English privacy note/);
  });

  it("fails an hreflang to an unreviewed locale and an indexable unreviewed page", () => {
    const r = run({
      "en/about.html": page("index, follow", ["en-US", "fr-FR", "x-default"], ""),
      "fr/about.html": page("index, follow", [], ""),
    });
    expect(r.violations).toEqual([
      'en/about.html: hreflang "fr-FR" is not a reviewed locale',
      "fr/about.html: indexable page in unreviewed locale fr-FR",
    ]);
  });
});

const builtAppDir = join(process.cwd(), ".next", "server", "app");
const collect = (dir: string): string[] =>
  readdirSync(dir).flatMap((n) => {
    const full = join(dir, n);
    return statSync(full).isDirectory() ? collect(full) : n.endsWith(".html") ? [full] : [];
  });

describe.runIf(existsSync(join(builtAppDir, "en", "tools", "compress-image.html")))("locale audit over the real build", () => {
  it("finds no violation in .next/server/app", () => {
    const rels = collect(builtAppDir).map((abs) => relative(builtAppDir, abs).split(sep).join("/"));
    const r = auditLocalePages({
      readHtml: (rel: string) => (existsSync(join(builtAppDir, rel)) ? readFileSync(join(builtAppDir, rel), "utf8") : null),
      relPaths: rels,
      slugs: [...REVIEW_INDEXED_TOOL_SLUGS],
      locales,
    });
    expect(r.checked).toBeGreaterThan(0);
    expect(r.violations).toEqual([]);
  });
});
