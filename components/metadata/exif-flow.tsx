'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { useLocalization } from '@/i18n/useLocalization';
import { removedLocation } from '@/lib/metadata/diff-model';
import { useMetadataAnalytics } from '@/lib/metadata/useMetadataAnalytics';
import { LazyMetadataInspector } from './metadata-inspector-lazy';
import { ResultInspector } from './metadata-strip';
import { useJobMetadataDiff, useMetadataInspect } from './use-metadata-data';

const MetadataDiffModal = dynamic(() => import('./metadata-diff-modal').then((m) => m.MetadataDiffModal), { ssr: false });

export interface ExifInspectProps {
  file: File;
  /** Present only when the page can strip this kind in place (images). */
  onStripAll?: () => void;
  processing: boolean;
}

/** The EXIF page's "what is in this file" inspector, shown above the form once a file is chosen. */
export function ExifInspect({ file, onStripAll, processing }: ExifInspectProps) {
  const { t } = useLocalization('interface');
  const q = useMetadataInspect(file);
  const analytics = useMetadataAnalytics('tool_page', q.data);
  if (q.status === 'error') return null; // passive path: the form below still works
  return (
    <div data-testid="exif-inspect" className="space-y-2">
      {q.data ? (
        <LazyMetadataInspector
          document={q.data}
          surface="tool_page"
          fileName={file.name}
          status="ready"
          onEvent={analytics.onEvent}
          onStripAll={onStripAll}
          stripDisabled={processing}
          stripLabel={processing ? t('metadata.strip.stripping', { defaultValue: 'Stripping…' }) : t('metadata.strip.stripEverything')}
        />
      ) : (
        <LazyMetadataInspector
          document={{ schemaVersion: 1, file: { name: file.name, sizeBytes: file.size, mime: file.type, kind: 'unknown' }, tools: [], entries: [], warnings: [] }}
          surface="tool_page"
          status="loading"
        />
      )}
    </div>
  );
}

export interface ExifResultProps {
  jobId: string;
  originalName: string;
  resultName: string;
  strippedCount?: number;
  available?: { original: boolean; result: boolean };
}

/** After the strip job: "Removed N tags", the result inspector, and Compare. */
export function ExifResult({ jobId, originalName, resultName, strippedCount, available }: ExifResultProps) {
  const { t } = useLocalization('interface');
  const [open, setOpen] = useState(false);
  const diffQ = useJobMetadataDiff(jobId, { enabled: !!available?.result });
  const analytics = useMetadataAnalytics('tool_page');
  if (!available?.result) return null; // pre-MM08 API: nothing to show
  const count = strippedCount ?? diffQ.data?.removed.length;
  const location = diffQ.data ? removedLocation(diffQ.data) : false;
  return (
    <div data-testid="exif-result" className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {count !== undefined ? (
          <p data-testid="exif-removed" className="text-sm font-medium text-foreground">
            {t('metadata.strip.removedCount', { count })}
            {location ? ` ${t('metadata.strip.includingLocation')}` : ''}
          </p>
        ) : null}
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)} disabled={!diffQ.data}>
          {t('metadata.resultLine.compare')}
        </Button>
      </div>
      <ResultInspector jobId={jobId} name={resultName} surface="tool_page" />
      {open ? <MetadataDiffModal
        jobId={jobId}
        open={open}
        onOpenChange={setOpen}
        originalName={originalName}
        resultName={resultName}
        surface="tool_page"
        onEvent={analytics.onDiffEvent}
      /> : null}
    </div>
  );
}
