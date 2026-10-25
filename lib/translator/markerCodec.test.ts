import { describe, expect, it } from 'vitest';

import {
  MARKER_LENGTH,
  MAX_MARKER_INDEX,
  ZWJ,
  ZWNJ,
  appendMarker,
  decodeIndex,
  encodeIndex,
  findMarkers,
  hasMarker,
  stripMarkers,
} from './markerCodec';

const ZW_RE = /[‌‍]/;

describe('marker codec', () => {
  it('uses only U+200C/U+200D, a fixed width that is a multiple of 9, and starts/ends non-joining', () => {
    const m = encodeIndex(123456);
    expect(m.length).toBe(MARKER_LENGTH);
    expect(MARKER_LENGTH % 9).toBe(0);
    expect([...m].every((c) => c === ZWJ || c === ZWNJ)).toBe(true);
    // Never join-causing at either edge (RTL shaping, see the file comment).
    expect(m[0]).toBe(ZWNJ);
    expect(m[m.length - 1]).toBe(ZWNJ);
  });

  it('round-trips 0..4095, powers of two and the 40-bit maximum', () => {
    const samples = [...Array.from({ length: 4096 }, (_, i) => i)];
    for (let b = 0; b <= 40; b++) samples.push(Math.min(2 ** b, MAX_MARKER_INDEX), 2 ** b - 1);
    samples.push(MAX_MARKER_INDEX, 16 * 2 ** 32 + 0xdeadbeef, 255 * 2 ** 32 + 0xffffffff);
    for (const i of samples) expect(decodeIndex(encodeIndex(i))).toBe(i);
  });

  it('round-trips a pseudo-random sweep of the whole registry range', () => {
    let x = 0x2545f491;
    for (let n = 0; n < 5000; n++) {
      x = (Math.imul(x, 1103515245) + 12345) >>> 0;
      const i = Math.floor((x / 2 ** 32) * MAX_MARKER_INDEX);
      expect(decodeIndex(encodeIndex(i))).toBe(i);
    }
  });

  it('rejects out-of-range indexes and malformed markers', () => {
    expect(() => encodeIndex(-1)).toThrow(RangeError);
    expect(() => encodeIndex(MAX_MARKER_INDEX + 1)).toThrow(RangeError);
    expect(() => encodeIndex(1.5)).toThrow(RangeError);
    const m = encodeIndex(42);
    expect(decodeIndex(m.slice(1))).toBeNull();
    expect(decodeIndex(m + ZWNJ)).toBeNull();
    expect(decodeIndex(ZWJ + m.slice(1))).toBeNull();
  });

  it.each([
    ['English', 'Compress image'],
    ['Hebrew (RTL)', 'דחיסת תמונה'],
    ['Arabic (RTL, final letter shapes)', 'ضغط الصورة'],
    ['Arabic ending in a dual-joining letter', 'مرحبا بكم في المحرر'],
    ['Hindi (conjuncts use ZWJ/ZWNJ natively)', 'क्‍ष और क्‌ष फ़ाइल संपीड़ित करें'],
    ['Persian ZWNJ inside a word', 'می‌خواهم'],
    ['Japanese', '画像を圧縮'],
    ['Chinese (Traditional)', '壓縮圖片'],
    ['Korean', '이미지 압축'],
    ['Emoji ZWJ sequence', 'Family 👨‍👩‍👧‍👦 and flags 🇺🇦🏳️‍🌈'],
    ['Empty interpolation edge', ' '],
  ])('%s survives append + strip unchanged', (_label, text) => {
    const marked = appendMarker(text, 987654321);
    expect(marked.startsWith(text)).toBe(true);
    expect(stripMarkers(marked)).toBe(text);
    expect(findMarkers(marked).map((f) => f.index)).toEqual([987654321]);
    // The text's own joiners are not mistaken for a marker.
    expect(hasMarker(text)).toBe(false);
    expect(stripMarkers(text)).toBe(text);
  });

  it('separates two adjacent translations in one text node', () => {
    const joined = appendMarker('Hello', 7) + appendMarker('world', 2 ** 33 + 9);
    expect(findMarkers(joined).map((f) => f.index)).toEqual([7, 2 ** 33 + 9]);
    expect(stripMarkers(joined)).toBe('Helloworld');
    const spaced = `${appendMarker('A', 1)} ${appendMarker('B', 2)}`;
    expect(stripMarkers(spaced)).toBe('A B');
    // Two markers back to back with no text between (an empty-looking string).
    const tight = encodeIndex(3) + encodeIndex(4);
    expect(findMarkers(tight).map((f) => f.index)).toEqual([3, 4]);
    expect(stripMarkers(tight)).toBe('');
  });

  it('strips inner markers of nested translations so the outer string carries exactly one', () => {
    const inner = appendMarker('Premium', 11);
    const outer = appendMarker(`Upgrade to ${inner} today`, 12);
    expect(findMarkers(outer).map((f) => f.index)).toEqual([12]);
    expect(stripMarkers(outer)).toBe('Upgrade to Premium today');
  });

  it('ignores joiner runs that are not markers, including near-misses', () => {
    const noise = ZWJ.repeat(8) + ZWNJ + 'x' + ZWNJ.repeat(63) + ZWJ.repeat(200);
    expect(findMarkers(noise)).toEqual([]);
    expect(stripMarkers(noise)).toBe(noise);
    const m = encodeIndex(5);
    // A marker glued to genuine joiners on both sides is still found exactly.
    const glued = 'क' + ZWJ + m + ZWJ + 'ष';
    expect(findMarkers(glued).map((f) => f.index)).toEqual([5]);
    expect(stripMarkers(glued)).toBe('क' + ZWJ + ZWJ + 'ष');
  });

  it('is invisible: the marker contains no visible or bidi-strong characters', () => {
    const marked = appendMarker('abc', 99);
    expect(marked.replace(/[‌‍]/g, '')).toBe('abc');
    expect(ZW_RE.test(stripMarkers(marked))).toBe(false);
  });
});
