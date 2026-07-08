'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { drQueryRetry } from './apiClient';
import * as api from './chatLabApi';
import type {
  ChatLabProject,
  ChatLabProjectDetail,
  ChatLabSession,
  ChatLabSessionDetailResponse,
} from '@/schemas/drChatLab';

// Query keys, namespaced ['dr','chatlab',…] so a single invalidate can target
// the whole feature, the session lists, one session, or the projects (mirrors
// feedbackKeys). Session lists carry a projectId dimension: 'general' is the
// project-free sidebar list; a project id scopes to that project's chats.
export const chatLabKeys = {
  all: ['dr', 'chatlab'] as const,
  models: () => ['dr', 'chatlab', 'models'] as const,
  sessionsRoot: ['dr', 'chatlab', 'sessions'] as const, // prefix matching ALL session lists
  sessions: (projectId?: string) => ['dr', 'chatlab', 'sessions', projectId ?? 'general'] as const,
  session: (sessionId: string) => ['dr', 'chatlab', 'session', sessionId] as const,
};

export const projectKeys = {
  projects: () => ['dr', 'chatlab', 'projects'] as const,
  project: (projectId: string) => ['dr', 'chatlab', 'project', projectId] as const,
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

/** A session list: general chats by default, one project's chats when
 *  projectId is set. No SSE nudges for the chat lab (v1) — reconciliation
 *  happens via invalidation on send/navigate, plus refetch-on-focus for the
 *  second user's additions. */
export function useChatLabSessions(opts?: { projectId?: string }) {
  const projectId = opts?.projectId;
  return useQuery({
    queryKey: chatLabKeys.sessions(projectId),
    queryFn: () => api.fetchChatLabSessions(projectId),
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

/** All projects (sidebar + any picker). */
export function useChatLabProjects() {
  return useQuery({
    queryKey: projectKeys.projects(),
    queryFn: api.fetchChatLabProjects,
    staleTime: 10_000,
    refetchOnWindowFocus: true,
    retry: drQueryRetry,
  });
}

/** One project's full detail (context, assets, sessions). Polls every 5s ONLY
 *  while the memory updater is running, so the Memory card livens without a
 *  standing interval. */
export function useChatLabProject(projectId: string | null) {
  return useQuery({
    queryKey: projectKeys.project(projectId ?? ''),
    queryFn: () => api.fetchChatLabProject(projectId as string),
    enabled: !!projectId,
    staleTime: 5_000,
    refetchOnWindowFocus: true,
    refetchInterval: (query) => (query.state.data?.memoryStatus === 'updating' ? 5_000 : false),
    retry: drQueryRetry,
  });
}

// ---- Session mutations -------------------------------------------------------

export function useCreateChatLabSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (projectId?: string) => api.createChatLabSession(projectId),
    onSuccess: (session: ChatLabSession) => {
      // Seed both caches so the new chat renders instantly on navigation.
      qc.setQueryData<ChatLabSession[]>(chatLabKeys.sessions(session.projectId ?? undefined), (old) => [
        session,
        ...(old ?? []),
      ]);
      qc.setQueryData<ChatLabSessionDetailResponse>(chatLabKeys.session(session.id), {
        session,
        project: null, // breadcrumb hydrates on the real fetch
        messages: [],
      });
      void qc.invalidateQueries({ queryKey: chatLabKeys.sessions(session.projectId ?? undefined) });
      if (session.projectId) {
        void qc.invalidateQueries({ queryKey: projectKeys.project(session.projectId) });
        void qc.invalidateQueries({ queryKey: projectKeys.projects() });
      }
    },
  });
}

export function useRenameChatLabSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, title }: { sessionId: string; title: string }) =>
      api.renameChatLabSession(sessionId, title),
    onSuccess: (session: ChatLabSession) => {
      qc.setQueryData<ChatLabSession[]>(chatLabKeys.sessions(session.projectId ?? undefined), (old) =>
        old?.map((s) => (s.id === session.id ? session : s)),
      );
      qc.setQueryData<ChatLabSessionDetailResponse | undefined>(chatLabKeys.session(session.id), (old) =>
        old ? { ...old, session } : old,
      );
      void qc.invalidateQueries({ queryKey: chatLabKeys.sessionsRoot });
      if (session.projectId) void qc.invalidateQueries({ queryKey: projectKeys.project(session.projectId) });
    },
  });
}

export function useDeleteChatLabSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => api.deleteChatLabSession(sessionId),
    onSuccess: (_data, sessionId) => {
      qc.removeQueries({ queryKey: chatLabKeys.session(sessionId) });
      // The session may live in any list (general or a project's) — refresh
      // them all plus the project caches (chat counts).
      void qc.invalidateQueries({ queryKey: chatLabKeys.sessionsRoot });
      void qc.invalidateQueries({ queryKey: projectKeys.projects() });
      qc.setQueriesData<ChatLabSession[]>({ queryKey: chatLabKeys.sessionsRoot }, (old) =>
        old?.filter((s) => s.id !== sessionId),
      );
    },
  });
}

// ---- Project mutations ---------------------------------------------------------

export function useCreateChatLabProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: api.CreateChatLabProjectBody) => api.createChatLabProject(body),
    onSuccess: (project: ChatLabProject) => {
      qc.setQueryData<ChatLabProject[]>(projectKeys.projects(), (old) => [project, ...(old ?? [])]);
      void qc.invalidateQueries({ queryKey: projectKeys.projects() });
    },
  });
}

export function useUpdateChatLabProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, body }: { projectId: string; body: api.UpdateChatLabProjectBody }) =>
      api.updateChatLabProject(projectId, body),
    onSuccess: (project: ChatLabProject) => {
      qc.setQueryData<ChatLabProject[]>(projectKeys.projects(), (old) =>
        old?.map((p) => (p.id === project.id ? project : p)),
      );
      qc.setQueryData<ChatLabProjectDetail | undefined>(projectKeys.project(project.id), (old) =>
        old ? { ...old, ...project } : old,
      );
      // Description/instructions edits fire the memory updater server-side —
      // refetch the detail so memoryStatus ('updating') starts the poll.
      void qc.invalidateQueries({ queryKey: projectKeys.project(project.id) });
      void qc.invalidateQueries({ queryKey: projectKeys.projects() });
    },
  });
}

export function useDeleteChatLabProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (projectId: string) => api.deleteChatLabProject(projectId),
    onSuccess: (_data, projectId) => {
      qc.setQueryData<ChatLabProject[]>(projectKeys.projects(), (old) => old?.filter((p) => p.id !== projectId));
      qc.removeQueries({ queryKey: projectKeys.project(projectId) });
      qc.removeQueries({ queryKey: chatLabKeys.sessions(projectId) });
      void qc.invalidateQueries({ queryKey: projectKeys.projects() });
    },
  });
}

export function useRefreshChatLabMemory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (projectId: string) => api.refreshChatLabProjectMemory(projectId),
    onSuccess: (_res, projectId) => {
      // Refetch the detail: memoryStatus flips to 'updating' → the 5s poll in
      // useChatLabProject takes over until it lands back on idle/error.
      void qc.invalidateQueries({ queryKey: projectKeys.project(projectId) });
    },
  });
}
