'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authedFetch } from '@/lib/auth/authedFetch';
import { useAuth } from '@/lib/auth/AuthProvider';
import { trackVoiceCreated } from '@/lib/voices/analytics';
import {
  convertVoice,
  createVoice,
  deleteVoice,
  designVoice,
  fetchVoices,
  fetchVoicesCapabilities,
  previewDesign,
  renameVoice,
  shiftVoice,
  speak,
  speakPreset,
  type ConvertInput,
  type CreateVoiceInput,
  type DesignInput,
  type Fetcher,
  type ShiftInput,
  type SpeakInput,
} from '@/lib/voices/voicesApi';

/**
 * React Query hooks for the voices routes (MM78 decision 1). Routes and shapes are the
 * MM77 contract (lib/voices/voicesApi.ts). Job routes answer 202 {jobId}; the caller
 * hands the id to the existing `useGetJobStatus` poller and `ResultPanel`, there is no
 * second poller here.
 *
 * Analytics (MM79): voice_created fires here on a 201 (lib/voices/analytics.ts);
 * voice_generated fires once per completed job where the job is watched
 * (VoiceJobResult on the tool pages, the Darkroom voiceover dialog), because only a
 * finished job knows the generated length.
 */

/** authedFetch with the plain fetch signature the client module takes. */
const fetcher: Fetcher = (input, init) => authedFetch(input, init ?? {});

export const VOICES_QUERY_KEY = ['voices'] as const;

/** GET /api/voices/capabilities. Short staleTime: `warm` changes as the engine loads and idles. */
export function useVoicesCapabilities() {
  const auth = useAuth();
  // The answer depends on who asks (limits, signedIn): re-read on sign-in / sign-out.
  const who = auth?.user?.uid ?? 'anonymous';
  return useQuery({
    queryKey: [...VOICES_QUERY_KEY, 'capabilities', who],
    queryFn: () => fetchVoicesCapabilities(fetcher),
    staleTime: 10_000,
    refetchOnWindowFocus: false,
  });
}

/** GET /api/voices. Only runs for a signed-in caller (the route answers 401 otherwise). */
export function useVoices(enabled = true) {
  const auth = useAuth();
  const uid = auth?.user?.uid ?? null;
  return useQuery({
    queryKey: [...VOICES_QUERY_KEY, 'list', uid],
    queryFn: () => fetchVoices(fetcher),
    enabled: enabled && !!uid,
    staleTime: 30_000,
    retry: 1,
  });
}

function useInvalidateVoices() {
  const qc = useQueryClient();
  return () => void qc.invalidateQueries({ queryKey: [...VOICES_QUERY_KEY, 'list'] });
}

export function useCreateVoice() {
  const invalidate = useInvalidateVoices();
  return useMutation({
    mutationFn: (input: CreateVoiceInput) => createVoice(fetcher, input),
    onSuccess: (voice, input) => trackVoiceCreated('cloned', voice.languageHint || input.languageHint),
    onSettled: invalidate,
  });
}

export function usePreviewDesign() {
  return useMutation({ mutationFn: (input: DesignInput) => previewDesign(fetcher, input) });
}

export function useDesignVoice() {
  const invalidate = useInvalidateVoices();
  return useMutation({
    mutationFn: (input: DesignInput & { name: string }) => designVoice(fetcher, input),
    onSuccess: (voice, input) => trackVoiceCreated('designed', voice.languageHint || input.language),
    onSettled: invalidate,
  });
}

export function useRenameVoice() {
  const invalidate = useInvalidateVoices();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => renameVoice(fetcher, id, name),
    onSettled: invalidate,
  });
}

export function useDeleteVoice() {
  const invalidate = useInvalidateVoices();
  return useMutation({
    mutationFn: (id: string) => deleteVoice(fetcher, id),
    onSettled: invalidate,
  });
}

/** Speak with a saved voice (sign-in required). */
export function useSpeak() {
  return useMutation({
    mutationFn: ({ voiceId, ...input }: SpeakInput & { voiceId: string }) => speak(fetcher, voiceId, input),
  });
}

/** Speak with a preset voice (anonymous allowed, counted as ai_ops). */
export function useSpeakPreset() {
  return useMutation({
    mutationFn: ({ preset, ...input }: Omit<SpeakInput, 'exaggeration'> & { preset: string }) => speakPreset(fetcher, preset, input),
  });
}

export function useConvertVoice() {
  return useMutation({
    mutationFn: (input: ConvertInput) => convertVoice(fetcher, input),
  });
}

export function useShiftVoice() {
  return useMutation({
    mutationFn: (input: ShiftInput) => shiftVoice(fetcher, input),
  });
}
