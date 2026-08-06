'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useStudioBackend } from '@/lib/studio/studioBackendProvider';
import type {
  StudioProject,
  StudioProjectVersion,
  StudioCreateVersionRequest,
} from '@/lib/studioTypes';

// TanStack Query hooks for version history (part 09): list / create / restore.
// Transport is the pluggable StudioBackend, like useStudioProject. The calls
// are additive on the CreaTV adapter — a Darkroom backend that hasn't shipped
// the endpoints yet 404s, which the list query maps to the VERSIONS_UNAVAILABLE
// sentinel so the panel degrades to "not available" instead of erroring
// (never break embed).

async function readError(res: Response): Promise<string> {
  const body = await res.text().catch(() => '');
  return body || res.statusText;
}

/**
 * List-query data when the backend has no version endpoints. Only a non-MM
 * backend can produce it: on the MM API a 404 here means the project itself
 * is gone, which IS an error.
 */
export const VERSIONS_UNAVAILABLE = 'unavailable' as const;
export type StudioVersionsData = StudioProjectVersion[] | typeof VERSIONS_UNAVAILABLE;

export const versionsQueryKey = (projectId: string | null) =>
  ['studio', 'versions', projectId] as const;

export function useVersionsQuery(projectId: string | null, enabled = true) {
  const backend = useStudioBackend();
  return useQuery({
    queryKey: versionsQueryKey(projectId),
    enabled: !!projectId && enabled,
    queryFn: async (): Promise<StudioVersionsData> => {
      const res = await backend.fetch(
        `${backend.path(`/projects/${projectId}/versions`)}${backend.scopeQuery()}`,
        { headers: { 'Content-Type': 'application/json', ...backend.authHeaders() } },
      );
      if (res.status === 404 && backend.ecosystem !== 'mm') return VERSIONS_UNAVAILABLE;
      if (!res.ok) throw new Error(await readError(res));
      return backend.parseVersions(await res.json());
    },
  });
}

/**
 * Create a checkpoint. Used for BOTH the panel's "Save version…" (manual,
 * named — caller toasts on error) and the editor's auto-checkpoints (kind
 * 'auto', fire-and-forget — the scheduler swallows failures silently). No
 * toast here so the auto path stays quiet.
 */
export function useCreateVersion(projectId: string) {
  const backend = useStudioBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: StudioCreateVersionRequest): Promise<StudioProjectVersion> => {
      const res = await backend.fetch(backend.path(`/projects/${projectId}/versions`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...backend.authHeaders() },
        body: JSON.stringify(backend.adaptCreateVersion(req)),
      });
      if (!res.ok) throw new Error(await readError(res));
      return backend.parseVersion(await res.json());
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: versionsQueryKey(projectId) });
    },
  });
}

/**
 * Restore a version. The server checkpoints the current state first ("Before
 * restore"), so this can never lose work; it answers with the full updated
 * project, which the caller feeds into the store (loadProject — replaces the
 * document + revision and resets undo history).
 */
export function useRestoreVersion(projectId: string) {
  const backend = useStudioBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (versionId: string): Promise<StudioProject> => {
      const res = await backend.fetch(
        backend.path(`/projects/${projectId}/versions/${versionId}/restore`),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...backend.authHeaders() },
          body: JSON.stringify(backend.adaptRestoreVersion()),
        },
      );
      if (!res.ok) throw new Error(await readError(res));
      return backend.parseProject(await res.json());
    },
    onSuccess: () => {
      // The restore minted a "Before restore" checkpoint — refresh the list.
      void queryClient.invalidateQueries({ queryKey: versionsQueryKey(projectId) });
    },
  });
}
