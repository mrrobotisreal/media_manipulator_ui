'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { DrComment, DrReply } from '@/schemas/drComments';
import type { useDrCommentActions } from '@/lib/dr/useDrComments';
import AttachmentCarousel from './attachment-carousel';
import CommentComposer from './comment-composer';

type Actions = ReturnType<typeof useDrCommentActions>;

function trimEmail(email: string): string {
  return email.split('@')[0] || email;
}

const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diffSec = Math.round((then - Date.now()) / 1000);
  const abs = Math.abs(diffSec);
  if (abs < 60) return rtf.format(Math.round(diffSec), 'second');
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), 'hour');
  if (abs < 2592000) return rtf.format(Math.round(diffSec / 86400), 'day');
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' } as Intl.DateTimeFormatOptions);
}

function AuthorLine({ email, iso }: { email: string; iso: string }) {
  const name = trimEmail(email);
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
        {(name[0] || '?').toUpperCase()}
      </span>
      <span className="truncate text-sm font-medium">{name}</span>
      <span className="text-xs text-muted-foreground" title={new Date(iso).toLocaleString()}>
        {relativeTime(iso)}
      </span>
    </div>
  );
}

function ReplyItem({ reply }: { reply: DrReply }) {
  return (
    <div className="border-t border-border/60 pt-3">
      <AuthorLine email={reply.authorEmail} iso={reply.createdAt} />
      {reply.attachments.length > 0 && (
        <div className="mt-2">
          <AttachmentCarousel attachments={reply.attachments} />
        </div>
      )}
      {reply.body && <p className="mt-1.5 text-sm whitespace-pre-wrap text-foreground/90">{reply.body}</p>}
    </div>
  );
}

interface CommentCardProps {
  comment: DrComment;
  active: boolean;
  orphaned?: boolean;
  currentUserEmail: string;
  actions: Actions;
  onActivate: () => void;
}

export default function CommentCard({
  comment,
  active,
  orphaned = false,
  currentUserEmail,
  actions,
  onActivate,
}: CommentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [replyDraftId, setReplyDraftId] = useState<string | null>(null);
  const [startingReply, setStartingReply] = useState(false);

  const textAnchor = comment.anchor.type === 'text' ? comment.anchor : null;
  const quote = textAnchor?.quote ?? '';

  const startReply = async () => {
    if (replyDraftId || startingReply) return;
    setStartingReply(true);
    try {
      const id = await actions.createDraftReply(comment.id);
      setReplyDraftId(id);
      setExpanded(true);
    } finally {
      setStartingReply(false);
    }
  };

  return (
    <div
      onClick={onActivate}
      className={cn(
        'rounded-lg border bg-card p-3 text-left shadow-sm transition-colors',
        active ? 'border-yellow-500 ring-1 ring-yellow-500/50' : 'border-border hover:border-primary/40',
      )}
    >
      <AuthorLine email={comment.authorEmail} iso={comment.createdAt} />

      {textAnchor && quote && (
        <p className="mt-2 line-clamp-2 border-l-2 border-border pl-2 text-xs text-muted-foreground italic">
          “{quote}”
        </p>
      )}
      {orphaned && (
        <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
          The original text is no longer present in the document.
        </p>
      )}

      {comment.attachments.length > 0 && (
        <div className="mt-2">
          <AttachmentCarousel attachments={comment.attachments} />
        </div>
      )}

      {comment.body && <p className="mt-2 text-sm whitespace-pre-wrap text-foreground/90">{comment.body}</p>}

      {/* Replies */}
      <div className="mt-3 flex items-center gap-2">
        {comment.replyCount > 0 ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <Badge variant="secondary" className="gap-1">
              <MessageSquare className="size-3" />
              {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
            </Badge>
            {expanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </button>
        ) : null}
        {!replyDraftId && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              void startReply();
            }}
            disabled={startingReply}
          >
            Reply
          </Button>
        )}
      </div>

      {expanded && comment.replies.length > 0 && (
        <div className="mt-2 space-y-3">
          {comment.replies.map((r) => (
            <ReplyItem key={r.id} reply={r} />
          ))}
        </div>
      )}

      {replyDraftId && (
        <div className="mt-3" onClick={(e) => e.stopPropagation()}>
          <CommentComposer
            compact
            authorEmail={currentUserEmail}
            placeholder="Reply…"
            submitLabel="Reply"
            upload={(file, onProgress) => actions.uploadReplyAttachment(replyDraftId, file, onProgress)}
            deleteAttachment={actions.deleteAttachment}
            onPublish={async (b) => {
              await actions.publishReply(replyDraftId, b);
              setReplyDraftId(null);
            }}
            onCancel={async () => {
              await actions.cancelDraftReply(replyDraftId);
              setReplyDraftId(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
