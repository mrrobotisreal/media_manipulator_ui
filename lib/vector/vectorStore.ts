'use client';

/**
 * Zustand store for the Motion editor (code name `vector`). Holds the live
 * document, the selection, the active tool and the undo history. No I/O:
 * drafts are written by the editor shell (`lib/vector/draftStore.ts`) and
 * server save/load is MM44.
 *
 * History follows Darkroom's snapshot model (`lib/studioStore.ts` `mutate`,
 * ADR ui/0001): every document edit goes through `mutate(label, fn)`, which
 * pushes the pre-edit document onto `past` (cap 100, oldest dropped) and
 * clears `future`. Documents are immutable and structurally shared, so a
 * snapshot is one pointer. A pointer drag (or a focus session on an input)
 * runs inside `beginGesture()` / `endGesture()` and lands as ONE entry.
 *
 * MM44 adds the timeline: playback state (`time`, `playing`, play range),
 * autokey, keyframe selection and the keyframe actions. Playhead, play and
 * range changes are VIEW state: they never touch `doc`, so a scrub creates no
 * history entry. `mutateAt` is the time-aware edit (see `lib/vector/timeEdit.ts`):
 * canvas and inspector edits made while the playhead sits on an animated
 * property become keyframes instead of static edits.
 */
import { create } from 'zustand';

import {
  cloneWithNewIds,
  docIds,
  findLayer,
  groupLayers,
  locateLayer,
  moveLayer,
  nextId,
  orderedIds,
  removeLayers,
  insertLayers,
  ungroupLayer,
  updateLayer,
  childrenOf,
} from '@/lib/vector/layerTree';
import {
  clampTime,
  copyKeyframes,
  liveKeyRefs,
  moveKeyframes,
  pasteKeyframes,
  pruneTracks,
  removeKeyframes,
  removeTrack,
  setDuration as setDocDuration,
  setKeyframeEasing,
  upsertKeyframe,
  type KeyClipboard,
  type KeyRef,
} from '@/lib/vector/keyframes';
import { baseValue, isAnimatable, type EditableProperty } from '@/lib/vector/properties';
import { sampleDoc } from '@/lib/vector/sampleTrack';
import { applyAtTime } from '@/lib/vector/timeEdit';
import { isLocked, rotateLayers, translateLayers } from '@/lib/vector/transformOps';
import { forEachLayer, type Easing, type Layer, type VectorDoc } from '@/lib/vector/vectorTypes';
import type { ToolId } from '@/lib/vector/tools/types';

/** Proposed (ticket decision 12): undo depth. */
export const VECTOR_HISTORY_CAP = 100;

export interface HistoryEntry {
  doc: VectorDoc;
  /** What the edit was ("Move", "Group"), for the undo/redo tooltips. */
  label: string;
}

export interface VectorState {
  projectId: string | null;
  doc: VectorDoc | null;
  /** Project name (not part of the document; MM44 stores it on the project row). */
  name: string;
  selection: string[];
  tool: ToolId;
  past: HistoryEntry[];
  future: HistoryEntry[];
  gestureDepth: number;
  gestureBase: VectorDoc | null;
  gestureLabel: string;
  /** Bumped on every document change (drafts debounce on it). */
  revision: number;

  // ---- MM44 timeline (view state; never in history) ----
  /** Playhead, integer ms in [0, doc.duration]. */
  time: number;
  playing: boolean;
  /** Play range (in/out markers), ms; null = the whole composition. */
  range: { start: number; end: number } | null;
  /** Proposed (decision 4): off by default. */
  autokey: boolean;
  /** Selected keyframes (timeline diamonds). */
  keySelection: KeyRef[];
  /** Keyframe clipboard (in-editor only). */
  keyClipboard: KeyClipboard | null;

  load: (projectId: string, doc: VectorDoc, name?: string) => void;
  close: () => void;
  /** MM44: the project got a server id (first save). Keeps the document, history and view. */
  setProjectId: (projectId: string) => void;
  rename: (name: string) => void;
  /** Apply `fn` to the document as one undoable step (or as part of the open gesture). */
  mutate: (label: string, fn: (doc: VectorDoc) => VectorDoc, selection?: string[]) => void;
  undo: () => void;
  redo: () => void;
  beginGesture: (label: string) => void;
  endGesture: () => void;
  /** Abort the open gesture and restore its starting document (Esc during a drag). */
  cancelGesture: () => void;

