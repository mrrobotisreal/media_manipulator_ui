'use client';

import * as React from 'react';
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  ChevronDown,
  ChevronRight,
  ClipboardPaste,
  Copy,
  Diamond,
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
  Spline,
  Timer,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLocalization } from '@/i18n/useLocalization';
import { findTrack, keyId, layerKeyTimes, moveKeyframes, removeKeyframes, type KeyRef } from '@/lib/vector/keyframes';
import { layerLabel } from '@/lib/vector/layerTree';
import { formatTimecode, snapToFrame } from '@/lib/vector/playback';
import { EDITABLE_PROPERTIES, type EditableProperty } from '@/lib/vector/properties';
import { useVectorStore } from '@/lib/vector/vectorStore';
import { docLoops, type Easing, type Layer, type VectorDoc } from '@/lib/vector/vectorTypes';
import { cn } from '@/lib/utils';
import { BezierEditor } from './bezier-editor';
import { IconButton } from './layer-panel';

/**
 * The Motion timeline (ticket MM44 decision 4), built on Instrument tokens:
 * transport (play/pause, start/end, loop, autokey, duration), a time ruler
 * with playhead scrub and in/out markers (the play range), zoom, layer rows
 * with expandable property tracks, and keyframe diamonds (click / shift-click
 * select, drag in time with frame snap — Alt disables it —, delete,
 * copy / paste, easing popover).
 *
 * Time flows left to right in every locale, so the timeline is LTR like the
 * canvas. Scrub, play and range are view state (no history); every keyframe
 * edit is one undo step through the store's `mutate`.
 */

/** i18n key of a property label: `transform.rotation` → `vector.properties.rotation`. */
export const propertyKey = (p: string) => `vector.properties.${p.replace(/^transform\./, '')}`;

const LABEL_W = 208;
const ROW_H = 26;
const MIN_PX_PER_SEC = 20;
const MAX_PX_PER_SEC = 2400;
const TICK_STEPS = [10, 20, 50, 100, 200, 250, 500, 1000, 2000, 5000, 10_000, 30_000, 60_000];

interface Row {
  layer: Exclude<Layer, { type: 'raw' }>;
  depth: number;
}

/** Layer tree, top of the paint order first (like the layer panel), raw layers skipped. */
export function timelineRows(layers: Layer[], depth = 0): Row[] {
  const out: Row[] = [];
  for (const l of [...layers].reverse()) {
    if (l.type === 'raw') continue;
    out.push({ layer: l, depth });
    if (l.type === 'group') out.push(...timelineRows(l.children, depth + 1));
  }
  return out;
}

/** Properties a layer shows when expanded (a line has no fill). */
export function rowProperties(layer: Layer): EditableProperty[] {
  return EDITABLE_PROPERTIES.filter((p) => !(p === 'fill' && layer.type === 'line'));
}

function tickStep(pxPerMs: number): number {
  return TICK_STEPS.find((s) => s * pxPerMs >= 64) ?? 60_000;
}

const secondsLabel = (ms: number) => `${Math.round(ms) / 1000}s`;

/** The common easing of the selected keys, or null when they differ. */
function commonEasing(doc: VectorDoc, refs: KeyRef[]): Easing | null {
  let out: string | null = null;
  let value: Easing | null = null;
  for (const r of refs) {
    const k = findTrack(doc, r.layerId, r.property)?.keyframes.find((x) => x.t === r.t);
    if (!k) continue;
    const s = JSON.stringify(k.easing);
    if (out === null) {
      out = s;
      value = k.easing;
    } else if (out !== s) return null;
  }
  return value;
}

interface KeyDrag {
  refs: KeyRef[];
  base: VectorDoc;
  startX: number;
  anchor: number;
  moved: boolean;
  pointerId: number;
}

