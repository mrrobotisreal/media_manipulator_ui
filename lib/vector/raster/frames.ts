/**
 * Motion raster exports, step 1: the frame source (ticket MM47 decision 1).
 *
 * CSS animations do not tick inside `<img>` and are not frame-addressable, so
 * every frame comes from the MODEL: `sampleDoc(doc, t)` resolves every track
 * to constants and `serializeSvg` writes that frame as a static SVG (morph `d`
 * keys are already normalised, MM45). The SVG is loaded from a Blob URL into
 * an `<img>`, `decode()`d and drawn onto ONE reused canvas. Time is the frame
 * index over the fps, never the wall clock.
 *
 * Safety (MM42 allow-lists): the SVG drawn is always the editor's own
 * sanitised serialisation of a document that passed `vectorDocSchema`
 * (`prepareRasterDoc`, once per export), and every baked frame is checked
 * again by `rasterSafetyIssues` before it reaches an `<img>`. The only images
 * a valid document can hold are `data:image/...;base64` URIs, and an SVG
 * loaded as an image fetches nothing external, so the canvas is never tainted
 * and nothing can be exfiltrated from it.
 *
 * Worker note (decision 1 proposed "OffscreenCanvas in a Worker"): no engine
 * decodes SVG in a Worker (`createImageBitmap` of an SVG blob is refused and
 * there is no `Image` there), so rasterising stays on the main thread, one
 * frame at a time with an `await` per frame. The CPU-heavy encoding runs off
 * the main thread: WebCodecs encoders are native, GIF runs in a Worker,
 * `toBlob` / `convertToBlob` are asynchronous.
 */
import { serializeSvg } from '@/lib/vector/exportSvg';
import { sampleDoc } from '@/lib/vector/sampleTrack';
import { vectorDocSchema, type VectorDoc } from '@/lib/vector/vectorTypes';

export interface FrameSize {
  width: number;
  height: number;
}

/** Number of frames for a span: `ceil(durationMs / 1000 * fps)`, at least 1. */
export function frameCount(durationMs: number, fps: number): number {
  if (!(fps > 0)) throw new Error('fps must be positive');
  const n = Math.ceil((Math.max(0, durationMs) / 1000) * fps - 1e-9);
  return Math.max(1, n);
}

/** Frame `i` sits at `startMs + i / fps` seconds (ms, unrounded). */
export function frameTime(i: number, fps: number, startMs = 0): number {
  return startMs + (i * 1000) / fps;
}

/** Every frame time of a span, in order. */
export function frameTimes(durationMs: number, fps: number, startMs = 0): number[] {
  const n = frameCount(durationMs, fps);
  return Array.from({ length: n }, (_, i) => frameTime(i, fps, startMs));
}

export class RasterUnsafeError extends Error {
  constructor(readonly issues: string[]) {
    super(`Unsafe document for raster export: ${issues.join('; ')}`);
    this.name = 'RasterUnsafeError';
  }
}

/**
 * Re-validate the document with the full schema (ids, references, raw-markup
 * rules, image href pattern) before any frame is rasterised. Hand-built or
 * tampered documents that bypassed the editor never reach an `<img>`.
 */
export function prepareRasterDoc(doc: VectorDoc): VectorDoc {
  const parsed = vectorDocSchema.safeParse(doc);
  if (!parsed.success) throw new RasterUnsafeError(parsed.error.issues.map((i) => `${i.message}${i.path.length ? ` at ${i.path.join('.')}` : ''}`));
  const issues = rasterSafetyIssues(serializeSvg(parsed.data));
  if (issues.length) throw new RasterUnsafeError(issues);
  return parsed.data;
}

const DATA_IMAGE = String.raw`data:image\/(?:png|jpeg|gif|webp|avif);base64,`;
const EXTERNAL_REF = new RegExp(String.raw`(?:^|[\s"'])(?:xlink:)?(?:href|src)\s*=\s*["']\s*(?!#|${DATA_IMAGE})`, 'i');

/**
 * Defence in depth on the exact text handed to `<img>`: no script, no HTML
 * island, no external reference of any kind (href/src other than `#id` or a
 * base64 raster data URI, `url()` other than `url(#id)`, `@import`), no
 * DOCTYPE/entity declarations. Returns the problems found ([] = safe).
 */
