'use client';

import React, { useId, useState } from 'react';
import { Check, CircleAlert, CircleDashed, CircleMinus, Loader2, LogIn, Sparkles } from 'lucide-react';
import type { ConversionJob } from '@/lib/useGetJobStatus';
import SpecializedToolShell from '@/components/specialized-tool-shell';
import { Segmented } from '@/components/darkroom/segmented';
import { useLocalization } from '@/i18n/useLocalization';
import { locales } from '@/i18n/locales';
import { useAuth } from '@/lib/auth/AuthProvider';
import { QuotaExceededError } from '@/lib/auth/authedFetch';
import {
  canUseDeep,
  SummarizeStartError,
  summaryStages,
  useSummarize,
  useSummarizeCapabilities,
  type SummaryStageRow,
} from '@/lib/useSummarize';
import { framesFromStages, useSummaryGenerated } from '@/lib/summaryAnalytics';
import type { SummarizeCapabilities, SummaryDepth } from '@/lib/summarizeTypes';
import { cn } from '@/lib/utils';

/**
 * The video / audio summary panel (MM75 decision 2, design VIDEO_SUMMARY.md §5) for the
 * `summarize_video` and `summarize_audio` tasks, on SpecializedToolShell.
 *
 * What the visitor sees depends on three facts, in this order:
 *   1. capabilities: `enabled: false` (or the capabilities call failing) is an honest
 *      "temporarily unavailable", never a start button that cannot work (decision 10);
 *   2. the tier: anonymous gets a sign-in prompt through the existing `openAuth` instead of
 *      the start button (the API's 403 `signin_required` is the backstop, not the happy path);
 *      a signed-in tier whose frame budget is 0 is told the plan does not include it;
 *   3. otherwise the shell with the summary options, and once a job runs, the six-stage list.
 * The depth toggle exists only when deep synthesis is up AND the tier is in `deepTiers`.
 */

export interface SummarizePanelProps {
  /** `summarize_video` takes video or audio; `summarize_audio` takes audio only. */
  task: 'summarize_video' | 'summarize_audio';
}

type PanelGate = 'loading' | 'unavailable' | 'signin' | 'not_in_plan' | 'ready';

/** Which state the panel is in; pure so the gating rules are tested without rendering. */
export function summarizeGate(args: {
  capsLoading: boolean;
  capsError: boolean;
  caps: SummarizeCapabilities | undefined;
  authLoading: boolean;
  /** null outside the AuthProvider (the chromeless /embed tree): nobody can sign in there. */
  tier: string | null;
}): PanelGate {
  if (args.capsLoading || args.authLoading) return 'loading';
  if (args.capsError || !args.caps || !args.caps.enabled) return 'unavailable';
  if (args.tier === null || args.tier === 'anonymous') return 'signin';
  if (args.tier === 'operator') return 'ready';
  const budget = args.caps.maxFramesByTier[args.tier as 'free' | 'premium' | 'pro'];
  return typeof budget === 'number' && budget <= 0 ? 'not_in_plan' : 'ready';
}

/** The tier the deep rule is checked against: operator inherits Pro's row (internal/tiers). */
const deepTierOf = (tier: string) => (tier === 'operator' ? 'pro' : tier);

const STAGE_ICON: Record<SummaryStageRow['status'], React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>> = {
  pending: CircleDashed,
  processing: Loader2,
  completed: Check,
  skipped: CircleMinus,
  failed: CircleAlert,
};

