/**
 * Medi's analytics vocabulary helpers (MM107; reused by the MM108-MM110 copilots). The events
 * are the `assistant_*` names in lib/analytics/events.ts (catalog: media-manipulator-analytics
 * MM107); this file only maps raw numbers and stream codes onto their enums and buckets.
 */
import type {
  AssistantFailReasonProp,
  AssistantLatencyBucket,
  AssistantOutcomeProp,
  AssistantTurnIndexBucket,
  AssistantUndoBucket,
} from '@/lib/analytics/events';

/** Position of a user message in its conversation (1-based). */
export function turnIndexBucket(n: number): AssistantTurnIndexBucket {
  if (n <= 1) return '1';
  if (n <= 3) return '2-3';
  if (n <= 10) return '4-10';
  return '11+';
}

/** Send → done. */
export function latencyBucket(ms: number): AssistantLatencyBucket {
  if (ms < 1000) return '<1s';
  if (ms < 3000) return '1-3s';
  if (ms < 10_000) return '3-10s';
  if (ms < 30_000) return '10-30s';
  return '30s+';
}

/** Apply → undo (MM108+). */
export function undoBucket(ms: number): AssistantUndoBucket {
  if (ms < 10_000) return '<10s';
  if (ms < 60_000) return '10-60s';
  if (ms < 300_000) return '60-300s';
  return '300s+';
}

/** An in-stream `error.code` or a pre-stream refusal code → the catalog reason. */
export function failReason(code: string): AssistantFailReasonProp {
  switch (code) {
    case 'upstream':
    case 'tool_limit':
      return 'upstream';
    case 'assistant_paused':
      return 'paused';
    case 'limit':
    case 'quota_exceeded':
      return 'limit';
    case 'invalid_ops':
      return 'invalid_ops';
    case 'rate_limited':
      return 'rate_limited';
    case 'sign_in_required':
      return 'sign_in';
    case 'aborted':
      return 'aborted';
    case 'timeout':
      return 'timeout';
    default:
      return 'error';
  }
}

/** What a finished answer was, from the done event and what streamed before it. */
export function answerOutcome(done: { outcome?: 'static' | 'out_of_scope' }, seen: { edits: boolean; action: boolean; ask: boolean }): AssistantOutcomeProp {
  if (done.outcome) return done.outcome;
  if (seen.edits) return 'edits';
  if (seen.ask) return 'ask';
  if (seen.action) return 'action';
  return 'text';
}
