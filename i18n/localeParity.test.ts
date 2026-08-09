/**
 * Locale parity enforcement.
 *
 * Walks every translation shard of every registered locale against en-US and
 * asserts:
 *   1. identical key trees (a key added to en-US must exist everywhere) —
 *      normalizing i18next plural suffixes, since Russian/Ukrainian use
 *      `_one/_few/_many/_other` where English uses `_one/_other`;
 *   2. identical array lengths (returnObjects lists must not drift);
 *   3. identical `{{placeholder}}` sets per string (a translation must
 *      interpolate exactly the values the code passes).
 *
 * This makes "someone added an en key and forgot a locale" a permanent test
 * failure. Locales whose files are still byte-copies of en-US pass trivially
 * until their translation sessions overwrite them.
 */
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { locales } from "./locales";

const LOCALES_DIR = join(__dirname, "locales");

const codeToDir = (code: string) => code.toLowerCase();

/** All shard files of a locale, as paths relative to the locale directory. */
function shardFiles(localeDir: string, subdir = ""): string[] {
  const base = join(LOCALES_DIR, localeDir, subdir);
  const out: string[] = [];
  for (const entry of readdirSync(base)) {
    const full = join(base, entry);
    const rel = subdir ? `${subdir}/${entry}` : entry;
    if (statSync(full).isDirectory()) {
      out.push(...shardFiles(localeDir, rel));
    } else if (entry.endsWith(".json")) {
      out.push(rel);
    }
  }
  return out.sort();
}

const PLURAL_SUFFIXES = ["zero", "one", "two", "few", "many", "other"];

/**
 * Collapse i18next plural-form siblings (`key_one`, `key_few`, …) into a
 * single logical key (`key_#plural`) so locales with different plural
 * cardinalities compare equal.
 */
function normalizeKey(key: string): string {
  const idx = key.lastIndexOf("_");
  if (idx === -1) return key;
  const suffix = key.slice(idx + 1);
  return PLURAL_SUFFIXES.includes(suffix) ? `${key.slice(0, idx)}_#plural` : key;
}

const PLACEHOLDER_RE = /\{\{\s*(\w+)\s*\}\}/g;

function placeholders(text: string): string[] {
  return [...text.matchAll(PLACEHOLDER_RE)].map((m) => m[1]).sort();
}

interface Issue {
  path: string;
  problem: string;
}

/** Recursively compare a reference (en-US) node against a locale's node. */
function compare(ref: unknown, loc: unknown, path: string, issues: Issue[]): void {
  if (Array.isArray(ref)) {
    if (!Array.isArray(loc)) {
      issues.push({ path, problem: "expected an array" });
      return;
    }
    if (ref.length !== loc.length) {
      issues.push({
        path,
        problem: `array length ${loc.length} != en-US length ${ref.length}`,
      });
      return;
    }
    ref.forEach((item, i) => compare(item, loc[i], `${path}[${i}]`, issues));
    return;
  }

  if (ref !== null && typeof ref === "object") {
    if (loc === null || typeof loc !== "object" || Array.isArray(loc)) {
      issues.push({ path, problem: "expected an object" });
      return;
    }
    const refObj = ref as Record<string, unknown>;
    const locObj = loc as Record<string, unknown>;

    const refNormalized = new Map<string, string[]>();
    for (const key of Object.keys(refObj)) {
      const norm = normalizeKey(key);
      refNormalized.set(norm, [...(refNormalized.get(norm) ?? []), key]);
    }
    const locNormalized = new Map<string, string[]>();
    for (const key of Object.keys(locObj)) {
      const norm = normalizeKey(key);
      locNormalized.set(norm, [...(locNormalized.get(norm) ?? []), key]);
    }

    for (const [norm, refKeys] of refNormalized) {
      const locKeys = locNormalized.get(norm);
      if (!locKeys) {
        issues.push({ path: `${path}.${refKeys[0]}`, problem: "missing key" });
        continue;
      }
      if (norm.endsWith("_#plural")) {
        // Plural families compare per-form only for placeholder consistency;
        // form COUNT may differ by language. Use the en `_other` form (or the
        // first form) as the reference string.
        const refSample = refObj[refKeys[refKeys.length - 1]];
        for (const locKey of locKeys) {
          compareLeaf(refSample, locObj[locKey], `${path}.${locKey}`, issues);
        }
      } else {
        compare(refObj[refKeys[0]], locObj[locKeys[0]], `${path}.${refKeys[0]}`, issues);
      }
    }
    for (const [norm, locKeys] of locNormalized) {
      if (!refNormalized.has(norm)) {
        issues.push({ path: `${path}.${locKeys[0]}`, problem: "extra key not in en-US" });
      }
    }
    return;
  }

  compareLeaf(ref, loc, path, issues);
}

