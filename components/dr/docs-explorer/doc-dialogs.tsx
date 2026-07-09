'use client';

import { useMemo, useState } from 'react';
import { Folder, House, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { buildDocTree, type DocTreeFolderNode, type DocTreeNode } from '@/lib/dr/docTree';
import type { DrDocFolder, DrDocSummary } from '@/schemas/drDocs';

// The explorer's two small dialogs: a generic name/title prompt (create
// folder, rename folder, rename document — Enter submits) and the Move to…
// folder picker (the accessible/touch fallback for drag-and-drop).

export function NameDialog({
  open,
  onOpenChange,
  title,
  label,
  description,
  initialValue,
  submitLabel,
  pending,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  label: string;
  description?: string;
  initialValue: string;
  submitLabel: string;
  pending: boolean;
  onSubmit: (value: string) => void;
}) {
  // Callers key this component by its target (folder/doc id), so a different
  // target remounts it and the initializer re-seeds — no effect needed.
  const [value, setValue] = useState(initialValue);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <Input
            autoFocus
            aria-label={label}
            placeholder={label}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending || value.trim() === ''}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function MoveDocDialog({
  doc,
  folders,
  pending,
  onOpenChange,
  onMove,
}: {
  doc: DrDocSummary | null;
  folders: DrDocFolder[];
  pending: boolean;
  onOpenChange: (open: boolean) => void;
  onMove: (folderId: string | null) => void;
}) {
  // null = Root. Callers key this component by the doc id, so the initializer
  // re-seeds to the document's current spot per target — no effect needed.
  const [selected, setSelected] = useState<string | null>(doc?.folderId ?? null);

  const tree = useMemo(() => buildDocTree(folders, []), [folders]);

  const renderFolder = (node: DocTreeFolderNode, depth: number): React.ReactNode => (
    <div key={node.folder.id}>
      <PickerRow
        depth={depth + 1}
        selected={selected === node.folder.id}
        onClick={() => setSelected(node.folder.id)}
        icon={<Folder className="size-4 text-primary" />}
        label={node.folder.name}
      />
      {node.children
        .filter((c): c is DocTreeFolderNode => c.kind === 'folder')
        .map((c) => renderFolder(c, depth + 1))}
    </div>
  );

  return (
    <Dialog open={doc !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Move document</DialogTitle>
          <DialogDescription className="truncate">{doc?.title}</DialogDescription>
        </DialogHeader>
        <div className="max-h-72 overflow-y-auto rounded-md border border-border p-1">
          <PickerRow
            depth={0}
            selected={selected === null}
            onClick={() => setSelected(null)}
            icon={<House className="size-4 text-muted-foreground" />}
            label="Root"
          />
          {tree
            .filter((n): n is DocTreeFolderNode => n.kind === 'folder')
            .map((n: DocTreeNode) => renderFolder(n as DocTreeFolderNode, 0))}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={pending} onClick={() => onMove(selected)}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            Move
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PickerRow({
  depth,
  selected,
  onClick,
  icon,
  label,
}: {
  depth: number;
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent/50',
        selected && 'bg-primary/10 text-primary',
      )}
      style={{ paddingLeft: `${8 + depth * 16}px` }}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}
