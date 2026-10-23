import { describe, expect, it } from 'vitest';
import { clampWipe, clipPathForWipe, formatDelta, stepWipe, wipeFromPointer } from './compare';

describe('clampWipe', () => {
  it('clamps and maps NaN to 50', () => {
    expect(clampWipe(-5)).toBe(0);
    expect(clampWipe(105)).toBe(100);
    expect(clampWipe(33)).toBe(33);
    expect(clampWipe(Number.NaN)).toBe(50);
    expect(clampWipe(Infinity)).toBe(100);
    expect(clampWipe(-Infinity)).toBe(0);
  });
});

describe('stepWipe', () => {
  it.each([
    ['ArrowRight', false, 51],
    ['ArrowUp', false, 51],
    ['ArrowLeft', false, 49],
    ['ArrowDown', false, 49],
    ['ArrowRight', true, 60],
    ['ArrowLeft', true, 40],
    ['PageUp', false, 60],
    ['PageDown', false, 40],
    ['Home', false, 0],
    ['End', false, 100],
    ['a', false, 50],
  ])('%s shift=%s -> %d', (key, shift, expected) => {
    expect(stepWipe(50, key, shift)).toBe(expected);
  });
  it('stays within bounds and survives NaN', () => {
    expect(stepWipe(100, 'ArrowRight')).toBe(100);
    expect(stepWipe(0, 'PageDown')).toBe(0);
    expect(stepWipe(Number.NaN, 'ArrowRight')).toBe(51);
  });
});

describe('wipeFromPointer', () => {
  const rect = { left: 100, width: 200 };
  it('maps x to a percentage', () => {
    expect(wipeFromPointer(100, rect)).toBe(0);
    expect(wipeFromPointer(200, rect)).toBe(50);
    expect(wipeFromPointer(300, rect)).toBe(100);
    expect(wipeFromPointer(900, rect)).toBe(100);
    expect(wipeFromPointer(-50, rect)).toBe(0);
  });
  it('handles zero-width rects and non-finite input', () => {
    expect(wipeFromPointer(150, { left: 100, width: 0 })).toBe(50);
    expect(wipeFromPointer(Infinity, rect)).toBe(50);
    expect(wipeFromPointer(Number.NaN, rect)).toBe(50);
  });
});

describe('clipPathForWipe', () => {
  it('insets the right edge by the remainder', () => {
    expect(clipPathForWipe(0, 'ltr')).toBe('inset(0 100% 0 0)');
    expect(clipPathForWipe(50, 'ltr')).toBe('inset(0 50% 0 0)');
    expect(clipPathForWipe(100, 'ltr')).toBe('inset(0 0% 0 0)');
  });
});

describe('formatDelta', () => {
  it('formats signed percent change', () => {
    expect(formatDelta(1000, 380)).toBe('−62%');
    expect(formatDelta(1000, 1120)).toBe('+12%');
    expect(formatDelta(1000, 1000)).toBe('0%');
  });
  it('is null without a usable baseline', () => {
    expect(formatDelta(0, 10)).toBeNull();
    expect(formatDelta(undefined, 10)).toBeNull();
    expect(formatDelta(10, Number.NaN)).toBeNull();
  });
});
