import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import { PHOTO_BRAND } from './brand';

const ROOT = join(__dirname, '..', '..');
const SCAN = ['lib/photo', 'components/photo', 'app/(system)/photo'];

function files(dir: string): string[] {
  const out: string[] = [];
  let entries: string[] = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) out.push(...files(full));
    else if (/\.(ts|tsx)$/.test(e) && !/\.test\.tsx?$/.test(e)) out.push(full);
  }
  return out;
}

const code = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

describe('PHOTO_BRAND', () => {
  it('is the user-facing brand', () => {
    expect(PHOTO_BRAND).toBe('Aperture');
  });

  it('is the only "Aperture" string literal in the editor code (ticket MM97 decision 1)', () => {
    const offenders: string[] = [];
    for (const dir of SCAN) {
      for (const file of files(join(ROOT, dir))) {
        const rel = relative(ROOT, file);
        if (rel === 'lib/photo/brand.ts') continue;
        if (/(['"`>])[^'"`<\n]*\bAperture\b/.test(code(readFileSync(file, 'utf8')))) offenders.push(rel);
      }
    }
    expect(offenders).toEqual([]);
  });
});
