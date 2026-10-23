'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ChevronDown } from 'lucide-react';
import { useLocalization } from '@/i18n/useLocalization';
import { ensureMetadataShard } from '@/lib/i18n/ensureShard';
import { keptCount } from '@/lib/metadata/diff-model';
import type { DiffEvent, InspectorSurface } from '@/lib/metadata/types';
import { useMetadataAnalytics } from '@/lib/metadata/useMetadataAnalytics';
import { cn } from '@/lib/utils';
import { LazyMetadataInspector } from './metadata-inspector-lazy';
import { useJobBinaryUrls, useJobMetadata, useJobMetadataDiff } from './use-metadata-data';

/** The modal (accordion, rows, diff helpers) loads only when Compare is first opened. */
const MetadataDiffModal = dynamic(() => import('./metadata-diff-modal').then((m) => m.MetadataDiffModal), { ssr: false });

/** Kinds whose results carry comparable metadata. */
const STRIP_KINDS: ReadonlySet<string> = new Set(['image', 'video', 'audio', 'pdf']);

export interface MetadataStripProps {
  jobId: string;
  kind: string;
  /** MM08 `metadataAvailable`; the strip renders nothing unless `result` is true. */
  available?: { original: boolean; result: boolean };
  originalName: string;
  resultName: string;
  surface?: InspectorSurface;
  /** Also render the "Result metadata" disclosure with the result inspector. */
  disclosure?: boolean;
  onEvent?: (event: DiffEvent) => void;
  className?: string;
}

/** True once the element is on screen (or immediately without IntersectionObserver). */
function useVisible(ref: React.RefObject<Element | null>): boolean {
  const [seen, setSeen] = useState(() => typeof IntersectionObserver === 'undefined');
  useEffect(() => {
    if (seen || !ref.current) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setSeen(true);
        io.disconnect();
      }
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref, seen]);
  return seen;
}

/**
 * "Metadata: N kept · M removed · Compare" under a result. Never blocks the viewer:
 * while loading, on any failure, and on a pre-MM08 API (no `metadataAvailable`) it renders
 * nothing.
 */
export function MetadataStrip(props: MetadataStripProps) {
  const { available, kind } = props;
  if (!available?.result || !STRIP_KINDS.has(kind)) return null;
  return <StripInner {...props} />;
}

function StripInner({ jobId, originalName, resultName, surface = 'result', disclosure = true, onEvent, className }: MetadataStripProps) {
  const { t } = useLocalization('interface');
  const ref = useRef<HTMLDivElement>(null);
  const visible = useVisible(ref);
  const diffQ = useJobMetadataDiff(jobId, { enabled: visible });
  const analytics = useMetadataAnalytics(surface);
  const [open, setOpen] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [shard, setShard] = useState(false);
  useEffect(() => {
    if (!diffQ.data) return;
    let live = true;
    ensureMetadataShard().then(() => live && setShard(true), () => undefined);
    return () => {
      live = false;
    };
  }, [diffQ.data]);

  const diff = diffQ.data;
  const removed = diff?.removed.length ?? 0;
  const kept = diff ? keptCount(diff) : 0;
  return (
    <div ref={ref} className={cn('space-y-2', className)} data-testid="metadata-strip-root">
      {diff && shard ? (
        <>
          <p data-testid="metadata-strip" className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
            {removed === 0 ? (
              <span>{t('metadata.resultLine.unchanged')}</span>
            ) : (
              <span className="num">{t('metadata.resultLine.summary', { kept, removed })}</span>
            )}
            <span aria-hidden="true">{'·'}</span>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-2"
            >
              {t('metadata.resultLine.compare')}
            </button>
            {disclosure ? (
              <button
                type="button"
                aria-expanded={showResult}
                onClick={() => setShowResult((v) => !v)}
                className="ml-auto inline-flex items-center gap-1 rounded-sm text-sm hover:text-foreground"
              >
                {t('metadata.resultLine.disclosure')}
                <ChevronDown aria-hidden="true" className={cn('size-4 transition-transform', showResult && 'rotate-180')} />
              </button>
            ) : null}
          </p>
          {disclosure && showResult ? <ResultInspector jobId={jobId} name={resultName} surface={surface} /> : null}
          {open ? <MetadataDiffModal
            jobId={jobId}
            open={open}
            onOpenChange={setOpen}
            originalName={originalName}
            resultName={resultName}
            surface={surface}
            onEvent={onEvent ?? analytics.onDiffEvent}
          /> : null}
        </>
      ) : null}
    </div>
  );
}

/** The result-side inspector (second inspector on the page, so no hash persistence). */
export function ResultInspector({ jobId, name, surface = 'result', className }: { jobId: string; name?: string; surface?: InspectorSurface; className?: string }) {
  const q = useJobMetadata(jobId, 'result');
  const analytics = useMetadataAnalytics(surface, q.data);
  const resolve = useJobBinaryUrls(jobId, 'result');
  if (!q.data) {
    return q.status === 'error' ? null : <LazyMetadataInspector document={EMPTY_DOC} surface={surface} status="loading" persistHash={false} className={className} />;
  }
  return (
    <LazyMetadataInspector
      document={q.data}
      surface={surface}
      fileName={name}
      status="ready"
      persistHash={false}
      resolveBinaryUrl={resolve}
      onEvent={analytics.onEvent}
      className={className}
    />
  );
}

const EMPTY_DOC = {
  schemaVersion: 1,
  file: { name: '', sizeBytes: 0, mime: '', kind: 'unknown' },
  tools: [],
  entries: [],
  warnings: [],
};
