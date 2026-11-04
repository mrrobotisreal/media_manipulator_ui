/**
 * Medi's chat transport (MM107, shared by the guide and the MM108+ copilots): POST
 * /api/assistant/chat and read the SSE body with the shared parser (`lib/sse/parse.ts`).
 * Pure of React so the guide hook, the copilot hook (MM108) and tests drive it the same way.
 *
 * Identity: authedFetch adds X-MM-Session-ID and the Firebase token; X-MM-Visitor-ID is added
 * only with analytics consent (it joins `server_assistant_turn_counted` to the visitor).
 * Pre-stream refusals come back as an `error` event with the API's code so callers have one path:
 * 429 quota_exceeded → `limit`, 429 bucket → `rate_limited`, 401 → `sign_in_required`,
 * 503 assistant_paused → `assistant_paused`, anything else → `http_<status>`.
 */
import { authedFetch, QuotaExceededError } from '@/lib/auth/authedFetch';
import { getVisitorId } from '@/lib/analytics';
import { canCapture } from '@/lib/analytics/consent-bridge';
import { readSSEStream } from '@/lib/sse/parse';
import { getBaseURL } from '@/lib/utils';
import { AssistantStreamEventSchema, type AssistantStreamEvent, type AssistantSurface } from '@/schemas/assistant';

export interface AssistantChatBody {
  surface: AssistantSurface;
  conversationId?: string;
  turnId?: string;
  locale: string;
  page: { path: string; title?: string };
  message?: { text: string };
  context?: { digest: string; projectId?: string };
  frame?: { jpegBase64: string };
  editResult?: { callId: string; applied: boolean; errors?: string[]; frameAfter?: string };
  plan?: boolean;
}

/** The pre-stream refusal codes callers branch on (beside the API's in-stream error codes). */
export type AssistantRefusal = 'limit' | 'rate_limited' | 'sign_in_required' | 'assistant_paused' | 'not_found' | string;

export interface StreamDeps {
  fetchImpl?: typeof authedFetch;
  visitorHeader?: () => Record<string, string>;
}

/** X-MM-Visitor-ID only with analytics consent (the photo/vector rule). */
export function assistantVisitorHeader(): Record<string, string> {
  try {
    return canCapture() ? { 'X-MM-Visitor-ID': getVisitorId() } : {};
  } catch {
    return {};
  }
}

/**
 * Run one chat request. Every parsed event goes to `onEvent` in order; a malformed frame is
 * dropped. Resolves when the stream ends; rejects only on abort (AbortError) or a network
 * failure. A pre-stream refusal becomes a synthetic `{type:'error', code}` event.
 */
export async function streamAssistantChat(
  body: AssistantChatBody,
  onEvent: (ev: AssistantStreamEvent) => void,
  signal?: AbortSignal,
  deps: StreamDeps = {},
): Promise<void> {
  const fetchImpl = deps.fetchImpl ?? authedFetch;
  const visitor = (deps.visitorHeader ?? assistantVisitorHeader)();
  let res: Response;
  try {
    res = await fetchImpl(`${getBaseURL()}/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream', ...visitor },
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if (err instanceof QuotaExceededError) {
      onEvent({ type: 'error', code: 'limit', message: err.message });
      return;
    }
    throw err;
  }
  if (!res.ok || !res.body) {
    onEvent({ type: 'error', code: await refusalCode(res), message: `HTTP ${res.status}` });
    return;
  }
  await readSSEStream(res.body, (data) => {
    let json: unknown;
    try {
      json = JSON.parse(data);
    } catch {
      return;
    }
    const parsed = AssistantStreamEventSchema.safeParse(json);
    if (parsed.success) onEvent(parsed.data);
  });
}

async function refusalCode(res: Response): Promise<AssistantRefusal> {
  let code = '';
  try {
    const b = (await res.clone().json()) as { error?: unknown };
    if (typeof b.error === 'string') code = b.error;
  } catch {
    // not JSON
  }
  if (res.status === 429) return code === 'quota_exceeded' ? 'limit' : 'rate_limited';
  if (res.status === 401) return 'sign_in_required';
  if (res.status === 404) return 'not_found';
  if (code === 'assistant_paused') return 'assistant_paused';
  return code && /^[a-z_]{2,40}$/.test(code) ? code : `http_${res.status}`;
}
