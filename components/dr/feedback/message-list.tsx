'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, Loader2 } from 'lucide-react';
import { flattenMessages, useFeedbackActions, useMessages } from '@/lib/dr/useDrFeedback';
import MessageItem from './message-item';

const GROUP_WINDOW_MS = 5 * 60 * 1000;

interface MessageListProps {
  conversationId: string;
  onOpenThread: (messageId: string) => void;
  emptyState: React.ReactNode;
}

// Reverse-infinite message list: render oldest→newest, load older when the top
// sentinel enters view (preserving scroll position), stick to the bottom for new
// messages only when the user is already near the bottom (otherwise show a "New
// messages ↓" pill), group consecutive same-author messages within 5 minutes,
// and mark the conversation read (debounced) when a new message arrives while the
// tab is visible and the view is at the bottom.
export default function MessageList({ conversationId, onOpenThread, emptyState }: MessageListProps) {
  const query = useMessages(conversationId);
  const { markRead } = useFeedbackActions();
  const messages = useMemo(() => flattenMessages(query.data), [query.data]);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef(true);
  const [showNewPill, setShowNewPill] = useState(false);
  const stateRef = useRef({ firstId: null as string | null, lastId: null as string | null, count: 0, prepending: false, anchorHeight: 0, anchorTop: 0 });

  const scrollToBottom = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    atBottomRef.current = true;
    setShowNewPill(false);
  }, []);

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    atBottomRef.current = dist < 80;
    if (atBottomRef.current && showNewPill) setShowNewPill(false);
  };

  // Initial scroll to bottom + append/prepend positioning.
  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const s = stateRef.current;
    const first = messages[0]?.id ?? null;
    const last = messages[messages.length - 1]?.id ?? null;

    if (s.count === 0 && messages.length > 0) {
      el.scrollTop = el.scrollHeight; // initial load
    } else if (s.prepending && first !== s.firstId) {
      // Older messages prepended — keep the viewport anchored where it was.
      el.scrollTop = el.scrollHeight - s.anchorHeight + s.anchorTop;
      s.prepending = false;
    } else if (last !== s.lastId && messages.length > s.count) {
      const newest = messages[messages.length - 1];
      if (atBottomRef.current || newest?.isMine) {
        el.scrollTop = el.scrollHeight;
        setShowNewPill(false);
      } else {
        setShowNewPill(true);
      }
    }
    s.firstId = first;
    s.lastId = last;
    s.count = messages.length;
  }, [messages]);

  // Load older when the top sentinel scrolls into view.
  useEffect(() => {
    const sentinel = topSentinelRef.current;
    const scroller = scrollerRef.current;
    if (!sentinel || !scroller) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
          const s = stateRef.current;
          s.prepending = true;
          s.anchorHeight = scroller.scrollHeight;
          s.anchorTop = scroller.scrollTop;
          void query.fetchNextPage();
        }
      },
      { root: scroller, threshold: 0 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
    // Depend on the specific query fields (not the whole query object, which is a
    // fresh reference each render and would rebuild the observer every time).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage, messages.length]);

  // Mark read on mount / conversation switch.
  useEffect(() => {
    void markRead(conversationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // Mark read (debounced) when the newest message changes while visible + at bottom.
  const newestId = messages[messages.length - 1]?.id ?? null;
  useEffect(() => {
    if (!newestId) return;
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
    if (!atBottomRef.current) return;
    const t = setTimeout(() => void markRead(conversationId), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newestId, conversationId]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div ref={scrollerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
        <div ref={topSentinelRef} className="h-px" />

        {query.isFetchingNextPage && (
          <div className="flex justify-center py-2 text-xs text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
          </div>
        )}

        {query.isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          emptyState
        ) : (
          <div className="pb-4">
            {messages.map((m, i) => {
              const prev = messages[i - 1];
              const grouped =
                !!prev &&
                prev.authorEmail === m.authorEmail &&
                prev.parentId === m.parentId &&
                new Date(m.createdAt).getTime() - new Date(prev.createdAt).getTime() < GROUP_WINDOW_MS;
              return <MessageItem key={m.id} message={m} grouped={grouped} onOpenThread={onOpenThread} />;
            })}
          </div>
        )}
      </div>

      {showNewPill && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg"
        >
          <ArrowDown className="size-3.5" />
          New messages
        </button>
      )}
    </div>
  );
}
