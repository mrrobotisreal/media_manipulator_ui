'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createDrDocFolder,
  deleteDrDocFolder,
  drQueryRetry,
  fetchDrDocFolders,
  fetchDrDocs,
  moveDrDoc,
  renameDrDoc,
  updateDrDocFolder,
} from './docsApi';
import type { DrDocFolder, DrDocSummary } from '@/schemas/drDocs';

// List of published DR documents (metadata only — the API omits content here).
// Short staleTime: the portal has two users, so refetching occasionally is fine
// and keeps "Last updated" fresh without hammering the API.
export function useDrDocs() {
  return useQuery({
    queryKey: ['dr', 'docs'],
    queryFn: fetchDrDocs,
    staleTime: 30_000,
    retry: drQueryRetry,
  });
}

// ---------------------------------------------------------------------------
// Documentation filesystem: the flat folder list + the organize mutations.
// Mutations update the caches optimistically (the tree re-renders instantly),
// then invalidate so the server state reconciles; 400/409 messages (cycle,
// depth, name conflict, non-empty delete) surface via sonner toasts.
// ---------------------------------------------------------------------------

const foldersKey = ['dr', 'doc-folders'] as const;
const docsKey = ['dr', 'docs'] as const;

export function useDrDocFolders() {
  return useQuery({
    queryKey: foldersKey,
    queryFn: fetchDrDocFolders,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    retry: drQueryRetry,
  });
}

function errMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}

export function useDrDocFolderMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: foldersKey });
    void qc.invalidateQueries({ queryKey: docsKey });
  };

  const create = useMutation({
    mutationFn: ({ name, parentId }: { name: string; parentId: string | null }) =>
      createDrDocFolder(name, parentId),
    onSuccess: (folder) => {
      qc.setQueryData<DrDocFolder[]>(foldersKey, (old) => (old ? [...old, folder] : [folder]));
      invalidate();
    },
    onError: (err) => toast.error(errMessage(err, 'Failed to create folder')),
  });

  const update = useMutation({
    mutationFn: ({ folderId, body }: { folderId: string; body: { name?: string; parentId?: string | null } }) =>
      updateDrDocFolder(folderId, body),
    onMutate: async ({ folderId, body }) => {
      // Optimistic: patch the folder row in place so the tree moves instantly.
      await qc.cancelQueries({ queryKey: foldersKey });
      const prev = qc.getQueryData<DrDocFolder[]>(foldersKey);
      qc.setQueryData<DrDocFolder[]>(foldersKey, (old) =>
        old?.map((f) =>
          f.id === folderId
            ? {
                ...f,
                ...(body.name !== undefined ? { name: body.name } : {}),
                ...(body.parentId !== undefined ? { parentId: body.parentId } : {}),
              }
            : f,
        ),
      );
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(foldersKey, ctx.prev);
      toast.error(errMessage(err, 'Failed to update folder'));
    },
    onSettled: invalidate,
  });

  const remove = useMutation({
    mutationFn: (folderId: string) => deleteDrDocFolder(folderId),
    onSuccess: (_res, folderId) => {
      qc.setQueryData<DrDocFolder[]>(foldersKey, (old) => old?.filter((f) => f.id !== folderId));
      invalidate();
    },
    onError: (err) => toast.error(errMessage(err, 'Failed to delete folder')),
  });

  const moveDoc = useMutation({
    mutationFn: ({ docId, folderId }: { docId: string; folderId: string | null }) => moveDrDoc(docId, folderId),
    onMutate: async ({ docId, folderId }) => {
      await qc.cancelQueries({ queryKey: docsKey });
      const prev = qc.getQueryData<DrDocSummary[]>(docsKey);
      qc.setQueryData<DrDocSummary[]>(docsKey, (old) =>
        old?.map((d) => (d.id === docId ? { ...d, folderId } : d)),
      );
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(docsKey, ctx.prev);
      toast.error(errMessage(err, 'Failed to move document'));
    },
    onSettled: invalidate,
  });

  const renameDoc = useMutation({
    mutationFn: ({ docId, title }: { docId: string; title: string }) => renameDrDoc(docId, title),
    onMutate: async ({ docId, title }) => {
      await qc.cancelQueries({ queryKey: docsKey });
      const prev = qc.getQueryData<DrDocSummary[]>(docsKey);
      qc.setQueryData<DrDocSummary[]>(docsKey, (old) =>
        old?.map((d) => (d.id === docId ? { ...d, title } : d)),
      );
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(docsKey, ctx.prev);
      toast.error(errMessage(err, 'Failed to rename document'));
    },
    onSettled: invalidate,
  });

  return { create, update, remove, moveDoc, renameDoc };
}
