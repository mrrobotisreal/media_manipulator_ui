'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FilePlus2, FolderPlus } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { buildDocTree, folderParentMap, isSelfOrDescendant } from '@/lib/dr/docTree';
import { useDrDocFolderMutations } from '@/lib/dr/useDrDocs';
import type { DrDocFolder, DrDocSummary } from '@/schemas/drDocs';
import DrDeleteDocDialog from '../dr-delete-doc-dialog';
import { MoveDocDialog, NameDialog } from './doc-dialogs';
import { DocTreeNodeRow, type DragPayload } from './doc-tree-node';

// The VS Code-style Documentation explorer: nestable folders + documents,
// assembled client-side from the flat folders + docs lists (lib/dr/docTree).
// Context menus and the ⋯ dropdown drive create/rename/move/delete; native
// HTML5 drag-and-drop is an enhancement (the Move to… dialog is the
// accessible/touch path). Expanded state persists in localStorage.

const EXPANDED_KEY = 'dr:docs:expanded';

function loadExpanded(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(EXPANDED_KEY);
    const ids = raw ? (JSON.parse(raw) as unknown) : [];
    return new Set(Array.isArray(ids) ? ids.filter((v): v is string => typeof v === 'string') : []);
  } catch {
    return new Set();
  }
}

interface ExplorerContextValue {
  isExpanded: (folderId: string) => boolean;
  toggle: (folderId: string) => void;
  newDocIn: (folderId: string | null) => void;
  newFolderIn: (parentId: string | null) => void;
  renameFolder: (folder: DrDocFolder) => void;
  deleteFolder: (folder: DrDocFolder) => void;
  renameDoc: (doc: DrDocSummary) => void;
  moveDocTo: (doc: DrDocSummary) => void;
  deleteDoc: (doc: DrDocSummary) => void;
  // Drag and drop
  dragged: DragPayload | null;
  setDragged: (p: DragPayload | null) => void;
  canDropOn: (targetFolderId: string | null) => boolean;
  dropOn: (targetFolderId: string | null) => void;
}

const ExplorerContext = createContext<ExplorerContextValue | null>(null);

export function useExplorer(): ExplorerContextValue {
  const ctx = useContext(ExplorerContext);
  if (!ctx) throw new Error('useExplorer must be used inside DocsExplorer');
  return ctx;
}

