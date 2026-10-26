/**
 * MM47 GIF encoder tests. An independent minimal GIF decoder (written here from
 * the GIF89a spec) proves the writer's structure and the LZW round trip.
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';

import {
  createGifWriter,
  createPaletteBuilder,
  indexFrame,
  lzwEncode,
  minCodeSizeFor,
  type GifPalette,
} from '@/lib/vector/raster/gifEncoder';

interface DecodedFrame {
  delay: number;
  disposal: number;
  transparent: boolean;
  transparentIndex: number;
  width: number;
  height: number;
  indices: Uint8Array;
  blockLengths: number[];
  terminated: boolean;
  clears: number;
}
interface Decoded {
  signature: string;
  width: number;
  height: number;
  gct: Uint8Array;
  netscape: { present: boolean; count: number };
  frames: DecodedFrame[];
  trailer: boolean;
}

function concat(parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

function lzwDecode(data: Uint8Array, minCode: number, count: number): { out: Uint8Array; clears: number } {
  const clear = 1 << minCode;
  const eoi = clear + 1;
  const out = new Uint8Array(count);
  let outLen = 0;
  let clears = 0;
  let size = minCode + 1;
  let prefix: number[] = [];
  let suffix: number[] = [];
  let next = eoi + 1;
  let prev = -1;
  let bitPos = 0;
  const expand = (code: number): number[] => {
    const seq: number[] = [];
    let c = code;
    while (c >= clear + 2) {
      seq.push(suffix[c]);
      c = prefix[c];
    }
    seq.push(c);
    return seq.reverse();
  };
  while (bitPos + size <= data.length * 8) {
    let code = 0;
    for (let i = 0; i < size; i++) {
      const bit = (data[(bitPos + i) >> 3] >> ((bitPos + i) & 7)) & 1;
      code |= bit << i;
    }
    bitPos += size;
    if (code === clear) {
      clears++;
      size = minCode + 1;
      next = eoi + 1;
      prefix = [];
      suffix = [];
      prev = -1;
      continue;
    }
    if (code === eoi) break;
    let seq: number[];
    if (prev === -1) {
      seq = [code];
    } else if (code < next) {
      seq = expand(code);
      prefix[next] = prev;
      suffix[next] = seq[0];
      next++;
    } else {
      const p = expand(prev);
      seq = [...p, p[0]];
      prefix[next] = prev;
      suffix[next] = p[0];
      next++;
    }
    for (const v of seq) if (outLen < count) out[outLen++] = v;
    prev = code;
    if (next === 1 << size && size < 12) size++;
  }
  return { out, clears };
}

function decodeGif(bytes: Uint8Array): Decoded {
  let p = 0;
  const signature = String.fromCharCode(...bytes.subarray(0, 6));
  p = 6;
  const width = bytes[p] | (bytes[p + 1] << 8);
  const height = bytes[p + 2] | (bytes[p + 3] << 8);
  const packed = bytes[p + 4];
  p += 7;
  let gct = new Uint8Array(0);
  if (packed & 0x80) {
    const n = 2 << (packed & 7);
    gct = bytes.slice(p, p + n * 3);
    p += n * 3;
  }
  const netscape = { present: false, count: 0 };
  const frames: DecodedFrame[] = [];
  let gce = { delay: 0, disposal: 0, transparent: false, transparentIndex: 0 };
  let trailer = false;
  while (p < bytes.length) {
    const b = bytes[p++];
    if (b === 0x3b) {
      trailer = true;
      break;
    }
    if (b === 0x21) {
      const label = bytes[p++];
      const blocks: Uint8Array[] = [];
      for (let len = bytes[p++]; len > 0; len = bytes[p++]) {
        blocks.push(bytes.slice(p, p + len));
        p += len;
      }
      if (label === 0xf9) {
        const d = blocks[0];
        gce = {
          disposal: (d[0] >> 2) & 7,
          transparent: (d[0] & 1) === 1,
          delay: d[1] | (d[2] << 8),
          transparentIndex: d[3],
        };
      } else if (label === 0xff && String.fromCharCode(...blocks[0]) === 'NETSCAPE2.0') {
        netscape.present = true;
        netscape.count = blocks[1][1] | (blocks[1][2] << 8);
      }
    } else if (b === 0x2c) {
      const w = bytes[p + 4] | (bytes[p + 5] << 8);
      const h = bytes[p + 6] | (bytes[p + 7] << 8);
      const ipacked = bytes[p + 8];
      p += 9;
      if (ipacked & 0x80) p += (2 << (ipacked & 7)) * 3;
      const minCode = bytes[p++];
      const data: number[] = [];
      const blockLengths: number[] = [];
      let terminated = false;
      for (;;) {
        const len = bytes[p++];
        if (len === 0) {
          terminated = true;
          break;
        }
        blockLengths.push(len);
        for (let i = 0; i < len; i++) data.push(bytes[p + i]);
        p += len;
      }
      const dec = lzwDecode(Uint8Array.from(data), minCode, w * h);
      frames.push({ ...gce, width: w, height: h, indices: dec.out, blockLengths, terminated, clears: dec.clears });
    } else {
      throw new Error(`unexpected block 0x${b.toString(16)}`);
    }
  }
  return { signature, width, height, gct, netscape, frames, trailer };
}

function makePalette(size: number, transparentIndex = -1): GifPalette {
  const colors = new Uint8Array(size * 3);
  for (let i = 0; i < size; i++) {
    colors[i * 3] = (i * 37) & 255;
    colors[i * 3 + 1] = (i * 91) & 255;
    colors[i * 3 + 2] = (i * 7) & 255;
  }
  return { colors, size, transparentIndex };
}

function prng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s >>> 8;
  };
}

function write(palette: GifPalette, frames: Uint8Array[], w: number, h: number, loop: number | null, delay = 7) {
  const gw = createGifWriter({ width: w, height: h, palette, loop });
  for (const f of frames) gw.writeFrame(f, { delayCs: delay });
  const parts = gw.finish();
  return { bytes: concat(parts), gw };
}

function rgbaOf(pixels: Array<[number, number, number, number]>): Uint8Array {
  return Uint8Array.from(pixels.flat());
}

describe('gif container', () => {
  it('writes header, logical screen, global colour table and trailer', () => {
    const palette = makePalette(16);
    const { bytes, gw } = write(palette, [new Uint8Array(12)], 4, 3, null);
    const d = decodeGif(bytes);
    expect(Array.from(bytes.subarray(0, 6))).toEqual([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);
    expect(d.signature).toBe('GIF89a');
    expect(bytes[bytes.length - 1]).toBe(0x3b);
    expect(d.trailer).toBe(true);
    expect([d.width, d.height]).toEqual([4, 3]);
    expect(d.gct.length).toBe(48);
    expect(Array.from(d.gct)).toEqual(Array.from(palette.colors));
    expect(gw.byteLength).toBe(bytes.length);
    expect(gw.frames).toBe(1);
  });

  it('writes N frames with delays, disposal and transparency flags', () => {
    const frames = [new Uint8Array(6), new Uint8Array(6).fill(1), new Uint8Array(6)];
    const opaque = decodeGif(write(makePalette(4), frames, 3, 2, null, 12).bytes);
    expect(opaque.frames).toHaveLength(3);
    for (const f of opaque.frames) {
      expect(f.delay).toBe(12);
      expect(f.disposal).toBe(1);
      expect(f.transparent).toBe(false);
    }
    const trans = decodeGif(write(makePalette(4, 0), frames, 3, 2, null, 5).bytes);
    expect(trans.frames).toHaveLength(3);
    for (const f of trans.frames) {
      expect(f.delay).toBe(5);
      expect(f.disposal).toBe(2);
      expect(f.transparent).toBe(true);
      expect(f.transparentIndex).toBe(0);
    }
  });

  it('writes the NETSCAPE2.0 loop extension only when requested', () => {
    const f = [new Uint8Array(4)];
    const forever = decodeGif(write(makePalette(2), f, 2, 2, 0).bytes);
    expect(forever.netscape).toEqual({ present: true, count: 0 });
    const three = decodeGif(write(makePalette(2), f, 2, 2, 3).bytes);
    expect(three.netscape).toEqual({ present: true, count: 3 });
    const none = decodeGif(write(makePalette(2), f, 2, 2, null).bytes);
    expect(none.netscape.present).toBe(false);
  });
});

describe('lzw round trip', () => {
  const roundTrip = (indices: Uint8Array, palette: GifPalette, w: number, h: number) => {
    const d = decodeGif(write(palette, [indices], w, h, null).bytes);
    expect(d.frames).toHaveLength(1);
    expect(Array.from(d.frames[0].indices)).toEqual(Array.from(indices));
    return d.frames[0];
  };

  it('tiny 3x2 frame, 2-colour palette (min code size 2)', () => {
    expect(minCodeSizeFor(2)).toBe(2);
    roundTrip(Uint8Array.from([0, 1, 1, 0, 1, 0]), makePalette(2), 3, 2);
  });

  it('64x64 gradient with 256 colours', () => {
    const idx = new Uint8Array(64 * 64);
    for (let i = 0; i < idx.length; i++) idx[i] = ((i % 64) * 4 + (i >> 6)) & 255;
    roundTrip(idx, makePalette(256), 64, 64);
  });

  it('large pseudo-random 300x300 frame emits mid-stream Clear codes', () => {
    const rnd = prng(12345);
    const idx = new Uint8Array(300 * 300);
    for (let i = 0; i < idx.length; i++) idx[i] = rnd() & 255;
    const f = roundTrip(idx, makePalette(256), 300, 300);
    expect(f.clears).toBeGreaterThan(1);
  });

  it('a run of one colour', () => {
    const idx = new Uint8Array(200 * 100).fill(3);
    const bytes = write(makePalette(4), [idx], 200, 100, null).bytes;
    roundTrip(idx, makePalette(4), 200, 100);
    expect(bytes.length).toBeLessThan(400);
  });

  it('sub-blocks are at most 255 bytes and end with a 0x00 terminator', () => {
    const rnd = prng(99);
    const idx = new Uint8Array(100 * 100);
    for (let i = 0; i < idx.length; i++) idx[i] = rnd() & 255;
    const f = roundTrip(idx, makePalette(256), 100, 100);
    expect(f.blockLengths.length).toBeGreaterThan(1);
    expect(Math.max(...f.blockLengths)).toBeLessThanOrEqual(255);
    expect(f.terminated).toBe(true);
    const raw = lzwEncode(idx, 8);
    expect(raw[0]).toBe(8);
    expect(raw[raw.length - 1]).toBe(0);
  });
});

describe('palette builder and indexing', () => {
  it('uses exact colours when they fit and maps pixels to them', () => {
    const red: [number, number, number, number] = [255, 0, 0, 255];
    const green: [number, number, number, number] = [0, 255, 0, 255];
    const blue: [number, number, number, number] = [0, 0, 255, 255];
    const rgba = rgbaOf([red, green, blue, red, red, blue]);
    const pb = createPaletteBuilder();
    pb.addSample(rgba);
    const pal = pb.build({ transparent: false });
    expect(pal.size).toBe(4);
    expect(pal.transparentIndex).toBe(-1);
    const entries = new Set<string>();
    for (let i = 0; i < 3; i++) entries.add(Array.from(pal.colors.subarray(i * 3, i * 3 + 3)).join(','));
    expect(entries).toEqual(new Set(['255,0,0', '0,255,0', '0,0,255']));
    const idx = indexFrame(rgba, 6, 1, pal, { dither: false });
    for (let i = 0; i < 6; i++) {
      expect(Array.from(pal.colors.subarray(idx[i] * 3, idx[i] * 3 + 3))).toEqual(Array.from(rgba.subarray(i * 4, i * 4 + 3)));
    }
  });

  it('reserves index 0 for transparency', () => {
    const rgba = rgbaOf([
      [10, 20, 30, 255],
      [200, 200, 200, 0],
      [10, 20, 30, 127],
      [90, 90, 90, 255],
    ]);
    const pb = createPaletteBuilder();
    pb.addSample(rgba);
    const pal = pb.build({ transparent: true });
    expect(pal.transparentIndex).toBe(0);
    expect(pal.size).toBe(4);
    const idx = indexFrame(rgba, 4, 1, pal);
    expect(Array.from(idx)).toEqual([expect.any(Number), 0, 0, expect.any(Number)]);
    expect(idx[0]).toBeGreaterThan(0);
    expect(idx[3]).toBeGreaterThan(0);
  });

  it('empty input gives a black palette', () => {
    const pal = createPaletteBuilder().build({ transparent: false });
    expect(pal.size).toBe(2);
    expect(Array.from(pal.colors)).toEqual([0, 0, 0, 0, 0, 0]);
    const t = createPaletteBuilder().build({ transparent: true });
    expect(t.size).toBe(2);
    expect(t.transparentIndex).toBe(0);
  });

  const manyColours = (): Uint8Array => {
    const rnd = prng(7);
    const rgba = new Uint8Array(200 * 200 * 4);
    for (let i = 0; i < rgba.length; i += 4) {
      rgba[i] = rnd() & 255;
      rgba[i + 1] = rnd() & 255;
      rgba[i + 2] = rnd() & 255;
      rgba[i + 3] = 255;
    }
    return rgba;
  };

  it('median cut with > 256 colours yields size 256 and valid indices', () => {
    const rgba = manyColours();
    const pb = createPaletteBuilder();
    pb.addSample(rgba);
    const pal = pb.build({ transparent: false });
    expect(pal.size).toBe(256);
    const idx = indexFrame(rgba, 200, 200, pal);
    expect(Math.max(...idx)).toBeLessThan(256);
  });

  it('is deterministic', () => {
    const run = () => {
      const rgba = manyColours();
      const pb = createPaletteBuilder();
      pb.addSample(rgba);
      const pal = pb.build({ transparent: true, maxColors: 64 });
      const idx = indexFrame(rgba, 200, 200, pal, { dither: true });
      return { pal, out: write(pal, [idx], 200, 200, 0).bytes };
    };
    const a = run();
    const b = run();
    expect(Array.from(a.pal.colors)).toEqual(Array.from(b.pal.colors));
    expect(Buffer.from(a.out).equals(Buffer.from(b.out))).toBe(true);
  });

  it('dither: indices stay in range, off is lossless on exact palettes, on changes gradients', () => {
    const w = 64;
    const h = 8;
    const grad = new Uint8Array(w * h * 4);
    for (let i = 0; i < w * h; i++) {
      const v = Math.round(((i % w) / (w - 1)) * 255);
      grad.set([v, v, v, 255], i * 4);
    }
    const pb = createPaletteBuilder();
    pb.addSample(grad);
    const small = pb.build({ maxColors: 4, transparent: false });
    expect(small.size).toBe(4);
    const off = indexFrame(grad, w, h, small, { dither: false });
    const on = indexFrame(grad, w, h, small, { dither: true });
    expect(Math.max(...off)).toBeLessThan(small.size);
    expect(Math.max(...on)).toBeLessThan(small.size);
    expect(Buffer.from(on).equals(Buffer.from(off))).toBe(false);

    const flat = rgbaOf([
      [1, 2, 3, 255],
      [4, 5, 6, 255],
      [1, 2, 3, 255],
    ]);
    const fb = createPaletteBuilder();
    fb.addSample(flat);
    const exact = fb.build({ transparent: false });
    const idx = indexFrame(flat, 3, 1, exact, { dither: false });
    expect(idx[0]).toBe(idx[2]);
    expect(idx[0]).not.toBe(idx[1]);
    expect(Array.from(exact.colors.subarray(idx[1] * 3, idx[1] * 3 + 3))).toEqual([4, 5, 6]);
  });

  it('minCodeSizeFor', () => {
    expect(minCodeSizeFor(2)).toBe(2);
    expect(minCodeSizeFor(4)).toBe(2);
    expect(minCodeSizeFor(16)).toBe(4);
    expect(minCodeSizeFor(256)).toBe(8);
  });
});
