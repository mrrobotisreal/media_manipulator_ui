'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getBaseURL } from '@/lib/utils';
import { getCurrentIdToken } from '@/lib/firebase';
import { feedbackKeys } from './useDrFeedback';

// Live-update accelerant for the feedback workspace. The browser's EventSource
// cannot set an Authorization header and the DR auth model must not change, so
// we consume the SSE stream via fetch + ReadableStream with a Bearer header and
// a small hand-rolled line parser. On a `message` nudge we invalidate the
// matching queries and refetch over REST — ordering/consistency always come from
// Postgres, never from the stream. Reconnects with capped exponential backoff
// (1s→30s) and tears down fully on unmount/sign-out. Failures are silent (dev
// console only) because polling covers everything.
//
// Mounted ONCE in the feedback shell.

interface FeedbackNudge {
  type: string;
  conversationId?: string;
  parentId?: string | null;
}

export function useFeedbackEvents(openThreadParentId?: string | null): void {
  const qc = useQueryClient();
  // The open thread changes as the user opens/closes the panel, but the stream
  // is established once — read the latest value through a ref.
  const openThreadRef = useRef<string | null>(openThreadParentId ?? null);
  useEffect(() => {
    openThreadRef.current = openThreadParentId ?? null;
  }, [openThreadParentId]);

  useEffect(() => {
    let cancelled = false;
    let controller: AbortController | null = null;
    let reconnectDelay = 1000;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const handleNudge = (nudge: FeedbackNudge) => {
      if (nudge.type === 'message') {
        if (nudge.conversationId) {
          void qc.invalidateQueries({ queryKey: feedbackKeys.messages(nudge.conversationId) });
        }
        if (nudge.parentId && openThreadRef.current && nudge.parentId === openThreadRef.current) {
          void qc.invalidateQueries({ queryKey: feedbackKeys.replies(nudge.parentId) });
        }
        void qc.invalidateQueries({ queryKey: feedbackKeys.conversations() });
        void qc.invalidateQueries({ queryKey: feedbackKeys.threads() });
      } else if (nudge.type === 'conversation') {
        void qc.invalidateQueries({ queryKey: feedbackKeys.conversations() });
      }
    };

    // One SSE record (frames separated by a blank line). Collect its `data:`
    // lines, ignore `event:` and `:` comments/keepalives, then JSON-parse.
    const parseRecord = (record: string) => {
      const dataLines: string[] = [];
      for (const line of record.split('\n')) {
        if (line.startsWith(':')) continue; // comment / keepalive
        if (line.startsWith('data:')) dataLines.push(line.slice(5).replace(/^ /, ''));
      }
      if (dataLines.length === 0) return;
      try {
        const parsed = JSON.parse(dataLines.join('\n')) as FeedbackNudge;
        if (parsed && parsed.type && parsed.type !== 'hello') handleNudge(parsed);
      } catch {
        // Ignore a malformed frame — the next poll reconciles.
      }
    };

    const scheduleReconnect = () => {
      if (cancelled) return;
      const delay = reconnectDelay;
      reconnectDelay = Math.min(reconnectDelay * 2, 30_000);
      reconnectTimer = setTimeout(() => void connect(), delay);
    };

    const connect = async () => {
      if (cancelled) return;
      let token: string | null = null;
      try {
        token = await getCurrentIdToken();
      } catch {
        token = null;
      }
      if (!token || cancelled) {
        scheduleReconnect();
        return;
      }
      controller = new AbortController();
      try {
        const res = await fetch(`${getBaseURL()}/dr/feedback/events`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'text/event-stream' },
          signal: controller.signal,
        });
        if (!res.ok || !res.body) {
          scheduleReconnect();
          return;
        }
        reconnectDelay = 1000; // healthy connection — reset backoff
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        for (;;) {
          const { value, done } = await reader.read();
          if (done || cancelled) break;
          buffer += decoder.decode(value, { stream: true });
          let sep: number;
          while ((sep = buffer.indexOf('\n\n')) !== -1) {
            parseRecord(buffer.slice(0, sep));
            buffer = buffer.slice(sep + 2);
          }
        }
      } catch (err) {
        if (!cancelled && (err as { name?: string })?.name !== 'AbortError' && process.env.NODE_ENV !== 'production') {
          console.debug('dr feedback SSE error (polling continues)', err);
        }
      }
      if (!cancelled) scheduleReconnect();
    };

    void connect();

    return () => {
      cancelled = true;
      controller?.abort();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [qc]);
}
