'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ChevronRight, FileText, Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDrDocs } from '@/lib/dr/useDrDocs';
import { useDrQueryErrorRedirect } from '@/lib/dr/useDrQueryErrorRedirect';
import DrDeleteDocDialog from './dr-delete-doc-dialog';
import type { DrDocSummary } from '@/schemas/drDocs';

// Render the ISO timestamp in the viewer's local timezone, medium date + short
// time (e.g. "Jun 14, 2026, 3:04 PM").
function formatUpdated(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(d);
}

export default function DrDocsListView() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useDrDocs();
  useDrQueryErrorRedirect(error);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Documentation</h1>
          <p className="mt-1 text-sm text-muted-foreground">Design docs and technical references.</p>
        </div>
        <Button asChild>
          <Link href="/dr/docs/new">
            <Plus className="size-4" />
            New Doc
          </Link>
        </Button>
      </div>

      {isLoading && <ListSkeleton />}

      {isError && !isLoading && (
        <Card className="items-start gap-3 p-5">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" />
            <span className="font-medium">Unable to load documents.</span>
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

      {!isLoading && !isError && data && data.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">No documents yet.</Card>
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <ul className="space-y-3">
          {data.map((doc) => (
            <DocRow key={doc.id} doc={doc} />
          ))}
        </ul>
      )}
    </div>
  );
}

function DocRow({ doc }: { doc: DrDocSummary }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  return (
    <li>
      <Link href={`/dr/docs/${doc.slug}`} className="group block">
        <Card className="flex-row items-center justify-between gap-4 p-4 transition-colors hover:border-primary/50 hover:bg-accent/40">
          <div className="flex min-w-0 items-start gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="size-4 text-primary" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate font-medium">{doc.title}</h2>
              {doc.summary && (
                <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{doc.summary}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                Last updated: {formatUpdated(doc.updatedAt)}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {doc.canDelete && (
              <button
                type="button"
                aria-label={`Delete ${doc.title}`}
                // Never trigger the row's navigation Link.
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDeleteOpen(true);
                }}
                className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100 max-sm:opacity-100"
              >
                <Trash2 className="size-4" />
              </button>
            )}
            <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </div>
        </Card>
      </Link>
      {doc.canDelete && (
        <DrDeleteDocDialog
          docId={doc.id}
          slug={doc.slug}
          title={doc.title}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onDeleted={() => {}}
        />
      )}
    </li>
  );
}

function ListSkeleton() {
  return (
    <ul className="space-y-3">
      {[0, 1, 2].map((i) => (
        <li key={i}>
          <Card className="flex-row items-center gap-3 p-4">
            <div className="size-9 shrink-0 animate-pulse rounded-lg bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
