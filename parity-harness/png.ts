import { deflateSync } from 'node:zlib';

/**
 * Minimal PNG encoder (8-bit RGBA, no interlace) on node:zlib — enough to
 * write failure diff artifacts without an image dependency. Encode-only: the
 * comparison itself runs on raw RGBA dumps, never on PNGs.
 */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(...parts: Uint8Array[]): number {
  let c = 0xffffffff;
  for (const part of parts) {
    for (let i = 0; i < part.length; i += 1) {
      c = CRC_TABLE[(c ^ part[i]) & 0xff] ^ (c >>> 8);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, body: Uint8Array): Buffer {
  const typeBytes = Buffer.from(type, 'ascii');
  const head = Buffer.alloc(4);
  head.writeUInt32BE(body.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeBytes, body), 0);
  return Buffer.concat([head, typeBytes, Buffer.from(body), crc]);
}

/** RGBA (rows top-down) → PNG bytes. */
export function encodePng(width: number, height: number, rgba: Uint8Array | Uint8ClampedArray): Buffer {
  if (rgba.length !== width * height * 4) throw new Error('rgba length must be width*height*4');
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  // compression 0, filter 0, interlace 0 already zeroed.

  // Filter byte 0 (None) per scanline.
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0;
    raw.set(rgba.subarray(y * stride, (y + 1) * stride), y * (stride + 1) + 1);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', new Uint8Array(0)),
  ]);
}
