/**
 * One-off, deterministic generator for the three golden source images
 * (`lib/photo/fixtures/images/{photo,chart,alpha}.png`). The committed PNGs are
 * the source of truth; this script documents how they were made and can
 * recreate them byte-for-byte on the same pngjs version.
 *   npx tsx scripts/photo-fixture-images.ts
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PNG } from 'pngjs';

import { hslToRgb } from '../lib/photo/colorMath';

const OUT = join(__dirname, '..', 'lib', 'photo', 'fixtures', 'images');

/** Deterministic integer hash → [0,1). */
const hash = (x: number, y: number, s: number) => {
  let h = (x * 374761393 + y * 668265263 + s * 1274126177) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const q = (v: number) => Math.max(0, Math.min(255, Math.round(v * 255)));

function make(w: number, h: number, px: (x: number, y: number) => [number, number, number, number]) {
  const png = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const [r, g, b, a] = px(x, y);
      const i = (y * w + x) * 4;
      png.data[i] = q(r);
      png.data[i + 1] = q(g);
      png.data[i + 2] = q(b);
      png.data[i + 3] = q(a);
    }
  }
  return PNG.sync.write(png, { colorType: 6 });
}

/** 256×192 "photo": sky, hills, a red barn, a blue lake, a green tree, a skin-tone ball, mild grain. */
const photo = make(256, 192, (x, y) => {
  const n = (hash(x, y, 1) - 0.5) * 0.03;
  let c: [number, number, number];
  const horizon = 96 + 12 * Math.sin(x / 23);
  if (y < horizon) c = [mix(0.25, 0.75, y / horizon), mix(0.45, 0.8, y / horizon), mix(0.85, 0.95, y / horizon)];
  else c = [mix(0.28, 0.12, (y - horizon) / 96), mix(0.55, 0.3, (y - horizon) / 96), mix(0.2, 0.1, (y - horizon) / 96)];
  if (x > 150 && x < 210 && y > 110 && y < 160) c = [0.72, 0.12, 0.1]; // red barn
  if (x > 160 && x < 200 && y >= 100 && y <= 110) c = [0.45, 0.1, 0.08]; // roof
  if ((x - 70) ** 2 / 2200 + (y - 150) ** 2 / 180 < 1) c = [0.12, 0.35, 0.78]; // blue lake
  if ((x - 40) ** 2 + (y - 105) ** 2 < 400) c = [0.1, 0.5, 0.15]; // green tree
  if ((x - 120) ** 2 + (y - 135) ** 2 < 150) c = [0.85, 0.62, 0.5]; // skin ball
  if (y > 170) c = [mix(c[0], 0.9, 0.5), mix(c[1], 0.85, 0.5), mix(c[2], 0.1, 0.5)]; // yellow field edge
  return [c[0] + n, c[1] + n, c[2] + n, 1];
});

/** 256×256 chart: 16 hues × 12 lightness rows on top, 32-step gray ramp, six saturation bars. */
const chart = make(256, 256, (x, y) => {
  if (y < 192) {
    const col = Math.floor(x / 16);
    const row = Math.floor(y / 16);
    const [r, g, b] = hslToRgb(col * 22.5, 1, (row + 0.5) / 12);
    return [r, g, b, 1];
  }
  if (y < 224) {
    const v = Math.floor(x / 8) / 31;
    return [v, v, v, 1];
  }
  const s = Math.floor(x / 43) / 5;
  const [r, g, b] = hslToRgb(0, s, 0.5);
  return [r, g, b, 1];
});

/** 256×256 with alpha: a soft orange disc over transparency, plus a half-transparent blue square. */
const alpha = make(256, 256, (x, y) => {
  const d = Math.hypot(x - 100, y - 128) / 90;
  if (x > 150 && y < 110 && x < 240 && y > 30) return [0.1, 0.3, 0.9, 0.5];
  if (d < 1) return [0.95, 0.5 + 0.2 * d, 0.1, Math.min(1, (1 - d) * 4)];
  return [0.2, 0.2, 0.2, 0];
});

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'photo.png'), photo);
writeFileSync(join(OUT, 'chart.png'), chart);
writeFileSync(join(OUT, 'alpha.png'), alpha);
console.log('wrote photo.png chart.png alpha.png');
