'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Check, ChevronDown, ChevronUp, Copy, Search } from 'lucide-react';
import { useLocalization } from '@/i18n/useLocalization';
import { copyText } from '@/lib/results/clipboard';
import { formatTimestamp, type Cue } from '@/lib/results/captions';
import type { ResultDescriptor } from '@/lib/results/describe';
import { cn } from '@/lib/utils';

/** Shared pieces of the transcript and captions viewers: search, copy, media sync, cue rows. */

/** Cue lists above this render in chunks of CHUNK with a "Show more" button. */
export const WINDOW_THRESHOLD = 2000;
export const CHUNK = 200;
/** After a manual scroll, active-cue following pauses this long. */
export const USER_SCROLL_HOLD_MS = 3000;

export function Highlight({ text, query }: { text: string; query: string }): ReactNode {
  const q = query.trim();
  if (!q) return text;
  const lower = text.toLowerCase();
  const needle = q.toLowerCase();
  const parts: ReactNode[] = [];
  let from = 0;
  let at = lower.indexOf(needle, from);
  while (at >= 0) {
    if (at > from) parts.push(text.slice(from, at));
    parts.push(<mark key={at} className="rounded-sm bg-premium/30 text-foreground">{text.slice(at, at + needle.length)}</mark>);
    from = at + needle.length;
    at = lower.indexOf(needle, from);
  }
  if (from < text.length) parts.push(text.slice(from));
  return <>{parts}</>;
}

/** Case-insensitive substring search over rows; `matches` are row indices. */
export function useRowSearch(texts: readonly string[]) {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as number[];
    const out: number[] = [];
    texts.forEach((text, i) => {
      if (text.toLowerCase().includes(q)) out.push(i);
    });
    return out;
  }, [query, texts]);
  const safeCursor = matches.length ? Math.min(cursor, matches.length - 1) : 0;
  const step = useCallback(
    (delta: 1 | -1) => setCursor((c) => (matches.length ? (Math.min(c, matches.length - 1) + delta + matches.length) % matches.length : 0)),
    [matches.length],
  );
  const update = useCallback((value: string) => {
    setQuery(value);
    setCursor(0);
  }, []);
  return { query, setQuery: update, matches, cursor: safeCursor, current: matches.length ? matches[safeCursor] : null, next: () => step(1), prev: () => step(-1) };
}

export function SearchBox({ search, className }: { search: ReturnType<typeof useRowSearch>; className?: string }) {
  const { t } = useLocalization('interface');
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (e.shiftKey) search.prev();
    else search.next();
  };
  return (
    <div className={cn('flex min-w-0 items-center gap-2 rounded-md border border-edge bg-surface-2 px-2', className)}>
      <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      <input
        type="search"
        value={search.query}
        onChange={(e) => search.setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={t('resultPanel.transcript.searchPlaceholder')}
        aria-label={t('resultPanel.transcript.search')}
        className="min-h-9 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
      {search.query.trim() && (
        <>
          <span role="status" className="num whitespace-nowrap text-xs text-muted-foreground">
            {search.matches.length
              ? t('resultPanel.transcript.matchCount', { current: search.cursor + 1, total: search.matches.length })
              : t('resultPanel.transcript.noMatches')}
          </span>
          <button type="button" onClick={search.prev} disabled={!search.matches.length} aria-label={t('resultPanel.transcript.prevMatch')} className="rounded p-1 text-muted-foreground hover:bg-surface-1 disabled:opacity-40">
            <ChevronUp aria-hidden="true" className="size-4" />
          </button>
          <button type="button" onClick={search.next} disabled={!search.matches.length} aria-label={t('resultPanel.transcript.nextMatch')} className="rounded p-1 text-muted-foreground hover:bg-surface-1 disabled:opacity-40">
            <ChevronDown aria-hidden="true" className="size-4" />
          </button>
        </>
      )}
    </div>
  );
}

/** Copy button whose label flips to "Copied" for two seconds. */
export function CopyAllButton({ getText, onCopy, label }: { getText: () => string; onCopy?: () => void; label?: string }) {
  const { t } = useLocalization('interface');
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const handle = async () => {
    const ok = await copyText(getText());
    if (!ok) return;
    onCopy?.();
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={() => void handle()}
      className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-edge px-3 text-sm text-foreground transition-colors hover:bg-surface-2"
    >
      {copied ? <Check aria-hidden="true" className="size-4 text-success" /> : <Copy aria-hidden="true" className="size-4" />}
      <span aria-live="polite">{copied ? t('resultPanel.transcript.copied') : (label ?? t('resultPanel.transcript.copyAll'))}</span>
    </button>
  );
}

