'use client';

/**
 * Medi's conversation state (MM107), shared by the site guide and the MM108+ copilots. It owns
 * the visible messages, the conversation id (signed-in only; guests start fresh every message,
 * nothing is stored for them), streaming state, Stop, history loading and the analytics of
 * one request. Copilots add `context`/`frame`/`plan` to `send` and answer `edits` with
 * `continueEdit`; the guide uses `send(text)` only.
 */
import * as React from 'react';

import { analytics, EVENTS } from '@/lib/analytics';
import type { AssistantEntryProp } from '@/lib/analytics/events';
import { answerOutcome, failReason, latencyBucket, turnIndexBucket } from '@/lib/assistant/analytics';
import { getAssistantConversation } from '@/lib/assistant/api';
import { streamAssistantChat, type AssistantChatBody, type StreamDeps } from '@/lib/assistant/stream';
import type {
  AssistantActionEvent,
  AssistantAskEvent,
  AssistantEditsEvent,
  AssistantStreamEvent,
  AssistantSurface,
} from '@/schemas/assistant';

export interface AssistantUiMessage {
  /** Client key (stable per render). */
  key: string;
  role: 'user' | 'assistant';
  text: string;
  actions: AssistantActionEvent[];
  ask: AssistantAskEvent | null;
  edits: AssistantEditsEvent[];
  /** Stored assistant message id (signed-in only): the feedback target. */
  messageId: string | null;
  /** static = the spend-cap answer; out_of_scope = the guide's scope gate. */
  outcome: 'static' | 'out_of_scope' | null;
  /** streaming → complete | error | stopped. */
  status: 'streaming' | 'complete' | 'error' | 'stopped';
  /** The refusal or error code when status is error. */
  errorCode: string | null;
  /** Server tool currently running ("search_help"…), for the activity line. */
  tool: string | null;
  /** The answer ended with `done {awaiting: "edit_result"}`: the client owes an editResult (MM108). */
  awaiting: boolean;
}

export interface SendOptions {
  plan?: boolean;
  context?: AssistantChatBody['context'];
  frame?: AssistantChatBody['frame'];
  /** MM116a (guide): the dropped file this message is about. */
  fileRef?: string;
}

export interface UseAssistantStreamOptions {
  surface: AssistantSurface;
  /** BCP-47 code of the visitor's locale (`ru-RU`). */
  locale: string;
  /** Called for each `edits` event (copilots apply them; MM108). */
  onEdits?: (ev: AssistantEditsEvent, turnId: string) => void;
  /**
   * The analytics sink (MM108). Defaults to the site client; the chromeless editors pass their
   * consent-gated tracker (they mount no AnalyticsProvider and send only with a stored grant).
   */
  track?: AssistantTrack;
  /** Test seams. */
  deps?: StreamDeps;
  now?: () => number;
  page?: () => { path: string; title?: string };
}

/** An `assistant_*` event sink with the shared client's signature. */
export type AssistantTrack = (name: Parameters<typeof analytics.track>[0], props: Parameters<typeof analytics.track>[1]) => void;
const defaultTrack: AssistantTrack = (name, props) => analytics.track(name, props as never);

let keySeq = 0;
const nextKey = () => `m${++keySeq}`;

function emptyAssistant(): AssistantUiMessage {
  return { key: nextKey(), role: 'assistant', text: '', actions: [], ask: null, edits: [], messageId: null, outcome: null, status: 'streaming', errorCode: null, tool: null, awaiting: false };
}

function currentPage(): { path: string; title?: string } {
  if (typeof window === 'undefined') return { path: '/' };
  return { path: window.location.pathname || '/', title: (document.title || '').slice(0, 200) };
}

