import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import { MOTION_BRAND } from './brand';

const ROOT = join(__dirname, '..', '..');
const SCAN = ['lib/vector', 'components/vector', 'app/(system)/motion'];

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

/** Strip comments so documentation may name the brand. */
const code = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

describe('MOTION_BRAND', () => {
  it('is the user-facing brand', () => {
    expect(MOTION_BRAND).toBe('Motion');
  });

  it('is the only "Motion" string literal in the editor code (ticket MM42 decision 6)', () => {
    const offenders: string[] = [];
    for (const dir of SCAN) {
      for (const file of files(join(ROOT, dir))) {
        const rel = relative(ROOT, file);
        if (rel === 'lib/vector/brand.ts') continue;
        if (/(['"`>])[^'"`<\n]*\bMotion\b/.test(code(readFileSync(file, 'utf8')))) offenders.push(rel);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('never imports the motion npm package', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    expect({ ...pkg.dependencies, ...pkg.devDependencies }).not.toHaveProperty('motion');
    expect({ ...pkg.dependencies, ...pkg.devDependencies }).not.toHaveProperty('gsap');
    expect({ ...pkg.dependencies, ...pkg.devDependencies }).not.toHaveProperty('@theatre/studio');
  });
});
