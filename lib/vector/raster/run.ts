/**
 * The raster exporters behind one interface for the export dialog. The dialog
 * loads THIS module with a dynamic `import()` only when a raster export
 * starts, so the GIF encoder, the zip writer and (one more dynamic import
 * down) mediabunny stay out of every page's first load and out of the editor
 * until they are used.
 */
import type { VectorDoc } from '@/lib/vector/vectorTypes';

import type { RasterFormat } from './caps';
import { RasterUnsafeError, prepareRasterDoc, type FrameEnv } from './frames';
import { exportGif, type GifPort, type RasterResult } from './gif';
import type { RasterProgress } from './pipeline';
import { exportPngSequence } from './pngSequence';
import { chooseVideoCodec, browserVideoDeps, exportVideo, type VideoDeps } from './video';

export interface RasterRunJob {
  doc: VectorDoc;
  format: RasterFormat;
  size: { width: number; height: number };
  fps: number;
  startMs: number;
  endMs: number;
  /** GIF only. */
  gif?: { transparent: boolean; dither: boolean; plays: number };
  signal?: AbortSignal;
  onProgress?: (p: RasterProgress) => void;
}

export interface RasterRuntime {
  /** Problems that would stop the frame renderer (unsafe document); [] = fine. Checked BEFORE counting. */
  check(doc: VectorDoc): string[];
  /** Video only: can this browser encode this exact size and rate? Checked BEFORE the export is counted. */
  canEncode(format: RasterFormat, size: { width: number; height: number }, fps: number): Promise<boolean>;
  run(job: RasterRunJob): Promise<RasterResult>;
}

export interface RasterRuntimeDeps {
  env?: FrameEnv;
  gifPort?: () => GifPort;
  video?: VideoDeps | null;
}

export function createRasterRuntime(deps: RasterRuntimeDeps = {}): RasterRuntime {
  const video = () => (deps.video === undefined ? browserVideoDeps() : deps.video);
  return {
    check(doc) {
      try {
        prepareRasterDoc(doc);
        return [];
      } catch (e) {
        return e instanceof RasterUnsafeError ? e.issues : [String(e)];
      }
    },
    async canEncode(format, size, fps) {
      if (format !== 'mp4' && format !== 'webm') return true;
      const v = video();
      return !!v && (await chooseVideoCodec(v, format, size.width, size.height, fps)) !== null;
    },
    run(job) {
      const base = { doc: job.doc, size: job.size, fps: job.fps, startMs: job.startMs, endMs: job.endMs, signal: job.signal, onProgress: job.onProgress, env: deps.env };
      switch (job.format) {
        case 'gif':
          return exportGif({ ...base, transparent: job.gif?.transparent ?? false, dither: job.gif?.dither ?? false, plays: job.gif?.plays, port: deps.gifPort?.() });
        case 'png_sequence':
          return exportPngSequence(base);
        case 'mp4':
        case 'webm':
          return exportVideo({ ...base, container: job.format, deps: video() ?? undefined });
      }
    },
  };
}
