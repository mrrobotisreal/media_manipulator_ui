/**
 * MM110: Motion's verify frame for Medi (ticket decision 4). The document rasterised at the
 * playhead through the MM47 raster path (`createFrameRenderer`: full schema re-validation and
 * the raster safety check before any SVG reaches an `<img>`), at ≤ 1024 px on the long side,
 * over the canvas background (or a dark grey for a transparent canvas, so light artwork stays
 * visible), then JPEG-encoded by `captureJpeg` within the API's byte limit. Memory only.
 */
import { captureJpeg, frameSize, FRAME_MAX_BYTES, FRAME_MAX_SIDE, type FrameEncoder } from '@/lib/assistant/frame';
import { createFrameRenderer, type FrameEnv } from '@/lib/vector/raster/frames';
import type { VectorDoc } from '@/lib/vector/vectorTypes';

const TRANSPARENT_UNDERLAY = '#1f2023';

export function vectorFrameUnderlay(doc: VectorDoc): string {
  const bg = doc.canvas.background.trim().toLowerCase();
  return bg === 'transparent' || bg === 'none' || bg === '' ? TRANSPARENT_UNDERLAY : doc.canvas.background;
}

export async function captureVectorFrame(doc: VectorDoc, timeMs: number, maxBytes = FRAME_MAX_BYTES, env?: FrameEnv, encoder?: FrameEncoder): Promise<Blob | null> {
  const size = frameSize(doc.canvas.width, doc.canvas.height, FRAME_MAX_SIDE);
  try {
    const r = createFrameRenderer(doc, size, { underlay: vectorFrameUnderlay(doc), env });
    const canvas = await r.render(timeMs);
    return await captureJpeg(canvas as unknown as CanvasImageSource & { width: number; height: number }, maxBytes, encoder);
  } catch {
    return null;
  }
}
