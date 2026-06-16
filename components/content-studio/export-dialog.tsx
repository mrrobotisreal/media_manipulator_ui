'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Download, Loader2, Upload, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore } from '@/lib/studioStore';
import { useSaveProject } from '@/lib/useStudioProject';
import { useStartStudioExport, studioDownloadUrl } from '@/lib/useStudioExport';
import { useStudioJobProgress } from '@/lib/useStudioJob';
import { trackStudioExport } from '@/lib/studio/telemetry';
import { useStudioBackend } from '@/lib/studio/studioBackendProvider';
import { useEmbedBridgeOptional } from './embed-bridge';

const exportFormSchema = z.object({
  fileName: z.string().min(1, 'Enter a file name').max(120),
  quality: z.enum(['low', 'medium', 'high']),
  loudness: z.enum(['none', 'streaming', 'podcast', 'broadcast']),
});
type ExportFormValues = z.infer<typeof exportFormSchema>;

/** What the user chose to do with the render (CreaTV mode only). */
type ExportIntent = 'download' | 'publish';

/**
 * Export dialog. On the standalone MM site it renders exactly as before: render
 * → /download/:jobId link. Inside CreaTV's Darkroom (backend.ecosystem ===
 * 'creatv') it offers two actions — Export & Download (the render attaches to
 * the draft and downloads) and Publish (hands the rendered MP4 to CreaTV's
 * upload flow via cs:publish-request) — and emits the cs:export-* lifecycle so
 * Darkroom can drive its own toasts/download outside the iframe.
 */
