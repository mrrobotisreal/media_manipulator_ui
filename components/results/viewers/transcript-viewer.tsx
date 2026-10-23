'use client';

import { useId, useMemo, useState } from 'react';
import { AlertTriangle, AudioLines, FileText, Languages, ShieldCheck, Sparkles } from 'lucide-react';
import { Segmented } from '@/components/darkroom/segmented';
import { useLocalization } from '@/i18n/useLocalization';
import { transcriptCues, renderTranscript, type TranscriptFormat } from '@/lib/results/transcriptFormats';
import type { Cue } from '@/lib/results/captions';
import type { ResultDescriptor } from '@/lib/results/describe';
import { useAnalysisResult, useTranscribeResult, type AnalysisResult, type TranscribeResult } from '@/lib/useTranscribeResult';
import { cn } from '@/lib/utils';
import {
  CopyAllButton,
  displayTime,
  Highlight,
  SearchBox,
  ShowMore,
  useChunk,
  useFollowScroll,
  useMediaSync,
  useOriginalMedia,
  useRowSearch,
} from './cue-tools';
import type { ViewerProps } from './types';

export interface TranscriptCallbacks {
  /** A cue timestamp was clicked and the original media was moved to its start. */
  onSeek?: (cue: Cue) => void;
  /** Copy-all succeeded; `format` is the format whose text was copied. */
  onCopy?: (format: TranscriptFormat) => void;
}

export interface TranscriptViewProps extends TranscriptCallbacks {
  result: TranscribeResult | null | undefined;
  analysis: AnalysisResult | null | undefined;
  isLoading: boolean;
  isAnalysisLoading: boolean;
  /** The user's uploaded media; enables click-to-seek when audio/video. */
  original?: ResultDescriptor['original'];
}

