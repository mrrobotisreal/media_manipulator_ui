import { describe, expect, it } from 'vitest';
import {
  blendChannel,
  colorBalanceMidtones,
  eqAdjust,
  lumetriAdjust,
  vibranceAdjust,
  type RGB,
} from '@/lib/studio/colorMath';

const near = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) <= eps;
const rgbNear = (a: RGB, b: RGB, eps = 1e-6) =>
  near(a[0], b[0], eps) && near(a[1], b[1], eps) && near(a[2], b[2], eps);

describe('eqAdjust', () => {
  it('is identity at neutral parameters', () => {
    const c: RGB = [0.6, 0.4, 0.5];
    expect(rgbNear(eqAdjust(c, 0, 1, 1), c)).toBe(true);
  });

  it('contrast scales luma only — chroma offsets survive unscaled', () => {
    const c: RGB = [0.6, 0.4, 0.5];
    const l = 0.6 * 0.2126 + 0.4 * 0.7152 + 0.5 * 0.0722;
    const out = eqAdjust(c, 0, 2, 1);
    const nl = (l - 0.5) * 2 + 0.5;
    // chroma diff (c − l) passes through with saturation=1, regardless of contrast
    expect(near(out[0] - out[1], c[0] - c[1])).toBe(true);
    expect(near(out[0], nl + (c[0] - l))).toBe(true);
  });

  it('saturation 0 collapses to (contrasted) luma gray', () => {
    const out = eqAdjust([0.8, 0.2, 0.5], 0.1, 1.5, 0);
    expect(near(out[0], out[1]) && near(out[1], out[2])).toBe(true);
  });
});

describe('colorBalanceMidtones', () => {
  it('peaks at mid-gray with weight 0.7', () => {
    // l = 0.5 → both clips saturate at 1 → weight = 0.7 exactly.
    const out = colorBalanceMidtones([0.5, 0.5, 0.5], 0.2, -0.1, -0.2);
    expect(rgbNear(out, [0.5 + 0.2 * 0.7, 0.5 - 0.1 * 0.7, 0.5 - 0.2 * 0.7])).toBe(true);
  });

  it('leaves pure black and white untouched (midtone weight → 0)', () => {
    expect(rgbNear(colorBalanceMidtones([0, 0, 0], 1, 1, 1), [0, 0, 0])).toBe(true);
    expect(rgbNear(colorBalanceMidtones([1, 1, 1], -1, -1, -1), [1, 1, 1])).toBe(true);
  });

  it('clamps the shifted channels', () => {
    const out = colorBalanceMidtones([0.5, 0.5, 0.5], 1, 0, -1);
    expect(out[0]).toBe(1);
    expect(out[2]).toBe(0);
  });
});

describe('vibranceAdjust', () => {
  it('keeps neutral gray gray (zero chroma to boost)', () => {
    const out = vibranceAdjust([0.5, 0.5, 0.5], 1.5);
    expect(rgbNear(out, [0.5, 0.5, 0.5])).toBe(true);
  });

  it('boosts a muted color more than a saturated one', () => {
    const muted: RGB = [0.55, 0.45, 0.5];
    const vivid: RGB = [0.9, 0.1, 0.5];
    const mutedGain =
      (vibranceAdjust(muted, 1)[0] - vibranceAdjust(muted, 1)[1]) / (muted[0] - muted[1]);
    const vividGain =
      (vibranceAdjust(vivid, 1)[0] - vibranceAdjust(vivid, 1)[1]) / (vivid[0] - vivid[1]);
    expect(mutedGain).toBeGreaterThan(vividGain);
  });

  it('negative intensity desaturates saturated colors harder (sign flip)', () => {
    // f = 1 + i·(1 − sign(i)·sat): at i=−0.5, sat=0.8 → f = 1 − 0.5·1.8 = 0.1
    const c: RGB = [0.9, 0.1, 0.5];
    const out = vibranceAdjust(c, -0.5);
    const l = 0.072186 * 0.9 + 0.715158 * 0.1 + 0.212656 * 0.5;
    expect(near(out[0], l + (c[0] - l) * 0.1)).toBe(true);
  });

  it('is identity at zero intensity', () => {
    const c: RGB = [0.3, 0.6, 0.2];
    expect(rgbNear(vibranceAdjust(c, 0), c)).toBe(true);
  });
});

describe('lumetriAdjust', () => {
  it('is identity at neutral parameters', () => {
    const c: RGB = [0.25, 0.5, 0.75];
    const out = lumetriAdjust(c, {
      exposure: 0, contrast: 1, saturation: 1, temperature: 0, tint: 0, vibrance: 0,
    });
    expect(rgbNear(out, c)).toBe(true);
  });

  it('clamps between stages like the 8-bit filter chain', () => {
    // exposure +2 pushes 0.5 → 2.0, clamped to 1.0 BEFORE contrast pulls it
    // back toward 0.5 — an unclamped pipeline would land elsewhere.
    const out = lumetriAdjust([0.5, 0.5, 0.5], {
      exposure: 2, contrast: 0.5, saturation: 1, temperature: 0, tint: 0, vibrance: 0,
    });
    expect(rgbNear(out, [0.75, 0.75, 0.75])).toBe(true);
  });

  it('temperature warms mid-gray: +red, −blue under the 0.7 midtone weight', () => {
    const out = lumetriAdjust([0.5, 0.5, 0.5], {
      exposure: 0, contrast: 1, saturation: 1, temperature: 20, tint: 0, vibrance: 0,
    });
    expect(near(out[0], 0.5 + 0.2 * 0.7)).toBe(true);
    expect(near(out[1], 0.5)).toBe(true);
    expect(near(out[2], 0.5 - 0.2 * 0.7)).toBe(true);
  });
});

describe('blendChannel', () => {
  it('matches the vf_blend equations', () => {
    expect(blendChannel('multiply', 0.5, 0.5)).toBeCloseTo(0.25);
    expect(blendChannel('screen', 0.5, 0.5)).toBeCloseTo(0.75);
    expect(blendChannel('lighten', 0.3, 0.6)).toBe(0.6);
    expect(blendChannel('darken', 0.3, 0.6)).toBe(0.3);
    expect(blendChannel('addition', 0.7, 0.6)).toBe(1);
    expect(blendChannel('difference', 0.3, 0.8)).toBeCloseTo(0.5);
    expect(blendChannel('normal', 0.3, 0.8)).toBe(0.8);
  });

  it('overlay conditions on the backdrop', () => {
    expect(blendChannel('overlay', 0.25, 0.5)).toBeCloseTo(2 * 0.25 * 0.5);
    expect(blendChannel('overlay', 0.75, 0.5)).toBeCloseTo(1 - 2 * 0.25 * 0.5);
  });
});
