'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { AlertTriangle, Info, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDrDoc } from '@/lib/dr/useDrDoc';
import { useDrQueryErrorRedirect } from '@/lib/dr/useDrQueryErrorRedirect';
import { useDrAuthState } from '@/lib/dr/auth';
import { DrApiError } from '@/lib/dr/apiClient';
import {
  discardDrDocEdit,
  publishDrDocEdit,
  startDrDocEdit,
  updateDrDocEdit,
} from '@/lib/dr/docEditorApi';
import type { DrEditSession } from '@/schemas/drDocs';
import DrDocEditor, { type DrEditorFlow } from './dr-doc-editor';

// Client flow for /dr/docs/{slug}/edit. Fetches the doc (for its id + guards),
// starts/resumes its single edit session (honoring ?fromRevision for the restore
// path, with a confirm-replace dance on 409), then mounts the shared editor with
// the edit-flow strategy.
export default function EditDocFlow({ slug }: { slug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user } = useDrAuthState();
  const currentEmail = user?.email ?? '';

  const fromRevisionRaw = searchParams.get('fromRevision');
  const fromRevision = fromRevisionRaw && /^\d+$/.test(fromRevisionRaw) ? Number(fromRevisionRaw) : undefined;

  const docQuery = useDrDoc(slug);
  useDrQueryErrorRedirect(docQuery.error);

  const [session, setSession] = useState<DrEditSession | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const [confirmReplace, setConfirmReplace] = useState(false);
  const startedRef = useRef(false);

  const doc = docQuery.data;
  const docId = doc?.id;

  // Kicks off the start/resume request; state updates live in the promise
  // callbacks (not the synchronous body) so this is safe to call from an effect.
  const runStart = useCallback(
    (replace: boolean) => {
      if (!docId) return;
      startDrDocEdit(docId, { fromRevision, replace })
        .then((s) => {
          setSession(s);
          setConfirmReplace(false);
        })
        .catch((err) => {
          if (err instanceof DrApiError && err.status === 409) {
            // A session already exists and we asked to seed from a revision.
            setConfirmReplace(true);
            return;
          }
          if (err instanceof DrApiError && err.status === 401) {
            router.replace('/dr/auth');
            return;
          }
          setStartError(err instanceof Error ? err.message : 'Failed to start editing');
        });
    },
    [docId, fromRevision, router],
  );

  useEffect(() => {
    if (!docId || startedRef.current) return;
    if (doc && doc.status !== 'published') return; // non-published handled in render
    startedRef.current = true;
    runStart(false);
  }, [docId, doc, runStart]);

  if (docQuery.isLoading) {
    return <FlowSkeleton />;
  }

  if (docQuery.isError) {
    const notFound = docQuery.error instanceof DrApiError && docQuery.error.status === 404;
    return (
      <ErrorCard
        message={notFound ? 'This document may have been moved or removed.' : docQuery.error instanceof Error ? docQuery.error.message : 'Something went wrong.'}
        backSlug={notFound ? undefined : slug}
      />
    );
  }

  if (doc && doc.status !== 'published') {
    return <ErrorCard message="Only published documents can be edited here." backSlug={slug} />;
  }

  if (startError) {
    return <ErrorCard message={startError} backSlug={slug} />;
  }

  if (confirmReplace) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <Card className="items-start gap-3 p-5">
          <p className="font-medium">Replace the current editing session?</p>
          <p className="text-sm text-muted-foreground">
            An editing session is already in progress for this document.{' '}
            {fromRevision ? `Restoring Version ${fromRevision}` : 'Starting over'} will discard those unpublished
            changes.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push(`/dr/docs/${slug}`)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => runStart(true)}>
              Replace &amp; continue
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!session || !docId) {
    return <FlowSkeleton />;
  }

  const flow: DrEditorFlow = {
    docId,
    initial: { title: session.title, summary: session.summary, content: session.content },
    publishLabel: 'Publish changes',
    save: (update) => updateDrDocEdit(docId, update),
    publish: () => publishDrDocEdit(docId),
    onPublished: (published) => {
      void queryClient.invalidateQueries({ queryKey: ['dr', 'docs'] });
      void queryClient.invalidateQueries({ queryKey: ['dr', 'docs', slug] });
      toast.success('Changes published');
      router.push(`/dr/docs/${published.slug}`);
    },
    headerExtras: (
      <EditHeaderExtras
        docId={docId}
        sessionCreatedBy={session.createdBy}
        currentEmail={currentEmail}
        onDiscarded={() => {
          void queryClient.invalidateQueries({ queryKey: ['dr', 'docs', slug] });
          router.push(`/dr/docs/${slug}`);
        }}
      />
    ),
  };

  return <DrDocEditor flow={flow} />;
}

// "Discard changes" + the resume note (shown when the session was started by the
// other portal user).
function EditHeaderExtras({
  docId,
  sessionCreatedBy,
  currentEmail,
  onDiscarded,
}: {
  docId: string;
  sessionCreatedBy: string;
  currentEmail: string;
  onDiscarded: () => void;
}) {
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [discarding, setDiscarding] = useState(false);

  const resumingOther =
    !!sessionCreatedBy && !!currentEmail && sessionCreatedBy.toLowerCase() !== currentEmail.toLowerCase();

  const doDiscard = async () => {
    setDiscarding(true);
    try {
      await discardDrDocEdit(docId);
      toast.success('Changes discarded');
      setConfirmDiscard(false);
      onDiscarded();
    } catch (err) {
      toast.error('Could not discard changes', { description: err instanceof Error ? err.message : undefined });
      setDiscarding(false);
    }
  };

  return (
    <>
      {resumingOther && (
        <span
          className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex"
          title={`Resuming an editing session started by ${sessionCreatedBy}`}
        >
          <Info className="size-3.5" />
          Resuming {sessionCreatedBy}&rsquo;s session
        </span>
      )}
      <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setConfirmDiscard(true)}>
        Discard changes
      </Button>
      <AlertDialog open={confirmDiscard} onOpenChange={(next) => !discarding && setConfirmDiscard(next)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard all unpublished changes?</AlertDialogTitle>
            <AlertDialogDescription>
              The published document is unaffected. Your staged edits will be permanently discarded.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={discarding}>Keep editing</AlertDialogCancel>
            <Button variant="destructive" onClick={doDiscard} disabled={discarding}>
              {discarding && <Loader2 className="size-4 animate-spin" />}
              Discard changes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ErrorCard({ message, backSlug }: { message: string; backSlug?: string }) {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <Card className="items-start gap-3 p-5">
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="size-5" />
          <span className="font-medium">Unable to open the editor.</span>
        </div>
        <p className="text-sm text-muted-foreground">{message}</p>
        <Button asChild variant="outline" size="sm">
          <Link href={backSlug ? `/dr/docs/${backSlug}` : '/dr/docs'}>
            {backSlug ? 'Back to document' : 'Back to Documentation'}
          </Link>
        </Button>
      </Card>
    </div>
  );
}

function FlowSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Opening editor…
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
