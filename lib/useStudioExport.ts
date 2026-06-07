'use client';

import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { getBaseURL } from '@/lib/utils';
import { getSessionId } from '@/lib/firstPartyAnalytics';
import type { StudioExportRequest } from '@/lib/studioTypes';

const exportResponseSchema = z.object({ jobId: z.string() });
export type StudioExportResponse = z.infer<typeof exportResponseSchema>;

/**
 * useStartStudioExport kicks off the server-side EDL render for a project. The
 * caller is expected to have saved the project first (the server renders from
 * the persisted EDL), then subscribe to the returned jobId for progress and
 * download via /api/download/:jobId.
 */
export function useStartStudioExport(projectId: string | null) {
  const mutation = useMutation({
    mutationFn: async (req: StudioExportRequest): Promise<StudioExportResponse> => {
      if (!projectId) throw new Error('No active project');
      const res = await fetch(`${getBaseURL()}/studio/projects/${projectId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-MM-Session-ID': getSessionId() },
        body: JSON.stringify(req),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || res.statusText);
      }
      return exportResponseSchema.parse(await res.json());
    },
  });

  return {
    startExport: mutation.mutateAsync,
    isStarting: mutation.isPending,
  };
}

/** Build the /api/download/:jobId URL the export job result is served from. */
export function studioDownloadUrl(jobId: string): string {
  return `${getBaseURL()}/download/${jobId}`;
}
