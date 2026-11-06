'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useStudioBackend } from '@/lib/studio/studioBackendProvider';
import {
  STATIC_STUDIO_OUTPUTS,
  accessFromLimits,
  type StudioOutputAccess,
  type StudioOutputTable,
} from '@/lib/studio/studioOutputs';
import type { Tier } from '@/lib/auth/accountApi';

/** The GET /api/studio/export-options body (MM118). */
interface ExportOptionsResponse {
  table: StudioOutputTable;
  required: Record<string, string>;
  caller: { tier: Tier; formats: string[]; advanced: boolean };
}

function parseExportOptions(json: unknown): ExportOptionsResponse | null {
  const j = json as Partial<ExportOptionsResponse> | null;
  if (!j || !j.table || !Array.isArray(j.table.containers) || !Array.isArray(j.table.presets) || !j.required || !j.caller) return null;
  return j as ExportOptionsResponse;
}

/**
 * The Darkroom export options for the caller: the API's output table and what the caller's
 * plan allows. Until the route answers (or on a backend without export depth, CreaTV), the
 * committed table and the account's served limits stand in, so the dialog never waits and
 * never invents a combination.
 */
export function useExportOptions(enabled: boolean): { table: StudioOutputTable; access: StudioOutputAccess } {
  const backend = useStudioBackend();
  const auth = useAuth();
  const supported = backend.capabilities.exportDepth;
  const query = useQuery({
    queryKey: ['studio', 'export-options', auth?.user?.uid ?? 'anonymous', auth?.tier ?? 'anonymous'],
    enabled: enabled && supported,
    staleTime: 5 * 60_000,
    retry: 1,
    queryFn: async () => {
      const res = await backend.fetch(backend.path('/export-options'), { headers: { ...backend.authHeaders() } });
      if (!res.ok) return null;
      return parseExportOptions(await res.json().catch(() => null));
    },
  });
  const data = query.data;
  if (data) {
    return {
      table: data.table,
      access: { required: data.required, formats: data.caller.formats, advanced: data.caller.advanced, tier: data.caller.tier },
    };
  }
  return { table: STATIC_STUDIO_OUTPUTS, access: accessFromLimits(auth?.limits, auth?.tier) };
}
