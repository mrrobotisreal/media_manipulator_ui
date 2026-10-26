/**
 * MM45 acceptance 6: the licence guard, CI-style, over the real package.json
 * and lock file, proven to fail on fake GSAP / Theatre dependencies; plus the
 * licences data (`content/licenses.ts`) matches the pins.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { LICENSES } from '@/content/licenses';

import { forbiddenDependencies } from './licenseGuard';

const ROOT = join(__dirname, '..', '..');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

describe('licence guard', () => {
  it('package.json has no GSAP and no @theatre/studio', () => {
    expect(forbiddenDependencies(pkg)).toEqual([]);
  });

  it('nor does the installed tree (package-lock.json)', () => {
    const lock = JSON.parse(readFileSync(join(ROOT, 'package-lock.json'), 'utf8')) as { packages: Record<string, unknown> };
    const installed = Object.keys(lock.packages)
      .filter((p) => p.startsWith('node_modules/'))
      .map((p) => p.slice(p.lastIndexOf('node_modules/') + 'node_modules/'.length));
    expect(forbiddenDependencies({ dependencies: Object.fromEntries(installed.map((n) => [n, '*'])) })).toEqual([]);
  });

  it('fails on a fake gsap dependency, a GSAP plugin package, and @theatre/studio (fixture)', () => {
    const fake = {
      dependencies: { react: '19.0.0', gsap: '3.15.0' },
      devDependencies: { '@gsap/react': '2.1.2', '@theatre/studio': '0.7.2', '@theatre/core': '0.7.2' },
      optionalDependencies: { 'gsap-trial': '3.12.0' },
    };
    expect(forbiddenDependencies(fake)).toEqual(['@gsap/react', '@theatre/studio', 'gsap', 'gsap-trial']);
  });

  it('allows the MIT / Apache alternatives', () => {
    expect(forbiddenDependencies({ dependencies: { animejs: '4.5.0', flubber: '0.4.2', 'svg-path-commander': '2.3.3', '@theatre/core': '0.7.2' } })).toEqual([]);
  });
});

describe('licences data (content/licenses.ts)', () => {
  it('every entry matches the exact pin in package.json, and animejs is listed as embedded in exports', () => {
    for (const l of LICENSES) expect(pkg.dependencies[l.name], l.name).toBe(l.version);
    const anime = LICENSES.find((l) => l.name === 'animejs')!;
    expect(anime).toMatchObject({ license: 'MIT', embeddedInExports: true });
    const text = readFileSync(join(ROOT, 'node_modules', 'animejs', 'LICENSE.md'), 'utf8');
    expect(text).toContain(anime.copyright);
  });

  it('MM47: mediabunny is listed MPL-2.0, unmodified, with the package copyright and Exhibit A notice', () => {
    const mb = LICENSES.find((l) => l.name === 'mediabunny')!;
    expect(mb).toMatchObject({ license: 'MPL-2.0', modified: false, embeddedInExports: false });
    const own = JSON.parse(readFileSync(join(ROOT, 'node_modules', 'mediabunny', 'package.json'), 'utf8'));
    expect(own.license).toBe('MPL-2.0');
    expect(own.version).toBe(pkg.dependencies.mediabunny);
    const license = readFileSync(join(ROOT, 'node_modules', 'mediabunny', 'LICENSE'), 'utf8').replace(/\s+/g, ' ');
    expect(license).toContain('Mozilla Public License Version 2.0');
    expect(license).toContain(mb.notice!);
    const header = readFileSync(join(ROOT, 'node_modules', 'mediabunny', 'dist', 'modules', 'src', 'index.js'), 'utf8');
    expect(header).toContain(mb.copyright);
  });

  it('MM47: fflate is listed with the copyright from its LICENSE', () => {
    const f = LICENSES.find((l) => l.name === 'fflate')!;
    expect(readFileSync(join(ROOT, 'node_modules', 'fflate', 'LICENSE'), 'utf8')).toContain(f.copyright);
  });

  it('MM47: every exact pin in content/licenses.ts is also exact in package.json (no ranges)', () => {
    for (const l of LICENSES) expect(pkg.dependencies[l.name], l.name).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('MM47: no third-party GIF encoder (the in-house encoder replaces gifenc / modern-gif)', () => {
    expect(Object.keys(pkg.dependencies)).not.toContain('gifenc');
    expect(Object.keys(pkg.dependencies)).not.toContain('modern-gif');
  });

  it('the pinned animejs is exact and MIT in its own package.json', () => {
    const own = JSON.parse(readFileSync(join(ROOT, 'node_modules', 'animejs', 'package.json'), 'utf8'));
    expect(own.license).toBe('MIT');
    expect(own.version).toBe(pkg.dependencies.animejs);
  });
});
