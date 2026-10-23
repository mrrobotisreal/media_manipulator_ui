import { describe, expect, it } from 'vitest';
import { computePeaks, decodePeaks, MAX_PEAK_SECONDS } from './peaks';

describe('computePeaks', () => {
  it('takes the max absolute value per bucket', () => {
    const data = new Float32Array([0.1, -0.5, 0.2, 0.3, -0.9, 0.0, 0.4, 0.2]);
    expect(computePeaks([data], 4)).toEqual([0.5, 0.3, 0.9, 0.4].map((v) => Math.fround(v)));
  });

  it('mixes channels by loudest sample and clamps to 1', () => {
    const left = new Float32Array([0.1, 0.1]);
    const right = new Float32Array([0.7, 2]);
    expect(computePeaks([left, right], 2)).toEqual([Math.fround(0.7), 1]);
  });

  it('handles empty input and more buckets than samples', () => {
    expect(computePeaks([], 4)).toEqual([]);
    expect(computePeaks([new Float32Array(0)], 3)).toEqual([0, 0, 0]);
    expect(computePeaks([new Float32Array([0.5])], 3)).toHaveLength(3);
  });
});

describe('decodePeaks', () => {
  it('skips audio longer than the cap without fetching', async () => {
    expect(await decodePeaks('blob:x', 10, MAX_PEAK_SECONDS + 1)).toBeNull();
  });

  it('returns null silently when Web Audio is missing', async () => {
    expect(await decodePeaks('blob:x', 10, 5)).toBeNull();
  });
});
