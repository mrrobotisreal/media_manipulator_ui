'use client';

import { AlertTriangle } from 'lucide-react';
import { useLocalization } from '@/i18n/useLocalization';
import type { TranscodeProbeResponse } from '@/lib/transcodeTypes';

export const formatBytes = (bytes: number | undefined): string => {
  if (!bytes || bytes <= 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[i]}`;
};

export const formatSeconds = (secs: number | undefined): string => {
  if (!secs || secs <= 0) return '—';
  const m = Math.floor(secs / 60);
  const s = Math.round(secs - m * 60);
  return `${m}:${String(s).padStart(2, '0')}`;
};

/**
 * The transcode probe report (resolution, fps, codecs, size) plus any probe warnings. Shared
 * by the transcode form (before the job) and the stream viewer (the fallback when a bundle
 * cannot be played in the browser).
 */
export function StreamReport({ probe }: { probe: TranscodeProbeResponse }) {
  const { t } = useLocalization('interface');
  return (
    <div className="w-full rounded-lg border border-border bg-muted/20 p-4" data-testid="stream-report">
      <h3 className="mb-2 font-semibold text-card-foreground">{t('videoTranscodeForm.report.title')}</h3>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:grid-cols-3">
        <div><dt className="text-muted-foreground">{t('videoTranscodeForm.report.resolution')}</dt><dd className="text-card-foreground">{probe.width}×{probe.height}</dd></div>
        <div><dt className="text-muted-foreground">{t('videoTranscodeForm.report.maxQuality')}</dt><dd className="text-card-foreground uppercase">{probe.maxQualityLabel}</dd></div>
        <div><dt className="text-muted-foreground">{t('videoTranscodeForm.report.fps')}</dt><dd className="text-card-foreground">{probe.fps ? probe.fps.toFixed(2) : '—'}</dd></div>
        <div><dt className="text-muted-foreground">{t('videoTranscodeForm.report.duration')}</dt><dd className="text-card-foreground">{formatSeconds(probe.durationSeconds)}</dd></div>
        <div><dt className="text-muted-foreground">{t('videoTranscodeForm.report.audio')}</dt><dd className="text-card-foreground">{probe.hasAudio ? t('videoTranscodeForm.report.yes') : t('videoTranscodeForm.report.no')}</dd></div>
        <div><dt className="text-muted-foreground">{t('videoTranscodeForm.report.videoCodec')}</dt><dd className="text-card-foreground">{probe.videoCodec || '—'}</dd></div>
        <div><dt className="text-muted-foreground">{t('videoTranscodeForm.report.audioCodec')}</dt><dd className="text-card-foreground">{probe.audioCodec || '—'}</dd></div>
        <div><dt className="text-muted-foreground">{t('videoTranscodeForm.report.container')}</dt><dd className="text-card-foreground">{probe.containerFormat || '—'}</dd></div>
        <div><dt className="text-muted-foreground">{t('videoTranscodeForm.report.fileSize')}</dt><dd className="text-card-foreground">{formatBytes(probe.fileSizeBytes)}</dd></div>
      </dl>
      {probe.warnings && probe.warnings.length > 0 && (
        <div className="mt-3 flex items-start gap-2 rounded border border-premium bg-premium/60 p-3 text-sm dark:border-premium/60 dark:bg-premium/30">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-premium" />
          <div>
            <ul className="space-y-1">
              {probe.warnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default StreamReport;
