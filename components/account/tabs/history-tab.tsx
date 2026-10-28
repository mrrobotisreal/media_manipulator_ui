'use client';

import * as React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { isVocalStemJob } from '@/lib/results/mp3Download';

import { ConfirmDialog } from '@/components/account/confirm-dialog';
import { LINK_CLASS, TEXT_BUTTON_CLASS, DANGER_TEXT_BUTTON_CLASS } from '@/components/account/tabs/shared';
import type { AccountCopy } from '@/components/account/account-copy';
import { Panel } from '@/components/darkroom/panel';
import { PanelLoading } from '@/components/darkroom/panel-loading';
import { ResultPanel } from '@/components/results/result-panel';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import { retentionEvents } from '@/lib/analytics/retentionEvents';
import {
  AccountApiError,
  deleteJob,
  fetchHistory,
  historyDownloadHref,
  keepJobLonger,
  type HistoryEntry,
  type HistoryStatus,
} from '@/lib/auth/accountApi';
import { formatJobDuration } from '@/lib/auth/formatLimits';
import {
  deadlineOf,
  filterHistory,
  fmt,
  hasActiveFilters,
  KEEP_OPTIONS,
  NO_FILTERS,
  relativeDays,
  toolIdOf,
  type HistoryFilters,
} from '@/lib/account/retention';
import { requireToken } from '@/lib/account/requireToken';
import { describe } from '@/lib/results/describe';
import { downloadResult, useDownloadStatus } from '@/lib/results/downloadController';
import { DownloadStatusLine } from '@/components/results/download-status';
import { summaryHistoryLabel } from '@/lib/results/summary';
import { useSummaryResult } from '@/lib/useSummarize';
import { useShareAction, type ShareMessages } from '@/components/share/use-share-action';
import { isShareable, revokeShareLinks } from '@/lib/share/shareApi';
import { cn } from '@/lib/utils';

/** Lazy: the inspector, catalog and metadata strings load only when a row's Metadata is opened. */
const HistoryMetadataDialog = dynamic(() => import('@/components/metadata/history-metadata-dialog'), { ssr: false });

/** How many rows one page holds. The server caps `limit` at 50 regardless. */
const PAGE_SIZE = 20;

const IN_FLIGHT: ReadonlySet<HistoryStatus> = new Set<HistoryStatus>(['pending', 'queued', 'processing']);

function prettifyToolId(id: string): string {
  const words = id.replace(/^ai_/, '').split('_').filter(Boolean);
  if (words.length === 0) return '';
  const [first, ...rest] = words;
  return [first.charAt(0).toUpperCase() + first.slice(1), ...rest].join(' ');
}

type HistoryCopy = AccountCopy['history'];

function toolLabel(entry: HistoryEntry, copy: HistoryCopy): string {
  const id = toolIdOf(entry);
  const map = copy.tool as Record<string, string>;
  return map[id] ?? prettifyToolId(id);
}

function formatTransition(entry: HistoryEntry): string {
  const from = entry.sourceFormat?.toUpperCase() ?? '';
  const to = entry.targetFormat?.toUpperCase() ?? '';
  return from && to ? `${from} → ${to}` : to || from;
}

interface RowProps {
  entry: HistoryEntry;
  copy: HistoryCopy;
  now: number;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  onPreview: (entry: HistoryEntry) => void;
  onKeep: (entry: HistoryEntry, hours: number) => void;
  onDelete: (entry: HistoryEntry) => void;
  /** MM32: ask to revoke every live link of the entry (the tab owns the confirm dialog). */
  onRevokeLinks: (entry: HistoryEntry) => void;
  shareMessages: ShareMessages;
  formatExpiry: (iso: string) => string;
}

/**
 * MM75: a video summary's row is labelled with the summary's title. The history entry carries
 * no title, so a completed, unexpired summary row reads summary.json (cached per job, the same
 * query the result viewer uses); anything else, or a failed read, keeps the file name.
 */
function useSummaryTitle(entry: HistoryEntry): string | null {
  const isSummary = toolIdOf(entry) === 'video_summary' || entry.mode === 'summarize';
  const { data } = useSummaryResult(entry.jobId, isSummary && entry.status === 'completed' && !entry.expired);
  return isSummary ? (data?.title ?? null) : null;
}

