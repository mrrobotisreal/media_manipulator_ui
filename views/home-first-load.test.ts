/**
 * MM88 decision 9: the home route's first load stays free of the result viewers and the
 * heavy media/editor libraries.
 *
 * Measured from `next build` (sum of gzip of the `<script src>` chunks in `en.html`, the
 * MM45 method): 407.4 KB before MM88, 353.9 KB after (315.4 KB for browsers that skip the
 * 39 KB `noModule` polyfill). The number lives in the MM88 ticket log; this test guards the
 * source-level causes so it cannot quietly come back: a static import of the result panel
 * or the file preview from the home view or the recent-results strip, or any static import
 * of a heavy library from the modules every page loads.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(__dirname, '..');
const read = (rel: string) => readFileSync(join(ROOT, rel), 'utf8');
const staticImports = (src: string) =>
  [...src.matchAll(/^import\s+(?!type\b)[^;]*?from\s+['"]([^'"]+)['"]/gm)].map((m) => m[1]);

const HOME_MODULES = ['views/file-converter-app.tsx', 'components/history/recent-strip.tsx'];
const SHARED_CHROME = [
  'app/providers.tsx',
  'components/top-nav.tsx',
  'components/footer.tsx',
  'components/consent/consent-gate.tsx',
  'components/account/account-menu.tsx',
  'components/account/quota-meter.tsx',
  'components/language-selector.tsx',
  ...HOME_MODULES,
];
const HEAVY = ['mediabunny', 'dashjs', 'hls.js', 'recharts', '@tiptap/', 'animejs', '@dnd-kit/', 'zod'];

describe('MM88: home route first load', () => {
  it.each(HOME_MODULES)('%s loads the result viewers lazily', (file) => {
    const imports = staticImports(read(file));
    expect(imports).not.toContain('@/components/results/result-panel');
    expect(imports).not.toContain('@/components/file-preview');
    expect(imports.filter((i) => i.startsWith('@/components/results/viewers/') && !i.endsWith('/kind-icons'))).toEqual([]);
  });

  it('the home view preloads the result panel as soon as a file is chosen', () => {
    const src = read('views/file-converter-app.tsx');
    expect(src.match(/preloadResultViewers\(\);/g)?.length).toBe(2);
  });

  it.each(SHARED_CHROME)('%s has no static import of a heavy library', (file) => {
    const imports = staticImports(read(file));
    expect(imports.filter((i) => HEAVY.some((h) => i === h || i.startsWith(h)))).toEqual([]);
  });
});
