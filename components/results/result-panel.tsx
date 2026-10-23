'use client';

import { useCallback, useEffect, useId, useMemo, useState, type ReactNode } from 'react';
import { Download, Loader2, RotateCcw } from 'lucide-react';
import { Panel } from '@/components/darkroom/panel';
import { Segmented } from '@/components/darkroom/segmented';
import { Stat } from '@/components/darkroom/stat';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useLocalization } from '@/i18n/useLocalization';
import { EVENTS, useToolAnalytics } from '@/lib/analytics';
import type { PropsFor } from '@/lib/analytics/events';
import type { ResultDescriptor, ResultKind } from '@/lib/results/describe';
import { useResultBlob } from '@/lib/results/useResultBlob';
import { useResultDownload } from '@/lib/results/useResultDownload';
import { cn } from '@/lib/utils';
import { viewerFor } from './viewers';
import { KIND_ICONS } from './viewers/unknown-viewer';

/**
 * Original/Result comparison modes. MM01 ships `toggle` only; MM02 adds `wipe`,
 * `side_by_side` and `synced` by extending this union and the `compare` branch below.
 */
export type CompareMode = 'toggle';

export interface ResultPanelProps {
  /** From `describe()`. The panel is a pure function of this plus the props below. */
  descriptor: ResultDescriptor;
  /** `inline` renders in the page; `modal` wraps the same body in a Radix Dialog. */
  variant?: 'inline' | 'modal';
  /** Modal only: controlled open state. Inline panels ignore it. */
  open?: boolean;
  /** Modal only: called when the dialog asks to close (Esc, overlay, X). */
  onOpenChange?: (open: boolean) => void;
  /** Heading override; defaults to the result file name. */
  title?: ReactNode;
  /** Line under the heading (modal description); defaults to the kind label. */
  subtitle?: ReactNode;
  /** Name the file is saved under; defaults to `descriptor.fileName`. */
  downloadFileName?: string;
  /** Replaces the "Download" label (the embedded panel names the file). */
  downloadLabel?: string;
  /** Replaces the default blob download entirely (rare; the default is analytics-correct). */
  onDownload?: () => void | Promise<void>;
  /** Fired after the default download saved a file (the upgrade nudge hooks in here). */
  onDownloaded?: () => void;
  /** Shows a "Run another" action. */
  onRunAnother?: () => void;
  /** Comparison modes offered when `descriptor.original` exists. */
  compareModes?: CompareMode[];
  /** Which side opens first. Default `result`. */
  initialView?: 'original' | 'result';
  /** Bytes the caller already holds; used instead of a fetch the first time. */
  seedBlob?: Blob | null;
  /** Called once with the loaded result bytes (home caches them per history entry). */
  onBlobLoaded?: (blob: Blob) => void;
  /**
   * Replaces the viewer slot for the result side. For callers that own a richer view the
   * registry does not have yet (home's transcript view until MM03). Original/Result toggle
   * is hidden while it is set.
   */
  viewerOverride?: ReactNode;
  /** Set false on surfaces that must not count a `result_previewed` (history prefetch). */
  trackPreview?: boolean;
  className?: string;
}

const previewKindOf = (kind: ResultKind): NonNullable<PropsFor<'result_previewed'>['preview_kind']> => {
  switch (kind) {
    case 'image':
    case 'gif':
      return 'image';
    case 'video':
      return 'video';
    case 'audio':
      return 'audio';
    case 'transcript':
    case 'captions':
      return 'text';
    default:
      return 'other';
  }
};

/** `result_previewed` fires once per JOB for the page's lifetime, whichever surface opens it. */
const previewed = new Set<string>();
export function resetPreviewedForTests(): void {
  previewed.clear();
}

/** Kinds where an Original/Result comparison means something. */
const COMPARABLE: ReadonlySet<ResultKind> = new Set<ResultKind>(['image', 'gif', 'video', 'audio']);

