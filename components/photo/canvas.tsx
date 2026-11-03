'use client';

import * as React from 'react';

import { useLocalization } from '@/i18n/useLocalization';
import { geometryOutputSize } from '@/lib/photo/colorMath';
import { cpuPreviewSize, renderCpuPreviewSized } from '@/lib/photo/gl/cpuPreview';
import type { MaskView } from '@/lib/photo/gl/maskPlan';
import { cachedMaskAssets, docAssetIds, ensureDocAssets, getCachedAlpha } from '@/lib/photo/maskAssets';
import { PhotoRenderer, webgl2Available } from '@/lib/photo/gl/photoRenderer';
import type { PhotoDoc } from '@/lib/photo/photoTypes';
import { fitView, panBy, pinch, toImage, zoomAt, type View } from '@/lib/photo/view';
import { cn } from '@/lib/utils';

export interface PhotoSourceInfo {
  bitmap: ImageBitmap;
  width: number;
  height: number;
}

export interface CanvasHandle {
  fit: () => void;
  actualSize: () => void;
  zoomBy: (factor: number) => void;
  /** RGBA8 of the current preview (top-down), for the histogram. */
  readPixels: () => Uint8Array | null;
}

export interface PhotoCanvasProps {
  source: PhotoSourceInfo | null;
  doc: PhotoDoc | null;
  /** Hold-to-compare: show the unedited source. */
  showOriginal: boolean;
  /** 0..1 split position, or null for no split view. */
  split: number | null;
  onSplitChange: (v: number) => void;
  /** Eyedropper armed: the next click reports the pixel (0..255). */
  picking: boolean;
  onPick: (rgb: { r: number; g: number; b: number }) => void;
  onReducedPreview: (reduced: boolean) => void;
  onRendered: () => void;
  handleRef?: React.Ref<CanvasHandle>;
  /** MM98: mask view of `viewLayerId`'s mask (`M`). */
  maskView?: MaskView;
  viewLayerId?: string | null;
  /** MM98: fetch a project's mask file (`masks/<id>.png`) for subject masks. */
  fetchMaskBlob?: (ref: string) => Promise<Blob>;
  /** MM98: canvas tools draw above the image in viewport space and own the pointer while active. */
  overlay?: (ctx: { view: View; iw: number; ih: number; wrap: HTMLDivElement | null }) => React.ReactNode;
  toolActive?: boolean;
}

