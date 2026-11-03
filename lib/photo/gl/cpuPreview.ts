/**
 * CPU preview path for browsers without WebGL2 (ticket MM97 decision 5): the
 * reference `renderDocCPU` over a ≤ 1 MP downscale. The editor shows a visible
 * "Reduced preview" chip while this is active.
 */
import { fromBytes, renderDocCPU, toBytes, type MaskAssets } from '@/lib/photo/colorMath';
import type { PhotoDoc } from '@/lib/photo/photoTypes';

export const CPU_PREVIEW_MAX_PIXELS = 1_000_000;

export function cpuPreviewSize(width: number, height: number, maxPixels = CPU_PREVIEW_MAX_PIXELS): { width: number; height: number } {
  const px = width * height;
  if (px <= maxPixels) return { width, height };
  const s = Math.sqrt(maxPixels / px);
  return { width: Math.max(1, Math.floor(width * s)), height: Math.max(1, Math.floor(height * s)) };
}

/** RGBA8 bytes of the document applied to RGBA8 pixels (same bytes as the goldens at identity size). */
export function renderCpuPreview(
  doc: Pick<PhotoDoc, 'layers'> & Partial<Pick<PhotoDoc, 'geometry' | 'masks'>>,
  width: number,
  height: number,
  rgba: ArrayLike<number>,
  assets?: MaskAssets,
): Uint8ClampedArray {
  return renderCpuPreviewSized(doc, width, height, rgba, assets).data;
}

/** Same, with the output size (geometry may change it). */
export function renderCpuPreviewSized(
  doc: Pick<PhotoDoc, 'layers'> & Partial<Pick<PhotoDoc, 'geometry' | 'masks'>>,
  width: number,
  height: number,
  rgba: ArrayLike<number>,
  assets?: MaskAssets,
): { width: number; height: number; data: Uint8ClampedArray } {
  const out = renderDocCPU(doc, fromBytes(width, height, rgba), assets);
  return { width: out.width, height: out.height, data: toBytes(out) };
}
