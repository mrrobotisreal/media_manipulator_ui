/**
 * JASSUB caption preview (MM121 decision 5): libass in WebAssembly draws the TS generator's .ass
 * over the preview, the same engine and fonts ffmpeg burns in at export (ADR-0019).
 *
 * Lazy by construction: the renderer (public/jassub/<v>/, staged by
 * scripts/gen-jassub-assets.mjs) is fetched by a bundler-ignored dynamic import only when a
 * caption preview mounts, so neither the JS nor the ~2 MB WASM is in any Next chunk. Fonts come
 * from /fonts/studio/captions/ by family (full-coverage woff2 of the exact TTFs in the API's fonts
 * dir); system and Google fonts are never queried.
 */
import catalog from './captionsCatalog.json';

/** Bump with the jassub dependency (scripts/gen-jassub-assets.mjs stages this version). */
export const JASSUB_VERSION = '2.5.23';
const BASE = `/jassub/${JASSUB_VERSION}`;
export const CAPTION_FONT_BASE = '/fonts/studio/captions';

/** Minimal surface of the jassub class this module uses. */
export interface JassubInstance {
  ready: Promise<void>;
  renderer: { setTrack(content: string): unknown };
  manualRender(data: { expectedDisplayTime: number; width: number; height: number; mediaTime: number }, repaint?: boolean): Promise<void>;
  resize(forceRepaint?: boolean, renderWidth?: number, renderHeight?: number): Promise<void>;
  destroy(): Promise<void>;
}
type JassubCtor = new (opts: Record<string, unknown>) => JassubInstance;

let ctorPromise: Promise<JassubCtor> | null = null;

/** Why the renderer could not start (analytics `studio_caption_renderer_fallback.reason`). */
export type CaptionFallbackReason = 'unsupported' | 'load_failed' | 'render_failed';

export function jassubSupported(): boolean {
  return typeof window !== 'undefined' && typeof Worker !== 'undefined' && typeof WebAssembly !== 'undefined' &&
    typeof OffscreenCanvas !== 'undefined' && typeof HTMLCanvasElement !== 'undefined' &&
    'transferControlToOffscreen' in HTMLCanvasElement.prototype;
}

function loadCtor(): Promise<JassubCtor> {
  if (!ctorPromise) {
    ctorPromise = (import(/* webpackIgnore: true */ /* turbopackIgnore: true */ `${BASE}/jassub.js`) as Promise<{ default: JassubCtor }>)
      .then((m) => m.default)
      .catch((e) => {
        ctorPromise = null;
        throw e;
      });
  }
  return ctorPromise;
}

/**
 * availableFonts for JASSUB: every caption family (regular and bold keys) → its woff2. JASSUB
 * fetches a file only when libass asks for that family, so the 4 MB set is never downloaded
 * whole. The default font is DejaVu Sans, the server's own default.
 */
export function captionAvailableFonts(origin = ''): Record<string, string> {
  const out: Record<string, string> = {};
  const url = (ttf: string) => `${origin}${CAPTION_FONT_BASE}/${ttf.replace(/\.ttf$/, '.woff2')}`;
  for (const f of catalog.fonts) {
    const key = f.family.toLowerCase();
    out[key] = url(f.regular);
    out[`${key} regular`] = url(f.regular);
    if (f.bold) out[`${key} bold`] = url(f.bold);
  }
  out['liberation sans'] = out['dejavu sans'];
  return out;
}

/** Starts a renderer on `canvas` with the given .ass. Rejects with a fallback reason. */
export async function startJassub(canvas: HTMLCanvasElement, ass: string, fonts: string[]): Promise<JassubInstance> {
  if (!jassubSupported()) throw new CaptionPreviewError('unsupported');
  let Ctor: JassubCtor;
  try {
    Ctor = await loadCtor();
  } catch {
    throw new CaptionPreviewError('load_failed');
  }
  const origin = window.location.origin;
  const available = captionAvailableFonts(origin);
  try {
    const inst = new Ctor({
      canvas,
      subContent: ass,
      workerUrl: `${origin}${BASE}/worker.js`,
      wasmUrl: `${origin}${BASE}/jassub-worker.wasm`,
      modernWasmUrl: `${origin}${BASE}/jassub-worker-modern.wasm`,
      availableFonts: available,
      // Preload the families this track names (no flash of the default font).
      fonts: fonts.flatMap((fam) => {
        const k = fam.toLowerCase();
        return [available[k], available[`${k} bold`]].filter(Boolean);
      }),
      defaultFont: 'dejavu sans',
      queryFonts: false,
    });
    await inst.ready;
    return inst;
  } catch {
    throw new CaptionPreviewError('load_failed');
  }
}

export class CaptionPreviewError extends Error {
  constructor(public readonly reason: CaptionFallbackReason) {
    super(`caption preview: ${reason}`);
  }
}
