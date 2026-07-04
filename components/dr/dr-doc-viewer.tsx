'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DrDocRenderer from './doc-renderer';
import CommentsSidebar, { type CommentDraft } from './comments/comments-sidebar';
import CommentPopover from './comments/comment-popover';
import { useDrDoc } from '@/lib/dr/useDrDoc';
import { useDrComments, useDrCommentActions } from '@/lib/dr/useDrComments';
import { useDrQueryErrorRedirect } from '@/lib/dr/useDrQueryErrorRedirect';
import { DrApiError } from '@/lib/dr/docsApi';
import { useDrAuthState } from '@/lib/dr/auth';
import { computeTextAnchor } from '@/lib/dr/domSelection';
import type { DrCommentAnchor } from '@/schemas/drComments';

function formatUpdated(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(d);
}

interface Popover {
  rect: DOMRect;
  anchor: DrCommentAnchor;
}

export default function DrDocViewer({ slug }: { slug: string }) {
  const { data, isLoading, isError, error, refetch, isRefetching } = useDrDoc(slug);
  useDrQueryErrorRedirect(error);

  const commentsQuery = useDrComments(slug);
  const actions = useDrCommentActions(slug);
  const { user } = useDrAuthState();
  const currentUserEmail = user?.email ?? '';

  const articleRef = useRef<HTMLDivElement>(null);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CommentDraft | null>(null);
  const [pendingAnchor, setPendingAnchor] = useState<DrCommentAnchor | null>(null);
  const [popover, setPopover] = useState<Popover | null>(null);

  const comments = commentsQuery.data ?? [];
  const content = data?.content ?? null;

  const dismissPopover = useCallback(() => {
    setPopover(null);
    setPendingAnchor((prev) => (draft ? prev : null));
  }, [draft]);

  const handleMouseUp = useCallback(() => {
    if (draft || !content) return; // one draft at a time
    const article = articleRef.current;
    const sel = window.getSelection();
    if (!article || !sel || sel.isCollapsed || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (!article.contains(range.commonAncestorContainer)) return;
    const anchor = computeTextAnchor(content, article, range);
    if (!anchor) {
      setPopover(null);
      return;
    }
    setPendingAnchor(anchor);
    setPopover({ rect: range.getBoundingClientRect(), anchor });
  }, [draft, content]);

  const handleBlockContextMenu = useCallback(
    (blockIndex: number, rect: DOMRect) => {
      if (draft) return;
      setPopover({ rect, anchor: { type: 'block', blockIndex } });
    },
    [draft],
  );

  const handleAdd = useCallback(async () => {
    if (!popover) return;
    const anchor = popover.anchor;
    setPopover(null);
    setPendingAnchor(anchor);
    try {
      const commentId = await actions.createDraftComment(anchor);
      setDraft({ commentId, anchor });
      setActiveCommentId(null);
      window.getSelection()?.removeAllRanges();
    } catch (err) {
      setPendingAnchor(null);
      toast.error('Could not start comment', {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  }, [popover, actions]);

  const onDraftResolved = useCallback(() => {
    setDraft(null);
    setPendingAnchor(null);
  }, []);

  const isNotFound = error instanceof DrApiError && error.status === 404;

  return (
    <div className="mx-auto w-full max-w-6xl">
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

      {!isLoading && !isError && data && content && (
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
          <article ref={articleRef} onMouseUp={handleMouseUp} className="min-w-0">
            <header className="mb-8 border-b border-border pb-4">
              <h1 className="text-3xl font-bold tracking-tight">{data.title}</h1>
              {data.summary && <p className="mt-2 text-muted-foreground">{data.summary}</p>}
              <p className="mt-2 text-sm text-muted-foreground">Last updated: {formatUpdated(data.updatedAt)}</p>
            </header>
            <DrDocRenderer
              content={content}
              comments={comments}
              pendingAnchor={pendingAnchor}
              activeCommentId={activeCommentId}
              onActivateComment={setActiveCommentId}
              onBlockContextMenu={handleBlockContextMenu}
            />
          </article>

          <aside className="mt-10 lg:mt-0">
            <h2 className="mb-3 text-sm font-semibold tracking-tight text-muted-foreground">Comments</h2>
            <CommentsSidebar
              content={content}
              comments={comments}
              articleRef={articleRef}
              activeCommentId={activeCommentId}
              onActivate={setActiveCommentId}
              currentUserEmail={currentUserEmail}
              actions={actions}
              draft={draft}
              onDraftResolved={onDraftResolved}
            />
          </aside>
        </div>
      )}

      <CommentPopover rect={popover?.rect ?? null} onAdd={handleAdd} onDismiss={dismissPopover} />
    </div>
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
