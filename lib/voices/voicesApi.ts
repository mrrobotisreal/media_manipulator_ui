/**
 * Typed client for /api/voices/* (MM77, design docs/design/VOICES.md §5 + §10).
 *
 * The API is the source of truth: every shape here mirrors a Go struct in
 * media_manipulator_api internal/handlers/voices.go (capabilities body, voiceBody,
 * List, DesignPreview, the 202 job answer) and every error code is one the handler
 * writes with voiceErr. Nothing here invents a limit: the text cap, saved-voice cap and
 * convert flag come from GET /api/voices/capabilities for the caller's tier.
 *
 * Every function takes a `fetcher` (authedFetch in the app, a fake in tests) so the
 * whole module is testable without a network.
 */
import { getBaseURL } from '@/lib/utils';

export type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;

/** One engine group in capabilities.engines (mm-voices /health). */
export interface VoiceEngineHealth {
  loaded: boolean;
  version: string | null;
  models?: string[];
}

/** A preset voice the service offers (POST /presets on mm-voices). */
export interface VoicePreset {
  id: string;
  name: string;
  description: string;
  language: string;
  engine: string;
  kind: string;
  /** Languages this preset speaks; empty = every capabilities language. */
  languages: string[] | null;
}

/** services.VoiceShiftPreset. The UI mirrors the table in lib/voices/shift.ts. */
export interface VoiceShiftPresetBody {
  id: string;
  semitones: number;
  formant: 'preserved' | 'shifted';
  filter?: string;
}

/** voicesLimitsBody: the caller's tier. */
export interface VoicesLimits {
  voicesSaved: number;
  voicesMaxSeconds: number;
  voicesConvert: boolean;
  voicesConvertMaxSeconds: number;
  /** voicesMaxSeconds × 18 (tiers.VoicesTextCap); 0 = speaking not allowed. */
  textMaxChars: number;
}

/** GET /api/voices/capabilities. Always 200, also with the service down. */
export interface VoicesCapabilities {
  enabled: boolean;
  /** Chatterbox loaded; false = the next request pays a 10 to 20 s cold start. */
  warm: boolean;
  engines: Record<string, VoiceEngineHealth>;
  /** Chatterbox languages: speak and convert. */
  languages: string[];
  /** Qwen3-TTS languages: a designed voice's reference can only be rendered in these. */
  designLanguages: string[];
  presets: VoicePreset[];
  shiftPresets: VoiceShiftPresetBody[];
  signedIn: boolean;
  limits: VoicesLimits;
  tier: string;
}

export type VoiceKind = 'cloned' | 'designed' | 'preset';

/** voiceBody. */
export interface SavedVoice {
  id: string;
  name: string;
  kind: VoiceKind;
  languageHint: string;
  description?: string;
  seed?: number;
  engineVersion: string;
  consentAt: string | null;
  consentTextVersion?: string;
  /** Presigned, short-lived MP3 of the 6-language preview; absent without S3. */
  previewUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/** GET /api/voices. `limit` is -1 for unlimited (operator). */
export interface VoicesList {
  voices: SavedVoice[];
  limit: number;
  used: number;
}

/** POST /api/voices/design/preview. */
export interface DesignPreview {
  seed: number;
  mime: string;
  seconds: number;
  audioBase64: string;
}

/** The 202 answer of speak / preset speak / convert / shift. */
export interface VoiceJobStart {
  jobId: string;
  tool: 'voice_tts' | 'voice_convert' | 'voice_shift';
}

/** DELETE /api/voices/:id (newDeletedBody). */
export interface VoiceDeleted {
  deleted: { objects: number; bytes: number };
  pending: number;
}

/**
 * Every error code the voices routes write (voiceErr in voices.go), plus the two the
 * shared middleware writes on these routes. Each maps to `panels.json` `voiceTools.errors.<code>`.
 */
export const VOICE_ERROR_CODES = [
  'sign_in_required',
  'consent_required',
  'reference_required',
  'reference_too_short',
  'reference_too_long',
  'reference_too_large',
  'no_speech_detected',
  'not_audio',
  'name_invalid',
  'language_not_supported',
  'voice_limit',
  'text_required',
  'text_too_long',
  'exaggeration_invalid',
  'voice_convert_not_in_plan',
  'voice_input_too_long',
  'input_required',
  'input_too_large',
  'voice_required',
  'voice_not_found',
  'preset_not_found',
  'description_required',
  'description_too_long',
  'preview_limit',
  'session_required',
  'semitones_invalid',
  'shift_invalid',
  'voices_unavailable',
  'voices_storage_unavailable',
  'voices_timeout',
  'voice_request_refused',
  'upload_failed',
  'job_failed',
  'invalid_body',
  // The route limiter's 429 (voices_create, voices_design_preview) carries prose, not a code.
  'rate_limited',
  'generic',
] as const;

export type VoiceErrorCode = (typeof VOICE_ERROR_CODES)[number];

const KNOWN = new Set<string>(VOICE_ERROR_CODES);

/** A refused voices request, with the server's code and the extra fields it sent. */
export class VoiceApiError extends Error {
  readonly status: number;
  readonly code: VoiceErrorCode;
  /** limit / used / tier / seconds / retryAfterSeconds, when the server sent them. */
  readonly detail: Record<string, unknown>;

