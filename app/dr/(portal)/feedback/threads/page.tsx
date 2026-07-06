import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import FeedbackShell from '@/components/dr/feedback/feedback-shell';
import ThreadsView from '@/components/dr/feedback/threads-view';

// /dr/feedback/threads — the Threads view in the center pane. The shell reads the
// ?thread search param, so it sits under a Suspense boundary.
export default function DrFeedbackThreadsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
        </div>
      }
    >
      <FeedbackShell>
        <ThreadsView />
      </FeedbackShell>
    </Suspense>
  );
}
