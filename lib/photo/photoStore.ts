'use client';

/**
 * Zustand store for the Aperture editor (code name `photo`). Holds the live
 * `PhotoDoc`, the selected layer and the undo history. No I/O: drafts are
 * written by the editor shell (`draftStore.ts`) and projects are saved by
 * `projectsApi.ts` / `localProject.ts`.
 *
 * History follows Motion's snapshot model (`lib/vector/vectorStore.ts`):
 * every document edit goes through `mutate(label, fn)`, which pushes the
 * pre-edit document onto `past` (cap 200, oldest dropped) and clears `future`.
 * Documents are immutable and structurally shared, so a snapshot is one
 * pointer. A slider drag runs inside `beginGesture()` / `endGesture()` and
 * lands as ONE entry (pointer down → up).
 */
import { create } from 'zustand';

import type { PhotoDoc } from '@/lib/photo/photoTypes';

export const PHOTO_HISTORY_CAP = 200;

export interface PhotoHistoryEntry {
  doc: PhotoDoc;
  label: string;
}

export interface PhotoState {
  projectId: string | null;
  doc: PhotoDoc | null;
  name: string;
  /** The selected layer id (its panel is open), or null. */
  selection: string | null;
  past: PhotoHistoryEntry[];
  future: PhotoHistoryEntry[];
  gestureDepth: number;
  gestureBase: PhotoDoc | null;
  gestureLabel: string;
  /** Bumped on every document change (drafts debounce on it). */
  revision: number;
  /** Document differs from the last saved/loaded one. */
  dirty: boolean;
  /** Server revision the doc is based on; null for local/new projects. */
  serverRevision: number | null;
  /** Last user-set slider activity, for the debounced `onAdjustmentChanged` seam. */
  lastAdjustment: { type: string; param: string } | null;

  load: (projectId: string, doc: PhotoDoc, name?: string, serverRevision?: number | null) => void;
  close: () => void;
  setProjectId: (projectId: string) => void;
  rename: (name: string) => void;
  mutate: (label: string, fn: (doc: PhotoDoc) => PhotoDoc, selection?: string | null) => void;
  undo: () => void;
  redo: () => void;
  beginGesture: (label: string) => void;
  endGesture: () => void;
  cancelGesture: () => void;
  setSelection: (id: string | null) => void;
  /** The doc was persisted (server save or local write): clears `dirty`, records the revision. */
  markSaved: (serverRevision?: number | null) => void;
  /** Replace the doc without history (server "load theirs", draft recovery). */
  replaceDoc: (doc: PhotoDoc, serverRevision?: number | null) => void;
  noteAdjustment: (type: string, param: string) => void;
}

function pushPast(past: PhotoHistoryEntry[], entry: PhotoHistoryEntry): PhotoHistoryEntry[] {
  const next = [...past, entry];
  return next.length > PHOTO_HISTORY_CAP ? next.slice(next.length - PHOTO_HISTORY_CAP) : next;
}

const pruneSelection = (sel: string | null, doc: PhotoDoc) => (sel && doc.layers.some((l) => l.id === sel) ? sel : null);

const initial = {
  projectId: null as string | null,
  doc: null as PhotoDoc | null,
  name: '',
  selection: null as string | null,
  past: [] as PhotoHistoryEntry[],
  future: [] as PhotoHistoryEntry[],
  gestureDepth: 0,
  gestureBase: null as PhotoDoc | null,
  gestureLabel: '',
  revision: 0,
  dirty: false,
  serverRevision: null as number | null,
  lastAdjustment: null as { type: string; param: string } | null,
};

export const createPhotoStore = () =>
  create<PhotoState>((set) => ({
    ...initial,

    load: (projectId, doc, name = '', serverRevision = null) =>
      set((s) => ({ ...initial, projectId, doc, name, serverRevision, revision: s.revision + 1 })),

    close: () => set({ ...initial }),

    setProjectId: (projectId) => set((s) => (s.projectId === projectId ? {} : { projectId })),

    rename: (name) => set((s) => (s.name === name ? {} : { name, revision: s.revision + 1, dirty: true })),

    mutate: (label, fn, selection) =>
      set((s) => {
        if (!s.doc) return {};
        const next = fn(s.doc);
        if (next === s.doc) return selection !== undefined ? { selection } : {};
        const view = {
          selection: pruneSelection(selection === undefined ? s.selection : selection, next),
          revision: s.revision + 1,
          dirty: true,
        };
        if (s.gestureDepth > 0) return { doc: next, ...view };
        return { doc: next, ...view, past: pushPast(s.past, { doc: s.doc, label }), future: [] };
      }),

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
          dirty: true,
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
          dirty: true,
        };
      }),

    beginGesture: (label) =>
      set((s) =>
        s.gestureDepth === 0 ? { gestureDepth: 1, gestureBase: s.doc, gestureLabel: label } : { gestureDepth: s.gestureDepth + 1 },
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
          past: pushPast(s.past, { doc: s.gestureBase as PhotoDoc, label: s.gestureLabel }),
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

    setSelection: (id) => set((s) => (s.selection === id ? {} : { selection: id })),

    markSaved: (serverRevision) =>
      set((s) => ({ dirty: false, ...(serverRevision !== undefined ? { serverRevision } : {}), revision: s.revision })),

    replaceDoc: (doc, serverRevision) =>
      set((s) => ({
        doc,
        past: [],
        future: [],
        gestureDepth: 0,
        gestureBase: null,
        selection: pruneSelection(s.selection, doc),
        revision: s.revision + 1,
        dirty: false,
        ...(serverRevision !== undefined ? { serverRevision } : {}),
      })),

    noteAdjustment: (type, param) => set({ lastAdjustment: { type, param } }),
  }));

export const usePhotoStore = createPhotoStore();
