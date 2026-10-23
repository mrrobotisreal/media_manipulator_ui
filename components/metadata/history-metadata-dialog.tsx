'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Segmented } from '@/components/darkroom/segmented';
import { PanelLoading } from '@/components/darkroom/panel-loading';
import { useLocalization } from '@/i18n/useLocalization';
import { ensureMetadataShard } from '@/lib/i18n/ensureShard';
import { MetadataApiError, type MetadataSide } from '@/lib/metadata/api';
import { useMetadataAnalytics } from '@/lib/metadata/useMetadataAnalytics';
import { LazyMetadataInspector } from './metadata-inspector-lazy';
import { useJobBinaryUrls, useJobMetadata } from './use-metadata-data';

const MetadataDiffModal = dynamic(() => import('./metadata-diff-modal').then((m) => m.MetadataDiffModal), { ssr: false });

export interface HistoryMetadataDialogProps {
  jobId: string;
  available: { original: boolean; result: boolean };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Display names only; never sent anywhere. History rows have no original name, so these are generic. */
  originalName?: string;
  resultName?: string;
}

/**
 * Cached metadata for an account-history row (works after the media expired: the routes read
 * the saved JSON). Original/Result switch plus Compare when both exist. A 404 is an empty
 * state ("Metadata no longer available"), never an error toast.
 */
export function HistoryMetadataDialog(props: HistoryMetadataDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] max-w-[min(96vw,900px)] flex-col gap-3 overflow-y-auto p-4 sm:max-w-[min(96vw,900px)] sm:p-6">
        {props.open ? <Body {...props} /> : null}
      </DialogContent>
    </Dialog>
  );
}

function Body({ jobId, available, originalName, resultName }: HistoryMetadataDialogProps) {
  const { t } = useLocalization('interface');
  const [shard, setShard] = useState(false);
  useEffect(() => {
    let live = true;
    ensureMetadataShard().then(() => live && setShard(true), () => live && setShard(true));
    return () => {
      live = false;
    };
  }, []);

  const [side, setSide] = useState<MetadataSide>(available.result ? 'result' : 'original');
  const [comparing, setComparing] = useState(false);
  const q = useJobMetadata(jobId, side);
  const resolve = useJobBinaryUrls(jobId, side);
  const analytics = useMetadataAnalytics('history', q.data);
  const both = available.original && available.result;
  const gone = q.status === 'error' && q.error instanceof MetadataApiError && q.error.status === 404;

  return (
    <>
      <DialogTitle>{t('metadata.history.title', { defaultValue: 'File metadata' })}</DialogTitle>
      <DialogDescription>{t('metadata.history.description', { defaultValue: 'What the file carried, from the saved report.' })}</DialogDescription>
      {shard ? (
        <>
          {both ? (
            <div className="flex flex-wrap items-center gap-3">
              <Segmented<MetadataSide>
                name={`history-metadata-side-${jobId}`}
                label={t('metadata.history.switchLabel', { defaultValue: 'Which file' })}
                value={side}
                onValueChange={setSide}
                options={[
                  { value: 'original', label: t('metadata.history.original', { defaultValue: 'Original' }) },
                  { value: 'result', label: t('metadata.history.result', { defaultValue: 'Result' }) },
                ]}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => setComparing(true)}>
                {t('metadata.history.compare', { defaultValue: 'Compare' })}
              </Button>
            </div>
          ) : null}
          {gone ? (
            <p role="status" data-testid="history-metadata-gone" className="text-sm text-muted-foreground">
              {t('metadata.history.unavailable', { defaultValue: 'Metadata no longer available' })}
            </p>
          ) : q.status === 'error' ? (
            <p role="alert" className="text-sm text-destructive">
              {t('metadata.history.loadFailed', { defaultValue: 'Could not load this metadata report.' })}
            </p>
          ) : q.data ? (
            <LazyMetadataInspector
              key={side}
              document={q.data}
              surface="result"
              fileName={side === 'result' ? resultName : originalName}
              status="ready"
              persistHash={false}
              resolveBinaryUrl={resolve}
              onEvent={analytics.onEvent}
            />
          ) : (
            <PanelLoading variant="inline" label={t('metadata.loading')} />
          )}
          {comparing ? (
            <MetadataDiffModal
              jobId={jobId}
              open={comparing}
              onOpenChange={setComparing}
              originalName={originalName ?? ''}
              resultName={resultName ?? ''}
              surface="result"
              onEvent={analytics.onDiffEvent}
            />
          ) : null}
        </>
      ) : (
        <PanelLoading variant="inline" label="…" />
      )}
    </>
  );
}

export default HistoryMetadataDialog;
