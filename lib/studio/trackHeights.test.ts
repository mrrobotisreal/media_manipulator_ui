import { describe, expect, it } from 'vitest';
import { DEFAULT_TRACK_HEIGHT, MAX_TRACK_HEIGHT, MIN_TRACK_HEIGHT, clampTrackHeight, parseTrackHeights } from './trackHeights';

describe('trackHeights', () => {
  it('clamps', () => {
    expect(clampTrackHeight(5)).toBe(MIN_TRACK_HEIGHT);
    expect(clampTrackHeight(999)).toBe(MAX_TRACK_HEIGHT);
    expect(clampTrackHeight(NaN)).toBe(DEFAULT_TRACK_HEIGHT);
  });
  it('parses defensively', () => {
    expect(parseTrackHeights(null)).toEqual({});
    expect(parseTrackHeights('{not json')).toEqual({});
    expect(parseTrackHeights('[1]')).toEqual({});
    expect(parseTrackHeights('{"a":80,"b":"x","c":1000}')).toEqual({ a: 80, c: MAX_TRACK_HEIGHT });
  });
});
