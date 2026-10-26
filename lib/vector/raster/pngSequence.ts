/**
 * PNG sequence export (ticket MM47 decision 3): every frame → PNG through the
 * browser's own encoder (`convertToBlob` / `toBlob`), streamed into a zip with
 * `fflate` (already a dependency, 0.8.3; the same library as
 * `lib/results/archive/zip.ts`, here its streaming `Zip` writer).
 *
 *   frame_00001.png … frame_NNNNN.png   (1-based, five digits minimum)
 *
 * Store-only (`ZipPassThrough`, compression 0; decision 3 proposed `level: 0`,
 * confirmed): PNG is already deflated, so a second pass costs time for ~0 %.
 * Each PNG is pushed into the zip as soon as it is encoded and dropped, so
 * memory is one frame plus the zip parts; the parts become one Blob at the end.
 * Transparency is kept when the canvas background is transparent (decision 9).
 */
import { Zip, ZipPassThrough } from 'fflate';

import { canvasToPng, createFrameRenderer, frameCount, frameTime } from './frames';
import type { RasterResult } from './gif';
import { RasterAbortError, checkBytes, throwIfAborted, yieldToEventLoop, type RasterJob } from './pipeline';

export const pngFrameName = (i: number, total: number) => `frame_${String(i + 1).padStart(Math.max(5, String(total).length), '0')}.png`;

export async function exportPngSequence(job: RasterJob): Promise<RasterResult> {
  const { doc, size, fps, startMs, endMs, signal } = job;
  throwIfAborted(signal);
  const renderer = createFrameRenderer(doc, size, { underlay: null, env: job.env });
  const total = frameCount(endMs - startMs, fps);
  const parts: Uint8Array[] = [];
  let bytes = 0;
  let zipError: Error | null = null;
  let finished = false;
  const zip = new Zip((err, chunk, final) => {
    if (err) {
      zipError = err;
      return;
    }
    parts.push(chunk);
    bytes += chunk.length;
    if (final) finished = true;
  });
  const onAbort = () => zip.terminate();
  signal?.addEventListener('abort', onAbort, { once: true });
  try {
    for (let i = 0; i < total; i++) {
      const canvas = await renderer.render(frameTime(i, fps, startMs));
      throwIfAborted(signal);
      const png = new Uint8Array(await (await canvasToPng(canvas)).arrayBuffer());
      throwIfAborted(signal);
      const entry = new ZipPassThrough(pngFrameName(i, total));
      zip.add(entry);
      entry.push(png, true);
      if (zipError) throw zipError;
      checkBytes(bytes, job);
      job.onProgress?.({ phase: 'render', done: i + 1, total, bytes });
      await yieldToEventLoop();
    }
    zip.end();
    if (zipError) throw zipError;
    if (!finished) throw new Error('zip did not finish');
    const blob = new Blob(parts as BlobPart[], { type: 'application/zip' });
    job.onProgress?.({ phase: 'finalize', done: 1, total: 1, bytes: blob.size });
    return { blob, frames: total, bytes: blob.size };
  } catch (e) {
    if (signal?.aborted) throw new RasterAbortError();
    throw e;
  } finally {
    signal?.removeEventListener('abort', onAbort);
  }
}