/** An object URL for the original file, made once and revoked on change/unmount. */
function useOriginalUrl(original: ResultDescriptor['original'], enabled: boolean): string | null {
  const [made, setMade] = useState<{ file: File; url: string } | null>(null);
  const file = original?.file ?? null;
  const supplied = original?.objectUrl ?? null;
  useEffect(() => {
    if (!enabled || supplied || !file) return;
    const url = URL.createObjectURL(file);
    setMade({ file, url });
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [enabled, file, supplied]);
  // `made` can briefly hold a revoked URL for a previous file; only trust the current one.
  return supplied ?? (enabled && file && made?.file === file ? made.url : null);
}

export function ResultPanel(props: ResultPanelProps) {
  const { variant = 'inline', open = true, onOpenChange } = props;
  if (variant === 'modal') {
    return <ResultPanelModal {...props} open={open} onOpenChange={onOpenChange} />;
  }
  return <ResultPanelBody {...props} active />;
}

function ResultPanelModal(props: ResultPanelProps) {
  const { t } = useLocalization(['interface']);
  const { open, onOpenChange, descriptor, title, subtitle } = props;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto p-0 sm:max-w-5xl"
      >
        <DialogTitle className="sr-only">{title ?? descriptor.fileName}</DialogTitle>
        <DialogDescription className="sr-only">{subtitle ?? t('resultPanel.kind.' + descriptor.kind)}</DialogDescription>
        <ResultPanelBody {...props} active={!!open} bare />
      </DialogContent>
    </Dialog>
  );
}

interface BodyProps extends ResultPanelProps {
  /** False while a modal is closed: nothing is fetched or counted. */
  active: boolean;
  /** Inside a dialog the dialog is the chrome, so no Panel frame. */
  bare?: boolean;
}

