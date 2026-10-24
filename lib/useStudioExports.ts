'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { StudioExportRecord } from '@/lib/studioTypes';
import { useStudioBackend } from '@/lib/studio/studioBackendProvider';
import { extractFetchError } from '@/lib/useStudioExportsError';

// Export history hooks (part 20). Transport is the pluggable StudioBackend; on a
// backend without capabilities.exportDepth (CreaTV) the list is disabled and
// resolves to [] without a request, so nothing 404s in embed.

export const exportsQueryKey = (projectId: string | null) => ['studio', 'exports', projectId] as const;

export function useExportsQuery(projectId: string | null, enabled = true) {
  const backend = useStudioBackend();
  const supported = backend.capabilities.exportDepth;
  return useQuery({
    queryKey: exportsQueryKey(projectId),
    enabled: !!projectId && enabled && supported,
    // While anything is running the panel re-reads the durable rows every few
    // seconds, so a render that finished (or an API restart that orphaned it)
    // shows up even if the live watcher missed it.
    refetchInterval: (q) => ((q.state.data as StudioExportRecord[] | undefined)?.some((r) => r.status === 'running') ? 5000 : false),
    queryFn: async (): Promise<StudioExportRecord[]> => {
      const res = await backend.fetch(`${backend.path(`/projects/${projectId}/exports`)}${backend.scopeQuery()}`, {
        headers: { 'Content-Type': 'application/json', ...backend.authHeaders() },
      });
      if (!res.ok) throw new Error(await extractFetchError(res));
      return backend.parseExports(await res.json());
    },
  });
}

/** Render again with the stored options: a new job + a new history row. */
export function useRenderAgain(projectId: string) {
  const backend = useStudioBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (exportId: string): Promise<{ jobId: string }> => {
      const res = await backend.fetch(backend.path(`/projects/${projectId}/exports/${exportId}/again`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...backend.authHeaders() },
        body: '{}',
      });
      if (!res.ok) throw new Error(await extractFetchError(res));
      return backend.parseExport(await res.json());
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: exportsQueryKey(projectId) });
    },
  });
}

/**
 * Render the playhead frame as a PNG from the ORIGINAL media (the export
 * pipeline's look, not the proxy) and hand back the blob. The server streams it
 * synchronously and stores nothing.
 */
export function useExportFrame(projectId: string | null) {
  const backend = useStudioBackend();
  return useMutation({
    mutationFn: async (input: { t: number; fileName?: string; captions?: boolean }): Promise<Blob> => {
      if (!projectId) throw new Error('No active project');
      const res = await backend.fetch(backend.path(`/projects/${projectId}/frame`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...backend.authHeaders() },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error(await extractFetchError(res));
      return res.blob();
    },
  });
}
