'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DrDocRenderer from './doc-renderer';
import { useDrDoc } from '@/lib/dr/useDrDoc';
import { useDrQueryErrorRedirect } from '@/lib/dr/useDrQueryErrorRedirect';
import { DrApiError } from '@/lib/dr/docsApi';

function formatUpdated(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(d);
}

export default function DrDocViewer({ slug }: { slug: string }) {
  const { data, isLoading, isError, error, refetch, isRefetching } = useDrDoc(slug);
  useDrQueryErrorRedirect(error);

  const isNotFound = error instanceof DrApiError && error.status === 404;

  return (
    <article className="mx-auto w-full max-w-3xl">
      <Link
        href="/dr/docs"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Documentation
      </Link>

      {isLoading && <ViewerSkeleton />}

      {isError && isNotFound && !isLoading && (
        <Card className="items-center gap-2 p-8 text-center">
          <p className="font-medium">Document not found</p>
          <p className="text-sm text-muted-foreground">This document may have been moved or removed.</p>
          <Button asChild variant="outline" size="sm" className="mt-2">
            <Link href="/dr/docs">Back to Documentation</Link>
          </Button>
        </Card>
      )}

      {isError && !isNotFound && !isLoading && (
        <Card className="items-start gap-3 p-5">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" />
            <span className="font-medium">Unable to load this document.</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Something went wrong.'}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isRefetching}>
            {isRefetching && <Loader2 className="size-4 animate-spin" />}
            Retry
          </Button>
        </Card>
      )}

      {!isLoading && !isError && data && (
        <>
          <header className="mb-8 border-b border-border pb-4">
            <h1 className="text-3xl font-bold tracking-tight">{data.title}</h1>
            {data.summary && <p className="mt-2 text-muted-foreground">{data.summary}</p>}
            <p className="mt-2 text-sm text-muted-foreground">
              Last updated: {formatUpdated(data.updatedAt)}
            </p>
          </header>
          <DrDocRenderer content={data.content} />
        </>
      )}
    </article>
  );
}

function ViewerSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
      <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
      <div className="mt-6 space-y-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
        ))}
      </div>
    </div>
  );
}
