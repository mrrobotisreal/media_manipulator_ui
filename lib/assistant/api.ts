/**
 * Medi's REST calls (MM104 routes). Every call goes through authedFetch, so it carries
 * X-MM-Session-ID always and the Firebase token when signed in; the chat stream itself is in
 * `stream.ts`. The API is the source of truth: shapes are parsed with `schemas/assistant.ts`.
 */
import { authedFetch } from '@/lib/auth/authedFetch';
import { getBaseURL } from '@/lib/utils';
import {
  AssistantCapabilitiesSchema,
  AssistantConversationDetailSchema,
  AssistantConversationListSchema,
  type AssistantCapabilities,
  type AssistantConversation,
  type AssistantConversationDetail,
  type AssistantSurface,
} from '@/schemas/assistant';

const OFF: AssistantCapabilities = { enabled: false };

/** GET /assistant/capabilities. Any failure reads as "off" (the widget then stays hidden). */
export async function getAssistantCapabilities(fetchImpl: typeof authedFetch = authedFetch): Promise<AssistantCapabilities> {
  try {
    const res = await fetchImpl(`${getBaseURL()}/assistant/capabilities`);
    if (!res.ok) return OFF;
    const parsed = AssistantCapabilitiesSchema.safeParse(await res.json());
    return parsed.success ? parsed.data : OFF;
  } catch {
    return OFF;
  }
}

/** Is the guide answering for this caller? */
export function guideEnabled(caps: AssistantCapabilities | null | undefined): boolean {
  return !!caps && caps.enabled && caps.guide.enabled;
}

/** The caller's last conversations on one surface (signed-in only; newest first, at most `limit`). */
export async function listAssistantConversations(
  surface: AssistantSurface,
  limit = 20,
  fetchImpl: typeof authedFetch = authedFetch,
): Promise<AssistantConversation[]> {
  const res = await fetchImpl(`${getBaseURL()}/assistant/conversations?surface=${encodeURIComponent(surface)}`);
  if (!res.ok) throw new Error(`conversations ${res.status}`);
  return AssistantConversationListSchema.parse(await res.json()).conversations.slice(0, limit);
}

export async function getAssistantConversation(
  id: string,
  fetchImpl: typeof authedFetch = authedFetch,
): Promise<AssistantConversationDetail> {
  const res = await fetchImpl(`${getBaseURL()}/assistant/conversations/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`conversation ${res.status}`);
  return AssistantConversationDetailSchema.parse(await res.json());
}

export async function deleteAssistantConversation(id: string, fetchImpl: typeof authedFetch = authedFetch): Promise<void> {
  const res = await fetchImpl(`${getBaseURL()}/assistant/conversations/${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`delete ${res.status}`);
}

/** POST /assistant/messages/:id/feedback. Signed-in only (the message id exists only then). */
export async function sendAssistantFeedback(
  messageId: string,
  rating: 'up' | 'down',
  fetchImpl: typeof authedFetch = authedFetch,
): Promise<boolean> {
  try {
    const res = await fetchImpl(`${getBaseURL()}/assistant/messages/${encodeURIComponent(messageId)}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** A file the visitor dropped into the guide (MM116a): POST /assistant/files. */
export interface AssistantDroppedFile {
  fileRef: string;
  name: string;
  kind: 'image' | 'video' | 'audio' | 'document';
  mime: string;
  sizeBytes: number;
}

export class AssistantFileError extends Error {
  constructor(public readonly code: string) {
    super(code);
  }
}

/**
 * Upload one file for the guide to look at. Free like the guide (the uploads rate bucket applies);
 * stored like a job upload, so the visitor's retention window deletes it. Throws
 * `AssistantFileError` with the API's code (`file_too_large`, `unsupported_file`, ...).
 */
export async function uploadAssistantFile(file: File, fetchImpl: typeof authedFetch = authedFetch): Promise<AssistantDroppedFile> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetchImpl(`${getBaseURL()}/assistant/files`, { method: 'POST', body: form });
  if (!res.ok) {
    let code = `http_${res.status}`;
    try {
      const b = (await res.clone().json()) as { error?: unknown };
      if (typeof b.error === 'string' && /^[a-z_]{2,40}$/.test(b.error)) code = b.error;
    } catch {
      // not JSON
    }
    throw new AssistantFileError(code);
  }
  return (await res.json()) as AssistantDroppedFile;
}
