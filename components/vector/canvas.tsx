'use client';

import * as React from 'react';

import { useLocalization } from '@/i18n/useLocalization';
import {
  HANDLE_IDS,
  HANDLE_SPECS,
  SNAP_THRESHOLD_PX,
  apply,
  boxCorners,
  boxFromPoints,
  boxesIntersect,
  handleScaleFactors,
  invert,
  snapMove,
  type Box,
  type HandleId,
  type Matrix,
  type Pt,
} from '@/lib/vector/geometry';
import { docIds, findLayer, localToDocMatrix, nextId, updateLayer } from '@/lib/vector/layerTree';
import { moveHandle, moveNode, parsePath, pathNodes, serializePath, type PathSegment } from '@/lib/vector/pathData';
import { DRAW_TOOLS, type ToolMachine } from '@/lib/vector/tools';
import { setText, type TextState } from '@/lib/vector/tools/text';
import type { DrawToolId, ToolModifiers } from '@/lib/vector/tools/types';
import {
  anchorDocPoint,
  isLocked,
  layerDocBounds,
  layerFrame,
  rotateLayers,
  scaleLayerLocal,
  scaleLayersDoc,
  selectionBounds,
  setLayerAnchorDoc,
  transformableIds,
  translateLayers,
} from '@/lib/vector/transformOps';
import { sampleDoc } from '@/lib/vector/sampleTrack';
import { useVectorStore } from '@/lib/vector/vectorStore';
import { forEachLayer, type Layer, type PathLayer, type VectorDoc } from '@/lib/vector/vectorTypes';
import { DefsNodes, LayerNodes } from './render';

/**
 * The Motion canvas: pan/zoom, select (click, marquee, shift-add), move,
 * scale (8 handles, shift = uniform), rotate (handle), anchor-point drag,
 * snap to canvas edges/centre, the draw tools and pen node editing.
 *
 * Editing works on the MODEL: pointer positions are converted to document
 * coordinates and fed to the pure ops in `lib/vector/transformOps.ts` / the
 * tool machines; the SVG below is re-rendered from the store. A pointer drag
 * is one undo step (`beginGesture`/`endGesture`), and every drag re-applies
 * its ops to the document captured at pointer-down (no drift).
 *
 * The canvas is always LTR (only the editor chrome mirrors for RTL locales).
 *
 * MM44: the canvas shows the document AT THE PLAYHEAD (`sampleDoc`), and every
 * drag edits that sampled view; `foldAt` turns changes to animated properties
 * into keyframes at the playhead (or autokeys), and the rest into static
 * edits of the stored document. Without tracks this is exactly MM42's
 * behaviour. Pointer-down pauses playback.
 */

export interface View {
  /** Screen px per document unit. */
  zoom: number;
  /** Screen position of document (viewBox) origin, relative to the viewport. */
  panX: number;
  panY: number;
}

export const MIN_ZOOM = 0.05;
export const MAX_ZOOM = 64;
const HANDLE_PX = 8;
const ROTATE_OFFSET_PX = 24;

type Drag =
  | { kind: 'pan'; start: Pt; view: View }
  | { kind: 'marquee'; start: Pt; current: Pt; additive: boolean; base: string[] }
  | { kind: 'move'; start: Pt; base: VectorDoc; ids: string[]; box: Box | null }
  | { kind: 'scale'; handle: HandleId; base: VectorDoc; ids: string[]; single: { id: string; box: Box; toDoc: Matrix } | null; box: Box }
  | { kind: 'rotate'; base: VectorDoc; ids: string[]; centre: Pt; startAngle: number }
  | { kind: 'anchor'; base: VectorDoc; id: string }
  | { kind: 'node'; base: VectorDoc; id: string; segIndex: number; start: Pt; toLocal: Matrix }
  | { kind: 'handle'; base: VectorDoc; id: string; segIndex: number; which: 'in' | 'out'; toLocal: Matrix }
  | { kind: 'tool' };

export interface CanvasProps {
  view: View;
  onViewChange: (v: View) => void;
  /** Ticket decision 10: one seam for `vector_tool_used` (MM49). */
  onToolUsed?: (tool: DrawToolId) => void;
  /** Draw a 1-unit pixel grid? (editor-only). */
  className?: string;
}

