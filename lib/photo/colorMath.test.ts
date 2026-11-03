import { describe, expect, it } from 'vitest';

import {
  applyBlackWhite,
  applyBrightnessContrast,
  applyChannelMixer,
  applyColorBalance,
  applyExposure,
  applyGamma,
  applyHsl,
  applyInvert,
  applyLayer,
  applyLevels,
  applyLut,
  applyPhotoFilter,
  applyPosterize,
  applySplitTone,
  applyThreshold,
  applyTone,
  applyVibranceSaturation,
  applyWhiteBalance,
  buildCurveLut,
  foldMask,
  hslToRgb,
  linearToSrgb,
  luma,
  planLayers,
  rangeWeight,
  renderDocCPU,
  rgbToHsl,
  rgbToLab,
  sampleLut,
  srgbToLinear,
  type RGB,
} from './colorMath';
import { LAYER_PARAMS, newPhotoDoc, type AdjustmentLayer, type LayerType } from './photoTypes';

/** Params with every default filled, then overridden. */
function params<K extends LayerType>(type: K, over: Record<string, unknown> = {}) {
  return LAYER_PARAMS[type].parse(over) as never;
}
const close = (a: RGB, b: RGB, eps = 1e-6) => a.forEach((v, i) => expect(v).toBeCloseTo(b[i], -Math.log10(eps)));

describe('transfer + colour spaces', () => {
  it('sRGB round-trips within 1e-6', () => {
    for (let i = 0; i <= 100; i += 1) {
      const v = i / 100;
      expect(Math.abs(linearToSrgb(srgbToLinear(v)) - v)).toBeLessThan(1e-6);
    }
  });
  it('HSL round-trips', () => {
    for (const c of [[0.2, 0.5, 0.9], [1, 0, 0], [0.3, 0.3, 0.3], [0.9, 0.8, 0.1]] as RGB[]) {
      const [h, s, l] = rgbToHsl(c);
      close(hslToRgb(h, s, l), c, 1e-6);
    }
  });
  it('Lab of white is (100, 0, 0)', () => {
    const [L, a, b] = rgbToLab([1, 1, 1]);
    expect(L).toBeCloseTo(100, 2);
    expect(Math.abs(a)).toBeLessThan(0.01);
    expect(Math.abs(b)).toBeLessThan(0.01);
  });
});

describe('rangeWeight', () => {
  it('is 1 in the core, linear in the feather, 0 beyond, circular', () => {
    expect(rangeWeight(0, 0, 30, 30)).toBe(1);
    expect(rangeWeight(15, 0, 30, 30)).toBe(1);
    expect(rangeWeight(30, 0, 30, 30)).toBeCloseTo(0.5, 9);
    expect(rangeWeight(45, 0, 30, 30)).toBeCloseTo(0, 9);
    expect(rangeWeight(60, 0, 30, 30)).toBe(0);
    expect(rangeWeight(350, 0, 30, 30)).toBe(1);
    expect(rangeWeight(330, 0, 30, 30)).toBeCloseTo(0.5, 9);
  });
});

