import { GLCompositor } from '../../lib/studio/glCompositor';
import { parseCubeLut } from '../../lib/studio/lutParser';
import { rasterTitle, titleRasterKey } from '../../lib/studio/titleRaster';
import { registerStudioFontFaces } from '../../lib/studio/titleFonts';
import { buildLayersAtTime, orderedVideoClips, type LayerSource } from './buildLayers';
import type { GoldenFile, GoldenVariantKey } from '../goldenTypes';

/**
 * Browser entry of the parity capture page (bundled by run.ts with esbuild,
 * served statically — no Next involved). Drives the REAL GLCompositor over a
 * golden EDL's fixture videos and reads frames back from the accum FBO
 * (in-page gl.readPixels per research ticket 02 — never page.screenshot()).
 *
 * The Playwright driver calls window.__parity:
 *   renderer()                    → UNMASKED_RENDERER_WEBGL string
 *   setup(golden, variant, base)  → prepare compositor/videos/LUTs
 *   capture(frame)                → { width, height, rgbaBase64, pngDataUrl }
 *
 * Frame timing contract (mirrored by cmd/parity-render): output frame K is
 * evaluated at tEval = K/fps (the exact output pts ffmpeg's fade/enable
 * expressions see) while videos are SEEKED to tEval + half a frame so the
 * browser unambiguously displays source frame floor(t·fps) — the same frame
 * ffmpeg's overlay holds at that output pts.
 */

interface CaptureResult {
  width: number;
  height: number;
  rgbaBase64: string;
  pngDataUrl: string;
}

const canvas = document.getElementById('stage') as HTMLCanvasElement;
const comp = new GLCompositor();
const glOk = comp.init(canvas);

// One <video> per fixture FILE, shared across scenarios (browsers cap live
// decoder contexts; goldens reference at most 3 distinct files at once).
const videoByFile = new Map<string, HTMLVideoElement>();
let uploadCounter = 0;

// Title raster cache (part 16) — same dirty-flag contract as the editor.
const titleCanvasById = new Map<string, { canvas: HTMLCanvasElement; key: string }>();
let fontsLoaded: Promise<void> | null = null;

let current: {
  golden: GoldenFile;
  variant: GoldenVariantKey;
  fixtureBase: string;
} | null = null;

function videoFor(fixtureBase: string, file: string): HTMLVideoElement {
  let el = videoByFile.get(file);
  if (!el) {
    el = document.createElement('video');
    el.muted = true;
    el.preload = 'auto';
    el.crossOrigin = 'anonymous';
    el.src = `${fixtureBase}/${file}`;
    document.body.appendChild(el);
    videoByFile.set(file, el);
  }
  return el;
}

function ready(el: HTMLVideoElement): Promise<void> {
  if (el.readyState >= 1 && el.videoWidth > 0) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const ok = () => {
      cleanup();
      resolve();
    };
    const fail = () => {
      cleanup();
      reject(new Error(`fixture failed to load: ${el.src}`));
    };
    const cleanup = () => {
      el.removeEventListener('loadedmetadata', ok);
      el.removeEventListener('error', fail);
    };
    el.addEventListener('loadedmetadata', ok);
    el.addEventListener('error', fail);
  });
}

/** Seeks and waits until the frame at `t` is actually decodable. */
async function seekTo(el: HTMLVideoElement, t: number): Promise<void> {
  await ready(el);
  const target = Math.max(0, Math.min(t, (el.duration || t) - 0.001));
  if (Math.abs(el.currentTime - target) > 1e-4) {
    await new Promise<void>((resolve, reject) => {
      const done = () => {
        cleanup();
        resolve();
      };
      const fail = () => {
        cleanup();
        reject(new Error(`seek failed: ${el.src} @ ${target}`));
      };
      const cleanup = () => {
        el.removeEventListener('seeked', done);
        el.removeEventListener('error', fail);
      };
      el.addEventListener('seeked', done);
      el.addEventListener('error', fail);
      el.currentTime = target;
    });
  }
  const deadline = performance.now() + 5000;
  while (el.readyState < 2) {
    if (performance.now() > deadline) throw new Error(`frame never became ready: ${el.src} @ ${target}`);
    await new Promise((r) => setTimeout(r, 10));
  }
}

function toBase64(bytes: Uint8ClampedArray): string {
  let out = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    out += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(out);
}

