'use client';

/**
 * MM116b: Medi's confirmation card for a single-tool job (`action` kind `confirm_job`).
 *
 * Medi never starts a job. The server priced the proposal (quota, queue) and validated the
 * options; the card shows them with labels, units and values taken from the tool's own option
 * schema and the localized strings, never from model text. Nothing happens until the visitor
 * presses the button:
 *   - a file was dropped into the guide and the tool's request is buildable here: **Start** runs
 *     the job through the tool's existing submit hook (useConvertFile / useSpecializedMediaTool /
 *     useTranscribeFile, the same request builders the panels use), shows progress and polls with
 *     useGetJobStatus, and opens the shared ResultPanel in a dialog when it finishes;
 *   - otherwise **Open <tool> with these settings** navigates to the tool page with the validated
 *     `?o=` link (the visitor picks the file and presses the page's own button).
 * Loaded lazily (with the tool shards) the first time a card appears.
 */
import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Loader2 } from 'lucide-react';

import { ResultPanel } from '@/components/results/result-panel';
import { useLocalization } from '@/i18n/useLocalization';
import { EVENTS, getToolSlug, setContext } from '@/lib/analytics';
import { MEDI_BRAND } from '@/lib/assistant/brand';
import { loadJobTool } from '@/lib/assistant/jobs/tool';
import { planJob, resultFileName, runBlock, type FileKind, type JobPlan } from '@/lib/assistant/jobs/plan';
import { settingRows, valueKey, CODE_VALUES } from '@/lib/assistant/jobs/settings';
import { actionHref } from '@/lib/assistant/links';
import type { AssistantTrack } from '@/lib/assistant/useAssistantStream';
import { describe as describeResult } from '@/lib/results/describe';
import useConvertFile from '@/lib/useConvertFile';
import useGetJobStatus, { type ConversionJob } from '@/lib/useGetJobStatus';
import useSpecializedMediaTool from '@/lib/useSpecializedMediaTool';
import useTranscribeFile from '@/lib/useTranscribeFile';
import { getFileType } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { ConfirmJobParamsSchema } from '@/schemas/assistant';

export interface JobCardProps {
  callId: string;
  /** The model's button label (shown nowhere: the card builds its own words). */
  label: string;
  /** The action's raw params. */
  params: Record<string, unknown> | null | undefined;
  locale: string;
  /** The file dropped into the guide, as the browser holds it (null = none attached). */
  file: File | null;
  track: AssistantTrack;
  /** Navigate to a site href (the guide closes its sheet on phones). */
  onOpen: (href: string) => void;
}

export default function JobCard(props: JobCardProps) {
  const parsed = React.useMemo(() => ConfirmJobParamsSchema.safeParse(props.params), [props.params]);
  if (!parsed.success) return null;
  return <JobCardBody {...props} job={parsed.data} />;
}

