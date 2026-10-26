/**
 * Motion raster exports, GIF encoder (ticket MM47 decision 2).
 *
 * A clean-room GIF89a encoder written from the GIF89a specification alone
 * (Appendix F for the LZW variant). It is in-house on purpose: `gifenc` failed
 * the licence check (its quantiser descends from an MPL-2.0 project) and
 * `modern-gif` buffers every RGBA frame in memory. Nothing here is derived
 * from any third-party encoder or quantiser.
 *
 * Pipeline, one frame at a time so memory stays flat:
 *   1. `createPaletteBuilder()` sees a few sampled frames and builds ONE global
 *      palette (exact colours for flat vector art, otherwise median cut).
 *   2. `indexFrame()` maps each RGBA frame to palette indices (optionally
 *      Floyd-Steinberg dithered).
 *   3. `createGifWriter()` streams header + global table immediately, and
 *      `writeFrame()` appends each LZW-compressed frame; `finish()` returns the
 *      file as parts for the caller to wrap in a Blob.
 *
 * Pure module: no DOM, no Worker, no React. Fully deterministic.
 */

export interface GifPalette {
  /** RGB triples; `colors.length === 3 * size`. */
  colors: Uint8Array;
  /** Power of two in 2..256. */
  size: number;
  /** Index reserved for transparent pixels, or -1. */
  transparentIndex: number;
}

export interface PaletteBuilder {
  /** Accumulate one sampled RGBA frame. Pixels with alpha < 128 are ignored. */
  addSample(rgba: Uint8Array | Uint8ClampedArray): void;
  /** Build the global palette (index 0 is transparent when `transparent`). */
  build(opts: { maxColors?: number; transparent: boolean }): GifPalette;
}

const BINS = 32768;
const EXACT_LIMIT = 256;

function nextPow2(n: number): number {
  let s = 2;
  while (s < n) s <<= 1;
  return s;
}

/** Minimum LZW code size for a palette size: max(2, log2(size)). */
export function minCodeSizeFor(paletteSize: number): number {
  let bits = 0;
  while (1 << bits < paletteSize) bits++;
  return Math.max(2, bits);
}

export function createPaletteBuilder(): PaletteBuilder {
  const counts = new Float64Array(BINS);
  const sumR = new Float64Array(BINS);
  const sumG = new Float64Array(BINS);
  const sumB = new Float64Array(BINS);
  let exact: Map<number, number> | null = new Map();

  return {
    addSample(rgba) {
      for (let i = 0; i + 3 < rgba.length; i += 4) {
        if (rgba[i + 3] < 128) continue;
        const r = rgba[i];
        const g = rgba[i + 1];
        const b = rgba[i + 2];
        const bin = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
        counts[bin]++;
        sumR[bin] += r;
        sumG[bin] += g;
        sumB[bin] += b;
        if (exact) {
          const key = (r << 16) | (g << 8) | b;
          exact.set(key, (exact.get(key) ?? 0) + 1);
          if (exact.size > EXACT_LIMIT) exact = null;
        }
      }
    },

    build({ maxColors = 256, transparent }) {
      const cap = Math.min(256, Math.max(2, Math.floor(maxColors)));
      const slots = Math.max(1, cap - (transparent ? 1 : 0));
      const real: number[] = []; // flat r,g,b

      if (exact && exact.size <= slots) {
        const keys = Array.from(exact.keys()).sort((a, b) => a - b);
        for (const k of keys) real.push((k >> 16) & 255, (k >> 8) & 255, k & 255);
      } else {
        const ids: number[] = [];
        for (let i = 0; i < BINS; i++) if (counts[i] > 0) ids.push(i);
        if (ids.length > 0) medianCut(ids, slots, counts, sumR, sumG, sumB, real);
      }
      if (real.length === 0) real.push(0, 0, 0);

      const used = real.length / 3 + (transparent ? 1 : 0);
      const size = nextPow2(used);
      const colors = new Uint8Array(size * 3);
      colors.set(real, transparent ? 3 : 0);
      return { colors, size, transparentIndex: transparent ? 0 : -1 };
    },
  };
}

interface Box {
  start: number;
  end: number;
  pop: number;
  range: number;
  axis: number;
}

