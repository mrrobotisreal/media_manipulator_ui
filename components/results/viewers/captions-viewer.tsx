'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Stat } from '@/components/darkroom/stat';
import { useLocalization } from '@/i18n/useLocalization';
import { formatCaptions, formatTimestamp, parseCaptions, type CaptionFormat, type Cue } from '@/lib/results/captions';
import { cn } from '@/lib/utils';
import { CopyAllButton, Highlight, SearchBox, ShowMore, useChunk, useFollowScroll, useMediaSync, useOriginalMedia, useRowSearch } from './cue-tools';
import { UnknownViewer } from './unknown-viewer';
import type { TranscriptCallbacks } from './transcript-viewer';
import type { ViewerProps } from './types';

/** Captions larger than this are not parsed in the browser; the file card is shown. */
export const MAX_CAPTION_BYTES = 5 * 1024 * 1024;
/** Cue start times further apart than this are flagged "timing differs". */
export const TIMING_TOLERANCE_MS = 250;

export interface CaptionRow {
  index: number;
  source?: Cue;
  translated?: Cue;
  timingDiffers: boolean;
}

/** Pairs source and translated cues by position; extra cues pair with an empty side. */
export function alignCues(source: readonly Cue[], translated: readonly Cue[]): CaptionRow[] {
  const rows: CaptionRow[] = [];
  const n = Math.max(source.length, translated.length);
  for (let i = 0; i < n; i++) {
    const s = source[i];
    const tr = translated[i];
    const timingDiffers =
      !!s && !!tr && (Math.abs(s.startMs - tr.startMs) > TIMING_TOLERANCE_MS || Math.abs(s.endMs - tr.endMs) > TIMING_TOLERANCE_MS);
    rows.push({ index: i + 1, source: s, translated: tr, timingDiffers });
  }
  return rows;
}

const isCaptionFile = (name: string | undefined) => /\.(srt|vtt)$/i.test(name ?? '');
const extHint = (name: string): CaptionFormat => (/\.vtt$/i.test(name) ? 'vtt' : 'srt');

type Loaded = { key: string; text: string } | { key: string; error: true };

function useBlobText(blob: Blob | null, key: string): Loaded | null {
  const [state, setState] = useState<Loaded | null>(null);
  useEffect(() => {
    if (!blob) return;
    let cancelled = false;
    blob.text().then(
      (text) => !cancelled && setState({ key, text }),
      () => !cancelled && setState({ key, error: true }),
    );
    return () => {
      cancelled = true;
    };
  }, [blob, key]);
  return state && state.key === key ? state : null;
}

/**
 * Registry viewer for `captions` results (.srt/.vtt): a cue table with search and copy, and
 * for the caption translator a source-versus-translation two-column view.
 */