/** Fit the canvas into a viewport with a margin. */
export function fitView(doc: VectorDoc, width: number, height: number, margin = 48): View {
  const vb = doc.canvas.viewBox;
  const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.min((width - margin * 2) / vb.width, (height - margin * 2) / vb.height)));
  return {
    zoom,
    panX: (width - vb.width * zoom) / 2 - vb.x * zoom,
    panY: (height - vb.height * zoom) / 2 - vb.y * zoom,
  };
}

/** Zoom by `factor` keeping the screen point `at` fixed. */
export function zoomAt(view: View, factor: number, at: Pt): View {
  const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, view.zoom * factor));
  const k = zoom / view.zoom;
  return { zoom, panX: at.x - (at.x - view.panX) * k, panY: at.y - (at.y - view.panY) * k };
}

const mods = (e: { shiftKey: boolean; altKey: boolean }): ToolModifiers => ({ shift: e.shiftKey, alt: e.altKey });

export function VectorCanvas({ view, onViewChange, onToolUsed, className }: CanvasProps) {
  const { t } = useLocalization('interface');
  const storedDoc = useVectorStore((s) => s.doc);
  const time = useVectorStore((s) => s.time);
  // The render tree at the playhead (transient; `storedDoc` itself when nothing is animated).
  const doc = React.useMemo(() => (storedDoc ? sampleDoc(storedDoc, time) : null), [storedDoc, time]);
  const selection = useVectorStore((s) => s.selection);
  const tool = useVectorStore((s) => s.tool);
  /** The stored document at pointer-down (drags fold their edits into it). */
  const rootRef = React.useRef<VectorDoc | null>(null);
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<SVGGElement>(null);
  const dragRef = React.useRef<Drag | null>(null);
  const [marquee, setMarquee] = React.useState<Box | null>(null);
  const [guides, setGuides] = React.useState<{ x?: number; y?: number }>({});
  const [spaceDown, setSpaceDown] = React.useState(false);
  // Draw tool machine state (opaque per tool), keyed by the tool it belongs
  // to so switching tools starts the new one fresh without an effect.
  // Handlers read the ref (updated synchronously) so back-to-back pointer
  // events never act on a state from before the last re-render.
  const [toolSlot, setToolSlot] = React.useState<{ tool: string; state: unknown } | null>(null);
  const toolRef = React.useRef<{ tool: string; state: unknown } | null>(null);
  const machine = tool in DRAW_TOOLS ? (DRAW_TOOLS[tool as DrawToolId] as ToolMachine<unknown>) : null;
  const machineState = machine ? (toolSlot?.tool === tool ? toolSlot.state : machine.initial) : null;
  const currentToolState = () => (machine ? (toolRef.current?.tool === tool ? toolRef.current.state : machine.initial) : null);
  const setToolState = React.useCallback(
    (state: unknown) => {
      toolRef.current = { tool, state };
      setToolSlot({ tool, state });
    },
    [tool],
  );
  const ctx = React.useMemo(() => ({ zoom: view.zoom }), [view.zoom]);

  const toDoc = React.useCallback(
    (clientX: number, clientY: number): Pt => {
      const r = viewportRef.current?.getBoundingClientRect();
      const sx = clientX - (r?.left ?? 0);
      const sy = clientY - (r?.top ?? 0);
      return { x: (sx - view.panX) / view.zoom, y: (sy - view.panY) / view.zoom };
    },
    [view],
  );
  const toScreen = React.useCallback((p: Pt): Pt => ({ x: p.x * view.zoom + view.panX, y: p.y * view.zoom + view.panY }), [view]);

  const store = useVectorStore;

  const commitToolLayer = React.useCallback(
    (layer: Layer) => {
      const s = store.getState();
      if (!s.doc) return;
      const id = nextId(docIds(s.doc), layer.type);
      s.addLayers([{ ...layer, id } as Layer], `Draw ${layer.type}`);
      onToolUsed?.(machine?.id ?? (layer.type as DrawToolId));
    },
    [machine, onToolUsed, store],
  );

  const runTool = React.useCallback(
    (step: { state: unknown; commit?: Layer }) => {
      setToolState(step.state);
      if (step.commit) commitToolLayer(step.commit);
    },
    [commitToolLayer, setToolState],
  );

  // ---- hit testing (from the rendered model) ----
  const hitLayer = React.useCallback(
    (target: EventTarget | null, deep: boolean): string | null => {
      if (!doc) return null;
      const el = (target as Element | null)?.closest?.('[data-layer-id]');
      const id = el?.getAttribute('data-layer-id');
      if (!id) return null;
      const layer = findLayer(doc.layers, id);
      if (!layer || isLocked(doc.layers, id)) return null;
      if (deep) return id;
      // Select the outermost unlocked root-level ancestor (groups select as a unit).
      let topId = id;
      let cursor: Element | null = el?.parentElement?.closest('[data-layer-id]') ?? null;
      while (cursor) {
        const pid = cursor.getAttribute('data-layer-id');
        if (pid && !isLocked(doc.layers, pid)) topId = pid;
        cursor = cursor.parentElement?.closest('[data-layer-id]') ?? null;
      }
      return topId;
    },
    [doc],
  );

  // ---- pointer handlers ----
  const onPointerDown = (e: React.PointerEvent) => {
    if (!doc || e.button === 2) return;
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    const p = toDoc(e.clientX, e.clientY);
    const s = store.getState();
    s.setPlaying(false);
    // Layer and keyframe selection are separate focuses: Delete on the canvas means layers.
    s.setKeySelection([]);
    rootRef.current = s.doc;

    if (e.button === 1 || tool === 'hand' || spaceDown) {
      dragRef.current = { kind: 'pan', start: { x: e.clientX, y: e.clientY }, view };
      return;
    }

    if (machine) {
      dragRef.current = { kind: 'tool' };
      runTool(machine.pointerDown(currentToolState(), p, mods(e), ctx) as { state: unknown; commit?: Layer });
      return;
    }

    const target = e.target as Element;
    const handle = target.closest?.('[data-handle]')?.getAttribute('data-handle');
    if (handle) {
      startHandleDrag(handle, p, e);
      return;
    }

    const deep = tool === 'node' || e.detail >= 2;
    const hit = hitLayer(e.target, deep);
    if (hit) {
      let sel = s.selection;
      if (e.shiftKey) {
        s.toggleSelected(hit);
        sel = store.getState().selection;
        if (!sel.includes(hit)) return;
      } else if (!sel.includes(hit)) {
        s.setSelection([hit]);
        sel = [hit];
      }
      if (tool === 'node') return;
      const ids = transformableIds(doc, sel);
      if (ids.length === 0) return;
      s.beginGesture('Move');
      dragRef.current = { kind: 'move', start: p, base: doc, ids, box: selectionBounds(doc, ids) };
      return;
    }
    if (!e.shiftKey) s.setSelection([]);
    dragRef.current = { kind: 'marquee', start: p, current: p, additive: e.shiftKey, base: e.shiftKey ? s.selection : [] };
  };

  const startHandleDrag = (handle: string, p: Pt, e: React.PointerEvent) => {
    if (!doc) return;
    const s = store.getState();
    const ids = transformableIds(doc, s.selection);
    if (handle.startsWith('node:') || handle.startsWith('in:') || handle.startsWith('out:')) {
      const [kind, id, idx] = handle.split(':');
      const toLocal = invert(localToDocMatrix(doc.layers, id));
      s.beginGesture('Edit path');
      dragRef.current =
        kind === 'node'
          ? { kind: 'node', base: doc, id, segIndex: Number(idx), start: apply(toLocal, p), toLocal }
          : { kind: 'handle', base: doc, id, segIndex: Number(idx), which: kind as 'in' | 'out', toLocal };
      return;
    }
    if (ids.length === 0) return;
    if (handle === 'rotate') {
      const single = ids.length === 1 ? anchorDocPoint(doc, ids[0]) : null;
      const box = selectionBounds(doc, ids);
      const centre = single ?? (box ? { x: box.x + box.width / 2, y: box.y + box.height / 2 } : p);
      s.beginGesture('Rotate');
      dragRef.current = { kind: 'rotate', base: doc, ids, centre, startAngle: Math.atan2(p.y - centre.y, p.x - centre.x) };
      return;
    }
    if (handle === 'anchor' && ids.length === 1) {
      s.beginGesture('Move anchor');
      dragRef.current = { kind: 'anchor', base: doc, id: ids[0] };
      return;
    }
    if ((HANDLE_IDS as string[]).includes(handle)) {
      const frame = ids.length === 1 ? layerFrame(doc, ids[0]) : null;
      const box = selectionBounds(doc, ids);
      if (!box) return;
      s.beginGesture('Scale');
      dragRef.current = {
        kind: 'scale',
        handle: handle as HandleId,
        base: doc,
        ids,
        single: frame ? { id: ids[0], ...frame } : null,
        box,
      };
    }
    void e;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    const p = toDoc(e.clientX, e.clientY);
    const s = store.getState();
    // Re-apply the drag's op to the pointer-down view and fold it into the stored document.
    const commit = (label: string, sampledBase: VectorDoc, edited: VectorDoc) => {
      const root = rootRef.current;
      s.mutate(label, () => (root ? s.foldAt(root, sampledBase, edited) : edited));
    };
    if (machine && (!drag || drag.kind === 'tool')) {
      runTool(machine.pointerMove(currentToolState(), p, mods(e), ctx) as { state: unknown; commit?: Layer });
      return;
    }
    if (!drag) return;
    switch (drag.kind) {
      case 'pan':
        onViewChange({ ...drag.view, panX: drag.view.panX + e.clientX - drag.start.x, panY: drag.view.panY + e.clientY - drag.start.y });
        return;
      case 'marquee': {
        drag.current = p;
        const box = boxFromPoints(drag.start, p);
        setMarquee(box);
        if (!doc) return;
        const hits: string[] = [];
        for (const l of doc.layers) {
          if (l.type === 'raw' || l.hidden || isLocked(doc.layers, l.id)) continue;
          const b = layerDocBounds(doc, l.id);
          if (b && boxesIntersect(b, box)) hits.push(l.id);
        }
        s.setSelection(drag.additive ? Array.from(new Set([...drag.base, ...hits])) : hits);
        return;
      }
      case 'move': {
        let dx = p.x - drag.start.x;
        let dy = p.y - drag.start.y;
        if (e.shiftKey) {
          if (Math.abs(dx) > Math.abs(dy)) dy = 0;
          else dx = 0;
        }
        let g: { x?: number; y?: number } = {};
        if (drag.box && !e.altKey && doc) {
          const snapped = snapMove(drag.box, dx, dy, doc.canvas.viewBox, SNAP_THRESHOLD_PX / view.zoom);
          ({ dx, dy } = snapped);
          g = snapped.guides;
        }
        setGuides(g);
        commit('Move', drag.base, translateLayers(drag.base, drag.ids, dx, dy));
        return;
      }
      case 'scale': {
        if (drag.single) {
          const local = apply(invert(drag.single.toDoc), p);
          const { fx, fy, fixed } = handleScaleFactors(drag.single.box, drag.handle, local, e.shiftKey);
          commit('Scale', drag.base, scaleLayerLocal(drag.base, drag.single.id, fx, fy, fixed));
        } else {
          const { fx, fy, fixed } = handleScaleFactors(drag.box, drag.handle, p, e.shiftKey);
          commit('Scale', drag.base, scaleLayersDoc(drag.base, drag.ids, fx, fy, fixed));
        }
        return;
      }
      case 'rotate': {
        let deg = ((Math.atan2(p.y - drag.centre.y, p.x - drag.centre.x) - drag.startAngle) * 180) / Math.PI;
        if (e.shiftKey) deg = Math.round(deg / 15) * 15;
        commit('Rotate', drag.base, rotateLayers(drag.base, drag.ids, deg, drag.ids.length > 1 ? drag.centre : undefined));
        return;
      }
      case 'anchor':
        commit('Move anchor', drag.base, setLayerAnchorDoc(drag.base, drag.id, p));
        return;
      case 'node':
      case 'handle': {
        const layer = findLayer(drag.base.layers, drag.id) as PathLayer | undefined;
        if (!layer || layer.type !== 'path') return;
        let segs: PathSegment[];
        try {
          segs = parsePath(layer.d);
        } catch {
          return;
        }
        const local = apply(drag.toLocal, p);
        const next =
          drag.kind === 'node'
            ? moveNode(segs, drag.segIndex, local.x - drag.start.x, local.y - drag.start.y)
            : moveHandle(segs, drag.segIndex, drag.which, local, e.altKey ? false : 'angle');
        const d = serializePath(next);
        commit('Edit path', drag.base, {
          ...drag.base,
          layers: updateLayer(drag.base.layers, drag.id, (l) => (l.type === 'path' ? { ...l, d } : l)),
        });
        return;
      }
      case 'tool':
        return;
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    dragRef.current = null;
    setMarquee(null);
    setGuides({});
    const p = toDoc(e.clientX, e.clientY);
    if (machine && drag?.kind === 'tool') {
      runTool(machine.pointerUp(currentToolState(), p, mods(e), ctx) as { state: unknown; commit?: Layer });
      return;
    }
    if (drag && drag.kind !== 'pan' && drag.kind !== 'marquee') store.getState().endGesture();
  };

  const onWheel = React.useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const r = viewportRef.current?.getBoundingClientRect();
      const at = { x: e.clientX - (r?.left ?? 0), y: e.clientY - (r?.top ?? 0) };
      if (e.ctrlKey || e.metaKey) onViewChange(zoomAt(view, Math.exp(-e.deltaY * 0.01), at));
      else onViewChange({ ...view, panX: view.panX - e.deltaX, panY: view.panY - e.deltaY });
    },
    [onViewChange, view],
  );

  React.useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  // ---- keyboard: tool keys, nudge, Esc ----
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      if (e.key === ' ' && e.type === 'keydown') setSpaceDown(true);
      if (e.key === ' ' && e.type === 'keyup') setSpaceDown(false);
      if (e.type !== 'keydown') return;
      const s = store.getState();
      const ts = currentToolState();
      if (machine && machine.busy(ts) && ['Enter', 'Escape', 'Backspace'].includes(e.key)) {
        e.preventDefault();
        runTool(machine.key(ts, e.key, mods(e), ctx) as { state: unknown; commit?: Layer });
        return;
      }
      if (e.key === 'Escape' && dragRef.current) {
        dragRef.current = null;
        setMarquee(null);
        setGuides({});
        s.cancelGesture();
        return;
      }
      const arrows: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      if (arrows[e.key] && s.selection.length > 0) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        s.nudgeSelection(arrows[e.key][0] * step, arrows[e.key][1] * step);
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- currentToolState reads a ref
  }, [ctx, machine, tool, runTool, store]);

  if (!doc) return null;

  const vb = doc.canvas.viewBox;
  const preview = machine ? machine.preview(machineState) : null;
  const textEditing = tool === 'text' && (machineState as TextState | null)?.phase === 'editing' ? (machineState as Extract<TextState, { phase: 'editing' }>) : null;
  const cursor = spaceDown || tool === 'hand' ? 'grab' : machine ? 'crosshair' : 'default';

  return (
    <div
      ref={viewportRef}
      dir="ltr"
      role="application"
      aria-label={t('vector.canvas.label')}
      className={`relative h-full w-full touch-none select-none overflow-hidden bg-surface-0 ${className ?? ''}`}
      style={{ cursor }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="vector-checker" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill="#1b1f25" />
            <rect width="8" height="8" fill="#232830" />
            <rect x="8" y="8" width="8" height="8" fill="#232830" />
          </pattern>
        </defs>
        <g transform={`translate(${view.panX} ${view.panY}) scale(${view.zoom})`}>
          {/* Artboard: transparency checker, then the background, then the document. */}
          <rect x={vb.x} y={vb.y} width={vb.width} height={vb.height} fill="url(#vector-checker)" />
          {doc.canvas.background !== 'transparent' && <rect x={vb.x} y={vb.y} width={vb.width} height={vb.height} fill={doc.canvas.background} />}
          <svg x={vb.x} y={vb.y} width={vb.width} height={vb.height} viewBox={`${vb.x} ${vb.y} ${vb.width} ${vb.height}`} overflow="visible">
            <DefsNodes doc={doc} opts={{ idPrefix: 'v-' }} />
            <g ref={contentRef}>
              <LayerNodes layers={doc.layers} opts={{ idPrefix: 'v-', interactive: true }} />
            </g>
            {preview && (
              <g pointerEvents="none" opacity={0.85}>
                <LayerNodes layers={[preview]} opts={{ idPrefix: 'v-' }} />
              </g>
            )}
          </svg>
          <rect x={vb.x} y={vb.y} width={vb.width} height={vb.height} fill="none" stroke="var(--edge-strong)" strokeWidth={1 / view.zoom} pointerEvents="none" />
        </g>
        <Overlay doc={doc} selection={selection} tool={tool} toScreen={toScreen} view={view} />
        {guides.x !== undefined && (
          <line x1={toScreen({ x: guides.x, y: 0 }).x} x2={toScreen({ x: guides.x, y: 0 }).x} y1={0} y2="100%" stroke="var(--accent-data)" strokeDasharray="4 3" pointerEvents="none" />
        )}
        {guides.y !== undefined && (
          <line y1={toScreen({ x: 0, y: guides.y }).y} y2={toScreen({ x: 0, y: guides.y }).y} x1={0} x2="100%" stroke="var(--accent-data)" strokeDasharray="4 3" pointerEvents="none" />
        )}
        {marquee && (
          <rect
            x={toScreen(marquee).x}
            y={toScreen(marquee).y}
            width={marquee.width * view.zoom}
            height={marquee.height * view.zoom}
            fill="color-mix(in srgb, var(--accent-data) 12%, transparent)"
            stroke="var(--accent-data)"
            strokeDasharray="4 3"
            pointerEvents="none"
          />
        )}
      </svg>
      {textEditing && (
        <TextEntry
          screen={toScreen(textEditing.at)}
          zoom={view.zoom}
          value={textEditing.text}
          placeholder={t('vector.tools.textPlaceholder')}
          onChange={(text) => setToolState(setText((currentToolState() as TextState) ?? textEditing, text))}
          onKey={(key) => runTool(textEditingKey(machine, currentToolState(), key, ctx))}
        />
      )}
    </div>
  );
}

