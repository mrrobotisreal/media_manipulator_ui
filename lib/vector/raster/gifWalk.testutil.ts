/**
 * Test-only GIF block walker: header, global table, NETSCAPE loop field, and
 * per frame the GCE delay / disposal / transparency. Skips LZW data (the full
 * decoder is in gifEncoder.test.ts).
 */
export interface WalkedGif {
  signature: string;
  width: number;
  height: number;
  tableSize: number;
  loop: number | null;
  frames: Array<{ delayCs: number; disposal: number; transparent: boolean; transparentIndex: number }>;
  trailer: boolean;
}

export function walkGif(bytes: Uint8Array): WalkedGif {
  const signature = String.fromCharCode(...bytes.subarray(0, 6));
  const u16 = (o: number) => bytes[o] | (bytes[o + 1] << 8);
  const width = u16(6);
  const height = u16(8);
  const packed = bytes[10];
  const tableSize = packed & 0x80 ? 2 << (packed & 7) : 0;
  let p = 13 + tableSize * 3;
  let loop: number | null = null;
  const frames: WalkedGif['frames'] = [];
  let gce: WalkedGif['frames'][number] | null = null;
  const skipBlocks = () => {
    while (bytes[p] !== 0) p += bytes[p] + 1;
    p += 1;
  };
  for (;;) {
    const b = bytes[p];
    if (b === 0x3b) return { signature, width, height, tableSize, loop, frames, trailer: p === bytes.length - 1 };
    if (b === 0x21) {
      const label = bytes[p + 1];
      if (label === 0xf9) {
        const f = bytes[p + 3];
        gce = { delayCs: u16(p + 4), disposal: (f >> 2) & 7, transparent: (f & 1) === 1, transparentIndex: bytes[p + 6] };
        p += 8;
      } else if (label === 0xff) {
        const id = String.fromCharCode(...bytes.subarray(p + 3, p + 14));
        p += 14;
        if (id === 'NETSCAPE2.0' && bytes[p] === 3) loop = u16(p + 2);
        skipBlocks();
      } else {
        p += 2;
        skipBlocks();
      }
    } else if (b === 0x2c) {
      const local = bytes[p + 9] & 0x80 ? 2 << (bytes[p + 9] & 7) : 0;
      p += 10 + local * 3 + 1;
      skipBlocks();
      frames.push(gce ?? { delayCs: 0, disposal: 0, transparent: false, transparentIndex: 0 });
      gce = null;
    } else {
      throw new Error(`unexpected GIF block 0x${b?.toString(16)} at ${p}`);
    }
  }
}