export function CaptionsViewer(props: ViewerProps & TranscriptCallbacks) {
  const { blob, fileName, descriptor, onSeek, onCopy } = props;
  const { t } = useLocalization('interface');
  const tooBig = !!blob && blob.size > MAX_CAPTION_BYTES;

  const original = descriptor.original;
  const sourceFile = original?.file && isCaptionFile(original.file.name) && original.file.size <= MAX_CAPTION_BYTES ? original.file : null;

  const resultText = useBlobText(tooBig ? null : blob, descriptor.jobId);
  const sourceText = useBlobText(sourceFile, `${descriptor.jobId}:source:${sourceFile?.name ?? ''}`);

  const result = useMemo(() => (resultText && 'text' in resultText ? parseCaptions(resultText.text, extHint(fileName)) : null), [resultText, fileName]);
  const source = useMemo(
    () => (sourceFile && sourceText && 'text' in sourceText ? parseCaptions(sourceText.text, extHint(sourceFile.name)) : null),
    [sourceText, sourceFile],
  );

  const cues = useMemo(() => result?.cues ?? [], [result]);
  const twoColumn = !!sourceFile && !!source;
  const rows = useMemo(() => alignCues(source?.cues ?? [], cues), [source, cues]);
  const texts = useMemo(
    () => (twoColumn ? rows.map((r) => `${r.source?.text ?? ''}\n${r.translated?.text ?? ''}`) : cues.map((c) => c.text)),
    [twoColumn, rows, cues],
  );
  const search = useRowSearch(texts);
  const media = useOriginalMedia(original);
  const sync = useMediaSync(cues, media, onSeek);
  const scroll = useFollowScroll(sync.active, search.current);
  const rowCount = twoColumn ? rows.length : cues.length;
  const chunk = useChunk(rowCount, search.current);

  if (tooBig) return <UnknownViewer {...props} />;
  if (resultText && 'error' in resultText) return <UnknownViewer {...props} />;
  if (!result) {
    return <p role="status" className="text-muted-foreground">{t('resultPanel.loading')}</p>;
  }

  const format = result.format;
  const warnings = result.warnings.length + (source?.warnings.length ?? 0);
  const countMismatch = twoColumn && source!.cues.length !== cues.length;
  const hasSettings = format === 'vtt';

  const timeCell = (cue: Cue | undefined) =>
    cue ? (
      <span className="num whitespace-nowrap text-xs text-muted-foreground">
        {formatTimestamp(cue.startMs, format)} → {formatTimestamp(cue.endMs, format)}
      </span>
    ) : null;

  return (
    <div className="w-full max-w-4xl space-y-3" data-testid="captions-view">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <Stat label={t('resultPanel.captions.cues')} value={cues.length} />
        {twoColumn && <Stat label={t('resultPanel.captions.sourceCues')} value={source!.cues.length} />}
        {warnings > 0 && <Stat label={t('resultPanel.captions.skipped')} value={warnings} accent="premium" />}
      </div>
      {countMismatch && (
        <p role="alert" className="flex items-center gap-2 rounded-md bg-premium/10 p-2 text-sm text-premium">
          <AlertTriangle aria-hidden="true" className="size-4 shrink-0" />
          {t('resultPanel.captions.countMismatch', { source: source!.cues.length, translated: cues.length })}
        </p>
      )}
      {sync.player}
      <div className="flex flex-wrap items-center gap-2">
        <SearchBox search={search} className="min-w-48 flex-1" />
        <CopyAllButton getText={() => formatCaptions(cues, format)} onCopy={() => onCopy?.(format)} />
      </div>

      <div ref={scroll.container} {...scroll.handlers} className="max-h-[50dvh] space-y-2 overflow-y-auto pr-2" data-testid="cue-list">
        {twoColumn && (
          <div className="hidden grid-cols-2 gap-3 text-xs font-medium uppercase tracking-wide text-muted-foreground md:grid">
            <span>{t('resultPanel.captions.source')}</span>
            <span>{t('resultPanel.captions.translated')}</span>
          </div>
        )}
        {twoColumn
          ? rows.slice(0, chunk.limit).map((row, i) => (
              <div
                key={row.index}
                data-row={i}
                data-testid="caption-row"
                className={cn('grid gap-2 rounded-md bg-muted/30 p-2 text-sm md:grid-cols-2 md:gap-3', search.current === i && 'outline outline-2 outline-premium')}
              >
                <div className="min-w-0">
                  <span className="num mr-2 text-xs text-muted-foreground">#{row.index}</span>
                  {timeCell(row.source)}
                  <div className="whitespace-pre-wrap text-card-foreground">{row.source ? <Highlight text={row.source.text} query={search.query} /> : <span className="text-muted-foreground">{t('resultPanel.captions.empty')}</span>}</div>
                </div>
                <div className="min-w-0">
                  {timeCell(row.translated)}
                  {row.timingDiffers && (
                    <span className="ml-2 rounded-full bg-premium/10 px-2 py-0.5 text-xs text-premium">{t('resultPanel.captions.timingDiffers')}</span>
                  )}
                  <div className="whitespace-pre-wrap text-card-foreground">{row.translated ? <Highlight text={row.translated.text} query={search.query} /> : <span className="text-muted-foreground">{t('resultPanel.captions.empty')}</span>}</div>
                </div>
              </div>
            ))
          : cues.slice(0, chunk.limit).map((cue, i) => (
              <div
                key={cue.index}
                data-row={i}
                data-testid="caption-row"
                data-active={sync.active === i || undefined}
                className={cn(
                  'grid grid-cols-[2.5rem_1fr] gap-x-3 rounded-md bg-muted/30 p-2 text-sm',
                  sync.active === i && 'bg-primary/10 ring-1 ring-primary',
                  search.current === i && 'outline outline-2 outline-premium',
                )}
              >
                <span className="num text-xs text-muted-foreground">{cue.index}</span>
                <div className="min-w-0">
                  <div className="num text-xs text-muted-foreground">
                    {sync.canSeek ? (
                      <button
                        type="button"
                        onClick={() => sync.seek(cue)}
                        aria-label={t('resultPanel.transcript.seekTo', { time: formatTimestamp(cue.startMs, 'display') })}
                        className="rounded text-primary underline-offset-2 hover:underline"
                      >
                        {formatTimestamp(cue.startMs, format)}
                      </button>
                    ) : (
                      formatTimestamp(cue.startMs, format)
                    )}
                    {' → '}
                    {formatTimestamp(cue.endMs, format)}
                    {hasSettings && cue.settings ? ` · ${cue.settings}` : ''}
                  </div>
                  <div className="whitespace-pre-wrap text-card-foreground">
                    <Highlight text={cue.text} query={search.query} />
                  </div>
                </div>
              </div>
            ))}
        {chunk.hasMore && <ShowMore onClick={chunk.more} remaining={rowCount - chunk.limit} />}
      </div>
    </div>
  );
}

export default CaptionsViewer;