function textEditingKey(machine: ToolMachine<unknown> | null, state: unknown, key: string, ctx: { zoom: number }) {
  return machine ? (machine.key(state, key, {}, ctx) as { state: unknown; commit?: Layer }) : { state };
}

function TextEntry({
  screen,
  zoom,
  value,
  placeholder,
  onChange,
  onKey,
}: {
  screen: Pt;
  zoom: number;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  onKey: (key: string) => void;
}) {
  const ref = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => ref.current?.focus(), []);
  const size = Math.max(12, 32 * zoom);
  return (
    <input
      ref={ref}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
          e.preventDefault();
          onKey(e.key);
        }
      }}
      className="absolute rounded-sm border border-data bg-surface-1/90 px-1 text-foreground outline-none"
      style={{ left: screen.x, top: screen.y - size * 1.1, fontSize: size, lineHeight: 1.1, minWidth: 120 }}
    />
  );
}

/** Selection chrome in SCREEN space so handles keep a constant size. */
function Overlay({
  doc,
  selection,
  tool,
  toScreen,
  view,
}: {
  doc: VectorDoc;
  selection: string[];
  tool: string;
  toScreen: (p: Pt) => Pt;
  view: View;
}) {
  const ids = transformableIds(doc, selection);
  const lockedSel = selection.filter((id) => !ids.includes(id));
  const outline = (id: string, locked: boolean) => {
    const b = layerDocBounds(doc, id);
    if (!b) return null;
    const p = toScreen(b);
    return (
      <rect
        key={`o-${id}`}
        x={p.x}
        y={p.y}
        width={b.width * view.zoom}
        height={b.height * view.zoom}
        fill="none"
        stroke={locked ? 'var(--edge-control)' : 'var(--accent-data)'}
        strokeDasharray={locked ? '3 3' : undefined}
        pointerEvents="none"
      />
    );
  };

  if (tool === 'node') {
    return (
      <g>
        {selection.map((id) => outline(id, false))}
        {ids.map((id) => (
          <PathNodes key={id} doc={doc} id={id} toScreen={toScreen} />
        ))}
      </g>
    );
  }
  if (ids.length === 0) return <g>{lockedSel.map((id) => outline(id, true))}</g>;

  // One layer: oriented frame from its local box; several: the union box.
  const single = ids.length === 1 ? layerFrame(doc, ids[0]) : null;
  const box = single?.box ?? selectionBounds(doc, ids);
  if (!box) return null;
  const toDocM: Matrix = single?.toDoc ?? [1, 0, 0, 1, 0, 0];
  const corners = boxCorners(box).map((c) => toScreen(apply(toDocM, c)));
  const at = (u: number, v: number) => toScreen(apply(toDocM, { x: box.x + box.width * u, y: box.y + box.height * v }));
  const topMid = at(0.5, 0);
  const centre = at(0.5, 0.5);
  const dirLen = Math.hypot(topMid.x - centre.x, topMid.y - centre.y) || 1;
  const rot = { x: topMid.x + ((topMid.x - centre.x) / dirLen) * ROTATE_OFFSET_PX, y: topMid.y + ((topMid.y - centre.y) / dirLen) * ROTATE_OFFSET_PX };
  const anchor = ids.length === 1 ? anchorDocPoint(doc, ids[0]) : null;
  const anchorS = anchor ? toScreen(anchor) : null;

  return (
    <g>
      {ids.length > 1 && ids.map((id) => outline(id, false))}
      {lockedSel.map((id) => outline(id, true))}
      <polygon points={corners.map((c) => `${c.x},${c.y}`).join(' ')} fill="none" stroke="var(--accent-data)" pointerEvents="none" />
      <line x1={topMid.x} y1={topMid.y} x2={rot.x} y2={rot.y} stroke="var(--accent-data)" pointerEvents="none" />
      <circle data-handle="rotate" cx={rot.x} cy={rot.y} r={HANDLE_PX / 2 + 1} fill="var(--surface-1)" stroke="var(--accent-data)" style={{ cursor: 'grab' }} />
      {HANDLE_IDS.map((h) => {
        const spec = HANDLE_SPECS[h];
        const c = at(spec.u, spec.v);
        return (
          <rect
            key={h}
            data-handle={h}
            x={c.x - HANDLE_PX / 2}
            y={c.y - HANDLE_PX / 2}
            width={HANDLE_PX}
            height={HANDLE_PX}
            fill="var(--surface-1)"
            stroke="var(--accent-data)"
            style={{ cursor: `${h}-resize` }}
          />
        );
      })}
      {anchorS && (
        <g data-handle="anchor" style={{ cursor: 'move' }}>
          <circle cx={anchorS.x} cy={anchorS.y} r={5} fill="none" stroke="var(--accent-primary)" strokeWidth={1.5} />
          <circle cx={anchorS.x} cy={anchorS.y} r={1.5} fill="var(--accent-primary)" />
          <circle cx={anchorS.x} cy={anchorS.y} r={8} fill="transparent" />
        </g>
      )}
    </g>
  );
}

