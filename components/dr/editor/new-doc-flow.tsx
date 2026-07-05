'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDrDoc } from '@/lib/dr/useDrDoc';
import { useDrQueryErrorRedirect } from '@/lib/dr/useDrQueryErrorRedirect';
import { DrApiError } from '@/lib/dr/apiClient';
import { createDrDoc, publishDrDoc, updateDrDoc } from '@/lib/dr/docEditorApi';
import DrDocEditor, { type DrEditorFlow } from './dr-doc-editor';

// Client flow for /dr/docs/new:
//  - no ?draft param  → create a draft once, seed the cache, replace the URL
//                       with ?draft={placeholderSlug}
//  - ?draft={slug}    → load that draft (GetDoc serves drafts) and mount the
//                       editor. 401/403 redirect to sign-in; 404 shows an error
//                       card with a "Start a new doc" action.
export default function NewDocFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const draftSlug = searchParams.get('draft');

  const creatingRef = useRef(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    if (draftSlug || creatingRef.current) return;
    creatingRef.current = true;
    setCreateError(null);
    void createDrDoc()
      .then((doc) => {
        // Seed the query cache so the reload path doesn't re-fetch immediately.
        queryClient.setQueryData(['dr', 'docs', doc.slug], doc);
        router.replace(`/dr/docs/new?draft=${encodeURIComponent(doc.slug)}`);
      })
      .catch((err) => {
        creatingRef.current = false;
        if (err instanceof DrApiError && err.status === 401) {
          router.replace('/dr/auth');
          return;
        }
        setCreateError(err instanceof Error ? err.message : 'Failed to start a new document');
      });
  }, [draftSlug, router, queryClient]);

  const query = useDrDoc(draftSlug ?? '');
  useDrQueryErrorRedirect(query.error);

  if (createError) {
    return <ErrorCard message={createError} onRetry={() => router.replace('/dr/docs/new')} />;
  }

  if (!draftSlug || query.isLoading) {
    return <FlowSkeleton />;
  }

  if (query.isError) {
    const notFound = query.error instanceof DrApiError && query.error.status === 404;
    if (notFound) {
      return (
        <Card className="items-center gap-2 p-8 text-center">
          <p className="font-medium">Draft not found</p>
          <p className="text-sm text-muted-foreground">This draft may have been published or removed.</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => router.replace('/dr/docs/new')}>
            Start a new doc
          </Button>
        </Card>
      );
    }
    return (
      <ErrorCard
        message={query.error instanceof Error ? query.error.message : 'Something went wrong.'}
        onRetry={() => query.refetch()}
      />
    );
  }

  if (query.data) {
    const doc = query.data;
    // Create flow: autosave/publish target the draft id; on publish, invalidate
    // the list, toast, and redirect to the freshly-derived slug (unchanged
    // behavior from before the editor refactor).
    const flow: DrEditorFlow = {
      docId: doc.id,
      initial: { title: doc.title, summary: doc.summary, content: doc.content },
      publishLabel: 'Publish',
      save: (update) => updateDrDoc(doc.id, update),
      publish: () => publishDrDoc(doc.id),
      onPublished: (published) => {
        void queryClient.invalidateQueries({ queryKey: ['dr', 'docs'] });
        toast.success('Document published');
        router.push(`/dr/docs/${published.slug}`);
      },
    };
    return <DrDocEditor flow={flow} />;
  }

  return <FlowSkeleton />;
}

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card className="items-start gap-3 p-5">
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="size-5" />
        <span className="font-medium">Unable to open the editor.</span>
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </Card>
  );
}

function FlowSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Preparing editor…
      </div>
      <div className="space-y-4">
        <div className="h-9 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
        <div className="mt-6 space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}
