/**
 * MM109: a tiny bridge so Medi's Darkroom adapter can grab the preview frame, the same pattern
 * as the eyedropper (`eyedropper.ts`): the preview surface owns the WebGL compositor and
 * registers a reader of its latest composite (`GLCompositor.readAccumPixels`, which needs no
 * preserveDrawingBuffer); the adapter turns it into a ≤ 1024 px JPEG (`lib/assistant/frame.ts`).
 * Frames live in memory only: never stored, logged or sent to analytics.
 */
export type FrameReader = () => { width: number; height: number; data: Uint8ClampedArray } | null;

let reader: FrameReader | null = null;

export function registerFrameGrab(fn: FrameReader | null): void {
  reader = fn;
}

/** The latest composite as a canvas (null when no preview is mounted or WebGL is unavailable). */
export function grabPreviewCanvas(): HTMLCanvasElement | null {
  const px = reader?.();
  if (!px || !px.width || !px.height) return null;
  const c = document.createElement('canvas');
  c.width = px.width;
  c.height = px.height;
  const ctx = c.getContext('2d');
  if (!ctx) return null;
  const img = ctx.createImageData(px.width, px.height);
  img.data.set(px.data);
  ctx.putImageData(img, 0, 0);
  return c;
}
