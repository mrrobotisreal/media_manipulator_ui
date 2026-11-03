/**
 * Preset thumbnails (decision 3): a 96 px render of the CURRENT image with the
 * preset's layers applied through the reference renderer, cached per
 * (preset, source) so a panel re-open costs nothing. Pure and GPU-free, so the
 * thumbnails are deterministic and testable; the live canvas still uses the
 * WebGL renderer.
 */
import { fromBytes, renderDocCPU, toBytes, type FloatImage } from '@/lib/photo/colorMath';
import type { AdjustmentLayer } from '@/lib/photo/photoTypes';

export const PRESET_THUMB_PX = 96;

export function downscaleBytes(rgba: ArrayLike<number>, w: number, h: number, maxSide = PRESET_THUMB_PX): FloatImage {
  const k = Math.min(1, maxSide / Math.max(w, h));
  const tw = Math.max(1, Math.round(w * k));
  const th = Math.max(1, Math.round(h * k));
  const out = new Uint8ClampedArray(tw * th * 4);
  for (let y = 0; y < th; y += 1) {
    const sy = Math.min(h - 1, Math.floor(((y + 0.5) / th) * h));
    for (let x = 0; x < tw; x += 1) {
      const sx = Math.min(w - 1, Math.floor(((x + 0.5) / tw) * w));
      for (let c = 0; c < 4; c += 1) out[(y * tw + x) * 4 + c] = rgba[(sy * w + sx) * 4 + c];
    }
  }
  return fromBytes(tw, th, out);
}

export function renderPresetThumb(thumb: FloatImage, layers: AdjustmentLayer[]): { width: number; height: number; data: Uint8ClampedArray } {
  const out = renderDocCPU({ layers }, thumb);
  return { width: out.width, height: out.height, data: toBytes(out) };
}

export class ThumbCache {
  private map = new Map<string, { width: number; height: number; data: Uint8ClampedArray }>();
  renders = 0;
  constructor(private readonly max = 64) {}
  get(sourceKey: string, presetKey: string, thumb: FloatImage, layers: () => AdjustmentLayer[]) {
    const key = `${sourceKey}|${presetKey}`;
    const hit = this.map.get(key);
    if (hit) return hit;
    const r = renderPresetThumb(thumb, layers());
    this.renders += 1;
    this.map.set(key, r);
    if (this.map.size > this.max) this.map.delete(this.map.keys().next().value as string);
    return r;
  }
  clear() {
    this.map.clear();
  }
}
