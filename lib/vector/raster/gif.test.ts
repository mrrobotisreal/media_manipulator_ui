/**
 * MM47 acceptance 6 (GIF half): the export starts with `GIF89a`, has one
 * image per frame with delay `round(100/fps)` cs, and loops as asked; cancel
 * terminates the encoder. Fake canvas + in-process encoder port.
 */
import { describe, expect, it, vi } from 'vitest';

import { readFixture } from '@/lib/vector/fixtures/fixtures';
import { parseVectorDoc, type VectorDoc } from '@/lib/vector/vectorTypes';

import { exportGif, gifDelayCs, gifLoopField, inProcessGifPort, PALETTE_SAMPLES, type GifPort } from './gif';
import { frameCount } from './frames';
import { walkGif } from './gifWalk.testutil';
import { fakeFrameEnv } from './testFakes.testutil';

const animated = (() => {
  const r = parseVectorDoc(readFixture('animated.json'));
  if (!r.ok) throw new Error(r.error);
  return r.doc;
})();
const transparentDoc: VectorDoc = { ...animated, canvas: { ...animated.canvas, background: 'transparent' } };

const bytesOf = async (b: Blob) => new Uint8Array(await b.arrayBuffer());

describe('GIF export', () => {
  it.each([12, 24, 30])('%i fps: GIF89a, frame count and delay match', async (fps) => {
    const progress = vi.fn();
    const out = await exportGif({ doc: animated, size: { width: 16, height: 12 }, fps, startMs: 0, endMs: 1000, transparent: false, dither: false, env: fakeFrameEnv(), port: inProcessGifPort(), onProgress: progress });
    const bytes = await bytesOf(out.blob);
    expect(String.fromCharCode(...bytes.subarray(0, 6))).toBe('GIF89a');
    expect(out.blob.type).toBe('image/gif');
    const gif = walkGif(bytes);
    expect(gif).toMatchObject({ width: 16, height: 12, trailer: true });
    expect(gif.frames).toHaveLength(frameCount(1000, fps));
    expect(out.frames).toBe(frameCount(1000, fps));
    expect(new Set(gif.frames.map((f) => f.delayCs))).toEqual(new Set([Math.round(100 / fps)]));
    expect(gif.frames.every((f) => !f.transparent && f.disposal === 1)).toBe(true);
    const renders = progress.mock.calls.filter(([p]) => p.phase === 'render');
    expect(renders.at(-1)![0]).toMatchObject({ done: frameCount(1000, fps), total: frameCount(1000, fps) });
  });

  it('loops forever by default (doc loop absent); plays once when the document does not loop', async () => {
    const env = fakeFrameEnv;
    const forever = walkGif(await bytesOf((await exportGif({ doc: animated, size: { width: 4, height: 4 }, fps: 10, startMs: 0, endMs: 300, transparent: false, dither: false, env: env(), port: inProcessGifPort() })).blob));
    expect(forever.loop).toBe(0);
    const once = walkGif(await bytesOf((await exportGif({ doc: { ...animated, loop: false }, size: { width: 4, height: 4 }, fps: 10, startMs: 0, endMs: 300, transparent: false, dither: false, env: env(), port: inProcessGifPort() })).blob));
    expect(once.loop).toBeNull();
    const thrice = walkGif(await bytesOf((await exportGif({ doc: animated, plays: 3, size: { width: 4, height: 4 }, fps: 10, startMs: 0, endMs: 300, transparent: false, dither: false, env: env(), port: inProcessGifPort() })).blob));
    expect(thrice.loop).toBe(2);
  });

  it('transparency on a transparent canvas: no underlay, transparent GCE flag; off flattens onto white', async () => {
    const envT = fakeFrameEnv();
    const t = walkGif(await bytesOf((await exportGif({ doc: transparentDoc, size: { width: 4, height: 4 }, fps: 10, startMs: 0, endMs: 200, transparent: true, dither: false, env: envT, port: inProcessGifPort() })).blob));
    expect(t.frames.every((f) => f.transparent && f.disposal === 2 && f.transparentIndex === 0)).toBe(true);
    expect(envT.log.canvas!.log.fills).toEqual([]);
    const envW = fakeFrameEnv();
    await exportGif({ doc: transparentDoc, size: { width: 4, height: 4 }, fps: 10, startMs: 0, endMs: 200, transparent: false, dither: false, env: envW, port: inProcessGifPort() });
    expect(new Set(envW.log.canvas!.log.fills)).toEqual(new Set(['#ffffff']));
  });

  it('an opaque background is drawn by the SVG itself and never marked transparent', async () => {
    const env = fakeFrameEnv();
    const g = walkGif(await bytesOf((await exportGif({ doc: animated, size: { width: 4, height: 4 }, fps: 10, startMs: 0, endMs: 200, transparent: true, dither: false, env, port: inProcessGifPort() })).blob));
    expect(g.frames.every((f) => !f.transparent)).toBe(true);
    expect(env.log.canvas!.log.fills).toEqual([]);
  });

  it('samples the palette from a few frames, then renders every frame once', async () => {
    const env = fakeFrameEnv();
    await exportGif({ doc: animated, size: { width: 4, height: 4 }, fps: 30, startMs: 0, endMs: 1000, transparent: false, dither: true, env, port: inProcessGifPort() });
    expect(env.log.canvas!.log.draws).toBe(PALETTE_SAMPLES + 30);
    expect(env.log.revoked).toEqual(env.log.created);
  });

  it('cancel: aborting mid-export terminates the encoder and rejects with AbortError', async () => {
    const ctl = new AbortController();
    const inner = inProcessGifPort();
    const terminate = vi.fn(() => inner.terminate());
    let frames = 0;
    const port: GifPort = {
      async request(req, transfer) {
        if (req.type === 'frame' && ++frames === 3) ctl.abort();
        return inner.request(req, transfer);
      },
      terminate,
    };
    await expect(exportGif({ doc: animated, size: { width: 4, height: 4 }, fps: 30, startMs: 0, endMs: 1000, transparent: false, dither: false, env: fakeFrameEnv(), port, signal: ctl.signal })).rejects.toMatchObject({ name: 'AbortError' });
    expect(terminate).toHaveBeenCalled();
    expect(frames).toBeLessThan(5);
  });

  it('an already-aborted signal never renders a frame', async () => {
    const ctl = new AbortController();
    ctl.abort();
    const env = fakeFrameEnv();
    await expect(exportGif({ doc: animated, size: { width: 4, height: 4 }, fps: 30, startMs: 0, endMs: 1000, transparent: false, dither: false, env, port: inProcessGifPort(), signal: ctl.signal })).rejects.toMatchObject({ name: 'AbortError' });
    expect(env.log.created).toEqual([]);
  });

  it('the output-size guard aborts mid-export', async () => {
    await expect(exportGif({ doc: animated, size: { width: 8, height: 8 }, fps: 30, startMs: 0, endMs: 1000, transparent: false, dither: false, env: fakeFrameEnv(), port: inProcessGifPort(), maxBytes: 200 })).rejects.toMatchObject({ name: 'RasterTooLargeError' });
  });

  it('delay and loop fields', () => {
    expect([12, 15, 24, 25, 30, 50].map(gifDelayCs)).toEqual([8, 7, 4, 4, 3, 2]);
    expect([0, 1, 2, 5].map(gifLoopField)).toEqual([0, null, 1, 4]);
  });
});