export function SummaryStageList({ job }: { job: Pick<ConversionJob, 'stages'> | null }) {
  const { t } = useLocalization('interface');
  const rows = summaryStages(job);
  const frames = framesFromStages(job?.stages);
  return (
    <section aria-label={t('summarize.stagesTitle')} className="rounded-lg border border-edge bg-surface-1 p-3">
      <h3 className="mb-2 text-sm font-medium text-card-foreground">{t('summarize.stagesTitle')}</h3>
      <ol className="space-y-1.5" data-testid="summary-stages">
        {rows.map((row) => {
          const Icon = STAGE_ICON[row.status];
          return (
            <li
              key={row.key}
              data-stage={row.key}
              data-status={row.status}
              aria-current={row.active ? 'step' : undefined}
              className={cn(
                'flex items-center gap-2 text-sm',
                row.active ? 'font-medium text-foreground' : 'text-muted-foreground',
                row.status === 'failed' && 'text-destructive',
              )}
            >
              <Icon
                aria-hidden={true}
                className={cn(
                  'size-4 shrink-0',
                  row.status === 'processing' && 'animate-spin text-primary motion-reduce:animate-none',
                  row.status === 'completed' && 'text-success',
                )}
              />
              <span>{t(`summarize.stages.${row.key}`)}</span>
              <span className="sr-only">{t(`summarize.status.${row.status}`)}</span>
              {row.key === 'frames' && row.status === 'completed' && frames > 0 ? (
                <span className="num ms-auto text-xs text-muted-foreground">{t('summarize.framesCount', { count: frames })}</span>
              ) : null}
              {row.status === 'skipped' ? (
                <span className="ms-auto text-xs text-muted-foreground">{t('summarize.status.skipped')}</span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Notice({ children, testId }: { children: React.ReactNode; testId: string }) {
  return (
    <div data-testid={testId} className="rounded-lg border border-border bg-background/40 p-6 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

const SummarizePanel: React.FC<SummarizePanelProps> = ({ task }) => {
  const { t, language } = useLocalization('interface');
  const auth = useAuth();
  const caps = useSummarizeCapabilities();
  const groupName = useId();
  const [conversionJob, setConversionJob] = useState<ConversionJob | null>(null);
  // The page locale is the default and follows a language switch until the visitor picks one.
  const [pickedLanguage, setPickedLanguage] = useState<string | null>(null);
  const outputLanguage = pickedLanguage ?? language?.code ?? 'en-US';
  const [depth, setDepth] = useState<SummaryDepth>('standard');

  const summarize = useSummarize((res) => {
    setConversionJob({ id: res.jobId, status: 'processing', originalFile: new File([], 'temp'), progress: 0 });
  });

  // MM75 analytics: one summary_generated per completed job.
  useSummaryGenerated(conversionJob);

  const tier = auth ? auth.tier : null;
  const gate = summarizeGate({
    capsLoading: caps.isLoading,
    capsError: caps.isError,
    caps: caps.data,
    authLoading: !!auth?.loading,
    tier,
  });
  const startError = summarize.error;
  const signInRefused = startError instanceof SummarizeStartError && startError.code === 'signin_required';
  const openSignIn = () => auth?.openAuth({ intent: 'signin', source: 'summarize_panel' });

  if (gate === 'loading') return <Notice testId="summarize-loading">{t('summarize.loading')}</Notice>;
  if (gate === 'unavailable') return <Notice testId="summarize-unavailable">{t('summarize.unavailable')}</Notice>;
  if (gate === 'not_in_plan') return <Notice testId="summarize-not-in-plan">{t('summarize.notInPlan')}</Notice>;
  if (gate === 'signin' || signInRefused) {
    return (
      <div data-testid="summarize-signin" className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-6 text-center">
        <p className="font-medium text-card-foreground">{t('summarize.signIn.title')}</p>
        <p className="text-sm text-muted-foreground">{t('summarize.signIn.body')}</p>
        {auth ? (
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={openSignIn}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 py-2 text-primary-foreground transition-colors hover:bg-[var(--accent-primary-hover)]"
            >
              <LogIn aria-hidden="true" className="size-4" />
              {t('summarize.signIn.button')}
            </button>
            <button
              type="button"
              onClick={() => auth.openAuth({ intent: 'signup', source: 'summarize_panel' })}
              className="inline-flex min-h-11 items-center rounded-lg border border-edge px-5 py-2 text-sm text-foreground transition-colors hover:bg-surface-2"
            >
              {t('summarize.signIn.signup')}
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  const capabilities = caps.data!;
  const showDepth = canUseDeep(capabilities, deepTierOf(tier ?? 'anonymous'));
  const budget = tier === 'operator' ? undefined : capabilities.maxFramesByTier[tier as 'free' | 'premium' | 'pro'];
  // The API's list ("auto" + codes) decides what is offered; the registry gives native labels.
  const offered = new Set(capabilities.outputLanguages);
  const languageOptions = locales.filter((l) => offered.size === 0 || offered.has(l.code));
  const errorKey =
    startError instanceof SummarizeStartError
      ? `summarize.errors.${startError.code}`
      : startError instanceof QuotaExceededError
        ? 'summarize.errors.quota_exceeded'
        : startError
          ? 'summarize.errors.unknown'
          : null;
  const running = !!conversionJob && conversionJob.status !== 'completed';

  return (
    <SpecializedToolShell
      accept={task === 'summarize_audio' ? 'audio/*' : 'video/*,audio/*'}
      uploadHint={t(task === 'summarize_audio' ? 'summarize.uploadHintAudio' : 'summarize.uploadHintVideo')}
      conversionJob={conversionJob}
      setConversionJob={setConversionJob}
      isUploading={summarize.isPending}
      uploadProgress={summarize.uploadProgress}
      outputExtensionHint="md"
      quotaTask={task}
      resultTask={task}
      renderForm={({ file, isProcessing }) => (
        <div className="space-y-4">
          {!conversionJob ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                summarize.start({ file, options: { outputLanguage, depth: showDepth ? depth : 'standard' } });
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor={`${groupName}-lang`} className="mb-1 block text-sm font-medium text-card-foreground">
                  {t('summarize.outputLanguage')}
                </label>
                <select
                  id={`${groupName}-lang`}
                  value={outputLanguage}
                  onChange={(e) => setPickedLanguage(e.target.value)}
                  disabled={isProcessing}
                  className="w-full rounded-lg border border-input bg-input p-2 text-card-foreground"
                >
                  <option value="auto">{t('summarize.sameAsSpeech')}</option>
                  {languageOptions.map((l) => (
                    <option key={l.code} value={l.code} lang={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              {showDepth ? (
                <div data-testid="summarize-depth">
                  <Segmented
                    name={`${groupName}-depth`}
                    label={t('summarize.depth.label')}
                    value={depth}
                    onValueChange={setDepth}
                    options={[
                      { value: 'standard', label: t('summarize.depth.standard') },
                      { value: 'deep', label: t('summarize.depth.deep') },
                    ]}
                    className="w-64"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">{t('summarize.depth.hint')}</p>
                </div>
              ) : null}

              <p className="text-xs text-muted-foreground">
                {typeof budget === 'number' && budget > 0
                  ? t('summarize.noteFrames', { frames: budget })
                  : t('summarize.note')}
              </p>

              {errorKey ? (
                <p role="alert" className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                  {t(errorKey)}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isProcessing}
                data-testid="summarize-start"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-primary-foreground transition-colors hover:bg-[var(--accent-primary-hover)] disabled:opacity-60"
              >
                <Sparkles aria-hidden="true" className="size-4" />
                {t('summarize.start')}
              </button>
            </form>
          ) : null}
          {running ? <SummaryStageList job={conversionJob} /> : null}
        </div>
      )}
    />
  );
};

export default SummarizePanel;
