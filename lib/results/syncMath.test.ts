import { describe, expect, it } from 'vitest';
import { DRIFT_THRESHOLD_MS, frameStep, needsCorrection } from './syncMath';

describe('needsCorrection', () => {
  it('uses 80 ms by default', () => expect(DRIFT_THRESHOLD_MS).toBe(80));
  it('is false at exactly 80 ms and true just past it', () => {
    expect(needsCorrection(1.0, 1.08, 80)).toBe(false);
    expect(needsCorrection(1.08, 1.0, 80)).toBe(false);
    expect(needsCorrection(1.0, 1.081, 80)).toBe(true);
    expect(needsCorrection(0, 0.08)).toBe(false);
    expect(needsCorrection(0, 0.0801)).toBe(true);
  });
  it('ignores non-finite positions', () => {
    expect(needsCorrection(Number.NaN, 1)).toBe(false);
    expect(needsCorrection(1, Infinity)).toBe(false);
  });
});

describe('frameStep', () => {
  it('steps by 1/fps', () => {
    expect(frameStep(30, 1, 1)).toBeCloseTo(1 + 1 / 30);
    expect(frameStep(25, 1, -1)).toBeCloseTo(1 - 1 / 25);
  });
  it('clamps at 0 and at duration', () => {
    expect(frameStep(30, 0, -1, 10)).toBe(0);
    expect(frameStep(30, 10, 1, 10)).toBe(10);
    expect(frameStep(30, 9.99, 1, 10)).toBe(10);
  });
  it('falls back to 30 fps for bad fps and tolerates unknown duration', () => {
    expect(frameStep(0, 1, 1)).toBeCloseTo(1 + 1 / 30);
    expect(frameStep(Number.NaN, 1, 1, Number.NaN)).toBeCloseTo(1 + 1 / 30);
  });
});
