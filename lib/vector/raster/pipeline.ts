/**
 * Shared plumbing of the MM47 raster exporters: the job shape, progress,
 * cancellation and the output-size guard.
 */
import type { VectorDoc } from '@/lib/vector/vectorTypes';

import { RASTER_MAX_OUTPUT_BYTES } from './caps';
import type { FrameEnv } from './frames';

export interface RasterProgress {
  phase: 'render' | 'finalize';
  /** Frames done (render) or 0/1 (finalize). */
  done: number;
  total: number;
  /** Output bytes so far. */
  bytes: number;
}

export interface RasterJob {
  doc: VectorDoc;
  /** Output pixel size (even for video). */
  size: { width: number; height: number };
  fps: number;
  startMs: number;
  endMs: number;
  signal?: AbortSignal;
  onProgress?: (p: RasterProgress) => void;
  /** Browser seams for tests. */
  env?: FrameEnv;
  /** Output-size guard (default `RASTER_MAX_OUTPUT_BYTES`). */
  maxBytes?: number;
}

export class RasterAbortError extends Error {
  constructor() {
    super('Export cancelled');
    this.name = 'AbortError';
  }
}

export class RasterTooLargeError extends Error {
  constructor(readonly bytes: number) {
    super(`Export larger than ${RASTER_MAX_OUTPUT_BYTES} bytes`);
    this.name = 'RasterTooLargeError';
  }
}

export function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) throw new RasterAbortError();
}

export function checkBytes(bytes: number, job: Pick<RasterJob, 'maxBytes'>): void {
  if (bytes > (job.maxBytes ?? RASTER_MAX_OUTPUT_BYTES)) throw new RasterTooLargeError(bytes);
}

/** Yield to the event loop so input and paint keep flowing between frames. */
export const yieldToEventLoop = (): Promise<void> => new Promise((r) => setTimeout(r, 0));

export const isAbort = (e: unknown): boolean => e instanceof RasterAbortError || (e instanceof Error && e.name === 'AbortError');
