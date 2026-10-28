'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ResultPanel } from '@/components/results/result-panel';
import { KIND_ICONS } from '@/components/results/viewers/unknown-viewer';
import { useLocalization } from '@/i18n/useLocalization';
import { retentionEvents } from '@/lib/analytics/retentionEvents';
import { authedFetch } from '@/lib/auth/authedFetch';
import { useAuth } from '@/lib/auth/AuthProvider';
import { localHistory, subscribeLocalHistory, type LocalHistoryEntry } from '@/lib/history/localHistory';
import { describe, type ResultKind } from '@/lib/results/describe';
import { getBaseURL } from '@/lib/utils';
import { isVocalStemJob } from '@/lib/results/mp3Download';

export interface RecentStripProps {
  /** Tool page slug: that tool's entries come first. Omit on the home page. */
  toolSlug?: string | null;
  /** Called after an entry was successfully reopened (MM30 hangs its analytics here). */
  onReopen?: (entry: LocalHistoryEntry) => void;
  /** Test seam: the clock. */
  now?: () => number;
  className?: string;
}

const MINUTE = 60_000;

/** Newest first, with the current tool's entries ahead of the rest. */
export function orderForTool(entries: LocalHistoryEntry[], toolSlug?: string | null): LocalHistoryEntry[] {
  const sorted = [...entries].sort((a, b) => b.createdAt - a.createdAt);
  if (!toolSlug) return sorted;
  return [...sorted.filter((e) => e.tool === toolSlug), ...sorted.filter((e) => e.tool !== toolSlug)];
}

class Gone extends Error {}

/** The probe that doubles as the fetch: 404/410 means the 24 h retention sweeper took the file. */
async function fetchResult(jobId: string): Promise<Blob> {
  const response = await authedFetch(`${getBaseURL()}/download/${encodeURIComponent(jobId)}`);
  if (response.status === 404 || response.status === 410) throw new Gone();
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);
  return response.blob();
}

function Thumb({ entry }: { entry: LocalHistoryEntry }) {
  const [url, setUrl] = useState<string | null>(null);
  const blob = entry.thumbnail;
  useEffect(() => {
    if (!blob || typeof URL.createObjectURL !== 'function') return;
    const made = URL.createObjectURL(blob);
    setUrl(made);
    return () => URL.revokeObjectURL(made);
  }, [blob]);
  const Icon = KIND_ICONS[(entry.kind as ResultKind) in KIND_ICONS ? (entry.kind as ResultKind) : 'unknown'];
  return (
    <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-surface-2">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="size-full object-cover" />
      ) : (
        <Icon aria-hidden={true} className="size-6 text-data" />
      )}
    </span>
  );
}

