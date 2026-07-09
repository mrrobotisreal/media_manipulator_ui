import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import ChatLabShell from '@/components/dr/chatlab/chat-lab-shell';
import StatsView from '@/components/dr/chatlab/stats/stats-view';

// /dr/demos/chat-lab/stats — usage & spend analytics + the credit ledger.
export default function DrChatLabStatsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
        </div>
      }
    >
      <ChatLabShell>
        <StatsView />
      </ChatLabShell>
    </Suspense>
  );
}
