import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { importLottie, LottieImportError } from './lottie';
import { serializeSvg } from '@/lib/vector/exportSvg';
import { exportLottie } from '@/lib/vector/export/lottie';
/**
 * MM46 security: seeded mutation fuzz over every Lottie fixture. Whatever the
 * mutation, `importLottie` either refuses with a `LottieImportError` or
 * returns a document that passed the schema; the result exports again without
 * throwing and its SVG never carries script. Deterministic (fixed seed).
 */
let seed = 12345;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
const VALUES: unknown[] = [null, -1, 1e308, -1e308, 'x', '<script>', [], {}, [1e9, -1e9], true, NaN, 0, { a: 1, k: 'q' }, { a: 1, k: [{ t: 'z' }] }, [[[1]]]];
function mutate(v: unknown, depth = 0): unknown {
  if (Array.isArray(v)) return v.map((x) => (rnd() < 0.08 ? VALUES[Math.floor(rnd() * VALUES.length)] : mutate(x, depth + 1)));
  if (v && typeof v === 'object') {
    const o: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) {
      if (rnd() < 0.03) continue;
      o[k] = rnd() < 0.06 ? VALUES[Math.floor(rnd() * VALUES.length)] : mutate(x, depth + 1);
    }
    return o;
  }
  return v;
}
describe('Lottie reader fuzz', () => {
it('mutated fixtures are refused cleanly or import into a valid document (1800 cases, seeded)', () => {
  const D = join(__dirname, '..', 'fixtures', 'lottie');
  const files = [...readdirSync(D).filter((f) => f.endsWith('.json')).map((f) => join(D, f)), ...readdirSync(join(D, 'unsupported-import')).map((f) => join(D, 'unsupported-import', f))];
  let ok = 0, refused = 0;
  const reasons = new Map<string, number>();
  for (let round = 0; round < 60; round++) {
    for (const f of files) {
      const m = mutate(JSON.parse(readFileSync(f, 'utf8')));
      try {
        const r = importLottie(JSON.stringify(m));
        const svg = serializeSvg(r.doc);
        expect(svg).not.toMatch(/<script|javascript:/i);
        exportLottie(r.doc);
        ok++;
      } catch (e) {
        if (!(e instanceof LottieImportError)) throw new Error(`${f} round ${round}: ${(e as Error).stack}`);
        refused++;
        reasons.set(`${(e as LottieImportError).code}: ${(e as Error).message.slice(0, 80)}`, (reasons.get(`${(e as LottieImportError).code}: ${(e as Error).message.slice(0, 80)}`) ?? 0) + 1);
      }
    }
  }
  expect(ok).toBeGreaterThan(500);
  expect(refused).toBeGreaterThan(0);
  // A schema failure after mapping would mean the reader let a bad value through.
  expect([...reasons.keys()].filter((k) => k.startsWith('invalid'))).toEqual([]);
});
});
