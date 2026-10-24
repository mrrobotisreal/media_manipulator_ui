'use client';

import React from 'react';
import { Flag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore } from '@/lib/studioStore';
import { editSummary } from '@/lib/studio/telemetry';
import { windowMarkers } from '@/lib/studio/markerLayout';
import type { StudioMarker } from '@/lib/studioTypes';
import { useUndoGesture } from './useUndoGesture';

export const MARKER_COLORS = ['#22C55E', '#FF6B4A', '#FFC857', '#5EEAD4', '#60A5FA', '#C084FC'];

const fmtTime = (s: number): string => {
  const m = Math.floor(s / 60);
  const r = s - m * 60;
  return `${m}:${r.toFixed(1).padStart(4, '0')}`;
};

/**
 * Edit popover body for one marker: name / color / comment / delete. Text
 * fields batch per focus session into one undo entry (useUndoGesture).
 */
const MarkerEditor: React.FC<{ marker: StudioMarker; onClose: () => void }> = ({ marker, onClose }) => {
  const { t } = useLocalization('interface');
  const updateMarker = useStudioStore((s) => s.updateMarker);
  const removeMarker = useStudioStore((s) => s.removeMarker);
  const gesture = useUndoGesture();
  const touched = React.useRef(false);
  const commit = () => {
    gesture.end();
    if (touched.current) {
      touched.current = false;
      editSummary.increment('markersEdited');
      editSummary.increment('uiInvocations');
    }
  };
  const change = (patch: Parameters<typeof updateMarker>[1]) => {
    gesture.begin();
    touched.current = true;
    updateMarker(marker.id, patch);
  };
  return (
    <div className="space-y-3" data-marker-editor>
      <div className="space-y-1">
        <label className="text-[11px] text-muted-foreground" htmlFor={`mk-name-${marker.id}`}>
          {t('contentStudio.timeline.markerName')}
        </label>
        <Input
          id={`mk-name-${marker.id}`}
          value={marker.name}
          maxLength={80}
          className="h-8 text-xs"
          onFocus={gesture.begin}
          onBlur={commit}
          onChange={(e) => change({ name: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <span className="text-[11px] text-muted-foreground">{t('contentStudio.timeline.markerColor')}</span>
        <div className="flex items-center gap-1.5">
          {MARKER_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={c}
              aria-pressed={marker.color.toLowerCase() === c.toLowerCase()}
              onClick={() => {
                updateMarker(marker.id, { color: c });
                editSummary.increment('markersEdited');
                editSummary.increment('uiInvocations');
              }}
              className={`h-5 w-5 rounded-full border ${
                marker.color.toLowerCase() === c.toLowerCase() ? 'border-foreground ring-1 ring-foreground' : 'border-border'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[11px] text-muted-foreground" htmlFor={`mk-comment-${marker.id}`}>
          {t('contentStudio.timeline.markerComment')}
        </label>
        <textarea
          id={`mk-comment-${marker.id}`}
          value={marker.comment ?? ''}
          maxLength={500}
          rows={3}
          className="w-full resize-none rounded-md border border-input bg-transparent px-2 py-1.5 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onFocus={gesture.begin}
          onBlur={commit}
          onChange={(e) => change({ comment: e.target.value })}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{fmtTime(marker.t)}</span>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-7 text-destructive"
          onClick={() => {
            removeMarker(marker.id);
            editSummary.increment('markersEdited');
            editSummary.increment('uiInvocations');
            onClose();
          }}
        >
          <Trash2 className="mr-1 h-3.5 w-3.5" />
          {t('contentStudio.timeline.markerDelete')}
        </Button>
      </div>
    </div>
  );
};

/**
 * Project markers drawn on the ruler. Click selects (and keeps the ruler from
 * scrubbing), drag moves (one undo entry per drag), double-click opens the
 * edit popover. Windowed like the clips so a 500-marker project stays cheap.
 */
export const RulerMarkers: React.FC<{
  zoom: number;
  startSec: number;
  endSec: number;
}> = ({ zoom, startSec, endSec }) => {
  const markers = useStudioStore((s) => s.project?.markers);
  const selectedId = useStudioStore((s) => s.selectedMarkerId);
  const selectMarker = useStudioStore((s) => s.selectMarker);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const dragRef = React.useRef<null | { id: string; startX: number; t0: number; moved: boolean }>(null);

  const visible = React.useMemo(
    () => windowMarkers(markers ?? [], startSec, endSec, selectedId, editingId),
    [markers, startSec, endSec, selectedId, editingId],
  );

  const onDown = (e: React.PointerEvent, m: StudioMarker) => {
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    dragRef.current = { id: m.id, startX: e.clientX, t0: m.t, moved: false };
    selectMarker(m.id);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    if (!d.moved) {
      if (Math.abs(dx) < 3) return;
      d.moved = true;
      useStudioStore.getState().beginGesture();
    }
    useStudioStore.getState().updateMarker(d.id, { t: Math.max(0, d.t0 + dx / zoom) });
  };
  const onUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    dragRef.current = null;
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    if (d.moved) {
      useStudioStore.getState().endGesture();
      editSummary.increment('markersEdited');
      editSummary.increment('uiInvocations');
    }
  };

  return (
    <>
      {visible.map((m) => (
        <Popover key={m.id} open={editingId === m.id} onOpenChange={(o) => setEditingId(o ? m.id : null)}>
          <PopoverTrigger asChild>
            <div
              role="button"
              tabIndex={-1}
              aria-label={m.name}
              title={m.comment ? `${m.name} — ${m.comment}` : m.name}
              data-marker-id={m.id}
              className="absolute bottom-0 z-10 -ml-[5px] flex cursor-ew-resize flex-col items-center touch-none"
              style={{ left: m.t * zoom }}
              onPointerDown={(e) => onDown(e, m)}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => {
                e.stopPropagation();
                selectMarker(m.id);
                setEditingId(m.id);
              }}
            >
              <span
                className={`block h-3 w-[11px] ${selectedId === m.id ? 'ring-1 ring-foreground' : ''}`}
                style={{
                  backgroundColor: m.color,
                  clipPath: 'polygon(0 0, 100% 0, 100% 60%, 50% 100%, 0 60%)',
                }}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-64" side="bottom" align="start">
            <MarkerEditor marker={m} onClose={() => setEditingId(null)} />
          </PopoverContent>
        </Popover>
      ))}
    </>
  );
};

/** Toggleable markers list; click a row to jump the playhead there. */
export const MarkersPanel: React.FC = () => {
  const { t } = useLocalization('interface');
  const markers = useStudioStore((s) => s.project?.markers) ?? [];
  const selectedId = useStudioStore((s) => s.selectedMarkerId);
  const setPlayhead = useStudioStore((s) => s.setPlayhead);
  const selectMarker = useStudioStore((s) => s.selectMarker);
  const removeMarker = useStudioStore((s) => s.removeMarker);
  return (
    <div className="border-b border-border bg-surface-0/30 px-3 py-2" data-testid="markers-panel">
      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        <Flag className="h-3 w-3" aria-hidden />
        {t('contentStudio.timeline.markersPanelTitle')}
      </div>
      {markers.length === 0 ? (
        <p className="text-xs text-muted-foreground">{t('contentStudio.timeline.markersEmpty')}</p>
      ) : (
        <ul className="max-h-32 space-y-0.5 overflow-y-auto">
          {markers.map((m) => (
            <li key={m.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPlayhead(m.t);
                  selectMarker(m.id);
                  editSummary.increment('uiInvocations');
                }}
                className={`flex min-w-0 flex-1 items-center gap-2 rounded px-1.5 py-1 text-left text-xs hover:bg-muted ${
                  selectedId === m.id ? 'bg-muted' : ''
                }`}
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: m.color }} />
                <span className="font-mono tabular-nums text-muted-foreground">{fmtTime(m.t)}</span>
                <span className="truncate text-foreground">{m.name}</span>
                {m.comment && <span className="truncate text-muted-foreground">— {m.comment}</span>}
              </button>
              <button
                type="button"
                aria-label={t('contentStudio.timeline.markerDelete')}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                onClick={() => {
                  removeMarker(m.id);
                  editSummary.increment('markersEdited');
                  editSummary.increment('uiInvocations');
                }}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
