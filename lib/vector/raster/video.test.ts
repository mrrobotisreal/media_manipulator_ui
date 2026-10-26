/**
 * MM47 acceptance 6 (video half): with a fake `VideoEncoder` and a mediabunny
 * stub the call sequence is configure → N encodes → flush → finalize; codec
 * fallback by `isConfigSupported`; keyframes every 2 s; backpressure on
 * `encodeQueueSize`; cancel closes the encoder and cancels the muxer.
 */
import { describe, expect, it, vi } from 'vitest';

import { readFixture } from '@/lib/vector/fixtures/fixtures';
import { parseVectorDoc } from '@/lib/vector/vectorTypes';

import { frameCount } from './frames';
import { fakeFrameEnv } from './testFakes.testutil';
import { MAX_ENCODE_QUEUE, exportVideo, mediabunnyMuxer, type EncodedChunkLike, type VideoContainer, type VideoDeps, type VideoEncoderConfigLike } from './video';

const animated = (() => {
  const r = parseVectorDoc(readFixture('animated.json'));
  if (!r.ok) throw new Error(r.error);
  return r.doc;
})();

function fakeDeps(opts: { supports?: (codec: string) => boolean; queueLag?: number; failOnEncode?: number } = {}) {
  const calls: string[] = [];
  const configs: VideoEncoderConfigLike[] = [];
  const keyFrames: boolean[] = [];
  const timestamps: number[] = [];
  let maxQueue = 0;
  const frames: Array<{ closed: boolean }> = [];
  const muxer = {
    added: [] as EncodedChunkLike[],
    add: vi.fn(async (c: EncodedChunkLike) => {
      calls.push('mux.add');
      muxer.added.push(c);
    }),
    bytes: () => muxer.added.reduce((n, c) => n + c.byteLength, 0),
    finalize: vi.fn(async () => {
      calls.push('finalize');
      return new Blob([new Uint8Array([0, 0, 0, 0x18, 0x66, 0x74, 0x79, 0x70])], { type: 'video/mp4' });
    }),
    cancel: vi.fn(async () => {
      calls.push('mux.cancel');
    }),
  };
  class FakeEncoder {
    state: 'unconfigured' | 'configured' | 'closed' = 'unconfigured';
    encodeQueueSize = 0;
    private listeners: Array<() => void> = [];
    constructor(private readonly init: { output: (c: EncodedChunkLike, m?: unknown) => void; error: (e: unknown) => void }) {}
    static isConfigSupported = vi.fn(async (c: VideoEncoderConfigLike) => ({ supported: (opts.supports ?? (() => true))(c.codec) }));
    configure(c: VideoEncoderConfigLike) {
      calls.push('configure');
      configs.push(c);
      this.state = 'configured';
    }
    encode(_frame: unknown, o?: { keyFrame?: boolean }) {
      if (this.state !== 'configured') throw new Error('InvalidStateError');
      calls.push('encode');
      if (opts.failOnEncode !== undefined && keyFrames.length === opts.failOnEncode) throw new Error('encode failed');
      keyFrames.push(o?.keyFrame === true);
      const ts = timestamps.length;
      this.encodeQueueSize += 1;
      maxQueue = Math.max(maxQueue, this.encodeQueueSize);
      // Drain asynchronously; queueLag keeps frames queued for a while (backpressure).
      setTimeout(() => {
        this.encodeQueueSize -= 1;
        this.init.output({ type: o?.keyFrame ? 'key' : 'delta', timestamp: timestamps[ts], duration: null, byteLength: 10, copyTo() {} }, ts === 0 ? { decoderConfig: { codec: 'x' } } : undefined);
        for (const l of this.listeners.splice(0)) l();
      }, opts.queueLag ?? 0);
    }
    addEventListener(_t: 'dequeue', l: () => void) {
      this.listeners.push(l);
    }
    async flush() {
      calls.push('flush');
      while (this.encodeQueueSize > 0) await new Promise((r) => setTimeout(r, 1));
    }
    close() {
      calls.push('close');
      this.state = 'closed';
    }
  }
  class FakeFrame {
    closed = false;
    constructor(_src: unknown, init: { timestamp: number }) {
      timestamps.push(init.timestamp);
      frames.push(this);
    }
    close() {
      this.closed = true;
    }
  }
  const createMuxer = vi.fn(async () => muxer);
  const deps: VideoDeps = { VideoEncoder: FakeEncoder, VideoFrame: FakeFrame, createMuxer };
  return { deps, calls, configs, keyFrames, timestamps, frames, muxer, createMuxer, encoderCtor: FakeEncoder, maxQueue: () => maxQueue };
}

