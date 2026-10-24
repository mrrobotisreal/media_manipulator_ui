'use client';

import React from 'react';
import { Download, FileDown, Image as ImageIcon, Loader2, PackageOpen, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore } from '@/lib/studioStore';
import { useStudioBackend } from '@/lib/studio/studioBackendProvider';
import { useStudioJobProgress } from '@/lib/useStudioJob';
import { studioDownloadUrl } from '@/lib/useStudioExport';
import { useExportFrame, useExportsQuery, useRenderAgain, exportsQueryKey } from '@/lib/useStudioExports';
import { analytics, EVENTS } from '@/lib/analytics';
import { editSummary, studioHost } from '@/lib/studio/telemetry';
import {
  type ExportRow,
  type LiveJob,
  errorClassKey,
  exportHistorySummary,
  formatExtension,
  hasRunning,
  isAudioFormat,
  jobsToWatch,
  mergeExportRows,
  resolutionLabel,
} from '@/lib/studio/exportOptions';
import { useQueryClient } from '@tanstack/react-query';
import { useEmbedBridgeOptional } from './embed-bridge';
import type { StudioExportRecord } from '@/lib/studioTypes';

/**
 * Watches ONE running export job and reports its live state upward. One
 * watcher per running row keeps useStudioJobProgress (a single-job hook) usable
 * for the whole list, and it is what makes exports leave-the-page-safe: the
 * panel mounts with the editor, reads the durable studio_exports rows, and
 * re-attaches a watcher to every row still running - the job itself never
 * depended on this tab.
 */
const JobWatcher: React.FC<{
  jobId: string;
  onUpdate: (jobId: string, job: LiveJob) => void;
  onSettled: (jobId: string, ok: boolean, error?: string) => void;
}> = ({ jobId, onUpdate, onSettled }) => {
  const job = useStudioJobProgress(jobId, {
    onComplete: () => onSettled(jobId, true),
    onError: (msg) => onSettled(jobId, false, msg),
  });
  React.useEffect(() => {
    if (job) onUpdate(jobId, { status: job.status, progress: job.progress, error: job.error });
  }, [job, jobId, onUpdate]);
  return null;
};

