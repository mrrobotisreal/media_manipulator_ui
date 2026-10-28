'use client';

import { useQuery } from '@tanstack/react-query';
import type { StudioBackend, StudioBackendCapabilities } from '@/lib/studio/studioBackend';
import { useStudioBackend } from '@/lib/studio/studioBackendProvider';
import { voiceErrorCode, VoiceApiError, type VoiceJobStart } from '@/lib/voices/voicesApi';
import { isIrreversibleActionHidden } from '@/lib/translator/mode';

/**
 * MM79 — Darkroom "Generate voiceover" (design VOICES.md §4.5), the client half of
 * media_manipulator_api internal/handlers/studio_voiceover.go:
 *
 *   GET  /api/studio/capabilities             {voices}
 *   POST /api/studio/projects/:id/voiceover   {voiceId | preset, text, language, exaggeration?}
 *                                             → 202 {jobId, tool:"voice_tts"}
 *
 * The completed job (GET /api/job/:id) carries `assetId`: the WAV is already an audio
 * asset of the project. Errors are the voices codes (lib/voices/voicesApi.ts), so the
 * MM78 error map applies unchanged.
 */

/** The request body. Exactly one of voiceId / preset. */
export type VoiceoverInput = {
  text: string;
  language: string;
  exaggeration?: number;
} & ({ voiceId: string; preset?: never } | { preset: string; voiceId?: never });

/** Parses GET /studio/capabilities; anything unreadable is `voices:false`. */
export function parseStudioCapabilities(json: unknown): Pick<StudioBackendCapabilities, 'voices'> {
  const voices = typeof json === 'object' && json !== null && (json as { voices?: unknown }).voices === true;
  return { voices };
}

/**
 * Reads the server's extra Darkroom capabilities. An API that predates MM79 answers 404
 * (or the request fails): `voices:false`, the action stays hidden. Never throws.
 */
export async function fetchStudioCapabilities(backend: StudioBackend): Promise<Pick<StudioBackendCapabilities, 'voices'>> {
  if (!backend.capabilitiesUrl) return { voices: false };
  try {
    const res = await backend.fetch(backend.capabilitiesUrl());
    if (!res.ok) return { voices: false };
    return parseStudioCapabilities(await res.json());
  } catch {
    return { voices: false };
  }
}

/**
 * Whether this editor offers Generate voiceover: a backend with the route (MM only; the
 * CreaTV embed reports voices:false and has no voiceoverUrl), the server says voices is
 * up, and not a translator deployment (no AI jobs there).
 */
export function voiceoverAvailable(backend: Pick<StudioBackend, 'capabilities' | 'voiceoverUrl'>, serverVoices: boolean): boolean {
  if (typeof backend.voiceoverUrl !== 'function' || isIrreversibleActionHidden()) return false;
  // The CreaTV backend pins capabilities.voices to false; the MM backend starts false
  // and the server's answer turns it on.
  if (backend.capabilities.voices) return true;
  return backend.capabilities.exportTarget === 'download' && serverVoices;
}

/** React hook: is Generate voiceover available in this editor right now? */
export function useVoiceoverAvailable(): boolean {
  const backend = useStudioBackend();
  const probe = typeof backend.voiceoverUrl === 'function' && backend.capabilities.exportTarget === 'download';
  const query = useQuery({
    queryKey: ['studio', 'capabilities', backend.ecosystem],
    queryFn: () => fetchStudioCapabilities(backend),
    enabled: probe,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: false,
  });
  return voiceoverAvailable(backend, query.data?.voices === true);
}

/** POST /studio/projects/:id/voiceover → the 202 job. Throws VoiceApiError on refusal. */
export async function startVoiceover(backend: StudioBackend, projectId: string, input: VoiceoverInput): Promise<VoiceJobStart> {
  if (!backend.voiceoverUrl) throw new VoiceApiError(503, 'voices_unavailable', 'Voiceover is not available here.');
  const res = await backend.fetch(backend.voiceoverUrl(projectId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const body: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const obj = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};
    throw new VoiceApiError(res.status, voiceErrorCode(res.status, body), typeof obj.message === 'string' ? obj.message : '', obj);
  }
  return body as VoiceJobStart;
}

/** The finished voiceover job as GET /job/:id reports it. */
export interface VoiceoverJobState {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  error?: string;
  assetId?: string;
  resultSeconds?: number;
}

export function parseVoiceoverJob(json: unknown): VoiceoverJobState {
  const d = (json ?? {}) as Record<string, unknown>;
  const status = d.status === 'completed' || d.status === 'failed' || d.status === 'pending' ? d.status : 'processing';
  return {
    status,
    progress: typeof d.progress === 'number' ? d.progress : 0,
    error: typeof d.error === 'string' ? d.error : undefined,
    assetId: typeof d.assetId === 'string' && d.assetId ? d.assetId : undefined,
    resultSeconds: typeof d.resultSeconds === 'number' ? d.resultSeconds : undefined,
  };
}

/** One poll of the job (2 s cadence in the dialog). */
export async function readVoiceoverJob(backend: StudioBackend, jobId: string): Promise<VoiceoverJobState> {
  const res = await backend.fetch(backend.jobUrl(jobId));
  if (!res.ok) throw new Error(`job ${res.status}`);
  return parseVoiceoverJob(await res.json());
}
