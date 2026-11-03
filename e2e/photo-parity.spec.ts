/**
 * Aperture WebGL2 parity spec: WORKSTATION-ONLY, never run on the laptop and
 * not part of `npm test` (written in MM97, run by Mitch on the GPU box).
 *
 * Renders every committed golden doc over the three fixture images through the
 * real `PhotoRenderer` in Chromium and compares `readPixels` against the
 * committed golden PNG within the design §3.3 colour-op tolerances
 * (mean <= 1.0, p99 <= 2, max <= 4 on a float target; the RGBA8 fallback gets
 * +2 on max/p99). Run: `E2E_BASE_URL=... npx playwright test -c e2e/playwright.config.ts photo-parity`
 * after adding `e2e/photo-parity.spec.ts` to the config's testMatch, or
 * `npx playwright test e2e/photo-parity.spec.ts` with a config pointing at it.
 *
 * It needs a page that exposes the renderer: open `/photo/new?parity=1`, which
 * (in dev builds only) sets `window.__photoParity = { PhotoRenderer }`.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';

const FIX = join(__dirname, '..', 'lib', 'photo', 'fixtures');
const IMAGES = ['photo', 'chart', 'alpha'];
const DOCS = ['blank', 'defaults', 'curves-s', 'hsl-grey-except-red', 'levels-channels', 'rung1-all-layers'];

test.describe('Aperture preview vs goldens', () => {
  for (const doc of DOCS) {
    for (const image of IMAGES) {
      test(`${doc} / ${image}`, async ({ page }) => {
        await page.goto('/photo/new?parity=1');
        const docJson = JSON.parse(readFileSync(join(FIX, 'docs', `${doc}.json`), 'utf8'));
        const imageB64 = readFileSync(join(FIX, 'images', `${image}.png`)).toString('base64');
        const goldenB64 = readFileSync(join(FIX, 'goldens', `${doc}.${image}.png`)).toString('base64');
        const stats = await page.evaluate(
          async ({ docJson, imageB64, goldenB64 }) => {
            const decode = async (b64: string) => {
              const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob(), { premultiplyAlpha: 'none', colorSpaceConversion: 'none' });
              const c = new OffscreenCanvas(bmp.width, bmp.height);
              const g = c.getContext('2d') as OffscreenCanvasRenderingContext2D;
              g.drawImage(bmp, 0, 0);
              return { bmp, data: g.getImageData(0, 0, bmp.width, bmp.height).data };
            };
            const { PhotoRenderer } = (window as unknown as { __photoParity: { PhotoRenderer: new (c: HTMLCanvasElement) => { setSource(s: ImageBitmap, w: number, h: number): void; render(d: unknown): void; readPixels(): Uint8Array; float: boolean } } }).__photoParity;
            const src = await decode(imageB64);
            const gold = await decode(goldenB64);
            const canvas = document.createElement('canvas');
            const r = new PhotoRenderer(canvas);
            r.setSource(src.bmp, src.bmp.width, src.bmp.height);
            r.render(docJson);
            const px: Uint8Array = r.readPixels();
            const diffs: number[] = [];
            for (let i = 0; i < px.length; i += 4) {
              if (gold.data[i + 3] === 0) continue;
              for (let k = 0; k < 3; k += 1) diffs.push(Math.abs(px[i + k] - gold.data[i + k]));
            }
            diffs.sort((a, b) => a - b);
            const mean = diffs.reduce((s, v) => s + v, 0) / Math.max(1, diffs.length);
            return { mean, p99: diffs[Math.floor(diffs.length * 0.99)] ?? 0, max: diffs[diffs.length - 1] ?? 0, float: r.float as boolean };
          },
          { docJson, imageB64, goldenB64 },
        );
        const extra = stats.float ? 0 : 2;
        expect(stats.mean).toBeLessThanOrEqual(1.0 + (stats.float ? 0 : 0.5));
        expect(stats.p99).toBeLessThanOrEqual(2 + extra);
        expect(stats.max).toBeLessThanOrEqual(4 + extra);
      });
    }
  }
});