  constructor(status: number, code: VoiceErrorCode, message: string, detail: Record<string, unknown> = {}) {
    super(message || code);
    this.name = 'VoiceApiError';
    this.status = status;
    this.code = code;
    this.detail = detail;
  }
}

/** Server code → the code the UI translates; unknown codes fall back to `generic`. */
export function voiceErrorCode(status: number, body: unknown): VoiceErrorCode {
  const raw = typeof body === 'object' && body !== null ? (body as { error?: unknown }).error : undefined;
  if (typeof raw === 'string' && KNOWN.has(raw)) return raw as VoiceErrorCode;
  if (status === 429) return 'rate_limited';
  if (status === 401) return 'sign_in_required';
  if (status === 503) return 'voices_unavailable';
  return 'generic';
}

/** The i18n key (panels namespace) for an error. */
export function voiceErrorKey(code: VoiceErrorCode): string {
  return `voiceTools.errors.${code}`;
}

/** The interpolation values an error message may use ({{limit}}, {{seconds}}). */
export function voiceErrorValues(err: VoiceApiError): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const k of ['limit', 'used', 'seconds', 'retryAfterSeconds', 'maxSeconds', 'minSeconds'] as const) {
    const v = err.detail[k];
    if (typeof v === 'number' || typeof v === 'string') out[k] = v;
  }
  return out;
}

async function readJson<T>(response: Response): Promise<T> {
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const code = voiceErrorCode(response.status, body);
    const obj = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};
    const message = typeof obj.message === 'string' ? obj.message : '';
    throw new VoiceApiError(response.status, code, message, obj);
  }
  return body as T;
}

const url = (path: string) => `${getBaseURL()}/voices${path}`;
const json = (body: unknown): RequestInit => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export function fetchVoicesCapabilities(fetcher: Fetcher): Promise<VoicesCapabilities> {
  return fetcher(url('/capabilities')).then((r) => readJson<VoicesCapabilities>(r));
}

export function fetchVoices(fetcher: Fetcher): Promise<VoicesList> {
  return fetcher(url('')).then((r) => readJson<VoicesList>(r));
}

export interface CreateVoiceInput {
  reference: Blob;
  /** File name for the multipart part; the server only reads its extension. */
  fileName: string;
  name: string;
  languageHint: string;
  /** Must be literally true; the consent gate disables Create until it is. */
  consent: true;
  consentTextVersion: string;
}

/** POST /api/voices (multipart): synchronous, 201 with the voice (one ai_ops: the preview). */
export function createVoice(fetcher: Fetcher, input: CreateVoiceInput): Promise<SavedVoice> {
  const form = new FormData();
  form.append('reference', input.reference, input.fileName);
  form.append('name', input.name);
  form.append('languageHint', input.languageHint);
  form.append('consent', input.consent ? 'true' : 'false');
  // The server stores its own VOICES_CONSENT_TEXT_VERSION; the client sends the version
  // of the copy it showed so a mismatch is visible in request logs.
  form.append('consentTextVersion', input.consentTextVersion);
  return fetcher(url(''), { method: 'POST', body: form }).then((r) => readJson<SavedVoice>(r));
}