function compareLeaf(ref: unknown, loc: unknown, path: string, issues: Issue[]): void {
  if (typeof ref === "string") {
    if (typeof loc !== "string") {
      issues.push({ path, problem: "expected a string" });
      return;
    }
    const refPh = placeholders(ref).join(",");
    const locPh = placeholders(loc).join(",");
    if (refPh !== locPh) {
      issues.push({
        path,
        problem: `placeholders [${locPh}] != en-US [${refPh}]`,
      });
    }
    return;
  }
  if (typeof ref !== typeof loc) {
    issues.push({ path, problem: `type ${typeof loc} != en-US type ${typeof ref}` });
  }
}

describe("no top-level key collisions across shards of a namespace", () => {
  // Both bundlers (lib/i18n/server.tsx and i18n/resources.ts) shallow-merge a
  // namespace's shards into one object, so a top-level key defined in two
  // shards means whichever shard merges later silently replaces the other's
  // block. That is invisible to the per-shard parity checks above and rendered
  // /ru/tools as raw `toolsIndex.*` key echoes when tools.json and pages.json
  // both owned `toolsIndex`. Checking en-US is sufficient: the parity suite
  // forces every locale onto en-US's per-shard key trees.
  const enDir = codeToDir("en-US");
  const byNamespace = new Map<string, string[]>();
  for (const shard of shardFiles(enDir)) {
    const ns = shard.includes("/") ? shard.split("/")[0] : ".";
    byNamespace.set(ns, [...(byNamespace.get(ns) ?? []), shard]);
  }

  for (const [ns, shards] of byNamespace) {
    it(`${ns}: every top-level key has exactly one owning shard`, () => {
      const owners = new Map<string, string[]>();
      for (const shard of shards) {
        const data = JSON.parse(
          readFileSync(join(LOCALES_DIR, enDir, shard), "utf8"),
        ) as Record<string, unknown>;
        for (const key of Object.keys(data)) {
          owners.set(key, [...(owners.get(key) ?? []), shard]);
        }
      }
      const collisions = [...owners.entries()]
        .filter(([, files]) => files.length > 1)
        .map(([key, files]) => `${key}: ${files.join(", ")}`);
      expect(collisions).toEqual([]);
    });
  }
});

describe("locale parity vs en-US", () => {
  const enDir = codeToDir("en-US");
  const enShards = shardFiles(enDir);

  it("en-US has shard files", () => {
    expect(enShards.length).toBeGreaterThan(0);
  });

  for (const { code } of locales) {
    if (code === "en-US") continue;
    const dir = codeToDir(code);

    describe(code, () => {
      it("has exactly the en-US shard files", () => {
        expect(shardFiles(dir)).toEqual(enShards);
      });

      for (const shard of enShards) {
        it(`${shard}: key tree, array lengths and placeholders match`, () => {
          const ref = JSON.parse(
            readFileSync(join(LOCALES_DIR, enDir, shard), "utf8"),
          ) as unknown;
          const loc = JSON.parse(
            readFileSync(join(LOCALES_DIR, dir, shard), "utf8"),
          ) as unknown;
          const issues: Issue[] = [];
          compare(ref, loc, shard.replace(/\.json$/, ""), issues);
          const report = issues
            .slice(0, 25)
            .map((i) => `  ${i.path}: ${i.problem}`)
            .join("\n");
          expect(issues, `\n${report}${issues.length > 25 ? `\n  …and ${issues.length - 25} more` : ""}\n`).toEqual([]);
        });
      }
    });
  }
});