function medianCut(
  ids: number[],
  slots: number,
  counts: Float64Array,
  sumR: Float64Array,
  sumG: Float64Array,
  sumB: Float64Array,
  out: number[],
): void {
  const order = Int32Array.from(ids);
  const shifts = [10, 5, 0];

  const measure = (start: number, end: number): Box => {
    const lo = [31, 31, 31];
    const hi = [0, 0, 0];
    let pop = 0;
    for (let i = start; i < end; i++) {
      const id = order[i];
      pop += counts[id];
      for (let a = 0; a < 3; a++) {
        const v = (id >> shifts[a]) & 31;
        if (v < lo[a]) lo[a] = v;
        if (v > hi[a]) hi[a] = v;
      }
    }
    let axis = 0;
    let range = hi[0] - lo[0] + 1;
    for (let a = 1; a < 3; a++) {
      if (hi[a] - lo[a] + 1 > range) {
        range = hi[a] - lo[a] + 1;
        axis = a;
      }
    }
    return { start, end, pop, range, axis };
  };

  const boxes: Box[] = [measure(0, order.length)];
  while (boxes.length < slots) {
    let best = -1;
    let bestScore = -1;
    for (let i = 0; i < boxes.length; i++) {
      const bx = boxes[i];
      if (bx.end - bx.start < 2) continue;
      const score = bx.range * bx.pop;
      if (score > bestScore) {
        bestScore = score;
        best = i;
      }
    }
    if (best < 0) break;
    const bx = boxes[best];
    const sh = shifts[bx.axis];
    order.subarray(bx.start, bx.end).sort((a, b) => ((a >> sh) & 31) - ((b >> sh) & 31) || a - b);
    let cum = 0;
    let split = bx.end - 1;
    for (let i = bx.start; i < bx.end - 1; i++) {
      cum += counts[order[i]];
      if (cum * 2 >= bx.pop) {
        split = i + 1;
        break;
      }
    }
    boxes[best] = measure(bx.start, split);
    boxes.push(measure(split, bx.end));
  }

  for (const bx of boxes) {
    let n = 0;
    let r = 0;
    let g = 0;
    let b = 0;
    for (let i = bx.start; i < bx.end; i++) {
      const id = order[i];
      n += counts[id];
      r += sumR[id];
      g += sumG[id];
      b += sumB[id];
    }
    out.push(Math.round(r / n), Math.round(g / n), Math.round(b / n));
  }
}

/**
 * Map one RGBA frame to palette indices. Alpha < 128 becomes the transparent
 * index when the palette has one. Exact palette colours always map to
 * themselves; other colours go to the nearest entry (squared RGB distance,
 * cached per 5-5-5 bin). `dither` applies Floyd-Steinberg error diffusion.
 */
