/**
 * MM48 acceptance 4: Motion copy in every registered locale.
 *   - No `TODO(i18n)` marker anywhere under `vector.*` (any locale).
 *   - Translated locales: the editor strings (`vector.*`), the tool-page chrome
 *     (`motionPage`), the tutorial and the licences page are not left in English,
 *     apart from a short list of genuinely invariant leaves (format names,
 *     placeholder-only patterns).
 *   - Byte-copy locales (`translated: false`, MM51) stay exact copies of en-US.
 */
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { locales } from "./locales";
import { getLocalizedToolBySlug } from "./toolPageContent";

const DIR = join(__dirname, "locales");
const read = (dir: string, shard: string) => JSON.parse(readFileSync(join(DIR, dir, "interface", `${shard}.json`), "utf8"));

function leaves(node: unknown, path = ""): Array<[string, string]> {
  if (typeof node === "string") return [[path, node]];
  if (Array.isArray(node)) return node.flatMap((v, i) => leaves(v, `${path}.${i}`));
  if (node && typeof node === "object") {
    return Object.entries(node).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k));
  }
  return [];
}

/** A leaf may equal English only when it carries no translatable word. */
const INVARIANT = /^[\s,×x:.()p-]*(\{\{\w+\}\}[\s,×x:.()p-]*)+$|^(GIF|Lottie JSON|SVG|MP4|WebM|Beta|Copyright|Version|Format|x|y)$/;

const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((e) => {
    const full = join(dir, e);
    return statSync(full).isDirectory() ? files(full) : [full];
  });

const en = { panels: read("en-us", "panels"), pages: read("en-us", "pages") };

describe("Motion translations (MM48)", () => {
  for (const { code, translated } of locales) {
    const dir = code.toLowerCase();
    describe(code, () => {
      const panels = read(dir, "panels");
      const pages = read(dir, "pages");

      it("has zero TODO(i18n) under vector.*", () => {
        expect(JSON.stringify(panels.vector)).not.toMatch(/TODO\(i18n\)/);
      });

      if (code === "en-US") return;

      if (!translated) {
        it("stays a byte-copy of en-US (every shard except metadata.json)", () => {
          const enDir = join(DIR, "en-us");
          for (const f of files(enDir)) {
            const rel = relative(enDir, f);
            if (rel === join("interface", "metadata.json")) continue;
            expect(readFileSync(join(DIR, dir, rel), "utf8"), rel).toBe(readFileSync(f, "utf8"));
          }
        });
        return;
      }

      it.each([
        ["panels", "vector"],
        ["pages", "motionPage"],
        ["pages", "licenses"],
      ] as const)("translates %s.%s (only invariant leaves may equal English)", (shard, key) => {
        const ref = new Map(leaves((en[shard] as Record<string, unknown>)[key]));
        const mine = leaves((shard === "panels" ? panels : pages)[key]);
        const same = mine.filter(([p, v]) => ref.get(p) === v && !INVARIANT.test(v)).map(([p]) => p);
        // Some words are the same in some languages: German keeps Ellipse, Text, Polygon,
        // Export, Linear, Radial, Offset, Radius, Markup and the motion-design terms Easing and
        // Hold (17 leaves). Anything beyond that means a block was left in English.
        expect(same.length, same.join(", ")).toBeLessThanOrEqual(20);
        expect(mine.length).toBeGreaterThanOrEqual(ref.size * 0.95);
      });

      it("translates the tutorial", () => {
        const t = pages.tutorials.tutorials.motion;
        expect(t.page.intro).not.toBe(en.pages.tutorials.tutorials.motion.page.intro);
        expect(t.page.formats.bullets.svg).not.toBe(en.pages.tutorials.tutorials.motion.page.formats.bullets.svg);
      });

      it("translates the tool page body (toolPages override)", () => {
        const page = getLocalizedToolBySlug("motion", code)!;
        const base = getLocalizedToolBySlug("motion", "en-US")!;
        expect(page.name).toBe("Motion");
        expect(page.intro).not.toBe(base.intro);
        expect(page.faq).toHaveLength(base.faq.length);
        expect(page.faq.every((f, i) => f.question !== base.faq[i].question)).toBe(true);
        expect(page.related.map((r) => r.to)).toEqual(base.related.map((r) => r.to));
        expect(page.metaTitle.length).toBeLessThanOrEqual(75);
      });
    });
  }
});
