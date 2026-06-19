'use client';

import { useMutation } from '@tanstack/react-query';
import type { StudioExportRequest } from '@/lib/studioTypes';
import { useStudioBackend } from '@/lib/studio/studioBackendProvider';
import { getActiveStudioBackend } from '@/lib/studio/studioBackend';

export interface StudioExportResponse {
  jobId: string;
}

/**
 * useStartStudioExport kicks off the server-side EDL render for a project. The
 * caller is expected to have saved the project first (the server renders from
 * the persisted EDL), then subscribe to the returned jobId for progress. On MM
 * the result is downloaded via /download/:jobId; on CreaTV the render attaches
 * to the draft and download is host-driven (useExportDraft).
 */
export function useStartStudioExport(projectId: string | null) {
  const backend = useStudioBackend();
  const mutation = useMutation({
    mutationFn: async (req: StudioExportRequest): Promise<StudioExportResponse> => {
      if (!projectId) throw new Error('No active project');
      const res = await backend.fetch(backend.path(`/projects/${projectId}/export`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...backend.authHeaders() },
        body: JSON.stringify(backend.adaptExport(req)),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || res.statusText);
      }
      return backend.parseExport(await res.json());
    },
  });

  return {
    startExport: mutation.mutateAsync,
    isStarting: mutation.isPending,
  };
}

/**
 * Build the download URL the export job result is served from (MM:
 * /download/:jobId). CreaTV renders attach to a draft and are downloaded by the
 * host, so the CreaTV backend returns '' here. Reads the active backend ref so
 * non-hook call sites keep working.
 */
export function studioDownloadUrl(jobId: string): string {
  return getActiveStudioBackend().downloadUrl(jobId);
}