export function indexFrame(
  rgba: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number,
  palette: GifPalette,
  opts: { dither?: boolean } = {},
): Uint8Array {
  const out = new Uint8Array(width * height);
  const { colors, size, transparentIndex } = palette;

  // Exact-colour table (open addressing, power-of-two capacity).
  const cap = 1024;
  const hKeys = new Int32Array(cap).fill(-1);
  const hVals = new Uint8Array(cap);
  for (let i = 0; i < size; i++) {
    if (i === transparentIndex) continue;
    const key = (colors[i * 3] << 16) | (colors[i * 3 + 1] << 8) | colors[i * 3 + 2];
    let h = (Math.imul(key, 0x9e3779b1) >>> 22) & (cap - 1);
    while (hKeys[h] !== -1 && hKeys[h] !== key) h = (h + 1) & (cap - 1);
    if (hKeys[h] === -1) {
      hKeys[h] = key;
      hVals[h] = i;
    }
  }

  const cache = new Int16Array(BINS).fill(-1);
  const lookup = (r: number, g: number, b: number): number => {
    const key = (r << 16) | (g << 8) | b;
    let h = (Math.imul(key, 0x9e3779b1) >>> 22) & (cap - 1);
    while (hKeys[h] !== -1) {
      if (hKeys[h] === key) return hVals[h];
      h = (h + 1) & (cap - 1);
    }
    const bin = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    let hit = cache[bin];
    if (hit < 0) {
      const rr = ((r >> 3) << 3) | (r >> 6);
      const gg = ((g >> 3) << 3) | (g >> 6);
      const bb = ((b >> 3) << 3) | (b >> 6);
      let bestD = Infinity;
      hit = 0;
      for (let i = 0; i < size; i++) {
        if (i === transparentIndex) continue;
        const dr = colors[i * 3] - rr;
        const dg = colors[i * 3 + 1] - gg;
        const db = colors[i * 3 + 2] - bb;
        const d = dr * dr + dg * dg + db * db;
        if (d < bestD) {
          bestD = d;
          hit = i;
        }
      }
      cache[bin] = hit;
    }
    return hit;
  };

  if (!opts.dither) {
    let lastKey = -1;
    let lastIdx = 0;
    for (let p = 0, i = 0; p < out.length; p++, i += 4) {
      if (transparentIndex >= 0 && rgba[i + 3] < 128) {
        out[p] = transparentIndex;
        continue;
      }
      const key = (rgba[i] << 16) | (rgba[i + 1] << 8) | rgba[i + 2];
      if (key !== lastKey) {
        lastKey = key;
        lastIdx = lookup(rgba[i], rgba[i + 1], rgba[i + 2]);
      }
      out[p] = lastIdx;
    }
    return out;
  }

  // Floyd-Steinberg: two rolling error rows, 3 channels, one pixel of padding.
  const stride = (width + 2) * 3;
  let cur = new Float32Array(stride);
  let nxt = new Float32Array(stride);
  for (let y = 0; y < height; y++) {
    nxt.fill(0);
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      const i = p * 4;
      if (transparentIndex >= 0 && rgba[i + 3] < 128) {
        out[p] = transparentIndex;
        continue;
      }
      const e = (x + 1) * 3;
      const r = Math.min(255, Math.max(0, Math.round(rgba[i] + cur[e])));
      const g = Math.min(255, Math.max(0, Math.round(rgba[i + 1] + cur[e + 1])));
      const b = Math.min(255, Math.max(0, Math.round(rgba[i + 2] + cur[e + 2])));
      const idx = lookup(r, g, b);
      out[p] = idx;
      const er = r - colors[idx * 3];
      const eg = g - colors[idx * 3 + 1];
      const eb = b - colors[idx * 3 + 2];
      if (er === 0 && eg === 0 && eb === 0) continue;
      for (let c = 0; c < 3; c++) {
        const err = c === 0 ? er : c === 1 ? eg : eb;
        cur[e + 3 + c] += (err * 7) / 16;
        nxt[e - 3 + c] += (err * 3) / 16;
        nxt[e + c] += (err * 5) / 16;
        nxt[e + 3 + c] += err / 16;
      }
    }
    const t = cur;
    cur = nxt;
    nxt = t;
  }
  return out;
}

/**
 * GIF LZW (Appendix F). Returns the min-code-size byte, the data split into
 * sub-blocks of at most 255 bytes, and the 0x00 block terminator.
 */
export function lzwEncode(indices: Uint8Array, minCodeSize: number): Uint8Array {
  const clear = 1 << minCodeSize;
  const eoi = clear + 1;
  const TABLE = 16384; // hash slots, > 2 * 4096 entries
  const keys = new Int32Array(TABLE).fill(-1);
  const vals = new Int32Array(TABLE);

  let raw = new Uint8Array(Math.max(256, indices.length >> 1));
  let rawLen = 0;
  let acc = 0;
  let nbits = 0;
  let codeSize = minCodeSize + 1;
  let next = eoi + 1;

  const emit = (code: number): void => {
    acc |= code << nbits;
    nbits += codeSize;
    while (nbits >= 8) {
      if (rawLen === raw.length) {
        const bigger = new Uint8Array(raw.length * 2);
        bigger.set(raw);
        raw = bigger;
      }
      raw[rawLen++] = acc & 255;
      acc >>>= 8;
      nbits -= 8;
    }
  };

  emit(clear);
  if (indices.length > 0) {
    let prefix = indices[0];
    for (let i = 1; i < indices.length; i++) {
      const k = indices[i];
      const key = (prefix << 8) | k;
      let h = (Math.imul(key, 0x9e3779b1) >>> 18) & (TABLE - 1);
      let found = -1;
      while (keys[h] !== -1) {
        if (keys[h] === key) {
          found = vals[h];
          break;
        }
        h = (h + 1) & (TABLE - 1);
      }
      if (found >= 0) {
        prefix = found;
        continue;
      }
      emit(prefix);
      if (next === 4096) {
        emit(clear);
        keys.fill(-1);
        next = eoi + 1;
        codeSize = minCodeSize + 1;
      } else {
        keys[h] = key;
        vals[h] = next;
        if (next === 1 << codeSize && codeSize < 12) codeSize++;
        next++;
      }
      prefix = k;
    }
    emit(prefix);
  }
  emit(eoi);
  if (nbits > 0) {
    if (rawLen === raw.length) {
      const bigger = new Uint8Array(raw.length + 1);
      bigger.set(raw);
      raw = bigger;
    }
    raw[rawLen++] = acc & 255;
  }

  const blocks = Math.ceil(rawLen / 255);
  const result = new Uint8Array(1 + rawLen + blocks + 1);
  result[0] = minCodeSize;
  let o = 1;
  for (let s = 0; s < rawLen; s += 255) {
    const n = Math.min(255, rawLen - s);
    result[o++] = n;
    result.set(raw.subarray(s, s + n), o);
    o += n;
  }
  result[o] = 0;
  return result;
}