export function useAssistantStream(opts: UseAssistantStreamOptions) {
  const { surface, locale, onEdits, deps } = opts;
  const track = opts.track ?? defaultTrack;
  const now = opts.now ?? Date.now;
  const pageOf = opts.page ?? currentPage;
  const [messages, setMessages] = React.useState<AssistantUiMessage[]>([]);
  const [conversationId, setConversationId] = React.useState<string | null>(null);
  const [streaming, setStreaming] = React.useState(false);
  const controller = React.useRef<AbortController | null>(null);
  const turnRef = React.useRef<string | null>(null);
  const convRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    convRef.current = conversationId;
  }, [conversationId]);

  const patchLast = React.useCallback((fn: (m: AssistantUiMessage) => AssistantUiMessage) => {
    setMessages((list) => {
      if (list.length === 0) return list;
      const last = list[list.length - 1];
      if (last.role !== 'assistant') return list;
      return [...list.slice(0, -1), fn(last)];
    });
  }, []);

  const run = React.useCallback(
    async (body: AssistantChatBody, meta: { plan: boolean; hasFrame: boolean; userTurns: number; tier: 'guide' | 'copilot' | 'plan' }) => {
      const ac = new AbortController();
      controller.current = ac;
      setStreaming(true);
      const started = now();
      const seen = { edits: false, action: false, ask: false };
      let rounds = 0;
      let finished = false;
      track(EVENTS.ASSISTANT_MESSAGE_SENT, {
        surface,
        has_frame: meta.hasFrame,
        turn_index_bucket: turnIndexBucket(meta.userTurns),
        plan: meta.plan,
      });
      const onEvent = (ev: AssistantStreamEvent) => {
        switch (ev.type) {
          case 'meta':
            turnRef.current = ev.turnId;
            if (ev.conversationId) {
              convRef.current = ev.conversationId;
              setConversationId(ev.conversationId);
            }
            break;
          case 'delta':
            patchLast((m) => ({ ...m, text: m.text + ev.text, tool: null }));
            break;
          case 'tool':
            if (ev.status === 'running') rounds++;
            patchLast((m) => ({ ...m, tool: ev.status === 'running' ? ev.name : null }));
            break;
          case 'action':
            seen.action = true;
            patchLast((m) => ({ ...m, actions: [...m.actions, ev] }));
            break;
          case 'ask':
            seen.ask = true;
            patchLast((m) => ({ ...m, ask: ev }));
            break;
          case 'edits':
            seen.edits = true;
            patchLast((m) => ({ ...m, edits: [...m.edits, ev] }));
            onEdits?.(ev, turnRef.current ?? '');
            break;
          case 'done':
            finished = true;
            patchLast((m) => ({ ...m, status: 'complete', tool: null, messageId: ev.messageId ?? null, outcome: ev.outcome ?? null, awaiting: ev.awaiting === 'edit_result' }));
            track(EVENTS.ASSISTANT_RESPONSE_COMPLETED, {
              surface,
              model_tier: meta.tier,
              latency_bucket: latencyBucket(now() - started),
              tool_rounds: Math.min(rounds, 8),
              outcome: answerOutcome(ev, seen),
            });
            break;
          case 'error':
            finished = true;
            patchLast((m) => ({ ...m, status: 'error', tool: null, errorCode: ev.code }));
            track(EVENTS.ASSISTANT_RESPONSE_FAILED, { surface, reason: failReason(ev.code) });
            break;
          default:
            break;
        }
      };
      try {
        await streamAssistantChat(body, onEvent, ac.signal, deps);
        if (!finished) {
          // The stream ended without done/error: a dropped connection.
          patchLast((m) => ({ ...m, status: 'error', tool: null, errorCode: 'upstream' }));
          track(EVENTS.ASSISTANT_RESPONSE_FAILED, { surface, reason: 'upstream' });
        }
      } catch (err) {
        const aborted = (err as { name?: string } | null)?.name === 'AbortError';
        patchLast((m) => ({ ...m, status: aborted ? 'stopped' : 'error', tool: null, errorCode: aborted ? null : 'network' }));
        track(EVENTS.ASSISTANT_RESPONSE_FAILED, { surface, reason: aborted ? 'aborted' : 'upstream' });
      } finally {
        if (controller.current === ac) controller.current = null;
        setStreaming(false);
      }
    },
    [surface, deps, onEdits, patchLast, now, track],
  );

  /** Send a user message. Returns false (and does nothing) while a request is running. */
  const send = React.useCallback(
    (text: string, options: SendOptions = {}): boolean => {
      const clean = text.trim();
      if (!clean || controller.current) return false;
      const userTurns = messages.filter((m) => m.role === 'user').length + 1;
      setMessages((list) => [
        ...list,
        { ...emptyAssistant(), role: 'user', text: clean, status: 'complete' },
        emptyAssistant(),
      ]);
      const body: AssistantChatBody = {
        surface,
        locale,
        page: pageOf(),
        message: { text: clean },
        ...(convRef.current ? { conversationId: convRef.current } : {}),
        ...(options.context ? { context: options.context } : {}),
        ...(options.frame ? { frame: options.frame } : {}),
        ...(options.plan ? { plan: true } : {}),
        ...(options.fileRef ? { fileRef: options.fileRef } : {}),
      };
      const tier = surface === 'guide' ? 'guide' : options.plan ? 'plan' : 'copilot';
      void run(body, { plan: !!options.plan, hasFrame: !!options.frame, userTurns, tier });
      return true;
    },
    [messages, surface, locale, pageOf, run],
  );

  /** Copilots (MM108): answer an `edits` event of the current turn. Not charged by the API. */
  const continueEdit = React.useCallback(
    (result: NonNullable<AssistantChatBody['editResult']>, tier: 'copilot' | 'plan' = 'copilot'): boolean => {
      if (controller.current || !convRef.current || !turnRef.current) return false;
      setMessages((list) => [...list, emptyAssistant()]);
      const body: AssistantChatBody = {
        surface,
        locale,
        page: pageOf(),
        conversationId: convRef.current,
        turnId: turnRef.current,
        editResult: result,
      };
      const userTurns = messages.filter((m) => m.role === 'user').length;
      void run(body, { plan: false, hasFrame: !!result.frameAfter, userTurns, tier });
      return true;
    },
    [messages, surface, locale, pageOf, run],
  );

  const stop = React.useCallback(() => controller.current?.abort(), []);

  /** New chat: forget the conversation locally (the stored one stays in history). */
  const reset = React.useCallback(() => {
    controller.current?.abort();
    setMessages([]);
    convRef.current = null;
    setConversationId(null);
    turnRef.current = null;
  }, []);

  /** Open a stored conversation (signed-in history) and continue it. */
  const load = React.useCallback(
    async (id: string) => {
      controller.current?.abort();
      const detail = await getAssistantConversation(id, deps?.fetchImpl);
      const out: AssistantUiMessage[] = [];
      for (const m of detail.messages) {
        if (m.role === 'tool') continue;
        const text = m.content.text ?? '';
        if (!text && m.role === 'user') continue;
        out.push({
          ...emptyAssistant(),
          role: m.role,
          text,
          messageId: m.role === 'assistant' ? m.id : null,
          status: m.status === 'error' ? 'error' : 'complete',
          errorCode: m.status === 'error' ? 'upstream' : null,
        });
      }
      setMessages(out);
      convRef.current = detail.conversation.id;
      setConversationId(detail.conversation.id);
      turnRef.current = null;
    },
    [deps?.fetchImpl],
  );

  return { messages, conversationId, streaming, send, continueEdit, stop, reset, load };
}

/** `assistant_opened` with the shared vocabulary. */
export function trackAssistantOpened(surface: AssistantSurface, entry: AssistantEntryProp): void {
  analytics.track(EVENTS.ASSISTANT_OPENED, { surface, entry });
}
