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
import { isLocked, rotateLayers, translateLayers } from '@/lib/vector/transformOps';
import { forEachLayer, type Layer, type VectorDoc } from '@/lib/vector/vectorTypes';
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

  load: (projectId: string, doc: VectorDoc, name?: string) => void;
  close: () => void;
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
};

export const createVectorStore = () =>
  create<VectorState>((set, get) => {
    const mutate: VectorState['mutate'] = (label, fn, selection) =>
      set((s) => {
        if (!s.doc) return {};
        const next = fn(s.doc);
        if (next === s.doc) return selection ? { selection } : {};
        const sel = pruneSelection(selection ?? s.selection, next);
        if (s.gestureDepth > 0) return { doc: next, selection: sel, revision: s.revision + 1 };
        return {
          doc: next,
          selection: sel,
          past: pushPast(s.past, { doc: s.doc, label }),
          future: [],
          revision: s.revision + 1,
        };
      });

    const selected = () => get().selection;

    return {
      ...initial,

      load: (projectId, doc, name = '') =>
        set({ ...initial, projectId, doc, name, revision: get().revision + 1 }),

      close: () => set({ ...initial }),

      rename: (name) => set((s) => (s.name === name ? {} : { name, revision: s.revision + 1 })),

      mutate,

      undo: () =>
        set((s) => {
          if (s.gestureDepth > 0 || !s.doc || s.past.length === 0) return {};
          const entry = s.past[s.past.length - 1];
          return {
            doc: entry.doc,
            past: s.past.slice(0, -1),
            future: [...s.future, { doc: s.doc, label: entry.label }],
            selection: pruneSelection(s.selection, entry.doc),
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

      nudgeSelection: (dx, dy) => mutate('Nudge', (d) => translateLayers(d, selected(), dx, dy)),

      rotateSelection: (deg) => mutate('Rotate', (d) => rotateLayers(d, selected(), deg)),

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
    };
  });

/** The editor's store (one editor per page). Tests use `createVectorStore()` directly. */
export const useVectorStore = createVectorStore();
