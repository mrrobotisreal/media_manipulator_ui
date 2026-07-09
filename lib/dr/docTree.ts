import type { DrDocFolder, DrDocSummary } from '@/schemas/drDocs';

// Pure tree assembly for the Documentation explorer: the API ships a FLAT
// folder list + the (flat) docs list; this module builds the render tree.
// Kept free of React so the sorting/orphan rules are testable by inspection.
//
// Rules:
//   - folders first, then documents, each alphabetical case-insensitive;
//   - orphans (a folder whose parentId or a doc whose folderId no longer
//     resolves — e.g. the folder was deleted by the other user between
//     fetches) render at ROOT rather than vanishing;
//   - a defensive cycle guard: folders never reachable from the roots (only
//     possible with corrupt data) are appended at root instead of looping.

export interface DocTreeFolderNode {
  kind: 'folder';
  folder: DrDocFolder;
  children: DocTreeNode[];
  /** Direct children count (folders + docs) — the row's subtle hint. */
  childCount: number;
}

export interface DocTreeDocNode {
  kind: 'doc';
  doc: DrDocSummary;
}

export type DocTreeNode = DocTreeFolderNode | DocTreeDocNode;

const byName = new Intl.Collator(undefined, { sensitivity: 'base' });

export function buildDocTree(folders: DrDocFolder[], docs: DrDocSummary[]): DocTreeNode[] {
  const folderIds = new Set(folders.map((f) => f.id));

  // Group children by parent, treating unresolvable parents as root.
  const childFolders = new Map<string, DrDocFolder[]>(); // parent id ('' = root) → folders
  for (const f of folders) {
    const parent = f.parentId && folderIds.has(f.parentId) && f.parentId !== f.id ? f.parentId : '';
    const list = childFolders.get(parent) ?? [];
    list.push(f);
    childFolders.set(parent, list);
  }
  const childDocs = new Map<string, DrDocSummary[]>();
  for (const d of docs) {
    const parent = d.folderId && folderIds.has(d.folderId) ? d.folderId : '';
    const list = childDocs.get(parent) ?? [];
    list.push(d);
    childDocs.set(parent, list);
  }

  const visited = new Set<string>();
  const build = (parent: string): DocTreeNode[] => {
    const subFolders = [...(childFolders.get(parent) ?? [])].sort((a, b) => byName.compare(a.name, b.name));
    const subDocs = [...(childDocs.get(parent) ?? [])].sort((a, b) => byName.compare(a.title, b.title));
    const nodes: DocTreeNode[] = [];
    for (const f of subFolders) {
      if (visited.has(f.id)) continue; // cycle guard
      visited.add(f.id);
      const children = build(f.id);
      nodes.push({ kind: 'folder', folder: f, children, childCount: children.length });
    }
    for (const d of subDocs) {
      nodes.push({ kind: 'doc', doc: d });
    }
    return nodes;
  };

  const roots = build('');

  // Corrupt-data backstop: any folder unreachable from the roots (a parent
  // cycle) surfaces at root instead of disappearing.
  const stragglers = folders
    .filter((f) => !visited.has(f.id))
    .sort((a, b) => byName.compare(a.name, b.name));
  for (const f of stragglers) {
    if (visited.has(f.id)) continue;
    visited.add(f.id);
    const children = build(f.id);
    roots.push({ kind: 'folder', folder: f, children, childCount: children.length });
  }
  return roots;
}

/** parent map ('' = root) for client-side cycle guards during drag-and-drop. */
export function folderParentMap(folders: DrDocFolder[]): Map<string, string> {
  const parents = new Map<string, string>();
  for (const f of folders) parents.set(f.id, f.parentId ?? '');
  return parents;
}

/** True when moving `folderId` under `targetId` would nest it into itself or
 *  its own subtree (mirrors the server check — the server still enforces). */
export function isSelfOrDescendant(parents: Map<string, string>, folderId: string, targetId: string): boolean {
  let guard = 0;
  for (let id = targetId; id !== ''; id = parents.get(id) ?? '') {
    if (id === folderId) return true;
    if (++guard > parents.size + 1) return true; // corrupt map — fail safe
  }
  return false;
}