/**
 * MM80 follow-up: History's Download.
 *
 * An S3 result comes with a presigned `downloadUrl` that any plain link can open. A local result
 * only has `downloadPath` (`/download/:jobId`), which the API serves to the job's owner by
 * identity HEADERS, so a bare `<a href>` 404'd under ownership enforcement. Those rows go through
 * the result panel's download controller instead: a signed link the browser's own download
 * manager fetches, with the same "Preparing download…" / started / failed feedback.
 */
function HistoryDownload({ entry, href, label }: { entry: HistoryEntry; href: string; label: string }) {
  const { t } = useLocalization('interface');
  const status = useDownloadStatus(entry.jobId);
  const reopened = () => retentionEvents.itemReopened(entry.mediaKind, entry.createdAt);
  if (entry.downloadUrl) {
    return (
      <a href={href} className={LINK_CLASS} onClick={reopened}>
        {label}
      </a>
    );
  }
  const preparing = status.phase === 'preparing';
  const start = () => {
    reopened();
    void downloadResult({ jobId: entry.jobId, fileName: entry.resultFileName || entry.jobId });
  };
  return (
    <>
      <button
        type="button"
        data-testid="history-download-button"
        disabled={preparing}
        aria-busy={preparing || undefined}
        onClick={start}
        className={cn(TEXT_BUTTON_CLASS, 'inline-flex items-center gap-1.5')}
      >
        {preparing && <Loader2 aria-hidden="true" className="size-3.5 animate-spin motion-reduce:animate-none" />}
        {preparing ? t('resultPanel.downloadStatus.preparing') : label}
      </button>
      {(status.phase === 'started' || status.phase === 'failed') && (
        <DownloadStatusLine status={status} onRetry={start} className="basis-full text-xs" />
      )}
    </>
  );
}

