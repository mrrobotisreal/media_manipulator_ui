/**
 * MM52 import boundary (ticket decision 12, design §4).
 *
 * Translator code lives in `lib/translator/*` and `components/translator/*`, and
 * production bundles must contain none of it. Statically, that means: no file
 * outside those two directories (tests excepted) may import from them, except
 * `@/lib/translator/mode`, which holds flags and types only. The one sanctioned
 * path into `keyMarker.ts` is the `require('./keyMarker')` inside mode.ts, behind
 * the literal `NEXT_PUBLIC_DEPLOY_ROLE` guard; `scripts/check-no-translator-in-prod.mjs`
 * proves on the built output that the guard folded it away.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(__dirname, '..', '..');
const SCAN = ['app', 'components', 'lib', 'i18n', 'views', 'content', 'proxy.ts', 'next.config.ts'];
const TRANSLATOR_DIRS = ['lib/translator/', 'components/translator/'];
const ALLOWED_TARGET = 'lib/translator/mode';
const IMPORT_RE =
  /(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)|require\s*\(\s*['"]([^'"]+)['"]\s*\)|import\s+['"]([^'"]+)['"]/g;

function files(entry: string): string[] {
  const abs = join(ROOT, entry);
  let st;
  try {
    st = statSync(abs);
  } catch {
    return [];
  }
  if (st.isFile()) return /\.(tsx?|mts|mjs|jsx?)$/.test(entry) ? [abs] : [];
  return readdirSync(abs).flatMap((name) =>
    name === 'node_modules' || name.startsWith('.') ? [] : files(join(entry, name)),
  );
}

const rel = (abs: string) => relative(ROOT, abs).split(sep).join('/');
const isTest = (p: string) => /\.(test|spec|e2e|selfcheck)\.[cm]?[jt]sx?$/.test(p) || p.includes('/__tests__/');
const isTranslatorFile = (p: string) => TRANSLATOR_DIRS.some((d) => p.startsWith(d));

/** Repo-relative module path an import specifier points at (no extension), or null for packages. */
function target(spec: string, fromFile: string): string | null {
  let path: string;
  if (spec.startsWith('@/')) path = spec.slice(2);
  else if (spec.startsWith('.')) path = join(fromFile, '..', spec).split(sep).join('/');
  else return null;
  return path.replace(/\.(tsx?|jsx?|mjs)$/, '').replace(/\/index$/, '');
}

export function boundaryViolations(): string[] {
  const out: string[] = [];
  for (const abs of SCAN.flatMap(files)) {
    const file = rel(abs);
    if (isTest(file) || isTranslatorFile(file)) continue;
    const src = readFileSync(abs, 'utf8');
    for (const m of src.matchAll(IMPORT_RE)) {
      const spec = m[1] ?? m[2] ?? m[3] ?? m[4];
      const t = target(spec, file);
      if (!t || !isTranslatorFile(`${t}/`)) continue;
      if (t === ALLOWED_TARGET) continue;
      out.push(`${file} imports ${spec}`);
    }
  }
  return out;
}

describe('translator import boundary', () => {
  it('nothing outside lib/translator and components/translator imports translator code (mode.ts excepted)', () => {
    expect(boundaryViolations()).toEqual([]);
  });

  it('the check actually sees imports (sanity: mode.ts is imported from app code)', () => {
    const importers = SCAN.flatMap(files)
      .map(rel)
      .filter((f) => !isTest(f) && !isTranslatorFile(f))
      .filter((f) => /@\/lib\/translator\/mode['"]/.test(readFileSync(join(ROOT, f), 'utf8')));
    expect(importers).toEqual(expect.arrayContaining(['i18n/index.ts', 'lib/i18n/server.tsx', 'app/robots.ts']));
  });

  it('mode.ts loads keyMarker only behind the literal role guard', () => {
    const src = readFileSync(join(ROOT, 'lib/translator/mode.ts'), 'utf8');
    const requires = [...src.matchAll(/require\(['"]([^'"]+)['"]\)/g)];
    expect(requires.map((r) => r[1])).toEqual(['./keyMarker']);
    const before = src.slice(0, requires[0].index);
    const guard = before.lastIndexOf("if (process.env.NEXT_PUBLIC_DEPLOY_ROLE === 'translator') {");
    expect(guard).toBeGreaterThan(-1);
    // No closing of that block between the guard and the require.
    expect(before.slice(guard).split('{').length - 1).toBeGreaterThan(before.slice(guard).split('}').length - 1);
    expect(src).not.toMatch(/^import[^;]*['"]\.\/(keyMarker|markerCodec|keyRegistry|domScanner|highlight|devEvents)['"]/m);
  });

  it('mode.ts statically imports nothing but the locale list', () => {
    const src = readFileSync(join(ROOT, 'lib/translator/mode.ts'), 'utf8');
    const specs = [...src.matchAll(/^import\s[^;]*?from\s*['"]([^'"]+)['"]/gm)].map((m) => m[1]);
    expect(specs).toEqual(['@/i18n/locales']);
  });
});
