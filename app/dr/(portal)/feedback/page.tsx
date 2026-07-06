import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import FeedbackShell from '@/components/dr/feedback/feedback-shell';
import FeedbackSidebar from '@/components/dr/feedback/feedback-sidebar';
import { EmptyPickConversation } from '@/components/dr/feedback/empty-states';

// /dr/feedback — the Communication/Feedback workspace root. On md+ the sidebar
// (rendered by the shell) sits beside an empty "pick a conversation" state; below
// md the sidebar IS the screen (navigating to a conversation replaces it).
// The shell reads the ?thread search param, so it sits under a Suspense boundary.
export default function DrFeedbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
        </div>
      }
    >
      <FeedbackShell>
        {/* Mobile: the sidebar is the page. */}
        <div className="flex min-h-0 flex-1 md:hidden">
          <FeedbackSidebar />
        </div>
        {/* Desktop: prompt to pick a conversation. */}
        <div className="hidden min-h-0 flex-1 md:flex">
          <EmptyPickConversation />
        </div>
      </FeedbackShell>
    </Suspense>
  );
}