const HistoryRow: React.FC<RowProps> = ({ entry, copy, now, selected, onSelect, onPreview, onKeep, onDelete, onRevokeLinks, shareMessages, formatExpiry }) => {
  const { t, formatDate, language } = useLocalization('interface');
  const [metaOpen, setMetaOpen] = React.useState(false);
  const href = historyDownloadHref(entry);
  const summaryTitle = useSummaryTitle(entry);
  const name = summaryHistoryLabel(summaryTitle, entry.resultFileName, toolLabel(entry, copy));
  const detail = [formatTransition(entry), formatJobDuration(entry.durationMs)].filter(Boolean).join(' · ');
  const inFlight = IN_FLIGHT.has(entry.status);
  const failed = entry.status === 'failed' || entry.status === 'cancelled';
  const metadata = entry.metadataAvailable;
  const hasMetadata = !!metadata && (metadata.original || metadata.result);
  const deadline = deadlineOf(entry);
  const created = formatDate(entry.createdAt, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const kind = describe({ job: { id: entry.jobId, resultFileName: entry.resultFileName }, task: entry.tool, mode: entry.mode }).kind;
  const canShare =
    !entry.expired && entry.status === 'completed' && !!href && isShareable(kind, entry.tool, entry.mode);
  const sharing = useShareAction({ jobId: entry.jobId, kind, source: 'history', messages: shareMessages, formatExpiry });
  const canKeep = !entry.expired && !!entry.retainedObjectId && entry.status === 'completed';

  return (
    <li
      data-testid="history-row"
      className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 border-b border-edge py-3.5 first:pt-0 last:border-b-0"
    >
      <label className="row-span-3 flex min-h-11 min-w-8 items-start justify-center pt-1">
        <input
          type="checkbox"
          checked={selected}
          onChange={(event) => onSelect(event.target.checked)}
          aria-label={fmt(copy.bulk.select, { name })}
          className="size-4 accent-[var(--accent-primary)]"
        />
      </label>

      <div className="flex min-w-0 items-baseline justify-between gap-3">
        <p className="min-w-0 truncate text-sm text-foreground">
          {toolLabel(entry, copy)}
          {summaryTitle || entry.resultFileName ? (
            <span className="ms-2 text-muted-foreground" data-testid="history-row-name">{summaryTitle || entry.resultFileName}</span>
          ) : null}
        </p>
        <time dateTime={entry.createdAt} className="num shrink-0 text-xs text-muted-foreground">
          {created}
        </time>
      </div>

      <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
        {detail ? <p className="num truncate text-xs text-muted-foreground">{detail}</p> : null}
        <span
          className={cn(
            'text-xs',
            failed && 'text-destructive',
            inFlight && 'text-data',
            !failed && !inFlight && 'text-muted-foreground',
          )}
        >
          {entry.expired ? copy.expiredShort : ((copy.status as Record<string, string>)[entry.status] ?? entry.status)}
        </span>
        {entry.expired ? null : deadline ? (
          <span
            className="num text-xs text-muted-foreground"
            title={formatDate(deadline, { dateStyle: 'medium', timeStyle: 'short' } as Intl.DateTimeFormatOptions)}
          >
            {fmt(copy.deletesOn, { date: relativeDays(deadline, now, language.code) || formatDate(deadline) })}
            {entry.keptLonger ? ` · ${copy.keptLonger}` : ''}
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" aria-label={fmt(copy.actions, { name })} role="group">
        {entry.expired ? (
          <>
            <span className="text-text-subtle">{copy.expired}</span>
            {hasMetadata ? (
              <button type="button" data-testid="history-metadata-button" onClick={() => setMetaOpen(true)} className={TEXT_BUTTON_CLASS}>
                {copy.metadata}
              </button>
            ) : null}
            <button type="button" onClick={() => onDelete(entry)} className={DANGER_TEXT_BUTTON_CLASS}>
              {copy.deleteRecord}
            </button>
          </>
        ) : (
          <>
            {href ? (
              <button type="button" onClick={() => onPreview(entry)} className={TEXT_BUTTON_CLASS}>
                {copy.preview}
              </button>
            ) : null}
            {hasMetadata ? (
              <button type="button" data-testid="history-metadata-button" onClick={() => setMetaOpen(true)} className={TEXT_BUTTON_CLASS}>
                {copy.metadata}
              </button>
            ) : null}
            {href ? (
              <HistoryDownload entry={entry} href={href} label={copy.download} />
            ) : null}
            {canShare ? (
              <>
                <button type="button" data-testid="history-share-button" disabled={sharing.busy} onClick={() => void sharing.share()} className={TEXT_BUTTON_CLASS}>
                  {t('share.button')}
                </button>
                <button type="button" data-testid="history-revoke-button" onClick={() => onRevokeLinks(entry)} className={TEXT_BUTTON_CLASS}>
                  {t('share.revokeLinks')}
                </button>
              </>
            ) : null}
            {canKeep ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className={TEXT_BUTTON_CLASS}>
                    {copy.keepLonger}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>{copy.keepMenu}</DropdownMenuLabel>
                  {KEEP_OPTIONS.map((option) => (
                    <DropdownMenuItem key={option.id} className="min-h-11" onSelect={() => onKeep(entry, option.hours)}>
                      {copy.keep[option.id]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
            <button type="button" onClick={() => onDelete(entry)} className={DANGER_TEXT_BUTTON_CLASS}>
              {copy.deleteNow}
            </button>
          </>
        )}
      </div>
      {canShare ? (
        <ConfirmDialog
          open={sharing.limitOpen}
          onOpenChange={sharing.setLimitOpen}
          title={t('share.limitTitle')}
          description={t('share.limitBody')}
          confirmLabel={t('share.revokeConfirm')}
          cancelLabel={t('share.cancel')}
          busy={sharing.revoking}
          onConfirm={() => void sharing.revoke()}
        />
      ) : null}
      {hasMetadata && metaOpen ? (
        <HistoryMetadataDialog jobId={entry.jobId} available={metadata} open={metaOpen} onOpenChange={setMetaOpen} />
      ) : null}
    </li>
  );
};

const selectClass =
  'min-h-11 rounded-md border border-input bg-background px-2 text-sm text-foreground sm:min-h-9';

export interface HistoryTabProps {
  copy: AccountCopy;
  uid: string;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ copy, uid }) => {
  const h = copy.history;
  const localized = useLocalizedHref();
  const queryClient = useQueryClient();
  const [limit, setLimit] = React.useState(PAGE_SIZE);
  const [filters, setFilters] = React.useState<HistoryFilters>(NO_FILTERS);
  const [now] = React.useState(() => Date.now());
  const [selected, setSelected] = React.useState<ReadonlySet<string>>(new Set());
  const [preview, setPreview] = React.useState<HistoryEntry | null>(null);
  const [toDelete, setToDelete] = React.useState<HistoryEntry | null>(null);
  const [bulkOpen, setBulkOpen] = React.useState(false);
  const [bulk, setBulk] = React.useState<{ done: number; total: number; failed: string[]; running: boolean } | null>(null);
  const [live, setLive] = React.useState('');
  const [toRevoke, setToRevoke] = React.useState<HistoryEntry | null>(null);
  const { t, formatDate: formatLocalDate } = useLocalization('interface');
  const shareMessages = React.useMemo<ShareMessages>(
    () => ({
      copied: (when) => fmt(t('share.copied'), { when }),
      copyManually: (url) => fmt(t('share.copyManually'), { url }),
      notAllowed: t('share.notAllowed'),
      expired: t('share.expired'),
      limit: t('share.limitBody'),
      signIn: t('share.signIn'),
      failed: t('share.failed'),
      revoked: () => t('share.revoked'),
      revokeNone: t('share.revokeNone'),
      revokeFailed: t('share.revokeFailed'),
    }),
    [t],
  );
  const formatExpiry = React.useCallback(
    (iso: string) => formatLocalDate(iso, { dateStyle: 'medium', timeStyle: 'short' } as Intl.DateTimeFormatOptions),
    [formatLocalDate],
  );
  const revokeLinks = useMutation({
    mutationFn: async (entry: HistoryEntry) => revokeShareLinks(entry.jobId),
    onSuccess: (n) => {
      const message = n > 0 ? t('share.revoked') : t('share.revokeNone');
      setLive(message);
      toast.success(message);
      setToRevoke(null);
    },
    onError: () => {
      setLive(t('share.revokeFailed'));
      toast.error(t('share.revokeFailed'));
      setToRevoke(null);
    },
  });

  const history = useQuery({
    queryKey: ['account-history', uid, limit],
    staleTime: 60_000,
    retry: 1,
    queryFn: async ({ signal }) => fetchHistory(await requireToken(), { limit }, signal),
  });

  const refetch = () => queryClient.invalidateQueries({ queryKey: ['account-history', uid] });

  const keep = useMutation({
    mutationFn: async ({ entry, hours }: { entry: HistoryEntry; hours: number }) =>
      keepJobLonger(await requireToken(), entry.jobId, hours),
    onSuccess: (result) => {
      const message = fmt(h.keepDone, { date: new Date(result.expiresAt).toLocaleDateString() });
      setLive(message);
      toast.success(message);
      void refetch();
    },
    onError: (error) => {
      const message = error instanceof AccountApiError && error.code === 'nothing_to_keep' ? h.keepGone : h.keepFailed;
      setLive(message);
      toast.error(message);
      void refetch();
    },
  });

  const remove = useMutation({
    mutationFn: async (entry: HistoryEntry) => deleteJob(await requireToken(), entry.jobId),
    onSuccess: (result) => {
      retentionEvents.itemDeleted('result', 1);
      const message = result.pending > 0 ? h.deletedPending : h.deleted;
      setLive(message);
      toast.success(message);
      setToDelete(null);
      void refetch();
    },
    onError: () => {
      setLive(h.deleteFailed);
      toast.error(h.deleteFailed);
      setToDelete(null);
      void refetch();
    },
  });

  const entries = React.useMemo(() => history.data?.entries ?? [], [history.data]);
  const visible = React.useMemo(() => filterHistory(entries, filters, now), [entries, filters, now]);
  const toolIds = React.useMemo(() => [...new Set(entries.map(toolIdOf))].sort(), [entries]);
  const kinds = React.useMemo(() => [...new Set(entries.map((e) => e.mediaKind).filter((k): k is string => !!k))].sort(), [entries]);

  const setFilter = <K extends keyof HistoryFilters>(key: K, value: HistoryFilters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
    // A selection must never reach rows the person can no longer see.
    setSelected(new Set());
  };

  const toggle = (jobId: string, checked: boolean) =>
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(jobId);
      else next.delete(jobId);
      return next;
    });

  const runBulk = async () => {
    const ids = visible.filter((e) => selected.has(e.jobId)).map((e) => e.jobId);
    const failed: string[] = [];
    setBulk({ done: 0, total: ids.length, failed, running: true });
    const token = await requireToken().catch(() => null);
    for (let i = 0; i < ids.length; i += 1) {
      try {
        if (!token) throw new Error('Not signed in');
        await deleteJob(token, ids[i]);
      } catch {
        failed.push(ids[i]);
      }
      setBulk({ done: i + 1, total: ids.length, failed: [...failed], running: i + 1 < ids.length });
    }
    retentionEvents.itemDeleted('result', ids.length - failed.length);
    const message = failed.length
      ? fmt(h.bulk.partial, { done: ids.length - failed.length, total: ids.length })
      : fmt(h.bulk.done, { count: ids.length });
    setLive(message);
    // Keep only what failed selected, so the person can retry or inspect it.
    setSelected(new Set(failed));
    await refetch();
    if (!failed.length) {
      setBulk(null);
      setBulkOpen(false);
    }
  };

  const previewDescriptor = React.useMemo(() => {
    if (!preview) return null;
    return describe({
      job: {
        id: preview.jobId,
        resultFileName: preview.resultFileName,
        expiresAt: deadlineOf(preview),
        resultUrl: historyDownloadHref(preview) ?? undefined,
        metadataAvailable: preview.metadataAvailable,
      },
      task: preview.tool,
      mode: preview.mode,
    });
  }, [preview]);

  if (history.isPending) {
    return (
      <Panel title={copy.historyTitle} titleAs="h2">
        <PanelLoading variant="inline" label={h.loading} />
      </Panel>
    );
  }
  if (history.isError) {
    return (
      <Panel title={copy.historyTitle} titleAs="h2">
        <p className="text-sm text-muted-foreground">{h.loadFailed}</p>
      </Panel>
    );
  }

  const { total } = history.data;
  if (entries.length === 0) {
    return (
      <Panel title={copy.historyTitle} titleAs="h2">
        <p className="text-sm leading-relaxed text-muted-foreground">{copy.emptyHistory}</p>
        <Link href={localized('/tools')} className={cn(LINK_CLASS, 'mt-3')}>
          {h.emptyCta}
        </Link>
      </Panel>
    );
  }

  const selectedCount = visible.filter((e) => selected.has(e.jobId)).length;
  const f = h.filters;

  return (
    <Panel title={copy.historyTitle} titleAs="h2">
      <div role="status" aria-live="polite" className="sr-only">
        {live}
      </div>

      <form
        role="search"
        aria-label={f.label}
        className="mb-4 flex flex-wrap items-end gap-3"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="grid gap-1 text-xs text-muted-foreground">
          {f.kind}
          <select className={selectClass} value={filters.kind} onChange={(e) => setFilter('kind', e.target.value)}>
            <option value="">{f.allKinds}</option>
            {kinds.map((kind) => (
              <option key={kind} value={kind}>
                {(h.kinds as Record<string, string>)[kind] ?? kind}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs text-muted-foreground">
          {f.tool}
          <select className={selectClass} value={filters.tool} onChange={(e) => setFilter('tool', e.target.value)}>
            <option value="">{f.allTools}</option>
            {toolIds.map((id) => (
              <option key={id} value={id}>
                {(h.tool as Record<string, string>)[id] ?? prettifyToolId(id)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs text-muted-foreground">
          {f.from}
          <Input type="date" className="min-h-11 sm:min-h-9" value={filters.from} onChange={(e) => setFilter('from', e.target.value)} />
        </label>
        <label className="grid gap-1 text-xs text-muted-foreground">
          {f.to}
          <Input type="date" className="min-h-11 sm:min-h-9" value={filters.to} onChange={(e) => setFilter('to', e.target.value)} />
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={filters.expiringSoon}
            onChange={(e) => setFilter('expiringSoon', e.target.checked)}
            className="size-4 accent-[var(--accent-primary)]"
          />
          {f.expiringSoon}
        </label>
        {hasActiveFilters(filters) ? (
          <button type="button" className={TEXT_BUTTON_CLASS} onClick={() => {
              setFilters(NO_FILTERS);
              setSelected(new Set());
            }}>
            {f.clear}
          </button>
        ) : null}
      </form>

      {selectedCount > 0 ? (
        <div
          role="region"
          aria-label={fmt(h.bulk.selected, { count: selectedCount })}
          className="sticky top-2 z-10 mb-3 flex flex-wrap items-center justify-between gap-3 rounded-md border border-edge bg-surface-2 px-3 py-2"
        >
          <p className="num text-sm text-foreground">{fmt(h.bulk.selected, { count: selectedCount })}</p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" className="min-h-11 sm:min-h-8" onClick={() => setSelected(new Set())}>
              {h.bulk.clear}
            </Button>
            <Button type="button" variant="destructive" size="sm" className="min-h-11 sm:min-h-8" onClick={() => setBulkOpen(true)}>
              {h.bulk.delete}
            </Button>
          </div>
        </div>
      ) : null}

      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground" data-testid="history-no-match">
          {f.noMatch}
        </p>
      ) : (
        <ol>
          {visible.map((entry) => (
            <HistoryRow
              key={entry.jobId}
              entry={entry}
              copy={h}
              now={now}
              selected={selected.has(entry.jobId)}
              onSelect={(checked) => toggle(entry.jobId, checked)}
              onPreview={(e) => {
                retentionEvents.itemReopened(e.mediaKind, e.createdAt);
                setPreview(e);
              }}
              onKeep={(e, hours) => keep.mutate({ entry: e, hours })}
              onDelete={setToDelete}
              onRevokeLinks={setToRevoke}
              shareMessages={shareMessages}
              formatExpiry={formatExpiry}
            />
          ))}
        </ol>
      )}

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="num text-xs text-muted-foreground">
          {fmt(h.showing, { count: entries.length, total })}
        </p>
        {entries.length < total ? (
          <Button
            variant="outline"
            size="sm"
            className="min-h-11 sm:min-h-8"
            onClick={() => setLimit((current) => current + PAGE_SIZE)}
            disabled={history.isFetching}
          >
            {h.loadMore}
          </Button>
        ) : null}
      </div>

      {previewDescriptor && preview ? (
        <ResultPanel
          variant="modal"
          open
          onOpenChange={(open) => {
            if (!open) setPreview(null);
          }}
          descriptor={previewDescriptor}
          surface="history"
          offerMp3={isVocalStemJob(preview.tool)}
          title={fmt(h.previewTitle, { name: preview.resultFileName || toolLabel(preview, h) })}
        />
      ) : null}

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => {
          if (!open) setToDelete(null);
        }}
        title={h.deleteTitle}
        description={toDelete?.expired ? h.deleteRecordBody : h.deleteBody}
        confirmLabel={h.deleteConfirm}
        cancelLabel={h.cancel}
        busy={remove.isPending}
        onConfirm={() => {
          if (toDelete) remove.mutate(toDelete);
        }}
      />

      <ConfirmDialog
        open={toRevoke !== null}
        onOpenChange={(open) => {
          if (!open) setToRevoke(null);
        }}
        title={t('share.revokeTitle')}
        description={t('share.revokeBody')}
        confirmLabel={t('share.revokeConfirm')}
        cancelLabel={t('share.cancel')}
        busy={revokeLinks.isPending}
        onConfirm={() => {
          if (toRevoke) revokeLinks.mutate(toRevoke);
        }}
      />

      <ConfirmDialog
        open={bulkOpen}
        onOpenChange={(open) => {
          if (!open) {
            setBulkOpen(false);
            setBulk(null);
          }
        }}
        title={fmt(h.bulk.title, { count: selectedCount })}
        description={h.bulk.body}
        confirmLabel={h.deleteConfirm}
        cancelLabel={h.cancel}
        busy={bulk?.running ?? false}
        onConfirm={() => void runBulk()}
      >
        {bulk ? (
          <div role="status" aria-live="polite" className="grid gap-2 text-sm">
            <p className="num text-foreground">{fmt(h.bulk.progress, { done: bulk.done, total: bulk.total })}</p>
            {!bulk.running && bulk.failed.length > 0 ? (
              <div data-testid="bulk-failures">
                <p className="text-destructive">{fmt(h.bulk.partial, { done: bulk.total - bulk.failed.length, total: bulk.total })}</p>
                <ul className="mt-1 list-disc ps-5 text-muted-foreground">
                  {bulk.failed.map((id) => {
                    const row = entries.find((e) => e.jobId === id);
                    return <li key={id}>{row?.resultFileName || (row ? toolLabel(row, h) : id)}</li>;
                  })}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </ConfirmDialog>
    </Panel>
  );
};

export default HistoryTab;
