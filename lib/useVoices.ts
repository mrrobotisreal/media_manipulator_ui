'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authedFetch } from '@/lib/auth/authedFetch';
import { useAuth } from '@/lib/auth/AuthProvider';
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
 * Analytics: no event names here. The `// MM79` markers are where voice_created /
 * voice_generated land when MM79 adds them to the catalogs.
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
    // MM79: voice_created {kind: 'cloned', languageHint}
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
    // MM79: voice_created {kind: 'designed', languageHint}
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
    // MM79: voice_generated {kind: 'tts', source: 'tool_page'}
  });
}

/** Speak with a preset voice (anonymous allowed, counted as ai_ops). */
export function useSpeakPreset() {
  return useMutation({
    mutationFn: ({ preset, ...input }: Omit<SpeakInput, 'exaggeration'> & { preset: string }) => speakPreset(fetcher, preset, input),
    // MM79: voice_generated {kind: 'tts', source: 'tool_page'}
  });
}

export function useConvertVoice() {
  return useMutation({
    mutationFn: (input: ConvertInput) => convertVoice(fetcher, input),
    // MM79: voice_generated {kind: 'convert', source: 'tool_page'}
  });
}

export function useShiftVoice() {
  return useMutation({
    mutationFn: (input: ShiftInput) => shiftVoice(fetcher, input),
    // MM79: voice_generated {kind: 'shift', source: 'tool_page'}
  });
}
