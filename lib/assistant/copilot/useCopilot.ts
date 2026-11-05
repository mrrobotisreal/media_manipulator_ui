'use client';

/**
 * MM108: the copilot's conversation loop (design MEDI_ASSISTANT.md §5.2, §8.3), editor-agnostic.
 *
 *   send → (frame if allowed) → stream → `edits` → adapter.apply (ONE undo entry, all or nothing)
 *        → after `done {awaiting}` → editResult {applied, errors?, frameAfter?} (not charged)
 *        → the model confirms in a sentence or refines once (another single undo entry).
 *
 * Frames: attached to a new message only when the adapter asks for it, the user left "Let Medi
 * see the preview" on, and the one-time disclosure is shown (sending a message with the notice
 * on screen acknowledges it); `frameAfter` on the verify loop under the same rule. Frames live in
 * memory for one request; nothing is stored. Analytics go through the caller's tracker (the
 * chromeless editors' consent-gated one).
 */
import * as React from 'react';

import { EVENTS } from '@/lib/analytics/events';
import type { AssistantActionKindProp, AssistantSurfaceProp, Tier } from '@/lib/analytics/events';
import { undoBucket } from '@/lib/assistant/analytics';
import { blobToBase64 } from '@/lib/assistant/frame';
import { useAssistantStream, type AssistantTrack } from '@/lib/assistant/useAssistantStream';
import type { StreamDeps } from '@/lib/assistant/stream';
import type { AssistantActionEvent, AssistantEditsEvent } from '@/schemas/assistant';

import { noteKeptCandidate, noteUndone } from './kept';
import { autoApplyEnabled, markNoticeSeen, noticeSeen, previewAllowed, setAutoApplyEnabled, setPreviewAllowed } from './preferences';
import type { CopilotAdapter, CopilotChangeLine, CopilotDiffLine, CopilotEditToken } from './types';

export interface AppliedEdit {
  callId: string;
  summary: string;
  token: CopilotEditToken;
  changes: string[];
  /** MM114: the batch reason, and the per-op lines (each with its own reason) the card lists. */
  reason?: string;
  lines?: CopilotChangeLine[];
  appliedAt: number;
  undone: boolean;
}

/** MM114: a batch waiting for Apply / Discard (auto-apply off). Nothing is in the document yet. */
export interface StagedEdit {
  callId: string;
  summary: string;
  reason?: string;
  ops: unknown;
  opCount: number;
  lines: CopilotDiffLine[];
  state: 'pending' | 'discarded';
}

/** An edit the adapter refused (nothing changed). Matched to its message by `callId`. */
export interface RejectedEdit {
  callId: string;
  errors: string[];
}

interface PendingResult {
  callId: string;
  applied: boolean;
  errors?: string[];
  visual: boolean;
}

export interface UseCopilotOptions {
  adapter: CopilotAdapter;
  locale: string;
  track: AssistantTrack;
  tier: Tier;
  deps?: StreamDeps;
  now?: () => number;
  /** Wait for the preview to repaint after an edit before grabbing frameAfter. */
  waitForPaint?: () => Promise<void>;
}

const twoFrames = () =>
  new Promise<void>((resolve) => {
    if (typeof requestAnimationFrame !== 'function') return resolve();
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 60)));
  });

