/**
 * MM47 acceptance 2 (frame determinism) and the raster safety rules.
 *
 * Goldens: `lib/vector/raster/__golden__/frames/animated-t<ms>.svg`, the
 * frame-baked SVG of the shared `animated.json` fixture at t = 0, mid and end
 * (byte-exact). Regenerate with
 *     UPDATE_GOLDEN=1 npx vitest run lib/vector/raster/frames.test.ts
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { readFixture } from '@/lib/vector/fixtures/fixtures';
import { parseVectorDoc, type VectorDoc } from '@/lib/vector/vectorTypes';

import { RasterUnsafeError, bakeFrameSvg, createFrameRenderer, frameCount, frameTime, frameTimes, prepareRasterDoc, rasterSafetyIssues, renderFrame } from './frames';
import { fakeFrameEnv } from './testFakes.testutil';

const DIR = join(__dirname, '__golden__', 'frames');
const UPDATE = process.env.UPDATE_GOLDEN === '1';

const animated = (() => {
  const r = parseVectorDoc(readFixture('animated.json'));
  if (!r.ok) throw new Error(r.error);
  return r.doc;
})();

describe('frame count and times', () => {
  it.each([
    // fps, durationMs, frames, last frame time (ms)
    [24, 1000, 24, 958.333],
    [24, 2500, 60, 2458.333],
    [24, 100, 3, 83.333],
    [30, 1000, 30, 966.667],
    [30, 2500, 75, 2466.667],
    [30, 1010, 31, 1000],
    [60, 1000, 60, 983.333],
    [60, 2500, 150, 2483.333],
    [60, 16, 1, 0],
    [30, 0, 1, 0],
  ])('%i fps × %i ms → %i frames, last at %f ms', (fps, durationMs, frames, last) => {
    expect(frameCount(durationMs, fps)).toBe(frames);
    const times = frameTimes(durationMs, fps);
    expect(times).toHaveLength(frames);
    expect(times[0]).toBe(0);
    expect(times[frames - 1]).toBeCloseTo(last, 3);
    expect(frameTime(frames - 1, fps)).toBeCloseTo(last, 3);
  });

  it('times are i/fps from the range start, never the wall clock', () => {
    expect(frameTimes(100, 30, 500)).toEqual([500, 500 + 1000 / 30, 500 + 2000 / 30]);
  });

  it('rejects a non-positive fps', () => {
    expect(() => frameCount(1000, 0)).toThrow();
  });
});

describe('frame-baked SVG goldens (animated.json at t=0, mid, end)', () => {
  const size = { width: animated.canvas.width, height: animated.canvas.height };
  it.each([0, animated.duration / 2, animated.duration])('animated-t%i.svg is byte-identical across runs', (t) => {
    const a = bakeFrameSvg(animated, t, size);
    const b = bakeFrameSvg(structuredClone(animated), t, size);
    expect(b).toBe(a);
    const file = join(DIR, `animated-t${String(t).padStart(4, '0')}.svg`);
    if (UPDATE || !existsSync(file)) writeFileSync(file, a);
    expect(a).toBe(readFileSync(file, 'utf8'));
    expect(a).not.toMatch(/@keyframes|<style|<script|animation/);
  });

  it('the three goldens differ (the animation moves)', () => {
    const [a, b, c] = [0, 1250, 2500].map((t) => bakeFrameSvg(animated, t, size));
    expect(new Set([a, b, c]).size).toBe(3);
  });

  it('the output size goes on the root; the viewBox is kept', () => {
    const svg = bakeFrameSvg(animated, 0, { width: 800, height: 600 });
    expect(svg).toMatch(/<svg[^>]* width="800" height="600" viewBox="0 0 400 300"/);
  });
});

describe('frame renderer (fake canvas)', () => {
  it('reuses one canvas, draws the background underlay and revokes every Blob URL', async () => {
    const env = fakeFrameEnv();
    const r = createFrameRenderer(animated, { width: 40, height: 30 }, { underlay: '#ffffff', env });
    for (const t of frameTimes(100, 30)) await r.render(t);
    expect(env.log.canvas!.log.draws).toBe(3);
    expect(env.log.canvas!.log.fills).toEqual(['#ffffff', '#ffffff', '#ffffff']);
    expect(env.log.created).toHaveLength(3);
    expect(env.log.revoked).toEqual(env.log.created);
    expect(env.log.blobs.every((b) => b.type === 'image/svg+xml')).toBe(true);
  });

  it('keeps transparency when there is no underlay', async () => {
    const env = fakeFrameEnv();
    const out = await renderFrame(animated, 0, { width: 4, height: 3 }, env);
    expect(env.log.canvas!.log.fills).toEqual([]);
    expect(out.data).toHaveLength(4 * 3 * 4);
  });

  it('revokes the Blob URL even when the image fails to decode', async () => {
    const env = fakeFrameEnv();
    env.loadImage = async () => {
      throw new Error('decode failed');
    };
    const r = createFrameRenderer(animated, { width: 4, height: 3 }, { underlay: null, env });
    await expect(r.render(0)).rejects.toThrow('decode failed');
    expect(env.log.revoked).toEqual(env.log.created);
  });

  it('the blob handed to <img> is exactly the baked, sanitised serialisation', async () => {
    const env = fakeFrameEnv();
    const r = createFrameRenderer(animated, { width: 400, height: 300 }, { underlay: null, env });
    await r.render(1250);
    expect(await env.log.blobs[0].text()).toBe(bakeFrameSvg(animated, 1250, { width: 400, height: 300 }));
  });
});

describe('taint and exfiltration: a document with an external href never reaches an <img>', () => {
  const hostile = (patch: (d: Record<string, unknown>) => void): VectorDoc => {
    const d = structuredClone(animated) as unknown as Record<string, unknown>;
    patch(d);
    return d as unknown as VectorDoc;
  };
  const cases: Array<[string, VectorDoc]> = [
    ['an image layer with an https href', hostile((d) => (d.layers as unknown[]).push({ type: 'image', id: 'x', x: 0, y: 0, width: 10, height: 10, href: 'https://evil.example/p.png' }))],
    ['an image layer with a protocol-relative href', hostile((d) => (d.layers as unknown[]).push({ type: 'image', id: 'x', x: 0, y: 0, width: 10, height: 10, href: '//evil.example/p.png' }))],
    ['an SVG data URI image (nested document)', hostile((d) => (d.layers as unknown[]).push({ type: 'image', id: 'x', x: 0, y: 0, width: 10, height: 10, href: 'data:image/svg+xml;base64,PHN2Zy8+' }))],
    ['a raw layer with an external <image href>', hostile((d) => (d.layers as unknown[]).push({ type: 'raw', id: 'x', markup: '<image href="https://evil.example/p.png" width="1" height="1"/>' }))],
    ['a raw layer with an external url() fill', hostile((d) => (d.layers as unknown[]).push({ type: 'raw', id: 'x', markup: '<rect width="1" height="1" fill="url(https://evil.example/#a)"/>' }))],
    ['a raw layer with a <foreignObject>', hostile((d) => (d.layers as unknown[]).push({ type: 'raw', id: 'x', markup: '<foreignObject><img xmlns="http://www.w3.org/1999/xhtml" src="https://evil.example/"/></foreignObject>' }))],
    ['a background with an external url()', hostile((d) => ((d.canvas as Record<string, unknown>).background = 'url(https://evil.example/x)'))],
    ['a fill paint with an external url()', hostile((d) => ((d.layers as Array<Record<string, unknown>>)[0].fill = 'url(https://evil.example/#g)'))],
  ];

  it.each(cases)('%s is refused before any Blob URL or image load', async (_name, doc) => {
    const env = fakeFrameEnv();
    expect(() => createFrameRenderer(doc, { width: 4, height: 3 }, { underlay: null, env })).toThrow(RasterUnsafeError);
    await expect(renderFrame(doc, 0, { width: 4, height: 3 }, env)).rejects.toThrow(RasterUnsafeError);
    expect(env.log.created).toEqual([]);
    expect(env.log.loaded).toEqual([]);
  });

  it('a base64 PNG data URI image is allowed (it cannot taint the canvas)', () => {
    const d = hostile((x) =>
      (x.layers as unknown[]).push({ type: 'image', id: 'x', x: 0, y: 0, width: 1, height: 1, href: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==' }),
    );
    expect(() => prepareRasterDoc(d)).not.toThrow();
  });

  it('rasterSafetyIssues flags every external form on raw text', () => {
    expect(rasterSafetyIssues('<svg><use href="#a"/><rect fill="url(#g)"/></svg>')).toEqual([]);
    expect(rasterSafetyIssues('<svg><image href="https://e.example/a.png"/></svg>')).toContain('external reference');
    expect(rasterSafetyIssues('<svg><image xlink:href=" //e.example/a.png"/></svg>')).toContain('external reference');
    expect(rasterSafetyIssues('<svg><rect fill="url( \'https://e.example\')"/></svg>')).toContain('external url()');
    expect(rasterSafetyIssues('<svg><style>@import "x";</style></svg>')).toContain('@import');
    expect(rasterSafetyIssues('<svg><script>1</script></svg>')).toContain('script');
    expect(rasterSafetyIssues('<!DOCTYPE svg><svg/>')).toContain('declaration');
  });
});