/** Object URL for the original media when it is audio/video; null otherwise. */
export function useOriginalMedia(original: ResultDescriptor['original']): { url: string; kind: 'audio' | 'video' } | null {
  const kind = original?.kind === 'audio' || original?.kind === 'video' ? original.kind : null;
  const file = original?.file ?? null;
  const supplied = original?.objectUrl ?? null;
  const [made, setMade] = useState<{ file: File; url: string } | null>(null);
  useEffect(() => {
    if (!kind || supplied || !file) return;
    const url = URL.createObjectURL(file);
    setMade({ file, url });
    return () => URL.revokeObjectURL(url);
  }, [kind, supplied, file]);
  const url = supplied ?? (file && made?.file === file ? made.url : null);
  return kind && url ? { url, kind } : null;
}

/** Index of the cue playing at `ms` (last cue that has started and not ended), or -1. */
export function activeCueIndex(cues: readonly Pick<Cue, 'startMs' | 'endMs'>[], ms: number): number {
  let lo = 0;
  let hi = cues.length - 1;
  let found = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (cues[mid].startMs <= ms) {
      found = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return found >= 0 && ms < cues[found].endMs ? found : -1;
}

/** Sticky player bound to the original media; reports the active cue and seeks on request. */
export function useMediaSync(cues: readonly Cue[], media: { url: string; kind: 'audio' | 'video' } | null, onSeek?: (cue: Cue) => void) {
  const ref = useRef<HTMLMediaElement | null>(null);
  const [active, setActive] = useState(-1);
  const onTimeUpdate = useCallback(() => {
    const el = ref.current;
    if (el) setActive(activeCueIndex(cues, el.currentTime * 1000));
  }, [cues]);
  const seek = useCallback(
    (cue: Cue) => {
      const el = ref.current;
      if (!el) return;
      el.currentTime = cue.startMs / 1000;
      setActive(activeCueIndex(cues, cue.startMs));
      try {
        void el.play()?.catch(() => undefined);
      } catch {
        // autoplay refused or not implemented; the seek itself still applied
      }
      onSeek?.(cue);
    },
    [cues, onSeek],
  );
  const player = media ? (
    <div className="sticky top-0 z-10 rounded-md border border-edge bg-surface-1 p-2" data-testid="seek-player">
      {media.kind === 'video' ? (
        <video ref={(el) => { ref.current = el; }} src={media.url} controls onTimeUpdate={onTimeUpdate} className="max-h-60 w-full rounded" />
      ) : (
        <audio ref={(el) => { ref.current = el; }} src={media.url} controls onTimeUpdate={onTimeUpdate} className="w-full" />
      )}
    </div>
  ) : null;
  return { player, active, seek, canSeek: !!media };
}

/** Scroll container behaviour: follow `target` into view unless the user scrolled recently. */
export function useFollowScroll(target: number | null, force: number | null) {
  const container = useRef<HTMLDivElement | null>(null);
  const lastUser = useRef(0);
  const markUser = useCallback(() => { lastUser.current = Date.now(); }, []);
  const reveal = (index: number) => {
    const el = container.current?.querySelector<HTMLElement>(`[data-row="${index}"]`);
    el?.scrollIntoView?.({ block: 'nearest' });
  };
  useEffect(() => {
    if (target === null || target < 0) return;
    if (Date.now() - lastUser.current < USER_SCROLL_HOLD_MS) return;
    reveal(target);
  }, [target]);
  useEffect(() => {
    if (force === null) return;
    reveal(force);
  }, [force]);
  const handlers = { onWheel: markUser, onTouchMove: markUser, onPointerDown: markUser, onKeyDown: markUser };
  return { container, handlers };
}

/** Chunked rendering for very long lists. Returns how many rows to show. */
export function useChunk(total: number, mustShow: number | null) {
  const [extra, setExtra] = useState(0);
  const windowed = total > WINDOW_THRESHOLD;
  let limit = windowed ? CHUNK + extra : total;
  if (windowed && mustShow !== null && mustShow >= limit) limit = Math.ceil((mustShow + 1) / CHUNK) * CHUNK;
  limit = Math.min(limit, total);
  return { limit, hasMore: limit < total, more: () => setExtra(limit) };
}

export function ShowMore({ onClick, remaining }: { onClick: () => void; remaining: number }) {
  const { t } = useLocalization('interface');
  return (
    <button type="button" onClick={onClick} className="mx-auto mt-2 rounded-md border border-edge px-3 py-1.5 text-sm text-foreground hover:bg-surface-2">
      {t('resultPanel.transcript.showMore', { count: remaining })}
    </button>
  );
}

export const displayTime = (ms: number) => formatTimestamp(ms, 'display');
