import { describe, expect, it } from 'vitest';

import {
  vectorBytesBucket,
  vectorDurationBucket,
  vectorFpsBucket,
  vectorHeightBucket,
  vectorMsBucket,
  vectorRevisionBucket,
} from './buckets';

// MM49: the Motion bucket vocabularies. The analytics rollups list the ms and
// bytes buckets in exactly this ascending order (internal/rollup/vector.go
// VectorMsBuckets / VectorBytesBuckets); a boundary change here must change
// there and in docs/EVENT_CATALOG.md in the same release.
describe('Motion buckets (MM49)', () => {
  it.each([
    [0, '0'],
    [-5, '0'],
    [NaN, '0'],
    [999, '<1s'],
    [1000, '1-5s'],
    [5000, '1-5s'],
    [10000, '5-10s'],
    [15000, '10-30s'],
    [60000, '30-60s'],
    [60001, '60s+'],
  ])('vectorDurationBucket(%s) = %s', (ms, want) => expect(vectorDurationBucket(ms)).toBe(want));

  it.each([
    [0, '0'],
    [480, '<=480'],
    [720, '<=720'],
    [1080, '<=1080'],
    [1440, '<=1440'],
    [2160, '<=2160'],
    [2161, '>2160'],
  ])('vectorHeightBucket(%s) = %s', (px, want) => expect(vectorHeightBucket(px)).toBe(want));

  it.each([
    [0, '0'],
    [12, '<=12'],
    [24, '<=24'],
    [30, '<=30'],
    [60, '<=60'],
    [61, '>60'],
  ])('vectorFpsBucket(%s) = %s', (fps, want) => expect(vectorFpsBucket(fps)).toBe(want));

  it('vectorBytesBucket and vectorMsBucket keep the rollup order', () => {
    const bytes = [0, 10 * 1024, 100 * 1024, 1024 * 1024, 10 * 1024 * 1024, 100 * 1024 * 1024].map(vectorBytesBucket);
    expect(bytes).toEqual(['<10kb', '10-100kb', '100kb-1mb', '1-10mb', '10-100mb', '100mb+']);
    const ms = [0, 100, 1000, 5000, 30000, 120000].map(vectorMsBucket);
    expect(ms).toEqual(['<100ms', '100ms-1s', '1-5s', '5-30s', '30s-2m', '2m+']);
  });

  it.each([
    [1, '1'],
    [2, '2-5'],
    [20, '6-20'],
    [100, '21-100'],
    [101, '100+'],
  ])('vectorRevisionBucket(%s) = %s', (r, want) => expect(vectorRevisionBucket(r)).toBe(want));
});