  setSelection: (ids: string[]) => void;
  toggleSelected: (id: string) => void;
  setTool: (tool: ToolId) => void;

  deleteSelection: () => void;
  duplicateSelection: () => void;
  groupSelection: () => void;
  ungroupSelection: () => void;
  nudgeSelection: (dx: number, dy: number) => void;
  rotateSelection: (deg: number) => void;
  /** Move one layer to `parentId` at visual `index`. */
  reorderLayer: (id: string, parentId: string | null, index: number) => void;
  /** Raise / lower within the same parent; `edge` goes to the top / bottom. */
  restack: (direction: 'up' | 'down', edge?: boolean) => void;
  /** Merge a patch into one layer. */
  patchLayer: (id: string, label: string, patch: Partial<Layer> | ((l: Layer) => Layer)) => void;
  addLayers: (layers: Layer[], label: string, parentId?: string | null) => void;
  selectAll: () => void;

  // ---- MM44 timeline ----
  /**
   * Time-aware edit: `fn` receives the document sampled at the playhead and
   * returns an edited copy; changes to animated properties become keyframes at
   * the playhead (autokey keys un-animated ones too). Same history rules as
   * `mutate`.
   */
  mutateAt: (label: string, fn: (sampled: VectorDoc) => VectorDoc, selection?: string[]) => void;
  /**
   * Fold an edit of `sampled` (= `sampleDoc(root, time)`) back into `root` at
   * the playhead. For drags that re-apply their op to the pointer-down state:
   * `mutate(label, () => foldAt(root, sampled, op(sampled)))`.
   */
  foldAt: (root: VectorDoc, sampled: VectorDoc, edited: VectorDoc) => VectorDoc;
  /** Move the playhead (clamped, rounded). Never a history entry. */
  setTime: (ms: number) => void;
  setPlaying: (playing: boolean) => void;
  togglePlaying: () => void;
  /** In/out markers; null clears. Clamped to the composition, start < end. */
  setRange: (range: { start: number; end: number } | null) => void;
  setAutokey: (on: boolean) => void;
  /** Loop flag on the document (exported as `animation-iteration-count`): undoable. */
  setLoop: (loop: boolean) => void;
  /** Composition length (integer ms): undoable; keys after the end are removed. */
  setDuration: (ms: number) => void;
  /** Stopwatch on: start a track with one keyframe of the current value at the playhead. */
  addKeyframe: (layerId: string, property: EditableProperty) => void;
  /** Stopwatch off: remove the property's track (the layer keeps its static value). */
  removeTrack: (layerId: string, property: string) => void;
  setKeySelection: (refs: KeyRef[]) => void;
  toggleKeySelected: (ref: KeyRef) => void;
  deleteSelectedKeys: () => void;
  moveSelectedKeys: (dt: number) => void;
  setSelectedEasing: (easing: Easing) => void;
  copySelectedKeys: () => void;
  /** Paste at the playhead (onto the one selected layer when the copy came from one layer). */
  pasteKeys: () => void;
}

/** Selection ids that still exist in `doc` (ids nested inside raw layers never count). */
export function pruneSelection(ids: string[], doc: VectorDoc): string[] {
  const live = new Set<string>();
  forEachLayer(doc, (l) => live.add(l.id));
  const kept = ids.filter((id) => live.has(id));
  return kept.length === ids.length ? ids : kept;
}

const pushPast = (past: HistoryEntry[], entry: HistoryEntry) => [...past, entry].slice(-VECTOR_HISTORY_CAP);

const initial = {
  projectId: null,
  doc: null,
  name: '',
  selection: [] as string[],
  tool: 'select' as ToolId,
  past: [] as HistoryEntry[],
  future: [] as HistoryEntry[],
  gestureDepth: 0,
  gestureBase: null,
  gestureLabel: '',
  revision: 0,
  time: 0,
  playing: false,
  range: null as { start: number; end: number } | null,
  autokey: false,
  keySelection: [] as KeyRef[],
  keyClipboard: null as KeyClipboard | null,
};

/** View state that survives a document reload (load keeps autokey). */
const sameRefs = (a: KeyRef[], b: KeyRef[]) =>
  a.length === b.length && a.every((r, i) => r.layerId === b[i].layerId && r.property === b[i].property && r.t === b[i].t);

