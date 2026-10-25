'use client';

import * as React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Circle,
  Code2,
  Eye,
  EyeOff,
  Group,
  Image as ImageIcon,
  Link2,
  Lock,
  Minus,
  PenTool,
  Scissors,
  Shapes,
  Square,
  Theater,
  Trash2,
  Type,
  Ungroup,
  Unlock,
  VenetianMask,
} from 'lucide-react';

import { Panel } from '@/components/darkroom/panel';
import { useLocalization } from '@/i18n/useLocalization';
import { childrenOf, findLayer, locateLayer } from '@/lib/vector/layerTree';
import { useVectorStore } from '@/lib/vector/vectorStore';
import type { Layer, LayerType } from '@/lib/vector/vectorTypes';
import { cn } from '@/lib/utils';

const TYPE_ICON: Record<LayerType, React.ComponentType<{ className?: string }>> = {
  group: Group,
  path: PenTool,
  rect: Square,
  ellipse: Circle,
  line: Minus,
  polyline: Shapes,
  polygon: Shapes,
  text: Type,
  image: ImageIcon,
  use: Link2,
  raw: Code2,
};

type DropPos = 'before' | 'after' | 'inside';

/**
 * Layer panel: the document tree with the TOP of the paint order first (like
 * every design tool). Reorder by drag (before / after / into a group),
 * group / ungroup, lock, hide, rename (double-click), delete. Layers used as
 * a mask or clip path of another layer show an icon; mask/clip contents are
 * listed under the layer that uses them.
 */
