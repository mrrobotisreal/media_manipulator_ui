'use client';

import Link from 'next/link';
import { ArrowLeft, Hash, Loader2 } from 'lucide-react';
import { useConversations } from '@/lib/dr/useDrFeedback';
import MessageList from './message-list';
import MessageComposer from './message-composer';
import { EmptyChannel } from './empty-states';
import { avatarInitial, displayNameFromEmail } from './display';

interface ConversationViewProps {
  conversationId: string;
  onOpenThread: (messageId: string) => void;
}

export default function ConversationView({ conversationId, onOpenThread }: ConversationViewProps) {
  const { data: conversations, isLoading } = useConversations();
  const convo = conversations?.find((c) => c.id === conversationId);

  if (isLoading && !convo) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!convo) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="font-medium text-foreground">Conversation not found</p>
        <p className="text-sm text-muted-foreground">It may have been removed, or you don&apos;t have access.</p>
        <Link href="/dr/feedback" className="text-sm font-medium text-primary hover:underline">
          Back to Feedback
        </Link>
      </div>
    );
  }

  const isChannel = convo.kind === 'channel';
  const partnerName = convo.dmPartnerEmail ? displayNameFromEmail(convo.dmPartnerEmail) : 'Direct message';
  const title = isChannel ? convo.name ?? 'channel' : partnerName;
  const placeholder = isChannel ? `Message #${convo.name ?? ''}…` : `Message ${partnerName}…`;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Link
          href="/dr/feedback"
          className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="size-5" />
        </Link>
        {isChannel ? (
          <Hash className="size-5 shrink-0 text-muted-foreground" />
        ) : (
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
            {convo.dmPartnerEmail ? avatarInitial(convo.dmPartnerEmail) : '?'}
          </span>
        )}
        <div className="min-w-0">
          <h2 className="truncate font-semibold text-foreground">{title}</h2>
          {isChannel && convo.topic && <p className="truncate text-xs text-muted-foreground">{convo.topic}</p>}
          {!isChannel && convo.dmPartnerEmail && (
            <p className="truncate text-xs text-muted-foreground">{convo.dmPartnerEmail}</p>
          )}
        </div>
      </header>

      <MessageList
        conversationId={conversationId}
        onOpenThread={onOpenThread}
        emptyState={<EmptyChannel label={isChannel ? `#${convo.name ?? ''}` : partnerName} />}
      />

      <div className="border-t border-border p-3">
        <MessageComposer conversationId={conversationId} placeholder={placeholder} autoFocus />
      </div>
    </div>
  );
}