export function RecentStrip({ toolSlug, onReopen, now = Date.now, className }: RecentStripProps) {
  const { t, formatFileSize } = useLocalization(['interface']);
  const auth = useAuth();
  const signedIn = !!auth?.user;
  const authLoading = auth?.loading ?? false;
  const [entries, setEntries] = useState<LocalHistoryEntry[]>([]);
  const [clock, setClock] = useState(() => now());
  const [opening, setOpening] = useState<string | null>(null);
  const [open, setOpen] = useState<{ entry: LocalHistoryEntry; blob: Blob } | null>(null);

  const reload = useCallback(() => {
    void localHistory.list().then(setEntries);
    setClock(now());
  }, [now]);

  useEffect(() => {
    if (authLoading) return;
    if (signedIn) {
      // Handover: the API claimed this session's jobs for the account, so the account history
      // lists them. Dropping the browser copies means signing in never shows a job twice.
      void localHistory.clear();
      setEntries([]);
      return;
    }
    reload();
    const unsubscribe = subscribeLocalHistory(reload);
    const timer = setInterval(reload, MINUTE);
    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, [authLoading, signedIn, reload]);

  const live = useMemo(
    () => orderForTool(entries.filter((e) => e.expiresAt > clock), toolSlug),
    [entries, clock, toolSlug],
  );

  const reopen = useCallback(
    async (entry: LocalHistoryEntry) => {
      if (opening) return;
      if (entry.expiresAt <= now()) {
        await localHistory.remove(entry.jobId);
        toast.error(t('recentStrip.expired'));
        return;
      }
      setOpening(entry.jobId);
      try {
        const blob = await fetchResult(entry.jobId);
        setOpen({ entry, blob });
        retentionEvents.itemReopened(entry.kind, new Date(entry.createdAt).toISOString(), 'local');
        onReopen?.(entry);
      } catch (error) {
        if (error instanceof Gone) {
          await localHistory.remove(entry.jobId);
          toast.error(t('recentStrip.expired'));
        } else {
          toast.error(t('recentStrip.openFailed'));
        }
      } finally {
        setOpening(null);
      }
    },
    [now, onReopen, opening, t],
  );

  const descriptor = useMemo(() => {
    if (!open) return null;
    const { entry } = open;
    return {
      ...describe({
        job: {
          id: entry.jobId,
          resultFileName: entry.fileName,
          resultSizeBytes: entry.sizeBytes,
          expiresAt: new Date(entry.expiresAt).toISOString(),
        },
      }),
      kind: entry.kind as ResultKind,
    };
  }, [open]);

  if (signedIn || authLoading || live.length === 0) return null;

  const expiresIn = (entry: LocalHistoryEntry) => {
    const ms = Math.max(0, entry.expiresAt - clock);
    return ms >= 60 * MINUTE
      ? t('recentStrip.expiresInHours', { hours: Math.floor(ms / (60 * MINUTE)) })
      : t('recentStrip.expiresInMinutes', { minutes: Math.max(1, Math.ceil(ms / MINUTE)) });
  };

  return (
    <section aria-label={t('recentStrip.title')} className={className ?? 'w-full max-w-5xl'} data-testid="recent-strip">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-card-foreground">{t('recentStrip.title')}</h2>
        <button
          type="button"
          onClick={() => void localHistory.clear()}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Trash2 aria-hidden="true" className="size-3.5" />
          {t('recentStrip.clear')}
        </button>
      </div>
      <ul className="flex gap-3 overflow-x-auto pb-2">
        {live.map((entry) => (
          <li key={entry.jobId} className="shrink-0">
            <button
              type="button"
              onClick={() => void reopen(entry)}
              disabled={opening === entry.jobId}
              aria-label={t('recentStrip.open', { name: entry.fileName })}
              className="flex w-56 items-center gap-3 rounded-lg border border-edge bg-surface-1 p-2 text-left transition-colors hover:bg-surface-2 disabled:opacity-60"
            >
              <Thumb entry={entry} />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-card-foreground">{entry.fileName}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {entry.tool === 'converter' ? t('recentStrip.converter') : entry.tool.replace(/-/g, ' ')}
                  {entry.sizeBytes !== undefined ? ` · ${formatFileSize(entry.sizeBytes)}` : ''}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  {opening === entry.jobId && <Loader2 aria-hidden="true" className="size-3 animate-spin motion-reduce:animate-none" />}
                  {expiresIn(entry)}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {auth ? (
        <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
          <span>{t('recentStrip.signupCta')}</span>
          <button
            type="button"
            onClick={() => auth.openAuth({ intent: 'signup', source: 'recent_strip' })}
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            {t('recentStrip.signupAction')}
          </button>
        </p>
      ) : null}
      {open && descriptor ? (
        <ResultPanel
          variant="modal"
          open
          onOpenChange={(next) => {
            if (!next) setOpen(null);
          }}
          descriptor={descriptor}
          surface="history"
          offerMp3={isVocalStemJob(open.entry.tool)}
          seedBlob={open.blob}
          recordHistory={false}
        />
      ) : null}
    </section>
  );
}

export default RecentStrip;
