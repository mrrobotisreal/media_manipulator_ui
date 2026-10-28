'use client';

import { useMemo, useState } from 'react';
import { Download, FileJson, Info, Languages, ScrollText } from 'lucide-react';
import { useLocalization } from '@/i18n/useLocalization';
import type { Cue } from '@/lib/results/captions';
import type { ResultDescriptor } from '@/lib/results/describe';
import { saveBlobToDisk } from '@/lib/results/save';
import { formatClock, renderSummaryMarkdown } from '@/lib/results/summary';
import type { VideoSummary } from '@/lib/summarizeTypes';
import { useSummaryResult } from '@/lib/useSummarize';
import { cn } from '@/lib/utils';
import { CopyAllButton, useMediaSync, useOriginalMedia } from './cue-tools';
import type { ViewerProps } from './types';

/**
 * The `summary` result kind (MM75 decision 3, design VIDEO_SUMMARY.md §2/§5): the MM74
 * summary rendered as a document. Title and summary, a chapter list whose timestamps seek the
 * original (the same `onSeek` contract and sticky player as the transcript and captions
 * viewers), topics as chips, on-screen text with first-seen times, the picture and speech
 * paragraphs, caveats as a quiet note, Copy as Markdown (byte-identical to the server's
 * summary.md) and Download .md / .json. Every field is optional: what exists renders.
 */

/** Lists longer than this collapse behind "Show all" (long chapter / OCR lists on mobile). */
export const SUMMARY_LIST_PREVIEW = 8;

export interface SummaryViewProps {
  summary: VideoSummary | null | undefined;
  isLoading: boolean;
  isError?: boolean;
  original?: ResultDescriptor['original'];
  /** Base name for the downloads (`<base>_summary.md`). */
  baseName?: string;
  /** A chapter or on-screen-text timestamp moved the original; `start` is in seconds. */
  onSeek?: (start: number) => void;
}

function Collapsible<T>({ items, render }: { items: T[]; render: (item: T, i: number) => React.ReactNode }) {
  const { t } = useLocalization('interface');
  const [open, setOpen] = useState(false);
  const long = items.length > SUMMARY_LIST_PREVIEW;
  const shown = long && !open ? items.slice(0, SUMMARY_LIST_PREVIEW) : items;
  return (
    <>
      {shown.map(render)}
      {long ? (
        <li>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-1 rounded-md border border-edge px-3 py-1.5 text-sm text-foreground hover:bg-surface-2"
          >
            {open ? t('resultPanel.summary.showLess') : t('resultPanel.summary.showAll', { count: items.length })}
          </button>
        </li>
      ) : null}
    </>
  );
}

function Section({ title, children, testId }: { title: string; children: React.ReactNode; testId: string }) {
  return (
    <section className="space-y-2" data-testid={testId}>
      <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</h4>
      {children}
    </section>
  );
}