const job = (container: VideoContainer, deps: VideoDeps, extra: Record<string, unknown> = {}) => ({
  doc: animated,
  size: { width: 64, height: 48 },
  fps: 30,
  startMs: 0,
  endMs: 1000,
  container,
  deps,
  env: fakeFrameEnv(),
  ...extra,
});

describe('MP4 / WebM export (fake VideoEncoder + mediabunny stub)', () => {
  it('call sequence: configure, N encodes, flush, finalize; every VideoFrame closed', async () => {
    const f = fakeDeps();
    const out = await exportVideo(job('mp4', f.deps));
    const n = frameCount(1000, 30);
    const seq = f.calls.filter((c) => c !== 'mux.add');
    expect(seq).toEqual(['configure', ...Array(n).fill('encode'), 'flush', 'finalize', 'close']);
    expect(f.muxer.added).toHaveLength(n);
    expect(f.frames.every((fr) => fr.closed)).toBe(true);
    expect(out).toMatchObject({ frames: n, codec: 'h264' });
    expect(f.timestamps).toEqual(Array.from({ length: n }, (_, i) => Math.round((i * 1e6) / 30)));
  });

  it('MP4 uses H.264 High at the right level; WebM uses VP9', async () => {
    const a = fakeDeps();
    await exportVideo(job('mp4', a.deps));
    expect(a.configs[0]).toMatchObject({ codec: 'avc1.64001e', width: 64, height: 48, framerate: 30, avc: { format: 'avc' } });
    expect(a.createMuxer).toHaveBeenCalledWith({ container: 'mp4', codec: 'h264', fps: 30, width: 64, height: 48 });
    const b = fakeDeps();
    const out = await exportVideo(job('webm', b.deps));
    expect(out.codec).toBe('vp9');
    expect(b.configs[0].codec).toMatch(/^vp09\.00\./);
  });

  it('codec fallback: no H.264 → MP4 in AV1; no VP9 → WebM in AV1; nothing → VideoUnsupportedError before any muxer', async () => {
    const noAvc = fakeDeps({ supports: (c) => !c.startsWith('avc1') });
    expect((await exportVideo(job('mp4', noAvc.deps))).codec).toBe('av1');
    const noVp9 = fakeDeps({ supports: (c) => !c.startsWith('vp09') });
    expect((await exportVideo(job('webm', noVp9.deps))).codec).toBe('av1');
    const none = fakeDeps({ supports: () => false });
    await expect(exportVideo(job('mp4', none.deps))).rejects.toMatchObject({ name: 'VideoUnsupportedError' });
    expect(none.createMuxer).not.toHaveBeenCalled();
    expect(none.calls).toEqual([]);
  });

  it('a keyframe every 2 s', async () => {
    const f = fakeDeps();
    await exportVideo(job('webm', f.deps, { fps: 12, endMs: 5000 }));
    const keys = f.keyFrames.flatMap((k, i) => (k ? [i] : []));
    expect(keys).toEqual([0, 24, 48]);
  });

  it('backpressure: never more than MAX_ENCODE_QUEUE (+1) frames inside the encoder', async () => {
    const f = fakeDeps({ queueLag: 3 });
    await exportVideo(job('mp4', f.deps, { endMs: 600 }));
    expect(f.maxQueue()).toBeLessThanOrEqual(MAX_ENCODE_QUEUE + 1);
  });

  it('odd dimensions are refused', async () => {
    await expect(exportVideo(job('mp4', fakeDeps().deps, { size: { width: 63, height: 48 } }))).rejects.toThrow(/even/);
  });

  it('a transparent canvas is flattened onto white; an opaque one is drawn by the SVG', async () => {
    const envT = fakeFrameEnv();
    await exportVideo(job('mp4', fakeDeps().deps, { doc: { ...animated, canvas: { ...animated.canvas, background: 'transparent' } }, env: envT, endMs: 100 }));
    expect(new Set(envT.log.canvas!.log.fills)).toEqual(new Set(['#ffffff']));
    const envO = fakeFrameEnv();
    await exportVideo(job('mp4', fakeDeps().deps, { env: envO, endMs: 100 }));
    expect(envO.log.canvas!.log.fills).toEqual([]);
  });

  it('cancel: aborts the encoder (close) and the muxer (cancel); no finalize', async () => {
    const f = fakeDeps();
    const ctl = new AbortController();
    const p = exportVideo(job('mp4', f.deps, { signal: ctl.signal, onProgress: (x: { done: number }) => x.done === 3 && ctl.abort() }));
    await expect(p).rejects.toMatchObject({ name: 'AbortError' });
    expect(f.calls).toContain('close');
    expect(f.calls).toContain('mux.cancel');
    expect(f.calls).not.toContain('finalize');
    expect(f.calls.filter((c) => c === 'encode').length).toBeLessThan(frameCount(1000, 30));
  });

  it('an encoder error stops the export and cancels the muxer', async () => {
    const f = fakeDeps({ failOnEncode: 2 });
    await expect(exportVideo(job('mp4', f.deps))).rejects.toThrow('encode failed');
    expect(f.calls).toContain('mux.cancel');
    expect(f.calls).not.toContain('finalize');
  });

  it('the output-size guard aborts', async () => {
    await expect(exportVideo(job('mp4', fakeDeps().deps, { maxBytes: 25 }))).rejects.toMatchObject({ name: 'RasterTooLargeError' });
  });

  it('without WebCodecs (no injected deps, none in jsdom) → VideoUnsupportedError', async () => {
    await expect(exportVideo({ ...job('webm', fakeDeps().deps), deps: undefined })).rejects.toMatchObject({ name: 'VideoUnsupportedError' });
  });
});

