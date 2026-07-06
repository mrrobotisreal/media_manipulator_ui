'use client';

import { useSearchParams } from 'next/navigation';
import { useFeedbackEvents } from '@/lib/dr/useFeedbackEvents';
import FeedbackSidebar from './feedback-sidebar';

// The three-pane client layout used by all feedback routes: a fixed-width
// sidebar (hidden below md, where navigation happens as pages) + the center pane
// (children). Mounts the SSE nudge consumer exactly once, telling it which thread
// (if any) is open so a reply to it is invalidated live.
export default function FeedbackShell({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const openThreadId = searchParams.get('thread');
  useFeedbackEvents(openThreadId);

  return (
    <div className="flex min-h-0 w-full flex-1">
      <div className="hidden w-[260px] shrink-0 border-r border-border md:flex md:flex-col">
        <FeedbackSidebar />
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
