'use client';

import * as React from 'react';

import { defaultParams, upsertAdjustment } from '@/lib/photo/layerOps';
import { usePhotoStore } from '@/lib/photo/photoStore';
import type { AdjustmentLayer, LayerType } from '@/lib/photo/photoTypes';
import { onAdjustmentChanged } from '@/lib/photo/seams';

type ParamsOf<K extends LayerType> = Extract<AdjustmentLayer, { type: K }>['params'];

/**
 * Binds a panel to the layer of `type` it edits: the selected layer when it has
 * that type, otherwise the top-most one. The layer is created on first touch
 * (`edit` runs against defaults) and edited in place afterwards, so repeated
 * drags never stack duplicates. Returns the live params (defaults when no layer
 * exists yet).
 */
export function useAdjustment<K extends LayerType>(type: K) {
  const layer = usePhotoStore((s) => {
    const layers = s.doc?.layers ?? [];
    const sel = s.selection ? layers.find((l) => l.id === s.selection && l.type === type) : undefined;
    return sel ?? [...layers].reverse().find((l) => l.type === type);
  }) as Extract<AdjustmentLayer, { type: K }> | undefined;
  const fallback = React.useMemo(() => defaultParams(type), [type]);
  const params = (layer?.params ?? fallback) as ParamsOf<K>;
  const layerId = layer?.id;

  const update = React.useCallback(
    (label: string, param: string, edit: (p: ParamsOf<K>) => ParamsOf<K>) => {
      usePhotoStore.getState().mutate(label, (d) => upsertAdjustment(d, type, edit as never, layerId).doc);
      onAdjustmentChanged(type, param);
    },
    [type, layerId],
  );

  /** Remove the layer (panel "reset all"). */
  const remove = React.useCallback(() => {
    if (!layerId) return;
    usePhotoStore.getState().mutate('Reset', (d) => ({ ...d, layers: d.layers.filter((l) => l.id !== layerId) }));
  }, [layerId]);

  return { params, layer, layerId, update, remove };
}
