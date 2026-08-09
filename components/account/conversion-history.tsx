'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { Panel } from '@/components/darkroom/panel';
import { PanelLoading } from '@/components/darkroom/panel-loading';
import { Button } from '@/components/ui/button';
import { getCurrentIdToken } from '@/lib/firebase';
import { fetchHistory, historyDownloadHref } from '@/lib/auth/accountApi';
import type { HistoryEntry, HistoryStatus } from '@/lib/auth/accountApi';
import { formatJobDuration } from '@/lib/auth/formatLimits';
import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import { cn } from '@/lib/utils';

/**
 * Recent conversions — the signed-in half of /account.
 *
 * Reads GET /api/account/history, which the server keys on the account rather
 * than the session, so the list follows the person across devices instead of the
 * browser. Every label arrives as a prop from the server page (§0.5.13–14:
 * `pages.json` must never reach a client chunk); only the rows are fetched here.
 *
 * The rows are a log, not a card grid: one hairline-separated line per job,
 * measurements in the mono face, and at most one affordance per row — the
 * download, when there is genuinely something to download. Both `expired` and
 * the download links are computed server-side, so this component never guesses
 * whether a result still exists.
 */

export interface HistoryLabels {
  title: string;
  loading: string;
  empty: string;
  emptyCta: string;
  loadFailed: string;
  download: string;
  expired: string;
  loadMore: string;
  /** "Showing {{count}} of {{total}}". */
  showing: string;
  /** Human names for the API's tool ids; unknown ids fall back to prettifying. */
  tool: Record<string, string>;
  status: Record<string, string>;
}

/** How many rows one page holds. The server caps `limit` at 50 regardless. */
const PAGE_SIZE = 20;

/** Statuses that mean "still working", so the row reads as in flight. */
const IN_FLIGHT: ReadonlySet<HistoryStatus> = new Set<HistoryStatus>([
  'pending',
  'queued',
  'processing',
]);

/**
 * A readable name for a tool id we have no label for: a tool added to the API
 * later should degrade to "Frame interpolation", never to a raw
 * `ai_frame_interpolation`.
 */
function prettifyToolId(id: string): string {
  const words = id.replace(/^ai_/, '').split('_').filter(Boolean);
  if (words.length === 0) return '';
  const [first, ...rest] = words;
  return [first.charAt(0).toUpperCase() + first.slice(1), ...rest].join(' ');
}

function toolLabel(entry: HistoryEntry, labels: HistoryLabels): string {
  const id = entry.tool || entry.mode;
  if (!id) return labels.tool.convert ?? prettifyToolId('convert');
  return labels.tool[id] ?? prettifyToolId(id);
}

/** "WEBP → PNG", or one side alone when the other is unknown. */
function formatTransition(entry: HistoryEntry): string {
  const from = entry.sourceFormat?.toUpperCase() ?? '';
  const to = entry.targetFormat?.toUpperCase() ?? '';
  if (from && to) return `${from} → ${to}`;
  return to || from;
}

interface RowProps {
  entry: HistoryEntry;
  labels: HistoryLabels;
  /** Hoisted out of the row so one formatter serves the whole list. */
  timestamp: string;
}

const HistoryRow: React.FC<RowProps> = ({ entry, labels, timestamp }) => {
  const href = historyDownloadHref(entry);
  const detail = [formatTransition(entry), formatJobDuration(entry.durationMs)]
    .filter(Boolean)
    .join(' · ');
  const inFlight = IN_FLIGHT.has(entry.status);
  const failed = entry.status === 'failed' || entry.status === 'cancelled';

  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1 border-b border-edge py-3.5 first:pt-0 last:border-b-0">
      <p className="truncate text-sm text-foreground">{toolLabel(entry, labels)}</p>
      <time
        dateTime={entry.createdAt}
        className="num justify-self-end text-xs text-muted-foreground"
      >
        {timestamp}
      </time>

      <p className="num truncate text-xs text-muted-foreground">{detail}</p>

      <div className="justify-self-end text-xs">
        {href ? (
          <a
            href={href}
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            {labels.download}
          </a>
        ) : entry.expired ? (
          // text-subtle is for disabled/decorative text, which this genuinely
          // is: the result is gone and the row is only the record of it.
          <span className="text-text-subtle">{labels.expired}</span>
        ) : (
          <span
            className={cn(
              failed && 'text-destructive',
              inFlight && 'text-data',
              !failed && !inFlight && 'text-muted-foreground',
            )}
          >
            {/* The status, never the raw error string — that is a server
                message, and occasionally a path. */}
            {labels.status[entry.status] ?? entry.status}
          </span>
        )}
      </div>
    </li>
  );
};

export const ConversionHistory: React.FC<{ labels: HistoryLabels; uid: string }> = ({
  labels,
  uid,
}) => {
  const { formatDate } = useLocalization();
  const localized = useLocalizedHref();
  const [limit, setLimit] = React.useState(PAGE_SIZE);

  // Keyed on the uid so signing into a different account cannot show the
  // previous person's rows from cache. No polling: a conversion history is not
  // a live feed, and the page is cheap to reload.
  const history = useQuery({
    queryKey: ['account-history', uid, limit],
    staleTime: 60_000,
    retry: 1,
    queryFn: async ({ signal }) => {
      const idToken = await getCurrentIdToken();
      if (!idToken) throw new Error('Not signed in');
      return fetchHistory(idToken, { limit }, signal);
    },
  });

  if (history.isPending) {
    return (
      <Panel title={labels.title} titleAs="h2">
        <PanelLoading variant="inline" label={labels.loading} />
      </Panel>
    );
  }

  if (history.isError) {
    return (
      <Panel title={labels.title} titleAs="h2">
        <p className="text-sm text-muted-foreground">{labels.loadFailed}</p>
      </Panel>
    );
  }

  const { entries, total } = history.data;

  if (entries.length === 0) {
    return (
      <Panel title={labels.title} titleAs="h2">
        {/* Already signed in, so there is nothing to upsell here — just the way
            back to the work. */}
        <p className="text-sm leading-relaxed text-muted-foreground">{labels.empty}</p>
        <Link
          href={localized('/tools')}
          className="mt-3 inline-flex text-sm text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
        >
          {labels.emptyCta}
        </Link>
      </Panel>
    );
  }

  return (
    <Panel title={labels.title} titleAs="h2">
      <ol>
        {entries.map((entry) => (
          <HistoryRow
            key={entry.jobId}
            entry={entry}
            labels={labels}
            // A short absolute stamp: someone checking whether they already
            // converted a file wants the date, not "3 days ago".
            timestamp={formatDate(entry.createdAt, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          />
        ))}
      </ol>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="num text-xs text-muted-foreground">
          {labels.showing
            .replace('{{count}}', String(entries.length))
            .replace('{{total}}', String(total))}
        </p>
        {entries.length < total ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLimit((current) => current + PAGE_SIZE)}
            disabled={history.isFetching}
          >
            {labels.loadMore}
          </Button>
        ) : null}
      </div>
    </Panel>
  );
};

export default ConversionHistory;