describe('curves', () => {
  it('identity is the diagonal', () => {
    const lut = buildCurveLut([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
    for (let i = 0; i < 256; i += 1) expect(lut[i]).toBeCloseTo(i / 255, 6);
  });
  it('passes through its points and is monotone for monotone points', () => {
    const lut = buildCurveLut([{ x: 0, y: 0 }, { x: 0.25, y: 0.1 }, { x: 0.75, y: 0.9 }, { x: 1, y: 1 }]);
    expect(sampleLut(lut, 0.5)).toBeCloseTo(0.5, 2);
    for (let i = 1; i < 256; i += 1) expect(lut[i]).toBeGreaterThanOrEqual(lut[i - 1] - 1e-9);
  });
  it('does not overshoot with a sharp knee (monotone cubic)', () => {
    const lut = buildCurveLut([{ x: 0, y: 0 }, { x: 0.4, y: 0.05 }, { x: 0.5, y: 0.95 }, { x: 1, y: 1 }]);
    for (let i = 0; i < 256; i += 1) {
      expect(lut[i]).toBeGreaterThanOrEqual(0);
      expect(lut[i]).toBeLessThanOrEqual(1);
      if (i) expect(lut[i]).toBeGreaterThanOrEqual(lut[i - 1] - 1e-9);
    }
  });
});

describe('per-type adjustments (hand-computed)', () => {
  it('exposure +1 EV doubles linear light (0.5 gray → linear 0.214 ×2)', () => {
    const c = applyExposure([0.5, 0.5, 0.5], params('exposure', { ev: 1 }));
    expect(c[0]).toBeCloseTo(linearToSrgb(srgbToLinear(0.5) * 2), 6);
  });
  it('exposure defaults are the identity', () => {
    close(applyExposure([0.3, 0.6, 0.9], params('exposure')), [0.3, 0.6, 0.9], 1e-6);
  });
  it('brightness +100 adds 0.5, contrast pivots on 0.5', () => {
    close(applyBrightnessContrast([0.2, 0.2, 0.2], params('brightnessContrast', { brightness: 100 })), [0.7, 0.7, 0.7]);
    close(applyBrightnessContrast([0.5, 0.5, 0.5], params('brightnessContrast', { contrast: 50 })), [0.5, 0.5, 0.5]);
    close(applyBrightnessContrast([0.75, 0.75, 0.75], params('brightnessContrast', { contrast: 50 })), [1, 1, 1]);
  });
  it('tone: shadows +100 lifts darks (L=0.1 → +0.25·W_sh) and leaves white', () => {
    const L = 0.1;
    const w = 1 - (() => { const t = L / 0.6; return t * t * (3 - 2 * t); })();
    const out = applyTone([L, L, L], params('tone', { shadows: 100 }));
    expect(out[0]).toBeCloseTo(L + 0.25 * w, 6);
    close(applyTone([1, 1, 1], params('tone', { shadows: 100 })), [1, 1, 1]);
  });
  it('tone preserves hue (ratio of channels)', () => {
    const out = applyTone([0.2, 0.1, 0.05], params('tone', { shadows: 60 }));
    expect(out[0] / out[1]).toBeCloseTo(2, 5);
  });
  it('levels: input range 0.2..0.8 maps 0.5 → 0.5 and clamps outside; gamma 2 lifts mids', () => {
    close(applyLevels([0.5, 0.5, 0.5], params('levels', { master: { inBlack: 0.2, inWhite: 0.8 } })), [0.5, 0.5, 0.5]);
    close(applyLevels([0.1, 0.9, 0.5], params('levels', { master: { inBlack: 0.2, inWhite: 0.8 } })), [0, 1, 0.5]);
    expect(applyLevels([0.25, 0.25, 0.25], params('levels', { master: { gamma: 2 } }))[0]).toBeCloseTo(0.5, 9);
  });
  it('levels: channels apply before master', () => {
    const o = applyLevels([0.5, 0.5, 0.5], params('levels', { r: { outWhite: 0.5 }, master: { outWhite: 0.5 } }));
    expect(o[0]).toBeCloseTo(0.125, 9);
    expect(o[1]).toBeCloseTo(0.25, 9);
  });
  it('white balance: warm raises red and lowers blue', () => {
    const o = applyWhiteBalance([0.5, 0.5, 0.5], params('whiteBalance', { temperature: 50 }));
    expect(o[0]).toBeGreaterThan(0.5);
    expect(o[2]).toBeLessThan(0.5);
  });
  it('vibrance/saturation: saturation -100 is the luma gray', () => {
    const o = applyVibranceSaturation([0.8, 0.2, 0.2], params('vibranceSaturation', { saturation: -100 }));
    const L = luma([0.8, 0.2, 0.2]);
    close(o, [L, L, L], 1e-6);
  });
  it('colour balance: preserveLuminosity keeps L; off adds 0.3 in the weighted band', () => {
    const c: RGB = [0.5, 0.5, 0.5];
    const p = params('colorBalance', { midtones: { r: 100 } });
    expect(luma(applyColorBalance(c, p))).toBeCloseTo(0.5, 5);
    const off = applyColorBalance(c, params('colorBalance', { midtones: { r: 100 }, preserveLuminosity: false }));
    expect(off[0]).toBeGreaterThan(0.5);
    expect(off[1]).toBe(0.5);
  });
  it('B&W defaults: pure red → 0.4·V, grey stays grey', () => {
    close(applyBlackWhite([1, 0, 0], params('blackWhite')), [0.4, 0.4, 0.4], 1e-6);
    close(applyBlackWhite([0.5, 0.5, 0.5], params('blackWhite')), [0.5, 0.5, 0.5], 1e-6);
  });
  it('B&W tint shifts toward the tint hue', () => {
    const o = applyBlackWhite([0.5, 0.5, 0.5], params('blackWhite', { tint: { hue: 0, saturation: 100 } }));
    expect(o[0]).toBeGreaterThan(o[1]);
  });
  it('channel mixer: identity, monochrome copies red row, constant adds', () => {
    close(applyChannelMixer([0.2, 0.4, 0.6], params('channelMixer')), [0.2, 0.4, 0.6]);
    close(applyChannelMixer([0.2, 0.4, 0.6], params('channelMixer', { monochrome: true })), [0.2, 0.2, 0.2]);
    close(applyChannelMixer([0.2, 0.4, 0.6], params('channelMixer', { r: { constant: 10 } })), [0.3, 0.4, 0.6]);
  });
  it('photo filter: density 100 multiplies by the colour; luminosity preserved on request', () => {
    close(applyPhotoFilter([0.5, 0.5, 0.5], params('photoFilter', { color: '#FF0000', density: 100, preserveLuminosity: false })), [0.5, 0, 0]);
    expect(luma(applyPhotoFilter([0.5, 0.5, 0.5], params('photoFilter', { color: '#FF8000', density: 100 })))).toBeCloseTo(0.5, 4);
  });
  it('split tone: shadows tint dark pixels only', () => {
    const p = params('splitTone', { shadows: { hue: 0, saturation: 100 } });
    expect(applySplitTone([0.05, 0.05, 0.05], p)[0]).toBeGreaterThan(0.05);
    close(applySplitTone([0.95, 0.95, 0.95], p), [0.95, 0.95, 0.95]);
  });
  it('LUT: an identity cube is a no-op; a bad cube is a no-op; intensity 0 is a no-op', () => {
    const n = 2;
    const rows: string[] = [`LUT_3D_SIZE ${n}`];
    for (let b = 0; b < n; b += 1) for (let g = 0; g < n; g += 1) for (let r = 0; r < n; r += 1) rows.push(`${r} ${g} ${b}`);
    const cube = rows.join('\n');
    close(applyLut([0.3, 0.6, 0.9], params('lut', { cube })), [0.3, 0.6, 0.9], 2e-3);
    close(applyLut([0.3, 0.6, 0.9], { cube: 'LUT_3D_SIZE 2\n0 0', intensity: 1 }), [0.3, 0.6, 0.9]);
    const inv = rows.slice(1).map((l) => l.split(' ').map((v) => 1 - Number(v)).join(' '));
    const invCube = [rows[0], ...inv].join('\n');
    close(applyLut([0, 0, 0], params('lut', { cube: invCube })), [1, 1, 1]);
    close(applyLut([0.3, 0.6, 0.9], params('lut', { cube: invCube, intensity: 0 })), [0.3, 0.6, 0.9]);
  });
  it('invert, posterize, threshold, gamma', () => {
    close(applyInvert([0.2, 0.5, 1]), [0.8, 0.5, 0]);
    close(applyPosterize([0.3, 0.6, 0.9], params('posterize', { levels: 2 })), [0, 1, 1]);
    close(applyThreshold([0.6, 0.6, 0.6], params('threshold', { level: 0.5 })), [1, 1, 1]);
    close(applyThreshold([0.4, 0.4, 0.4], params('threshold', { level: 0.5 })), [0, 0, 0]);
    expect(applyGamma([0.25, 0.25, 0.25], params('gamma', { gamma: 2 }))[0]).toBeCloseTo(0.5, 9);
  });
});

describe('HSL: "grey except red"', () => {
  const greyExceptRed = () =>
    params('hsl', {
      ranges: [
        { id: 'reds', center: 0, saturation: 0 },
        { id: 'yellows', center: 60, saturation: -100 },
        { id: 'greens', center: 120, saturation: -100 },
        { id: 'cyans', center: 180, saturation: -100 },
        { id: 'blues', center: 240, saturation: -100 },
        { id: 'magentas', center: 300, saturation: -100 },
      ],
    });
  it('leaves pure red unchanged and makes pure green grey (saturation -100 on five ranges)', () => {
    const p = greyExceptRed();
    close(applyHsl([1, 0, 0], p), [1, 0, 0], 1e-6);
    const g = applyHsl([0, 1, 0], p);
    expect(Math.max(...g) - Math.min(...g)).toBeLessThan(1e-6);
  });
  it('greys blue and a red-orange stays coloured', () => {
    const p = greyExceptRed();
    const b = applyHsl([0.1, 0.2, 0.9], p);
    expect(Math.max(...b) - Math.min(...b)).toBeLessThan(1e-6);
    const o = applyHsl([0.9, 0.2, 0.1], p);
    expect(Math.max(...o) - Math.min(...o)).toBeGreaterThan(0.5);
  });
  it('master hue +120 turns red into green; defaults are the identity; neutrals are untouched', () => {
    close(applyHsl([1, 0, 0], params('hsl', { master: { hue: 120 } })), [0, 1, 0], 1e-6);
    close(applyHsl([0.3, 0.6, 0.2], params('hsl')), [0.3, 0.6, 0.2], 1e-6);
    close(applyHsl([0.5, 0.5, 0.5], params('hsl', { ranges: [{ id: 'x', center: 0, saturation: -100, lightness: 100 }] })), [0.5, 0.5, 0.5], 1e-6);
  });
});

describe('layer stack', () => {
  const layer = (type: LayerType, over: Record<string, unknown>, extra: Record<string, unknown> = {}) =>
    ({ id: type, enabled: true, opacity: 1, blend: 'normal', mask: null, type, params: params(type, over), ...extra }) as AdjustmentLayer;

  it('opacity lerps, disabled layers are skipped, blend luminosity keeps hue', () => {
    const plan = planLayers({ layers: [layer('invert', {}, { opacity: 0.5 })] })[0];
    close(applyLayer([0, 0, 0], plan), [0.5, 0.5, 0.5]);
    expect(planLayers({ layers: [layer('invert', {}, { enabled: false })] })).toHaveLength(0);
    const lum = planLayers({ layers: [layer('invert', {}, { blend: 'luminosity' })] })[0];
    const o = applyLayer([0.5, 0.4, 0.3], lum);
    // luminosity: result luma equals the inverted colour's luma
    expect(luma(o)).toBeCloseTo(luma([0.5, 0.6, 0.7]), 5);
  });
  it('renderDocCPU keeps alpha and applies layers in order', () => {
    const doc = { ...newPhotoDoc(2, 1), layers: [layer('invert', {}), layer('threshold', { level: 0.5 })] };
    const out = renderDocCPU(doc, { width: 2, height: 1, data: new Float32Array([0, 0, 0, 0.25, 1, 1, 1, 1]) });
    expect(Array.from(out.data)).toEqual([1, 1, 1, 0.25, 0, 0, 0, 1]);
  });
});

describe('mask fold', () => {
  it('add = max, subtract = min(m, 1-c), intersect = min', () => {
    expect(foldMask([{ mode: 'add', value: 0.4 }, { mode: 'add', value: 0.7 }])).toBe(0.7);
    expect(foldMask([{ mode: 'add', value: 1 }, { mode: 'subtract', value: 0.25 }])).toBe(0.75);
    expect(foldMask([{ mode: 'add', value: 0.9 }, { mode: 'intersect', value: 0.3 }])).toBe(0.3);
  });
});