/** Node-edit handles for a path layer. */
function PathNodes({ doc, id, toScreen }: { doc: VectorDoc; id: string; toScreen: (p: Pt) => Pt }) {
  const layer = findLayer(doc.layers, id);
  if (!layer || layer.type !== 'path') return null;
  let nodes;
  try {
    nodes = pathNodes(parsePath(layer.d));
  } catch {
    return null;
  }
  const m = localToDocMatrix(doc.layers, id);
  const S = (p: Pt) => toScreen(apply(m, p));
  return (
    <g>
      {nodes.map((n) => {
        const c = S(n);
        return (
          <g key={n.segIndex}>
            {n.in && <HandleDot from={c} to={S(n.in)} handle={`in:${id}:${n.segIndex}`} />}
            {n.out && <HandleDot from={c} to={S(n.out)} handle={`out:${id}:${n.segIndex}`} />}
            <rect data-handle={`node:${id}:${n.segIndex}`} x={c.x - 4} y={c.y - 4} width={8} height={8} fill="var(--surface-1)" stroke="var(--accent-data)" style={{ cursor: 'move' }} />
          </g>
        );
      })}
    </g>
  );
}

function HandleDot({ from, to, handle }: { from: Pt; to: Pt; handle: string }) {
  return (
    <>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="var(--accent-data)" strokeOpacity={0.6} pointerEvents="none" />
      <circle data-handle={handle} cx={to.x} cy={to.y} r={4} fill="var(--accent-data)" style={{ cursor: 'move' }} />
    </>
  );
}

/** Ids of every layer in the document (for tests and the layer panel). */
export function allLayerIds(doc: VectorDoc): string[] {
  const ids: string[] = [];
  forEachLayer({ layers: doc.layers, defs: { gradients: [], masks: [], clipPaths: [], filters: [], symbols: [] } }, (l) => ids.push(l.id));
  return ids;
}
