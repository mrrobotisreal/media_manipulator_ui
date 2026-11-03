import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PNG } from 'pngjs';

import { GOLDEN_IMAGES, goldenDocs, goldenPath, renderGolden } from './goldens';
import { fromBytes, renderDocCPU, toBytes } from './colorMath';
import { readImage } from './goldens';
import { parsePhotoDoc } from './photoTypes';
import { readFixture } from './fixtures/fixtures';

const decode = (buf: Buffer) => PNG.sync.read(buf);

describe('goldens (TypeScript reference == committed PNGs)', () => {
  const docs = goldenDocs();
  it('covers the shared and per-type docs over three images', () => {
    expect(docs.length).toBeGreaterThanOrEqual(24);
    expect(GOLDEN_IMAGES).toEqual(['photo', 'chart', 'alpha']);
  });

  for (const { name, doc } of docs) {
    it(`golden equality: ${name} (all images)`, () => {
      for (const image of GOLDEN_IMAGES) {
        const fresh = decode(renderGolden(doc, image));
        const committed = decode(readFileSync(goldenPath(name, image)));
        expect([fresh.width, fresh.height]).toEqual([committed.width, committed.height]);
        expect(Buffer.compare(fresh.data, committed.data), `${name}.${image} pixels differ: run npm run photo:goldens`).toBe(0);
      }
    });
  }

  it('rung1-all-layers.json renders to the committed golden (equality test)', () => {
    const r = parsePhotoDoc(readFixture('docs', 'rung1-all-layers.json'));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    for (const image of GOLDEN_IMAGES) {
      const bytes = toBytes(renderDocCPU(r.doc, readImage(image)));
      const golden = decode(readFileSync(goldenPath('rung1-all-layers', image)));
      expect(Buffer.compare(Buffer.from(bytes), golden.data)).toBe(0);
    }
  });

  it('blank doc over the chart is the identity (8-bit)', () => {
    const src = decode(readFileSync(`${__dirname}/fixtures/images/chart.png`));
    const golden = decode(readFileSync(goldenPath('blank', 'chart')));
    expect(Buffer.compare(src.data, golden.data)).toBe(0);
  });

  it('alpha is never touched', () => {
    const src = decode(readFileSync(`${__dirname}/fixtures/images/alpha.png`));
    const golden = decode(readFileSync(goldenPath('rung1-all-layers', 'alpha')));
    for (let i = 3; i < src.data.length; i += 4) expect(golden.data[i]).toBe(src.data[i]);
  });

  it('grey except red: the chart keeps the red column coloured and greys the green one', () => {
    const g = decode(readFileSync(goldenPath('hsl-grey-except-red', 'chart')));
    const px = (x: number, y: number) => {
      const i = (y * g.width + x) * 4;
      return [g.data[i], g.data[i + 1], g.data[i + 2]];
    };
    const chroma = (c: number[]) => Math.max(...c) - Math.min(...c);
    const y = 5 * 16 + 8; // mid-lightness row
    const src = fromBytes(g.width, g.height, g.data); // sanity: decoded fine
    expect(src.width).toBe(256);
    const red = px(8, y); // hue 0
    const green = px(5 * 16 + 8, y); // hue 112.5
    const blue = px(10 * 16 + 8, y); // hue 225 -> (blues/cyans)
    const magenta = px(13 * 16 + 8, y); // hue 292.5
    expect(chroma(red)).toBeGreaterThan(200);
    expect(chroma(green)).toBeLessThanOrEqual(2);
    expect(chroma(blue)).toBeLessThanOrEqual(25); // the doc also shifts a custom 210° range
    expect(chroma(magenta)).toBeLessThanOrEqual(2);
  });
});
