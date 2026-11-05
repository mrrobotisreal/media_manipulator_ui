'use client';

/**
 * The Medi guide sheet (MM107 decisions 1-5): a side sheet (≤ 420 px; a full-height bottom sheet
 * under 640 px) with the conversation, starter chips, action buttons that open tools with their
 * preset, ask chips, Stop, thumbs, New chat and (signed in) the last 20 guide conversations.
 * Loaded lazily with its i18n shard (`interface/assistant.json`) by medi-guide.tsx.
 */
import * as React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, History, Loader2, Paperclip, Plus, Send, Square, Trash2, X } from 'lucide-react';

import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import { analytics, EVENTS } from '@/lib/analytics';
import { useAuth } from '@/lib/auth/AuthProvider';
import { deleteAssistantConversation, listAssistantConversations } from '@/lib/assistant/api';
import { MEDI_BRAND, MEDI_MARK_SRC } from '@/lib/assistant/brand';
import { EDITOR_HREF, editorTeaserFor } from '@/lib/assistant/guideRoutes';
import { actionHref, linkTargetKind } from '@/lib/assistant/links';
import { AssistantFileError, uploadAssistantFile, type AssistantDroppedFile } from '@/lib/assistant/api';
import { useAssistantStream, type AssistantTrack, type AssistantUiMessage } from '@/lib/assistant/useAssistantStream';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { PHOTO_ADJUSTMENT_SLUGS } from '@/content/photo/slugs';
import { cn } from '@/lib/utils';
import type { AssistantCapabilities, AssistantConversation } from '@/schemas/assistant';

import { withToolShards } from '@/lib/i18n/ensureShard';

import AssistantMarkdown from './markdown';
import MessageFeedback from './message-feedback';

/** The guide reports through the site's consent-gated client. */
const guideTrack: AssistantTrack = (name, props) => analytics.track(name, props as never);

/** MM116b: the confirmation card is loaded the first time one appears (it pulls in the job hooks and the tool registry). */
const JobCard = React.lazy(() => withToolShards(() => import('./job-card')));

const PHOTO_SLUGS: ReadonlySet<string> = new Set(PHOTO_ADJUSTMENT_SLUGS);
const STARTERS = ['whichTool', 'gif', 'premium', 'photoPro'] as const;

export interface GuideSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  capabilities: AssistantCapabilities | null;
}

/** The error copy key for a stream/refusal code. */
export function errorKey(code: string | null): string {
  switch (code) {
    case 'rate_limited':
      return 'rateLimited';
    case 'assistant_paused':
      return 'paused';
    case 'limit':
      return 'limit';
    case 'sign_in_required':
      return 'signIn';
    case 'not_found':
      return 'unavailable';
    case 'upstream':
    case 'tool_limit':
    case 'network':
      return 'upstream';
    default:
      return 'generic';
  }
}

