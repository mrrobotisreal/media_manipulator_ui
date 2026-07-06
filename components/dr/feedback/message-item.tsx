'use client';

import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { relativeTime } from '@/lib/dr/relativeTime';
import type { DrMessage } from '@/schemas/drFeedback';
import MessageContent from './message-content';
import AttachmentStrip from './attachment-strip';
import { avatarInitial, displayNameFromEmail } from './display';

interface MessageItemProps {
  message: DrMessage;
  // Consecutive message from the same author within 5 minutes → hide the
  // avatar/name/timestamp header (Slack grouping).
  grouped: boolean;
  onOpenThread: (messageId: string) => void;
  // Hide the "reply in thread" affordance (e.g. inside the thread panel itself).
  hideThreadAffordance?: boolean;
}

export default function MessageItem({ message, grouped, onOpenThread, hideThreadAffordance }: MessageItemProps) {
  const name = displayNameFromEmail(message.authorEmail);

  return (
    <div className={cn('group relative flex gap-3 px-4 hover:bg-accent/20', grouped ? 'py-0.5' : 'mt-4 py-0.5')}>
      <div className="w-9 shrink-0">
        {!grouped && (
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">{avatarInitial(message.authorEmail)}</AvatarFallback>
          </Avatar>
        )}
      </div>

      <div className="min-w-0 flex-1">
        {!grouped && (
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-foreground">{name}</span>
            <span className="text-xs text-muted-foreground">{relativeTime(message.createdAt)}</span>
          </div>
        )}

        <MessageContent content={message.content} />
        <AttachmentStrip attachments={message.attachments} />

        {!hideThreadAffordance && message.replyCount > 0 && (
          <button
            type="button"
            onClick={() => onOpenThread(message.id)}
            className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-xs font-medium text-primary transition-colors hover:border-border hover:bg-accent/40"
          >
            <MessageSquare className="size-3.5" />
            {message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'}
            {message.lastReplyAt && (
              <span className="font-normal text-muted-foreground">· last reply {relativeTime(message.lastReplyAt)}</span>
            )}
          </button>
        )}
      </div>

      {!hideThreadAffordance && (
        <button
          type="button"
          onClick={() => onOpenThread(message.id)}
          className="absolute right-3 top-0 hidden items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground shadow-sm transition-colors hover:text-foreground group-hover:flex"
          aria-label="Reply in thread"
        >
          <MessageSquare className="size-3.5" />
          Reply
        </button>
      )}
    </div>
  );
}
