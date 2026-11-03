'use client';

/**
 * The `/tools/aperture` launcher (MM100 decision 3): Open + the five most recent
 * projects. Signed in: `GET /api/photo/projects` (newest first). Signed out: the
 * one browser-local project, if there is one. Editor links are raw `/photo/...`
 * paths, never localized. Strings arrive as props. No analytics here (MM101).
 */
import * as React from 'react';
import { ArrowRight, ImageIcon, Loader2 } from 'lucide-react';

import { useAuth } from '@/lib/auth/AuthProvider';
import { listPhotoProjects, type PhotoProjectSummary } from '@/lib/photo/projectsApi';
import { getLocalProject } from '@/lib/photo/localProject';
import PhotoDropzone, { PHOTO_EDITOR_HREF, type PhotoDropzoneLabels } from './photo-dropzone';

export const PHOTO_RECENT_LIMIT = 5;

export interface PhotoLauncherLabels extends PhotoDropzoneLabels {
  title: string;
  description: string;
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

export interface PhotoRecentRow {
  id: string;
  name: string;
  /** Epoch ms (0 = unknown). */
  at: number;
  /** Pixel size text such as `6000x4000`, or ''. */
  size: string;
}

export type PhotoRecentState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; source: 'account' | 'browser'; rows: PhotoRecentRow[] };

export const photoEditorHref = (id: string): string => `/photo/${encodeURIComponent(id)}`;

export async function loadPhotoRecent(signedIn: boolean): Promise<PhotoRecentState> {
  if (signedIn) {
    const list: PhotoProjectSummary[] = await listPhotoProjects();
    const rows = list
      .map((p) => ({ id: p.id, name: p.name, at: Date.parse(p.updatedAt) || 0, size: p.width && p.height ? `${p.width}×${p.height}` : '' }))
      .sort((a, b) => b.at - a.at)
      .slice(0, PHOTO_RECENT_LIMIT);
    return { status: 'ready', source: 'account', rows };
  }
  const local = await getLocalProject();
  const rows: PhotoRecentRow[] = local
    ? [{ id: 'local', name: local.name, at: local.savedAt, size: local.doc.source ? `${local.doc.source.width}×${local.doc.source.height}` : '' }]
    : [];
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
export function PhotoRecentList({ state, labels, locale }: { state: PhotoRecentState; labels: PhotoLauncherLabels; locale: string }) {
  if (state.status === 'loading') {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground" role="status" data-testid="photo-recent-loading">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        {labels.loading}
      </p>
    );
  }
  if (state.status === 'error') {
    return (
      <p className="text-sm text-muted-foreground" role="status" data-testid="photo-recent-error">
        {labels.error}
      </p>
    );
  }
  if (state.rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground" data-testid="photo-recent-empty">
        {labels.empty}
      </p>
    );
  }
  return (
    <div data-testid="photo-recent-list">
      <p className="mb-2 text-xs text-muted-foreground">{state.source === 'account' ? labels.sourceAccount : labels.sourceBrowser}</p>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {state.rows.map((row) => {
          const when = formatWhen(row.at, locale);
          return (
            <li key={row.id}>
              <a
                href={photoEditorHref(row.id)}
                className="flex items-center gap-3 rounded-md border border-edge bg-surface-2/40 p-3 transition-colors duration-[var(--dur-base)] ease-[var(--ease-instrument)] hover:border-edge-strong hover:bg-surface-2"
              >
                <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded border border-edge bg-surface-1">
                  <ImageIcon className="size-5 text-data" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-card-foreground">{row.name.trim() || labels.untitled}</span>
                  <span className="num block text-xs text-muted-foreground">
                    {[row.size, when ? labels.edited.replace('{{date}}', when) : ''].filter(Boolean).join(' · ')}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function PhotoLauncher({
  labels,
  locale,
  panel = 'basic',
  loader = loadPhotoRecent,
}: {
  labels: PhotoLauncherLabels;
  locale: string;
  panel?: React.ComponentProps<typeof PhotoDropzone>['panel'];
  /** Test seam. */
  loader?: (signedIn: boolean) => Promise<PhotoRecentState>;
}) {
  const auth = useAuth();
  const signedIn = !!auth?.user;
  const authLoading = auth?.loading ?? false;
  const [result, setResult] = React.useState<{ signedIn: boolean; state: PhotoRecentState } | null>(null);
  const state: PhotoRecentState = !authLoading && result?.signedIn === signedIn ? result.state : { status: 'loading' };

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
    <div data-testid="photo-launcher">
      <PhotoDropzone panel={panel} title={labels.title} description={labels.description} labels={labels} />
      <div className="mt-6 rounded-lg border border-edge bg-surface-1 p-4 sm:p-6">
        <h2 className="mb-3 text-base font-semibold text-card-foreground">{labels.recentTitle}</h2>
        <PhotoRecentList state={state} labels={labels} locale={locale} />
        <p className="mt-4">
          <a href={PHOTO_EDITOR_HREF} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            {labels.openEmpty}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </a>
        </p>
      </div>
    </div>
  );
}