export function rasterSafetyIssues(svg: string): string[] {
  const issues: string[] = [];
  if (/<\s*script/i.test(svg)) issues.push('script');
  if (/<\s*foreignObject/i.test(svg)) issues.push('foreignObject');
  if (/<!DOCTYPE|<!ENTITY/i.test(svg)) issues.push('declaration');
  if (EXTERNAL_REF.test(svg)) issues.push('external reference');
  if (/url\(\s*["']?\s*(?!#)/i.test(svg)) issues.push('external url()');
  if (/@import/i.test(svg)) issues.push('@import');
  if (/javascript:|vbscript:/i.test(svg)) issues.push('script URL');
  return issues;
}

/**
 * The frame-baked static SVG for time `tMs` at an output size: every animated
 * property resolved to a constant, the root `width`/`height` set to the output
 * size (the viewBox is unchanged, so the drawing scales). Pure and
 * deterministic: the same inputs always give the same bytes.
 */
export function bakeFrameSvg(doc: VectorDoc, tMs: number, size: FrameSize): string {
  const frame = sampleDoc(doc, tMs);
  return serializeSvg({ ...frame, canvas: { ...frame.canvas, width: size.width, height: size.height } });
}

/** What the renderer draws on (a canvas element or an `OffscreenCanvas`). */
export interface RasterCanvas {
  width: number;
  height: number;
  getContext(kind: '2d', options?: { colorSpace?: 'srgb'; willReadFrequently?: boolean; alpha?: boolean }): RasterContext | null;
}

export interface RasterContext {
  clearRect(x: number, y: number, w: number, h: number): void;
  fillRect(x: number, y: number, w: number, h: number): void;
  drawImage(image: unknown, x: number, y: number, w: number, h: number): void;
  getImageData(x: number, y: number, w: number, h: number): { data: Uint8ClampedArray; width: number; height: number };
  fillStyle: unknown;
}

/** Browser seams, injectable for tests (a fake canvas, a fake image loader). */
export interface FrameEnv {
  createCanvas(width: number, height: number): RasterCanvas;
  /** Load and decode an image URL; resolves once it can be drawn. */
  loadImage(url: string): Promise<unknown>;
  createObjectURL(blob: Blob): string;
  revokeObjectURL(url: string): void;
}

/** The real browser environment: OffscreenCanvas when present, else a canvas element. */
export function browserFrameEnv(): FrameEnv {
  return {
    createCanvas(width, height) {
      if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(width, height) as unknown as RasterCanvas;
      const c = document.createElement('canvas');
      c.width = width;
      c.height = height;
      return c as unknown as RasterCanvas;
    },
    async loadImage(url) {
      const img = new Image();
      img.decoding = 'async';
      img.src = url;
      await img.decode();
      return img;
    },
    createObjectURL: (blob) => URL.createObjectURL(blob),
    revokeObjectURL: (url) => URL.revokeObjectURL(url),
  };
}

export interface FrameRendererOptions {
  /**
   * Paint drawn under the SVG: a CSS colour (MP4/WebM flatten onto it, GIF
   * without transparency too) or null to keep transparency (PNG, GIF with
   * transparency on).
   */
  underlay: string | null;
  env?: FrameEnv;
}

export interface FrameRenderer {
  readonly canvas: RasterCanvas;
  readonly size: FrameSize;
  /** Draw the frame at `tMs` onto the shared canvas and return it. */
  render(tMs: number): Promise<RasterCanvas>;
  /** RGBA pixels of the canvas as last rendered. */
  pixels(): Uint8ClampedArray;
}

/**
 * One renderer per export: one canvas, reused for every frame. Each frame's
 * Blob URL is revoked as soon as the image has decoded (or failed).
 */
export function createFrameRenderer(doc: VectorDoc, size: FrameSize, options: FrameRendererOptions): FrameRenderer {
  const env = options.env ?? browserFrameEnv();
  const safe = prepareRasterDoc(doc);
  const canvas = env.createCanvas(size.width, size.height);
  const ctx = canvas.getContext('2d', { colorSpace: 'srgb', willReadFrequently: false });
  if (!ctx) throw new Error('2D canvas unavailable');
  return {
    canvas,
    size,
    async render(tMs) {
      const svg = bakeFrameSvg(safe, tMs, size);
      const issues = rasterSafetyIssues(svg);
      if (issues.length) throw new RasterUnsafeError(issues);
      const url = env.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
      let image: unknown;
      try {
        image = await env.loadImage(url);
      } finally {
        env.revokeObjectURL(url);
      }
      ctx.clearRect(0, 0, size.width, size.height);
      if (options.underlay) {
        ctx.fillStyle = options.underlay;
        ctx.fillRect(0, 0, size.width, size.height);
      }
      ctx.drawImage(image, 0, 0, size.width, size.height);
      return canvas;
    },
    pixels() {
      return ctx.getImageData(0, 0, size.width, size.height).data;
    },
  };
}

/**
 * Convenience for a single frame (decision 1's `renderFrame`): RGBA pixels of
 * the document at `tMs`, transparent background kept.
 */
export async function renderFrame(doc: VectorDoc, tMs: number, size: FrameSize, env?: FrameEnv): Promise<{ data: Uint8ClampedArray; width: number; height: number }> {
  const r = createFrameRenderer(doc, size, { underlay: null, env });
  await r.render(tMs);
  return { data: r.pixels(), width: size.width, height: size.height };
}