function JobCardBody({ callId, params, locale, file: fileProp, track, onOpen, job: p }: JobCardProps & { job: ReturnType<typeof ConfirmJobParamsSchema.parse> }) {
  const { t } = useLocalization(['interface']);
  const b = { brand: MEDI_BRAND };
  // The file at the moment the card appeared is the file this proposal is about.
  const [file] = React.useState<File | null>(fileProp);
  const fileKind: FileKind | 'unknown' | null = file ? getFileType(file) : null;

  const toolQ = useQuery({ queryKey: ['assistant-job-tool', p.tool], queryFn: () => loadJobTool(p.tool), staleTime: Infinity, gcTime: Infinity });
  const tool = toolQ.data ?? null;
  const options = p.options;
  const plan: JobPlan | null = React.useMemo(
    () => (tool && tool.spec.kind === 'options' ? planJob(tool.spec.family, options ?? {}, tool.embed) : null),
    [tool, options],
  );
  const rows = React.useMemo(() => (tool ? settingRows(tool.spec, options) : []), [tool, options]);

  const exhausted = !p.quota.unlimited && p.quota.remaining === 0;
  const block = tool ? runBlock(plan, file && fileKind ? { kind: fileKind } : null, exhausted) : 'unsupported';
  const toolName = (typeof params?.toolName === 'string' && params.toolName) || tool?.name || p.tool;

  // assistant_job_proposed: once per card.
  const proposed = React.useRef(false);
  React.useEffect(() => {
    if (proposed.current) return;
    proposed.current = true;
    track(EVENTS.ASSISTANT_JOB_PROPOSED, { surface: 'guide', tool: p.tool, quota_metric: p.quota.metric, queue_bucket: p.queueEstimate.bucket, has_file: !!file });
  }, [callId, file, p.queueEstimate.bucket, p.quota.metric, p.tool, track]);

  // ---- running ------------------------------------------------------------------------------
  const [running, setRunning] = React.useState(false);
  const [jobState, setJobState] = React.useState<ConversionJob | null>(null);
  const [resultOpen, setResultOpen] = React.useState(false);
  const previousSlug = React.useRef<string | null | undefined>(undefined);

  const started = (res: { jobId: string }) => {
    setJobState({ id: res.jobId, status: 'processing', originalFile: file ?? new File([], 'temp'), progress: 0 });
  };
  const convert = useConvertFile(started);
  const specialized = useSpecializedMediaTool(started);
  const transcribe = useTranscribeFile(started);
  const { data: polled } = useGetJobStatus(jobState);
  React.useEffect(() => {
    if (polled) setJobState((prev) => (prev ? { ...prev, ...polled } : null));
  }, [polled]);

  const status = jobState?.status;
  const failedUpload = running && !jobState && (convert.isError || specialized.isError || transcribe.isError);
  const failed = status === 'failed' || failedUpload;
  const done = status === 'completed';
  const uploading = running && !jobState && !failedUpload;
  const progress = Math.max(convert.uploadProgress, specialized.uploadProgress, transcribe.uploadProgress);

  // Job events in the hooks read the page's tool slug from the SDK context: point it at this
  // card's tool while the job runs, then put the page's own slug back.
  React.useEffect(() => {
    if (!running || !(done || failed)) return;
    if (previousSlug.current !== undefined) setContext({ tool_slug: previousSlug.current });
    previousSlug.current = undefined;
  }, [running, done, failed]);
  React.useEffect(
    () => () => {
      if (previousSlug.current !== undefined) setContext({ tool_slug: previousSlug.current });
    },
    [],
  );

  const start = () => {
    if (!plan || !file || block) return;
    track(EVENTS.ASSISTANT_JOB_CONFIRMED, { surface: 'guide', tool: p.tool, mode: 'run', quota_metric: p.quota.metric });
    previousSlug.current = getToolSlug();
    setContext({ tool_slug: p.tool });
    setRunning(true);
    if (plan.submit === 'convert') convert.mutate({ file, options: plan.request });
    else if (plan.submit === 'specialized') specialized.mutate({ file, options: plan.request });
    else transcribe.mutate({ file, options: plan.request });
  };

  const href = actionHref('open_tool', { slug: p.tool, route: p.route, options }, locale);
  const open = () => {
    if (!href) return;
    track(EVENTS.ASSISTANT_JOB_CONFIRMED, { surface: 'guide', tool: p.tool, mode: 'open', quota_metric: p.quota.metric });
    onOpen(href);
  };

  // ---- words (all localized; values and labels from the option schema) -----------------------
  const fieldLabel = (name: string, fallback: string) => t(`assistant.jobCard.fields.${name}`, { defaultValue: fallback });
  const unitLabel = (u: string) => t(`assistant.jobCard.units.${u}`, { defaultValue: u });
  const valueLabel = (row: { value: string | number | boolean; isEnum: boolean }) => {
    if (typeof row.value === 'boolean') return t(row.value ? 'assistant.jobCard.on' : 'assistant.jobCard.off');
    if (row.isEnum && typeof row.value === 'string' && !CODE_VALUES.has(row.value) && !/^[0-9.]+$/.test(row.value)) {
      return t(`assistant.jobCard.values.${valueKey(row.value)}`, { defaultValue: row.value });
    }
    return String(row.value);
  };

  const quotaWord = t(p.quota.metric === 'ai_ops' ? 'assistant.jobCard.quota.spendAi' : 'assistant.jobCard.quota.spendOps');
  const quotaLeft = p.quota.unlimited
    ? t('assistant.jobCard.quota.unlimited')
    : p.quota.remaining !== undefined && p.quota.limit !== undefined
      ? t('assistant.jobCard.quota.left', { remaining: p.quota.remaining, limit: p.quota.limit })
      : p.quota.limit !== undefined
        ? t('assistant.jobCard.quota.limit', { limit: p.quota.limit })
        : null;

  const noteKey = !tool ? null : block === 'no_file' ? 'needFile' : block === 'wrong_kind' ? 'wrongKind' : block === 'unsupported' ? 'unsupported' : block === 'quota_exhausted' ? 'exhausted' : null;

  const descriptor = done && jobState && plan && file
    ? describeResult({ job: jobState, originalFile: file, mode: plan.submit === 'transcribe' ? 'transcribe' : 'convert', kindHint: 'video', fallbackFileName: resultFileName(plan, file) })
    : null;

  return (
    <div className="space-y-3 rounded-lg border border-primary/40 bg-surface-1 p-3 text-sm" data-testid="medi-job-card" data-tool={p.tool} data-state={done ? 'done' : failed ? 'failed' : running ? 'running' : 'proposed'}>
      <div>
        <p className="font-medium">{t('assistant.jobCard.heading', { tool: toolName })}</p>
        <p className="text-xs text-muted-foreground">{t('assistant.jobCard.nothingRuns', b)}</p>
      </div>

      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t('assistant.jobCard.settings')}</p>
        {rows.length === 0 ? (
          <p className="text-muted-foreground">{t('assistant.jobCard.defaults')}</p>
        ) : (
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1" data-testid="medi-job-settings">
            {rows.map((r) => (
              <React.Fragment key={r.name}>
                <dt className="text-muted-foreground">{fieldLabel(r.name, r.label)}</dt>
                <dd className="num font-medium">
                  {valueLabel(r)}
                  {r.unit && typeof r.value === 'number' ? ` ${unitLabel(r.unit)}` : ''}
                </dd>
              </React.Fragment>
            ))}
          </dl>
        )}
      </div>

      <ul className="space-y-0.5 text-xs" data-testid="medi-job-costs">
        <li>{quotaWord}</li>
        {quotaLeft ? <li className="text-muted-foreground">{quotaLeft}</li> : null}
        <li className="text-muted-foreground" data-testid="medi-job-queue">
          {t(`assistant.jobCard.queue.${p.queueEstimate.bucket}`)}
        </li>
      </ul>

      {file ? (
        <p className="truncate text-xs text-muted-foreground" data-testid="medi-job-file">
          {t('assistant.jobCard.file', { name: file.name })}
        </p>
      ) : null}
      {noteKey && !running ? <p className="text-xs text-muted-foreground">{t(`assistant.jobCard.notes.${noteKey}`)}</p> : null}

      {uploading || (status === 'processing' && !done) ? (
        <div role="status" className="space-y-1" data-testid="medi-job-progress">
          <p className="flex items-center gap-2 text-xs">
            <Loader2 className="size-3 animate-spin" />
            {jobState ? t('assistant.jobCard.working') : t('assistant.jobCard.uploading', { percent: progress })}
            {jobState?.progress ? ` · ${jobState.progress}%` : ''}
          </p>
          <div className="h-1.5 w-full rounded-full bg-muted">
            <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${jobState?.progress || progress || 0}%` }} />
          </div>
        </div>
      ) : null}

      {done && descriptor ? (
        <div className="flex flex-wrap items-center gap-2" data-testid="medi-job-done">
          <span className="flex items-center gap-1 text-xs font-medium"><CheckCircle2 className="size-4 text-primary" />{t('assistant.jobCard.done')}</span>
          <button type="button" className="min-h-11 rounded-md border border-primary/40 bg-primary/10 px-3 text-sm font-medium hover:bg-primary/20" onClick={() => setResultOpen(true)}>
            {t('assistant.jobCard.viewResult')}
          </button>
          <ResultPanel variant="modal" open={resultOpen} onOpenChange={setResultOpen} descriptor={descriptor} downloadFileName={resultFileName(plan!, file!)} />
        </div>
      ) : null}

      {failed ? (
        <p role="alert" className="text-xs text-destructive">
          {t('assistant.jobCard.failed')}
        </p>
      ) : null}

      {toolQ.isPending ? <Loader2 className="size-4 animate-spin text-muted-foreground" aria-label={t('assistant.guide.searching')} /> : null}
      {!toolQ.isPending && (!running || failed) ? (
        <div className="flex flex-wrap gap-2">
          {!block && !failed ? (
            <button type="button" data-testid="medi-job-start" className="min-h-11 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90" onClick={start}>
              {t('assistant.jobCard.start')}
            </button>
          ) : null}
          {href && (block || failed) ? (
            <button
              type="button"
              data-testid="medi-job-open"
              data-href={href}
              className={cn('min-h-11 rounded-md px-4 text-sm font-medium', 'bg-primary text-primary-foreground hover:opacity-90')}
              onClick={open}
            >
              {t('assistant.jobCard.open', { tool: toolName })}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
