/**
 * MM45 security: values from the document never break out of the CSS
 * `<style>` or the anime `<script>` of an export, whichever runtime is used.
 * Hostile documents are hand-built (they bypass the schema on purpose).
 */
import { describe, expect, it } from 'vitest';

import { exportAnimatedSvgAnime } from './anime';
import { exportAnimatedSvgCss } from './css';
import type { VectorDoc } from '@/lib/vector/vectorTypes';

const base = (animations: unknown[], extra: Partial<VectorDoc> = {}): VectorDoc =>
  ({
    version: 1,
    canvas: { width: 100, height: 100, viewBox: { x: 0, y: 0, width: 100, height: 100 }, background: 'transparent' },
    duration: 1000,
    fps: 24,
    layers: [
      { type: 'path', id: 'p', d: 'M0 0L10 0', fill: 'url(#g)' },
      { type: 'path', id: 'guide', d: 'M0 0L100 0' },
    ],
    defs: {
      gradients: [{ type: 'linear', id: 'g', x1: 0, y1: 0, x2: 1, y2: 0, stops: [{ offset: 0, color: '#000' }, { offset: 1, color: '#fff' }] }],
      masks: [],
      clipPaths: [],
      filters: [],
      symbols: [],
    },
    animations,
    ...extra,
  }) as VectorDoc;

const PAYLOADS = ["red;}</style><script>alert(1)</script>", "#fff') ; } * { x: url(https://e.example/x)", ']]></script><script>alert(1)</script>', 'M0 0</script>'];

describe('export safety', () => {
  it.each(PAYLOADS)('a hostile stop colour never reaches either export: %s', (bad) => {
    const doc = base([{ layerId: 'p', property: 'gradientStop[0].color', keyframes: [{ t: 0, value: '#000000', easing: 'linear' }, { t: 1000, value: bad, easing: 'linear' }] }]);
    expect(() => exportAnimatedSvgCss(doc)).toThrow();
    expect(() => exportAnimatedSvgAnime(doc)).toThrow();
  });

  it.each(PAYLOADS)('hostile path data never reaches the anime script: %s', (bad) => {
    const doc = base([{ layerId: 'p', property: 'd', keyframes: [{ t: 0, value: 'M0 0L10 0', easing: 'linear' }, { t: 1000, value: bad, easing: 'linear' }] }]);
    expect(() => exportAnimatedSvgAnime(doc)).toThrow();
  });

  it('inline motion-path data with markup is dropped (canonicalised before it reaches offset-path)', () => {
    const doc = base([{ layerId: 'p', property: 'motionPath', keyframes: [{ t: 0, value: 0, easing: 'linear' }, { t: 1000, value: 1, easing: 'linear' }], extras: { d: "M0 0L1 1');}</style><script>x()</script>" } }]);
    const css = exportAnimatedSvgCss(doc);
    expect(css).not.toMatch(/<script|offset-path/);
    const anime = exportAnimatedSvgAnime(doc);
    expect(anime.match(/<script/g)).toHaveLength(1);
    expect(anime).not.toContain('x()');
  });

  it('a valid motion path is written as canonical numbers and commands only', () => {
    const doc = base([{ layerId: 'p', property: 'motionPath', keyframes: [{ t: 0, value: 0, easing: 'linear' }, { t: 1000, value: 1, easing: 'linear' }], extras: { pathId: 'guide' } }]);
    const m = /offset-path: path\('([^']*)'\)/.exec(exportAnimatedSvgCss(doc));
    expect(m?.[1]).toMatch(/^[MLCQAZ0-9 .-]+$/);
  });

  it('the anime spec JSON escapes < > & (no early </script> or ]]>)', () => {
    const doc = base([{ layerId: 'p', property: 'fill', keyframes: [{ t: 0, value: '#000000', easing: 'linear' }, { t: 1000, value: '#ffffff', easing: 'linear' }] }]);
    const out = exportAnimatedSvgAnime(doc);
    const call = out.split('\n').find((l) => l.startsWith('runPlayer(__mmAnime,'))!;
    expect(call).toBeDefined();
    expect(call).not.toMatch(/[<>&]/);
  });
});