export default function GuideSheet({ open, onOpenChange, capabilities }: GuideSheetProps) {
  const { t, language, dir } = useLocalization(['interface']);
  const localized = useLocalizedHref();
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const signedIn = !!auth?.user;
  const phone = useMediaQuery('(max-width: 639px)');
  const locale = language.code;
  const chat = useAssistantStream({ surface: 'guide', locale });
  const [draft, setDraft] = React.useState('');
  // MM116a: a file dropped into the guide. Uploaded on pick; the next message names it as fileRef.
  const [dropped, setDropped] = React.useState<AssistantDroppedFile | null>(null);
  // MM116b: the browser still holds the File, so a confirmation card can run the job right here.
  const [droppedBlob, setDroppedBlob] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const fileInput = React.useRef<HTMLInputElement>(null);
  const [view, setView] = React.useState<'chat' | 'history'>('chat');
  const listRef = React.useRef<HTMLDivElement>(null);
  const maxChars = capabilities && capabilities.enabled ? capabilities.maxMessageChars : 4000;
  const teaser = editorTeaserFor(pathname, PHOTO_SLUGS);
  const b = { brand: MEDI_BRAND };

  React.useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat.messages]);

  const submit = (text: string) => {
    if (chat.send(text.slice(0, maxChars), dropped ? { fileRef: dropped.fileRef } : undefined)) setDraft('');
  };

  const pickFile = async (file: File | undefined) => {
    if (!file) return;
    setFileError(null);
    setUploading(true);
    try {
      const up = await uploadAssistantFile(file);
      setDropped(up);
      setDroppedBlob(file);
    } catch (err) {
      const code = err instanceof AssistantFileError ? err.code : 'failed';
      setFileError(code === 'file_too_large' ? t('assistant.guide.fileTooLarge') : code === 'unsupported_file' ? t('assistant.guide.fileUnsupported') : t('assistant.guide.fileFailed'));
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const followLink = (href: string) => {
    analytics.track(EVENTS.ASSISTANT_LINK_CLICKED, { surface: 'guide', target_kind: linkTargetKind(href) });
    if (phone) onOpenChange(false);
  };

  const side = phone ? 'bottom' : dir === 'rtl' ? 'left' : 'right';
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        data-testid="medi-guide-sheet"
        className={cn('gap-0 p-0', phone ? 'h-[100dvh] max-h-[100dvh]' : 'w-full sm:max-w-[420px]')}
      >
        <header className="flex items-center gap-3 border-b border-edge px-4 py-3 pe-12">
          <img src={MEDI_MARK_SRC} alt="" width={28} height={28} />
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-base">{t('assistant.guide.title', b)}</SheetTitle>
            <SheetDescription className="truncate text-xs">{t('assistant.guide.subtitle')}</SheetDescription>
          </div>
          {signedIn ? (
            <button
              type="button"
              className="rounded p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label={t('assistant.guide.history')}
              title={t('assistant.guide.history')}
              onClick={() => setView(view === 'history' ? 'chat' : 'history')}
            >
              <History className="size-4" />
            </button>
          ) : null}
          <button
            type="button"
            className="rounded p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label={t('assistant.guide.newChat')}
            title={t('assistant.guide.newChat')}
            onClick={() => {
              chat.reset();
              setDropped(null);
              setDroppedBlob(null);
              setFileError(null);
              setView('chat');
            }}
          >
            <Plus className="size-4" />
          </button>
        </header>

        {view === 'history' ? (
          <HistoryList
            onBack={() => setView('chat')}
            onOpen={(id) => {
              void chat.load(id).then(() => setView('chat'));
            }}
          />
        ) : (
          <>
            <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
              {chat.messages.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{t('assistant.guide.welcome', b)}</p>
                  {teaser ? (
                    <div className="rounded-md border border-edge bg-surface-1 p-3 text-sm" data-testid="medi-copilot-teaser">
                      <p>{t('assistant.guide.copilotTeaser')}</p>
                      <Link
                        href={localized(EDITOR_HREF[teaser])}
                        prefetch={false}
                        className="mt-2 inline-flex min-h-11 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
                        onClick={() => followLink(EDITOR_HREF[teaser])}
                      >
                        {t('assistant.guide.openEditor', { editor: t(`assistant.editors.${teaser}`) })}
                      </Link>
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    {STARTERS.map((k) => (
                      <button
                        key={k}
                        type="button"
                        className="min-h-11 rounded-full border border-edge px-3 text-start text-sm hover:bg-accent"
                        onClick={() => submit(t(`assistant.guide.starters.${k}`))}
                      >
                        {t(`assistant.guide.starters.${k}`)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              {chat.messages.map((m) =>
                m.role === 'user' ? (
                  <div key={m.key} className="ms-8 rounded-lg bg-primary/10 px-3 py-2 text-sm whitespace-pre-wrap">
                    {m.text}
                  </div>
                ) : (
                  <AssistantBubble
                    key={m.key}
                    m={m}
                    locale={locale}
                    signedIn={signedIn}
                    streaming={chat.streaming}
                    onLink={followLink}
                    onAction={(href, kind) => {
                      analytics.track(EVENTS.ASSISTANT_ACTION_CLICKED, { surface: 'guide', kind });
                      if (phone) onOpenChange(false);
                      router.push(href);
                    }}
                    onChoice={submit}
                    file={droppedBlob}
                    onJobOpen={(href) => {
                      if (phone) onOpenChange(false);
                      router.push(href);
                    }}
                  />
                ),
              )}
            </div>
            <form
              className="border-t border-edge p-3"
              onSubmit={(e) => {
                e.preventDefault();
                submit(draft);
              }}
            >
              {(dropped || uploading || fileError) && (
                <div className="mb-2 flex items-center gap-2 text-xs" data-testid="medi-file-chip">
                  {uploading ? (
                    <span className="flex items-center gap-1 text-muted-foreground"><Loader2 className="size-3 animate-spin" />{t('assistant.guide.fileUploading')}</span>
                  ) : dropped ? (
                    <span className="flex min-w-0 items-center gap-1 rounded-md border border-edge px-2 py-1">
                      <Paperclip className="size-3 shrink-0" />
                      <span className="truncate">{dropped.name}</span>
                      <button type="button" onClick={() => { setDropped(null); setDroppedBlob(null); }} aria-label={t('assistant.guide.fileRemove')} title={t('assistant.guide.fileRemove')} className="shrink-0 hover:text-foreground">
                        <X className="size-3" />
                      </button>
                    </span>
                  ) : null}
                  {fileError && <span role="alert" className="text-destructive">{fileError}</span>}
                </div>
              )}
              <div className="flex items-end gap-2">
                <input ref={fileInput} type="file" accept="image/*,video/*,audio/*,application/pdf" className="hidden" onChange={(e) => void pickFile(e.target.files?.[0])} data-testid="medi-file-input" />
                <button
                  type="button"
                  onClick={() => {
                    analytics.track(EVENTS.ASSISTANT_ACTION_CLICKED, { surface: 'guide', kind: 'attach_file' });
                    fileInput.current?.click();
                  }}
                  disabled={uploading || chat.streaming}
                  className="flex size-11 items-center justify-center rounded-md border border-edge hover:bg-accent disabled:opacity-50"
                  aria-label={t('assistant.guide.attach')}
                  title={t('assistant.guide.attach')}
                >
                  <Paperclip className="size-4" />
                </button>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value.slice(0, maxChars))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      submit(draft);
                    }
                  }}
                  rows={2}
                  maxLength={maxChars}
                  placeholder={t('assistant.guide.placeholder', b)}
                  aria-label={t('assistant.guide.placeholder', b)}
                  className="min-h-11 flex-1 resize-none rounded-md border border-edge bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {chat.streaming ? (
                  <button
                    type="button"
                    onClick={chat.stop}
                    className="flex size-11 items-center justify-center rounded-md border border-edge hover:bg-accent"
                    aria-label={t('assistant.guide.stop')}
                    title={t('assistant.guide.stop')}
                    data-testid="medi-stop"
                  >
                    <Square className="size-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    className="flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-50"
                    aria-label={t('assistant.guide.send')}
                    title={t('assistant.guide.send')}
                  >
                    <Send className="size-4 rtl:-scale-x-100" />
                  </button>
                )}
              </div>
              <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
                {t('assistant.guide.disclaimer', b)}{' '}
                <Link href={localized('/privacy-policy')} prefetch={false} className="underline underline-offset-2">
                  {t('assistant.guide.privacyLink')}
                </Link>
              </p>
            </form>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function AssistantBubble({
  m,
  locale,
  signedIn,
  streaming,
  onLink,
  onAction,
  onChoice,
  file,
  onJobOpen,
}: {
  file: File | null;
  onJobOpen: (href: string) => void;
  m: AssistantUiMessage;
  locale: string;
  signedIn: boolean;
  streaming: boolean;
  onLink: (href: string) => void;
  onAction: (href: string, kind: 'navigate' | 'open_tool') => void;
  onChoice: (text: string) => void;
}) {
  const { t } = useLocalization(['interface']);
  const b = { brand: MEDI_BRAND };
  const guideActions = m.actions.filter((a) => a.kind === 'navigate' || a.kind === 'open_tool');
  const jobCards = m.actions.filter((a) => a.kind === 'confirm_job');
  return (
    <div className="space-y-2" data-testid="medi-answer" data-status={m.status}>
      {m.outcome === 'static' && !m.text ? <p className="text-sm">{t('assistant.guide.resting')}</p> : null}
      {m.text ? <AssistantMarkdown content={m.text} locale={locale} onLink={onLink} /> : null}
      {m.status === 'streaming' && !m.text ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          {m.tool ? t('assistant.guide.searching') : t('assistant.guide.thinking')}
        </p>
      ) : null}
      {m.status === 'stopped' ? <p className="text-xs text-muted-foreground">{t('assistant.guide.stopped')}</p> : null}
      {m.status === 'error' ? (
        <p className="text-sm text-destructive" role="alert">
          {t(`assistant.errors.${errorKey(m.errorCode)}`, b)}
        </p>
      ) : null}
      {guideActions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {guideActions.map((a) => {
            const href = actionHref(a.kind, a.params, locale);
            if (!href) return null;
            return (
              <button
                key={a.callId}
                type="button"
                data-testid="medi-action"
                data-href={href}
                className="min-h-11 rounded-md border border-primary/40 bg-primary/10 px-3 text-sm font-medium hover:bg-primary/20"
                onClick={() => onAction(href, a.kind as 'navigate' | 'open_tool')}
              >
                {a.label}
              </button>
            );
          })}
        </div>
      ) : null}
      {jobCards.map((a) => (
        <React.Suspense key={a.callId} fallback={<Loader2 className="size-4 animate-spin text-muted-foreground" />}>
          <JobCard callId={a.callId} label={a.label} params={a.params} locale={locale} file={file} track={guideTrack} onOpen={onJobOpen} />
        </React.Suspense>
      ))}
      {m.ask ? (
        <div className="space-y-2">
          <p className="text-sm">{m.ask.question}</p>
          <div className="flex flex-wrap gap-2">
            {(m.ask.choices ?? []).map((c) => (
              <button
                key={c}
                type="button"
                disabled={streaming}
                className="min-h-11 rounded-full border border-edge px-3 text-sm hover:bg-accent disabled:opacity-50"
                onClick={() => onChoice(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {m.status === 'complete' && m.messageId && signedIn ? <MessageFeedback messageId={m.messageId} surface="guide" track={guideTrack} /> : null}
    </div>
  );
}

function HistoryList({ onBack, onOpen }: { onBack: () => void; onOpen: (id: string) => void }) {
  const { t, formatDate } = useLocalization(['interface']);
  const [items, setItems] = React.useState<AssistantConversation[] | null>(null);
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => {
    let alive = true;
    listAssistantConversations('guide', 20)
      .then((l) => alive && setItems(l))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);
  return (
    <div className="flex-1 overflow-y-auto px-4 py-3" data-testid="medi-history">
      <button type="button" onClick={onBack} className="mb-3 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4 rtl:-scale-x-100" />
        {t('assistant.guide.historyBack')}
      </button>
      {failed ? <p className="text-sm text-destructive">{t('assistant.guide.historyLoadFailed')}</p> : null}
      {items === null && !failed ? <Loader2 className="size-4 animate-spin text-muted-foreground" /> : null}
      {items && items.length === 0 ? <p className="text-sm text-muted-foreground">{t('assistant.guide.historyEmpty')}</p> : null}
      <ul className="space-y-1">
        {(items ?? []).map((c) => (
          <li key={c.id} className="flex items-center gap-1">
            <button type="button" onClick={() => onOpen(c.id)} className="min-h-11 min-w-0 flex-1 rounded-md px-2 text-start hover:bg-accent">
              <span className="block truncate text-sm">{c.title || t('assistant.guide.untitled')}</span>
              <span className="block text-xs text-muted-foreground">{formatDate(c.updatedAt)}</span>
            </button>
            <button
              type="button"
              aria-label={t('assistant.guide.deleteChat')}
              title={t('assistant.guide.deleteChat')}
              className="rounded p-2 text-muted-foreground hover:bg-accent hover:text-destructive"
              onClick={() => {
                void deleteAssistantConversation(c.id).then(() => setItems((l) => (l ?? []).filter((x) => x.id !== c.id)));
              }}
            >
              <Trash2 className="size-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
