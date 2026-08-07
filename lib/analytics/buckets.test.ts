import { describe, expect, it } from 'vitest';

import {
  batchBucket,
  countBucket,
  cueCountBucket,
  droppedFrameRatioBucket,
  fileSizeBucket,
  fpsBucket,
  latencyMsBucket,
  ratioBucket,
  sessionSecondsBucket,
  timelineDurationBucket,
  ttiMsBucket,
} from './buckets';

describe('countBucket', () => {
  it('covers every boundary', () => {
    expect(countBucket(0)).toBe('0');
    expect(countBucket(-3)).toBe('0');
    expect(countBucket(1)).toBe('1-10');
    expect(countBucket(10)).toBe('1-10');
    expect(countBucket(11)).toBe('11-50');
    expect(countBucket(50)).toBe('11-50');
    expect(countBucket(51)).toBe('51-200');
    expect(countBucket(200)).toBe('51-200');
    expect(countBucket(201)).toBe('200+');
  });

  it('is the cue-count bucket (caption continuity)', () => {
    expect(cueCountBucket).toBe(countBucket);
  });
});

describe('batchBucket', () => {
  it('covers every boundary', () => {
    expect(batchBucket(1)).toBe('1');
    expect(batchBucket(0)).toBe('1');
    expect(batchBucket(2)).toBe('2-5');
    expect(batchBucket(5)).toBe('2-5');
    expect(batchBucket(6)).toBe('6-20');
    expect(batchBucket(20)).toBe('6-20');
    expect(batchBucket(21)).toBe('20+');
  });
});

describe('fileSizeBucket', () => {
  const MB = 1024 * 1024;
  it('covers every boundary', () => {
    expect(fileSizeBucket(0)).toBe('<10mb');
    expect(fileSizeBucket(10 * MB - 1)).toBe('<10mb');
    expect(fileSizeBucket(10 * MB)).toBe('10-100mb');
    expect(fileSizeBucket(100 * MB)).toBe('100mb-1gb');
    expect(fileSizeBucket(1024 * MB)).toBe('1gb+');
  });
});

describe('timelineDurationBucket', () => {
  it('covers every boundary', () => {
    expect(timelineDurationBucket(0)).toBe('0');
    expect(timelineDurationBucket(29)).toBe('<30s');
    expect(timelineDurationBucket(30)).toBe('30s-2m');
    expect(timelineDurationBucket(120)).toBe('2m-10m');
    expect(timelineDurationBucket(600)).toBe('10m-30m');
    expect(timelineDurationBucket(1800)).toBe('30m+');
  });
});

describe('sessionSecondsBucket', () => {
  it('covers every boundary', () => {
    expect(sessionSecondsBucket(0)).toBe('<1m');
    expect(sessionSecondsBucket(60)).toBe('1-5m');
    expect(sessionSecondsBucket(300)).toBe('5-15m');
    expect(sessionSecondsBucket(900)).toBe('15-45m');
    expect(sessionSecondsBucket(2700)).toBe('45m+');
  });
});

describe('ratioBucket', () => {
  it('covers every boundary and guards junk', () => {
    expect(ratioBucket(0.1)).toBe('<0.25x');
    expect(ratioBucket(0.25)).toBe('0.25-0.5x');
    expect(ratioBucket(0.5)).toBe('0.5-1x');
    expect(ratioBucket(1)).toBe('1-2x');
    expect(ratioBucket(2)).toBe('2-4x');
    expect(ratioBucket(4)).toBe('4x+');
    expect(ratioBucket(Number.NaN)).toBe('unknown');
    expect(ratioBucket(Number.POSITIVE_INFINITY)).toBe('unknown');
    expect(ratioBucket(-1)).toBe('unknown');
  });
});

describe('latencyMsBucket', () => {
  it('covers every boundary', () => {
    expect(latencyMsBucket(0)).toBe('<50ms');
    expect(latencyMsBucket(50)).toBe('50-200ms');
    expect(latencyMsBucket(200)).toBe('200-500ms');
    expect(latencyMsBucket(500)).toBe('500ms-1s');
    expect(latencyMsBucket(1000)).toBe('1s+');
  });
});

describe('ttiMsBucket', () => {
  it('covers every boundary', () => {
    expect(ttiMsBucket(999)).toBe('<1s');
    expect(ttiMsBucket(1000)).toBe('1-2.5s');
    expect(ttiMsBucket(2500)).toBe('2.5-5s');
    expect(ttiMsBucket(5000)).toBe('5-10s');
    expect(ttiMsBucket(10_000)).toBe('10s+');
  });
});

describe('fpsBucket', () => {
  it('covers every boundary', () => {
    expect(fpsBucket(10)).toBe('<15');
    expect(fpsBucket(15)).toBe('15-30');
    expect(fpsBucket(30)).toBe('30-45');
    expect(fpsBucket(45)).toBe('45-55');
    expect(fpsBucket(55)).toBe('55+');
  });
});

describe('droppedFrameRatioBucket', () => {
  it('covers every boundary', () => {
    expect(droppedFrameRatioBucket(0)).toBe('0');
    expect(droppedFrameRatioBucket(0.005)).toBe('<1%');
    expect(droppedFrameRatioBucket(0.01)).toBe('1-5%');
    expect(droppedFrameRatioBucket(0.05)).toBe('5-15%');
    expect(droppedFrameRatioBucket(0.15)).toBe('15%+');
  });
});
