/**
 * Fakes for the MM47 raster tests: a canvas that records draw calls and
 * returns deterministic pixels, and an image loader that records the URLs and
 * blobs it was given. No real canvas or SVG decoding happens in jsdom.
 */
import type { FrameEnv, RasterCanvas, RasterContext } from './frames';

export interface FakeCanvasLog {
  draws: number;
  fills: string[];
}

/** RGBA pixels where every pixel is (frameIndex*16 mod 256, 0x40, 0x80, 0xff), so frames differ. */
export function fakeCanvas(width: number, height: number, log: FakeCanvasLog = { draws: 0, fills: [] }): RasterCanvas & { log: FakeCanvasLog } {
  let fillStyle: unknown = '';
  const ctx: RasterContext = {
    clearRect() {},
    fillRect() {
      log.fills.push(String(fillStyle));
    },
    drawImage() {
      log.draws += 1;
    },
    getImageData(_x, _y, w, h) {
      const data = new Uint8ClampedArray(w * h * 4);
      const r = (log.draws * 16) % 256;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = r;
        data[i + 1] = 0x40;
        data[i + 2] = 0x80;
        data[i + 3] = 0xff;
      }
      return { data, width: w, height: h };
    },
    get fillStyle() {
      return fillStyle;
    },
    set fillStyle(v) {
      fillStyle = v;
    },
  };
  return { width, height, getContext: () => ctx, log };
}

export interface FakeEnvLog {
  created: string[];
  revoked: string[];
  loaded: string[];
  blobs: Blob[];
  canvas?: ReturnType<typeof fakeCanvas>;
}

export function fakeFrameEnv(log: FakeEnvLog = { created: [], revoked: [], loaded: [], blobs: [] }): FrameEnv & { log: FakeEnvLog } {
  let n = 0;
  return {
    log,
    createCanvas(w, h) {
      log.canvas = fakeCanvas(w, h);
      return log.canvas;
    },
    async loadImage(url) {
      log.loaded.push(url);
      return { url };
    },
    createObjectURL(blob) {
      const url = `blob:fake/${++n}`;
      log.created.push(url);
      log.blobs.push(blob);
      return url;
    },
    revokeObjectURL(url) {
      log.revoked.push(url);
    },
  };
}
