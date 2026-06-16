/**
 * Content Studio embed protocol — the typed, versioned postMessage contract
 * between the CreaTV host (Darkroom) and the embedded MM editor iframe.
 *
 * THIS FILE IS A SHARED SPEC. An identical copy lives in CreaTV at
 * `src/lib/contentStudioEmbedProtocol.ts`. Keep the two in sync and bump
 * PROTOCOL_VERSION on any breaking change.
 *
 * Direction matters:
 *   Host → Embed: cs:init, cs:token, cs:command
 *   Embed → Host: cs:ready, cs:request-token, cs:state, cs:export-*,
 *                 cs:publish-request, cs:resize, cs:fullscreen-request,
 *                 and cs:command{action:'close'} (Back from inside the editor)
 *
 * Security: every listener validates event.origin against an allowlist before
 * trusting a message, and token-bearing messages are always posted with an
 * explicit targetOrigin (never '*').
 */

export const PROTOCOL_VERSION = 1;

export type StudioEcosystem = 'mm' | 'creatv';

export interface EmbedScope {
  userId: number;
  channelId: number;
  draftId: number;
}

export interface EmbedCapabilities {
  exportTarget?: 'download' | 'draft';
  supportsSSE?: boolean;
  publish?: boolean;
  captions?: boolean;
  peaks?: boolean;
  lut?: boolean;
}

// --- Host → Embed ----------------------------------------------------------
export interface CsInitMessage {
  type: 'cs:init';
  version: number;
  ecosystem: 'creatv';
  apiBaseUrl: string;
  token: string;
  scope: EmbedScope;
  projectId?: string;
  theme?: 'dark' | 'light';
  capabilities?: EmbedCapabilities;
}

export interface CsTokenMessage {
  type: 'cs:token';
  token: string;
  /** epoch ms when the token expires (optional, for proactive refresh). */
  expiresAt?: number;
}

export interface CsCommandMessage {
  type: 'cs:command';
  action: 'save' | 'export' | 'close';
}

export type HostToEmbedMessage = CsInitMessage | CsTokenMessage | CsCommandMessage;

// --- Embed → Host ----------------------------------------------------------
export interface CsReadyMessage {
  type: 'cs:ready';
  version: number;
}

export interface CsRequestTokenMessage {
  type: 'cs:request-token';
}

export interface CsStateMessage {
  type: 'cs:state';
  status: 'idle' | 'saving' | 'saved' | 'dirty';
  projectId?: string;
}

export interface CsExportStartedMessage {
  type: 'cs:export-started';
  jobId: string;
}

export interface CsExportProgressMessage {
  type: 'cs:export-progress';
  jobId: string;
  progress: number;
}

export interface CsExportCompleteMessage {
  type: 'cs:export-complete';
  jobId: string;
  draftId?: number;
}

export interface CsExportFailedMessage {
  type: 'cs:export-failed';
  jobId: string;
  error: string;
}

export interface CsPublishRequestMessage {
  type: 'cs:publish-request';
  draftId: number;
  jobId: string;
  suggestedTitle?: string;
  durationSeconds?: number;
}

export interface CsResizeMessage {
  type: 'cs:resize';
  height: number;
}

export interface CsFullscreenRequestMessage {
  type: 'cs:fullscreen-request';
}

export type EmbedToHostMessage =
  | CsReadyMessage
  | CsRequestTokenMessage
  | CsStateMessage
  | CsExportStartedMessage
  | CsExportProgressMessage
  | CsExportCompleteMessage
  | CsExportFailedMessage
  | CsPublishRequestMessage
  | CsResizeMessage
  | CsFullscreenRequestMessage
  // Back-from-editor reuses cs:command with action 'close'.
  | CsCommandMessage;

export type EmbedMessage = HostToEmbedMessage | EmbedToHostMessage;

/** Narrow an untrusted postMessage payload to a protocol message. */
export function isEmbedMessage(data: unknown): data is EmbedMessage {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as { type?: unknown }).type === 'string' &&
    (data as { type: string }).type.startsWith('cs:')
  );
}

/** Parse a space/comma-separated origin allowlist into a normalized set. */
export function parseAllowedOrigins(raw: string | undefined, fallback: string[]): string[] {
  const list = (raw ?? '')
    .split(/[\s,]+/)
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean);
  return list.length > 0 ? list : fallback;
}

/** Strip the scheme so a scheme-less allowlist entry can match by host[:port]. */
function originHostPart(value: string): string {
  return value.replace(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//, '');
}

export function isOriginAllowed(origin: string, allowlist: string[]): boolean {
  const normalized = origin.replace(/\/$/, '');
  const host = originHostPart(normalized);
  return allowlist.some((raw) => {
    const entry = raw.replace(/\/$/, '');
    if (!entry) return false;
    if (entry === normalized) return true;
    // event.origin ALWAYS carries a scheme (e.g. "http://localhost:8080"), so a
    // scheme-less env value like "localhost:8080" or "creatv.io" would never
    // match an exact compare. Treat a scheme-less entry as host[:port] and match
    // it regardless of scheme. Use full "https://host" entries for strict matching.
    if (!entry.includes('://') && entry === host) return true;
    return false;
  });
}