export function SummaryView({ summary, isLoading, original, baseName = 'summary', onSeek }: SummaryViewProps) {
  const { t } = useLocalization('interface');
  const media = useOriginalMedia(original);
  // The chapters double as cues for the shared sticky player: active-chapter highlight + seek.
  const cues = useMemo<Cue[]>(
    () =>
      (summary?.chapters ?? []).map((ch, i) => ({
        index: i + 1,
        startMs: ch.start * 1000,
        endMs: Math.max(ch.end, ch.start) * 1000,
        text: ch.title,
      })),
    [summary],
  );
  const sync = useMediaSync(cues, media, (cue) => onSeek?.(cue.startMs / 1000));
  const seekTo = (start: number) =>
    sync.seek({ index: 0, startMs: start * 1000, endMs: start * 1000, text: '' });

  if (isLoading && !summary) {
    return <p role="status" className="text-muted-foreground">{t('resultPanel.summary.loading')}</p>;
  }
  if (!summary) {
    return <p className="text-muted-foreground">{t('resultPanel.summary.loadFailed')}</p>;
  }

  const markdown = () => renderSummaryMarkdown(summary);
  const time = (sec: number) =>
    sync.canSeek ? (
      <button
        type="button"
        onClick={() => seekTo(sec)}
        aria-label={t('resultPanel.summary.seekTo', { time: formatClock(sec) })}
        className="num rounded px-1 text-primary underline-offset-2 hover:underline"
      >
        {formatClock(sec)}
      </button>
    ) : (
      <span className="num px-1">{formatClock(sec)}</span>
    );

  return (
    <article className="w-full max-w-4xl space-y-5 text-start" data-testid="summary-view">
      <header className="space-y-2">
        <h3 className="flex items-start gap-2 text-xl font-semibold text-foreground">
          <ScrollText aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
          <span>{summary.title || t('resultPanel.summary.untitled')}</span>
        </h3>
        {summary.language ? (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Languages aria-hidden="true" className="size-3" />
            {t('resultPanel.summary.language', { language: summary.language })}
          </p>
        ) : null}
        {summary.summary ? <p className="leading-relaxed text-card-foreground">{summary.summary}</p> : null}
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <CopyAllButton getText={markdown} label={t('resultPanel.summary.copyMarkdown')} />
        <button
          type="button"
          onClick={() => saveBlobToDisk(new Blob([markdown()], { type: 'text/markdown' }), `${baseName}_summary.md`)}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-edge px-3 text-sm text-foreground hover:bg-surface-2"
        >
          <Download aria-hidden="true" className="size-4" />
          {t('resultPanel.summary.downloadMd')}
        </button>
        <button
          type="button"
          onClick={() =>
            saveBlobToDisk(new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' }), `${baseName}_summary.json`)
          }
          className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-edge px-3 text-sm text-foreground hover:bg-surface-2"
        >
          <FileJson aria-hidden="true" className="size-4" />
          {t('resultPanel.summary.downloadJson')}
        </button>
      </div>

      {summary.chapters.length > 0 ? (
        <Section title={t('resultPanel.summary.chapters')} testId="summary-chapters">
          {sync.player}
          <ol className="space-y-2">
            <Collapsible
              items={summary.chapters}
              render={(ch, i) => (
                <li
                  key={`${ch.start}-${i}`}
                  data-active={sync.active === i || undefined}
                  className={cn('rounded-md bg-muted/30 p-2 text-sm', sync.active === i && 'bg-primary/10 ring-1 ring-primary')}
                >
                  <div className="text-xs text-muted-foreground">
                    {time(ch.start)}
                    {' – '}
                    <span className="num">{formatClock(ch.end)}</span>
                  </div>
                  <p className="font-medium text-card-foreground">{ch.title}</p>
                  {ch.description ? <p className="text-muted-foreground">{ch.description}</p> : null}
                </li>
              )}
            />
          </ol>
        </Section>
      ) : null}

      {summary.topics.length > 0 ? (
        <Section title={t('resultPanel.summary.topics')} testId="summary-topics">
          <ul className="flex flex-wrap gap-1.5">
            {summary.topics.map((topic, i) => (
              <li key={`${topic}-${i}`} className="rounded-full bg-muted px-2.5 py-1 text-xs text-card-foreground">
                {topic}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {summary.onScreenText.length > 0 ? (
        <Section title={t('resultPanel.summary.onScreenText')} testId="summary-onscreen">
          <ul className="space-y-1 text-sm">
            <Collapsible
              items={summary.onScreenText}
              render={(o, i) => (
                <li key={`${o.firstSeen}-${i}`} className="flex gap-2">
                  <span className="shrink-0 text-xs text-muted-foreground">{time(o.firstSeen)}</span>
                  <span className="text-card-foreground">{o.text}</span>
                </li>
              )}
            />
          </ul>
        </Section>
      ) : null}

      {summary.visual ? (
        <Section title={t('resultPanel.summary.visual')} testId="summary-visual">
          <p className="text-sm text-card-foreground">{summary.visual}</p>
        </Section>
      ) : null}
      {summary.speech ? (
        <Section title={t('resultPanel.summary.speech')} testId="summary-speech">
          <p className="text-sm text-card-foreground">{summary.speech}</p>
        </Section>
      ) : null}

      {summary.caveats.length > 0 ? (
        <aside data-testid="summary-caveats" className="flex gap-2 rounded-md border border-edge bg-surface-1 p-3 text-xs text-muted-foreground">
          <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          <div>
            <p className="font-medium">{t('resultPanel.summary.notes')}</p>
            <ul className="list-disc ps-4">
              {summary.caveats.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </aside>
      ) : null}
    </article>
  );
}

const baseNameOf = (descriptor: ResultDescriptor): string => {
  const name = descriptor.original?.file?.name ?? descriptor.original?.fileName ?? '';
  const base = name.replace(/\.[^.]+$/, '').trim();
  return base || 'video';
};

/**
 * Registry viewer: fetches summary.json for the job itself (needsBlob: false), and reports a
 * seek to the panel's analytics in the cue shape the other text viewers use.
 */
export function SummaryViewer({ descriptor, onSeek }: ViewerProps) {
  const { data, isLoading, isError } = useSummaryResult(descriptor.jobId, true);
  return (
    <SummaryView
      summary={isError ? null : data}
      isLoading={isLoading}
      isError={isError}
      original={descriptor.original}
      baseName={baseNameOf(descriptor)}
      onSeek={(start) => onSeek?.({ index: 0, startMs: start * 1000, endMs: start * 1000, text: '' })}
    />
  );
}

export default SummaryViewer;
