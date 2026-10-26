/**
 * MM47 acceptance 6 (PNG half): the zip holds N correctly named entries whose
 * first bytes are the PNG signature; store-only; cancel stops it.
 */
import { unzipSync } from 'fflate';
import { describe, expect, it, vi } from 'vitest';

import { readFixture } from '@/lib/vector/fixtures/fixtures';
import { parseVectorDoc } from '@/lib/vector/vectorTypes';

import { frameCount } from './frames';
import { exportPngSequence, pngFrameName } from './pngSequence';
import { fakeFrameEnv } from './testFakes.testutil';

const animated = (() => {
  const r = parseVectorDoc(readFixture('animated.json'));
  if (!r.ok) throw new Error(r.error);
  return r.doc;
})();

describe('PNG sequence export', () => {
  it.each([24, 30, 60])('%i fps over 500 ms: N entries frame_00001.png…, each starting \\x89PNG', async (fps) => {
    const progress = vi.fn();
    const env = fakeFrameEnv();
    const out = await exportPngSequence({ doc: animated, size: { width: 8, height: 6 }, fps, startMs: 250, endMs: 750, env, onProgress: progress });
    const n = frameCount(500, fps);
    expect(out.frames).toBe(n);
    expect(out.blob.type).toBe('application/zip');
    const files = unzipSync(new Uint8Array(await out.blob.arrayBuffer()));
    const names = Object.keys(files);
    expect(names).toEqual(Array.from({ length: n }, (_, i) => `frame_${String(i + 1).padStart(5, '0')}.png`));
    for (const name of names) expect(Array.from(files[name].subarray(0, 4))).toEqual([0x89, 0x50, 0x4e, 0x47]);
    // Frames are distinct renders, in order.
    expect(names.map((k) => files[k][8])).toEqual(Array.from({ length: n }, (_, i) => i + 1));
    expect(progress.mock.calls.filter(([p]) => p.phase === 'render').map(([p]) => p.done)).toEqual(Array.from({ length: n }, (_, i) => i + 1));
    expect(env.log.revoked).toEqual(env.log.created);
  });

  it('is store-only (compression method 0 in every local header)', async () => {
    const out = await exportPngSequence({ doc: animated, size: { width: 4, height: 4 }, fps: 10, startMs: 0, endMs: 300, env: fakeFrameEnv() });
    const b = new Uint8Array(await out.blob.arrayBuffer());
    const methods: number[] = [];
    for (let i = 0; i + 30 < b.length; i++) if (b[i] === 0x50 && b[i + 1] === 0x4b && b[i + 2] === 3 && b[i + 3] === 4) methods.push(b[i + 8] | (b[i + 9] << 8));
    expect(methods).toEqual([0, 0, 0]);
  });

  it('keeps transparency (no underlay)', async () => {
    const env = fakeFrameEnv();
    await exportPngSequence({ doc: animated, size: { width: 4, height: 4 }, fps: 10, startMs: 0, endMs: 200, env });
    expect(env.log.canvas!.log.fills).toEqual([]);
  });

  it('cancel mid-sequence rejects with AbortError and stops rendering', async () => {
    const ctl = new AbortController();
    const env = fakeFrameEnv();
    const progress = vi.fn((p: { done: number }) => {
      if (p.done === 2) ctl.abort();
    });
    await expect(exportPngSequence({ doc: animated, size: { width: 4, height: 4 }, fps: 30, startMs: 0, endMs: 1000, env, signal: ctl.signal, onProgress: progress })).rejects.toMatchObject({ name: 'AbortError' });
    expect(env.log.canvas!.log.draws).toBeLessThanOrEqual(3);
  });

  it('frame names widen past 99,999 frames', () => {
    expect(pngFrameName(0, 30)).toBe('frame_00001.png');
    expect(pngFrameName(41, 123456)).toBe('frame_000042.png');
  });
});
