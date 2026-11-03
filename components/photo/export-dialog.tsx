'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

import { ResultPanel } from '@/components/results/result-panel';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLocalization } from '@/i18n/useLocalization';
import useGetJobStatus, { type ConversionJob } from '@/lib/useGetJobStatus';
import { describe as describeResult } from '@/lib/results/describe';
import {
  MAX_SIZE_OPTIONS,
  PhotoApiError,
  estimateExportBytes,
  exportProject,
  exportStateless,
  isSizeLocked,
  type MaxSizeOption,
  type PhotoCapabilities,
} from '@/lib/photo/projectsApi';
import { PHOTO_FORMATS, type PhotoDoc } from '@/lib/photo/photoTypes';
import { vectorBytesBucket, vectorMsBucket } from '@/lib/analytics/buckets';
import { EVENTS } from '@/lib/analytics/events';
import { authedFetch } from '@/lib/auth/authedFetch';
import type { TiersResponse } from '@/lib/auth/accountApi';
import { defaultBatchDeps } from '@/lib/photo/batch';
import { exportStartedProps, failReason, photoCountHeaders, photoTierProp, photoTracker, setPhotoBatchContext, type PhotoTracker } from '@/lib/photo/analytics';
import { resolvePhotoGate, type PhotoCta, type PhotoGate } from '@/lib/photo/gating';
import { cn } from '@/lib/utils';
import { BatchApply, type BatchFinish } from './batch-apply';
import { PhotoUpgradeCta } from './upgrade-cta';

type Format = (typeof PHOTO_FORMATS)[number];

export interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doc: PhotoDoc;
  projectName: string;
  /** Server project id when signed in and the upload finished; null otherwise. */
  projectId: string | null;
  /** Signed-out / not-yet-uploaded: the original bytes for the stateless route. */
  file: { blob: Blob; name: string } | null;
  signedIn: boolean;
  capabilities: PhotoCapabilities | null;
  /** The original photo, to compare against the result. */
  originalFile: File | null;
  /** MM101 seam: the user hit a locked size. */
  onGatedSizeClicked?: (megapixels: number) => void;
  /** MM101 seam: the batch picker hit the sign-in / limit wall. */
  onBatchGated?: (reason: 'sign_in' | 'limit') => void;
  /** The served /api/tiers table (MM101): the dialog's locks and CTAs read it; absent = advisory-free. */
  tiers?: TiersResponse | null;
  /** Test seam: the analytics sink (default: the consent-gated tracker). */
  track?: PhotoTracker;
  /** Test seam. */
  batchDeps?: import('@/lib/photo/batch').BatchDeps;
  /** Test seam. */
  exporters?: { project: typeof exportProject; stateless: typeof exportStateless };
}

