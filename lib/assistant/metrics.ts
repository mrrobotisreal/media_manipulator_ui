/**
 * MM115: Medi's meters. A handful of numbers measured in the browser from the preview the editor
 * already renders, so a colourist's "numbers first" check needs no upload: mean/median luma,
 * contrast (luma spread), shadows and highlights clipped, and the grey-world warmth and tint.
 * The names and units match the API's `analyze` package (shares are 0..1). Aperture reuses its
 * histogram; Darkroom and Motion measure the JPEG frame they already capture (decoded to ≤ 128 px).
 * Memory only: nothing is stored, and the numbers ride the same request as the frame.
 */
import { AssistantMetricsSchema, type AssistantMetrics } from '@/schemas/assistant';

const round = (v: number, places = 4) => Math.round(v * 10 ** places) / 10 ** places;

/** Meters from interleaved RGBA pixels (alpha ignored; fully transparent pixels skipped). */
export function metricsFromRgba(rgba: ArrayLike<number>): AssistantMetrics | null {
  const hist = new Uint32Array(256);
  let n = 0;
  let sum = 0;
  let sumSq = 0;
  let sr = 0;
  let sg = 0;
  let sb = 0;
  let lo = 0;
  let hi = 0;
  for (let i = 0; i + 3 < rgba.length; i += 4) {
    if (rgba[i + 3] === 0) continue;
    const r = rgba[i];
    const g = rgba[i + 1];
    const b = rgba[i + 2];
    const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const li = Math.min(255, Math.round(l));
    hist[li] += 1;
    n += 1;
    sum += l;
    sumSq += l * l;
    sr += r;
    sg += g;
    sb += b;
    if (li <= 1) lo += 1;
    if (li >= 254) hi += 1;
  }
  if (n === 0) return null;
  return finishMetrics({ n, sum, sumSq, sr, sg, sb, lo, hi, hist });
}

interface Acc {
  n: number;
  sum: number;
  sumSq: number;
  sr: number;
  sg: number;
  sb: number;
  lo: number;
  hi: number;
  hist: ArrayLike<number>;
}

function finishMetrics(a: Acc): AssistantMetrics {
  const mean = a.sum / a.n;
  let acc = 0;
  let median = 0;
  for (let i = 0; i < 256; i += 1) {
    acc += a.hist[i];
    if (acc >= a.n / 2) {
      median = i;
      break;
    }
  }
  const avg = (a.sr + a.sg + a.sb) / (3 * a.n);
  const r = a.sr / a.n;
  const g = a.sg / a.n;
  const b = a.sb / a.n;
  return {
    meanLuma: round(mean / 255),
    medianLuma: round(median / 255),
    lumaStd: round(Math.sqrt(Math.max(0, a.sumSq / a.n - mean * mean)) / 255),
    shadowsClipped: round(a.lo / a.n),
    highlightsClipped: round(a.hi / a.n),
    warmth: avg > 0 ? round((r - b) / avg) : 0,
    tint: avg > 0 ? round((g - (r + b) / 2) / avg) : 0,
  };
}

/** Meters from Aperture's 256-bin histogram (the one its Histogram panel already computes). */
export function metricsFromHistogram(h: { r: ArrayLike<number>; g: ArrayLike<number>; b: ArrayLike<number>; luma: ArrayLike<number> }): AssistantMetrics | null {
  let n = 0;
  let sum = 0;
  let sumSq = 0;
  let sr = 0;
  let sg = 0;
  let sb = 0;
  for (let i = 0; i < 256; i += 1) {
    const c = h.luma[i];
    n += c;
    sum += c * i;
    sumSq += c * i * i;
    sr += h.r[i] * i;
    sg += h.g[i] * i;
    sb += h.b[i] * i;
  }
  if (n === 0) return null;
  return finishMetrics({ n, sum, sumSq, sr, sg, sb, lo: h.luma[0] + h.luma[1], hi: h.luma[254] + h.luma[255], hist: h.luma });
}

const METRIC_SIDE = 128;

/** Meters of a JPEG/PNG blob (the frame the editor already captured), decoded to ≤ 128 px. */
export async function metricsFromBlob(blob: Blob): Promise<AssistantMetrics | null> {
  try {
    if (typeof createImageBitmap !== 'function' || typeof document === 'undefined') return null;
    const bmp = await createImageBitmap(blob);
    try {
      const k = Math.min(1, METRIC_SIDE / Math.max(bmp.width, bmp.height, 1));
      const w = Math.max(1, Math.round(bmp.width * k));
      const h = Math.max(1, Math.round(bmp.height * k));
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      if (!ctx) return null;
      ctx.drawImage(bmp, 0, 0, w, h);
      return metricsFromRgba(ctx.getImageData(0, 0, w, h).data);
    } finally {
      bmp.close?.();
    }
  } catch {
    return null;
  }
}

/** Validated metrics for the request body, or undefined (never throws; the API enforces the same 4 KB). */
export function metricsForBody(m: unknown): AssistantMetrics | undefined {
  const parsed = AssistantMetricsSchema.safeParse(m);
  return parsed.success && Object.keys(parsed.data).length > 0 ? parsed.data : undefined;
}
