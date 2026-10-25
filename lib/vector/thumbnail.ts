/**
 * Project thumbnail (ticket MM44 decision 10, MM43 decision 7): a 320 px
 * (longest side) PNG of the frame at the playhead, rendered in the browser
 * from the static SVG (`serializeSvg(sampleDoc(doc, t))` → `<img>` → canvas),
 * then `POST /vector/projects/:id/thumbnail` (presign pinned to the exact byte
 * length and image/png) → PUT to S3 → the key rides along with the next save.
 *
 * Best-effort: any failure (no canvas, a tainted canvas, an image the browser
 * refuses, > 512 KB) returns null and the project simply keeps its old
 * thumbnail. The SVG is the editor's own serialisation of the model (no
 * script, no external references), loaded from a blob URL.
 */
import { serializeSvg } from '@/lib/vector/exportSvg';
import {
  VECTOR_THUMBNAIL_MAX_BYTES,
  presignVectorThumbnail,
  uploadVectorThumbnail,
  type FetchLike,
} from '@/lib/vector/projectsApi';
import { sampleDoc } from '@/lib/vector/sampleTrack';
import type { VectorDoc } from '@/lib/vector/vectorTypes';

export const THUMBNAIL_SIZE = 320;

/** Output size: longest side 320 px, aspect kept, at least 1 px. */
export function thumbnailSize(width: number, height: number): { width: number; height: number } {
  const w = Math.max(1, width);
  const h = Math.max(1, height);
  const k = THUMBNAIL_SIZE / Math.max(w, h);
  return { width: Math.max(1, Math.round(w * k)), height: Math.max(1, Math.round(h * k)) };
}

/** Render the frame at `t` to a PNG blob. Null when the browser cannot. */
export async function renderThumbnailPng(doc: VectorDoc, t: number): Promise<Blob | null> {
  if (typeof document === 'undefined' || typeof Image === 'undefined' || typeof URL.createObjectURL !== 'function') return null;
  const svg = serializeSvg(sampleDoc(doc, t));
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.decoding = 'async';
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('thumbnail image failed to load'));
      img.src = url;
    });
    const size = thumbnailSize(doc.canvas.width, doc.canvas.height);
    const canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, size.width, size.height);
    return await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Presign + upload. Returns the server-built key to send with the next save,
 * or null on any failure (or when the PNG is over the cap).
 */
export async function uploadThumbnail(
  token: string,
  projectId: string,
  png: Blob,
  fetchImpl: FetchLike = fetch,
): Promise<string | null> {
  if (png.size <= 0 || png.size > VECTOR_THUMBNAIL_MAX_BYTES) return null;
  try {
    const presign = await presignVectorThumbnail(token, projectId, png.size, fetchImpl);
    if (!presign.uploadUrl || !presign.thumbnailKey) return null;
    await uploadVectorThumbnail(presign, png, fetchImpl);
    return presign.thumbnailKey;
  } catch {
    return null;
  }
}
