'use client';

import * as React from 'react';

import { BrushRaster, bakeBrush, brushRasterSize } from '@/lib/photo/brushEngine';
import { geometryOutputSize } from '@/lib/photo/colorMath';
import { applyCropRemap, patchGeometry } from '@/lib/photo/geometryOps';
import { HealStrokes } from '@/lib/photo/healOps';
import { getCachedAlpha, setCachedAlpha } from '@/lib/photo/maskAssets';
import { addComponent, addRedEye, brushBudget, maskOfLayer, setBrushComponent, updateComponent } from '@/lib/photo/maskOps';
import { usePhotoStore } from '@/lib/photo/photoStore';
import { useToolStore } from '@/lib/photo/toolStore';
import {
  dragCrop,
  fitAspectRect,
  aspectValue,
  gradientFromDrag,
  isZeroPerspective,
  movePerspectiveCorner,
  radialFromDrag,
  straightenAngle,
  withAutoCrop,
  type CropHandle,
  type PerspectiveCorner,
} from '@/lib/photo/toolMath';
import { onMaskAdded } from '@/lib/photo/seams';
import { toImage, type View } from '@/lib/photo/view';
import { cn } from '@/lib/utils';
import { getHealStrokes, setHealStrokes } from './heal-session';

export interface ToolOverlayProps {
  view: View;
  /** Displayed (geometry-corrected, or uncropped while a geometry tool is active) size in image px. */
  iw: number;
  ih: number;
  wrap: HTMLDivElement | null;
  source: { width: number; height: number };
  /** Called when a signed-out visitor or a pointer-only tool needs the editor to re-read the doc. */
  onHealStrokes?: (count: number) => void;
}

type Pt = { x: number; y: number };

