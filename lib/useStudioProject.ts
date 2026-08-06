'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useStudioBackend } from '@/lib/studio/studioBackendProvider';
import type {
  StudioProject,
  StudioAsset,
  StudioCreateProjectRequest,
  StudioSaveProjectRequest,
} from '@/lib/studioTypes';

// TanStack Query hooks for Content Studio projects + assets. Transport is the
// pluggable StudioBackend (createMmBackend by default): on the standalone site
// this is byte-identical to the old getBaseURL() + X-MM-Session-ID behavior;
// inside CreaTV's Darkroom embed it targets /darkroom/studio/* with a bearer.
// No store mutation here — the caller feeds results into the Zustand store.

async function readError(res: Response): Promise<string> {
  const body = await res.text().catch(() => '');
  return body || res.statusText;
}

/**
 * A stale compare-and-set save: the server answered 409 because another tab or
 * device saved first (part 07). Carries the live server revision so "Take
 * over" can re-send with expectedRevision = currentRevision.
 */
export class StudioSaveConflictError extends Error {
  constructor(
    public readonly currentRevision: number | undefined,
    public readonly updatedAt: string | undefined,
  ) {
    super('Project was changed in another tab or device');
    this.name = 'StudioSaveConflictError';
  }
}

/** A non-409 HTTP failure, with the status so the save-state machine can pick
 * retry (5xx) vs. park-in-failed (other 4xx). Plain network failures keep
 * throwing the underlying TypeError from fetch. */
export class StudioSaveHttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'StudioSaveHttpError';
  }
}

export function useRecentProjects() {
  const backend = useStudioBackend();
  return useQuery({
    queryKey: ['studio', 'recents'],
    queryFn: async (): Promise<StudioProject[]> => {
      const res = await backend.fetch(`${backend.path('/projects')}${backend.scopeQuery()}`, {
        headers: { 'Content-Type': 'application/json', ...backend.authHeaders() },
      });
      if (!res.ok) throw new Error(await readError(res));
      return backend.parseProjects(await res.json());
    },
  });
}

export function useCreateProject(onSuccess?: (project: StudioProject) => void) {
  const backend = useStudioBackend();
  return useMutation({
    mutationFn: async (req: StudioCreateProjectRequest): Promise<StudioProject> => {
      const res = await backend.fetch(backend.path('/projects'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...backend.authHeaders() },
        body: JSON.stringify(backend.adaptCreateProject(req)),
      });
      if (!res.ok) throw new Error(await readError(res));
      return backend.parseProject(await res.json());
    },
    onSuccess,
    onError: (error: Error) => {
      toast.error('Failed to create project', { description: error.message });
    },
  });
}

export function useProjectQuery(id: string | null) {
  const backend = useStudioBackend();
  return useQuery({
    queryKey: ['studio', 'project', id],
    enabled: !!id,
    // Editor-session data: don't refetch on focus (it would clobber live edits
    // hydrated into the store).
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<StudioProject> => {
      const res = await backend.fetch(`${backend.path(`/projects/${id}`)}${backend.scopeQuery()}`, {
        headers: { 'Content-Type': 'application/json', ...backend.authHeaders() },
      });
      if (!res.ok) throw new Error(await readError(res));
      return backend.parseProject(await res.json());
    },
  });
}

export function useProjectAssetsQuery(id: string | null) {
  const backend = useStudioBackend();
  return useQuery({
    queryKey: ['studio', 'project-assets', id],
    enabled: !!id,
    // Don't refetch on focus — a re-seed would reset in-flight upload state.
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<StudioAsset[]> => {
      const res = await backend.fetch(
        `${backend.path(`/projects/${id}/assets`)}${backend.scopeQuery()}`,
        { headers: { 'Content-Type': 'application/json', ...backend.authHeaders() } },
      );
      if (!res.ok) throw new Error(await readError(res));
      return backend.parseAssets(await res.json());
    },
  });
}

export function useSaveProject() {
  const backend = useStudioBackend();
  return useMutation({
    mutationFn: async ({ id, req }: { id: string; req: StudioSaveProjectRequest }): Promise<StudioProject> => {
      const res = await backend.fetch(backend.path(`/projects/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...backend.authHeaders() },
        body: JSON.stringify(backend.adaptSaveProject(req)),
      });
      if (res.status === 409) {
        // {error, currentRevision, updatedAt} from the MM API; a backend with
        // a different body degrades to an undefined revision (dialog still
        // works — take-over then falls back to a legacy save).
        const body = (await res.json().catch(() => ({}))) as {
          currentRevision?: number;
          updatedAt?: string;
        };
        throw new StudioSaveConflictError(
          typeof body.currentRevision === 'number' ? body.currentRevision : undefined,
          typeof body.updatedAt === 'string' ? body.updatedAt : undefined,
        );
      }
      if (!res.ok) throw new StudioSaveHttpError(await readError(res), res.status);
      return backend.parseProject(await res.json());
    },
  });
}
