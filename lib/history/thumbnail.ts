/**
 * Result thumbnails for the Recent strip (MM29): 160 px longest edge, JPEG q0.7, from the
 * result blob. Image/gif/video only; everything else gets a kind icon and no thumbnail.
 * Never throws: any failure resolves to null.
 */

export const THUMB_EDGE = 160;
const THUMB_QUALITY = 0.7;
const VIDEO_TIMEOUT_MS = 3000;

/** Kinds that can have a thumbnail. */
export function thumbnailable(kind: string): boolean {
  return kind === 'image' || kind === 'gif' || kind === 'video';
}

/** Target size: longest edge to 160, never upscaled, at least 1 px. */
export function thumbSize(width: number, height: number): { width: number; height: number } {
  const scale = Math.min(1, THUMB_EDGE / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

async function drawToJpeg(source: CanvasImageSource, w: number, h: number): Promise<Blob | null> {
  const { width, height } = thumbSize(w, h);
  if (typeof OffscreenCanvas !== 'undefined') {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(source, 0, 0, width, height);
    return canvas.convertToBlob({ type: 'image/jpeg', quality: THUMB_QUALITY });
  }
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(source, 0, 0, width, height);
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/jpeg', THUMB_QUALITY));
}

function videoFrame(blob: Blob): Promise<Blob | null> {
  if (typeof document === 'undefined' || typeof URL.createObjectURL !== 'function') return Promise.resolve(null);
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const video = document.createElement('video');
    let settled = false;
    const finish = (result: Blob | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      video.removeAttribute('src');
      video.load();
      URL.revokeObjectURL(url);
      resolve(result);
    };
    const timer = setTimeout(() => finish(null), VIDEO_TIMEOUT_MS);
    video.muted = true;
    video.preload = 'auto';
    video.playsInline = true;
    video.onerror = () => finish(null);
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(0.1, (video.duration || 0) / 2);
    };
    video.onseeked = () => {
      drawToJpeg(video, video.videoWidth, video.videoHeight).then(finish, () => finish(null));
    };
    video.src = url;
  });
}

/** A JPEG thumbnail of a result blob, or null (unsupported kind, decode failure, timeout). */
export async function makeThumbnail(blob: Blob, kind: string): Promise<Blob | null> {
  try {
    if (!thumbnailable(kind)) return null;
    if (kind === 'video') return await videoFrame(blob);
    if (typeof createImageBitmap !== 'function') return null;
    const bitmap = await createImageBitmap(blob);
    try {
      return await drawToJpeg(bitmap as unknown as CanvasImageSource, bitmap.width, bitmap.height);
    } finally {
      bitmap.close?.();
    }
  } catch {
    return null;
  }
}
