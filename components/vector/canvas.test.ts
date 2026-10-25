import { describe, expect, it } from 'vitest';

import { blankDoc } from '@/lib/vector/projects';
import { fitView, zoomAt } from './canvas';

describe('canvas view maths', () => {
  it('fits and centres the artboard', () => {
    const v = fitView(blankDoc(), 1112, 712, 100);
    expect(v.zoom).toBe(1);
    expect(v.panX).toBe(300);
    expect(v.panY).toBe(100);
  });

  it('zooms about a screen point', () => {
    const v = zoomAt({ zoom: 1, panX: 0, panY: 0 }, 2, { x: 100, y: 50 });
    expect(v).toEqual({ zoom: 2, panX: -100, panY: -50 });
    // The document point under the cursor stays put.
    expect((100 - v.panX) / v.zoom).toBe(100);
  });

  it('clamps zoom', () => {
    expect(zoomAt({ zoom: 1, panX: 0, panY: 0 }, 1e6, { x: 0, y: 0 }).zoom).toBe(64);
    expect(zoomAt({ zoom: 1, panX: 0, panY: 0 }, 1e-6, { x: 0, y: 0 }).zoom).toBe(0.05);
  });
});
