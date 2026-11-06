// @vitest-environment node
/**
 * MM121: the staged JASSUB renderer (public/jassub/<v>/) is exactly what
 * scripts/gen-jassub-assets.mjs builds from the pinned dependency, its version matches the loader,
 * the caption fonts exist for every catalog family in both repos, and nothing in the app's import
 * graph pulls jassub into a Next chunk (the renderer is loaded by URL, lazily).
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - .mjs script without types
import { OUT_DIR, VERSION, render } from '../../../scripts/gen-jassub-assets.mjs';
import catalog from './captionsCatalog.json';
import { JASSUB_VERSION, captionAvailableFonts } from './jassubPreview';

const ROOT = process.cwd();

describe('JASSUB staged assets', () => {
  it('match the pinned dependency (run node scripts/gen-jassub-assets.mjs)', async () => {
    expect(VERSION).toBe(JASSUB_VERSION);
    expect(JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).dependencies.jassub).toBe(JASSUB_VERSION);
    const files = (await render()) as Record<string, string>;
    for (const [name, body] of Object.entries(files)) expect(readFileSync(join(OUT_DIR, name), 'utf8'), name).toBe(body);
    for (const w of ['jassub-worker.wasm', 'jassub-worker-modern.wasm']) {
      expect(readFileSync(join(OUT_DIR, w)).equals(readFileSync(join(ROOT, 'node_modules', 'jassub', 'dist', 'wasm', w))), w).toBe(true);
    }
    expect(readdirSync(join(ROOT, 'public', 'jassub'))).toEqual([JASSUB_VERSION]);
  });

  it('is never imported by app code (lazy: loaded by URL only)', () => {
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) {
          if (!['node_modules', '.next', 'graphify-out'].includes(e.name)) walk(p);
        } else if (/\.(ts|tsx|mjs)$/.test(e.name) && !/\.test\./.test(e.name) && !p.includes('scripts/gen-jassub-assets')) {
          if (/from ['"]jassub|import\(['"]jassub|require\(['"]jassub/.test(readFileSync(p, 'utf8'))) offenders.push(p);
        }
      }
    };
    for (const d of ['app', 'components', 'lib', 'views']) walk(join(ROOT, d));
    expect(offenders).toEqual([]);
  });
});

describe('caption fonts in the browser (decision 5)', () => {
  it('every catalog family has its woff2 next to the license, and the same TTF set in the API', () => {
    const dir = join(ROOT, 'public', 'fonts', 'studio', 'captions');
    const api = join(ROOT, '..', 'media_manipulator_api', 'assets', 'fonts', 'studio');
    expect(existsSync(join(dir, 'OFL.txt'))).toBe(true);
    for (const f of catalog.fonts) {
      for (const ttf of [f.regular, f.bold].filter(Boolean) as string[]) {
        expect(existsSync(join(dir, ttf.replace(/\.ttf$/, '.woff2'))), `${f.family}: ${ttf} woff2`).toBe(true);
        if (existsSync(api) && readdirSync(api).some((n) => n.startsWith('bangers'))) expect(existsSync(join(api, ttf)), `${f.family}: ${ttf} in the API`).toBe(true);
      }
    }
  });

  it('JASSUB resolves every family (regular and bold) to the same-origin font set only', () => {
    const fonts = captionAvailableFonts('https://x.test');
    for (const f of catalog.fonts) {
      expect(fonts[f.family.toLowerCase()]).toBe(`https://x.test/fonts/studio/captions/${f.regular.replace('.ttf', '.woff2')}`);
      if (f.bold) expect(fonts[`${f.family.toLowerCase()} bold`]).toMatch(/-700\.woff2$/);
    }
    expect(Object.values(fonts).every((u) => u.startsWith('https://x.test/fonts/studio/captions/'))).toBe(true);
  });
});
