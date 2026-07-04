'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';
import { useLocalization } from '@/i18n/useLocalization';

interface PageOrderListProps {
  files: File[];
  onReorder: (files: File[]) => void;
  onRemove: (index: number) => void;
  enableReorder: boolean;
}

// PageOrderList renders the uploaded pages as a thumbnail grid. When
// enableReorder is true (the dedicated tool page) pages can be drag-reordered
// with dnd-kit; otherwise it's a static ordered grid (remove still allowed). The
// home page keeps order but doesn't expose reordering for a single image.
const PageOrderList: React.FC<PageOrderListProps> = ({ files, onReorder, onRemove, enableReorder }) => {
  const { t } = useLocalization('interface');

  // Stable per-File ids so dnd-kit keys survive reorders (File has no id).
  const idMapRef = useRef(new WeakMap<File, string>());
  const counterRef = useRef(0);
  const getId = (file: File): string => {
    let id = idMapRef.current.get(file);
    if (!id) {
      id = `page-${counterRef.current++}`;
      idMapRef.current.set(file, id);
    }
    return id;
  };

  // Object-URL cache keyed by the stable id — created once per file, revoked on
  // removal / unmount so thumbnails don't flicker when pages are reordered.
  const urlCacheRef = useRef(new Map<string, string>());
  const [, force] = useState(0);
  useEffect(() => {
    const cache = urlCacheRef.current;
    const liveIds = new Set(files.map(getId));
    let changed = false;
    files.forEach((f) => {
      const id = getId(f);
      if (!cache.has(id)) {
        cache.set(id, URL.createObjectURL(f));
        changed = true;
      }
    });
    for (const [id, url] of Array.from(cache.entries())) {
      if (!liveIds.has(id)) {
        URL.revokeObjectURL(url);
        cache.delete(id);
        changed = true;
      }
    }
    if (changed) force((n) => n + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);
  useEffect(
    () => () => {
      urlCacheRef.current.forEach((u) => URL.revokeObjectURL(u));
      urlCacheRef.current.clear();
    },
    [],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const items = files.map((f) => ({ id: getId(f), file: f }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onReorder(arrayMove(files, oldIndex, newIndex));
  };

  if (files.length === 0) return null;

  const grid = (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item, index) => (
        <PageThumb
          key={item.id}
          id={item.id}
          index={index}
          url={urlCacheRef.current.get(item.id)}
          name={item.file.name}
          enableReorder={enableReorder}
          onRemove={() => onRemove(index)}
          pageLabel={t('documentScan.pageOrder.pageLabel', { n: index + 1 })}
          removeLabel={t('documentScan.pageOrder.remove')}
          dragLabel={t('documentScan.pageOrder.drag')}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">
        {t('documentScan.pageOrder.title', { count: files.length })}
      </p>
      {enableReorder && files.length > 1 && (
        <p className="text-xs text-muted-foreground">{t('documentScan.pageOrder.hint')}</p>
      )}
      {enableReorder ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
            {grid}
          </SortableContext>
        </DndContext>
      ) : (
        grid
      )}
    </div>
  );
};

interface PageThumbProps {
  id: string;
  index: number;
  url?: string;
  name: string;
  enableReorder: boolean;
  onRemove: () => void;
  pageLabel: string;
  removeLabel: string;
  dragLabel: string;
}

const PageThumb: React.FC<PageThumbProps> = ({
  id,
  url,
  name,
  enableReorder,
  onRemove,
  pageLabel,
  removeLabel,
  dragLabel,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: !enableReorder,
  });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative rounded-md border border-border bg-background/60 overflow-hidden group"
    >
      <div className="aspect-[3/4] w-full bg-muted flex items-center justify-center overflow-hidden">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={name} className="h-full w-full object-contain" />
        ) : (
          <span className="text-xs text-muted-foreground">…</span>
        )}
      </div>
      <div className="flex items-center justify-between px-2 py-1 text-xs">
        <span className="font-medium">{pageLabel}</span>
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className="text-muted-foreground hover:text-destructive"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
      {enableReorder && (
        <button
          type="button"
          aria-label={dragLabel}
          className="absolute top-1 left-1 cursor-grab rounded bg-background/80 p-0.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default PageOrderList;
