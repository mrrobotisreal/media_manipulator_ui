import { describe, expect, it } from 'vitest';

import { classifyPhotoRoute, isJobId, isLikelyServerOnlyFormat, nameFromFile } from './projects';
import { clampZoom, fitView, MAX_ZOOM, pinch, toImage, zoomAt } from './view';

describe('photo route + view helpers', () => {
  it('classifies the route segment', () => {
    expect(classifyPhotoRoute('new')).toEqual({ kind: 'new' });
    expect(classifyPhotoRoute('local')).toEqual({ kind: 'local' });
    expect(classifyPhotoRoute('0b8c2f7e-1a2b-4c3d-8e9f-0123456789ab')).toEqual({ kind: 'server', id: '0b8c2f7e-1a2b-4c3d-8e9f-0123456789ab' });
    expect(classifyPhotoRoute('..%2Fx')).toEqual({ kind: 'invalid' });
    expect(classifyPhotoRoute('NEW')).toEqual({ kind: 'invalid' });
  });
  it('validates job ids and names', () => {
    expect(isJobId('abc123_-XYZ')).toBe(true);
    expect(isJobId('../x')).toBe(false);
    expect(isJobId(null)).toBe(false);
    expect(nameFromFile('Holiday.2026.JPG', 'x')).toBe('Holiday.2026');
    expect(nameFromFile('.jpg', 'Untitled')).toBe('Untitled');
    expect(isLikelyServerOnlyFormat({ type: 'image/heic', name: 'a' })).toBe(true);
    expect(isLikelyServerOnlyFormat({ type: '', name: 'scan.TIF' })).toBe(true);
    expect(isLikelyServerOnlyFormat({ type: 'image/jpeg', name: 'a.jpg' })).toBe(false);
  });
  it('fits, zooms around the cursor and maps points back', () => {
    const v = fitView(1000, 800, 2000, 1000, 0);
    expect(v.zoom).toBeCloseTo(0.5, 6);
    expect(v.y).toBeCloseTo(150, 6);
    const z = zoomAt(v, 500, 400, 2);
    expect(z.zoom).toBeCloseTo(1, 6);
    // the image point under the cursor did not move
    const before = toImage(v, 500, 400, 2000, 1000);
    const after = toImage(z, 500, 400, 2000, 1000);
    expect(after.ix).toBeCloseTo(before.ix, 6);
    expect(after.iy).toBeCloseTo(before.iy, 6);
    expect(toImage(v, 0, 0, 2000, 1000).inside).toBe(false);
    expect(clampZoom(1e6)).toBe(MAX_ZOOM);
    expect(fitView(1000, 800, 100, 100, 0, true).zoom).toBe(1);
    expect(pinch({ x: 0, y: 0 }, { x: 6, y: 8 })).toEqual({ dist: 10, cx: 3, cy: 4 });
  });
});
