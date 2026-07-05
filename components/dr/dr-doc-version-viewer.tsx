'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, ArrowLeft, History, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DrDocRenderer from './doc-renderer';
import { fetchDrDocRevision } from '@/lib/dr/docEditorApi';
import { drQueryRetry, DrApiError } from '@/lib/dr/docsApi';
import { useDrQueryErrorRedirect } from '@/lib/dr/useDrQueryErrorRedirect';

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(d);
}

// Read-only viewer for a single historical revision at
// /dr/docs/{slug}/versions/{rev}. Renders the snapshot with DrDocRenderer and NO
// comment props (anchors are only meaningful against current content).
export default function DrDocVersionViewer({ slug, rev }: { slug: string; rev: string }) {
  const revNumber = /^\d+$/.test(rev) ? Number(rev) : Number.NaN;
  const valid = Number.isInteger(revNumber) && revNumber >= 1;

  const query = useQuery({
    queryKey: ['dr', 'docs', slug, 'revisions', revNumber],
    queryFn: () => fetchDrDocRevision(slug, revNumber),
    enabled: valid,
    retry: drQueryRetry,
  });
  useDrQueryErrorRedirect(query.error);

  const isNotFound = !valid || (query.error instanceof DrApiError && query.error.status === 404);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <Link
        href={`/dr/docs/${slug}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to current version
      </Link>

      {valid && query.isLoading && <VersionSkeleton />}

      {isNotFound && !query.isLoading && (
        <Card className="items-center gap-2 p-8 text-center">
          <p className="font-medium">Version not found</p>
          <p className="text-sm text-muted-foreground">This version doesn’t exist, or the document was removed.</p>
          <Button asChild variant="outline" size="sm" className="mt-2">
            <Link href={`/dr/docs/${slug}`}>Back to current version</Link>
          </Button>
        </Card>
      )}

      {valid && query.isError && !isNotFound && (
        <Card className="items-start gap-3 p-5">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" />
            <span className="font-medium">Unable to load this version.</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {query.error instanceof Error ? query.error.message : 'Something went wrong.'}
          </p>
        </Card>
      )}

      {valid && query.data && (
        <>
          <Card className="mb-6 flex-row items-start gap-3 border-amber-500/40 bg-amber-500/10 p-4">
            <History className="mt-0.5 size-5 shrink-0 text-amber-500" />
            <div className="flex-1">
              <p className="text-sm text-foreground">
                You’re viewing <strong className="font-semibold">Version {query.data.revisionNumber}</strong> from{' '}
                {formatDate(query.data.createdAt)}. This is not the current version.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dr/docs/${slug}`}>Back to current version</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={`/dr/docs/${slug}/edit?fromRevision=${query.data.revisionNumber}`}>
                    <RotateCcw className="size-4" />
                    Restore this version
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          <article className="min-w-0">
            <header className="mb-8 border-b border-border pb-4">
              <h1 className="text-3xl font-bold tracking-tight">{query.data.title}</h1>
            </header>
            <DrDocRenderer content={query.data.content} />
          </article>
        </>
      )}
    </div>
  );
}

function VersionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-16 w-full animate-pulse rounded bg-muted" />
      <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
      <div className="mt-6 space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
        ))}
      </div>
    </div>
  );
}
