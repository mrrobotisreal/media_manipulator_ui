'use client';

import React from 'react';
import { useStudioStore } from '@/lib/studioStore';
import { useStudioBackend } from '@/lib/studio/studioBackendProvider';

/**
 * MM79: brings a server-created asset (the generated voiceover) into the bin without a
 * full re-seed. `setAssets` would reset every in-flight upload's state, so this fetches
 * the project's assets and UPSERTS only the ones the store does not know yet. The asset
 * is already ingested when the voiceover job completes, so it arrives ready (proxy set).
 */
export function useStudioProjectAssetsRefresh(projectId: string): () => Promise<void> {
  const backend = useStudioBackend();
  return React.useCallback(async () => {
    try {
      const res = await backend.fetch(`${backend.path(`/projects/${projectId}/assets`)}${backend.scopeQuery()}`, {
        headers: { 'Content-Type': 'application/json', ...backend.authHeaders() },
      });
      if (!res.ok) return;
      const assets = backend.parseAssets(await res.json());
      const store = useStudioStore.getState();
      for (const a of assets) {
        if (store.assets[a.id]) continue;
        store.upsertAsset({ asset: a, status: a.s3KeyProxy ? 'ready' : 'processing', uploadProgress: 100 });
      }
    } catch {
      // The editor's own assets query picks it up on the next load.
    }
  }, [backend, projectId]);
}
