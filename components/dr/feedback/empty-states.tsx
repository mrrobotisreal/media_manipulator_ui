'use client';

import { MessagesSquare, Hash, Inbox } from 'lucide-react';

// Center-pane empty states for the feedback workspace.

function EmptyShell({ icon, title, hint }: { icon: React.ReactNode; title: string; hint?: string }) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">{icon}</div>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

export function EmptyPickConversation() {
  return (
    <EmptyShell
      icon={<MessagesSquare className="size-6 text-primary" />}
      title="Pick a conversation"
      hint="Choose a channel or direct message from the left, or start a new one."
    />
  );
}

export function EmptyChannel({ label }: { label: string }) {
  return (
    <EmptyShell
      icon={<Hash className="size-6 text-primary" />}
      title={`This is the start of ${label}`}
      hint="Be the first to say something."
    />
  );
}

export function EmptyThreads() {
  return (
    <EmptyShell
      icon={<Inbox className="size-6 text-primary" />}
      title="No threads yet"
      hint="Reply to a message to start a thread — it'll show up here."
    />
  );
}
