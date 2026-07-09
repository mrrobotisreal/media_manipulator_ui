'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  FilePlus2,
  FileText,
  Folder,
  FolderInput,
  FolderOpen,
  FolderPlus,
  MoreHorizontal,
  Pencil,
  SquarePen,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { DocTreeNode } from '@/lib/dr/docTree';
import type { DrDocFolder, DrDocSummary } from '@/schemas/drDocs';
import { useExplorer } from './doc-tree';

// One explorer row (folder or document), recursive for expanded folders.
// Every row has BOTH a right-click context menu and a ⋯ dropdown (hover /
// always-visible on touch widths) so mobile isn't locked out. Rows are
// draggable; folder rows are drop targets with a highlight ring.

export interface DragPayload {
  type: 'doc' | 'folder';
  id: string;
}

function formatUpdated(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(d);
}

const rowClass =
  'group flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm outline-none transition-colors ' +
  'hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring';

export function DocTreeNodeRow({ node, depth }: { node: DocTreeNode; depth: number }) {
  if (node.kind === 'folder') {
    return <FolderRow folder={node.folder} childNodes={node.children} childCount={node.childCount} depth={depth} />;
  }
  return <DocRow doc={node.doc} depth={depth} />;
}

function FolderRow({
  folder,
  childNodes,
  childCount,
  depth,
}: {
  folder: DrDocFolder;
  childNodes: DocTreeNode[];
  childCount: number;
  depth: number;
}) {
  const ex = useExplorer();
  const open = ex.isExpanded(folder.id);
  const [dropReady, setDropReady] = useState(false);
  const isEmpty = childCount === 0;

  const menuItems = (
    <>
      <MenuItem asContext icon={<FilePlus2 className="size-4" />} label="New Document here" onSelect={() => ex.newDocIn(folder.id)} />
      <MenuItem asContext icon={<FolderPlus className="size-4" />} label="New Folder here" onSelect={() => ex.newFolderIn(folder.id)} />
      <ContextMenuSeparator />
      <MenuItem asContext icon={<Pencil className="size-4" />} label="Rename" onSelect={() => ex.renameFolder(folder)} />
      <MenuItem
        asContext
        icon={<Trash2 className="size-4" />}
        label={isEmpty ? 'Delete' : 'Delete (empty it first)'}
        destructive
        disabled={!isEmpty}
        onSelect={() => ex.deleteFolder(folder)}
      />
    </>
  );

  return (
    <li role="treeitem" aria-expanded={open} aria-selected={false}>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            data-tree-row
            tabIndex={0}
            role="button"
            draggable
            onDragStart={(e) => {
              ex.setDragged({ type: 'folder', id: folder.id });
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragEnd={() => ex.setDragged(null)}
            onDragOver={(e) => {
              if (!ex.canDropOn(folder.id)) return;
              e.preventDefault();
              setDropReady(true);
            }}
            onDragLeave={() => setDropReady(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDropReady(false);
              ex.dropOn(folder.id);
            }}
            onClick={() => ex.toggle(folder.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                ex.toggle(folder.id);
              }
            }}
            className={cn(rowClass, 'cursor-pointer', dropReady && 'ring-2 ring-primary/70 bg-primary/10')}
            style={{ paddingLeft: `${8 + depth * 16}px` }}
          >
            <ChevronRight className={cn('size-3.5 shrink-0 text-muted-foreground transition-transform', open && 'rotate-90')} />
            {open ? (
              <FolderOpen className="size-4 shrink-0 text-primary" />
            ) : (
              <Folder className="size-4 shrink-0 text-primary" />
            )}
            <span className="min-w-0 flex-1 truncate font-medium">{folder.name}</span>
            <span className="text-[11px] tabular-nums text-muted-foreground">{childCount || ''}</span>
            <RowMenu>
              <MenuItem icon={<FilePlus2 className="size-4" />} label="New Document here" onSelect={() => ex.newDocIn(folder.id)} />
              <MenuItem icon={<FolderPlus className="size-4" />} label="New Folder here" onSelect={() => ex.newFolderIn(folder.id)} />
              <DropdownMenuSeparator />
              <MenuItem icon={<Pencil className="size-4" />} label="Rename" onSelect={() => ex.renameFolder(folder)} />
              <MenuItem
                icon={<Trash2 className="size-4" />}
                label={isEmpty ? 'Delete' : 'Delete (empty it first)'}
                destructive
                disabled={!isEmpty}
                onSelect={() => ex.deleteFolder(folder)}
              />
            </RowMenu>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>{menuItems}</ContextMenuContent>
      </ContextMenu>

      {open && (
        <ul role="group">
          {childNodes.length === 0 ? (
            <li
              className="px-2 py-1 text-xs italic text-muted-foreground"
              style={{ paddingLeft: `${8 + (depth + 1) * 16 + 22}px` }}
            >
              Empty
            </li>
          ) : (
            childNodes.map((child) => (
              <DocTreeNodeRow
                key={child.kind === 'folder' ? child.folder.id : child.doc.id}
                node={child}
                depth={depth + 1}
              />
            ))
          )}
        </ul>
      )}
    </li>
  );
}

function DocRow({ doc, depth }: { doc: DrDocSummary; depth: number }) {
  const ex = useExplorer();
  const router = useRouter();

  const contextItems = (
    <>
      <MenuItem asContext label="Open" icon={<FileText className="size-4" />} onSelect={() => router.push(`/dr/docs/${doc.slug}`)} />
      <MenuItem asContext label="Edit" icon={<SquarePen className="size-4" />} onSelect={() => router.push(`/dr/docs/${doc.slug}/edit`)} />
      <ContextMenuSeparator />
      <MenuItem asContext label="Rename" icon={<Pencil className="size-4" />} onSelect={() => ex.renameDoc(doc)} />
      <MenuItem asContext label="Move to…" icon={<FolderInput className="size-4" />} onSelect={() => ex.moveDocTo(doc)} />
      {doc.canDelete && (
        <>
          <ContextMenuSeparator />
          <MenuItem asContext label="Delete" icon={<Trash2 className="size-4" />} destructive onSelect={() => ex.deleteDoc(doc)} />
        </>
      )}
    </>
  );

  return (
    <li role="treeitem" aria-selected={false}>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="flex items-center">
            <Link
              href={`/dr/docs/${doc.slug}`}
              data-tree-row
              draggable
              onDragStart={(e) => {
                ex.setDragged({ type: 'doc', id: doc.id });
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDragEnd={() => ex.setDragged(null)}
              className={cn(rowClass, 'min-w-0 flex-1')}
              style={{ paddingLeft: `${8 + depth * 16 + 18}px` }}
            >
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate">{doc.title}</span>
              {doc.hasEditSession && (
                <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] text-amber-600 dark:text-amber-400">
                  editing
                </span>
              )}
              <span className="hidden text-[11px] text-muted-foreground sm:inline">{formatUpdated(doc.updatedAt)}</span>
              <RowMenu>
                <MenuItem label="Open" icon={<FileText className="size-4" />} onSelect={() => router.push(`/dr/docs/${doc.slug}`)} />
                <MenuItem label="Edit" icon={<SquarePen className="size-4" />} onSelect={() => router.push(`/dr/docs/${doc.slug}/edit`)} />
                <DropdownMenuSeparator />
                <MenuItem label="Rename" icon={<Pencil className="size-4" />} onSelect={() => ex.renameDoc(doc)} />
                <MenuItem label="Move to…" icon={<FolderInput className="size-4" />} onSelect={() => ex.moveDocTo(doc)} />
                {doc.canDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <MenuItem label="Delete" icon={<Trash2 className="size-4" />} destructive onSelect={() => ex.deleteDoc(doc)} />
                  </>
                )}
              </RowMenu>
            </Link>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>{contextItems}</ContextMenuContent>
      </ContextMenu>
    </li>
  );
}

// The ⋯ dropdown shared by both row types. Stops click/drag from bubbling into
// the row's navigation/toggle. Hidden until hover on fine pointers,
// always visible on coarse/touch widths.
function RowMenu({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Row actions"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          draggable={false}
          className="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100 max-sm:opacity-100"
        >
          <MoreHorizontal className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// One menu entry rendered as either a ContextMenuItem or DropdownMenuItem.
function MenuItem({
  label,
  icon,
  onSelect,
  destructive,
  disabled,
  asContext,
}: {
  label: string;
  icon: React.ReactNode;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
  asContext?: boolean;
}) {
  const className = destructive ? 'text-destructive focus:text-destructive' : undefined;
  if (asContext) {
    return (
      <ContextMenuItem className={className} disabled={disabled} onSelect={onSelect}>
        {icon} {label}
      </ContextMenuItem>
    );
  }
  return (
    <DropdownMenuItem className={className} disabled={disabled} onSelect={onSelect}>
      {icon} {label}
    </DropdownMenuItem>
  );
}
