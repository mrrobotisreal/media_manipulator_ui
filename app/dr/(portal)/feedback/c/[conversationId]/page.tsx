import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import FeedbackShell from '@/components/dr/feedback/feedback-shell';
import ConversationScreen from '@/components/dr/feedback/conversation-screen';

// /dr/feedback/c/[conversationId] — a channel or DM in the center pane, with an
// optional right-hand thread panel driven by ?thread. Next 16: `params` is a
// Promise. The shell + screen read search params, so they sit under a Suspense
// boundary.
export default async function DrFeedbackConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
        </div>
      }
    >
      <FeedbackShell>
        <ConversationScreen conversationId={conversationId} />
      </FeedbackShell>
    </Suspense>
  );
}
