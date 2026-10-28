'use client';

import { CheckCircle2 } from 'lucide-react';
import { useLocalization } from '@/i18n/useLocalization';
import type { DownloadStatus } from '@/lib/results/downloadController';
import { cn } from '@/lib/utils';

export interface DownloadStatusLineProps {
  status: DownloadStatus;
  /** Re-runs the Download action (the error's "Try again"). */
  onRetry: () => void;
  className?: string;
}

/**
 * MM80: the line under a Download button that says what happened. "Started" points at the
 * browser's downloads (the browser owns progress now); a failure gets a clear message, a
 * "Try again" and the reassurance that downloading again never re-runs or charges the job.
 */
export function DownloadStatusLine({ status, onRetry, className }: DownloadStatusLineProps) {
  const { t, formatFileSize } = useLocalization(['interface']);
  if (status.phase === 'started') {
    const size = status.sizeBytes !== undefined && status.sizeBytes > 0 ? formatFileSize(status.sizeBytes) : null;
    return (
      <p role="status" aria-live="polite" className={cn('flex items-center gap-2 text-sm text-success', className)} data-testid="download-status">
        <CheckCircle2 aria-hidden="true" className="size-4 shrink-0" />
        <span>{size ? t('resultPanel.downloadStatus.startedWithSize', { size }) : t('resultPanel.downloadStatus.started')}</span>
      </p>
    );
  }
  if (status.phase === 'failed') {
    const gone = status.errorStatus === 404 || status.errorStatus === 410;
    return (
      <div role="alert" className={cn('flex flex-wrap items-center gap-x-3 gap-y-1 text-sm', className)} data-testid="download-status">
        <span className="text-destructive">
          {gone ? t('resultPanel.downloadStatus.gone') : t('resultPanel.downloadStatus.failed')}
        </span>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md border border-edge px-2.5 py-1 font-medium text-foreground transition-colors hover:bg-surface-2"
        >
          {t('resultPanel.downloadStatus.retry')}
        </button>
        <span className="basis-full text-muted-foreground">{t('resultPanel.downloadStatus.noRecharge')}</span>
      </div>
    );
  }
  if (status.phase === 'preparing') {
    return (
      <p role="status" aria-live="polite" className="sr-only">
        {t('resultPanel.downloadStatus.preparing')}
      </p>
    );
  }
  return null;
}
