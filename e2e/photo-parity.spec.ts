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
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';

const FIX = join(__dirname, '..', 'lib', 'photo', 'fixtures');
const IMAGES = ['photo', 'chart', 'alpha'];
const DOCS = ['blank', 'defaults', 'curves-s', 'hsl-grey-except-red', 'levels-channels', 'rung1-all-layers'];
// MM98: masks, geometry, red-eye. Geometry goldens are compared inside a 2 px border (golden-manifest.json),
// and geometry-corrected output sizes must match exactly. Brush masks upload their PNG alpha as an R8 texture.
const MM98_DOCS = ['masks-all-kinds', 'masks-named', 'geometry-rotate-crop', 'geometry-perspective', 'mask-gradient-tone', 'mask-colorrange-hsl', 'mask-brush-exposure', 'mask-luminosity-curves', 'mask-radial-subtract', 'redeye', 'geometry-straighten-edge', 'geometry-flip-fill-colour'];
// MM99: detail ops. Convolution mean <= 1.5 / max <= 8; noise reduction (and dehaze: the preview uses a sampled
// 99.5th percentile) mean <= 3 / max <= 12; grain exact up to the float colour buffer.
const MM99_DOCS = ['detail-all', 'sharpen-only', 'vignette-grain', 'grain-only', 'dehaze-negative', 'clarity-texture-blur'];
const MANIFEST = JSON.parse(readFileSync(join(FIX, 'golden-manifest.json'), 'utf8')) as Record<string, { width: number; height: number; borderPx: number }>;
const docPath = (doc: string) => (existsSync(join(FIX, 'docs', `${doc}.json`)) ? join(FIX, 'docs', `${doc}.json`) : join(FIX, 'golden-docs', `${doc}.json`));

test.describe('Aperture preview vs goldens', () => {
  for (const doc of [...DOCS, ...MM98_DOCS, ...MM99_DOCS]) {
    for (const image of IMAGES) {
      test(`${doc} / ${image}`, async ({ page }) => {
        await page.goto('/photo/new?parity=1');
        const docJson = JSON.parse(readFileSync(docPath(doc), 'utf8'));
        const imageB64 = readFileSync(join(FIX, 'images', `${image}.png`)).toString('base64');
        const goldenB64 = readFileSync(join(FIX, 'goldens', `${doc}.${image}.png`)).toString('base64');
        const meta = MANIFEST[`${doc}.${image}`] ?? { width: 0, height: 0, borderPx: 0 };
        const stats = await page.evaluate(
          async ({ docJson, imageB64, goldenB64, meta }) => {
            const decode = async (b64: string) => {
              const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob(), { premultiplyAlpha: 'none', colorSpaceConversion: 'none' });
              const c = new OffscreenCanvas(bmp.width, bmp.height);
              const g = c.getContext('2d') as OffscreenCanvasRenderingContext2D;
              g.drawImage(bmp, 0, 0);
              return { bmp, data: g.getImageData(0, 0, bmp.width, bmp.height).data };
            };
            const { PhotoRenderer } = (window as unknown as { __photoParity: { PhotoRenderer: new (c: HTMLCanvasElement) => { setSource(s: ImageBitmap, w: number, h: number): void; render(d: unknown): void; readPixels(): Uint8Array; float: boolean; width: number; height: number; setAlpha(id: string, img: { width: number; height: number; alpha: ArrayLike<number> }): void } } }).__photoParity;
            const src = await decode(imageB64);
            const gold = await decode(goldenB64);
            const canvas = document.createElement('canvas');
            const r = new PhotoRenderer(canvas);
            r.setSource(src.bmp, src.bmp.width, src.bmp.height);
            // Brush components: decode each PNG's alpha and hand it to the renderer.
            const layers = [...(docJson.layers ?? []), ...Object.values(docJson.masks ?? {}).map((m) => ({ mask: m }))] as { mask?: { components?: { kind: string; png?: string }[] } }[];
            for (const l of layers) for (const c of l.mask?.components ?? []) {
              if (c.kind !== 'brush' || !c.png) continue;
              const b = await createImageBitmap(await (await fetch(c.png)).blob(), { premultiplyAlpha: 'none', colorSpaceConversion: 'none' });
              const oc = new OffscreenCanvas(b.width, b.height);
              const g = oc.getContext('2d') as OffscreenCanvasRenderingContext2D;
              g.drawImage(b, 0, 0);
              const d = g.getImageData(0, 0, b.width, b.height).data;
              const alpha = new Uint8Array(b.width * b.height);
              for (let i = 0; i < alpha.length; i += 1) alpha[i] = d[i * 4 + 3];
              r.setAlpha(c.png, { width: b.width, height: b.height, alpha });
            }
            r.render(docJson);
            const px: Uint8Array = r.readPixels();
            if (meta.width && (r.width !== meta.width || r.height !== meta.height)) return { mean: 99, p99: 99, max: 99, float: r.float as boolean };
            const diffs: number[] = [];
            for (let i = 0; i < px.length; i += 4) {
              if (gold.data[i + 3] === 0) continue;
              const x = (i / 4) % r.width;
              const y = Math.floor(i / 4 / r.width);
              if (meta.borderPx && (x < meta.borderPx || y < meta.borderPx || x >= r.width - meta.borderPx || y >= r.height - meta.borderPx)) continue;
              for (let k = 0; k < 3; k += 1) diffs.push(Math.abs(px[i + k] - gold.data[i + k]));
            }
            diffs.sort((a, b) => a - b);
            const mean = diffs.reduce((s, v) => s + v, 0) / Math.max(1, diffs.length);
            return { mean, p99: diffs[Math.floor(diffs.length * 0.99)] ?? 0, max: diffs[diffs.length - 1] ?? 0, float: r.float as boolean };
          },
          { docJson, imageB64, goldenB64, meta },
        );
        const extra = stats.float ? 0 : 2;
        const detail = MM99_DOCS.includes(doc);
        const nr = doc === 'detail-all';
        expect(stats.mean).toBeLessThanOrEqual((nr ? 3 : detail ? 1.5 : 1.0) + (stats.float ? 0 : 0.5));
        if (!detail) expect(stats.p99).toBeLessThanOrEqual(2 + extra);
        expect(stats.max).toBeLessThanOrEqual((nr ? 12 : detail ? 8 : 4) + extra);
      });
    }
  }
});
