'use client';

import { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useReplies } from '@/lib/dr/useDrFeedback';
import MessageItem from './message-item';
import MessageComposer from './message-composer';

const GROUP_WINDOW_MS = 5 * 60 * 1000;

interface ThreadPanelProps {
  messageId: string;
  conversationId: string;
  onClose: () => void;
}

// Reflect the panel: an inline right-hand column at lg+, a right-side overlay
// Sheet below lg. A media query decides which (rather than CSS visibility) so the
// Sheet's overlay never lingers on desktop.
function useIsDesktop(): boolean {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return desktop;
}

export default function ThreadPanel({ messageId, conversationId, onClose }: ThreadPanelProps) {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <aside className="flex w-[380px] shrink-0 flex-col border-l border-border">
        <ThreadPanelBody messageId={messageId} conversationId={conversationId} onClose={onClose} />
      </aside>
    );
  }

  return (
    <Sheet
      open
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <SheetContent side="right" className="flex w-full max-w-md flex-col p-0 sm:max-w-md">
        <SheetTitle className="sr-only">Thread</SheetTitle>
        <ThreadPanelBody messageId={messageId} conversationId={conversationId} />
      </SheetContent>
    </Sheet>
  );
}

// onClose renders an in-panel close button (desktop). In the Sheet variant the
// Sheet provides its own close control, so onClose is omitted.
function ThreadPanelBody({
  messageId,
  conversationId,
  onClose,
}: {
  messageId: string;
  conversationId: string;
  onClose?: () => void;
}) {
  const { data, isLoading } = useReplies(messageId);
  const replyCount = data?.parent.replyCount ?? data?.replies.length ?? 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h3 className="font-semibold text-foreground">Thread</h3>
          {replyCount > 0 && (
            <p className="text-xs text-muted-foreground">
              {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
            </p>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close thread"
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto pb-2">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : data ? (
          <>
            <MessageItem message={data.parent} grouped={false} onOpenThread={() => {}} hideThreadAffordance />
            {data.replies.length > 0 && (
              <div className="my-2 flex items-center gap-2 px-4">
                <span className="text-xs text-muted-foreground">
                  {data.replies.length} {data.replies.length === 1 ? 'reply' : 'replies'}
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>
            )}
            {data.replies.map((r, i) => {
              const prev = data.replies[i - 1];
              const grouped =
                !!prev &&
                prev.authorEmail === r.authorEmail &&
                new Date(r.createdAt).getTime() - new Date(prev.createdAt).getTime() < GROUP_WINDOW_MS;
              return <MessageItem key={r.id} message={r} grouped={grouped} onOpenThread={() => {}} hideThreadAffordance />;
            })}
          </>
        ) : (
          <p className="p-4 text-sm text-muted-foreground">This thread could not be loaded.</p>
        )}
      </div>

      <div className="border-t border-border p-3">
        <MessageComposer conversationId={conversationId} parentId={messageId} placeholder="Reply…" autoFocus />
      </div>
    </div>
  );
}