const parity = {
  renderer(): string {
    if (!glOk) return '';
    return comp.rendererInfo();
  },

  async setup(
    golden: GoldenFile,
    variant: GoldenVariantKey,
    fixtureBase: string,
    fontsBase?: string,
  ): Promise<{ width: number; height: number }> {
    if (!glOk || !comp.isAvailable()) throw new Error('WebGL2 compositor unavailable');
    const project = variant === 'projectRef' ? golden.projectRef : golden.project;
    if (!project) throw new Error(`golden has no ${variant}`);
    current = { golden, variant, fixtureBase };

    // Title goldens (part 16) raster with the SAME shipped faces as the
    // editor; registered once via the FontFace API (no CSS on this page).
    if (fontsBase && !fontsLoaded) fontsLoaded = registerStudioFontFaces(fontsBase);
    if (fontsLoaded) await fontsLoaded;

    // Load .cube LUT assets referenced by this golden (loadLut caches per key).
    for (const [assetId, asset] of Object.entries(golden.assets)) {
      if (asset.kind !== 'lut' || comp.hasLut(assetId)) continue;
      const res = await fetch(`${fixtureBase}/${asset.file}`);
      if (!res.ok) throw new Error(`LUT fixture fetch failed: ${asset.file}`);
      comp.loadLut(assetId, parseCubeLut(await res.text()));
    }
    return { width: project.width, height: project.height };
  },

  async capture(frame: number): Promise<CaptureResult> {
    if (!current) throw new Error('capture() before setup()');
    const { golden, variant, fixtureBase } = current;
    const project = variant === 'projectRef' ? golden.projectRef! : golden.project;
    const fps = project.fps || 30;
    const tEval = frame / fps;
    const tSeek = tEval + 0.5 / fps;

    const active = orderedVideoClips(project.tracks, tEval);
    const sources = new Map<string, LayerSource>();
    for (let i = 0; i < active.length; i += 1) {
      const a = active[i];
      if (a.clip.title) {
        // Title clip (part 16): raster at the backing size and upload as an
        // image texture — mirrors the editor's syncFrame title path.
        const back = comp.backingSize(project.width, project.height);
        const key = titleRasterKey(a.clip.title, back.w, back.h);
        let entry = titleCanvasById.get(a.clip.id);
        if (!entry || entry.key !== key) {
          const canvas = entry?.canvas ?? document.createElement('canvas');
          canvas.width = back.w;
          canvas.height = back.h;
          const ctx2d = canvas.getContext('2d');
          if (!ctx2d) throw new Error('2d canvas unavailable for title raster');
          rasterTitle(ctx2d, a.clip.title, back.w, back.h, project.width);
          entry = { canvas, key };
          titleCanvasById.set(a.clip.id, entry);
        }
        if (!comp.uploadImage(a.clip.id, entry.canvas, key)) {
          throw new Error(`uploadImage failed for title clip ${a.clip.id}`);
        }
        sources.set(a.clip.id, {
          slot: -1,
          srcW: entry.canvas.width,
          srcH: entry.canvas.height,
          imageKey: a.clip.id,
        });
        continue;
      }
      const asset = golden.assets[a.clip.assetId];
      if (!asset || asset.kind !== 'video') continue;
      const el = videoFor(fixtureBase, asset.file);
      await seekTo(el, a.clip.sourceIn + (tSeek - a.clip.timelineStart));
      if (!comp.uploadSlot(i, el, ++uploadCounter)) {
        throw new Error(`uploadSlot failed for ${asset.file} (slot ${i})`);
      }
      sources.set(a.clip.id, { slot: i, srcW: el.videoWidth || 16, srcH: el.videoHeight || 9 });
    }

    const layers = buildLayersAtTime(active, project.tracks, tEval, sources, comp, project.width, project.height);
    comp.composite(layers, project.width, project.height);
    const px = comp.readAccumPixels();
    if (!px) throw new Error('readAccumPixels returned null');

    // PNG (human inspection) via a 2D canvas; RGBA base64 is the comparison
    // payload — both from the same readback, so they can never disagree.
    const png = document.createElement('canvas');
    png.width = px.width;
    png.height = px.height;
    const ctx = png.getContext('2d');
    if (!ctx) throw new Error('2d canvas unavailable');
    // Copy: ImageData's lib types demand a Uint8ClampedArray over a plain
    // ArrayBuffer (not ArrayBufferLike).
    ctx.putImageData(new ImageData(new Uint8ClampedArray(px.data), px.width, px.height), 0, 0);

    return {
      width: px.width,
      height: px.height,
      rgbaBase64: toBase64(px.data),
      pngDataUrl: png.toDataURL('image/png'),
    };
  },
};

declare global {
  interface Window {
    __parity: typeof parity;
  }
}

window.__parity = parity;
