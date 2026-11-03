'use client';

import * as React from 'react';
import { Copy, Eye, EyeOff, GripVertical, Trash2 } from 'lucide-react';
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useLocalization } from '@/i18n/useLocalization';
import { duplicateLayer, moveLayer, patchLayer, removeLayer } from '@/lib/photo/layerOps';
import { usePhotoStore } from '@/lib/photo/photoStore';
import { BLEND_MODES, type AdjustmentLayer } from '@/lib/photo/photoTypes';
import { cn } from '@/lib/utils';
import { AdjustSlider } from './controls';

export type PanelId = 'basic' | 'curves' | 'levels' | 'hsl' | 'colorBalance' | 'blackWhite' | 'channelMixer' | 'photoFilter' | 'splitTone' | 'lut' | 'effects';

/** The panel a layer type opens when selected. */
export function panelForLayer(type: AdjustmentLayer['type']): PanelId | null {
  switch (type) {
    case 'exposure':
    case 'brightnessContrast':
    case 'tone':
    case 'whiteBalance':
    case 'vibranceSaturation':
      return 'basic';
    case 'curves':
    case 'levels':
    case 'hsl':
    case 'colorBalance':
    case 'blackWhite':
    case 'channelMixer':
    case 'photoFilter':
    case 'splitTone':
    case 'lut':
      return type;
    case 'invert':
    case 'posterize':
    case 'threshold':
    case 'gamma':
      return 'effects';
    default:
      return null;
  }
}

function Row({ layer, selected, onSelect, onOpenPanel }: { layer: AdjustmentLayer; selected: boolean; onSelect: () => void; onOpenPanel: (p: PanelId) => void }) {
  const { t } = useLocalization('interface');
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: layer.id });
  const [editing, setEditing] = React.useState(false);
  const name = layer.name || t(`photo.layers.type.${layer.type}`);
  const mutate = usePhotoStore.getState().mutate;

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn('space-y-2 rounded-md border px-2 py-2', selected ? 'border-primary bg-primary/10' : 'border-edge bg-surface-2', isDragging && 'opacity-60')}
      data-testid={`layer-row-${layer.id}`}
    >
      <div className="flex items-center gap-1.5">
        <button type="button" className="cursor-grab touch-none text-muted-foreground" aria-label={t('photo.layers.moveUp')} {...attributes} {...listeners}>
          <GripVertical className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={layer.enabled ? t('photo.layers.disable') : t('photo.layers.enable')}
          aria-pressed={layer.enabled}
          onClick={() => mutate('Toggle layer', (d) => patchLayer(d, layer.id, { enabled: !layer.enabled }))}
          className="text-muted-foreground hover:text-foreground"
        >
          {layer.enabled ? <Eye className="size-4" aria-hidden="true" /> : <EyeOff className="size-4" aria-hidden="true" />}
        </button>
        {editing ? (
          <input
            autoFocus
            aria-label={t('photo.layers.rename')}
            defaultValue={layer.name ?? ''}
            maxLength={80}
            className="min-w-0 flex-1 rounded border border-edge bg-background px-1 text-sm"
            onBlur={(e) => {
              const v = e.target.value.trim();
              mutate('Rename layer', (d) => patchLayer(d, layer.id, { name: v }));
              setEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
              if (e.key === 'Escape') setEditing(false);
            }}
          />
        ) : (
          <button
            type="button"
            className="min-w-0 flex-1 truncate text-start text-sm"
            aria-label={t('photo.layers.selectLayer', { name })}
            onClick={() => {
              onSelect();
              const panel = panelForLayer(layer.type);
              if (panel) onOpenPanel(panel);
            }}
            onDoubleClick={() => setEditing(true)}
          >
            {name}
          </button>
        )}
        <button type="button" aria-label={t('photo.layers.duplicate')} className="text-muted-foreground hover:text-foreground" onClick={() => mutate('Duplicate layer', (d) => duplicateLayer(d, layer.id).doc)}>
          <Copy className="size-4" aria-hidden="true" />
        </button>
        <button type="button" aria-label={t('photo.layers.delete')} className="text-muted-foreground hover:text-destructive" onClick={() => mutate('Delete layer', (d) => removeLayer(d, layer.id))}>
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>
      {selected ? (
        <div className="space-y-2 ps-6">
          <AdjustSlider
            label={t('photo.layers.opacity')}
            value={Math.round(layer.opacity * 100)}
            min={0}
            max={100}
            defaultValue={100}
            gestureLabel="layer.opacity"
            onChange={(v) => mutate('Layer opacity', (d) => patchLayer(d, layer.id, { opacity: v / 100 }))}
          />
          <label className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            {t('photo.layers.blend')}
            <select
              className="rounded border border-edge bg-surface-2 px-1 py-0.5 text-foreground"
              value={layer.blend}
              onChange={(e) => mutate('Blend mode', (d) => patchLayer(d, layer.id, { blend: e.target.value as AdjustmentLayer['blend'] }))}
            >
              {BLEND_MODES.map((m) => (
                <option key={m} value={m}>
                  {t(`photo.layers.blendMode.${m}`)}
                </option>
              ))}
            </select>
          </label>
          <button type="button" disabled className="w-full cursor-not-allowed rounded border border-dashed border-edge px-2 py-1 text-xs text-muted-foreground" title={t('photo.layers.mask')}>
            {t('photo.layers.mask')}
          </button>
        </div>
      ) : null}
    </li>
  );
}

export function LayersPanel({ onOpenPanel }: { onOpenPanel: (p: PanelId) => void }) {
  const { t } = useLocalization('interface');
  const layers = usePhotoStore((s) => s.doc?.layers ?? []);
  const selection = usePhotoStore((s) => s.selection);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  // Top of the list = top of the stack (last applied).
  const display = React.useMemo(() => [...layers].reverse(), [layers]);

  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    const to = display.findIndex((l) => l.id === e.over!.id);
    // display index → stack index (reversed)
    usePhotoStore.getState().mutate('Reorder layers', (d) => moveLayer(d, String(e.active.id), d.layers.length - 1 - to));
  };

  return (
    <div className="space-y-2 p-3" data-testid="panel-layers">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('photo.layers.title')}</h3>
      {layers.length === 0 ? <p className="text-xs text-muted-foreground">{t('photo.layers.empty')}</p> : null}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={display.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-1.5">
            {display.map((l) => (
              <Row key={l.id} layer={l} selected={selection === l.id} onSelect={() => usePhotoStore.getState().setSelection(l.id)} onOpenPanel={onOpenPanel} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
