'use client';

/**
 * The `/tools/motion` launcher (ticket MM48 decision 1): the Open button and
 * the five most recent projects.
 *
 *   - Signed in: `GET /api/vector/projects` (MM43, newest first), top five.
 *   - Signed out: the browser-only drafts in IndexedDB (`mm-vector-drafts`),
 *     the only place an anonymous project lives (design §3.5).
 *
 * Every string arrives as a prop from the server component, so this island
 * loads no i18n shard. The editor route is chromeless and excluded from the
 * locale proxy, so every editor link is the raw `/motion/...` path and is
 * never passed through `localizeHref` (MM42). Thumbnails: `/api/vector/projects`
 * returns only a private S3 key with no read URL (MM43), so rows show a
 * placeholder glyph until the API serves one (MM48 deviation, design §8).
 *
 * Analytics: one existing catalog event, `cta_clicked`, on the Open button.
 */
import * as React from 'react';
import { ArrowRight, Loader2, Spline } from 'lucide-react';

import { analytics, EVENTS } from '@/lib/analytics';
import { useAuth } from '@/lib/auth/AuthProvider';
import { fetchVectorProjects } from '@/lib/auth/accountApi';
import { requireToken } from '@/lib/account/requireToken';
import { NEW_PROJECT_ID } from '@/lib/vector/projects';

export const RECENT_LIMIT = 5;

export interface RecentProjectsLabels {
  open: string;
  openHint: string;
  recentTitle: string;
  sourceAccount: string;
  sourceBrowser: string;
  loading: string;
  empty: string;
  error: string;
  untitled: string;
  /** Contains `{{date}}`. */
  edited: string;
}

export interface RecentRow {
  id: string;
  name: string;
  /** Epoch ms. */
  at: number;
}

export type RecentState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; source: 'account' | 'browser'; rows: RecentRow[] };

/** The editor URL for a project id (raw path: the editor is not localized). */
export function motionEditorHref(id: string): string {
  return `/motion/${encodeURIComponent(id)}`;
}

export const MOTION_NEW_HREF = motionEditorHref(NEW_PROJECT_ID);

export async function loadRecent(signedIn: boolean): Promise<RecentState> {
  if (signedIn) {
    const projects = await fetchVectorProjects(await requireToken());
    const rows = projects
      .map((p) => ({ id: p.id, name: p.name, at: Date.parse(p.updatedAt) || 0 }))
      .sort((a, b) => b.at - a.at)
      .slice(0, RECENT_LIMIT);
    return { status: 'ready', source: 'account', rows };
  }
  // Dynamic: the draft store pulls in the document schema, which only this branch needs.
  const { listVectorDrafts } = await import('@/lib/vector/draftStore');
  const drafts = await listVectorDrafts();
  const rows = drafts.slice(0, RECENT_LIMIT).map((d) => ({ id: d.projectId, name: d.name, at: d.savedAt }));
  return { status: 'ready', source: 'browser', rows };
}

function formatWhen(at: number, locale: string): string {
  if (!at) return '';
  try {
    return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(at));
  } catch {
    return '';
  }
}

/** Presentational list; exported for tests. */
export function RecentProjectsList({ state, labels, locale }: { state: RecentState; labels: RecentProjectsLabels; locale: string }) {
  if (state.status === 'loading') {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground" role="status" data-testid="motion-recent-loading">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        {labels.loading}
      </p>
    );
  }
  if (state.status === 'error') {
    return (
      <p className="text-sm text-muted-foreground" role="status" data-testid="motion-recent-error">
        {labels.error}
      </p>
    );
  }
  if (state.rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground" data-testid="motion-recent-empty">
        {labels.empty}
      </p>
    );
  }
  return (
    <div data-testid="motion-recent-list">
      <p className="mb-2 text-xs text-muted-foreground">
        {state.source === 'account' ? labels.sourceAccount : labels.sourceBrowser}
      </p>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {state.rows.map((row) => {
          const when = formatWhen(row.at, locale);
          return (
            <li key={row.id}>
              <a
                href={motionEditorHref(row.id)}
                className="flex items-center gap-3 rounded-md border border-edge bg-surface-2/40 p-3 transition-colors duration-[var(--dur-base)] ease-[var(--ease-instrument)] hover:border-edge-strong hover:bg-surface-2"
              >
                <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded border border-edge bg-surface-1">
                  <Spline className="size-5 text-data" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-card-foreground">{row.name.trim() || labels.untitled}</span>
                  {when ? (
                    <span className="block text-xs text-muted-foreground">{labels.edited.replace('{{date}}', when)}</span>
                  ) : null}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function MotionLauncher({
  labels,
  locale,
  loader = loadRecent,
}: {
  labels: RecentProjectsLabels;
  locale: string;
  /** Test seam. */
  loader?: (signedIn: boolean) => Promise<RecentState>;
}) {
  const auth = useAuth();
  const signedIn = !!auth?.user;
  const authLoading = auth?.loading ?? false;
  // The result is stored with the identity it was loaded for, so a sign-in or sign-out
  // shows "loading" until the matching list arrives (no setState in the effect body).
  const [result, setResult] = React.useState<{ signedIn: boolean; state: RecentState } | null>(null);
  const state: RecentState = !authLoading && result?.signedIn === signedIn ? result.state : { status: 'loading' };

  React.useEffect(() => {
    if (authLoading) return;
    let alive = true;
    loader(signedIn)
      .then((next) => alive && setResult({ signedIn, state: next }))
      .catch(() => alive && setResult({ signedIn, state: { status: 'error' } }));
    return () => {
      alive = false;
    };
  }, [authLoading, signedIn, loader]);

  return (
    <div className="mt-6 rounded-lg border border-edge border-l-2 border-l-data bg-surface-1 p-4 sm:p-6" data-testid="motion-launcher">
      <div className="flex flex-wrap items-center gap-4">
        <a
          href={MOTION_NEW_HREF}
          data-testid="motion-open"
          onClick={() =>
            analytics.track(EVENTS.CTA_CLICKED, { cta_id: 'motion_open', placement: 'tool_page_motion', href: MOTION_NEW_HREF })
          }
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-[var(--accent-primary-hover)]"
        >
          {labels.open}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
        </a>
        <p className="text-sm text-muted-foreground">{labels.openHint}</p>
      </div>
      <h2 className="mb-3 mt-6 text-base font-semibold text-card-foreground">{labels.recentTitle}</h2>
      <RecentProjectsList state={state} labels={labels} locale={locale} />
    </div>
  );
}
