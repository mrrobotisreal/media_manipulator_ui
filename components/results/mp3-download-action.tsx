'use client';

import { CheckCircle2, Loader2, Music } from 'lucide-react';
import { useLocalization } from '@/i18n/useLocalization';
import { useToolAnalytics } from '@/lib/analytics';
import { downloadResultAsMp3, useMp3Status } from '@/lib/results/mp3Download';

export interface Mp3DownloadActionProps {
  jobId: string;
  /** The WAV's save-as name. */
  fileName: string;
}

/**
 * MM81: the secondary "Download as MP3" action on a WAV vocal stem. The server converts the
 * finished file once (free, never an AI operation) and the browser downloads the MP3 natively.
 */
export function Mp3DownloadAction({ jobId, fileName }: Mp3DownloadActionProps) {
  const { t, formatFileSize } = useLocalization(['interface']);
  const { track } = useToolAnalytics();
  const status = useMp3Status(jobId);
  const converting = status.phase === 'converting';
  const run = () => void downloadResultAsMp3({ jobId, fileName, track });

  return (
    <div className="flex flex-col gap-1" data-testid="mp3-download">
      <button
        type="button"
        onClick={run}
        disabled={converting}
        aria-busy={converting || undefined}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-edge px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-2 disabled:cursor-wait disabled:opacity-80"
      >
        {converting ? (
          <Loader2 aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
        ) : (
          <Music aria-hidden="true" className="size-4" />
        )}
        {converting ? t('resultPanel.mp3.converting') : t('resultPanel.mp3.button')}
      </button>
      {status.phase === 'idle' && <span className="text-xs text-muted-foreground">{t('resultPanel.mp3.hint')}</span>}
      {status.phase === 'started' && (
        <p role="status" aria-live="polite" className="flex items-center gap-2 text-xs text-success">
          <CheckCircle2 aria-hidden="true" className="size-4 shrink-0" />
          <span>
            {status.sizeBytes
              ? t('resultPanel.mp3.startedWithSize', { size: formatFileSize(status.sizeBytes) })
              : t('resultPanel.mp3.started')}
          </span>
        </p>
      )}
      {status.phase === 'failed' && (
        <p role="alert" className="text-xs text-destructive">
          {status.errorStatus === 404 || status.errorStatus === 410 ? t('resultPanel.downloadStatus.gone') : t('resultPanel.mp3.failed')}
        </p>
      )}
    </div>
  );
}
