'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { drQueryRetry } from './apiClient';
import * as api from './chatLabApi';
import type { ChatLabSession, ChatLabSessionDetailResponse } from '@/schemas/drChatLab';

// Query keys, namespaced ['dr','chatlab',…] so a single invalidate can target
// the whole feature, the session list, or one session (mirrors feedbackKeys).
export const chatLabKeys = {
  all: ['dr', 'chatlab'] as const,
  models: () => ['dr', 'chatlab', 'models'] as const,
  sessions: () => ['dr', 'chatlab', 'sessions'] as const,
  session: (sessionId: string) => ['dr', 'chatlab', 'session', sessionId] as const,
};

// ---- Queries ---------------------------------------------------------------

/** The filtered model catalog (server caches for 1h — mirror that here). */
export function useChatLabModels() {
  return useQuery({
    queryKey: chatLabKeys.models(),
    queryFn: api.fetchChatLabModels,
    staleTime: 60 * 60_000,
    retry: drQueryRetry,
  });
}

/** The sidebar session list, newest activity first. No SSE nudges for the
 *  chat lab (v1) — reconciliation happens via invalidation on send/navigate,
 *  plus a modest refetch-on-focus for the second user's additions. */
export function useChatLabSessions() {
  return useQuery({
    queryKey: chatLabKeys.sessions(),
    queryFn: api.fetchChatLabSessions,
    staleTime: 10_000,
    refetchOnWindowFocus: true,
    retry: drQueryRetry,
  });
}

/** One session + its full message history. staleTime kept short so streaming
 *  reconciliation (invalidate after done/stop/error) refetches promptly. */
export function useChatLabSession(sessionId: string | null) {
  return useQuery({
    queryKey: chatLabKeys.session(sessionId ?? ''),
    queryFn: () => api.fetchChatLabSession(sessionId as string),
    enabled: !!sessionId,
    staleTime: 2_000,
    retry: drQueryRetry,
  });
}

// ---- Mutations -------------------------------------------------------------

export function useCreateChatLabSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createChatLabSession,
    onSuccess: (session: ChatLabSession) => {
      // Seed both caches so the new chat renders instantly on navigation.
      qc.setQueryData<ChatLabSession[]>(chatLabKeys.sessions(), (old) => [session, ...(old ?? [])]);
      qc.setQueryData<ChatLabSessionDetailResponse>(chatLabKeys.session(session.id), {
        session,
        messages: [],
      });
      void qc.invalidateQueries({ queryKey: chatLabKeys.sessions() });
    },
  });
}

export function useRenameChatLabSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, title }: { sessionId: string; title: string }) =>
      api.renameChatLabSession(sessionId, title),
    onSuccess: (session: ChatLabSession) => {
      qc.setQueryData<ChatLabSession[]>(chatLabKeys.sessions(), (old) =>
        old?.map((s) => (s.id === session.id ? session : s)),
      );
      qc.setQueryData<ChatLabSessionDetailResponse | undefined>(chatLabKeys.session(session.id), (old) =>
        old ? { ...old, session } : old,
      );
      void qc.invalidateQueries({ queryKey: chatLabKeys.sessions() });
    },
  });
}

export function useDeleteChatLabSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => api.deleteChatLabSession(sessionId),
    onSuccess: (_data, sessionId) => {
      qc.setQueryData<ChatLabSession[]>(chatLabKeys.sessions(), (old) => old?.filter((s) => s.id !== sessionId));
      qc.removeQueries({ queryKey: chatLabKeys.session(sessionId) });
      void qc.invalidateQueries({ queryKey: chatLabKeys.sessions() });
    },
  });
}
