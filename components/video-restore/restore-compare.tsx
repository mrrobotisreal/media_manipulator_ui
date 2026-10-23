'use client';

import { useId, useMemo, useState } from 'react';
import { Segmented } from '@/components/darkroom/segmented';
import { VideoCompare } from '@/components/results/compare/video-compare';
import { useLocalization } from '@/i18n/useLocalization';
import type { RestoreResultModel, RestoreResultsResponse } from '@/lib/restoreTypes';
import { restoreResultUrl } from '@/lib/results/inline';

export interface RestoreCompareProps {
  jobId: string;
  manifest: RestoreResultsResponse;
  /** Display names per model id (capabilities `displayName`); falls back to the id. */
  modelNames?: Record<string, string>;
  /** Fired when the visitor picks another model (the restore panel reports it as an `ab` compare). */
  onModelSelect?: (modelId: string) => void;
}

/**
 * Original versus one restored model, synced. The picker lists completed models only, with
 * duration and output size; failed models are listed below with their error. Clips stream
 * from MM05's inline per-model route with range support.
 */
export function RestoreCompare({ jobId, manifest, modelNames, onModelSelect }: RestoreCompareProps) {
  const { t, formatFileSize } = useLocalization('interface');
  const groupName = useId();
  const completed = useMemo(() => manifest.models.filter((m) => m.status === 'completed' && m.fileName), [manifest.models]);
  const failed = manifest.models.filter((m) => m.status === 'failed');
  const [picked, setPicked] = useState<string | null>(null);
  const selected = completed.find((m) => m.id === picked) ?? completed[0];
  const nameOf = (m: RestoreResultModel) => modelNames?.[m.id] ?? m.id;

  return (
    <div className="flex w-full flex-col gap-3" data-testid="restore-compare">
      {completed.length > 1 && (
        <Segmented
          name={`${groupName}-model`}
          label={t('resultPanel.restore.picker')}
          value={selected.id}
          onValueChange={(id) => {
            setPicked(id);
            onModelSelect?.(id);
          }}
          options={completed.map((m) => ({
            value: m.id,
            label: t('resultPanel.restore.modelOption', {
              name: nameOf(m),
              duration: Math.round(m.durationSeconds),
              size: formatFileSize(m.sizeBytes ?? 0),
            }),
          }))}
          className="w-full"
        />
      )}
      {selected ? (
        <VideoCompare
          key={selected.id}
          originalSrc={restoreResultUrl(jobId, 'original')}
          resultSrc={restoreResultUrl(jobId, selected.id)}
          originalLabel={manifest.original.label || t('resultPanel.restore.original')}
          resultLabel={nameOf(selected)}
        />
      ) : null}
      {failed.length > 0 && (
        <div role="note" className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm">
          <p className="font-medium text-destructive">{t('resultPanel.restore.failedTitle')}</p>
          <ul className="mt-1 space-y-0.5 text-muted-foreground">
            {failed.map((m) => (
              <li key={m.id}>{t('resultPanel.restore.failedItem', { name: nameOf(m), error: m.error ?? '' })}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RestoreCompare;
