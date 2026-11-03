import { describe, expect, it } from 'vitest';

import { planGeometry } from '@/lib/photo/colorMath';
import { newPhotoDoc, parsePhotoDoc, type PhotoDoc } from '@/lib/photo/photoTypes';
import { KeyedCache, hashString, maskCacheKey, nextMaskView, packAlphaTexture, packGeometry, packMaskComponent, planPasses, viewedMaskKey } from './maskPlan';

const doc = (over: Record<string, unknown>): PhotoDoc => {
  const r = parsePhotoDoc({ version: 1, source: { width: 100, height: 80 }, ...over });
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};
const MASK = { components: [{ kind: 'radial', rx: 0.2, ry: 0.2 }], feather: 3 };

describe('pass planning (geometry -> mask -> adjust)', () => {
  it('orders geometry, then each distinct mask once, then the adjustments in stack order', () => {
    const d = doc({
      geometry: { rotate: 10 },
      masks: { m: MASK },
      layers: [
        { id: 'a', type: 'exposure', mask: { ref: 'm' } },
        { id: 'b', type: 'tone', mask: { ref: 'm' } },
        { id: 'c', type: 'invert' },
      ],
    });
    const kinds = planPasses(d).map((p) => p.kind);
    expect(kinds).toEqual(['geometry', 'mask', 'adjust', 'adjust', 'adjust']);
    const adjust = planPasses(d).filter((p) => p.kind === 'adjust');
    expect(adjust.map((p) => (p.kind === 'adjust' ? p.layer.id : ''))).toEqual(['a', 'b', 'c']);
    expect(adjust.map((p) => (p.kind === 'adjust' ? p.maskKey !== null : false))).toEqual([true, true, false]);
  });
  it('identity geometry plans no geometry pass; empty masks and disabled layers plan nothing', () => {
    const d = doc({ layers: [{ id: 'a', type: 'exposure', mask: { components: [] } }, { id: 'b', type: 'invert', enabled: false, mask: MASK }] });
    expect(planPasses(d).map((p) => p.kind)).toEqual(['adjust']);
  });
});

describe('mask cache keys', () => {
  it('an adjustment change keeps the mask key; a component change changes it', () => {
    const a = doc({ layers: [{ id: 'a', type: 'exposure', params: { ev: 0.5 }, mask: MASK }] });
    const b = doc({ layers: [{ id: 'a', type: 'exposure', params: { ev: 1.5 }, mask: MASK }] });
    const c = doc({ layers: [{ id: 'a', type: 'exposure', params: { ev: 1.5 }, mask: { ...MASK, components: [{ kind: 'radial', rx: 0.25, ry: 0.2 }] } }] });
    const key = (d: PhotoDoc) => planPasses(d).find((p) => p.kind === 'mask')!.kind === 'mask' ? (planPasses(d).find((p) => p.kind === 'mask') as { key: string }).key : '';
    expect(key(a)).toBe(key(b));
    expect(key(a)).not.toBe(key(c));
  });
  it('geometry and source id are part of the key', () => {
    const d = doc({ layers: [{ id: 'a', type: 'exposure', mask: MASK }] });
    const m = d.layers[0].mask as never;
    const g2 = doc({ geometry: { rotate: 5 } }).geometry;
    expect(maskCacheKey(m, d.geometry, 's')).not.toBe(maskCacheKey(m, g2, 's'));
    expect(maskCacheKey(m, d.geometry, 's')).not.toBe(maskCacheKey(m, d.geometry, 't'));
    expect(hashString('x')).toBe(hashString('x'));
  });
  it('KeyedCache recomputes only on a miss and evicts the oldest', () => {
    const evicted: number[] = [];
    const c = new KeyedCache<number>(2, (v) => evicted.push(v));
    c.get('a', () => 1);
    c.get('a', () => 99);
    c.get('b', () => 2);
    c.get('c', () => 3);
    expect(c.computes).toBe(3);
    expect(evicted).toEqual([1]);
    expect(c.has('a')).toBe(false);
  });
  it('viewedMaskKey resolves the selected layer mask through refs', () => {
    const d = doc({ masks: { m: MASK }, layers: [{ id: 'a', type: 'exposure', mask: { ref: 'm' } }] });
    expect(viewedMaskKey(d, 'a')?.key).toBeTruthy();
    expect(viewedMaskKey(d, null)).toBeNull();
    expect(viewedMaskKey(newPhotoDoc(1, 1), 'a')).toBeNull();
  });
});

describe('alpha texture packing and uniform packing', () => {
  it('packs RGBA bytes to alpha bytes, and AlphaImage as is', () => {
    const p = packAlphaTexture({ width: 2, height: 1, rgba: [9, 9, 9, 10, 1, 1, 1, 250] });
    expect(Array.from(p.data)).toEqual([10, 250]);
    expect(p.data.length).toBe(p.width * p.height);
    expect(Array.from(packAlphaTexture({ width: 1, height: 2, alpha: [5, 6] }).data)).toEqual([5, 6]);
  });
  it('packs components', () => {
    const m = doc({ layers: [{ id: 'a', type: 'invert', mask: { components: [{ kind: 'gradient', mode: 'subtract', from: { x: 0.1, y: 0.2 }, to: { x: 0.3, y: 0.4 }, feather: 0.5 }, { kind: 'radial', rotate: 90 }, { kind: 'colorRange', colors: [{ r: 255, g: 255, b: 255 }], fuzziness: 50 }, { kind: 'subject', maskRef: 'masks/s.png', invert: true }] } }] }).layers[0].mask as { components: Parameters<typeof packMaskComponent>[0][] };
    const [g, r, cr, sub] = m.components.map(packMaskComponent);
    expect(g.define).toBe('T_MGRADIENT');
    expect(g.mode).toBe(1);
    expect(g.m0).toEqual([0.1, 0.2, 0.3, 0.4]);
    expect(r.m1[0]).toBe(0);
    expect(r.m1[1]).toBe(1);
    expect(cr.m0.slice(0, 2)).toEqual([30, 1]);
    expect(cr.lab[0]).toBeCloseTo(100, 1);
    expect(sub.alpha).toEqual({ kind: 'subject', maskRef: 'masks/s.png' });
    expect(sub.m0[0]).toBe(1);
  });
  it('packs geometry uniforms', () => {
    const g = doc({ geometry: { rotate: 90, flipH: true, fill: '#ff0000', crop: { x: 0, y: 0, width: 1, height: 0.5 } } }).geometry;
    const p = packGeometry(planGeometry(g, 100, 80));
    expect(p.size).toEqual({ width: 80, height: 50 });
    expect(p.g2).toEqual([0, 1, 1, 0]);
    expect(p.g5).toEqual([0, 2, 0, 0]);
    expect(p.fillColor).toEqual([1, 0, 0]);
  });
  it('cycles the mask view off -> overlay -> alpha -> off', () => {
    expect(nextMaskView(nextMaskView(nextMaskView('off')))).toBe('off');
    expect(nextMaskView('off')).toBe('overlay');
  });
});
