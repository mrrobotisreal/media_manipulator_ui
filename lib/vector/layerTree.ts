/**
 * Pure, immutable operations on the `VectorDoc` layer tree: lookup, update,
 * insert, remove, reorder, group / ungroup, ids. Untouched subtrees keep
 * their identity (structural sharing), which is what makes the store's
 * snapshot undo cheap.
 */
import { invert, layerMatrix, multiply, decomposeMatrix, type Matrix, IDENTITY } from '@/lib/vector/geometry';
import { canonicalTransform, transformToMatrix } from '@/lib/vector/geometry';
import {
  forEachLayer,
  type GroupLayer,
  type Layer,
  type VectorDoc,
} from '@/lib/vector/vectorTypes';

/** Where a layer lives: its parent group id (null = root) and index in that list. */
export interface LayerLocation {
  parentId: string | null;
  index: number;
  /** Ids of every ancestor group, outermost first. */
  ancestors: string[];
}

export function findLayer(layers: Layer[], id: string): Layer | undefined {
  for (const l of layers) {
    if (l.id === id) return l;
    if (l.type === 'group') {
      const hit = findLayer(l.children, id);
      if (hit) return hit;
    }
  }
  return undefined;
}

export function locateLayer(layers: Layer[], id: string, parentId: string | null = null, ancestors: string[] = []): LayerLocation | null {
  for (let i = 0; i < layers.length; i++) {
    const l = layers[i];
    if (l.id === id) return { parentId, index: i, ancestors };
    if (l.type === 'group') {
      const hit = locateLayer(l.children, id, l.id, [...ancestors, l.id]);
      if (hit) return hit;
    }
  }
  return null;
}

/** Siblings list of `parentId` (root when null). */
export function childrenOf(layers: Layer[], parentId: string | null): Layer[] {
  if (parentId === null) return layers;
  const p = findLayer(layers, parentId);
  return p?.type === 'group' ? p.children : [];
}

/** Map every layer (depth-first); `fn` returning the same object keeps identity. */
export function mapLayers(layers: Layer[], fn: (l: Layer) => Layer): Layer[] {
  let changed = false;
  const out = layers.map((l) => {
    let next = fn(l);
    if (next.type === 'group') {
      const kids = mapLayers(next.children, fn);
      if (kids !== next.children) next = { ...next, children: kids };
    }
    if (next !== l) changed = true;
    return next;
  });
  return changed ? out : layers;
}

export function updateLayer(layers: Layer[], id: string, fn: (l: Layer) => Layer): Layer[] {
  let done = false;
  const walk = (list: Layer[]): Layer[] => {
    let changed = false;
    const out = list.map((l) => {
      if (done) return l;
      if (l.id === id) {
        done = true;
        const next = fn(l);
        if (next !== l) changed = true;
        return next;
      }
      if (l.type === 'group') {
        const kids = walk(l.children);
        if (kids !== l.children) {
          changed = true;
          return { ...l, children: kids };
        }
      }
      return l;
    });
    return changed ? out : list;
  };
  return walk(layers);
}

/** Remove every layer in `ids` (a removed group takes its children). */
export function removeLayers(layers: Layer[], ids: ReadonlySet<string>): Layer[] {
  let changed = false;
  const out: Layer[] = [];
  for (const l of layers) {
    if (ids.has(l.id)) {
      changed = true;
      continue;
    }
    if (l.type === 'group') {
      const kids = removeLayers(l.children, ids);
      if (kids !== l.children) {
        changed = true;
        out.push({ ...l, children: kids });
        continue;
      }
    }
    out.push(l);
  }
  return changed ? out : layers;
}

/** Insert `items` into `parentId`'s children at `index` (clamped; end when omitted). */
export function insertLayers(layers: Layer[], parentId: string | null, index: number | undefined, items: Layer[]): Layer[] {
  const put = (list: Layer[]) => {
    const at = index === undefined ? list.length : Math.max(0, Math.min(list.length, index));
    return [...list.slice(0, at), ...items, ...list.slice(at)];
  };
  if (parentId === null) return put(layers);
  return updateLayer(layers, parentId, (g) => (g.type === 'group' ? { ...g, children: put(g.children) } : g));
}

/** True when `maybeDescendant` is `ancestorId` itself or nested inside it. */
export function isWithin(layers: Layer[], ancestorId: string, maybeDescendant: string): boolean {
  if (ancestorId === maybeDescendant) return true;
  const a = findLayer(layers, ancestorId);
  return a?.type === 'group' ? findLayer(a.children, maybeDescendant) !== undefined : false;
}

/**
 * Move a layer to `parentId` at `index` (index in the destination list
 * BEFORE removal of the moved layer is accounted for — callers pass the
 * visual drop position). Refuses to move a group into itself.
 */
export function moveLayer(layers: Layer[], id: string, parentId: string | null, index: number): Layer[] {
  if (parentId !== null && isWithin(layers, id, parentId)) return layers;
  const loc = locateLayer(layers, id);
  const layer = findLayer(layers, id);
  if (!loc || !layer) return layers;
  let at = index;
  if (loc.parentId === parentId && loc.index < index) at -= 1;
  if (loc.parentId === parentId && loc.index === at) return layers;
  const without = removeLayers(layers, new Set([id]));
  return insertLayers(without, parentId, at, [layer]);
}

