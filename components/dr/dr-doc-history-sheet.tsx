'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { fetchDrDocRevisions } from '@/lib/dr/docEditorApi';
import { drQueryRetry } from '@/lib/dr/docsApi';

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(d);
}

interface DrDocHistorySheetProps {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Version-history sheet. Queries the document's revisions when opened; newest
// first with the top row marked "Current". Non-current rows link to the
// read-only version page; the current row just closes the sheet.
export default function DrDocHistorySheet({ slug, open, onOpenChange }: DrDocHistorySheetProps) {
  const query = useQuery({
    queryKey: ['dr', 'docs', slug, 'revisions'],
    queryFn: () => fetchDrDocRevisions(slug),
    enabled: open,
    retry: drQueryRetry,
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Version history</SheetTitle>
          <SheetDescription>Every published change adds a version. History is never rewritten.</SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
          {query.isLoading && (
            <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading versions…
            </div>
          )}

          {query.isError && (
            <div className="flex items-start gap-2 py-6 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>{query.error instanceof Error ? query.error.message : 'Could not load versions.'}</span>
            </div>
          )}

          {query.data && query.data.length === 0 && (
            <p className="py-6 text-sm text-muted-foreground">No versions yet.</p>
          )}

          {query.data && query.data.length > 0 && (
            <ul className="space-y-1 py-2">
              {query.data.map((rev) =>
                rev.isCurrent ? (
                  <li key={rev.revisionNumber}>
                    <button
                      type="button"
                      onClick={() => onOpenChange(false)}
                      className="flex w-full flex-col items-start gap-0.5 rounded-md border border-transparent px-3 py-2 text-left transition-colors hover:bg-accent/50"
                    >
                      <span className="flex items-center gap-2 text-sm font-medium">
                        Version {rev.revisionNumber}
                        <Badge variant="secondary">Current</Badge>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(rev.createdAt)} · {rev.createdBy ?? 'seed'}
                      </span>
                    </button>
                  </li>
                ) : (
                  <li key={rev.revisionNumber}>
                    <Link
                      href={`/dr/docs/${slug}/versions/${rev.revisionNumber}`}
                      onClick={() => onOpenChange(false)}
                      className="flex w-full flex-col items-start gap-0.5 rounded-md border border-transparent px-3 py-2 text-left transition-colors hover:border-primary/40 hover:bg-accent/50"
                    >
                      <span className="text-sm font-medium">Version {rev.revisionNumber}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(rev.createdAt)} · {rev.createdBy ?? 'seed'}
                      </span>
                    </Link>
                  </li>
                ),
              )}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