export function Timeline() {
  const { t } = useLocalization('interface');
  const doc = useVectorStore((s) => s.doc);
  const time = useVectorStore((s) => s.time);
  const playing = useVectorStore((s) => s.playing);
  const range = useVectorStore((s) => s.range);
  const autokey = useVectorStore((s) => s.autokey);
  const keySelection = useVectorStore((s) => s.keySelection);
  const selection = useVectorStore((s) => s.selection);
  const hasClipboard = useVectorStore((s) => (s.keyClipboard?.entries.length ?? 0) > 0);
  const [pxPerSec, setPxPerSec] = React.useState(160);
  const [expanded, setExpanded] = React.useState<ReadonlySet<string>>(() => new Set());
  const areaRef = React.useRef<HTMLDivElement>(null);
  const keyDrag = React.useRef<KeyDrag | null>(null);
  const scrubbing = React.useRef<null | 'playhead' | 'in' | 'out'>(null);
  const store = useVectorStore;

  const selectedKeys = React.useMemo(() => new Set(keySelection.map(keyId)), [keySelection]);

  if (!doc) return null;
  const pxPerMs = pxPerSec / 1000;
  const width = Math.max(1, doc.duration * pxPerMs);
  const rows = timelineRows(doc.layers);
  const step = tickStep(pxPerMs);
  const ticks: number[] = [];
  for (let ms = 0; ms <= doc.duration; ms += step) ticks.push(ms);
  const loop = docLoops(doc);
  const s = () => store.getState();

  const timeAt = (clientX: number, alt: boolean) => {
    const r = areaRef.current?.getBoundingClientRect();
    const raw = (clientX - (r?.left ?? 0)) / pxPerMs;
    const clamped = Math.min(doc.duration, Math.max(0, raw));
    return alt ? Math.round(clamped) : Math.min(doc.duration, snapToFrame(clamped, doc.fps));
  };

  // ---- ruler: scrub the playhead, drag in/out markers ----
  const onRulerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    const marker = (e.target as Element).closest?.('[data-marker]')?.getAttribute('data-marker');
    scrubbing.current = marker === 'in' || marker === 'out' ? marker : 'playhead';
    s().setPlaying(false);
    if (scrubbing.current === 'playhead') s().setTime(timeAt(e.clientX, e.altKey));
  };
  const onRulerMove = (e: React.PointerEvent) => {
    const mode = scrubbing.current;
    if (!mode) return;
    const at = timeAt(e.clientX, e.altKey);
    if (mode === 'playhead') s().setTime(at);
    else {
      const cur = s().range ?? { start: 0, end: doc.duration };
      s().setRange(mode === 'in' ? { start: Math.min(at, cur.end - 1), end: cur.end } : { start: cur.start, end: Math.max(at, cur.start + 1) });
    }
  };
  const onRulerUp = () => {
    scrubbing.current = null;
  };

  // ---- keyframe diamonds ----
  const onKeyDown = (refs: KeyRef[]) => (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    const st = s();
    const allSelected = refs.every((r) => selectedKeys.has(keyId(r)));
    let sel = st.keySelection;
    if (e.shiftKey) {
      if (allSelected) sel = sel.filter((r) => !refs.some((x) => keyId(x) === keyId(r)));
      else sel = [...sel, ...refs.filter((r) => !selectedKeys.has(keyId(r)))];
      st.setKeySelection(sel);
      return;
    }
    if (!allSelected) {
      sel = refs;
      st.setKeySelection(sel);
    }
    const live = store.getState().keySelection;
    if (!st.doc || live.length === 0) return;
    keyDrag.current = { refs: live, base: st.doc, startX: e.clientX, anchor: refs[0].t, moved: false, pointerId: e.pointerId };
    // A moved diamond re-mounts (it is keyed by time), so the drag follows the
    // window, not the element.
    const move = (ev: PointerEvent) => onKeyMove(ev);
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      onKeyUp();
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };
  const onKeyMove = (e: PointerEvent) => {
    const d = keyDrag.current;
    if (!d || e.pointerId !== d.pointerId) return;
    if (!d.moved && Math.abs(e.clientX - d.startX) < 3) return;
    const st = s();
    if (!d.moved) {
      d.moved = true;
      st.beginGesture('Move keyframes');
    }
    const raw = d.anchor + (e.clientX - d.startX) / pxPerMs;
    const target = e.altKey ? Math.round(raw) : snapToFrame(raw, doc.fps);
    const moved = moveKeyframes(d.base, d.refs, target - d.anchor);
    st.mutate('Move keyframes', () => moved.doc);
    st.setKeySelection(moved.refs);
  };
  const onKeyUp = () => {
    const d = keyDrag.current;
    keyDrag.current = null;
    if (d?.moved) s().endGesture();
  };

  const onTrackDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if (!e.shiftKey) s().setKeySelection([]);
    s().setPlaying(false);
    s().setTime(timeAt(e.clientX, e.altKey));
  };

  const toggleExpanded = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleKeyAt = (layerId: string, property: EditableProperty) => {
    const st = s();
    if (!st.doc) return;
    const track = findTrack(st.doc, layerId, property);
    if (track?.keyframes.some((k) => k.t === st.time)) {
      st.mutate('Delete keyframe', (d) => removeKeyframes(d, [{ layerId, property, t: st.time }]));
    } else st.addKeyframe(layerId, property);
  };

  const addKeysForSelection = () => {
    const st = s();
    if (!st.doc) return;
    const props = st.doc.animations.filter((tr) => st.selection.includes(tr.layerId));
    if (props.length === 0) return;
    st.beginGesture('Add keyframe');
    for (const tr of props) st.addKeyframe(tr.layerId, tr.property as EditableProperty);
    st.endGesture();
  };
  const canAddKeys = doc.animations.some((tr) => selection.includes(tr.layerId));

  const easing = keySelection.length > 0 ? commonEasing(doc, keySelection) : null;
  const playheadX = time * pxPerMs;

  const diamond = (refs: KeyRef[], at: number, summary: boolean, label: string) => {
    const selected = refs.every((r) => selectedKeys.has(keyId(r)));
    return (
      <button
        key={`${refs[0].layerId}:${refs[0].property}:${at}`}
        type="button"
        data-testid="keyframe"
        data-selected={selected || undefined}
        aria-label={label}
        aria-pressed={selected}
        title={label}
        onPointerDown={onKeyDown(refs)}
        className={cn(
          'absolute top-1/2 grid size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 cursor-ew-resize place-items-center rounded-[2px] border',
          summary ? 'size-2.5 border-edge-strong bg-surface-3' : 'border-data bg-surface-1',
          selected && 'border-primary bg-primary',
        )}
        style={{ left: at * pxPerMs }}
      />
    );
  };

  return (
    <div dir="ltr" className="flex min-h-0 flex-col border-t border-edge bg-surface-1" aria-label={t('vector.timeline.title')} role="region">
      {/* Transport */}
      <div className="flex shrink-0 flex-wrap items-center gap-1 border-b border-edge px-2 py-1">
        <IconButton label={t('vector.timeline.toStart')} onClick={() => s().setTime(range?.start ?? 0)}>
          <SkipBack className="size-3.5" />
        </IconButton>
        <IconButton label={playing ? t('vector.timeline.pause') : t('vector.timeline.play')} active={playing} onClick={() => s().togglePlaying()}>
          {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
        </IconButton>
        <IconButton label={t('vector.timeline.toEnd')} onClick={() => s().setTime(range?.end ?? doc.duration)}>
          <SkipForward className="size-3.5" />
        </IconButton>
        <span className="mx-1 w-20 font-mono text-xs tabular-nums text-foreground" data-testid="timecode">
          {formatTimecode(time)}
        </span>
        <IconButton label={t('vector.timeline.loop')} active={loop} onClick={() => s().setLoop(!loop)}>
          <Repeat className="size-3.5" />
        </IconButton>
        <button
          type="button"
          aria-pressed={autokey}
          title={t('vector.timeline.autokeyHint')}
          onClick={() => s().setAutokey(!autokey)}
          className={cn(
            'h-7 rounded-md border border-edge px-2 text-[11px] font-medium text-muted-foreground hover:bg-surface-2',
            autokey && 'border-destructive/60 bg-destructive/15 text-foreground',
          )}
        >
          {t('vector.timeline.autokey')}
        </button>
        <DurationField duration={doc.duration} />
        <span className="h-5 w-px bg-edge" aria-hidden />
        <IconButton label={t('vector.timeline.setIn')} onClick={() => s().setRange({ start: s().time, end: range?.end ?? doc.duration })}>
          <ArrowLeftToLine className="size-3.5" />
        </IconButton>
        <IconButton label={t('vector.timeline.setOut')} onClick={() => s().setRange({ start: range?.start ?? 0, end: s().time })}>
          <ArrowRightToLine className="size-3.5" />
        </IconButton>
        <IconButton label={t('vector.timeline.clearRange')} disabled={!range} onClick={() => s().setRange(null)}>
          <X className="size-3.5" />
        </IconButton>
        <span className="h-5 w-px bg-edge" aria-hidden />
        <IconButton label={t('vector.timeline.addKeys')} disabled={!canAddKeys} onClick={addKeysForSelection}>
          <Diamond className="size-3.5" />
        </IconButton>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={keySelection.length === 0}
              className="flex h-7 items-center gap-1 rounded-md border border-edge px-2 text-[11px] text-muted-foreground hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-40"
            >
              <Spline className="size-3.5" />
              {t('vector.easing.title')}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-60 border-edge bg-surface-1 p-3" align="start">
            <p className="mb-2 text-[11px] text-muted-foreground">
              {easing === null ? t('vector.easing.mixed') : t('vector.easing.applies', { count: keySelection.length })}
            </p>
            <BezierEditor
              value={easing}
              onChange={(e) => s().setSelectedEasing(e)}
              onDragStart={() => s().beginGesture('Easing')}
              onDragEnd={() => s().endGesture()}
            />
          </PopoverContent>
        </Popover>
        <IconButton label={t('vector.timeline.copyKeys')} disabled={keySelection.length === 0} onClick={() => s().copySelectedKeys()}>
          <Copy className="size-3.5" />
        </IconButton>
        <IconButton label={t('vector.timeline.pasteKeys')} disabled={!hasClipboard} onClick={() => s().pasteKeys()}>
          <ClipboardPaste className="size-3.5" />
        </IconButton>
        <IconButton label={t('vector.timeline.deleteKeys')} disabled={keySelection.length === 0} onClick={() => s().deleteSelectedKeys()}>
          <Trash2 className="size-3.5" />
        </IconButton>
        <span className="flex-1" />
        <IconButton label={t('vector.timeline.zoomOut')} onClick={() => setPxPerSec((v) => Math.max(MIN_PX_PER_SEC, v / 1.25))}>
          <ZoomOut className="size-3.5" />
        </IconButton>
        <IconButton label={t('vector.timeline.zoomIn')} onClick={() => setPxPerSec((v) => Math.min(MAX_PX_PER_SEC, v * 1.25))}>
          <ZoomIn className="size-3.5" />
        </IconButton>
      </div>

      {/* Ruler + tracks share one scroller; the label column is sticky. */}
      <div className="relative min-h-0 flex-1 overflow-auto" data-testid="timeline-scroller">
        <div className="relative" style={{ width: LABEL_W + width + 24 }}>
          <div className="sticky top-0 z-20 flex border-b border-edge bg-surface-1">
            <div className="sticky left-0 z-10 shrink-0 border-e border-edge bg-surface-1" style={{ width: LABEL_W, height: ROW_H }} />
            <div
              ref={areaRef}
              role="slider"
              tabIndex={0}
              aria-label={t('vector.timeline.playhead')}
              aria-valuemin={0}
              aria-valuemax={doc.duration}
              aria-valuenow={time}
              aria-valuetext={formatTimecode(time)}
              data-testid="timeline-ruler"
              className="relative cursor-col-resize select-none"
              style={{ width, height: ROW_H }}
              onPointerDown={onRulerDown}
              onPointerMove={onRulerMove}
              onPointerUp={onRulerUp}
              onPointerCancel={onRulerUp}
              onKeyDown={(e) => {
                const f = 1000 / doc.fps;
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                  e.preventDefault();
                  e.stopPropagation();
                  s().setTime(snapToFrame(time + (e.key === 'ArrowRight' ? f : -f) * (e.shiftKey ? 10 : 1), doc.fps));
                }
              }}
            >
              {range && (
                <div className="pointer-events-none absolute inset-y-0 bg-data/10" style={{ left: range.start * pxPerMs, width: (range.end - range.start) * pxPerMs }} />
              )}
              {ticks.map((ms) => (
                <div key={ms} className="pointer-events-none absolute bottom-0 h-2 border-s border-edge-strong" style={{ left: ms * pxPerMs }}>
                  <span className="absolute -top-3.5 start-1 font-mono text-[10px] text-text-subtle">{secondsLabel(ms)}</span>
                </div>
              ))}
              {range && (
                <>
                  <div data-marker="in" title={t('vector.timeline.inMarker')} className="absolute inset-y-0 w-2 -translate-x-full cursor-ew-resize rounded-s-sm bg-data/70" style={{ left: range.start * pxPerMs }} />
                  <div data-marker="out" title={t('vector.timeline.outMarker')} className="absolute inset-y-0 w-2 cursor-ew-resize rounded-e-sm bg-data/70" style={{ left: range.end * pxPerMs }} />
                </>
              )}
              <div className="pointer-events-none absolute -top-0 bottom-0 w-px bg-primary" style={{ left: playheadX }}>
                <div className="absolute -start-1.5 top-0 size-3 rounded-b-sm bg-primary" />
              </div>
            </div>
          </div>

          {rows.length === 0 && (
            <p className="sticky left-0 px-3 py-3 text-xs text-muted-foreground" style={{ width: LABEL_W + 240 }}>
              {t('vector.timeline.empty')}
            </p>
          )}

          {rows.map(({ layer, depth }) => {
            const open = expanded.has(layer.id);
            const isSel = selection.includes(layer.id);
            const times = layerKeyTimes(doc, layer.id);
            const tracks = doc.animations.filter((tr) => tr.layerId === layer.id);
            return (
              <div key={layer.id} data-testid="timeline-layer" data-layer={layer.id}>
                <div className={cn('flex border-b border-edge/60', isSel && 'bg-surface-2/60')} style={{ height: ROW_H }}>
                  <div
                    className="sticky left-0 z-10 flex shrink-0 items-center gap-1 border-e border-edge bg-inherit pe-2 text-xs"
                    style={{ width: LABEL_W, paddingInlineStart: 4 + depth * 12, backgroundColor: 'var(--surface-1)' }}
                  >
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-label={open ? t('vector.layers.collapse') : t('vector.layers.expand')}
                      onClick={() => toggleExpanded(layer.id)}
                      className="grid size-5 place-items-center rounded-sm text-muted-foreground hover:bg-surface-2"
                    >
                      {open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => (e.shiftKey ? s().toggleSelected(layer.id) : s().setSelection([layer.id]))}
                      className={cn('min-w-0 flex-1 truncate text-start', isSel ? 'text-foreground' : 'text-muted-foreground')}
                    >
                      {layerLabel(layer)}
                    </button>
                    {tracks.length > 0 && <Timer className="size-3 shrink-0 text-data" aria-hidden />}
                  </div>
                  <div className="relative" style={{ width }} onPointerDown={onTrackDown}>
                    {times.map((at) =>
                      diamond(
                        tracks.filter((tr) => tr.keyframes.some((k) => k.t === at)).map((tr) => ({ layerId: layer.id, property: tr.property, t: at })),
                        at,
                        true,
                        t('vector.timeline.layerKey', { layer: layerLabel(layer), time: formatTimecode(at) }),
                      ),
                    )}
                  </div>
                </div>
                {open &&
                  rowProperties(layer).map((p) => {
                    const track = findTrack(doc, layer.id, p);
                    const keyedNow = !!track?.keyframes.some((k) => k.t === time);
                    const label = t(propertyKey(p));
                    return (
                      <div key={p} data-testid="timeline-property" data-property={p} className="flex border-b border-edge/40" style={{ height: ROW_H }}>
                        <div
                          className="sticky left-0 z-10 flex shrink-0 items-center gap-1 border-e border-edge pe-1 text-[11px] text-muted-foreground"
                          style={{ width: LABEL_W, paddingInlineStart: 26 + depth * 12, backgroundColor: 'var(--surface-1)' }}
                        >
                          <button
                            type="button"
                            aria-pressed={!!track}
                            aria-label={track ? t('vector.timeline.stopAnimating', { property: label }) : t('vector.timeline.animate', { property: label })}
                            title={track ? t('vector.timeline.stopAnimating', { property: label }) : t('vector.timeline.animate', { property: label })}
                            onClick={() => (track ? s().removeTrack(layer.id, p) : s().addKeyframe(layer.id, p))}
                            className={cn('grid size-5 place-items-center rounded-sm hover:bg-surface-2', track ? 'text-data' : 'text-text-subtle')}
                          >
                            <Timer className="size-3" />
                          </button>
                          <span className="min-w-0 flex-1 truncate">{label}</span>
                          {track && (
                            <button
                              type="button"
                              aria-label={keyedNow ? t('vector.timeline.removeKeyHere', { property: label }) : t('vector.timeline.addKeyHere', { property: label })}
                              title={keyedNow ? t('vector.timeline.removeKeyHere', { property: label }) : t('vector.timeline.addKeyHere', { property: label })}
                              onClick={() => toggleKeyAt(layer.id, p)}
                              className="grid size-5 place-items-center rounded-sm text-data hover:bg-surface-2"
                            >
                              <Diamond className={cn('size-3', keyedNow && 'fill-current')} />
                            </button>
                          )}
                        </div>
                        <div className="relative" style={{ width }} onPointerDown={onTrackDown}>
                          {track?.keyframes.map((k) =>
                            diamond([{ layerId: layer.id, property: p, t: k.t }], k.t, false, t('vector.timeline.key', { property: label, time: formatTimecode(k.t) })),
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            );
          })}

          {/* Playhead line over the tracks. */}
          <div className="pointer-events-none absolute bottom-0 top-0 z-10 w-px bg-primary/70" style={{ left: LABEL_W + playheadX }} aria-hidden />
        </div>
      </div>
    </div>
  );
}

/** Composition length in seconds; commits on blur / Enter as one undo step. */
function DurationField({ duration }: { duration: number }) {
  const { t } = useLocalization('interface');
  const [draft, setDraft] = React.useState<string | null>(null);
  const shown = draft ?? String(duration / 1000);
  const commit = () => {
    if (draft === null) return;
    const n = Number(draft);
    setDraft(null);
    if (draft.trim() !== '' && Number.isFinite(n) && n > 0) useVectorStore.getState().setDuration(n * 1000);
  };
  return (
    <label className="ms-1 flex items-center gap-1 text-[11px] text-muted-foreground">
      <span aria-hidden>{t('vector.timeline.duration')}</span>
      <input
        type="number"
        aria-label={t('vector.timeline.duration')}
        min={0.1}
        max={3600}
        step={0.1}
        value={shown}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
        className="h-7 w-16 rounded-md border border-edge bg-surface-2 px-1.5 font-mono text-xs tabular-nums text-foreground outline-none focus-visible:border-data"
      />
      <span className="text-text-subtle">s</span>
    </label>
  );
}
