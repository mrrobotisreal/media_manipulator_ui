'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { drQueryRetry } from './apiClient';
import * as api from './commentsApi';
import type { DrCommentAnchor } from '@/schemas/drComments';

export function drCommentsKey(slug: string) {
  return ['dr', 'docs', slug, 'comments'] as const;
}

// Published comments for a document. staleTime is well under the presigned-URL
// TTL (S3ResultPresignTTL) so a refetch always yields fresh, unexpired image
// links.
export function useDrComments(slug: string) {
  return useQuery({
    queryKey: drCommentsKey(slug),
    queryFn: () => api.fetchDrComments(slug),
    enabled: !!slug,
    staleTime: 60_000,
    retry: drQueryRetry,
  });
}

// useDrCommentActions bundles the comment/reply mutations with cache
// invalidation. Publish/cancel invalidate the comments query (two users —
// invalidation is simpler and safer than optimistic updates). Draft creation
// and attachment uploads are mid-compose steps and don't invalidate (the draft
// isn't shown until published).
export function useDrCommentActions(slug: string) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: drCommentsKey(slug) });

  return {
    invalidate,
    createDraftComment: (anchor: DrCommentAnchor) => api.createDraftComment(slug, anchor),
    publishComment: async (commentId: string, body: string) => {
      await api.publishComment(commentId, body);
      await invalidate();
    },
    cancelDraftComment: async (commentId: string) => {
      await api.cancelDraftComment(commentId);
      await invalidate();
    },
    createDraftReply: (commentId: string) => api.createDraftReply(commentId),
    publishReply: async (replyId: string, body: string) => {
      await api.publishReply(replyId, body);
      await invalidate();
    },
    cancelDraftReply: async (replyId: string) => {
      await api.cancelDraftReply(replyId);
      await invalidate();
    },
    uploadCommentAttachment: api.uploadCommentAttachment,
    uploadReplyAttachment: api.uploadReplyAttachment,
    deleteAttachment: api.deleteAttachment,
  };
}