describe('mediabunny muxer (real library, fake chunks)', () => {
  it('muxes a VP9 track into a WebM file (EBML magic) and an AV1 track into MP4 (ftyp)', async () => {
    const chunk = (key: boolean, ts: number): EncodedChunkLike => ({ type: key ? 'key' : 'delta', timestamp: ts, duration: 33333, byteLength: 4, copyTo: (d: Uint8Array) => d.set([1, 2, 3, 4]) });
    const webm = await mediabunnyMuxer({ container: 'webm', codec: 'vp9', fps: 30, width: 64, height: 48 });
    await webm.add(chunk(true, 0), { decoderConfig: { codec: 'vp09.00.10.08', codedWidth: 64, codedHeight: 48 } });
    await webm.add(chunk(false, 33333));
    const w = new Uint8Array(await (await webm.finalize()).arrayBuffer());
    expect(Array.from(w.subarray(0, 4))).toEqual([0x1a, 0x45, 0xdf, 0xa3]);
    const mp4 = await mediabunnyMuxer({ container: 'mp4', codec: 'av1', fps: 30, width: 64, height: 48 });
    await mp4.add(chunk(true, 0), { decoderConfig: { codec: 'av01.0.00M.08', codedWidth: 64, codedHeight: 48, description: new Uint8Array([0x81, 0, 0, 0]) } });
    const m = new Uint8Array(await (await mp4.finalize()).arrayBuffer());
    expect(String.fromCharCode(...m.subarray(4, 8))).toBe('ftyp');
  });
});
