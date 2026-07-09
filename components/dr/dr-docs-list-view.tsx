'use client';

import Link from 'next/link';
import { AlertTriangle, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDrDocFolders, useDrDocs } from '@/lib/dr/useDrDocs';
import { useDrQueryErrorRedirect } from '@/lib/dr/useDrQueryErrorRedirect';
import DocsExplorer from './docs-explorer/doc-tree';

// The Documentation index: header + New Doc affordance (unchanged) above the
// VS Code-style file explorer (components/dr/docs-explorer) that replaced the
// flat list — nestable folders, context menus, drag-and-drop.

export default function DrDocsListView() {
  const docsQuery = useDrDocs();
  const foldersQuery = useDrDocFolders();
  useDrQueryErrorRedirect(docsQuery.error);

  const isLoading = docsQuery.isLoading || foldersQuery.isLoading;
  const isError = docsQuery.isError || foldersQuery.isError;
  const error = docsQuery.error ?? foldersQuery.error;
  const retry = () => {
    if (docsQuery.isError) void docsQuery.refetch();
    if (foldersQuery.isError) void foldersQuery.refetch();
  };

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

      {isLoading && <TreeSkeleton />}

      {isError && !isLoading && (
        <Card className="items-start gap-3 p-5">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" />
            <span className="font-medium">Unable to load documents.</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Something went wrong.'}
          </p>
          <Button variant="outline" size="sm" onClick={retry} disabled={docsQuery.isRefetching || foldersQuery.isRefetching}>
            {(docsQuery.isRefetching || foldersQuery.isRefetching) && <Loader2 className="size-4 animate-spin" />}
            Retry
          </Button>
        </Card>
      )}

      {!isLoading && !isError && docsQuery.data && foldersQuery.data && (
        <DocsExplorer folders={foldersQuery.data} docs={docsQuery.data} />
      )}
    </div>
  );
}

function TreeSkeleton() {
  return (
    <div className="space-y-1 rounded-lg border border-border/60 bg-card/40 p-2">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-2 px-2 py-1.5" style={{ paddingLeft: `${8 + (i % 3) * 16}px` }}>
          <div className="size-4 shrink-0 animate-pulse rounded bg-muted" />
          <div className={`h-4 animate-pulse rounded bg-muted ${i % 2 ? 'w-1/3' : 'w-1/4'}`} />
        </div>
      ))}
    </div>
  );
}
