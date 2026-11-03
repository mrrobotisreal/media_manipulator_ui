/**
 * Photo colour math: the NORMATIVE reference for every rung-1 adjustment
 * (design `docs/design/PHOTO_EDITOR.md` §5.1).
 *
 * The WebGL2 preview (`lib/photo/gl/shaders/adjust.glsl`) mirrors these
 * functions stage for stage with the same constant names; the server render
 * (`scripts/server/photo_render.py`, MM96) and the phone (SkSL, MA50) mirror
 * them too. `npm run photo:goldens` renders the shared fixtures through
 * `renderDocCPU` below, so a formula change here must regenerate the goldens
 * deliberately (an equality test pins them).
 *
 * Working values are sRGB-encoded floats in [0,1]; only `exposure` and
 * `whiteBalance` work in linear light. Every stage clamps to [0,1]. Alpha is
 * never touched. Darkroom's formulas (`eqAdjust`, `colorBalanceMidtones`,
 * `vibranceAdjust`) are IMPORTED from `lib/studio/colorMath.ts`, not copied.
 */
import { colorBalanceMidtoneWeight, colorBalanceMidtones, eqAdjust, vibranceAdjust, type RGB } from '@/lib/studio/colorMath';
import { parseCubeLut, type ParsedLut } from '@/lib/studio/lutParser';
import type { AdjustmentLayer, CurvePoint, HslRange, LayerOf, LevelsChannel, PhotoDoc } from '@/lib/photo/photoTypes';
import { HSL_RANGE_IDS, defaultHslRanges } from '@/lib/photo/photoTypes';

export type { RGB };

/** BT.709 luma weights (same as Darkroom's `EQ_LUMA`). */
export const LUMA: RGB = [0.2126, 0.7152, 0.0722];
/** Hue weight below which HSL range edits fade out so neutrals are untouched. */
export const HSL_NEUTRAL_SAT = 0.1;
export const COLOR_BALANCE_GAIN = 0.3;
export const SPLIT_TONE_GAIN = 0.25;
export const TINT_GAIN = 0.25;
export const LUT_SIZE = 256;
export const MIN_LUMA = 1e-4;

export const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const luma = (c: RGB): number => c[0] * LUMA[0] + c[1] * LUMA[1] + c[2] * LUMA[2];