/** Matrix from a layer's parent space to the document (canvas) space. */
export function parentToDocMatrix(layers: Layer[], id: string): Matrix {
  const loc = locateLayer(layers, id);
  if (!loc) return IDENTITY;
  let m: Matrix = IDENTITY;
  for (const gid of loc.ancestors) {
    const g = findLayer(layers, gid);
    if (g) m = multiply(m, layerMatrix(g));
  }
  return m;
}

/** Matrix from a layer's own local space to the document space. */
export function localToDocMatrix(layers: Layer[], id: string): Matrix {
  const layer = findLayer(layers, id);
  if (!layer) return IDENTITY;
  return multiply(parentToDocMatrix(layers, id), layerMatrix(layer));
}

/**
 * Group the given layers: a new group is inserted where the topmost selected
 * layer was (in the parent of the first id); members from other parents are
 * re-parented with their on-canvas position preserved.
 */
export function groupLayers(layers: Layer[], ids: string[], groupId: string, name?: string): Layer[] {
  const order = orderedIds(layers, ids);
  if (order.length === 0) return layers;
  const anchor = locateLayer(layers, order[order.length - 1]);
  if (!anchor) return layers;
  const parentId = anchor.parentId;
  const targetParent = parentToDocMatrix(layers, order[order.length - 1]);
  const toTarget = invert(targetParent);
  const members: Layer[] = order.map((id) => {
    const layer = findLayer(layers, id)!;
    const loc = locateLayer(layers, id)!;
    if (loc.parentId === parentId || layer.type === 'raw') return layer;
    const full = multiply(toTarget, multiply(parentToDocMatrix(layers, id), layerMatrix(layer)));
    return { ...layer, transform: canonicalTransform(decomposeMatrix(full)) };
  });
  const idSet = new Set(order);
  // Index of the anchor once the members are gone.
  const siblings = childrenOf(layers, parentId);
  const at = siblings.slice(0, anchor.index).filter((l) => !idSet.has(l.id)).length;
  const group: GroupLayer = { type: 'group', id: groupId, ...(name ? { name } : {}), children: members };
  return insertLayers(removeLayers(layers, idSet), parentId, at, [group]);
}

/** Replace a group with its children, folding the group transform and opacity into them. */
export function ungroupLayer(layers: Layer[], groupId: string): Layer[] {
  const g = findLayer(layers, groupId);
  const loc = locateLayer(layers, groupId);
  if (!g || g.type !== 'group' || !loc) return layers;
  const gm = transformToMatrix(g.transform);
  const kids: Layer[] = g.children.map((c) => {
    if (c.type === 'raw') return c;
    let next: Layer = c;
    if (g.transform) {
      const full = multiply(gm, layerMatrix(c));
      next = { ...next, transform: canonicalTransform(decomposeMatrix(full)) } as Layer;
    }
    if (g.opacity !== undefined && next.type !== 'raw') {
      next = { ...next, opacity: Math.round((next.opacity ?? 1) * g.opacity * 1000) / 1000 } as Layer;
    }
    return next;
  });
  const without = removeLayers(layers, new Set([groupId]));
  return insertLayers(without, loc.parentId, loc.index, kids);
}

/** `ids` sorted into document (paint) order, dropping unknown and nested-in-selected ids. */
export function orderedIds(layers: Layer[], ids: Iterable<string>): string[] {
  const want = new Set(ids);
  const out: string[] = [];
  const walk = (list: Layer[], insideSelected: boolean) => {
    for (const l of list) {
      const selected = want.has(l.id);
      if (selected && !insideSelected) out.push(l.id);
      if (l.type === 'group') walk(l.children, insideSelected || selected);
    }
  };
  walk(layers, false);
  return out;
}

/** Every id in use anywhere in the document (layers, raw ids, defs). */
export function docIds(doc: Pick<VectorDoc, 'layers' | 'defs'>): Set<string> {
  const ids = new Set<string>();
  forEachLayer(doc, (l) => {
    ids.add(l.id);
    if (l.type === 'raw') for (const id of l.ids ?? []) ids.add(id);
  });
  for (const g of doc.defs.gradients) ids.add(g.id);
  for (const m of doc.defs.masks) ids.add(m.id);
  for (const c of doc.defs.clipPaths) ids.add(c.id);
  for (const f of doc.defs.filters) ids.add(f.id);
  for (const s of doc.defs.symbols) ids.add(s.id);
  return ids;
}

/** `prefix-N` with the smallest N not in `taken` (and adds it). */
export function nextId(taken: Set<string>, prefix: string): string {
  let n = 1;
  while (taken.has(`${prefix}-${n}`)) n++;
  const id = `${prefix}-${n}`;
  taken.add(id);
  return id;
}

/** Deep copy with fresh ids for every layer in the subtree. */
export function cloneWithNewIds(layer: Layer, taken: Set<string>): Layer {
  const id = nextId(taken, layer.type);
  if (layer.type === 'group') return { ...layer, id, children: layer.children.map((c) => cloneWithNewIds(c, taken)) };
  if (layer.type === 'raw') return { ...layer, id };
  return { ...structuredClone(layer), id };
}

/** Default panel label: the name, else a readable form of the type. */
export function layerLabel(layer: Layer): string {
  return layer.name ?? layer.id;
}