export const createVectorStore = () =>
  create<VectorState>((set, get) => {
    const mutate: VectorState['mutate'] = (label, fn, selection) =>
      set((s) => {
        if (!s.doc) return {};
        const raw = fn(s.doc);
        if (raw === s.doc) return selection ? { selection } : {};
        // Tracks never outlive their layer (delete, ungroup of a raw…).
        const next = pruneTracks(raw);
        const sel = pruneSelection(selection ?? s.selection, next);
        const keySelection = liveKeyRefs(next, s.keySelection);
        const time = Math.min(s.time, next.duration);
        const view = { selection: sel, keySelection, time, revision: s.revision + 1 };
        if (s.gestureDepth > 0) return { doc: next, ...view };
        return {
          doc: next,
          ...view,
          past: pushPast(s.past, { doc: s.doc, label }),
          future: [],
        };
      });

    const foldAt: VectorState['foldAt'] = (root, sampled, edited) => {
      const s = get();
      return applyAtTime(root, sampled, edited, s.time, s.autokey);
    };

    const mutateAt: VectorState['mutateAt'] = (label, fn, selection) =>
      mutate(
        label,
        (d) => {
          const sampled = sampleDoc(d, get().time);
          return foldAt(d, sampled, fn(sampled));
        },
        selection,
      );

    const selected = () => get().selection;

    return {
      ...initial,

      load: (projectId, doc, name = '') =>
        set({ ...initial, projectId, doc, name, autokey: get().autokey, revision: get().revision + 1 }),

      close: () => set({ ...initial }),

      setProjectId: (projectId) => set((s) => (s.projectId === projectId ? {} : { projectId })),

      rename: (name) => set((s) => (s.name === name ? {} : { name, revision: s.revision + 1 })),

      mutate,
      mutateAt,
      foldAt,

      undo: () =>
        set((s) => {
          if (s.gestureDepth > 0 || !s.doc || s.past.length === 0) return {};
          const entry = s.past[s.past.length - 1];
          return {
            doc: entry.doc,
            past: s.past.slice(0, -1),
            future: [...s.future, { doc: s.doc, label: entry.label }],
            selection: pruneSelection(s.selection, entry.doc),
            keySelection: liveKeyRefs(entry.doc, s.keySelection),
            time: Math.min(s.time, entry.doc.duration),
            revision: s.revision + 1,
          };
        }),

      redo: () =>
        set((s) => {
          if (s.gestureDepth > 0 || !s.doc || s.future.length === 0) return {};
          const entry = s.future[s.future.length - 1];
          return {
            doc: entry.doc,
            past: pushPast(s.past, { doc: s.doc, label: entry.label }),
            future: s.future.slice(0, -1),
            selection: pruneSelection(s.selection, entry.doc),
            keySelection: liveKeyRefs(entry.doc, s.keySelection),
            time: Math.min(s.time, entry.doc.duration),
            revision: s.revision + 1,
          };
        }),

      beginGesture: (label) =>
        set((s) =>
          s.gestureDepth === 0
            ? { gestureDepth: 1, gestureBase: s.doc, gestureLabel: label }
            : { gestureDepth: s.gestureDepth + 1 },
        ),

      endGesture: () =>
        set((s) => {
          if (s.gestureDepth === 0) return {};
          if (s.gestureDepth > 1) return { gestureDepth: s.gestureDepth - 1 };
          const changed = s.gestureBase !== null && s.doc !== null && s.gestureBase !== s.doc;
          if (!changed) return { gestureDepth: 0, gestureBase: null, gestureLabel: '' };
          return {
            gestureDepth: 0,
            gestureBase: null,
            gestureLabel: '',
            past: pushPast(s.past, { doc: s.gestureBase!, label: s.gestureLabel }),
            future: [],
          };
        }),

      cancelGesture: () =>
        set((s) => {
          if (s.gestureDepth === 0) return {};
          const base = s.gestureBase;
          const restore = base && base !== s.doc;
          return {
            gestureDepth: 0,
            gestureBase: null,
            gestureLabel: '',
            ...(restore ? { doc: base, selection: pruneSelection(s.selection, base), revision: s.revision + 1 } : {}),
          };
        }),

      setSelection: (ids) =>
        set((s) => {
          const next = s.doc ? pruneSelection(ids, s.doc) : [];
          const same = next.length === s.selection.length && next.every((id, i) => id === s.selection[i]);
          return same ? {} : { selection: next };
        }),

      toggleSelected: (id) =>
        set((s) => ({ selection: s.selection.includes(id) ? s.selection.filter((x) => x !== id) : [...s.selection, id] })),

      setTool: (tool) => set((s) => (s.tool === tool ? {} : { tool })),

      deleteSelection: () => {
        const doc = get().doc;
        if (!doc) return;
        const ids = orderedIds(doc.layers, selected()).filter((id) => !isLocked(doc.layers, id));
        if (ids.length === 0) return;
        mutate('Delete', (d) => ({ ...d, layers: removeLayers(d.layers, new Set(ids)) }), []);
      },

      duplicateSelection: () => {
        const doc = get().doc;
        if (!doc) return;
        const ids = orderedIds(doc.layers, selected());
        if (ids.length === 0) return;
        const taken = docIds(doc);
        let layers = doc.layers;
        const copies: string[] = [];
        // Each copy goes right above its source, in its source's parent.
        for (const id of [...ids].reverse()) {
          const src = findLayer(layers, id);
          const loc = locateLayer(layers, id);
          if (!src || !loc) continue;
          const copy = cloneWithNewIds(src, taken);
          copies.unshift(copy.id);
          layers = insertLayers(layers, loc.parentId, loc.index + 1, [copy]);
        }
        mutate('Duplicate', (d) => translateLayers({ ...d, layers }, copies, 10, 10), copies);
      },

      groupSelection: () => {
        const doc = get().doc;
        if (!doc) return;
        const ids = orderedIds(doc.layers, selected()).filter((id) => !isLocked(doc.layers, id));
        if (ids.length === 0) return;
        const gid = nextId(docIds(doc), 'group');
        mutate('Group', (d) => ({ ...d, layers: groupLayers(d.layers, ids, gid) }), [gid]);
      },

      ungroupSelection: () => {
        const doc = get().doc;
        if (!doc) return;
        const groups = orderedIds(doc.layers, selected()).filter((id) => {
          const l = findLayer(doc.layers, id);
          return l?.type === 'group' && !isLocked(doc.layers, id);
        });
        if (groups.length === 0) return;
        const freed: string[] = [];
        for (const g of groups) {
          const l = findLayer(doc.layers, g);
          if (l?.type === 'group') freed.push(...l.children.map((c) => c.id));
        }
        mutate(
          'Ungroup',
          (d) => ({ ...d, layers: groups.reduce((acc, g) => ungroupLayer(acc, g), d.layers) }),
          freed,
        );
      },

      nudgeSelection: (dx, dy) => mutateAt('Nudge', (d) => translateLayers(d, selected(), dx, dy)),

      rotateSelection: (deg) => mutateAt('Rotate', (d) => rotateLayers(d, selected(), deg)),

      reorderLayer: (id, parentId, index) => mutate('Reorder', (d) => {
        const layers = moveLayer(d.layers, id, parentId, index);
        return layers === d.layers ? d : { ...d, layers };
      }),

      restack: (direction, edge = false) => {
        const doc = get().doc;
        if (!doc) return;
        const ids = orderedIds(doc.layers, selected());
        if (ids.length !== 1) return;
        const loc = locateLayer(doc.layers, ids[0]);
        if (!loc) return;
        const count = childrenOf(doc.layers, loc.parentId).length;
        // Paint order: later = on top. "up" moves later in the list.
        const target = direction === 'up' ? (edge ? count : loc.index + 2) : edge ? 0 : loc.index - 1;
        if (target < 0 || target > count) return;
        get().reorderLayer(ids[0], loc.parentId, target);
      },

      patchLayer: (id, label, patch) =>
        mutate(label, (d) => {
          const layers = updateLayer(d.layers, id, (l) =>
            typeof patch === 'function' ? patch(l) : ({ ...l, ...patch } as Layer),
          );
          return layers === d.layers ? d : { ...d, layers };
        }),

      addLayers: (layers, label, parentId = null) => {
        if (layers.length === 0) return;
        mutate(label, (d) => ({ ...d, layers: insertLayers(d.layers, parentId, undefined, layers) }), layers.map((l) => l.id));
      },

      selectAll: () =>
        set((s) => {
          if (!s.doc) return {};
          return { selection: s.doc.layers.filter((l) => l.type !== 'raw' && !l.locked && !l.hidden).map((l) => l.id) };
        }),

      // ---- MM44 timeline ----

      setTime: (ms) =>
        set((s) => {
          if (!s.doc) return {};
          const time = clampTime(ms, s.doc.duration);
          return time === s.time ? {} : { time };
        }),

      setPlaying: (playing) => set((s) => (s.playing === playing || !s.doc ? {} : { playing })),

      togglePlaying: () => get().setPlaying(!get().playing),

      setRange: (range) =>
        set((s) => {
          if (!s.doc) return {};
          if (!range) return s.range ? { range: null } : {};
          const a = clampTime(Math.min(range.start, range.end), s.doc.duration);
          const b = clampTime(Math.max(range.start, range.end), s.doc.duration);
          if (b - a < 1 || (a === 0 && b === s.doc.duration)) return s.range ? { range: null } : {};
          if (s.range && s.range.start === a && s.range.end === b) return {};
          return { range: { start: a, end: b } };
        }),

      setAutokey: (on) => set((s) => (s.autokey === on ? {} : { autokey: on })),

      setLoop: (loop) =>
        mutate(loop ? 'Loop on' : 'Loop off', (d) => {
          if ((d.loop !== false) === loop) return d;
          const { loop: _old, ...rest } = d;
          void _old;
          // Canonical form: absent = loops.
          return (loop ? rest : { ...rest, loop: false }) as VectorDoc;
        }),

      setDuration: (ms) => {
        mutate('Duration', (d) => setDocDuration(d, ms));
        const s = get();
        if (s.range && s.doc && s.range.end > s.doc.duration) s.setRange({ start: s.range.start, end: s.doc.duration });
      },

      addKeyframe: (layerId, property) => {
        const s = get();
        if (!s.doc) return;
        const layer = findLayer(sampleDoc(s.doc, s.time).layers, layerId);
        if (!isAnimatable(layer)) return;
        const ref = { layerId, property, t: s.time };
        mutate('Add keyframe', (d) => upsertKeyframe(d, layerId, property, s.time, baseValue(layer, property)));
        set({ keySelection: [ref] });
      },

      removeTrack: (layerId, property) => mutate('Remove animation', (d) => removeTrack(d, layerId, property)),

      setKeySelection: (refs) =>
        set((s) => {
          const next = s.doc ? liveKeyRefs(s.doc, refs) : [];
          return sameRefs(next, s.keySelection) ? {} : { keySelection: next };
        }),

      toggleKeySelected: (ref) =>
        set((s) => {
          const has = s.keySelection.some((r) => r.layerId === ref.layerId && r.property === ref.property && r.t === ref.t);
          return {
            keySelection: has
              ? s.keySelection.filter((r) => !(r.layerId === ref.layerId && r.property === ref.property && r.t === ref.t))
              : [...s.keySelection, ref],
          };
        }),

      deleteSelectedKeys: () => {
        const refs = get().keySelection;
        if (refs.length === 0) return;
        mutate(refs.length === 1 ? 'Delete keyframe' : 'Delete keyframes', (d) => removeKeyframes(d, refs));
        set({ keySelection: [] });
      },

      moveSelectedKeys: (dt) => {
        const s = get();
        if (!s.doc || s.keySelection.length === 0) return;
        const moved = moveKeyframes(s.doc, s.keySelection, dt);
        if (moved.doc === s.doc) return;
        mutate('Move keyframes', () => moved.doc);
        set({ keySelection: moved.refs });
      },

      setSelectedEasing: (easing) => {
        const refs = get().keySelection;
        if (refs.length === 0) return;
        mutate('Easing', (d) => setKeyframeEasing(d, refs, easing));
      },

      copySelectedKeys: () => {
        const s = get();
        if (!s.doc || s.keySelection.length === 0) return;
        const clip = copyKeyframes(s.doc, s.keySelection);
        if (clip.entries.length > 0) set({ keyClipboard: clip });
      },

      pasteKeys: () => {
        const s = get();
        if (!s.doc || !s.keyClipboard || s.keyClipboard.entries.length === 0) return;
        const target = s.selection.length === 1 ? s.selection[0] : undefined;
        const pasted = pasteKeyframes(s.doc, s.keyClipboard, s.time, target);
        if (pasted.doc === s.doc) return;
        mutate('Paste keyframes', () => pasted.doc);
        set({ keySelection: liveKeyRefs(get().doc!, pasted.refs) });
      },
    };
  });

/** The editor's store (one editor per page). Tests use `createVectorStore()` directly. */
export const useVectorStore = createVectorStore();