export function useCopilot({ adapter, locale, track, tier, deps, now = Date.now, waitForPaint = twoFrames }: UseCopilotOptions) {
  const surface = adapter.surface as AssistantSurfaceProp;
  const adapterRef = React.useRef(adapter);
  React.useEffect(() => {
    adapterRef.current = adapter;
  }, [adapter]);

  const [applied, setApplied] = React.useState<AppliedEdit[]>([]);
  const [rejected, setRejected] = React.useState<RejectedEdit[]>([]);
  // The panel is client-only (loaded with ssr:false), so storage can be read on the first render.
  const [preview, setPreviewState] = React.useState(previewAllowed);
  const [notice, setNotice] = React.useState(() => !noticeSeen());

  const pending = React.useRef<PendingResult | null>(null);
  const autoApplyRef = React.useRef(autoApplyEnabled());
  const roundsThisTurn = React.useRef(0);
  const [tick, setTick] = React.useState(0);
  const stagedRef = React.useRef<StagedEdit[]>([]);

  const [staged, setStaged] = React.useState<StagedEdit[]>([]);
  const [autoApply, setAutoApplyState] = React.useState(autoApplyEnabled);
  React.useEffect(() => {
    stagedRef.current = staged;
  }, [staged]);

  /** Apply `ev` to the document now (one undo entry) and queue the editResult. */
  const applyNow = React.useCallback(
    (ev: AssistantEditsEvent): boolean => {
      const a = adapterRef.current;
      const res = a.apply(ev.summary, ev.ops);
      if (res.ok) {
        roundsThisTurn.current += 1;
        const round = (Math.min(2, roundsThisTurn.current) as 1 | 2);
        track(EVENTS.ASSISTANT_EDITS_APPLIED, { surface, op_count: Math.min(res.opCount, 99), op_kinds: res.opKinds.slice(0, 8).join(','), round });
        noteKeptCandidate(ev.callId, surface, track);
        setApplied((l) => [...l, { callId: ev.callId, summary: ev.summary, token: res.token, changes: res.changes, ...(ev.reason ? { reason: ev.reason } : {}), ...(res.lines ? { lines: res.lines } : {}), appliedAt: now(), undone: false }]);
        pending.current = { callId: ev.callId, applied: true, visual: a.isVisual ? a.isVisual(ev.ops) : true };
      } else {
        track(EVENTS.ASSISTANT_EDITS_REJECTED, { surface, reason: res.reason });
        setRejected((l) => [...l, { callId: ev.callId, errors: res.errors }]);
        pending.current = { callId: ev.callId, applied: false, errors: res.errors.slice(0, 8), visual: false };
      }
      return res.ok;
    },
    [surface, track, now],
  );

  const onEdits = React.useCallback(
    (ev: AssistantEditsEvent) => {
      const a = adapterRef.current;
      // MM114: with auto-apply off the batch is staged as a diff card; nothing touches the document
      // until Apply. An adapter that cannot preview applies directly (the default path).
      if (!autoApplyRef.current && a.preview) {
        const dry = a.preview(ev.ops);
        if (!dry.ok) {
          track(EVENTS.ASSISTANT_EDITS_REJECTED, { surface, reason: dry.reason });
          setRejected((l) => [...l, { callId: ev.callId, errors: dry.errors }]);
          pending.current = { callId: ev.callId, applied: false, errors: dry.errors.slice(0, 8), visual: false };
          return;
        }
        const opCount = Array.isArray(ev.ops) ? ev.ops.length : dry.lines.length;
        setStaged((l) => [...l, { callId: ev.callId, summary: ev.summary, ...(ev.reason ? { reason: ev.reason } : {}), ops: ev.ops, opCount, lines: dry.lines, state: 'pending' }]);
        return;
      }
      applyNow(ev);
    },
    [surface, track, applyNow],
  );

  const chat = useAssistantStream({ surface: adapter.surface, locale, onEdits, track, deps });
  const lastAssistant = [...chat.messages].reverse().find((m) => m.role === 'assistant');

  // A limit refusal shows the panel's limit card (until the next message) and is reported once.
  const lastError = lastAssistant?.status === 'error' ? lastAssistant.errorCode : null;
  const limitHit = lastError === 'limit';
  const seenLimitKey = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!limitHit || !lastAssistant || seenLimitKey.current === lastAssistant.key) return;
    seenLimitKey.current = lastAssistant.key;
    track(EVENTS.ASSISTANT_LIMIT_HIT, { surface, tier });
  }, [limitHit, lastAssistant, surface, tier, track]);

  // The verify loop: once the stream that carried the edit is done and the API awaits a result.
  React.useEffect(() => {
    const p = pending.current;
    if (!p || chat.streaming) return;
    const last = lastAssistant;
    if (!last || last.status !== 'complete' || !last.awaiting) {
      if (last && last.status !== 'streaming') pending.current = null;
      return;
    }
    pending.current = null;
    let alive = true;
    void (async () => {
      let frameAfter: { jpegBase64: string } | undefined;
      if (p.applied && p.visual && previewAllowed() && noticeSeen()) {
        try {
          await waitForPaint();
          const blob = await adapterRef.current.captureFrame();
          if (blob) frameAfter = { jpegBase64: await blobToBase64(blob) };
        } catch {
          frameAfter = undefined;
        }
      }
      if (!alive) return;
      chat.continueEdit({ callId: p.callId, applied: p.applied, ...(p.errors?.length ? { errors: p.errors } : {}), ...(frameAfter ? { frameAfter } : {}) });
    })();
    return () => {
      alive = false;
    };
    // `tick` re-runs this when an edit lands after the stream already settled.
  }, [chat.streaming, chat, lastAssistant, tick, waitForPaint]);

  /** Apply a staged batch (the existing one-undo path), then report the result like any applied edit. */
  const applyStaged = React.useCallback(
    (callId: string) => {
      const st = stagedRef.current.find((x) => x.callId === callId && x.state === 'pending');
      if (!st) return;
      track(EVENTS.ASSISTANT_EDITS_STAGED_DECISION, { surface, decision: 'applied', op_count: Math.min(st.opCount, 99) });
      setStaged((l) => l.filter((x) => x.callId !== callId));
      applyNow({ type: 'edits', callId: st.callId, summary: st.summary, ...(st.reason ? { reason: st.reason } : {}), ops: st.ops });
      setTick((n) => n + 1);
    },
    [surface, track, applyNow],
  );
  const discardStaged = React.useCallback(
    (callId: string) => {
      const st = stagedRef.current.find((x) => x.callId === callId && x.state === 'pending');
      if (!st) return;
      track(EVENTS.ASSISTANT_EDITS_STAGED_DECISION, { surface, decision: 'discarded', op_count: Math.min(st.opCount, 99) });
      setStaged((l) => l.map((x) => (x.callId === callId ? { ...x, state: 'discarded' as const } : x)));
      pending.current = { callId, applied: false, errors: ['user discarded'], visual: false };
      setTick((n) => n + 1);
    },
    [surface, track],
  );
  const setAutoApply = React.useCallback(
    (on: boolean) => {
      setAutoApplyEnabled(on);
      autoApplyRef.current = on;
      setAutoApplyState(on);
      track(EVENTS.ASSISTANT_AUTO_APPLY_TOGGLED, { surface, enabled: on });
    },
    [surface, track],
  );

  const send = React.useCallback(
    async (text: string, opts: { plan?: boolean } = {}): Promise<boolean> => {
      if (!text.trim() || chat.streaming) return false;
      const a = adapterRef.current;
      roundsThisTurn.current = 0;
      setStaged((l) => l.filter((x) => x.state === 'discarded'));
      let frame: { jpegBase64: string } | undefined;
      const mayFrame = a.frameOnMessage && previewAllowed();
      if (mayFrame && !noticeSeen()) {
        markNoticeSeen();
        setNotice(false);
      }
      if (mayFrame) {
        try {
          const blob = await a.captureFrame();
          if (blob) frame = { jpegBase64: await blobToBase64(blob) };
        } catch {
          frame = undefined;
        }
      }
      const pid = a.projectId();
      const ok = chat.send(text, { plan: !!opts.plan, context: { digest: a.digest(), ...(pid ? { projectId: pid } : {}) }, ...(frame ? { frame } : {}) });
      setTick((n) => n + 1);
      return ok;
    },
    [chat],
  );

  const undo = React.useCallback(
    (edit: AppliedEdit): boolean => {
      if (edit.undone || !adapterRef.current.undo(edit.token)) return false;
      track(EVENTS.ASSISTANT_EDITS_UNDONE, { surface, within_seconds_bucket: undoBucket(now() - edit.appliedAt) });
      noteUndone(edit.callId);
      setApplied((l) => l.map((x) => (x === edit ? { ...x, undone: true } : x)));
      return true;
    },
    [surface, track, now],
  );

  const runAction = React.useCallback(
    async (a: AssistantActionEvent): Promise<boolean> => {
      const handler = adapterRef.current.suggest[a.kind];
      if (!handler) return false;
      track(EVENTS.ASSISTANT_ACTION_CLICKED, { surface, kind: a.kind as AssistantActionKindProp });
      await handler(a.params ?? {});
      return true;
    },
    [surface, track],
  );

  const setPreview = React.useCallback((on: boolean) => {
    setPreviewAllowed(on);
    setPreviewState(on);
  }, []);
  const dismissNotice = React.useCallback(() => {
    markNoticeSeen();
    setNotice(false);
  }, []);
  const reset = React.useCallback(() => {
    chat.reset();
    pending.current = null;
    setApplied([]);
    setRejected([]);
    setStaged([]);
  }, [chat]);

  return {
    messages: chat.messages,
    streaming: chat.streaming,
    stop: chat.stop,
    send,
    reset,
    applied,
    rejected,
    staged,
    autoApply,
    setAutoApply,
    applyStaged,
    discardStaged,
    undo,
    canUndo: (e: AppliedEdit) => !e.undone && adapterRef.current.canUndo(e.token),
    runAction,
    preview,
    setPreview,
    notice,
    dismissNotice,
    limitHit,
    lastError,
  };
}

/** Numbered steps of a "Plan my edit" answer (`1. …` / `1) …` lines). */
export function planSteps(text: string): string[] {
  const out: string[] = [];
  for (const line of text.split('\n')) {
    const m = /^\s*(\d{1,2})[.)]\s+(.+?)\s*$/.exec(line);
    if (m && Number(m[1]) === out.length + 1) out.push(m[2].replace(/\*\*/g, ''));
  }
  return out.length >= 2 ? out : [];
}
