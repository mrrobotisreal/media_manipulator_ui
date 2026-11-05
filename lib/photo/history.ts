/**
 * History panel model (design §5.5, MM99 decision 7): the store's undo stack
 * as a readable timeline, label localisation, and session snapshots.
 *
 * Timeline: states 0..n+m, where n = past.length and m = future.length; the
 * current state is index n. `past[i].label` is the edit that led from state i
 * to i+1; the `future` entries (last = next redo) continue the list. Labels
 * are the English strings every `mutate(label)` call passes; they are mapped
 * to `panels.photo.history.labels.<slug>` here, with four structured forms:
 * `Preset|builtin:<id>`, `Preset|user:<name>`, gesture labels `<type>.<param>`
 * and Medi's edits `Medi|<summary>` (MM108).
 */
import { create } from 'zustand';

import { LAYER_TYPES, type PhotoDoc } from '@/lib/photo/photoTypes';
import type { PhotoHistoryEntry } from '@/lib/photo/photoStore';

/** `Add local adjustment` -> `addLocalAdjustment`; `Black & white` -> `blackWhite`. */
export function labelSlug(label: string): string {
  const words = label.split(/[^A-Za-z0-9]+/).filter(Boolean);
  return words
    .map((w, i) => (i === 0 ? (w === w.toUpperCase() ? w.toLowerCase() : w[0].toLowerCase() + w.slice(1)) : w[0].toUpperCase() + w.slice(1)))
    .join('');
}

export const GESTURE_PREFIXES = ['brush', 'mask', 'geometry', 'layer'] as const;

export type LabelResolution =
  | { key: string; vars?: Record<string, string> }
  | { medi: string }
  | { layerType: string }
  | { presetBuiltin: string }
  | { presetUser: string };

/** How a history label is shown: a key to translate, a layer type, or a preset reference. */
export function resolveLabel(label: string): LabelResolution {
  // MM108: a Medi edit, `Medi|<summary>` (the summary is the model's own short label).
  if (label.startsWith('Medi|')) return { medi: label.slice('Medi|'.length) };
  if (label.startsWith('Preset|builtin:')) return { presetBuiltin: label.slice('Preset|builtin:'.length) };
  if (label.startsWith('Preset|user:')) return { presetUser: label.slice('Preset|user:'.length) };
  const dot = label.indexOf('.');
  if (dot > 0) {
    const prefix = label.slice(0, dot);
    if ((LAYER_TYPES as readonly string[]).includes(prefix)) return { layerType: prefix };
    if ((GESTURE_PREFIXES as readonly string[]).includes(prefix)) return { key: `photo.history.labels.${prefix}Gesture` };
  }
  if ((LAYER_TYPES as readonly string[]).includes(label)) return { layerType: label };
  return { key: `photo.history.labels.${labelSlug(label)}` };
}

export interface HistoryStep {
  /** Timeline state index this step lands on (1-based; state 0 is the original). */
  index: number;
  label: string;
  /** Already applied (<= current). */
  applied: boolean;
  current: boolean;
}

export function historySteps(past: PhotoHistoryEntry[], future: PhotoHistoryEntry[]): HistoryStep[] {
  const n = past.length;
  const out: HistoryStep[] = [];
  past.forEach((e, i) => out.push({ index: i + 1, label: e.label, applied: true, current: i + 1 === n }));
  for (let k = future.length - 1; k >= 0; k -= 1) out.push({ index: n + (future.length - k), label: future[k].label, applied: false, current: false });
  return out;
}

// ---------------------------------------------------------------------------
// Snapshots: named bookmarks kept for the session (not saved in the document).
// ---------------------------------------------------------------------------
export interface Snapshot {
  id: string;
  name: string;
  doc: PhotoDoc;
}
interface SnapshotState {
  snapshots: Snapshot[];
  add: (name: string, doc: PhotoDoc) => Snapshot;
  remove: (id: string) => void;
  clear: () => void;
}
let counter = 0;
export const useSnapshotStore = create<SnapshotState>((set) => ({
  snapshots: [],
  add: (name, doc) => {
    counter += 1;
    const snap = { id: `snap-${counter}`, name: name.trim().slice(0, 60) || `Snapshot ${counter}`, doc };
    set((s) => ({ snapshots: [...s.snapshots, snap] }));
    return snap;
  },
  remove: (id) => set((s) => ({ snapshots: s.snapshots.filter((x) => x.id !== id) })),
  clear: () => set({ snapshots: [] }),
}));