export interface DesignInput {
  description: string;
  language: string;
  /** Keep the previewed voice: send the seed the preview returned. */
  seed?: number;
}

/** POST /api/voices/design/preview: uncounted, 3 per description per hour, MP3 inline. */
export function previewDesign(fetcher: Fetcher, input: DesignInput): Promise<DesignPreview> {
  return fetcher(url('/design/preview'), json(input)).then((r) => readJson<DesignPreview>(r));
}

/** POST /api/voices/design: synchronous, 201 with the voice (one ai_ops). */
export function designVoice(fetcher: Fetcher, input: DesignInput & { name: string }): Promise<SavedVoice> {
  return fetcher(url('/design'), json(input)).then((r) => readJson<SavedVoice>(r));
}

export function renameVoice(fetcher: Fetcher, id: string, name: string): Promise<SavedVoice> {
  return fetcher(url(`/${encodeURIComponent(id)}`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  }).then((r) => readJson<SavedVoice>(r));
}

export function deleteVoice(fetcher: Fetcher, id: string): Promise<VoiceDeleted> {
  return fetcher(url(`/${encodeURIComponent(id)}`), { method: 'DELETE' }).then((r) => readJson<VoiceDeleted>(r));
}

export interface SpeakInput {
  text: string;
  language: string;
  /** 0.25 to 2; Chatterbox's emotion control. Saved voices only. */
  exaggeration?: number;
}

/** POST /api/voices/:id/speak → 202 job (voice_tts, ai_ops). Sign-in required. */
export function speak(fetcher: Fetcher, voiceId: string, input: SpeakInput): Promise<VoiceJobStart> {
  return fetcher(url(`/${encodeURIComponent(voiceId)}/speak`), json(input)).then((r) => readJson<VoiceJobStart>(r));
}

/** POST /api/voices/presets/:preset/speak → 202 job (anonymous allowed). */
export function speakPreset(fetcher: Fetcher, preset: string, input: Omit<SpeakInput, 'exaggeration'>): Promise<VoiceJobStart> {
  return fetcher(url(`/presets/${encodeURIComponent(preset)}/speak`), json(input)).then((r) => readJson<VoiceJobStart>(r));
}

export interface ConvertInput {
  input: File;
  /** Exactly one of voiceId / preset. */
  target: { voiceId: string } | { preset: string };
  language?: string;
}

/** POST /api/voices/convert (multipart) → 202 job (voice_convert, ai_ops). */
export function convertVoice(fetcher: Fetcher, input: ConvertInput): Promise<VoiceJobStart> {
  const form = new FormData();
  form.append('input', input.input, input.input.name);
  if ('voiceId' in input.target) form.append('voiceId', input.target.voiceId);
  else form.append('preset', input.target.preset);
  if (input.language) form.append('language', input.language);
  return fetcher(url('/convert'), { method: 'POST', body: form }).then((r) => readJson<VoiceJobStart>(r));
}

export interface ShiftInput {
  input: File;
  semitones: number;
  formant: 'preserved' | 'shifted';
  /** A preset id; the server resolves it and it wins over the explicit pair. */
  preset?: string;
}

/** POST /api/voices/shift (multipart) → 202 job (voice_shift, ops). Works with the service down. */
export function shiftVoice(fetcher: Fetcher, input: ShiftInput): Promise<VoiceJobStart> {
  const form = new FormData();
  form.append('input', input.input, input.input.name);
  form.append('semitones', String(input.semitones));
  form.append('formant', input.formant);
  if (input.preset) form.append('preset', input.preset);
  return fetcher(url('/shift'), { method: 'POST', body: form }).then((r) => readJson<VoiceJobStart>(r));
}

/** The MP3 of a design preview as a Blob (the page makes an object URL of it). */
export function previewBlob(preview: DesignPreview): Blob {
  const bin = atob(preview.audioBase64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: preview.mime || 'audio/mpeg' });
}
