/**
 * GIF export (ticket MM47 decision 2).
 *
 * Frames come from the frame renderer (`frames.ts`) one at a time; the RGBA
 * pixels are TRANSFERRED to a module Worker (`gif.worker.ts`) that builds one
 * global palette, indexes and LZW-compresses each frame with the in-house
 * encoder (`gifEncoder.ts`). At most one frame is in flight while the next
 * one renders, so memory stays at a couple of frames plus the growing file.
 *
 * Palette: once per file, from up to `PALETTE_SAMPLES` frames spread over the
 * span (decision 2, proposed: confirmed). Dither: optional (off by default;
 * flat vector art has few colours and dithering adds noise to it).
 * Delay: `round(100 / fps)` centiseconds per frame (decision 2).
 * Transparency: kept only when the canvas background is transparent and the
 * user leaves "Transparent background" on; otherwise frames are flattened onto
 * the background (white when the canvas is transparent; decision 9).
 *
 * Cancel: the AbortSignal terminates the Worker and rejects with an
 * `AbortError`; nothing is downloaded.
 */
import { DEFAULT_BACKGROUND, docLoops } from '@/lib/vector/vectorTypes';

import { createFrameRenderer, frameCount, frameTime } from './frames';
import { createGifSession, type GifReply, type GifRequest } from './gifSession';
import { RasterAbortError, checkBytes, throwIfAborted, yieldToEventLoop, type RasterJob } from './pipeline';

/** Frames sampled for the global palette. */
export const PALETTE_SAMPLES = 5;

/** How the encoder is reached: a Worker in the browser, in-process in tests and as a fallback. */
export interface GifPort {
  request(req: GifRequest, transfer?: Transferable[]): Promise<GifReply | null>;
  terminate(): void;
}

/** In-process port (tests; browsers that cannot start a module worker). */
export function inProcessGifPort(): GifPort {
  const handle = createGifSession();
  let dead = false;
  return {
    async request(req) {
      if (dead) throw new RasterAbortError();
      return handle(req);
    },
    terminate() {
      dead = true;
    },
  };
}

/** The module-worker port; falls back to in-process when workers are unavailable. */
export function workerGifPort(): GifPort {
  let worker: Worker;
  try {
    worker = new Worker(new URL('./gif.worker.ts', import.meta.url), { type: 'module', name: 'motion-gif' });
  } catch {
    return inProcessGifPort();
  }
  const waiting: Array<{ resolve: (r: GifReply) => void; reject: (e: unknown) => void }> = [];
  let failed: unknown = null;
  const failAll = (e: unknown) => {
    failed = e;
    for (const w of waiting.splice(0)) w.reject(e);
  };
  worker.onmessage = (e: MessageEvent<GifReply>) => waiting.shift()?.resolve(e.data);
  worker.onerror = (e) => failAll(new Error(e.message || 'GIF worker failed'));
  return {
    request(req, transfer = []) {
      if (failed) return Promise.reject(failed);
      worker.postMessage(req, transfer);
      if (req.type === 'sample') return Promise.resolve(null);
      return new Promise<GifReply>((resolve, reject) => waiting.push({ resolve, reject }));
    },
    terminate() {
      worker.terminate();
      failAll(new RasterAbortError());
    },
  };
}

export interface GifJob extends RasterJob {
  /** Keep transparency (only meaningful when the canvas background is transparent). */
  transparent: boolean;
  dither: boolean;
  /** Total plays: 0 = forever, 1 = once, n = n times. Default: the document's loop flag (forever / once). */
  plays?: number;
  port?: GifPort;
}

export interface RasterResult {
  blob: Blob;
  frames: number;
  bytes: number;
}

export const isTransparentBackground = (bg: string | undefined) => !bg || bg === DEFAULT_BACKGROUND || bg === 'none';

/** NETSCAPE loop field for a play count: forever → 0, once → no extension, n → n - 1 repetitions. */
export function gifLoopField(plays: number): number | null {
  if (plays <= 0) return 0;
  if (plays === 1) return null;
  return Math.min(65535, plays - 1);
}

/** GIF frame delay in centiseconds (decision 2). */
export const gifDelayCs = (fps: number) => Math.max(2, Math.round(100 / fps));

const okReply = (r: GifReply | null): Extract<GifReply, { type: 'ok' | 'done' }> => {
  if (!r) throw new Error('GIF encoder did not reply');
  if (r.type === 'error') throw new Error(r.message);
  return r;
};

export async function exportGif(job: GifJob): Promise<RasterResult> {
  const { doc, size, fps, startMs, endMs, signal } = job;
  throwIfAborted(signal);
  const transparent = job.transparent && isTransparentBackground(doc.canvas.background);
  const underlay = transparent ? null : isTransparentBackground(doc.canvas.background) ? '#ffffff' : null;
  const renderer = createFrameRenderer(doc, size, { underlay, env: job.env });
  const total = frameCount(endMs - startMs, fps);
  const port = job.port ?? workerGifPort();
  const onAbort = () => port.terminate();
  signal?.addEventListener('abort', onAbort, { once: true });
  try {
    // 1. Palette from a few frames spread over the span.
    const samples = Math.min(PALETTE_SAMPLES, total);
    for (let s = 0; s < samples; s++) {
      const i = samples === 1 ? 0 : Math.round((s * (total - 1)) / (samples - 1));
      await renderer.render(frameTime(i, fps, startMs));
      throwIfAborted(signal);
      const rgba = renderer.pixels();
      await port.request({ type: 'sample', rgba }, [rgba.buffer as ArrayBuffer]);
    }
    const plays = job.plays ?? (docLoops(doc) ? 0 : 1);
    okReply(await port.request({ type: 'start', width: size.width, height: size.height, transparent, loop: gifLoopField(plays), dither: job.dither }));

    // 2. Frames: render frame i while frame i-1 encodes.
    const delayCs = gifDelayCs(fps);
    let pending: Promise<GifReply | null> | null = null;
    let bytes = 0;
    const settle = async (done: number) => {
      if (!pending) return;
      const r = okReply(await pending);
      pending = null;
      bytes = r.bytes;
      checkBytes(bytes, job);
      job.onProgress?.({ phase: 'render', done, total, bytes });
    };
    for (let i = 0; i < total; i++) {
      await renderer.render(frameTime(i, fps, startMs));
      throwIfAborted(signal);
      const rgba = renderer.pixels();
      await settle(i);
      throwIfAborted(signal);
      pending = port.request({ type: 'frame', rgba, delayCs }, [rgba.buffer as ArrayBuffer]);
      // Awaited by the next settle(); a cancel in between must not surface as unhandled.
      pending.catch(() => {});
      await yieldToEventLoop();
    }
    await settle(total);
    throwIfAborted(signal);
    job.onProgress?.({ phase: 'finalize', done: 0, total: 1, bytes });
    const done = okReply(await port.request({ type: 'finish' }));
    if (done.type !== 'done') throw new Error('GIF encoder did not finish');
    const blob = new Blob(done.parts as BlobPart[], { type: 'image/gif' });
    job.onProgress?.({ phase: 'finalize', done: 1, total: 1, bytes: blob.size });
    return { blob, frames: done.frames, bytes: blob.size };
  } catch (e) {
    if (signal?.aborted) throw new RasterAbortError();
    throw e;
  } finally {
    signal?.removeEventListener('abort', onAbort);
    port.terminate();
  }
}