const ExportDialog: React.FC<{ projectId: string; disabled?: boolean }> = ({ projectId, disabled }) => {
  const { t } = useLocalization('interface');
  const backend = useStudioBackend();
  const bridge = useEmbedBridgeOptional();
  const isCreatv = backend.ecosystem === 'creatv' && backend.capabilities.publish;

  const [open, setOpen] = React.useState(false);
  const [jobId, setJobId] = React.useState<string | null>(null);
  // The completion callback (useStudioJobProgress) always runs the latest
  // closure, so it reads the current `intent` state directly — no ref needed.
  const [intent, setIntent] = React.useState<ExportIntent>('download');

  const projectName = useStudioStore((s) => s.project?.name ?? 'export');
  const project = useStudioStore((s) => s.project);
  const durationSeconds = useStudioStore((s) => s.project?.durationSeconds ?? 0);
  const toSaveRequest = useStudioStore((s) => s.toSaveRequest);
  const markSaved = useStudioStore((s) => s.markSaved);
  const saveMutation = useSaveProject();
  const { startExport, isStarting } = useStartStudioExport(projectId);

  // Emit-once guards for the CreaTV lifecycle handoff.
  const handedOffRef = React.useRef(false);

  const fetchDraftDownload = React.useCallback(async () => {
    const draftId = backend.scope?.draftId;
    if (draftId == null) return;
    try {
      const res = await backend.fetch(`${backend.baseUrl}/drafts/videos/${draftId}/export`, {
        headers: backend.authHeaders(),
      });
      if (!res.ok) return;
      const json = (await res.json()) as { download_url?: string; file_name?: string };
      if (!json.download_url) return;
      const a = document.createElement('a');
      a.href = json.download_url;
      a.download = json.file_name || 'export.mp4';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      /* host can still download via cs:export-complete */
    }
  }, [backend]);

  const job = useStudioJobProgress(jobId, {
    onError: (msg) => {
      toast.error('Export failed', { description: msg });
      if (isCreatv && jobId) bridge?.emit({ type: 'cs:export-failed', jobId, error: msg });
    },
    onComplete: () => {
      if (!isCreatv || !jobId || handedOffRef.current) return;
      handedOffRef.current = true;
      const draftId = backend.scope?.draftId;
      if (intent === 'publish') {
        if (draftId != null) {
          bridge?.emit({
            type: 'cs:publish-request',
            draftId,
            jobId,
            suggestedTitle: projectName,
            durationSeconds,
          });
        }
      } else {
        // Host downloads on cs:export-complete (top-level, dodges iframe
        // download sandboxing). The in-iframe fetchDraftDownload below is the
        // manual "works either way" fallback bound to the Download button.
        if (draftId != null) bridge?.emit({ type: 'cs:export-complete', jobId, draftId });
      }
    },
  });

  // Mirror render progress to the host (CreaTV mode).
  React.useEffect(() => {
    if (!isCreatv || !jobId || !bridge || !job) return;
    if (job.status !== 'completed' && job.status !== 'failed') {
      bridge.emit({ type: 'cs:export-progress', jobId, progress: job.progress ?? 0 });
    }
  }, [isCreatv, jobId, bridge, job]);

  const form = useForm<ExportFormValues>({
    resolver: zodResolver(exportFormSchema),
    defaultValues: { fileName: projectName.replace(/\s+/g, '-').toLowerCase(), quality: 'high', loudness: 'none' },
  });

  const reset = () => {
    setJobId(null);
    setIntent('download');
    handedOffRef.current = false;
    form.reset({ fileName: projectName.replace(/\s+/g, '-').toLowerCase(), quality: 'high', loudness: 'none' });
  };

  const runExport = async (values: ExportFormValues, nextIntent: ExportIntent) => {
    setIntent(nextIntent);
    handedOffRef.current = false;
    const req = toSaveRequest();
    if (!req) return;
    try {
      const saved = await saveMutation.mutateAsync({ id: projectId, req });
      markSaved(saved);
    } catch (err) {
      toast.error('Failed to save project', { description: (err as Error).message });
      return;
    }
    try {
      const res = await startExport({
        fileName: values.fileName,
        preset: values.quality,
        loudness: values.loudness === 'none' ? '' : values.loudness,
      });
      // Derived-metadata telemetry only (no text/filenames).
      const effects = (project?.tracks ?? []).flatMap((tr) => tr.clips).flatMap((c) => c.effects ?? []);
      trackStudioExport({
        hasLut: effects.some((e) => e.type === 'lut'),
        hasChromaKey: effects.some((e) => e.type === 'chromakey'),
        loudness: values.loudness === 'none' ? '' : values.loudness,
      });
      setJobId(res.jobId);
      if (isCreatv) bridge?.emit({ type: 'cs:export-started', jobId: res.jobId });
    } catch (err) {
      toast.error('Failed to start export', { description: (err as Error).message });
    }
  };

  // MM: a single submit. CreaTV: the two action buttons call runExport directly.
  const onSubmit = (values: ExportFormValues) => runExport(values, 'download');

  // Publish a render that already completed (e.g. after Export & Download),
  // without re-rendering.
  const publishExisting = () => {
    if (!jobId) return;
    const draftId = backend.scope?.draftId;
    if (draftId == null) return;
    handedOffRef.current = true;
    setIntent('publish');
    bridge?.emit({
      type: 'cs:publish-request',
      draftId,
      jobId,
      suggestedTitle: projectName,
      durationSeconds,
    });
  };

  const busy = saveMutation.isPending || isStarting;
  const rendering = !!jobId && job?.status !== 'completed' && job?.status !== 'failed';
  const done = job?.status === 'completed';

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <Upload className="w-4 h-4 mr-2" />
          {t('contentStudio.export.button')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('contentStudio.export.title')}</DialogTitle>
          <DialogDescription>
            {isCreatv ? t('contentStudio.export.chooseAction') : t('contentStudio.export.description')}
          </DialogDescription>
        </DialogHeader>

        {!jobId ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fileName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('contentStudio.export.fileName')}</FormLabel>
                    <FormControl>
                      <Input placeholder="my-edit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('contentStudio.export.quality')}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high">{t('contentStudio.export.qualityHigh')}</SelectItem>
                        <SelectItem value="medium">{t('contentStudio.export.qualityMedium')}</SelectItem>
                        <SelectItem value="low">{t('contentStudio.export.qualityLow')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="loudness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('contentStudio.export.loudness')}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">{t('contentStudio.export.loudnessNone')}</SelectItem>
                        <SelectItem value="streaming">{t('contentStudio.export.loudnessStreaming')}</SelectItem>
                        <SelectItem value="podcast">{t('contentStudio.export.loudnessPodcast')}</SelectItem>
                        <SelectItem value="broadcast">{t('contentStudio.export.loudnessBroadcast')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isCreatv ? (
                <DialogFooter className="flex-col gap-2 sm:flex-col sm:space-x-0">
                  <div className="w-full space-y-1">
                    <Button type="submit" disabled={busy} className="w-full">
                      {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                      {t('contentStudio.export.exportAndDownload')}
                    </Button>
                    <p className="text-[11px] text-muted-foreground">{t('contentStudio.export.exportAndDownloadHint')}</p>
                  </div>
                  <div className="w-full space-y-1">
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={busy}
                      className="w-full"
                      onClick={() => form.handleSubmit((v) => runExport(v, 'publish'))()}
                    >
                      {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                      {t('contentStudio.export.publish')}
                    </Button>
                    <p className="text-[11px] text-muted-foreground">{t('contentStudio.export.publishHint')}</p>
                  </div>
                </DialogFooter>
              ) : (
                <DialogFooter>
                  <Button type="submit" disabled={busy}>
                    {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                    {t('contentStudio.export.start')}
                  </Button>
                </DialogFooter>
              )}
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            {rendering && (
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('contentStudio.export.rendering')} {job?.progress ?? 0}%
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all" style={{ width: `${job?.progress ?? 0}%` }} />
                </div>
              </div>
            )}
            {job?.status === 'failed' && (
              <p className="text-sm text-destructive">{job.error || t('contentStudio.export.failed')}</p>
            )}
            {done && isCreatv && intent === 'publish' && (
              <p className="text-sm text-emerald-500">{t('contentStudio.export.publishHandedOff')}</p>
            )}
            {done && isCreatv && intent === 'download' && (
              <div className="space-y-3">
                <p className="text-sm text-emerald-500">{t('contentStudio.export.downloadReady')}</p>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" onClick={() => void fetchDraftDownload()}>
                    <Download className="w-4 h-4 mr-2" />
                    {t('contentStudio.export.download')}
                  </Button>
                  <Button type="button" variant="secondary" onClick={publishExisting}>
                    <Send className="w-4 h-4 mr-2" />
                    {t('contentStudio.export.publishInstead')}
                  </Button>
                </div>
              </div>
            )}
            {done && !isCreatv && (
              <div className="space-y-3">
                <p className="text-sm text-emerald-500">{t('contentStudio.export.ready')}</p>
                <Button asChild>
                  <a href={studioDownloadUrl(jobId)} download>
                    <Download className="w-4 h-4 mr-2" />
                    {t('contentStudio.export.download')}
                  </a>
                </Button>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={reset}>
                {t('contentStudio.export.again')}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
