'use client';

import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import { drQueryRetry } from './apiClient';
import * as api from './feedbackApi';
import type {
  DrConversationSummary,
  DrMessage,
  DrMessagesPage,
  DrRepliesResponse,
  DrThreadListItem,
  DrThreadsPage,
} from '@/schemas/drFeedback';

// Query keys, namespaced ['dr','feedback',…] so a single invalidate can target
// the whole feature or one conversation/thread.
export const feedbackKeys = {
  all: ['dr', 'feedback'] as const,
  users: () => ['dr', 'feedback', 'users'] as const,
  conversations: () => ['dr', 'feedback', 'conversations'] as const,
  messages: (conversationId: string) => ['dr', 'feedback', 'messages', conversationId] as const,
  replies: (messageId: string) => ['dr', 'feedback', 'replies', messageId] as const,
  threads: () => ['dr', 'feedback', 'threads'] as const,
};

// ---- Queries ---------------------------------------------------------------

/** The DR_ALLOWED_EMAILS directory (rarely changes — long stale time). */
export function useFeedbackUsers() {
  return useQuery({
    queryKey: feedbackKeys.users(),
    queryFn: api.fetchFeedbackUsers,
    staleTime: 5 * 60_000,
    retry: drQueryRetry,
  });
}

/** The sidebar summary. Polls every 20s (foundation), refetch on focus. */
export function useConversations() {
  return useQuery({
    queryKey: feedbackKeys.conversations(),
    queryFn: api.fetchConversations,
    refetchInterval: 20_000,
    refetchOnWindowFocus: true,
    retry: drQueryRetry,
  });
}

/**
 * Reverse-infinite message list. Page 0 (pageParam undefined) is the NEWEST
 * batch; "next" page = OLDER (cursor = the oldest message id currently loaded).
 * Polls every 5s while the tab is visible only (the accelerant is SSE; polling
 * is the always-on floor). staleTime under the presigned-URL TTL so refetches
 * keep attachment links fresh.
 */
export function useMessages(conversationId: string) {
  return useInfiniteQuery({
    queryKey: feedbackKeys.messages(conversationId),
    queryFn: ({ pageParam }) => api.fetchMessages(conversationId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore && lastPage.messages.length > 0 ? lastPage.messages[0].id : undefined,
    enabled: !!conversationId,
    refetchInterval: 5_000,
    refetchIntervalInBackground: false,
    staleTime: 2_000,
    retry: drQueryRetry,
  });
}

/** Infinite threads list, newest-activity first ("next" = older). */
export function useThreads() {
  return useInfiniteQuery({
    queryKey: feedbackKeys.threads(),
    queryFn: ({ pageParam }) => api.fetchThreads(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore && lastPage.threads.length > 0
        ? lastPage.threads[lastPage.threads.length - 1].message.id
        : undefined,
    refetchInterval: 20_000,
    refetchIntervalInBackground: false,
    retry: drQueryRetry,
  });
}

/** A single thread (parent + replies). Enabled only when a thread is open. */
export function useReplies(messageId: string | null) {
  return useQuery({
    queryKey: feedbackKeys.replies(messageId ?? ''),
    queryFn: () => api.fetchReplies(messageId as string),
    enabled: !!messageId,
    refetchInterval: 5_000,
    refetchIntervalInBackground: false,
    staleTime: 2_000,
    retry: drQueryRetry,
  });
}

// ---- Cache-shaping helpers -------------------------------------------------

/** Flatten an infinite messages result to a single oldest→newest list. */
export function flattenMessages(data: InfiniteData<DrMessagesPage> | undefined): DrMessage[] {
  if (!data) return [];
  // pages[0] is the newest batch; reverse page order so the overall list runs
  // oldest→newest (each page is already oldest→newest internally).
  return [...data.pages].reverse().flatMap((p) => p.messages);
}

/** Flatten an infinite threads result to a single newest-first list. */
export function flattenThreads(data: InfiniteData<DrThreadsPage> | undefined): DrThreadListItem[] {
  if (!data) return [];
  return data.pages.flatMap((p) => p.threads);
}

// ---- Mutations -------------------------------------------------------------

// useFeedbackActions bundles the mutations with cache updates. Sends append via
// setQueryData for instant feedback, then invalidate to reconcile with server
// truth (reply counts, ordering) — no optimistic-rollback complexity.
export function useFeedbackActions() {
  const qc = useQueryClient();

  const sendMessage = async (conversationId: string, body: api.SendMessageBody): Promise<DrMessage> => {
    const msg = await api.sendMessage(conversationId, body);
    if (body.parentId) {
      const parentId = body.parentId;
      qc.setQueryData<DrRepliesResponse | undefined>(feedbackKeys.replies(parentId), (old) => {
        if (!old) return old;
        if (old.replies.some((r) => r.id === msg.id)) return old;
        return {
          ...old,
          replies: [...old.replies, msg],
          parent: { ...old.parent, replyCount: old.parent.replyCount + 1 },
        };
      });
      qc.invalidateQueries({ queryKey: feedbackKeys.replies(parentId) });
    } else {
      qc.setQueryData<InfiniteData<DrMessagesPage> | undefined>(feedbackKeys.messages(conversationId), (old) => {
        if (!old || old.pages.length === 0) return old;
        return {
          ...old,
          pages: old.pages.map((p, i) =>
            i === 0 && !p.messages.some((m) => m.id === msg.id)
              ? { ...p, messages: [...p.messages, msg] }
              : p,
          ),
        };
      });
    }
    qc.invalidateQueries({ queryKey: feedbackKeys.messages(conversationId) });
    qc.invalidateQueries({ queryKey: feedbackKeys.conversations() });
    qc.invalidateQueries({ queryKey: feedbackKeys.threads() });
    return msg;
  };

  const createConversation = async (body: api.CreateConversationBody): Promise<DrConversationSummary> => {
    const convo = await api.createConversation(body);
    qc.invalidateQueries({ queryKey: feedbackKeys.conversations() });
    return convo;
  };

  const markRead = async (conversationId: string): Promise<void> => {
    await api.markConversationRead(conversationId);
    qc.invalidateQueries({ queryKey: feedbackKeys.conversations() });
  };

  return { sendMessage, createConversation, markRead };
}