const FORMAT_LABEL: Record<Format, string> = { jpg: 'JPG', png: 'PNG', webp: 'WebP', avif: 'AVIF', tiff: 'TIFF' };
const fmtBytes = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1000))} KB`);

/** Export dialog (ticket MM97 decision 13). */
export function ExportDialog(props: ExportDialogProps) {
  const { open, onOpenChange, doc, projectName, projectId, file, signedIn, capabilities, originalFile, onGatedSizeClicked, onBatchGated, batchDeps, exporters, tiers, track = photoTracker } = props;
  const { t } = useLocalization('interface');
  const formats = (capabilities?.formats?.length ? capabilities.formats : ['jpg', 'png', 'webp']).filter((f): f is Format => (PHOTO_FORMATS as readonly string[]).includes(f));
  const [format, setFormat] = React.useState<Format>(doc.output.format ?? 'jpg');
  const [quality, setQuality] = React.useState(doc.output.quality ?? 92);
  const [metadata, setMetadata] = React.useState<'keep' | 'strip'>(doc.output.metadataMode ?? 'keep');
  const [maxSize, setMaxSize] = React.useState<MaxSizeOption>(0);
  const [phase, setPhase] = React.useState<'idle' | 'starting' | 'running'>('idle');
  const [error, setError] = React.useState<string | null>(null);
  const [job, setJob] = React.useState<ConversionJob | null>(null);
  const { data: status } = useGetJobStatus(job);
  // Merge polled status into the job during render (no effect, no cascading render).
  const live = React.useMemo(() => (job && status && status.id === job.id ? { ...job, ...status } : job), [job, status]);

  // MM101: the caller's tier and the served ladder decide the CTAs (advisory; the server clamps and refuses).
  const tier = signedIn ? photoTierProp(capabilities?.tier) : 'anonymous';
  const t0 = React.useRef(0);
  const reported = React.useRef<string | null>(null);
  const gatedSent = React.useRef(new Set<string>());
  const [sizeNote, setSizeNote] = React.useState<{ mp: number; gate: Exclude<PhotoGate, { allowed: true }> } | null>(null);
  React.useEffect(() => {
    if (!open) gatedSent.current.clear();
  }, [open]);
  // Identity for the API's server_photo_export_counted (the visitor id rides only with analytics consent).
  const countingFetch = React.useCallback(
    (url: string, init?: RequestInit) => authedFetch(url, { ...init, headers: { ...((init?.headers as Record<string, string> | undefined) ?? {}), ...photoCountHeaders() } }),
    [],
  );
  const defaultExporters = React.useMemo(
    () => ({
      project: (id: string, d: PhotoDoc, o: Parameters<typeof exportProject>[2]) => exportProject(id, d, o, countingFetch),
      stateless: (b: Blob, n: string, d: PhotoDoc, o: Parameters<typeof exportProject>[2]) => exportStateless(b, n, d, o, countingFetch),
    }),
    [countingFetch],
  );
  const defaultBatch = React.useMemo(() => batchDeps ?? defaultBatchDeps(countingFetch), [batchDeps, countingFetch]);
  const sendGated = (reason: 'megapixels' | 'batch' | 'projects', cta: PhotoCta, key: string) => {
    if (gatedSent.current.has(key)) return;
    gatedSent.current.add(key);
    track.track(EVENTS.PHOTO_EXPORT_GATED, { reason, tier, upgrade_path: cta });
  };

  const capMp = capabilities?.maxMegapixels ?? 12;
  const originalMp = (doc.source.width * doc.source.height) / 1_000_000;
  const outMp = maxSize === 0 ? originalMp : Math.min(originalMp, maxSize);
  /** What the server will actually render: the requested size clamped to the plan's cap (analytics report this). */
  const effectiveMp = capMp > 0 ? Math.min(outMp, capMp) : outMp;
  const estimate = estimateExportBytes(format, quality, outMp);
  const renderReady = capabilities?.render === true;
  const canStart = renderReady && (projectId || file) && phase === 'idle';
  const qualityApplies = format !== 'png' && format !== 'tiff';
  const done = live?.status === 'completed';
  const failed = live?.status === 'failed';

  /** The gate of one Max-size option (the cap itself comes from capabilities; the served table names the rung). */
  const sizeGate = (mp: number): Exclude<PhotoGate, { allowed: true }> => {
    const g = resolvePhotoGate(tier, { kind: 'megapixels', megapixels: mp === 0 ? originalMp : mp }, tiers);
    if (!g.allowed) return g;
    // No served table (or no photo* fields): the server still clamps; only the ladder default is offered.
    const up = tier === 'anonymous' || tier === 'free';
    return { allowed: false, reason: 'megapixels', requiredTier: up ? 'premium' : null, cta: up ? 'premium' : 'none' };
  };
  const lockedFirst = MAX_SIZE_OPTIONS.find((mp) => isSizeLocked(mp, capMp, originalMp));
  const lockedGate = lockedFirst === undefined ? null : sizeGate(lockedFirst);

  const start = async () => {
    setError(null);
    setPhase('starting');
    const opts = { format, quality, metadataMode: metadata, maxMegapixels: maxSize || undefined, name: projectName } as const;
    const api = exporters ?? defaultExporters;
    track.track(EVENTS.PHOTO_EXPORT_STARTED, exportStartedProps({ format, megapixels: effectiveMp, doc }));
    t0.current = Date.now();
    try {
      const jobId = signedIn && projectId ? await api.project(projectId, doc, opts) : await api.stateless((file as NonNullable<typeof file>).blob, (file as NonNullable<typeof file>).name, doc, opts);
      setJob({ id: jobId, status: 'processing', originalFile: originalFile ?? new File([], 'photo'), progress: 0 });
      setPhase('running');
    } catch (e) {
      setPhase('idle');
      track.track(EVENTS.PHOTO_EXPORT_FAILED, {
        format,
        megapixels_bucket: exportStartedProps({ format, megapixels: effectiveMp, doc }).megapixels_bucket,
        ms: vectorMsBucket(Date.now() - t0.current),
        reason: failReason(e instanceof Error && e.name === 'QuotaExceededError' ? 'quota' : e instanceof PhotoApiError ? e.code || String(e.status) : undefined),
      });
      if (e instanceof PhotoApiError && e.code) setError(e.code);
      else setError('failed');
    }
  };

  // The job's outcome (client view): one completed / failed per export.
  React.useEffect(() => {
    if (!job || reported.current === job.id) return;
    const base = { format, megapixels_bucket: exportStartedProps({ format, megapixels: effectiveMp, doc }).megapixels_bucket, ms: vectorMsBucket(Date.now() - t0.current) };
    if (done) {
      reported.current = job.id;
      track.track(EVENTS.PHOTO_EXPORT_COMPLETED, { ...base, ...(typeof live?.resultSizeBytes === 'number' ? { bytes_bucket: vectorBytesBucket(live.resultSizeBytes) } : {}) });
    } else if (failed) {
      reported.current = job.id;
      track.track(EVENTS.PHOTO_EXPORT_FAILED, { ...base, reason: 'render' });
    }
  }, [done, failed, job, live?.resultSizeBytes, format, effectiveMp, doc, track]);

  /** The batch picker hit the sign-in / limit wall: route by ladder and report. */
  const batchGateFor = (reason: 'sign_in' | 'limit'): Exclude<PhotoGate, { allowed: true }> => {
    const g = resolvePhotoGate(tier, { kind: 'batch', count: (capabilities?.photoBatch ?? 0) + 1 }, tiers);
    // No served table: fall back to what the wall itself says (anonymous signs in; a signed-in cap offers the ladder default).
    if (!g.allowed) return g;
    if (reason === 'sign_in') return { allowed: false, reason: 'batch', requiredTier: 'free', cta: 'signup' };
    return tier === 'free' ? { allowed: false, reason: 'batch', requiredTier: 'premium', cta: 'premium' } : tier === 'premium' ? { allowed: false, reason: 'batch', requiredTier: 'pro', cta: 'pro' } : { allowed: false, reason: 'batch', requiredTier: null, cta: 'none' };
  };
  const batchGate = batchGateFor(signedIn ? 'limit' : 'sign_in');
  const onBatchWall = (reason: 'sign_in' | 'limit') => {
    sendGated('batch', batchGateFor(reason).cta, 'batch');
    onBatchGated?.(reason);
  };

  /** A batch run ended (or was refused): the client's started/completed/failed pair for it. */
  const onBatchFinished = (r: BatchFinish) => {
    const base = { format, megapixels_bucket: exportStartedProps({ format, megapixels: effectiveMp, doc }).megapixels_bucket, ms: vectorMsBucket(r.ms) };
    if (r.done > 0) track.track(EVENTS.PHOTO_EXPORT_COMPLETED, base);
    else track.track(EVENTS.PHOTO_EXPORT_FAILED, { ...base, reason: r.error === 'photo_batch_limit' ? 'limit' : r.error === 'sign_in_required' ? 'locked' : 'render' });
  };

  const descriptor = React.useMemo(
    () => (done && live ? describeResult({ job: live, originalFile, task: undefined, mode: 'convert', fallbackFileName: `${projectName}.${format}` }) : null),
    [done, live, originalFile, projectName, format],
  );

  const reset = () => {
    setJob(null);
    setPhase('idle');
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-[640px]" data-testid="export-dialog">
        <DialogHeader>
          <DialogTitle>{t('photo.export.title')}</DialogTitle>
          <DialogDescription>{t('photo.export.description')}</DialogDescription>
        </DialogHeader>

        {descriptor ? (
          <ResultPanel descriptor={descriptor} surface="tool_page" onRunAnother={reset} metadataStrip={false} recordHistory={false} />
        ) : (
          <div className="space-y-4">
            {!renderReady ? (
              <p role="status" className="rounded border border-edge bg-surface-2 px-3 py-2 text-sm" data-testid="export-setup">
                {t('photo.export.setup')}
              </p>
            ) : null}
            {renderReady && !projectId && !file ? <p className="text-sm text-destructive">{t('photo.export.needFile')}</p> : null}

            <fieldset className="space-y-2">
              <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('photo.export.format')}</legend>
              <div className="flex flex-wrap gap-1.5">
                {formats.map((f) => (
                  <button key={f} type="button" aria-pressed={format === f} onClick={() => setFormat(f)} className={cn('min-h-9 rounded-md border px-3 text-sm', format === f ? 'border-primary bg-primary/15' : 'border-edge bg-surface-2')} data-testid={`format-${f}`}>
                    {FORMAT_LABEL[f]}
                    <span className="ms-1.5 text-xs text-muted-foreground">{fmtBytes(estimateExportBytes(f, quality, outMp))}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            {qualityApplies ? (
              <label className="block space-y-1 text-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('photo.export.quality')} <span className="font-mono tabular-nums">{quality}</span>
                </span>
                <input type="range" min={1} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" aria-label={t('photo.export.quality')} />
              </label>
            ) : null}

            <fieldset className="space-y-2">
              <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('photo.export.metadata')}</legend>
              <div className="flex gap-1.5">
                {(['keep', 'strip'] as const).map((m) => (
                  <button key={m} type="button" aria-pressed={metadata === m} onClick={() => setMetadata(m)} className={cn('min-h-9 rounded-md border px-3 text-sm', metadata === m ? 'border-primary bg-primary/15' : 'border-edge bg-surface-2')}>
                    {t(m === 'keep' ? 'photo.export.metadataKeep' : 'photo.export.metadataStrip')}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('photo.export.maxSize')}</legend>
              <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={t('photo.export.maxSize')}>
                {MAX_SIZE_OPTIONS.map((mp) => {
                  const locked = isSizeLocked(mp, capMp, originalMp);
                  return (
                    <button
                      key={mp}
                      type="button"
                      role="radio"
                      aria-checked={maxSize === mp}
                      aria-disabled={locked}
                      data-locked={locked || undefined}
                      title={locked ? t('photo.export.locked') : undefined}
                      onClick={() => {
                        if (!locked) {
                          setMaxSize(mp);
                          return;
                        }
                        const gate = sizeGate(mp);
                        setSizeNote({ mp: mp === 0 ? Math.round(originalMp) : mp, gate });
                        sendGated('megapixels', gate.cta, `mp:${mp}`);
                        onGatedSizeClicked?.(mp);
                      }}
                      className={cn('min-h-9 rounded-md border px-3 text-sm', maxSize === mp ? 'border-primary bg-primary/15' : 'border-edge bg-surface-2', locked && 'cursor-not-allowed opacity-50')}
                    >
                      {mp === 0 ? t('photo.export.original') : t('photo.export.mp', { mp })}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('photo.export.planLine', { mp: capMp })}{' '}
                {lockedGate ? <PhotoUpgradeCta cta={lockedGate.cta} placement="aperture_export_size" ctaId={`aperture_size_${lockedGate.requiredTier ?? 'none'}`} tier={tier} track={track} /> : null}
              </p>
              {sizeNote && sizeNote.gate.requiredTier && (sizeNote.gate.requiredTier === 'premium' || sizeNote.gate.requiredTier === 'pro') ? (
                <p role="status" className="text-xs" data-testid="size-gate" data-required-tier={sizeNote.gate.requiredTier} data-cta={sizeNote.gate.cta}>
                  {t(`photo.gate.sizes.${sizeNote.gate.requiredTier}`, { mp: sizeNote.mp })}{' '}
                  <PhotoUpgradeCta cta={sizeNote.gate.cta} placement="aperture_export_size_pick" ctaId={`aperture_size_${sizeNote.gate.requiredTier}`} tier={tier} track={track} />
                </p>
              ) : null}
            </fieldset>

            <p className="text-xs text-muted-foreground" data-testid="export-estimate">
              {format === 'png'
                ? t('photo.export.estimateRange', { min: fmtBytes(estimateExportBytes('png', quality, outMp, 'graphic')), max: fmtBytes(estimate) })
                : t('photo.export.estimate', { size: fmtBytes(estimate) })}{' '}
              {t('photo.export.estimateNote')}
            </p>
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {t('photo.export.failed')}
              </p>
            ) : null}
            {failed ? (
              <p role="alert" className="text-sm text-destructive">
                {t('photo.export.failed')}
              </p>
            ) : null}

            <BatchApply
              doc={doc}
              options={{ format, quality, metadataMode: metadata }}
              photoBatch={capabilities?.photoBatch ?? 0}
              signedIn={signedIn}
              renderReady={renderReady}
              onGated={onBatchWall}
              onFinished={onBatchFinished}
              onStart={() => setPhotoBatchContext({ format, megapixels: effectiveMp, doc })}
              upgrade={<PhotoUpgradeCta cta={batchGate.cta} placement="aperture_batch" ctaId={`aperture_batch_${batchGate.requiredTier ?? 'none'}`} tier={tier} track={track} />}
              deps={defaultBatch}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {t('photo.export.cancel')}
              </Button>
              <Button onClick={() => void (failed ? (reset(), start()) : start())} disabled={!canStart && !failed} data-testid="export-start">
                {phase !== 'idle' && !failed ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                {phase !== 'idle' && !failed ? t('photo.export.working') : t('photo.export.start')}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
