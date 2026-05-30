import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { toast } from 'sonner';
import { getBaseURL } from '@/lib/utils';
import { getSessionId } from '@/lib/firstPartyAnalytics';
import {
  studioProjectSchema,
  studioAssetSchema,
  type StudioProject,
  type StudioAsset,
  type StudioCreateProjectRequest,
  type StudioSaveProjectRequest,
} from '@/lib/studioTypes';

// TanStack Query hooks for Content Studio projects + assets. Mirrors the
// useConvertFile/useStartVideoTranscode shape: getBaseURL() + the X-MM-Session-ID
// header, Zod-validated responses, sonner errors. No store mutation here — the
// caller feeds results into the Zustand store.

const jsonHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  'X-MM-Session-ID': getSessionId(),
});

const recentsSchema = z.object({ projects: z.array(studioProjectSchema).default([]) });
const assetsSchema = z.object({ assets: z.array(studioAssetSchema).default([]) });

async function readError(res: Response): Promise<string> {
  const body = await res.text().catch(() => '');
  return body || res.statusText;
}

export function useRecentProjects() {
  return useQuery({
    queryKey: ['studio', 'recents'],
    queryFn: async (): Promise<StudioProject[]> => {
      const res = await fetch(`${getBaseURL()}/studio/projects`, { headers: jsonHeaders() });
      if (!res.ok) throw new Error(await readError(res));
      return recentsSchema.parse(await res.json()).projects;
    },
  });
}

export function useCreateProject(onSuccess?: (project: StudioProject) => void) {
  return useMutation({
    mutationFn: async (req: StudioCreateProjectRequest): Promise<StudioProject> => {
      const res = await fetch(`${getBaseURL()}/studio/projects`, {
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify(req),
      });
      if (!res.ok) throw new Error(await readError(res));
      return studioProjectSchema.parse(await res.json());
    },
    onSuccess,
    onError: (error: Error) => {
      toast.error('Failed to create project', { description: error.message });
    },
  });
}

export function useProjectQuery(id: string | null) {
  return useQuery({
    queryKey: ['studio', 'project', id],
    enabled: !!id,
    // Editor-session data: don't refetch on focus (it would clobber live edits
    // hydrated into the store).
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<StudioProject> => {
      const res = await fetch(`${getBaseURL()}/studio/projects/${id}`, { headers: jsonHeaders() });
      if (!res.ok) throw new Error(await readError(res));
      return studioProjectSchema.parse(await res.json());
    },
  });
}

export function useProjectAssetsQuery(id: string | null) {
  return useQuery({
    queryKey: ['studio', 'project-assets', id],
    enabled: !!id,
    // Don't refetch on focus — a re-seed would reset in-flight upload state.
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<StudioAsset[]> => {
      const res = await fetch(`${getBaseURL()}/studio/projects/${id}/assets`, { headers: jsonHeaders() });
      if (!res.ok) throw new Error(await readError(res));
      return assetsSchema.parse(await res.json()).assets;
    },
  });
}

export function useSaveProject() {
  return useMutation({
    mutationFn: async ({ id, req }: { id: string; req: StudioSaveProjectRequest }): Promise<StudioProject> => {
      const res = await fetch(`${getBaseURL()}/studio/projects/${id}`, {
        method: 'PUT',
        headers: jsonHeaders(),
        body: JSON.stringify(req),
      });
      if (!res.ok) throw new Error(await readError(res));
      return studioProjectSchema.parse(await res.json());
    },
  });
}