export default function DocsExplorer({ folders, docs }: { folders: DrDocFolder[]; docs: DrDocSummary[] }) {
  const router = useRouter();
  const { create, update, remove, moveDoc, renameDoc } = useDrDocFolderMutations();

  const tree = useMemo(() => buildDocTree(folders, docs), [folders, docs]);
  const parents = useMemo(() => folderParentMap(folders), [folders]);

  const [expanded, setExpanded] = useState<Set<string>>(loadExpanded);
  const persistExpanded = useCallback((next: Set<string>) => {
    setExpanded(next);
    try {
      window.localStorage.setItem(EXPANDED_KEY, JSON.stringify([...next]));
    } catch {
      // localStorage unavailable (private mode) — expansion just won't persist.
    }
  }, []);

  // Dialog state — one of each kind at a time.
  const [createIn, setCreateIn] = useState<{ parentId: string | null } | null>(null);
  const [renamingFolder, setRenamingFolder] = useState<DrDocFolder | null>(null);
  const [renamingDoc, setRenamingDoc] = useState<DrDocSummary | null>(null);
  const [movingDoc, setMovingDoc] = useState<DrDocSummary | null>(null);
  const [deletingDoc, setDeletingDoc] = useState<DrDocSummary | null>(null);

  const [dragged, setDragged] = useState<DragPayload | null>(null);

  const canDropOn = useCallback(
    (targetFolderId: string | null) => {
      if (!dragged) return false;
      if (dragged.type === 'doc') return true;
      // A folder can't drop into itself or its own subtree; root is always ok.
      if (targetFolderId === null) return true;
      return !isSelfOrDescendant(parents, dragged.id, targetFolderId);
    },
    [dragged, parents],
  );

  const dropOn = useCallback(
    (targetFolderId: string | null) => {
      if (!dragged || !canDropOn(targetFolderId)) return;
      if (dragged.type === 'doc') {
        moveDoc.mutate({ docId: dragged.id, folderId: targetFolderId });
      } else if (dragged.id !== targetFolderId) {
        update.mutate({ folderId: dragged.id, body: { parentId: targetFolderId } });
      }
      setDragged(null);
    },
    [dragged, canDropOn, moveDoc, update],
  );

  const ctx: ExplorerContextValue = {
    isExpanded: (id) => expanded.has(id),
    toggle: (id) => {
      const next = new Set(expanded);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      persistExpanded(next);
    },
    newDocIn: (folderId) =>
      router.push(folderId ? `/dr/docs/new?folder=${encodeURIComponent(folderId)}` : '/dr/docs/new'),
    newFolderIn: (parentId) => setCreateIn({ parentId }),
    renameFolder: setRenamingFolder,
    deleteFolder: (folder) => remove.mutate(folder.id),
    renameDoc: setRenamingDoc,
    moveDocTo: setMovingDoc,
    deleteDoc: setDeletingDoc,
    dragged,
    setDragged,
    canDropOn,
    dropOn,
  };

  // Basic keyboard walk: ↑/↓ move focus across the visible rows; Enter is
  // handled per-row (folders toggle, documents navigate).
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const rows = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[data-tree-row]'));
    const index = rows.indexOf(document.activeElement as HTMLElement);
    const next = e.key === 'ArrowDown' ? Math.min(index + 1, rows.length - 1) : Math.max(index - 1, 0);
    rows[next]?.focus();
    e.preventDefault();
  };

  return (
    <ExplorerContext.Provider value={ctx}>
      <div onKeyDown={onKeyDown}>
        {/* Root drop zone: drag anything here to move it back to root. */}
        {dragged && (
          <RootDropZone />
        )}

        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div className="min-h-40 rounded-lg border border-border/60 bg-card/40 p-1.5">
              {tree.length === 0 ? (
                <p className="p-6 text-center text-sm text-muted-foreground">No documents yet.</p>
              ) : (
                <ul role="tree" aria-label="Documentation">
                  {tree.map((node) => (
                    <DocTreeNodeRow
                      key={node.kind === 'folder' ? node.folder.id : node.doc.id}
                      node={node}
                      depth={0}
                    />
                  ))}
                </ul>
              )}
            </div>
          </ContextMenuTrigger>
          {/* Right-click on the empty area → create at root. */}
          <ContextMenuContent>
            <ContextMenuItem onSelect={() => ctx.newFolderIn(null)}>
              <FolderPlus className="size-4" /> New Folder
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => ctx.newDocIn(null)}>
              <FilePlus2 className="size-4" /> New Document
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>

      {/* Dialogs — keyed by their target so switching targets remounts and
          re-seeds the input state. */}
      <NameDialog
        key={`create-${createIn?.parentId ?? 'root'}`}
        open={createIn !== null}
        onOpenChange={(o) => {
          if (!o) setCreateIn(null);
        }}
        title="New folder"
        label="Folder name"
        initialValue=""
        submitLabel="Create"
        pending={create.isPending}
        onSubmit={(name) => {
          if (!createIn) return;
          create.mutate(
            { name, parentId: createIn.parentId },
            { onSuccess: () => setCreateIn(null) },
          );
        }}
      />
      <NameDialog
        key={`rename-folder-${renamingFolder?.id ?? 'none'}`}
        open={renamingFolder !== null}
        onOpenChange={(o) => {
          if (!o) setRenamingFolder(null);
        }}
        title="Rename folder"
        label="Folder name"
        initialValue={renamingFolder?.name ?? ''}
        submitLabel="Rename"
        pending={update.isPending}
        onSubmit={(name) => {
          if (!renamingFolder) return;
          update.mutate(
            { folderId: renamingFolder.id, body: { name } },
            { onSuccess: () => setRenamingFolder(null) },
          );
        }}
      />
      <NameDialog
        key={`rename-doc-${renamingDoc?.id ?? 'none'}`}
        open={renamingDoc !== null}
        onOpenChange={(o) => {
          if (!o) setRenamingDoc(null);
        }}
        title="Rename document"
        label="Title"
        description="Renaming changes the title only — the document's link stays the same."
        initialValue={renamingDoc?.title ?? ''}
        submitLabel="Rename"
        pending={renameDoc.isPending}
        onSubmit={(title) => {
          if (!renamingDoc) return;
          renameDoc.mutate(
            { docId: renamingDoc.id, title },
            { onSuccess: () => setRenamingDoc(null) },
          );
        }}
      />
      <MoveDocDialog
        key={`move-doc-${movingDoc?.id ?? 'none'}`}
        doc={movingDoc}
        folders={folders}
        pending={moveDoc.isPending}
        onOpenChange={(o) => {
          if (!o) setMovingDoc(null);
        }}
        onMove={(folderId) => {
          if (!movingDoc) return;
          moveDoc.mutate(
            { docId: movingDoc.id, folderId },
            { onSuccess: () => setMovingDoc(null) },
          );
        }}
      />
      {deletingDoc && (
        <DrDeleteDocDialog
          docId={deletingDoc.id}
          slug={deletingDoc.slug}
          title={deletingDoc.title}
          open
          onOpenChange={(o) => {
            if (!o) setDeletingDoc(null);
          }}
          onDeleted={() => setDeletingDoc(null)}
        />
      )}
    </ExplorerContext.Provider>
  );
}

// A slim always-valid drop target that appears while dragging, so anything can
// be pulled back to the root level.
function RootDropZone() {
  const { dropOn } = useExplorer();
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        dropOn(null);
      }}
      className={
        'mb-1.5 rounded-md border border-dashed px-3 py-1.5 text-center text-xs transition-colors ' +
        (over ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground')
      }
    >
      Drop here to move to the top level
    </div>
  );
}