export function smoothstep(e0: number, e1: number, x: number): number {
  if (e1 === e0) return x < e0 ? 0 : 1;
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

// ---------------------------------------------------------------------------
// Transfer functions and colour spaces
// ---------------------------------------------------------------------------

export function srgbToLinear(v: number): number {
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
export function linearToSrgb(v: number): number {
  return v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
}
const mapRGB = (c: RGB, f: (v: number) => number): RGB => [f(c[0]), f(c[1]), f(c[2])];

/** RGB → [h (0..360), s, l]. */
export function rgbToHsl(c: RGB): [number, number, number] {
  const mx = Math.max(c[0], c[1], c[2]);
  const mn = Math.min(c[0], c[1], c[2]);
  const l = (mx + mn) / 2;
  const d = mx - mn;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (mx === c[0]) h = ((c[1] - c[2]) / d) % 6;
  else if (mx === c[1]) h = (c[2] - c[0]) / d + 2;
  else h = (c[0] - c[1]) / d + 4;
  h *= 60;
  if (h < 0) h += 360;
  return [h, clamp01(s), l];
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  const hh = (((h % 360) + 360) % 360) / 60;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (hh < 1) [r, g, b] = [c, x, 0];
  else if (hh < 2) [r, g, b] = [x, c, 0];
  else if (hh < 3) [r, g, b] = [0, c, x];
  else if (hh < 4) [r, g, b] = [0, x, c];
  else if (hh < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [r + m, g + m, b + m];
}

/** RGB → [h (0..360), s, v] (HSV). */
export function rgbToHsv(c: RGB): [number, number, number] {
  const mx = Math.max(c[0], c[1], c[2]);
  const [h] = rgbToHsl(c);
  return [h, mx === 0 ? 0 : (mx - Math.min(c[0], c[1], c[2])) / mx, mx];
}

/** Fully saturated, full-value colour of a hue in degrees. */
export function hueToRGB(hueDeg: number): RGB {
  const h = (((hueDeg % 360) + 360) % 360) / 360;
  return [clamp01(Math.abs(h * 6 - 3) - 1), clamp01(2 - Math.abs(h * 6 - 2)), clamp01(2 - Math.abs(h * 6 - 4))];
}

/** sRGB → CIE Lab (D65). Used by the MM98 colour-range mask (ΔE76). */
export function rgbToLab(c: RGB): [number, number, number] {
  const [r, g, b] = mapRGB(c, srgbToLinear);
  const x = (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047;
  const y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
  const z = (0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883;
  const f = (t: number) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
  const fx = f(x);
  const fy = f(y);
  const fz = f(z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

// ---------------------------------------------------------------------------
// Hue ranges
// ---------------------------------------------------------------------------

/**
 * Weight of a hue range at hue `h` (degrees): 1 inside the core
 * (`width` degrees centred on `center`), linear to 0 across `feather` degrees
 * on both sides, circular distance. The six default ranges partition unity.
 */
export function rangeWeight(h: number, center: number, width: number, feather: number): number {
  const d = Math.abs((((h - center) % 360) + 540) % 360 - 180);
  const half = width / 2;
  if (d <= half) return 1;
  if (feather <= 0 || d >= half + feather) return 0;
  return 1 - (d - half) / feather;
}

// ---------------------------------------------------------------------------
// Curves
// ---------------------------------------------------------------------------

/** Fritsch–Carlson monotone cubic Hermite through `points`, sampled to 256 entries. */
export function buildCurveLut(points: CurvePoint[]): Float32Array {
  const n = points.length;
  const lut = new Float32Array(LUT_SIZE);
  if (n < 2) {
    for (let i = 0; i < LUT_SIZE; i += 1) lut[i] = i / (LUT_SIZE - 1);
    return lut;
  }
  const h = new Array<number>(n - 1);
  const d = new Array<number>(n - 1);
  for (let i = 0; i < n - 1; i += 1) {
    h[i] = points[i + 1].x - points[i].x;
    d[i] = (points[i + 1].y - points[i].y) / h[i];
  }
  const m = new Array<number>(n);
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i += 1) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i += 1) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      m[i] = t * a * d[i];
      m[i + 1] = t * b * d[i];
    }
  }
  let seg = 0;
  for (let i = 0; i < LUT_SIZE; i += 1) {
    const x = i / (LUT_SIZE - 1);
    if (x <= points[0].x) {
      lut[i] = points[0].y;
      continue;
    }
    if (x >= points[n - 1].x) {
      lut[i] = points[n - 1].y;
      continue;
    }
    while (seg < n - 2 && x > points[seg + 1].x) seg += 1;
    const t = (x - points[seg].x) / h[seg];
    const t2 = t * t;
    const t3 = t2 * t;
    const y =
      (2 * t3 - 3 * t2 + 1) * points[seg].y +
      (t3 - 2 * t2 + t) * h[seg] * m[seg] +
      (-2 * t3 + 3 * t2) * points[seg + 1].y +
      (t3 - t2) * h[seg] * m[seg + 1];
    lut[i] = clamp01(y);
  }
  return lut;
}

/** Linear interpolation into a 256-entry LUT (what the GPU's LINEAR sampler does). */
export function sampleLut(lut: ArrayLike<number>, v: number): number {
  const p = clamp01(v) * (LUT_SIZE - 1);
  const i = Math.min(LUT_SIZE - 2, Math.floor(p));
  return lerp(lut[i], lut[i + 1], p - i);
}

// ---------------------------------------------------------------------------
// Levels
// ---------------------------------------------------------------------------

export interface LevelsParams {
  inBlack: number;
  inWhite: number;
  gamma: number;
  outBlack: number;
  outWhite: number;
}

export function levelsChannel(v: number, p: LevelsParams): number {
  const span = Math.max(p.inWhite - p.inBlack, 1e-6);
  const t = clamp01((v - p.inBlack) / span);
  return clamp01(Math.pow(t, 1 / p.gamma) * (p.outWhite - p.outBlack) + p.outBlack);
}

// ---------------------------------------------------------------------------
// Per-type adjustments. Each takes the layer params and returns the new colour.
// ---------------------------------------------------------------------------

type P<K extends AdjustmentLayer['type']> = LayerOf<K>['params'];

export function applyExposure(c: RGB, p: P<'exposure'>): RGB {
  const g = Math.pow(2, p.ev);
  return mapRGB(c, (v) => {
    const lin = clamp01(srgbToLinear(v) * g + p.offset);
    return clamp01(Math.pow(linearToSrgb(lin), 1 / p.gamma));
  });
}

export function applyBrightnessContrast(c: RGB, p: P<'brightnessContrast'>): RGB {
  const k = Math.pow(2, p.contrast / 50);
  return mapRGB(c, (v) => clamp01((clamp01(v + p.brightness / 200) - 0.5) * k + 0.5));
}

export function applyTone(c: RGB, p: P<'tone'>): RGB {
  const L = luma(c);
  const wSh = 1 - smoothstep(0, 0.6, L);
  const wHi = smoothstep(0.4, 1, L);
  const wBl = 1 - smoothstep(0, 0.25, L);
  const wWh = smoothstep(0.75, 1, L);
  const dL =
    0.25 * (p.shadows / 100) * wSh + 0.25 * (p.highlights / 100) * wHi + 0.15 * (p.blacks / 100) * wBl + 0.15 * (p.whites / 100) * wWh;
  const k = clamp01(L + dL) / Math.max(L, MIN_LUMA);
  return mapRGB(c, (v) => clamp01(v * k));
}

export function applyLevels(c: RGB, p: P<'levels'>): RGB {
  const ch = (v: number, k: LevelsChannel) => levelsChannel(v, p[k]);
  return [
    ch(ch(c[0], 'r'), 'master'),
    ch(ch(c[1], 'g'), 'master'),
    ch(ch(c[2], 'b'), 'master'),
  ];
}

export interface CurveLuts {
  master: Float32Array;
  r: Float32Array;
  g: Float32Array;
  b: Float32Array;
}
export function buildCurveLuts(p: P<'curves'>): CurveLuts {
  return {
    master: buildCurveLut(p.master.points),
    r: buildCurveLut(p.r.points),
    g: buildCurveLut(p.g.points),
    b: buildCurveLut(p.b.points),
  };
}
export function applyCurves(c: RGB, luts: CurveLuts): RGB {
  return [sampleLut(luts.master, sampleLut(luts.r, c[0])), sampleLut(luts.master, sampleLut(luts.g, c[1])), sampleLut(luts.master, sampleLut(luts.b, c[2]))];
}

export function applyWhiteBalance(c: RGB, p: P<'whiteBalance'>): RGB {
  const lin = mapRGB(c, srgbToLinear);
  const t = p.temperature / 100;
  const ti = p.tint / 100;
  return mapRGB(colorBalanceMidtones(lin, t, -ti, -t), (v) => clamp01(linearToSrgb(v)));
}

export function applyVibranceSaturation(c: RGB, p: P<'vibranceSaturation'>): RGB {
  return eqAdjust(vibranceAdjust(c, p.vibrance / 100), 0, 1, 1 + p.saturation / 100);
}

export function applyHsl(c: RGB, p: P<'hsl'>): RGB {
  const [h, s, l] = rgbToHsl(c);
  const neutral = Math.min(1, s / HSL_NEUTRAL_SAT);
  let dh = p.master.hue;
  let sMul = 1 + p.master.saturation / 100;
  const dl = p.master.lightness / 100;
  let lPos = 0;
  let lNeg = 0;
  if (dl > 0) lPos += dl;
  else lNeg += dl;
  for (const r of p.ranges) {
    const w = rangeWeight(h, r.center, r.width, r.feather) * neutral;
    if (w === 0) continue;
    dh += w * r.hue;
    sMul *= 1 + (w * r.saturation) / 100;
    const dlr = (w * r.lightness) / 100;
    if (dlr > 0) lPos += dlr;
    else lNeg += dlr;
  }
  const s2 = clamp01(s * sMul);
  const l2 = clamp01(l + lPos * (1 - l) + lNeg * l);
  const out = hslToRgb(h + dh, s2, l2);
  return [clamp01(out[0]), clamp01(out[1]), clamp01(out[2])];
}

function rescaleToLuma(c: RGB, target: number): RGB {
  const L = luma(c);
  if (L < MIN_LUMA) return c;
  const k = target / L;
  return [clamp01(c[0] * k), clamp01(c[1] * k), clamp01(c[2] * k)];
}

export function applyColorBalance(c: RGB, p: P<'colorBalance'>): RGB {
  const L = luma(c);
  const wSh = 1 - smoothstep(0, 0.5, L);
  const wMid = colorBalanceMidtoneWeight(c);
  const wHi = smoothstep(0.5, 1, L);
  const ch = (k: 'r' | 'g' | 'b') =>
    COLOR_BALANCE_GAIN * ((wSh * p.shadows[k] + wMid * p.midtones[k] + wHi * p.highlights[k]) / 100);
  const out: RGB = [clamp01(c[0] + ch('r')), clamp01(c[1] + ch('g')), clamp01(c[2] + ch('b'))];
  return p.preserveLuminosity ? rescaleToLuma(out, L) : out;
}

const BW_KEYS = ['reds', 'yellows', 'greens', 'cyans', 'blues', 'magentas'] as const;
const BW_RANGES = defaultHslRanges();
export function applyBlackWhite(c: RGB, p: P<'blackWhite'>): RGB {
  const [h, S, V] = rgbToHsv(c);
  const L = luma(c);
  let mix = 0;
  for (let i = 0; i < 6; i += 1) {
    const r = BW_RANGES[i];
    mix += rangeWeight(h, r.center, r.width, r.feather) * (p[BW_KEYS[i]] / 100);
  }
  const gray = clamp01((1 - S) * L + S * mix * V);
  if (!p.tint) return [gray, gray, gray];
  const t = hueToRGB(p.tint.hue);
  const a = (p.tint.saturation / 100) * TINT_GAIN;
  return [clamp01(gray + a * (t[0] - 0.5)), clamp01(gray + a * (t[1] - 0.5)), clamp01(gray + a * (t[2] - 0.5))];
}

export function applyChannelMixer(c: RGB, p: P<'channelMixer'>): RGB {
  const row = (m: { r: number; g: number; b: number; constant: number }) =>
    clamp01((m.r * c[0] + m.g * c[1] + m.b * c[2] + m.constant) / 100);
  const r = row(p.r);
  if (p.monochrome) return [r, r, r];
  return [r, row(p.g), row(p.b)];
}

export function hexToRgb(hex: string): RGB {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function applyPhotoFilter(c: RGB, p: P<'photoFilter'>): RGB {
  const f = hexToRgb(p.color);
  const d = p.density / 100;
  const out: RGB = [lerp(c[0], c[0] * f[0], d), lerp(c[1], c[1] * f[1], d), lerp(c[2], c[2] * f[2], d)];
  return p.preserveLuminosity ? rescaleToLuma(out, luma(c)) : out;
}

export function applySplitTone(c: RGB, p: P<'splitTone'>): RGB {
  const L = luma(c);
  const e = 0.5 + (p.balance / 100) * 0.25;
  const wSh = 1 - smoothstep(0, e, L);
  const wHi = smoothstep(e, 1, L);
  const s = hueToRGB(p.shadows.hue);
  const h = hueToRGB(p.highlights.hue);
  const a = SPLIT_TONE_GAIN * (p.shadows.saturation / 100) * wSh;
  const b = SPLIT_TONE_GAIN * (p.highlights.saturation / 100) * wHi;
  return [0, 1, 2].map((i) => clamp01(c[i] + a * (s[i] - 0.5) + b * (h[i] - 0.5))) as RGB;
}

const lutCache = new Map<string, ParsedLut | null>();
/** Parse (and cache) a `.cube` text; null when it does not parse (layer is a no-op). */
export function parseLutCached(cube: string): ParsedLut | null {
  if (!cube) return null;
  const hit = lutCache.get(cube);
  if (hit !== undefined) return hit;
  let parsed: ParsedLut | null = null;
  try {
    parsed = parseCubeLut(cube);
  } catch {
    parsed = null;
  }
  if (lutCache.size > 8) lutCache.clear();
  lutCache.set(cube, parsed);
  return parsed;
}

/** Trilinear lookup into a byte-quantized cube (red fastest). */
export function sampleLut3D(lut: ParsedLut, c: RGB): RGB {
  const n = lut.size;
  const fx = clamp01(c[0]) * (n - 1);
  const fy = clamp01(c[1]) * (n - 1);
  const fz = clamp01(c[2]) * (n - 1);
  const x0 = Math.min(n - 2, Math.floor(fx));
  const y0 = Math.min(n - 2, Math.floor(fy));
  const z0 = Math.min(n - 2, Math.floor(fz));
  const tx = fx - x0;
  const ty = fy - y0;
  const tz = fz - z0;
  const at = (x: number, y: number, z: number, k: number) => lut.data[((z * n + y) * n + x) * 3 + k] / 255;
  const out: RGB = [0, 0, 0];
  for (let k = 0; k < 3; k += 1) {
    const c00 = lerp(at(x0, y0, z0, k), at(x0 + 1, y0, z0, k), tx);
    const c10 = lerp(at(x0, y0 + 1, z0, k), at(x0 + 1, y0 + 1, z0, k), tx);
    const c01 = lerp(at(x0, y0, z0 + 1, k), at(x0 + 1, y0, z0 + 1, k), tx);
    const c11 = lerp(at(x0, y0 + 1, z0 + 1, k), at(x0 + 1, y0 + 1, z0 + 1, k), tx);
    out[k] = lerp(lerp(c00, c10, ty), lerp(c01, c11, ty), tz);
  }
  return out;
}

export function applyLut(c: RGB, p: P<'lut'>): RGB {
  const lut = parseLutCached(p.cube);
  if (!lut) return c;
  const o = sampleLut3D(lut, c);
  return [lerp(c[0], o[0], p.intensity), lerp(c[1], o[1], p.intensity), lerp(c[2], o[2], p.intensity)];
}

export const applyInvert = (c: RGB): RGB => [1 - c[0], 1 - c[1], 1 - c[2]];
export function applyPosterize(c: RGB, p: P<'posterize'>): RGB {
  const n = p.levels - 1;
  return mapRGB(c, (v) => Math.floor(clamp01(v) * n + 0.5) / n);
}
export function applyThreshold(c: RGB, p: P<'threshold'>): RGB {
  const v = luma(c) >= p.level ? 1 : 0;
  return [v, v, v];
}
export function applyGamma(c: RGB, p: P<'gamma'>): RGB {
  return mapRGB(c, (v) => clamp01(Math.pow(clamp01(v), 1 / p.gamma)));
}

// ---------------------------------------------------------------------------
// Layer stack
// ---------------------------------------------------------------------------

/** Per-document precomputation (curve LUTs) reused for every pixel. */
export interface LayerPlan {
  layer: AdjustmentLayer;
  curves?: CurveLuts;
}
export function planLayers(doc: Pick<PhotoDoc, 'layers'>): LayerPlan[] {
  return doc.layers
    .filter((l) => l.enabled && l.opacity > 0)
    .map((layer) => ({ layer, curves: layer.type === 'curves' ? buildCurveLuts(layer.params) : undefined }));
}

export function applyLayerType(c: RGB, plan: LayerPlan): RGB {
  const l = plan.layer;
  switch (l.type) {
    case 'exposure':
      return applyExposure(c, l.params);
    case 'brightnessContrast':
      return applyBrightnessContrast(c, l.params);
    case 'tone':
      return applyTone(c, l.params);
    case 'levels':
      return applyLevels(c, l.params);
    case 'curves':
      return applyCurves(c, plan.curves as CurveLuts);
    case 'whiteBalance':
      return applyWhiteBalance(c, l.params);
    case 'vibranceSaturation':
      return applyVibranceSaturation(c, l.params);
    case 'hsl':
      return applyHsl(c, l.params);
    case 'colorBalance':
      return applyColorBalance(c, l.params);
    case 'blackWhite':
      return applyBlackWhite(c, l.params);
    case 'channelMixer':
      return applyChannelMixer(c, l.params);
    case 'photoFilter':
      return applyPhotoFilter(c, l.params);
    case 'splitTone':
      return applySplitTone(c, l.params);
    case 'lut':
      return applyLut(c, l.params);
    case 'invert':
      return applyInvert(c);
    case 'posterize':
      return applyPosterize(c, l.params);
    case 'threshold':
      return applyThreshold(c, l.params);
    case 'gamma':
      return applyGamma(c, l.params);
    case 'redEye':
      return [Math.min(c[0], (c[1] + c[2]) / 2), c[1], c[2]];
    default:
      // Rung-4 detail ops (MM99) are neighbourhood ops: identity per pixel here.
      return c;
  }
}

/**
 * Blend an adjusted colour onto the input: `normal` replaces, `luminosity`
 * keeps the input's hue/chroma and takes the adjusted luma (shift), `color`
 * keeps the input's luma and takes the adjusted chroma (shift).
 */
export function blendLayer(mode: AdjustmentLayer['blend'], input: RGB, adjusted: RGB): RGB {
  if (mode === 'normal') return adjusted;
  const d = mode === 'luminosity' ? luma(adjusted) - luma(input) : luma(input) - luma(adjusted);
  const base = mode === 'luminosity' ? input : adjusted;
  return [clamp01(base[0] + d), clamp01(base[1] + d), clamp01(base[2] + d)];
}

export function applyLayer(c: RGB, plan: LayerPlan, maskValue = 1): RGB {
  const l = plan.layer;
  const adjusted = blendLayer(l.blend, c, applyLayerType(c, plan));
  const a = clamp01(l.opacity * maskValue);
  if (a >= 1) return adjusted;
  return [lerp(c[0], adjusted[0], a), lerp(c[1], adjusted[1], a), lerp(c[2], adjusted[2], a)];
}

// ---------------------------------------------------------------------------
// Masks (design §5.2): the fold only; pixels sources and feather blur are MM98.
// ---------------------------------------------------------------------------

export type MaskMode = 'add' | 'subtract' | 'intersect';
/** Fold component values left to right: add = max, subtract = min(m, 1-c), intersect = min. */
export function foldMask(parts: { mode: MaskMode; value: number }[]): number {
  let m = 0;
  for (const { mode, value } of parts) {
    if (mode === 'add') m = Math.max(m, value);
    else if (mode === 'subtract') m = Math.min(m, 1 - value);
    else m = Math.min(m, value);
  }
  return m;
}
export function finishMask(m: number, invert: boolean, opacity: number): number {
  return clamp01((invert ? 1 - m : m) * opacity);
}

// ---------------------------------------------------------------------------
// Whole-image reference render
// ---------------------------------------------------------------------------

/** RGBA, row-major, sRGB-encoded floats in [0,1], not premultiplied. */
export interface FloatImage {
  width: number;
  height: number;
  data: Float32Array;
}

/**
 * Apply the document to an image. Geometry is the identity in MM97 (rung 3 is
 * MM98); masks are ignored (rung 2 is MM98) so a document that carries one
 * renders unmasked. Pure and deterministic.
 */
export function renderDocCPU(doc: Pick<PhotoDoc, 'layers'>, image: FloatImage): FloatImage {
  const plans = planLayers(doc);
  const out = new Float32Array(image.data.length);
  const px = image.width * image.height;
  for (let i = 0; i < px; i += 1) {
    let c: RGB = [image.data[i * 4], image.data[i * 4 + 1], image.data[i * 4 + 2]];
    for (const plan of plans) c = applyLayer(c, plan);
    out[i * 4] = c[0];
    out[i * 4 + 1] = c[1];
    out[i * 4 + 2] = c[2];
    out[i * 4 + 3] = image.data[i * 4 + 3];
  }
  return { width: image.width, height: image.height, data: out };
}

/** 8-bit quantization used by the goldens: round-half-up of v·255. */
export function toBytes(image: FloatImage): Uint8ClampedArray {
  const out = new Uint8ClampedArray(image.data.length);
  for (let i = 0; i < out.length; i += 1) out[i] = Math.floor(clamp01(image.data[i]) * 255 + 0.5);
  return out;
}

export function fromBytes(width: number, height: number, bytes: ArrayLike<number>): FloatImage {
  const data = new Float32Array(width * height * 4);
  for (let i = 0; i < data.length; i += 1) data[i] = bytes[i] / 255;
  return { width, height, data };
}

export { HSL_RANGE_IDS };
export type { HslRange };
