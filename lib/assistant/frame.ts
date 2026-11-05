/**
 * MM108: preview frames for Medi (design MEDI_ASSISTANT.md §9.2, D5).
 *
 * The editor's current preview, downscaled to ≤ 1024 px on the long side and encoded as JPEG
 * (q 0.8, stepping down until it fits the API's limit, default 300 KB). Request-only: the
 * result is base64 in memory for one POST; nothing here writes to IndexedDB, storage, logs or
 * analytics.
 */
export const FRAME_MAX_SIDE = 1024;
export const FRAME_MAX_BYTES = 307_200;
const QUALITIES = [0.8, 0.7, 0.6, 0.5, 0.4];

/** Size of the downscaled frame for a `w`×`h` source. */
export function frameSize(w: number, h: number, maxSide = FRAME_MAX_SIDE): { width: number; height: number } {
  const k = Math.min(1, maxSide / Math.max(w, h, 1));
  return { width: Math.max(1, Math.round(w * k)), height: Math.max(1, Math.round(h * k)) };
}

export interface FrameEncoder {
  /** Draw `src` scaled into a `width`×`height` canvas and return its JPEG bytes at `quality`. */
  encode(src: CanvasImageSource, width: number, height: number, quality: number): Promise<Blob | null>;
}

export const canvasFrameEncoder: FrameEncoder = {
  async encode(src, width, height, quality) {
    const c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    const ctx = c.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(src, 0, 0, width, height);
    return new Promise((resolve) => c.toBlob((b) => resolve(b), 'image/jpeg', quality));
  },
};

/** A ≤ 1024 px JPEG of `src` within `maxBytes`, or null when it cannot be made. */
export async function captureJpeg(
  src: CanvasImageSource & { width: number; height: number },
  maxBytes = FRAME_MAX_BYTES,
  encoder: FrameEncoder = canvasFrameEncoder,
): Promise<Blob | null> {
  if (!src.width || !src.height) return null;
  let size = frameSize(src.width, src.height);
  for (let attempt = 0; attempt < 2; attempt += 1) {
    for (const q of QUALITIES) {
      const blob = await encoder.encode(src, size.width, size.height, q);
      if (blob && blob.size <= maxBytes) return blob;
    }
    size = frameSize(size.width, size.height, Math.round(Math.max(size.width, size.height) * 0.7));
  }
  return null;
}

/** Base64 of a JPEG blob (no data: prefix), as the API's `frame.jpegBase64` expects. */
export async function blobToBase64(blob: Blob): Promise<string> {
  const buf = new Uint8Array(await blob.arrayBuffer());
  let s = '';
  for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(s);
}