/** All canvas tools: gradient, radial, brush, colour-range eyedropper, crop, straighten, perspective, heal, red-eye. */
export function ToolOverlay({ view, iw, ih, wrap, source, onHealStrokes }: ToolOverlayProps) {
  const tool = useToolStore((s) => s.tool);
  const grid = useToolStore((s) => s.grid);
  const doc = usePhotoStore((s) => s.doc);
  const layerId = useToolStore((s) => s.maskLayerId);
  const compIdx = useToolStore((s) => s.component);
  const brush = useToolStore((s) => s.brush);
  const aspect = useToolStore((s) => s.aspect);
  const [drag, setDrag] = React.useState<{ a: Pt; b: Pt } | null>(null);
  const [stroke, setStroke] = React.useState<Pt[]>([]);
  const [cropDraft, setCropDraft] = React.useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const rafSeen = React.useRef(false);
  const state = React.useRef<{ kind: string; a?: Pt; handle?: CropHandle | PerspectiveCorner; rect0?: { x: number; y: number; width: number; height: number }; raster?: BrushRaster; pts?: Pt[] } | null>(null);
  void rafSeen;

  const toNorm = (e: React.PointerEvent): Pt => {
    const r = wrap?.getBoundingClientRect();
    const p = toImage(view, e.clientX - (r?.left ?? 0), e.clientY - (r?.top ?? 0), iw, ih);
    return { x: p.nx, y: p.ny };
  };
  const px = (p: Pt) => ({ left: view.x + p.x * iw * view.zoom, top: view.y + p.y * ih * view.zoom });

  const mutate = usePhotoStore.getState().mutate;
  const geo = doc?.geometry;

  // The crop draft follows the document crop when the crop tool opens.
  const docCrop = geo?.crop ?? null;
  const [seenCrop, setSeenCrop] = React.useState<{ tool: string; crop: unknown } | null>(null);
  if (!seenCrop || seenCrop.tool !== tool || seenCrop.crop !== docCrop) {
    setSeenCrop({ tool, crop: docCrop });
    setCropDraft(tool === 'crop' ? docCrop ?? { x: 0, y: 0, width: 1, height: 1 } : null);
  }

  if (!doc || tool === 'none' || !geo) return null;

  const outFull = geometryOutputSize({ ...geo, crop: null }, source.width, source.height);

  const commitCrop = async (rect: { x: number; y: number; width: number; height: number } | null) => {
    const base = usePhotoStore.getState().doc;
    if (!base) return;
    const next = await applyCropRemap(base, rect);
    mutate('Crop', () => next);
  };

  const down = (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    const p = toNorm(e);
    if (tool === 'gradient' || tool === 'radial' || tool === 'straighten') {
      state.current = { kind: tool, a: p };
      setDrag({ a: p, b: p });
    } else if (tool === 'brush' || tool === 'heal') {
      const size = tool === 'brush' ? brush.size : brush.size;
      state.current = { kind: tool, pts: [p] };
      setStroke([p]);
      if (tool === 'brush' && layerId) {
        const out = geometryOutputSize(geo, source.width, source.height);
        const r = brushRasterSize(out.width, out.height);
        const m = maskOfLayer(doc, layerId);
        const c = m && compIdx >= 0 ? m.components[compIdx] : m?.components.find((x) => x.kind === 'brush');
        const existing = c && c.kind === 'brush' ? getCachedAlpha(c.png) : null;
        state.current.raster = BrushRaster.from(existing, r.width, r.height);
        const k = r.width / out.width;
        state.current.raster.stamp(p.x * r.width, p.y * r.height, size * k, brush);
      }
    } else if (tool === 'eyedropper') {
      state.current = { kind: 'eyedropper' };
    } else if (tool === 'redEye') {
      const { redEyeRadius } = useToolStore.getState();
      const out = geometryOutputSize(geo, source.width, source.height);
      const r = addRedEye(doc, p.x, p.y, redEyeRadius, out.width, out.height);
      mutate('Red-eye', () => r.doc, r.layerId);
      onMaskAdded('radial');
    }
  };

  const move = (e: React.PointerEvent) => {
    const st = state.current;
    if (!st) return;
    const p = toNorm(e);
    if (st.kind === 'gradient' || st.kind === 'radial' || st.kind === 'straighten') setDrag({ a: st.a as Pt, b: p });
    else if (st.kind === 'brush' || st.kind === 'heal') {
      const pts = st.pts as Pt[];
      const prev = pts[pts.length - 1];
      pts.push(p);
      setStroke([...pts]);
      if (st.kind === 'brush' && st.raster) {
        const out = geometryOutputSize(geo, source.width, source.height);
        const k = st.raster.width / out.width;
        st.raster.stroke({ x: prev.x * st.raster.width, y: prev.y * st.raster.height }, { x: p.x * st.raster.width, y: p.y * st.raster.height }, brush.size * k, brush);
      }
    } else if (st.kind === 'comp' && layerId) {
      const h = st.handle as unknown as 'from' | 'to' | 'center' | 'rx' | 'ry';
      const cur = usePhotoStore.getState().doc;
      const c = cur ? maskOfLayer(cur, layerId)?.components[compIdx] : undefined;
      if (!cur || !c) return;
      if (c.kind === 'gradient' && (h === 'from' || h === 'to')) mutate('Mask', (d) => updateComponent(d, layerId, compIdx, { [h]: { x: p.x, y: p.y } } as never));
      else if (c.kind === 'radial') {
        if (h === 'center') mutate('Mask', (d) => updateComponent(d, layerId, compIdx, { center: { x: p.x, y: p.y } } as never));
        else if (h === 'rx') mutate('Mask', (d) => updateComponent(d, layerId, compIdx, { rx: Math.min(2, Math.abs(p.x - c.center.x)) } as never));
        else if (h === 'ry') mutate('Mask', (d) => updateComponent(d, layerId, compIdx, { ry: Math.min(2, Math.abs(p.y - c.center.y)) } as never));
      }
    } else if ((st.kind === 'crop' || st.kind === 'persp') && st.a) {
      if (st.kind === 'crop') {
        const out = outFull;
        const next = dragCrop(st.rect0 as NonNullable<typeof st.rect0>, st.handle as CropHandle, p.x - st.a.x, p.y - st.a.y, out.width, out.height, aspectValue(aspect, source.width, source.height));
        setCropDraft(next);
      } else {
        const corner = st.handle as PerspectiveCorner;
        const cur = usePhotoStore.getState().doc;
        if (!cur) return;
        const next = movePerspectiveCorner(cur.geometry.perspective, corner, p.x - st.a.x, p.y - st.a.y);
        st.a = p;
        mutate('Perspective', (d) => patchGeometry(d, { perspective: isZeroPerspective(next) ? null : next }));
      }
    }
  };

  const up = (e: React.PointerEvent) => {
    const st = state.current;
    state.current = null;
    if (!st) return;
    const p = toNorm(e);
    if (st.kind === 'comp') {
      usePhotoStore.getState().endGesture();
      return;
    }
    if (st.kind === 'persp') {
      usePhotoStore.getState().endGesture();
      const { autoCrop } = useToolStore.getState();
      if (autoCrop) {
        const cur = usePhotoStore.getState().doc;
        if (cur) mutate('Auto-crop', (d) => patchGeometry(d, withAutoCrop(d.geometry, source.width, source.height, undefined)));
      }
      return;
    }
    if (st.kind === 'crop') {
      setDrag(null);
      const rect = cropDraft;
      if (rect) void commitCrop(rect);
      return;
    }
    if (st.kind === 'gradient' && st.a) {
      setDrag(null);
      if (Math.hypot((p.x - st.a.x) * iw, (p.y - st.a.y) * ih) < 4) return;
      const g = gradientFromDrag(st.a, p);
      ensureMask((d, id) => {
        const m = maskOfLayer(d, id);
        const c = compIdx >= 0 ? m?.components[compIdx] : undefined;
        if (c?.kind === 'gradient') return updateComponent(d, id, compIdx, g);
        onMaskAdded('gradient');
        return addComponent(d, id, { kind: 'gradient', mode: 'add', feather: 0, ...g });
      });
    } else if (st.kind === 'radial' && st.a) {
      setDrag(null);
      if (Math.hypot((p.x - st.a.x) * iw, (p.y - st.a.y) * ih) < 4) return;
      const r = radialFromDrag(st.a, p);
      ensureMask((d, id) => {
        const m = maskOfLayer(d, id);
        const c = compIdx >= 0 ? m?.components[compIdx] : undefined;
        if (c?.kind === 'radial') return updateComponent(d, id, compIdx, r);
        onMaskAdded('radial');
        return addComponent(d, id, { kind: 'radial', mode: 'add', feather: 0.5, ...r });
      });
    } else if (st.kind === 'straighten' && st.a) {
      setDrag(null);
      if (Math.hypot((p.x - st.a.x) * iw, (p.y - st.a.y) * ih) < 8) return;
      const a = { x: st.a.x * iw, y: st.a.y * ih };
      const b = { x: p.x * iw, y: p.y * ih };
      mutate('Straighten', (d) => patchGeometry(d, { rotate: straightenAngle(d.geometry.rotate, a, b) }));
      if (useToolStore.getState().autoCrop) mutate('Auto-crop', (d) => patchGeometry(d, withAutoCrop(d.geometry, source.width, source.height)));
      useToolStore.getState().setTool('none');
    } else if (st.kind === 'brush' && st.raster) {
      setStroke([]);
      const raster = st.raster;
      void (async () => {
        const baked = await bakeBrush(raster);
        setCachedAlpha(baked.png, raster.toAlphaImage());
        const base = usePhotoStore.getState().doc;
        if (!base || !layerId) return;
        if (brushBudget(base).full) return;
        const idx = compIdx >= 0 && maskOfLayer(base, layerId)?.components[compIdx]?.kind === 'brush' ? compIdx : undefined;
        const had = !!maskOfLayer(base, layerId)?.components.some((c) => c.kind === 'brush');
        mutate('Brush', (d) => setBrushComponent(d, layerId, baked.png, baked.width, baked.height, idx));
        if (!had) onMaskAdded('brush');
      })();
    } else if (st.kind === 'heal') {
      const pts = (st.pts as Pt[]).slice();
      setStroke([]);
      const out = geometryOutputSize(geo, source.width, source.height);
      let sess = getHealStrokes();
      if (!sess) {
        sess = new HealStrokes(geo, source.width, source.height, out.width, out.height);
        setHealStrokes(sess);
      }
      sess.addStroke(pts, brush.size);
      onHealStrokes?.(sess.count);
    } else if (st.kind === 'eyedropper') {
      // Handled by the canvas pick (colour-range targets use the picked pixel).
    }
  };

  /** Make sure the mask layer exists, then apply `fn` as one history entry. */
  function ensureMask(fn: (d: NonNullable<typeof doc>, id: string) => NonNullable<typeof doc>) {
    if (!layerId) return;
    mutate('Mask', (d) => fn(d, layerId));
  }

  // ---- handle starts -------------------------------------------------------
  const startCropHandle = (h: CropHandle) => (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.currentTarget.parentElement as HTMLElement).setPointerCapture?.(e.pointerId);
    state.current = { kind: 'crop', a: toNorm(e), handle: h, rect0: cropDraft ?? { x: 0, y: 0, width: 1, height: 1 } };
  };
  const startCompHandle = (kind: 'from' | 'to' | 'center' | 'rx' | 'ry') => (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.currentTarget.parentElement as HTMLElement).setPointerCapture?.(e.pointerId);
    usePhotoStore.getState().beginGesture('Mask');
    state.current = { kind: 'comp', handle: kind as never };
  };
  const startPerspective = (c: PerspectiveCorner) => (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.currentTarget.parentElement as HTMLElement).setPointerCapture?.(e.pointerId);
    usePhotoStore.getState().beginGesture('Perspective');
    state.current = { kind: 'persp', a: toNorm(e), handle: c };
  };

  const polyline = (pts: Pt[]) => pts.map((q) => `${view.x + q.x * iw * view.zoom},${view.y + q.y * ih * view.zoom}`).join(' ');

  const persp = geo.perspective;
  const corners: Record<PerspectiveCorner, Pt> = {
    tl: { x: persp?.tl.x ?? 0, y: persp?.tl.y ?? 0 },
    tr: { x: 1 + (persp?.tr.x ?? 0), y: persp?.tr.y ?? 0 },
    br: { x: 1 + (persp?.br.x ?? 0), y: 1 + (persp?.br.y ?? 0) },
    bl: { x: persp?.bl.x ?? 0, y: 1 + (persp?.bl.y ?? 0) },
  };

  const HANDLES: CropHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
  const handlePos = (r: { x: number; y: number; width: number; height: number }, h: CropHandle): Pt => ({
    x: h.includes('w') ? r.x : h.includes('e') ? r.x + r.width : r.x + r.width / 2,
    y: h.includes('n') ? r.y : h.includes('s') ? r.y + r.height : r.y + r.height / 2,
  });

  // Reset-to-aspect when a preset is chosen while cropping (see geometry panel): exposed through the draft.
  void fitAspectRect;

  return (
    <div
      className={cn('absolute inset-0 z-10', tool === 'brush' || tool === 'heal' ? 'cursor-none' : 'cursor-crosshair')}
      data-testid="tool-overlay"
      data-tool={tool}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      style={{ touchAction: 'none' }}
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        {(grid || tool === 'crop' || tool === 'straighten') ? (
          <g stroke="rgba(255,255,255,.45)" strokeWidth="1">
            {[1, 2].map((i) => (
              <React.Fragment key={i}>
                <line x1={view.x + (iw * view.zoom * i) / 3} y1={view.y} x2={view.x + (iw * view.zoom * i) / 3} y2={view.y + ih * view.zoom} />
                <line x1={view.x} y1={view.y + (ih * view.zoom * i) / 3} x2={view.x + iw * view.zoom} y2={view.y + (ih * view.zoom * i) / 3} />
              </React.Fragment>
            ))}
          </g>
        ) : null}
        {drag && (tool === 'gradient' || tool === 'straighten') ? (
          <line x1={px(drag.a).left} y1={px(drag.a).top} x2={px(drag.b).left} y2={px(drag.b).top} stroke="#facc15" strokeWidth="2" />
        ) : null}
        {drag && tool === 'radial' ? (
          <ellipse cx={px(drag.a).left} cy={px(drag.a).top} rx={Math.abs(drag.b.x - drag.a.x) * iw * view.zoom} ry={Math.abs(drag.b.y - drag.a.y) * ih * view.zoom} fill="rgba(250,204,21,.15)" stroke="#facc15" strokeWidth="2" />
        ) : null}
        {stroke.length > 0 && (tool === 'brush' || tool === 'heal') ? (
          <polyline points={polyline(stroke)} fill="none" stroke="rgba(239,68,68,.55)" strokeWidth={Math.max(1, brush.size * view.zoom)} strokeLinecap="round" strokeLinejoin="round" />
        ) : null}
        {tool === 'heal' && getHealStrokes()
          ? (getHealStrokes() as NonNullable<ReturnType<typeof getHealStrokes>>).strokes.map((s, i) => (
              <polyline key={i} points={polyline(s.pts)} fill="none" stroke="rgba(239,68,68,.55)" strokeWidth={Math.max(1, s.size * view.zoom)} strokeLinecap="round" strokeLinejoin="round" />
            ))
          : null}
        {tool === 'crop' && cropDraft ? (
          <>
            <path
              fillRule="evenodd"
              fill="rgba(0,0,0,.55)"
              d={`M${view.x},${view.y}h${iw * view.zoom}v${ih * view.zoom}h${-iw * view.zoom}z M${px(cropDraft).left},${px(cropDraft).top}h${cropDraft.width * iw * view.zoom}v${cropDraft.height * ih * view.zoom}h${-cropDraft.width * iw * view.zoom}z`}
            />
            <rect x={px(cropDraft).left} y={px(cropDraft).top} width={cropDraft.width * iw * view.zoom} height={cropDraft.height * ih * view.zoom} fill="none" stroke="#fff" strokeWidth="1.5" />
          </>
        ) : null}
        {tool === 'perspective' ? (
          <polygon points={(['tl', 'tr', 'br', 'bl'] as const).map((c) => `${px(corners[c]).left},${px(corners[c]).top}`).join(' ')} fill="none" stroke="#facc15" strokeWidth="1.5" />
        ) : null}
      </svg>

      {tool === 'crop' && cropDraft ? (
        <>
          <div
            className="absolute"
            style={{ left: px(cropDraft).left, top: px(cropDraft).top, width: cropDraft.width * iw * view.zoom, height: cropDraft.height * ih * view.zoom, cursor: 'move' }}
            data-testid="crop-rect"
            onPointerDown={startCropHandle('move')}
          />
          {HANDLES.map((h) => (
            <div
              key={h}
              data-testid={`crop-handle-${h}`}
              className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-black/60 bg-white"
              style={{ left: px(handlePos(cropDraft, h)).left, top: px(handlePos(cropDraft, h)).top, cursor: `${h}-resize` }}
              onPointerDown={startCropHandle(h)}
            />
          ))}
        </>
      ) : null}
      {(tool === 'gradient' || tool === 'radial') && layerId && compIdx >= 0
        ? (() => {
            const c = maskOfLayer(doc, layerId)?.components[compIdx];
            const dot = (key: string, pos: Pt, cls = 'bg-yellow-300') => (
              <div
                key={key}
                data-testid={`mask-handle-${key}`}
                className={`absolute size-3.5 -translate-x-1/2 -translate-y-1/2 cursor-move rounded-full border-2 border-black/60 ${cls}`}
                style={{ left: px(pos).left, top: px(pos).top }}
                onPointerDown={startCompHandle(key as never)}
              />
            );
            if (c?.kind === 'gradient') return [dot('from', c.from), dot('to', c.to)];
            if (c?.kind === 'radial') return [dot('center', c.center), dot('rx', { x: c.center.x + c.rx, y: c.center.y }), dot('ry', { x: c.center.x, y: c.center.y + c.ry })];
            return null;
          })()
        : null}
      {tool === 'perspective'
        ? (['tl', 'tr', 'br', 'bl'] as const).map((c) => (
            <div
              key={c}
              data-testid={`persp-handle-${c}`}
              className="absolute size-4 -translate-x-1/2 -translate-y-1/2 cursor-move rounded-full border-2 border-black/60 bg-yellow-300"
              style={{ left: px(corners[c]).left, top: px(corners[c]).top }}
              onPointerDown={startPerspective(c)}
            />
          ))
        : null}
    </div>
  );
}