/** Canvas viewport: WebGL2 preview (or CPU fallback), wheel/pinch zoom, drag pan, split view, eyedropper. */
export function PhotoCanvas({ source, doc, showOriginal, split, onSplitChange, picking, onPick, onReducedPreview, onRendered, handleRef, maskView = 'off', viewLayerId = null, fetchMaskBlob, overlay, toolActive = false }: PhotoCanvasProps) {
  const { t } = useLocalization('interface');
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const glRef = React.useRef<HTMLCanvasElement>(null);
  const cpuRef = React.useRef<HTMLCanvasElement>(null);
  const origRef = React.useRef<HTMLCanvasElement>(null);
  const renderer = React.useRef<PhotoRenderer | null>(null);
  const [mode, setMode] = React.useState<'gl' | 'cpu'>('gl');
  const [view, setView] = React.useState<View>({ zoom: 1, x: 0, y: 0 });
  const viewRef = React.useRef(view);
  React.useEffect(() => {
    viewRef.current = view;
  }, [view]);
  const pointers = React.useRef(new Map<number, { x: number; y: number }>());
  const lastPinch = React.useRef<number | null>(null);
  const dragging = React.useRef(false);
  const histCanvas = React.useRef<HTMLCanvasElement | null>(null);
  const cpuPixels = React.useRef<{ w: number; h: number; data: Uint8ClampedArray } | null>(null);

  // The displayed size is the geometry-corrected size (crop/rotate change it); the source stays the texture.
  const out = source && doc ? geometryOutputSize(doc.geometry, source.width, source.height) : { width: source?.width ?? 0, height: source?.height ?? 0 };
  const iw = showOriginal && source ? source.width : out.width;
  const ih = showOriginal && source ? source.height : out.height;
  const cachedMaskAssetsView = cachedMaskAssets;
  const [assetTick, setAssetTick] = React.useState(0);

  const size = () => {
    const r = wrapRef.current?.getBoundingClientRect();
    return { w: r?.width ?? 0, h: r?.height ?? 0 };
  };
  const fit = React.useCallback(() => {
    const s = size();
    setView(fitView(s.w, s.h, iw, ih));
  }, [iw, ih]);

  React.useImperativeHandle(
    handleRef,
    () => ({
      fit,
      actualSize: () => {
        const s = size();
        setView({ zoom: 1, x: (s.w - iw) / 2, y: (s.h - ih) / 2 });
      },
      zoomBy: (f) => {
        const s = size();
        setView((v) => zoomAt(v, s.w / 2, s.h / 2, f));
      },
      readPixels: () => {
        // A <= 256 px downscale of what is on screen: cheap enough for the 200 ms histogram.
        const src = mode === 'gl' ? glRef.current : cpuRef.current;
        if (!src || !src.width || !src.height) return null;
        try {
          const k = Math.min(1, 256 / Math.max(src.width, src.height));
          const w = Math.max(1, Math.round(src.width * k));
          const h = Math.max(1, Math.round(src.height * k));
          const c = (histCanvas.current ??= document.createElement('canvas'));
          c.width = w;
          c.height = h;
          const ctx = c.getContext('2d', { willReadFrequently: true });
          if (!ctx) return null;
          ctx.drawImage(src, 0, 0, w, h);
          return new Uint8Array(ctx.getImageData(0, 0, w, h).data.buffer);
        } catch {
          return null;
        }
      },
    }),
    [fit, iw, ih, mode],
  );

  // Source changes: pick the renderer, upload, fit.
  React.useEffect(() => {
    if (!source) return;
    let useGl = webgl2Available();
    if (useGl) {
      try {
        renderer.current?.dispose();
        renderer.current = new PhotoRenderer(glRef.current as HTMLCanvasElement);
        renderer.current.setSource(source.bitmap, source.width, source.height);
        onReducedPreview(renderer.current.sourceScale < 1);
      } catch {
        useGl = false;
      }
    }
    // Renderer choice depends on a runtime capability probe; this is the one place it is known.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(useGl ? 'gl' : 'cpu');
    if (!useGl) onReducedPreview(true);
    // original (for split view + CPU path)
    const o = origRef.current;
    if (o) {
      o.width = source.width;
      o.height = source.height;
      o.getContext('2d')?.drawImage(source.bitmap, 0, 0);
    }
    fit();
    return () => {
      renderer.current?.dispose();
      renderer.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  // Brush/subject pixels: decode what the document needs, hand them to the renderer, re-render.
  React.useEffect(() => {
    if (!doc) return;
    let alive = true;
    const ids = docAssetIds(doc);
    if (ids.length === 0) return;
    void ensureDocAssets(doc, fetchMaskBlob).then(() => {
      if (!alive) return;
      let changed = false;
      for (const a of ids) {
        const img = getCachedAlpha(a.id);
        if (img && renderer.current && !renderer.current.hasAlpha(a.id)) {
          renderer.current.setAlpha(a.id, img);
          changed = true;
        }
      }
      if (changed || mode === 'cpu') setAssetTick((n) => n + 1);
    });
    return () => {
      alive = false;
    };
  }, [doc, fetchMaskBlob, mode, source]);

  // Render on change (coalesced to one frame).
  React.useEffect(() => {
    if (!source || !doc) return;
    const id = requestAnimationFrame(() => {
      const effective = showOriginal ? { layers: [], geometry: undefined, masks: undefined } : doc;
      if (mode === 'gl' && renderer.current) {
        renderer.current.render(showOriginal ? { ...doc, layers: [], masks: undefined, geometry: { ...doc.geometry, rotate: 0, flipH: false, flipV: false, perspective: null, crop: null } } : doc, { maskView, viewLayerId });
      } else if (mode === 'cpu' && cpuRef.current && origRef.current) {
        const sz = cpuPreviewSize(source.width, source.height);
        const tmp = document.createElement('canvas');
        tmp.width = sz.width;
        tmp.height = sz.height;
        const tctx = tmp.getContext('2d');
        if (!tctx) return;
        tctx.drawImage(origRef.current, 0, 0, sz.width, sz.height);
        const img = tctx.getImageData(0, 0, sz.width, sz.height);
        const res = renderCpuPreviewSized(effective, sz.width, sz.height, img.data, cachedMaskAssetsView);
        cpuPixels.current = { w: res.width, h: res.height, data: res.data };
        cpuRef.current.width = res.width;
        cpuRef.current.height = res.height;
        cpuRef.current.getContext('2d')?.putImageData(new ImageData(res.data as unknown as Uint8ClampedArray<ArrayBuffer>, res.width, res.height), 0, 0);
      }
      onRendered();
    });
    return () => cancelAnimationFrame(id);
  }, [source, doc, showOriginal, mode, onRendered, maskView, viewLayerId, assetTick]);

  // Keep the fit when the viewport resizes.
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => fit());
    ro.observe(el);
    return () => ro.disconnect();
  }, [fit]);

  const onWheel = (e: React.WheelEvent) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    const factor = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015));
    setView((v) => zoomAt(v, e.clientX - r.left, e.clientY - r.top, factor));
  };

  const pickAt = (e: React.PointerEvent) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r || !source) return;
    const p = toImage(viewRef.current, e.clientX - r.left, e.clientY - r.top, iw, ih);
    if (!p.inside) return;
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    // Sample the CURRENT preview (what the user sees) so picks match the edit state.
    const src = mode === 'gl' ? glRef.current : cpuRef.current;
    if (!src) return;
    const sx = (p.nx * src.width) | 0;
    const sy = (p.ny * src.height) | 0;
    ctx.drawImage(src, sx, sy, 1, 1, 0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    onPick({ r: d[0], g: d[1], b: d[2] });
  };

  const onDown = (e: React.PointerEvent) => {
    if (toolActive) return;
    if (picking) {
      pickAt(e);
      return;
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    dragging.current = true;
    lastPinch.current = null;
  };
  const onMove = (e: React.PointerEvent) => {
    if (toolActive) return;
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const r = wrapRef.current?.getBoundingClientRect();
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size >= 2 && r) {
      const [a, b] = Array.from(pointers.current.values());
      const p = pinch(a, b);
      if (lastPinch.current) setView((v) => zoomAt(v, p.cx - r.left, p.cy - r.top, p.dist / (lastPinch.current as number)));
      lastPinch.current = p.dist;
      return;
    }
    setView((v) => panBy(v, e.clientX - prev.x, e.clientY - prev.y));
  };
  const onUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) lastPinch.current = null;
    if (pointers.current.size === 0) dragging.current = false;
  };

  const style: React.CSSProperties = {
    width: iw,
    height: ih,
    transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
    transformOrigin: '0 0',
    imageRendering: view.zoom > 2 ? 'pixelated' : 'auto',
  };

  return (
    <div
      ref={wrapRef}
      dir="ltr"
      data-testid="photo-canvas"
      aria-label={t('photo.bar.compare')}
      className={cn('relative h-full min-h-64 w-full touch-none overflow-hidden bg-[repeating-conic-gradient(var(--surface-2,#222)_0_25%,var(--surface-1,#1a1a1a)_0_50%)] bg-[length:20px_20px]', picking || toolActive ? 'cursor-crosshair' : 'cursor-grab')}
      onWheel={onWheel}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <canvas ref={glRef} className={cn('absolute left-0 top-0', mode === 'gl' ? '' : 'hidden')} style={style} aria-hidden="true" />
      <canvas ref={cpuRef} className={cn('absolute left-0 top-0', mode === 'cpu' ? '' : 'hidden')} style={style} aria-hidden="true" />
      {/* The untouched source: feeds the CPU path and the split-view left half. */}
      <canvas
        ref={origRef}
        className="pointer-events-none absolute left-0 top-0"
        style={{ ...style, visibility: split !== null ? 'visible' : 'hidden', clipPath: split !== null ? `inset(0 ${(1 - split) * 100}% 0 0)` : undefined }}
        aria-hidden="true"
      />
      {overlay ? overlay({ view, iw, ih, wrap: wrapRef.current }) : null}
      {split !== null && source ? (
        <div
          className="absolute top-0 h-full w-0.5 cursor-ew-resize bg-primary"
          style={{ left: view.x + view.zoom * iw * split }}
          role="slider"
          tabIndex={0}
          aria-label={t('photo.bar.split')}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(split * 100)}
          onPointerDown={(e) => {
            e.stopPropagation();
            (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!(e.buttons & 1)) return;
            const r = wrapRef.current?.getBoundingClientRect();
            if (!r) return;
            const p = toImage(viewRef.current, e.clientX - r.left, 0, iw, ih);
            onSplitChange(Math.min(1, Math.max(0, p.nx)));
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') onSplitChange(Math.max(0, split - 0.02));
            if (e.key === 'ArrowRight') onSplitChange(Math.min(1, split + 0.02));
          }}
        />
      ) : null}
    </div>
  );
}