function ResultPanelBody({
  descriptor,
  title,
  subtitle,
  downloadFileName,
  downloadLabel,
  onDownload,
  onDownloaded,
  onRunAnother,
  compareModes = ['toggle'],
  initialView = 'result',
  seedBlob,
  onBlobLoaded,
  viewerOverride,
  trackPreview = true,
  className,
  active,
  bare = false,
}: BodyProps) {
  const { t, formatFileSize, formatDate, formatTime } = useLocalization(['interface']);
  const { track } = useToolAnalytics();
  const groupName = useId();
  // Keyed by job so a new job starts on its own first view without an effect.
  const [viewState, setViewState] = useState({ jobId: descriptor.jobId, view: initialView });
  const view = viewState.jobId === descriptor.jobId ? viewState.view : initialView;
  const setView = (next: 'original' | 'result') => setViewState({ jobId: descriptor.jobId, view: next });

  const canCompare =
    !viewerOverride &&
    compareModes.includes('toggle') &&
    !!descriptor.original &&
    COMPARABLE.has(descriptor.kind) &&
    COMPARABLE.has(descriptor.original.kind);
  const shown: 'original' | 'result' = canCompare ? view : 'result';

  // `result_previewed`: the visitor was shown the result. Once per job.
  useEffect(() => {
    if (!active || !trackPreview || previewed.has(descriptor.jobId)) return;
    previewed.add(descriptor.jobId);
    track(
      EVENTS.RESULT_PREVIEWED,
      { job_id: descriptor.jobId, preview_kind: previewKindOf(descriptor.kind) },
      { job_id: descriptor.jobId },
    );
  }, [active, descriptor.jobId, descriptor.kind, track, trackPreview]);

  const resultViewer = viewerFor(descriptor.kind);
  const wantsBytes = active && !viewerOverride && shown === 'result' && resultViewer.needsBlob;
  const blobState = useResultBlob(descriptor, { enabled: wantsBytes, seedBlob });
  const loadedBlob = blobState.blob;
  useEffect(() => {
    if (loadedBlob && onBlobLoaded) onBlobLoaded(loadedBlob);
    // onBlobLoaded is a callback the caller may recreate every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedBlob]);

  const originalUrl = useOriginalUrl(descriptor.original, active && canCompare);
  const saveName = downloadFileName ?? descriptor.fileName;
  const { download, isDownloading, failed } = useResultDownload({
    jobId: descriptor.jobId,
    fileName: saveName,
    cachedBlob: loadedBlob ?? seedBlob,
    onDownloaded,
  });
  const handleDownload = useCallback(() => {
    if (onDownload) return void Promise.resolve(onDownload());
    return void download();
  }, [download, onDownload]);

  const KindIcon = KIND_ICONS[descriptor.kind];
  const expires = useMemo(() => {
    if (!descriptor.expiresAt) return null;
    const when = new Date(descriptor.expiresAt);
    if (Number.isNaN(when.getTime())) return null;
    return `${formatDate(when)} ${formatTime(when, { hour: 'numeric', minute: '2-digit' })}`;
  }, [descriptor.expiresAt, formatDate, formatTime]);

  const original = descriptor.original;
  const sideDescriptor =
    shown === 'original' && original
      ? { kind: original.kind, fileName: original.file?.name ?? original.fileName ?? descriptor.fileName, mime: original.file?.type || original.mime || 'application/octet-stream', sizeBytes: original.file?.size }
      : { kind: descriptor.kind, fileName: descriptor.fileName, mime: descriptor.mime, sizeBytes: descriptor.sizeBytes };
  const sideEntry = shown === 'original' ? viewerFor(sideDescriptor.kind) : resultViewer;
  const Viewer = sideEntry.component;

  let stage: ReactNode;
  if (viewerOverride) {
    stage = viewerOverride;
  } else if (shown === 'original' && !originalUrl) {
    stage = <p className="text-muted-foreground">{t('resultPanel.loading')}</p>;
  } else if (shown === 'result' && sideEntry.needsBlob && blobState.status === 'error') {
    stage = (
      <div role="alert" className="space-y-3 text-center">
        <p className="text-destructive">{blobState.error?.message ?? t('resultPanel.loadFailed')}</p>
        <button
          type="button"
          onClick={blobState.retry}
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-[var(--accent-primary-hover)]"
        >
          {t('resultPanel.retry')}
        </button>
      </div>
    );
  } else if (shown === 'result' && sideEntry.needsBlob && blobState.status !== 'ready') {
    stage = (
      <p role="status" className="flex items-center gap-2 text-muted-foreground">
        <Loader2 aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
        {t('resultPanel.loading')}
      </p>
    );
  } else {
    stage = (
      <Viewer
        role={shown}
        kind={sideDescriptor.kind}
        src={shown === 'original' ? originalUrl : blobState.url}
        blob={shown === 'original' ? null : blobState.blob}
        fileName={sideDescriptor.fileName}
        mime={sideDescriptor.mime}
        sizeBytes={sideDescriptor.sizeBytes}
        descriptor={descriptor}
      />
    );
  }

  const body = (
    <div className={cn('flex flex-col gap-4', bare && 'p-4 sm:p-6', className)} data-kind={descriptor.kind} data-view={shown}>
      <header className="flex flex-wrap items-start justify-between gap-3 pr-8">
        <div className="flex min-w-0 items-center gap-3">
          <KindIcon aria-hidden={true} className="size-6 shrink-0 text-data" />
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-foreground">{title ?? descriptor.fileName}</h3>
            <p className="text-sm text-muted-foreground">{subtitle ?? t(`resultPanel.kind.${descriptor.kind}`)}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {descriptor.sizeBytes !== undefined && (
            <Stat label={t('resultPanel.size')} value={formatFileSize(descriptor.sizeBytes)} />
          )}
          {expires && <Stat label={t('resultPanel.keepsUntil')} value={expires} />}
        </div>
      </header>

      <div
        className="flex min-h-40 items-center justify-center rounded-lg bg-surface-0/40 p-3"
        data-testid="result-stage"
      >
        {stage}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-success px-5 py-2 font-medium text-success-foreground transition-colors hover:bg-success/90 disabled:opacity-60"
        >
          {isDownloading ? (
            <Loader2 aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
          ) : (
            <Download aria-hidden="true" className="size-4" />
          )}
          {downloadLabel ?? t('resultPanel.download')}
        </button>
        {canCompare && (
          <Segmented
            name={`${groupName}-compare`}
            label={t('resultPanel.compare')}
            value={shown}
            onValueChange={setView}
            options={[
              { value: 'original', label: t('resultPanel.original') },
              { value: 'result', label: t('resultPanel.result') },
            ]}
            className="w-56"
          />
        )}
        {onRunAnother && (
          <button
            type="button"
            onClick={onRunAnother}
            className="inline-flex items-center gap-1.5 rounded-lg border border-edge px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface-2"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            {t('resultPanel.runAnother')}
          </button>
        )}
        {failed && (
          <span role="alert" className="text-sm text-destructive">
            {t('resultPanel.downloadFailed')}
          </span>
        )}
      </div>
    </div>
  );

  return bare ? body : <Panel level="1" as="section" aria-label={t('resultPanel.ariaLabel')}>{body}</Panel>;
}

export default ResultPanel;
