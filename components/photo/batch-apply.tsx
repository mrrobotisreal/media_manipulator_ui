'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useLocalization } from '@/i18n/useLocalization';
import { saveBlobToDisk } from '@/lib/results/save';
import {
  BatchError,
  buildBatchZip,
  defaultBatchDeps,
  planBatch,
  retryFailed,
  runBatch,
  type BatchDeps,
  type BatchExportOptions,
  type BatchRow,
} from '@/lib/photo/batch';
import { onBatchStarted } from '@/lib/photo/seams';
import type { PhotoDoc } from '@/lib/photo/photoTypes';

/** How a batch run ended (MM101): rows that produced a file, failed rows, wall-clock ms, and the refusal code when the batch itself was refused. */
export interface BatchFinish {
  done: number;
  failed: number;
  ms: number;
  error?: string;
}

export interface BatchApplyProps {
  doc: PhotoDoc;
  options: BatchExportOptions;
  /** `capabilities.photoBatch` (0 = anonymous). */
  photoBatch: number;
  signedIn: boolean;
  renderReady: boolean;
  /** MM101 seam: the user hit the limit / sign-in wall. */
  onGated?: (reason: 'sign_in' | 'limit') => void;
  /** MM101: a run is about to start (the dialog records the format and size the seam reports). */
  onStart?: () => void;
  /** MM101: the run ended or was refused. */
  onFinished?: (r: BatchFinish) => void;
  /** MM101: the upgrade CTA shown with the sign-in / limit line. */
  upgrade?: React.ReactNode;
  /** Test seam. */
  deps?: BatchDeps;
}

const percent = (r: BatchRow) => Math.round((r.progress ?? 0) * 100);

