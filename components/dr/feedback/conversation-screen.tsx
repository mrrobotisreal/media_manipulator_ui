'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ConversationView from './conversation-view';
import ThreadPanel from './thread-panel';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// The conversation center pane: the message column plus (when ?thread is set) the
// right-hand thread panel. The conversation id is validated client-side; an
// obviously-malformed id renders a friendly not-found card without a round trip.
export default function ConversationScreen({ conversationId }: { conversationId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const threadId = searchParams.get('thread');

  if (!UUID_RE.test(conversationId)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="font-medium text-foreground">Conversation not found</p>
        <Link href="/dr/feedback" className="text-sm font-medium text-primary hover:underline">
          Back to Feedback
        </Link>
      </div>
    );
  }

  const openThread = (messageId: string) => router.push(`${pathname}?thread=${messageId}`);
  const closeThread = () => router.push(pathname);

  return (
    <div className="flex min-h-0 flex-1">
      <ConversationView conversationId={conversationId} onOpenThread={openThread} />
      {threadId && <ThreadPanel messageId={threadId} conversationId={conversationId} onClose={closeThread} />}
    </div>
  );
}
