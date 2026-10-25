'use client';

import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
import { downloadText, serializeSRT, serializeVTT } from '@/lib/useStudioCaptions';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useQueryClient } from '@tanstack/react-query';
import { exportsQueryKey } from '@/lib/useStudioExports';
import {
  DEFAULT_EXPORT_CHOICES,
  buildExportRequest,
  effectiveCaptionsMode,
  formatExtension,
  isAudioFormat,
  resolutionLabel,
  resolutionOptions,
  sidecarFileNames,
} from '@/lib/studio/exportOptions';
import { activationEvents, analytics, EVENTS, markJobStarted, takeJobDuration } from '@/lib/analytics';
import type { StudioExportStartedProps } from '@/lib/analytics';
import { exportDurationRatioBucket, studioHost } from '@/lib/studio/telemetry';
import { useStudioBackend } from '@/lib/studio/studioBackendProvider';
import { useEmbedBridgeOptional } from './embed-bridge';
import { isIrreversibleActionHidden } from '@/lib/translator/mode';

const exportFormSchema = z.object({
  fileName: z.string().min(1, 'Enter a file name').max(120),
  quality: z.enum(['low', 'medium', 'high']),
  loudness: z.enum(['none', 'streaming', 'podcast', 'broadcast']),
  // Part 20 export depth. Defaults reproduce the pre-part-20 export exactly.
  format: z.enum(['h264', 'hevc', 'mp3', 'wav']),
  resolution: z.number().int().min(0),
  captionsMode: z.enum(['none', 'burn_in', 'sidecar']),
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
const ExportDialog: React.FC<{ projectId: string; disabled?: boolean }> = (props) => {
  // MM52 (design §2.15): no Darkroom export on translator deployments. A wrapper,
  // so the dialog's hooks are never conditional.
  if (isIrreversibleActionHidden()) return null;
  return <ExportDialogInner {...props} />;
};

const ExportDialogInner: React.FC<{ projectId: string; disabled?: boolean }> = ({ projectId, disabled }) => {
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
  const canvasHeight = useStudioStore((s) => s.project?.height ?? 1080);
  const captionCues = useStudioStore((s) => s.project?.captions);
  const hasCaptions = (captionCues?.length ?? 0) > 0;
  // Part 20: capability-gated. CreaTV's Darkroom API has none of these routes,
  // so there the dialog stays the legacy MP4 form and sends the legacy body.
  const exportDepth = backend.capabilities.exportDepth;
  // The caller's plan cap, for annotating rungs only. The SERVER enforces it
  // (403 output_height_limited -> UpgradeInterstitial via authedFetch).
  const maxOutputHeight = useAuth()?.limits?.maxOutputHeight;
  const toSaveRequest = useStudioStore((s) => s.toSaveRequest);
  const markSaved = useStudioStore((s) => s.markSaved);
  const saveMutation = useSaveProject();
  const { startExport, isStarting } = useStartStudioExport(projectId);
  const queryClient = useQueryClient();
  const refreshHistory = React.useCallback(
    () => void queryClient.invalidateQueries({ queryKey: exportsQueryKey(projectId) }),
    [queryClient, projectId],
  );

  // Emit-once guards for the CreaTV lifecycle handoff.
  const handedOffRef = React.useRef(false);

  // The studio_export_started props, remembered so completed/failed carry the
  // identical dimensions (part 10, ADR ws/0003). A ref, not state: the terminal
  // callbacks must see the values of the render they belong to.
  const exportPropsRef = React.useRef<StudioExportStartedProps | null>(null);
  // Part 20: whether this render owes the user SRT/VTT sidecar files, and its format.
  const sidecarRef = React.useRef(false);
  const formatRef = React.useRef<'h264' | 'hevc' | 'mp3' | 'wav'>('h264');
  // State mirrors of the two refs, for rendering the done state.
  const [doneFormat, setDoneFormat] = React.useState<'h264' | 'hevc' | 'mp3' | 'wav'>('h264');
  const [sidecarOwed, setSidecarOwed] = React.useState(false);
  const baseNameRef = React.useRef('export');
  const downloadSidecars = React.useCallback(() => {
    const cues = useStudioStore.getState().project?.captions ?? [];
    if (cues.length === 0) return;
    const names = sidecarFileNames(baseNameRef.current);
    downloadText(names.srt, serializeSRT(cues), 'application/x-subrip');
    downloadText(names.vtt, serializeVTT(cues), 'text/vtt');
  }, []);

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
      refreshHistory();
      // TERMINAL TRUTH FOR A STUDIO EXPORT LIVES HERE, not in useGetJobStatus.
      //
      // Content Studio does not use useGetJobStatus at all — it has its own watcher
      // (useStudioJobProgress: SSE on MM, polling on CreaTV, shapes normalized by
      // backend.parseJob). So the terminal events every other tool gets for free had no
      // producer for the single most expensive surface on the site: markJobStarted was
      // called on export, and nothing ever closed the pair. takeJobDuration is what turns
      // that recorded start into a real duration instead of a component's local state.
      //
      // Emitted BEFORE the CreaTV bridge work below, and outside its guards, because the
      // analytics event is wanted on both ecosystems while the bridge messages are
      // CreaTV-only.
      if (jobId) {
        const renderMs = takeJobDuration(jobId);
        analytics.track(
          EVENTS.JOB_FAILED,
          {
            job_id: jobId,
            duration_ms: renderMs,
            // The watcher's message, which comes from our own API's job error field — it
            // can name a path, so it is not passed through. `stage` says where instead.
            reason: 'export_failed',
            stage: 'export',
          },
          { job_id: jobId, media_kind: 'video' },
        );
        // First-class studio event alongside the generic funnel (part 10: the JOB_*
        // pair stays for continuity; part 22 may retire it).
        if (exportPropsRef.current) {
          analytics.track(
            EVENTS.STUDIO_EXPORT_FAILED,
            {
              ...exportPropsRef.current,
              durationRatioBucket: exportDurationRatioBucket(renderMs, durationSeconds),
            },
            { job_id: jobId, feature: 'studio' },
          );
        }
      }
      toast.error(t('error:toasts.exportFailed'), { description: msg });
      if (isCreatv && jobId) bridge?.emit({ type: 'cs:export-failed', jobId, error: msg });
    },
    onComplete: () => {
      refreshHistory();
      if (jobId) {
        const renderMs = takeJobDuration(jobId);
        analytics.track(
          EVENTS.JOB_COMPLETED,
          { job_id: jobId, duration_ms: renderMs },
          { job_id: jobId, media_kind: 'video' },
        );
        activationEvents.jobCompleted();
        // Sidecar mode: the render itself is caption-free; deliver the SRT + VTT
        // generated client-side alongside it (best effort - the done state also
        // has an explicit button in case the browser blocks a second download).
        if (sidecarRef.current) downloadSidecars();
        if (exportPropsRef.current) {
          analytics.track(
            EVENTS.STUDIO_EXPORT_COMPLETED,
            {
              ...exportPropsRef.current,
              durationRatioBucket: exportDurationRatioBucket(renderMs, durationSeconds),
            },
            { job_id: jobId, feature: 'studio' },
          );
        }
      }
      if (!isCreatv || !jobId || handedOffRef.current) return;
      handedOffRef.current = true;
      const draftId = backend.scope?.draftId;
      if (intent === 'publish') {
        if (draftId != null) {
          analytics.track(
            EVENTS.STUDIO_PUBLISH_REQUESTED,
            { embed: true, host: studioHost() },
            { job_id: jobId, feature: 'studio' },
          );
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
    defaultValues: { fileName: projectName.replace(/\s+/g, '-').toLowerCase(), ...DEFAULT_EXPORT_CHOICES },
  });

  const reset = () => {
    setJobId(null);
    setIntent('download');
    setSidecarOwed(false);
    handedOffRef.current = false;
    form.reset({ fileName: projectName.replace(/\s+/g, '-').toLowerCase(), ...DEFAULT_EXPORT_CHOICES });
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
      toast.error(t('error:toasts.saveProjectFailed'), { description: (err as Error).message });
      return;
    }
    try {
      const captionsMode = effectiveCaptionsMode(values.captionsMode, hasCaptions);
      const res = await startExport(buildExportRequest({ ...values, captionsMode }, exportDepth));
      baseNameRef.current = values.fileName;
      sidecarRef.current = exportDepth && captionsMode === 'sidecar' && !isAudioFormat(values.format);
      formatRef.current = exportDepth ? values.format : 'h264';
      setDoneFormat(formatRef.current);
      setSidecarOwed(sidecarRef.current);
      // DERIVED METADATA ONLY — booleans and preset keys. Never `values.fileName`, which the
      // visitor typed and which routinely contains a client name or a project codename.
      const effects = (project?.tracks ?? []).flatMap((tr) => tr.clips).flatMap((c) => c.effects ?? []);
      // A studio export IS a real job: it transcodes and produces a downloadable artifact,
      // so unlike the rest of the studio's interactions it belongs in the funnel. The
      // duration then comes from jobTimings on the terminal event, like every other job.
      markJobStarted(res.jobId, 'content-studio', 'video');
      analytics.track(
        EVENTS.JOB_STARTED,
        {
          job_id: res.jobId,
          target_format: values.quality,
          options_hash: [
            values.quality,
            effects.some((e) => e.type === 'lut') ? 'lut' : '',
            effects.some((e) => e.type === 'chromakey') ? 'chromakey' : '',
            values.loudness === 'none' ? '' : `loudness-${values.loudness}`,
          ]
            .filter(Boolean)
            .join('-'),
        },
        { job_id: res.jobId, media_kind: 'video', feature: 'studio' },
      );
      // First-class studio export event (part 10). Resolution is the canvas
      // preset, a closed vocabulary from the new-project picker.
      // Part 20: format is the closed enum; resolution is the output-height rung
      // ('720p'..'2160p'), 'canvas' or 'audio' - never a free-form size.
      const audioOut = isAudioFormat(values.format) && exportDepth;
      exportPropsRef.current = {
        preset: values.quality,
        format: exportDepth ? values.format : 'h264',
        resolution: audioOut ? 'audio' : exportDepth ? resolutionLabel(values.resolution) : 'canvas',
        captionsMode: exportDepth ? (audioOut ? 'none' : captionsMode) : undefined,
        host: studioHost(),
      };
      analytics.track(EVENTS.STUDIO_EXPORT_STARTED, exportPropsRef.current, {
        job_id: res.jobId,
        feature: 'studio',
      });
      setJobId(res.jobId);
      refreshHistory();
      if (isCreatv) bridge?.emit({ type: 'cs:export-started', jobId: res.jobId });
    } catch (err) {
      toast.error(t('error:toasts.exportStartFailed'), { description: (err as Error).message });
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
    analytics.track(
      EVENTS.STUDIO_PUBLISH_REQUESTED,
      { embed: true, host: studioHost() },
      { job_id: jobId, feature: 'studio' },
    );
    bridge?.emit({
      type: 'cs:publish-request',
      draftId,
      jobId,
      suggestedTitle: projectName,
      durationSeconds,
    });
  };

  const watchedFormat = useWatch({ control: form.control, name: 'format' });
  const audioFormat = isAudioFormat(watchedFormat);
  const resOptions = resolutionOptions(canvasHeight, maxOutputHeight);
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
      {/* Wider than the 512px default, and the two settings sit side by side
          from `sm` so the extra width is actually used. Not taken to the account
          panel's width on purpose: this is three fields opened from inside the
          editor, and a dialog that covers the timeline it is exporting is worse
          than a compact one. */}
      <DialogContent className="sm:max-w-xl md:max-w-2xl">
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
              {exportDepth && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('contentStudio.export.format')}</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="h264">{t('contentStudio.export.formatH264')}</SelectItem>
                            <SelectItem value="hevc">{t('contentStudio.export.formatHevc')}</SelectItem>
                            <SelectItem value="mp3">{t('contentStudio.export.formatMp3')}</SelectItem>
                            <SelectItem value="wav">{t('contentStudio.export.formatWav')}</SelectItem>
                          </SelectContent>
                        </Select>
                        {field.value === 'hevc' && (
                          <p className="text-[11px] text-muted-foreground">{t('contentStudio.export.hevcHint')}</p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="resolution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('contentStudio.export.resolution')}</FormLabel>
                        <Select
                          value={String(field.value)}
                          onValueChange={(v) => field.onChange(Number(v))}
                          disabled={audioFormat}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {resOptions.map((o) => (
                              <SelectItem key={o.value} value={String(o.value)}>
                                {o.value === 0
                                  ? t('contentStudio.export.resolutionSource', { height: o.height })
                                  : `${o.value}p`}
                                {o.overCap ? ` · ${t('contentStudio.export.overPlan')}` : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
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
              </div>

              {exportDepth && !audioFormat && (
                <FormField
                  control={form.control}
                  name="captionsMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contentStudio.export.captions')}</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange} disabled={!hasCaptions}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">{t('contentStudio.export.captionsNone')}</SelectItem>
                          <SelectItem value="burn_in">{t('contentStudio.export.captionsBurnIn')}</SelectItem>
                          <SelectItem value="sidecar">{t('contentStudio.export.captionsSidecar')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-[11px] text-muted-foreground">
                        {hasCaptions ? t('contentStudio.export.captionsHint') : t('contentStudio.export.captionsEmpty')}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

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
                  <div className="h-full bg-primary transition-all" style={{ width: `${job?.progress ?? 0}%` }} />
                </div>
              </div>
            )}
            {job?.status === 'failed' && (
              <p className="text-sm text-destructive">{job.error || t('contentStudio.export.failed')}</p>
            )}
            {done && isCreatv && intent === 'publish' && (
              <p className="text-sm text-success">{t('contentStudio.export.publishHandedOff')}</p>
            )}
            {done && isCreatv && intent === 'download' && (
              <div className="space-y-3">
                <p className="text-sm text-success">{t('contentStudio.export.downloadReady')}</p>
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
                <p className="text-sm text-success">{t('contentStudio.export.ready')}</p>
                <Button asChild>
                  <a href={studioDownloadUrl(jobId)} download>
                    <Download className="w-4 h-4 mr-2" />
                    {t('contentStudio.export.downloadFile', { ext: formatExtension(doneFormat).toUpperCase() })}
                  </a>
                </Button>
                {sidecarOwed && (
                  <Button type="button" variant="secondary" onClick={downloadSidecars}>
                    <Download className="w-4 h-4 mr-2" />
                    {t('contentStudio.export.downloadCaptions')}
                  </Button>
                )}
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