/** "Apply to more photos" (design §5.5 / §6.2, MM99 decision 6). */
export function BatchApply({ doc, options, photoBatch, signedIn, renderReady, onGated, onStart, onFinished, upgrade, deps }: BatchApplyProps) {
  const { t } = useLocalization('interface');
  const d = React.useMemo(() => deps ?? defaultBatchDeps(), [deps]);
  const input = React.useRef<HTMLInputElement>(null);
  const files = React.useRef<File[]>([]);
  const [rows, setRows] = React.useState<BatchRow[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [wall, setWall] = React.useState<null | 'sign_in' | 'limit'>(null);
  const [dropped, setDropped] = React.useState(0);
  const [zipState, setZipState] = React.useState<'idle' | 'working' | 'failed'>('idle');
  const [zipMissing, setZipMissing] = React.useState(0);

  const blocked = planBatch([], photoBatch, signedIn).blocked;

  const run = async (existing?: BatchRow[]) => {
    setBusy(true);
    onStart?.();
    const t0 = Date.now();
    try {
      const final = await runBatch(files.current, doc, options, d, setRows, existing, undefined, { onBatchStarted });
      onFinished?.({ done: final.filter((r) => r.status === 'done').length, failed: final.filter((r) => r.status === 'failed').length, ms: Date.now() - t0 });
    } catch (e) {
      if (e instanceof BatchError && (e.code === 'photo_batch_limit' || e.code === 'sign_in_required')) {
        const reason = e.code === 'sign_in_required' ? 'sign_in' : 'limit';
        setWall(reason);
        onGated?.(reason);
      }
      onFinished?.({ done: 0, failed: files.current.length, ms: Date.now() - t0, error: e instanceof BatchError ? e.code : 'failed' });
    } finally {
      setBusy(false);
    }
  };

  const onPick = (picked: File[]) => {
    const plan = planBatch(picked, photoBatch, signedIn);
    if (plan.blocked) {
      setWall(plan.blocked);
      onGated?.(plan.blocked);
      return;
    }
    setWall(null);
    setDropped(plan.dropped);
    files.current = plan.accepted;
    void run();
  };

  const failedCount = rows.filter((r) => r.status === 'failed').length;
  const doneCount = rows.filter((r) => r.status === 'done').length;

  const retry = () => {
    const next = retryFailed(rows);
    setRows(next);
    void run(next);
  };

  const zip = async () => {
    setZipState('working');
    try {
      const z = await buildBatchZip(rows, d);
      setZipMissing(z.failed);
      if (z.count === 0) {
        setZipState('failed');
        return;
      }
      saveBlobToDisk(z.blob, 'aperture-batch.zip');
      setZipState('idle');
    } catch {
      setZipState('failed');
    }
  };

  return (
    <section className="space-y-2 rounded-md border border-edge p-3" aria-label={t('photo.batch.title')} data-testid="batch-apply">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('photo.batch.title')}</h3>
      <p className="text-xs text-muted-foreground">{t('photo.batch.body')}</p>
      {blocked === 'sign_in' && !wall ? <p className="text-xs" data-testid="batch-signin">{t('photo.batch.signIn')} {upgrade}</p> : null}
      {wall === 'sign_in' ? <p role="status" className="text-xs" data-testid="batch-signin">{t('photo.batch.signIn')} {upgrade}</p> : null}
      {wall === 'limit' ? (
        <p role="status" className="text-xs" data-testid="batch-limit">
          {t('photo.batch.limit', { count: photoBatch })} {upgrade}
        </p>
      ) : null}
      {photoBatch > 0 && rows.length === 0 ? <p className="text-xs text-muted-foreground">{t('photo.batch.upTo', { count: photoBatch })}</p> : null}
      <input
        ref={input}
        type="file"
        multiple
        accept="image/*,.heic,.heif,.tif,.tiff"
        className="sr-only"
        data-testid="batch-input"
        aria-label={t('photo.batch.choose')}
        onChange={(e) => {
          const list = Array.from(e.target.files ?? []);
          e.target.value = '';
          if (list.length) onPick(list);
        }}
      />
      <Button size="sm" variant="outline" disabled={!renderReady || busy} onClick={() => (blocked ? (setWall(blocked), onGated?.(blocked)) : input.current?.click())} data-testid="batch-choose">
        {t('photo.batch.choose')}
      </Button>
      {dropped > 0 ? <p className="text-xs text-muted-foreground">{t('photo.batch.dropped', { count: dropped })}</p> : null}

      {rows.length > 0 ? (
        <ul className="space-y-1" data-testid="batch-rows">
          {rows.map((r) => (
            <li key={r.key} className="flex items-center gap-2 text-sm" data-testid={`batch-row-${r.status}`}>
              <span className="min-w-0 flex-1 truncate">{r.fileName}</span>
              <span className="shrink-0 text-xs text-muted-foreground" aria-live="polite">
                {r.status === 'queued' || r.status === 'creating' || r.status === 'created'
                  ? t('photo.batch.status.preparing')
                  : r.status === 'exporting'
                    ? t('photo.batch.status.rendering', { percent: percent(r) })
                    : r.status === 'done'
                      ? t('photo.batch.status.done')
                      : t('photo.batch.status.failed')}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {busy ? <Loader2 className="size-4 animate-spin" aria-label={t('photo.export.working')} /> : null}
      <div className="flex flex-wrap gap-2">
        {failedCount > 0 && !busy ? (
          <Button size="sm" variant="outline" onClick={retry} data-testid="batch-retry">
            {t('photo.batch.retry', { count: failedCount })}
          </Button>
        ) : null}
        {doneCount > 0 ? (
          <Button size="sm" disabled={zipState === 'working'} onClick={() => void zip()} data-testid="batch-zip">
            {zipState === 'working' ? t('photo.batch.zipping') : t('photo.batch.zip', { count: doneCount })}
          </Button>
        ) : null}
      </div>
      {zipState === 'failed' ? <p role="alert" className="text-xs text-destructive">{t('photo.batch.zipFailed')}</p> : null}
      {zipMissing > 0 ? <p className="text-xs text-muted-foreground">{t('photo.batch.zipMissing', { count: zipMissing })}</p> : null}
    </section>
  );
}