export function LayerPanel() {
  const { t } = useLocalization('interface');
  const doc = useVectorStore((s) => s.doc);
  const selection = useVectorStore((s) => s.selection);
  const [collapsed, setCollapsed] = React.useState<Set<string>>(() => new Set());
  const [drag, setDrag] = React.useState<{ id: string; over?: { id: string; pos: DropPos } } | null>(null);
  if (!doc) return null;

  const s = useVectorStore.getState;
  const toggleCollapse = (id: string) =>
    setCollapsed((c) => {
      const n = new Set(c);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const onDrop = () => {
    if (!drag?.over) return setDrag(null);
    const { id } = drag;
    const { id: targetId, pos } = drag.over;
    setDrag(null);
    if (id === targetId) return;
    if (pos === 'inside') {
      const target = findLayer(doc.layers, targetId);
      if (target?.type !== 'group') return;
      s().reorderLayer(id, targetId, target.children.length);
      return;
    }
    const loc = locateLayer(doc.layers, targetId);
    if (!loc) return;
    // The panel lists top-first; the document is bottom-first. "before" in the
    // panel = above = later in paint order.
    s().reorderLayer(id, loc.parentId, pos === 'before' ? loc.index + 1 : loc.index);
  };

  const canGroup = selection.length > 0;
  const canUngroup = selection.some((id) => findLayer(doc.layers, id)?.type === 'group');

  return (
    <Panel level="1" padding={false} className="flex min-h-0 flex-col" aria-label={t('vector.layers.title')}>
      <div className="flex items-center justify-between gap-2 border-b border-edge px-3 py-2">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t('vector.layers.title')}</h2>
        <div className="flex items-center gap-1">
          <IconButton label={t('vector.layers.group')} disabled={!canGroup} onClick={() => s().groupSelection()}>
            <Group className="size-3.5" />
          </IconButton>
          <IconButton label={t('vector.layers.ungroup')} disabled={!canUngroup} onClick={() => s().ungroupSelection()}>
            <Ungroup className="size-3.5" />
          </IconButton>
          <IconButton label={t('vector.layers.delete')} disabled={selection.length === 0} onClick={() => s().deleteSelection()}>
            <Trash2 className="size-3.5" />
          </IconButton>
        </div>
      </div>
      <div role="tree" aria-label={t('vector.layers.title')} aria-multiselectable className="min-h-0 flex-1 overflow-y-auto py-1" onDragEnd={() => setDrag(null)}>
        {doc.layers.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">{t('vector.layers.empty')}</p>
        ) : (
          <Rows
            layers={doc.layers}
            depth={0}
            ctx={{ collapsed, toggleCollapse, drag, setDrag, onDrop, selection, docLayers: doc.layers }}
          />
        )}
        {(doc.defs.masks.length > 0 || doc.defs.clipPaths.length > 0) && (
          <div className="mt-2 border-t border-edge pt-1">
            {doc.defs.masks.map((m) => (
              <DefRow key={m.id} icon={VenetianMask} label={t('vector.layers.maskDef', { id: m.id })} count={m.layers.length} />
            ))}
            {doc.defs.clipPaths.map((c) => (
              <DefRow key={c.id} icon={Scissors} label={t('vector.layers.clipDef', { id: c.id })} count={c.layers.length} />
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}

interface RowCtx {
  collapsed: Set<string>;
  toggleCollapse: (id: string) => void;
  drag: { id: string; over?: { id: string; pos: DropPos } } | null;
  setDrag: React.Dispatch<React.SetStateAction<{ id: string; over?: { id: string; pos: DropPos } } | null>>;
  onDrop: () => void;
  selection: string[];
  docLayers: Layer[];
}

function Rows({ layers, depth, ctx }: { layers: Layer[]; depth: number; ctx: RowCtx }) {
  // Top of the paint order first.
  return (
    <>
      {[...layers].reverse().map((l) => (
        <LayerRow key={l.id} layer={l} depth={depth} ctx={ctx} />
      ))}
    </>
  );
}

function LayerRow({ layer, depth, ctx }: { layer: Layer; depth: number; ctx: RowCtx }) {
  const { t } = useLocalization('interface');
  const [editing, setEditing] = React.useState(false);
  const s = useVectorStore.getState;
  const selected = ctx.selection.includes(layer.id);
  const isGroup = layer.type === 'group';
  const open = isGroup && !ctx.collapsed.has(layer.id);
  const Icon = TYPE_ICON[layer.type];
  const raw = layer.type === 'raw';
  const hidden = !raw && layer.hidden === true;
  const locked = !raw && layer.locked === true;
  const masked = !raw && layer.mask !== undefined;
  const clipped = !raw && layer.clipPath !== undefined;
  const label = layer.name ?? (raw ? t('vector.layers.raw') : t(`vector.layerTypes.${layer.type}`));
  const over = ctx.drag?.over?.id === layer.id ? ctx.drag.over.pos : null;

  const onDragOver = (e: React.DragEvent) => {
    if (!ctx.drag || ctx.drag.id === layer.id) return;
    e.preventDefault();
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const f = (e.clientY - r.top) / r.height;
    const pos: DropPos = isGroup && f > 0.3 && f < 0.7 ? 'inside' : f < 0.5 ? 'before' : 'after';
    if (ctx.drag.over?.id !== layer.id || ctx.drag.over.pos !== pos) ctx.setDrag({ id: ctx.drag.id, over: { id: layer.id, pos } });
  };

  return (
    <div role="treeitem" aria-selected={selected} aria-expanded={isGroup ? open : undefined} aria-level={depth + 1}>
      <div
        draggable={!editing}
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', layer.id);
          ctx.setDrag({ id: layer.id });
        }}
        onDragOver={onDragOver}
        onDrop={(e) => {
          e.preventDefault();
          ctx.onDrop();
        }}
        onClick={(e) => {
          if (e.shiftKey || e.metaKey || e.ctrlKey) s().toggleSelected(layer.id);
          else s().setSelection([layer.id]);
        }}
        onDoubleClick={() => !raw && setEditing(true)}
        className={cn(
          'group relative flex h-7 cursor-default items-center gap-1.5 pe-1.5 text-xs',
          selected ? 'bg-surface-3 text-foreground' : 'text-muted-foreground hover:bg-surface-2',
          hidden && 'opacity-50',
          over === 'inside' && 'outline outline-1 -outline-offset-1 outline-data',
        )}
        style={{ paddingInlineStart: 8 + depth * 14 }}
      >
        {over === 'before' && <span className="absolute inset-x-0 top-0 h-px bg-data" />}
        {over === 'after' && <span className="absolute inset-x-0 bottom-0 h-px bg-data" />}
        {isGroup ? (
          <button
            type="button"
            aria-label={open ? t('vector.layers.collapse') : t('vector.layers.expand')}
            onClick={(e) => {
              e.stopPropagation();
              ctx.toggleCollapse(layer.id);
            }}
            className="grid size-4 place-items-center rounded-sm hover:bg-surface-3"
          >
            {open ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3 rtl:-scale-x-100" />}
          </button>
        ) : (
          <span className="size-4" />
        )}
        <Icon className="size-3.5 shrink-0" />
        {editing ? (
          <input
            autoFocus
            defaultValue={layer.name ?? ''}
            placeholder={label}
            aria-label={t('vector.layers.rename')}
            maxLength={200}
            onClick={(e) => e.stopPropagation()}
            onBlur={(e) => {
              setEditing(false);
              const v = e.target.value.trim();
              if (v !== (layer.name ?? '')) s().patchLayer(layer.id, 'Rename', (l) => (v ? { ...l, name: v } : omit(l, 'name')));
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
              if (e.key === 'Escape') setEditing(false);
              e.stopPropagation();
            }}
            className="h-5 min-w-0 flex-1 rounded-sm border border-data bg-surface-1 px-1 text-foreground outline-none"
          />
        ) : (
          <span className="min-w-0 flex-1 truncate">{label}</span>
        )}
        {masked && <VenetianMask className="size-3 text-data" aria-label={t('vector.layers.masked')} />}
        {clipped && <Scissors className="size-3 text-data" aria-label={t('vector.layers.clipped')} />}
        {raw && <Theater className="size-3 text-premium" aria-label={t('vector.layers.rawHint')} />}
        {!raw && (
          <>
            <RowToggle
              active={locked}
              label={locked ? t('vector.layers.unlock') : t('vector.layers.lock')}
              onClick={() => s().patchLayer(layer.id, locked ? 'Unlock' : 'Lock', (l) => (locked ? omit(l, 'locked') : { ...l, locked: true }))}
            >
              {locked ? <Lock className="size-3" /> : <Unlock className="size-3" />}
            </RowToggle>
            <RowToggle
              active={hidden}
              label={hidden ? t('vector.layers.show') : t('vector.layers.hide')}
              onClick={() => s().patchLayer(layer.id, hidden ? 'Show' : 'Hide', (l) => (hidden ? omit(l, 'hidden') : { ...l, hidden: true }))}
            >
              {hidden ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
            </RowToggle>
          </>
        )}
      </div>
      {isGroup && open && <Rows layers={childrenOf(ctx.docLayers, layer.id)} depth={depth + 1} ctx={ctx} />}
    </div>
  );
}

function omit<L extends Layer>(l: L, key: string): L {
  const next = { ...l } as Record<string, unknown>;
  delete next[key];
  return next as L;
}

function RowToggle({ active, label, onClick, children }: { active: boolean; label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        'grid size-5 place-items-center rounded-sm hover:bg-surface-3 hover:text-foreground',
        active ? 'text-foreground' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
      )}
    >
      {children}
    </button>
  );
}

function DefRow({ icon: Icon, label, count }: { icon: React.ComponentType<{ className?: string }>; label: string; count: number }) {
  return (
    <div className="flex h-7 items-center gap-1.5 ps-[30px] pe-2 text-xs text-muted-foreground">
      <Icon className="size-3.5 text-data" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className="font-mono tabular-nums">{count}</span>
    </div>
  );
}

export function IconButton({
  label,
  disabled,
  onClick,
  active,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'grid size-7 place-items-center rounded-md border border-transparent text-muted-foreground transition-colors',
        'hover:border-edge hover:bg-surface-2 hover:text-foreground disabled:pointer-events-none disabled:opacity-40',
        active && 'border-edge-strong bg-surface-3 text-foreground',
      )}
    >
      {children}
    </button>
  );
}
