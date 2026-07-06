'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Hash, Loader2, MessageSquare } from 'lucide-react';
import { flattenThreads, useThreads } from '@/lib/dr/useDrFeedback';
import { relativeTime } from '@/lib/dr/relativeTime';
import { EmptyThreads } from './empty-states';
import { avatarInitial, displayNameFromEmail, messagePlainText } from './display';
import { markThreadsSeen } from './threadsSeen';

// The /dr/feedback/threads center pane: an infinite list of thread cards,
// newest-activity first. Clicking a card deep-links to the conversation with the
// thread panel open.
export default function ThreadsView() {
  const query = useThreads();
  const threads = flattenThreads(query.data);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const newest = threads[0]?.lastReplyAt ?? null;

  // Opening / staying on this view clears the sidebar's activity dot.
  useEffect(() => {
    markThreadsSeen();
  }, [newest]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
        void query.fetchNextPage();
      }
    });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Link
          href="/dr/feedback"
          className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <MessageSquare className="size-5 text-muted-foreground" />
        <h2 className="font-semibold text-foreground">Threads</h2>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {query.isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : threads.length === 0 ? (
          <EmptyThreads />
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-2">
            {threads.map((t) => {
              const label =
                t.conversationKind === 'channel'
                  ? `#${t.conversationName ?? ''}`
                  : t.dmPartnerEmail
                    ? displayNameFromEmail(t.dmPartnerEmail)
                    : 'Direct message';
              const preview = messagePlainText(t.message.content) || (t.message.attachments.length > 0 ? 'Shared an attachment' : '');
              return (
                <Link
                  key={t.message.id}
                  href={`/dr/feedback/c/${t.conversationId}?thread=${t.message.id}`}
                  className="rounded-lg border border-border p-3 transition-colors hover:border-primary/40 hover:bg-accent/30"
                >
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {t.conversationKind === 'channel' && <Hash className="size-3.5" />}
                    <span className="font-medium text-foreground/70">{label}</span>
                    <span>· {relativeTime(t.lastReplyAt)}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary">
                      {avatarInitial(t.message.authorEmail)}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{displayNameFromEmail(t.message.authorEmail)}</span>
                  </div>
                  {preview && <p className="mt-1 line-clamp-2 text-sm text-foreground/80">{preview}</p>}
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary">
                    <MessageSquare className="size-3.5" />
                    {t.replyCount} {t.replyCount === 1 ? 'reply' : 'replies'}
                    <span className="font-normal text-muted-foreground">· last reply {relativeTime(t.lastReplyAt)}</span>
                  </div>
                </Link>
              );
            })}
            {query.hasNextPage && <div ref={sentinelRef} className="h-6" />}
            {query.isFetchingNextPage && (
              <div className="flex justify-center py-2">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