export interface GifWriterOptions {
  width: number;
  height: number;
  palette: GifPalette;
  /** null = no NETSCAPE2.0 extension (plays once); 0 = forever; n > 0 = n extra repetitions. */
  loop: number | null;
}

export interface GifWriter {
  /** Append one full frame; `delayCs` is in 1/100 s. */
  writeFrame(indices: Uint8Array, opts: { delayCs: number }): void;
  /** Write the trailer and return the file as parts (caller builds the Blob). */
  finish(): Uint8Array[];
  /** Bytes written so far (header included). */
  readonly byteLength: number;
  readonly frames: number;
}

function le16(n: number): [number, number] {
  const v = Math.min(65535, Math.max(0, Math.round(n)));
  return [v & 255, v >> 8];
}

/** Writes header, logical screen descriptor, global table and loop extension immediately. */
export function createGifWriter(opts: GifWriterOptions): GifWriter {
  const { width, height, palette, loop } = opts;
  const parts: Uint8Array[] = [];
  let bytes = 0;
  let frames = 0;
  let finished = false;
  const push = (p: Uint8Array): void => {
    parts.push(p);
    bytes += p.length;
  };

  const minCode = minCodeSizeFor(palette.size);
  const tableBits = minCodeSize2bits(palette.size);
  const head: number[] = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61];
  head.push(...le16(width), ...le16(height));
  head.push(0x80 | (7 << 4) | (tableBits - 1), 0, 0);
  const header = new Uint8Array(head.length + palette.size * 3 + (loop !== null ? 19 : 0));
  header.set(head);
  header.set(palette.colors.subarray(0, palette.size * 3), head.length);
  if (loop !== null) {
    const ext = [0x21, 0xff, 0x0b, ...Array.from('NETSCAPE2.0', (c) => c.charCodeAt(0)), 3, 1, ...le16(loop), 0];
    header.set(ext, head.length + palette.size * 3);
  }
  push(header);

  const transparent = palette.transparentIndex >= 0;
  return {
    writeFrame(indices, { delayCs }) {
      if (finished) throw new Error('GIF writer already finished');
      const gce = new Uint8Array([
        0x21,
        0xf9,
        4,
        ((transparent ? 2 : 1) << 2) | (transparent ? 1 : 0),
        ...le16(delayCs),
        transparent ? palette.transparentIndex : 0,
        0,
      ]);
      const desc = new Uint8Array([0x2c, 0, 0, 0, 0, ...le16(width), ...le16(height), 0]);
      push(gce);
      push(desc);
      push(lzwEncode(indices, minCode));
      frames++;
    },
    finish() {
      if (!finished) {
        push(new Uint8Array([0x3b]));
        finished = true;
      }
      return parts.slice();
    },
    get byteLength() {
      return bytes;
    },
    get frames() {
      return frames;
    },
  };
}

function minCodeSize2bits(paletteSize: number): number {
  let bits = 1;
  while (1 << bits < paletteSize) bits++;
  return bits;
}