const safetyBadgeClasses = (rating?: string) => {
  switch ((rating || '').toLowerCase()) {
    case 'unsafe':
      return 'bg-destructive/15 text-destructive dark:bg-destructive/40 dark:text-destructive';
    case 'moderate':
      return 'bg-premium/10 text-premium dark:bg-premium/40 dark:text-premium';
    case 'safe':
      return 'bg-success/15 text-success  ';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const FORMATS: TranscriptFormat[] = ['vtt', 'srt', 'txt', 'json'];

export function TranscriptView({ result, analysis, isLoading, isAnalysisLoading, original, onSeek, onCopy }: TranscriptViewProps) {
  const { t, formatDuration } = useLocalization('interface');
  const groupName = useId();
  const [format, setFormat] = useState<TranscriptFormat | null>(null);
  const [raw, setRaw] = useState(false);

  const cues = useMemo(() => (result ? transcriptCues(result) : []), [result]);
  const texts = useMemo(() => cues.map((c) => c.text), [cues]);
  const search = useRowSearch(texts);
  const media = useOriginalMedia(original);
  const sync = useMediaSync(cues, media, onSeek);
  const scroll = useFollowScroll(sync.active, search.current);
  const chunk = useChunk(cues.length, search.current);

  if (isLoading && !result) {
    return <p className="text-card-foreground">{t('transcribeResultView.loading')}</p>;
  }
  if (!result) {
    return <p className="text-muted-foreground">{t('transcribeResultView.noResult')}</p>;
  }

  const activeFormat: TranscriptFormat = format ?? result.format;
  const showTranscript = result.hasSpeech && (result.transcriptText || (result.segments && result.segments.length > 0));
  const reviewing = analysis?.transcriptReview;
  const rendered = raw ? renderTranscript(result, activeFormat) : '';

  return (
    <div className="w-full max-w-4xl space-y-4 pr-2" data-testid="transcript-view">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-background rounded-lg border p-3">
        <div className="flex items-center gap-3 text-card-foreground">
          <AudioLines className="w-5 h-5 text-primary" />
          <div>
            <p className="font-semibold">{t('transcribeResultView.complete')}</p>
            <p className="text-xs text-muted-foreground">
              {t('transcribeResultView.outputFormat')} <span className="uppercase">{result.format}</span>
              {result.language && (
                <>
                  {' • '}
                  {t('transcribeResultView.language', { language: result.language })}
                </>
              )}
              {result.durationSeconds ? ` • ${t('transcribeResultView.duration', { duration: formatDuration(result.durationSeconds) })}` : ''}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {!result.hasAudio && (
            <span className="px-2 py-1 rounded-full bg-premium/10 text-premium text-xs flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {t('transcribeResultView.noAudioStream')}
            </span>
          )}
          {result.hasAudio && !result.hasSpeech && (
            <span className="px-2 py-1 rounded-full bg-premium/10 text-premium text-xs flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {t('transcribeResultView.noSpeech')}
            </span>
          )}
        </div>
      </header>

      {!showTranscript ? (
        <section className="bg-background border rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-card-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-premium" />
            {t('transcribeResultView.nothingToTranscribe')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {result.message || t('transcribeResultView.noTranscriptGenerated')}
          </p>
          {result.audioDescription && (
            <p className="text-sm text-card-foreground bg-muted/40 rounded-md p-2">
              {result.audioDescription}
            </p>
          )}
        </section>
      ) : (
        <section className="space-y-3 rounded-lg border bg-background p-4">
          <h3 className="flex items-center gap-2 font-semibold text-card-foreground">
            <FileText className="h-4 w-4 text-primary" />
            {t('transcribeResultView.transcriptHeader', { count: result.segments?.length ?? result.segmentCount })}
          </h3>
          {sync.player}
          <div className="flex flex-wrap items-center gap-2">
            <SearchBox search={search} className="min-w-48 flex-1" />
            <CopyAllButton getText={() => renderTranscript(result, activeFormat)} onCopy={() => onCopy?.(activeFormat)} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Segmented
              name={`${groupName}-format`}
              label={t('resultPanel.transcript.format')}
              value={activeFormat}
              onValueChange={setFormat}
              options={FORMATS.map((value) => ({ value, label: value.toUpperCase() }))}
              className="w-64"
            />
            <button
              type="button"
              aria-pressed={raw}
              onClick={() => setRaw((v) => !v)}
              className={cn('min-h-9 rounded-md border border-edge px-3 text-sm hover:bg-surface-2', raw && 'bg-surface-2')}
            >
              {t('resultPanel.transcript.rawPreview')}
            </button>
          </div>
          {raw ? (
            <pre
              data-testid="transcript-raw"
              className="max-h-[40dvh] overflow-auto whitespace-pre-wrap rounded-md bg-muted/30 p-3 text-sm text-card-foreground"
            >
              {rendered}
            </pre>
          ) : (
            <div ref={scroll.container} {...scroll.handlers} className="max-h-[40dvh] space-y-2 overflow-y-auto pr-2" data-testid="cue-list">
              {cues.slice(0, chunk.limit).map((cue, i) => {
                const isActive = sync.active === i;
                const isCurrentMatch = search.current === i;
                return (
                  <div
                    key={cue.index}
                    data-row={i}
                    data-active={isActive || undefined}
                    className={cn(
                      'rounded-md bg-muted/30 p-2 text-sm',
                      isActive && 'ring-1 ring-primary bg-primary/10',
                      isCurrentMatch && 'outline outline-2 outline-premium',
                    )}
                  >
                    <div className="mb-1 text-xs text-muted-foreground">
                      {sync.canSeek ? (
                        <button
                          type="button"
                          onClick={() => sync.seek(cue)}
                          aria-label={t('resultPanel.transcript.seekTo', { time: displayTime(cue.startMs) })}
                          className="num rounded px-1 text-primary underline-offset-2 hover:underline"
                        >
                          {formatDuration(cue.startMs / 1000)}
                        </button>
                      ) : (
                        <span className="num">{formatDuration(cue.startMs / 1000)}</span>
                      )}
                      {' → '}
                      <span className="num">{formatDuration(cue.endMs / 1000)}</span>
                    </div>
                    <div className="whitespace-pre-wrap text-card-foreground">
                      <Highlight text={cue.text} query={search.query} />
                    </div>
                  </div>
                );
              })}
              {chunk.hasMore && <ShowMore onClick={chunk.more} remaining={cues.length - chunk.limit} />}
            </div>
          )}
        </section>
      )}

      <details open className="group">
        <summary className="cursor-pointer text-sm font-medium text-card-foreground">
          {t('resultPanel.transcript.details')}
        </summary>
        <div className="mt-2">
      <section className="bg-background border rounded-lg p-4 space-y-2">
        <h3 className="font-semibold text-card-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-premium" />
          {t('transcribeResultView.aiSummaryTitle')}
        </h3>
        {isAnalysisLoading && !analysis && (
          <p className="text-sm text-muted-foreground">{t('transcribeResultView.analysisRunning')}</p>
        )}
        {analysis?.error && (
          <p className="text-sm text-destructive">{t('transcribeResultView.analysisError', { error: analysis.error })}</p>
        )}
        {reviewing ? (
          <div className="space-y-2 text-sm">
            {typeof reviewing.summary === 'string' && reviewing.summary && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{t('transcribeResultView.summary')}</p>
                <p className="text-card-foreground">{reviewing.summary}</p>
              </div>
            )}
            {typeof reviewing.extended_summary === 'string' && reviewing.extended_summary && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{t('transcribeResultView.extendedSummary')}</p>
                <p className="text-card-foreground">{reviewing.extended_summary}</p>
              </div>
            )}
            {Array.isArray(reviewing.main_topics) && reviewing.main_topics.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {reviewing.main_topics.map((topic, idx) => (
                  <span key={idx} className="px-2 py-1 bg-muted rounded text-xs text-card-foreground">
                    {topic}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2 items-center">
              {reviewing.content_safety && (
                <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${safetyBadgeClasses(reviewing.content_safety.rating)}`}>
                  <ShieldCheck className="w-3 h-3" />
                  {t('transcribeResultView.safetyBadge', { rating: reviewing.content_safety.rating || t('transcribeResultView.unknown') })}
                </span>
              )}
              {typeof reviewing.harmful_content === 'boolean' && (
                <span className={`text-xs px-2 py-1 rounded-full ${reviewing.harmful_content ? 'bg-destructive/15 text-destructive' : 'bg-success/15 text-success'}`}>
                  {reviewing.harmful_content ? t('transcribeResultView.harmfulFlagged') : t('transcribeResultView.harmfulNone')}
                </span>
              )}
              {typeof reviewing.sentiment_label === 'string' && reviewing.sentiment_label && (
                <span className="text-xs px-2 py-1 rounded-full bg-muted text-card-foreground">
                  {t('transcribeResultView.sentimentBadge', { label: reviewing.sentiment_label })}
                </span>
              )}
              {typeof reviewing.language === 'string' && reviewing.language && (
                <span className="text-xs px-2 py-1 rounded-full bg-muted text-card-foreground flex items-center gap-1">
                  <Languages className="w-3 h-3" />
                  {reviewing.language}
                </span>
              )}
            </div>
            {reviewing.content_safety?.concerns && (
              <p className="text-xs text-muted-foreground italic">
                {t('transcribeResultView.notesLabel', { notes: reviewing.content_safety.concerns })}
              </p>
            )}
            {Array.isArray(reviewing.harmful_content_reasons) && reviewing.harmful_content_reasons.length > 0 && (
              <ul className="text-xs text-muted-foreground list-disc pl-5">
                {reviewing.harmful_content_reasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          !isAnalysisLoading && !analysis?.error && (
            <p className="text-sm text-muted-foreground">
              {analysis?.audioDescription || t('transcribeResultView.summaryPending')}
            </p>
          )
        )}
      </section>
        </div>
      </details>
    </div>
  );
}

/**
 * Registry viewer for `transcript` results: fetches the `/transcript/:id` sidecar (and the
 * analysis review) for the job itself, so it runs wherever a ResultPanel does.
 */
export function TranscriptViewer({ descriptor, onSeek, onCopy }: ViewerProps & TranscriptCallbacks) {
  const { data: result, isLoading, isError } = useTranscribeResult(descriptor.jobId, true);
  const { data: analysis, isLoading: isAnalysisLoading } = useAnalysisResult(descriptor.jobId, true);
  return (
    <TranscriptView
      result={isError ? null : result}
      analysis={analysis}
      isLoading={isLoading}
      isAnalysisLoading={isAnalysisLoading}
      original={descriptor.original}
      onSeek={onSeek}
      onCopy={onCopy}
    />
  );
}

export default TranscriptViewer;
