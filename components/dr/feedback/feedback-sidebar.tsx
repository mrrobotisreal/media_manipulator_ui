'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hash, MessagesSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { flattenThreads, useConversations, useThreads } from '@/lib/dr/useDrFeedback';
import NewChannelDialog from './new-channel-dialog';
import NewDmDialog from './new-dm-dialog';
import { avatarInitial, displayNameFromEmail } from './display';
import { getThreadsSeen, THREADS_SEEN_EVENT } from './threadsSeen';

const rowBase =
  'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-accent/50';
const rowActive = 'bg-accent font-medium text-foreground';

export default function FeedbackSidebar() {
  const pathname = usePathname();
  const { data: conversations } = useConversations();
  const threadsQuery = useThreads();

  const activeId = useMemo(() => pathname?.match(/^\/dr\/feedback\/c\/([^/?]+)/)?.[1] ?? null, [pathname]);
  const threadsActive = pathname === '/dr/feedback/threads';

  const channels = (conversations ?? []).filter((c) => c.kind === 'channel');
  const dms = (conversations ?? []).filter((c) => c.kind === 'dm');

  // Threads activity dot: show when the newest thread reply post-dates the last
  // time the user opened the Threads view.
  const [seenAt, setSeenAt] = useState<string | null>(null);
  useEffect(() => {
    const sync = () => setSeenAt(getThreadsSeen());
    sync();
    window.addEventListener(THREADS_SEEN_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(THREADS_SEEN_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  const newestThreadAt = useMemo(() => {
    const t = flattenThreads(threadsQuery.data);
    return t.length > 0 ? t[0].lastReplyAt : null;
  }, [threadsQuery.data]);
  const threadsDot = !threadsActive && !!newestThreadAt && (!seenAt || newestThreadAt > seenAt);

  return (
    <nav className="flex h-full w-full flex-col overflow-y-auto p-2">
      <Link href="/dr/feedback/threads" className={cn(rowBase, threadsActive && rowActive)}>
        <MessagesSquare className="size-4" />
        <span className="flex-1">Threads</span>
        {threadsDot && <span className="size-2 rounded-full bg-primary" aria-label="New thread activity" />}
      </Link>

      <Section title="Channels" action={<NewChannelDialog />}>
        {channels.map((c) => (
          <Link key={c.id} href={`/dr/feedback/c/${c.id}`} className={cn(rowBase, activeId === c.id && rowActive)}>
            <Hash className="size-4 shrink-0 text-muted-foreground" />
            <span className={cn('min-w-0 flex-1 truncate', c.unreadCount > 0 && 'font-semibold text-foreground')}>{c.name}</span>
            {c.unreadCount > 0 && <UnreadBadge count={c.unreadCount} />}
          </Link>
        ))}
        {channels.length === 0 && <p className="px-2 py-1 text-xs text-muted-foreground">No channels yet.</p>}
      </Section>

      <Section title="Direct Messages" action={<NewDmDialog />}>
        {dms.map((c) => {
          const partner = c.dmPartnerEmail ? displayNameFromEmail(c.dmPartnerEmail) : 'Direct message';
          return (
            <Link key={c.id} href={`/dr/feedback/c/${c.id}`} className={cn(rowBase, activeId === c.id && rowActive)}>
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary">
                {c.dmPartnerEmail ? avatarInitial(c.dmPartnerEmail) : '?'}
              </span>
              <span className={cn('min-w-0 flex-1 truncate', c.unreadCount > 0 && 'font-semibold text-foreground')}>{partner}</span>
              {c.unreadCount > 0 && <UnreadBadge count={c.unreadCount} />}
            </Link>
          );
        })}
        {dms.length === 0 && <p className="px-2 py-1 text-xs text-muted-foreground">No direct messages yet.</p>}
      </Section>
    </nav>
  );
}

function Section({ title, action, children }: { title: string; action: ReactNode; children: ReactNode }) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</span>
        {action}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function UnreadBadge({ count }: { count: number }) {
  return <Badge className="h-5 min-w-5 shrink-0 justify-center px-1.5 text-[11px]">{count > 99 ? '99+' : count}</Badge>;
}