const ExportsPanel: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { t, formatDate } = useLocalization('interface');
  const backend = useStudioBackend();
  const bridge = useEmbedBridgeOptional();
  const queryClient = useQueryClient();
  const supported = backend.capabilities.exportDepth;
  const isCreatv = backend.ecosystem === 'creatv';
  const [open, setOpen] = React.useState(false);
  const [live, setLive] = React.useState<Record<string, LiveJob | undefined>>({});

  // Always on (not just while the sheet is open): the header badge and the
  // resume-watching behaviour both hang off the durable rows.
  const exportsQuery = useExportsQuery(projectId, true);
  const renderAgain = useRenderAgain(projectId);
  const frame = useExportFrame(projectId);

  const records: StudioExportRecord[] = React.useMemo(() => exportsQuery.data ?? [], [exportsQuery.data]);
  const rows: ExportRow[] = React.useMemo(() => mergeExportRows(records, live), [records, live]);
  const running = hasRunning(rows);
  const watch = React.useMemo(() => jobsToWatch(records), [records]);

  // Props remembered for re-renders started from this panel, so their terminal
  // events carry the same dimensions as the started one.
  const rerenderProps = React.useRef<Record<string, Parameters<typeof analytics.track<typeof EVENTS.STUDIO_EXPORT_STARTED>>[1]>>({});

  const onUpdate = React.useCallback((jobId: string, job: LiveJob) => {
    setLive((prev) => {
      const old = prev[jobId];
      if (old && old.status === job.status && old.progress === job.progress) return prev;
      return { ...prev, [jobId]: job };
    });
  }, []);

  const emitHistory = React.useCallback(() => {
    // Additive protocol message (part 20). Only meaningful when the host API
    // serves the history (capabilities.exportDepth); a host may ignore it.
    if (!bridge || !isCreatv || !supported) return;
    const fresh = queryClient.getQueryData<StudioExportRecord[]>(exportsQueryKey(projectId)) ?? [];
    bridge.emit({ type: 'cs:export-history', ...exportHistorySummary(mergeExportRows(fresh, {})) });
  }, [bridge, isCreatv, supported, queryClient, projectId]);

  const onSettled = React.useCallback(
    (jobId: string, ok: boolean, error?: string) => {
      const props = rerenderProps.current[jobId];
      if (props) {
        delete rerenderProps.current[jobId];
        analytics.track(ok ? EVENTS.STUDIO_EXPORT_COMPLETED : EVENTS.STUDIO_EXPORT_FAILED, props, {
          job_id: jobId,
          feature: 'studio',
        });
      }
      if (!ok && error) toast.error(t('error:toasts.exportFailed'), { description: error });
      void queryClient.invalidateQueries({ queryKey: exportsQueryKey(projectId) }).then(emitHistory);
    },
    [queryClient, projectId, t, emitHistory],
  );

  if (!supported) return null;

  const handleAgain = async (row: ExportRow) => {
    try {
      const res = await renderAgain.mutateAsync(row.id);
      editSummary.increment('exportsRerendered');
      editSummary.increment('uiInvocations');
      const props = {
        preset: (['low', 'medium', 'high'].includes(row.preset ?? '') ? row.preset : 'high') as 'low' | 'medium' | 'high',
        format: row.format,
        resolution: isAudioFormat(row.format) ? 'audio' : resolutionLabel(row.resolution),
        captionsMode: row.captionsMode,
        host: studioHost(),
      };
      rerenderProps.current[res.jobId] = props;
      analytics.track(EVENTS.STUDIO_EXPORT_STARTED, props, { job_id: res.jobId, feature: 'studio' });
      toast.success(t('contentStudio.exports.rerenderStarted'));
    } catch (err) {
      // A plan-limit 403 already opened the upgrade interstitial (authedFetch).
      toast.error(t('error:toasts.exportStartFailed'), { description: (err as Error).message });
    }
  };

  const handleFrame = async () => {
    const t0 = useStudioStore.getState().playhead;
    const name = useStudioStore.getState().project?.name ?? 'frame';
    try {
      const blob = await frame.mutateAsync({ t: t0, fileName: name });
      editSummary.increment('framesExported');
      editSummary.increment('uiInvocations');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch (err) {
      toast.error(t('contentStudio.exports.frameFailed'), { description: (err as Error).message });
    }
  };

  const downloadHref = (row: ExportRow) => (backend.downloadUrl(row.jobId) ? studioDownloadUrl(row.jobId) : '');

  return (
    <>
      {/* One invisible watcher per running row. */}
      {watch.map((id) => (
        <JobWatcher key={id} jobId={id} onUpdate={onUpdate} onSettled={onSettled} />
      ))}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative"
            title={t('contentStudio.exports.open')}
            aria-label={t('contentStudio.exports.open')}
          >
            <PackageOpen className="w-4 h-4" />
            {running && (
              <span
                className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-primary animate-pulse"
                aria-hidden
              />
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex w-full flex-col gap-0 sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{t('contentStudio.exports.title')}</SheetTitle>
            <SheetDescription>{t('contentStudio.exports.description')}</SheetDescription>
          </SheetHeader>

          <div className="px-4 pb-3">
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              disabled={frame.isPending}
              onClick={() => void handleFrame()}
            >
              {frame.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImageIcon className="w-4 h-4 mr-2" />}
              {t('contentStudio.exports.framePng')}
            </Button>
            <p className="mt-1 text-[11px] text-muted-foreground">{t('contentStudio.exports.framePngHint')}</p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {exportsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('contentStudio.exports.loading')}
              </p>
            ) : exportsQuery.isError ? (
              <p className="text-sm text-destructive">{t('contentStudio.exports.loadFailed')}</p>
            ) : rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('contentStudio.exports.empty')}</p>
            ) : (
              <ul className="space-y-2">
                {rows.map((row) => (
                  <li key={row.id} className="rounded-lg border border-border bg-background/40 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-card-foreground">
                          {(row.fileName || 'export') + '.' + formatExtension(row.format)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t(`contentStudio.exports.format_${row.format}`)}
                          {!isAudioFormat(row.format) && ` · ${row.resolution > 0 ? `${row.resolution}p` : t('contentStudio.exports.canvas')}`}
                          {' · '}
                          {formatDate(row.createdAt)}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {t(`contentStudio.exports.status_${row.displayStatus}`)}
                      </span>
                    </div>

                    {row.displayStatus === 'running' && (
                      <div className="mt-2">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div className="h-full bg-primary transition-all" style={{ width: `${row.progress}%` }} />
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {t('contentStudio.export.rendering')} {row.progress}%
                        </p>
                      </div>
                    )}
                    {row.displayStatus === 'failed' && (
                      <p className="mt-2 text-xs text-destructive">
                        {t(`contentStudio.exports.error_${errorClassKey(row.error)}`)}
                      </p>
                    )}
                    {row.displayStatus === 'completed' && !row.canDownload && (
                      <p className="mt-2 text-xs text-muted-foreground">{t('contentStudio.exports.expired')}</p>
                    )}

                    {row.displayStatus !== 'running' && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {row.canDownload && downloadHref(row) && (
                          <Button asChild size="sm">
                            <a href={downloadHref(row)} download>
                              <Download className="w-3.5 h-3.5 mr-1.5" />
                              {t('contentStudio.exports.download')}
                            </a>
                          </Button>
                        )}
                        {row.canDownload && !downloadHref(row) && (
                          <span className="inline-flex items-center text-xs text-muted-foreground">
                            <FileDown className="w-3.5 h-3.5 mr-1.5" />
                            {t('contentStudio.exports.hostDownload')}
                          </span>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={renderAgain.isPending}
                          onClick={() => void handleAgain(row)}
                        >
                          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                          {t('contentStudio.exports.again')}
                        </Button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ExportsPanel;
