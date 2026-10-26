'use client';

import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useLocalization } from '@/i18n/useLocalization';
import type { StudioAssetCompleteResponse } from '@/lib/studioTypes';
import { useStudioStore } from '@/lib/studioStore';
import { useStudioBackend } from '@/lib/studio/studioBackendProvider';
import type { StudioBackend } from '@/lib/studio/studioBackend';
import { studioUploadQueue, type UploadJobContext } from '@/lib/studio/uploadQueue';
import {
  isProxyRebuildCandidate,
  proxyRebuildAvailable,
  rebuildOutcomeForStatus,
  type RebuildRequestOutcome,
} from '@/lib/studio/proxyRebuild';

const EXT_MIME: Record<string, string> = {
  mp4: 'video/mp4', mov: 'video/quicktime', m4v: 'video/x-m4v', webm: 'video/webm',
  mkv: 'video/x-matroska', avi: 'video/x-msvideo', flv: 'video/x-flv', wmv: 'video/x-ms-wmv',
  mpeg: 'video/mpeg', mpg: 'video/mpeg',
  mp3: 'audio/mpeg', wav: 'audio/wav', aac: 'audio/aac', m4a: 'audio/mp4', ogg: 'audio/ogg', flac: 'audio/flac',
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif',
  bmp: 'image/bmp', tif: 'image/tiff', tiff: 'image/tiff', heic: 'image/heic', heif: 'image/heif',
  avif: 'image/avif', svg: 'image/svg+xml',
};

/** The browser's File.type is often empty for media; fall back to extension. */
function guessContentType(file: File): string {
  if (file.type && (file.type.startsWith('video/') || file.type.startsWith('audio/') || file.type.startsWith('image/'))) return file.type;
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return EXT_MIME[ext] || 'application/octet-stream';
}

function putToS3(uploadUrl: string, file: File, contentType: string, onProgress: (p: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && e.total > 0) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
      } else {
        reject(new Error(`S3 upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => reject(new Error('S3 upload failed'));
    xhr.onabort = () => reject(new Error('S3 upload was cancelled'));
    xhr.send(file);
  });
}

async function postJson<T>(
  backend: StudioBackend,
  url: string,
  body: unknown,
  parse: (json: unknown) => T,
): Promise<T> {
  const res = await backend.fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...backend.authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || res.statusText);
  }
  return parse(await res.json());
}

/** The presign → PUT → complete handshake for one file, reporting through the queue context. */
async function uploadOne(
  backend: StudioBackend,
  projectId: string,
  file: File,
  ctx: UploadJobContext,
): Promise<StudioAssetCompleteResponse> {
  const contentType = guessContentType(file);
  const presign = await postJson(
    backend,
    backend.path('/assets/presign'),
    backend.adaptPresign({ projectId, fileName: file.name, contentType, fileSizeBytes: file.size }),
    backend.parsePresign,
  );
  await putToS3(presign.uploadUrl, file, contentType, ctx.setProgress);
  ctx.setProcessing();
  return postJson(
    backend,
    backend.path('/assets/complete'),
    backend.adaptComplete({
      projectId,
      s3Key: presign.s3Key,
      fileName: file.name,
      contentType,
      fileSizeBytes: file.size,
      assetId: presign.assetId,
    }),
    backend.parseComplete,
  );
}

/**
 * useUploadStudioAsset runs the full ingest handshake for one project: presign
 * → PUT to S3 (with progress) → complete. Part 21: files go through the shared
 * bounded-concurrency queue (3 at a time) so a 10-file drop does not open 10
 * sockets; per-file progress and individual retry live in the queue rows the
 * media bin renders. On success the asset is registered in the store with
 * status 'processing'; the media bin then watches the returned ingest jobId
 * until the preview proxy is ready.
 */
export function useUploadStudioAsset(projectId: string | null) {
  const upsertAsset = useStudioStore((s) => s.upsertAsset);
  const backend = useStudioBackend();
  const queue = React.useSyncExternalStore(
    studioUploadQueue.subscribe,
    studioUploadQueue.getSnapshot,
    studioUploadQueue.getSnapshot,
  );

  const register = React.useCallback(
    (result: StudioAssetCompleteResponse) => {
      // LUT assets need no ingest (no proxy/peaks watcher) — mark ready directly.
      const status = result.asset.mediaKind === 'lut' ? 'ready' : 'processing';
      upsertAsset({ asset: result.asset, status, jobId: result.jobId, uploadProgress: 100 });
    },
    [upsertAsset],
  );

  /** Queue one file. Resolves with the created asset, or rejects (the queue row stays for retry). */
  const upload = React.useCallback(
    (file: File): Promise<StudioAssetCompleteResponse> => {
      if (!projectId) return Promise.reject(new Error('No active project'));
      return studioUploadQueue
        .enqueue({ projectId, name: file.name, size: file.size }, async (ctx) => {
          const result = await uploadOne(backend, projectId, file, ctx);
          register(result);
          return result;
        })
        .then((r) => r);
    },
    [backend, projectId, register],
  );

  return {
    /** Fire-and-forget: failures surface as retryable queue rows. */
    upload: (file: File) => {
      void upload(file).catch(() => undefined);
    },
    /** Awaitable variant (voiceover places its clip when the asset is ready). */
    uploadAsync: upload,
    queue: queue.filter((q) => q.projectId === projectId),
    isUploading: queue.some((q) => q.projectId === projectId && (q.status === 'uploading' || q.status === 'processing' || q.status === 'queued')),
  };
}

/**
 * Retry a failed queue row. The job closure captured the file, so this just
 * re-queues it; the row's original promise already settled with the failure.
 */
export function retryStudioUpload(id: string): void {
  studioUploadQueue.retry(id);
}

async function sendJson(backend: StudioBackend, method: 'PATCH' | 'DELETE', url: string, body?: unknown): Promise<Response> {
  const res = await backend.fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...backend.authHeaders() },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || res.statusText);
  }
  return res;
}

export interface AssetMetaPatch {
  displayName?: string;
  folder?: string;
  label?: string;
}

/**
 * Bin organization (part 21): rename / folder / label via PATCH /assets/:id.
 * Optimistic with rollback; server state only, so no undo integration. Folder
 * rename is a bulk PATCH. Unavailable on backends without `binManagement`
 * (embedded CreaTV), where `available` is false and the controls are hidden.
 */
export function useStudioAssetOrganization() {
  const backend = useStudioBackend();
  const patchAssetMeta = useStudioStore((s) => s.patchAssetMeta);
  const { t } = useLocalization('interface');

  const patchOne = React.useCallback(
    async (assetId: string, patch: AssetMetaPatch): Promise<boolean> => {
      const before = useStudioStore.getState().assets[assetId]?.asset;
      if (!before) return false;
      const prev = { displayName: before.displayName, folder: before.folder, label: before.label };
      patchAssetMeta(assetId, patch);
      try {
        await sendJson(backend, 'PATCH', backend.path(`/assets/${assetId}`), patch);
        return true;
      } catch (err) {
        patchAssetMeta(assetId, prev);
        toast.error(t('toasts.binUpdateFailed'), { description: (err as Error).message });
        return false;
      }
    },
    [backend, patchAssetMeta, t],
  );

  const patchMany = React.useCallback(
    async (assetIds: string[], patch: AssetMetaPatch): Promise<number> => {
      const results = await Promise.all(assetIds.map((id) => patchOne(id, patch)));
      return results.filter(Boolean).length;
    },
    [patchOne],
  );

  return { available: backend.capabilities.binManagement, patchOne, patchMany };
}

/**
 * Delete assets (part 21): DELETE /assets/:id for each. The caller has ALREADY
 * handled usage protection (removed referencing clips as one undo entry); the
 * server does not scan project JSON. Entries leave the bin only once the server
 * confirmed (200), so a failed delete leaves the asset where it was.
 */
export function useDeleteStudioAssets() {
  const backend = useStudioBackend();
  const removeAssetEntries = useStudioStore((s) => s.removeAssetEntries);
  const { t } = useLocalization('interface');

  return React.useCallback(
    async (assetIds: string[]): Promise<string[]> => {
      const deleted: string[] = [];
      for (const id of assetIds) {
        try {
          await sendJson(backend, 'DELETE', backend.path(`/assets/${id}`));
          deleted.push(id);
        } catch (err) {
          toast.error(t('toasts.assetDeleteFailed'), { description: (err as Error).message });
        }
      }
      if (deleted.length > 0) removeAssetEntries(deleted);
      return deleted;
    },
    [backend, removeAssetEntries, t],
  );
}

export type StudioDeriveOperation = 'voice_clean' | 'split_vocals' | 'split_instrumental';

/**
 * useDeriveStudioAsset runs an AI transform (DeepFilterNet voice cleanup or
 * Demucs stem split) on an existing audio asset and registers the resulting new
 * asset in the store with status 'processing'; the media bin then watches its
 * ingest job to readiness. (MM-only; the Darkroom backend has no derive route.)
 */
export function useDeriveStudioAsset() {
  const upsertAsset = useStudioStore((s) => s.upsertAsset);
  const backend = useStudioBackend();
  const { t } = useLocalization('interface');

  const mutation = useMutation({
    mutationFn: async ({ assetId, operation }: { assetId: string; operation: StudioDeriveOperation }): Promise<StudioAssetCompleteResponse> => {
      const toastId = toast.loading(t('toasts.processingAudio'));
      try {
        const result = await postJson(
          backend,
          backend.path(`/assets/${assetId}/derive`),
          { operation },
          backend.parseComplete,
        );
        toast.success(t('toasts.audioAdded'), { id: toastId, description: t('toasts.buildingPreview') });
        return result;
      } catch (err) {
        toast.error(t('error:toasts.audioProcessingFailed'), { id: toastId, description: (err as Error).message });
        throw err;
      }
    },
    onSuccess: (result) => {
      upsertAsset({ asset: result.asset, status: 'processing', jobId: result.jobId, uploadProgress: 100 });
    },
  });

  return {
    derive: (assetId: string, operation: StudioDeriveOperation) => mutation.mutate({ assetId, operation }),
    isDeriving: mutation.isPending,
  };
}

/**
 * useReverseProxy (part 17): browsers can't play video backwards, so a
 * reversed clip previews from a server-derived REVERSED 720p proxy. Toggling
 * Reverse on calls `request(assetId)`, which POSTs /assets/:id/reverse-proxy
 * (the derive-job pattern; idempotent server-side) and marks the asset
 * `reversed: 'processing'` with the job id; the media bin's watcher
 * (ReverseWatcher) polls the job and flips it to 'ready'. Toggling Reverse off
 * needs nothing — the clip goes back to the ordinary proxy. Unavailable on
 * backends without `reverseProxy` (CreaTV), where `available` is false.
 */
export function useReverseProxy() {
  const backend = useStudioBackend();
  const setAssetReversed = useStudioStore((s) => s.setAssetReversed);
  const { t } = useLocalization('interface');

  const request = React.useCallback(
    async (assetId: string): Promise<void> => {
      const entry = useStudioStore.getState().assets[assetId];
      if (!entry || entry.reversed === 'ready' || entry.reversed === 'processing') return;
      if (!backend.capabilities.reverseProxy) return;
      setAssetReversed(assetId, 'processing');
      try {
        const result = await postJson(
          backend,
          backend.path(`/assets/${assetId}/reverse-proxy`),
          {},
          backend.parseComplete,
        );
        setAssetReversed(assetId, 'processing', result.jobId);
      } catch (err) {
        setAssetReversed(assetId, 'failed');
        toast.error(t('contentStudio.speed.reverseFailed'), { description: (err as Error).message });
      }
    },
    [backend, setAssetReversed, t],
  );

  return { available: backend.capabilities.reverseProxy, request };
}

/**
 * useRebuildStudioProxies (MM71): POST /assets/:id/rebuild-proxy for each id,
 * one at a time (the server queues encodes, two at once, and dedupes per
 * asset), marking each asset `proxyRebuild: processing` with its job; the
 * ProxyRebuildWatchers (mounted by the preview surface) follow the jobs and
 * switch the asset to its new proxy generation. Stops at the first 429 or at
 * a missing route (an API older than MM71). `available` is false where the
 * backend has no rebuild route (CreaTV) and on translator deployments.
 */
export function useRebuildStudioProxies() {
  const backend = useStudioBackend();
  const setAssetProxyRebuild = useStudioStore((s) => s.setAssetProxyRebuild);
  const { t } = useLocalization('interface');
  const available = proxyRebuildAvailable(backend);

  const rebuild = React.useCallback(
    async (assetIds: string[]): Promise<number> => {
      if (!proxyRebuildAvailable(backend) || !backend.rebuildProxyUrl) return 0;
      let started = 0;
      for (const id of assetIds) {
        const entry = useStudioStore.getState().assets[id];
        if (!entry || !isProxyRebuildCandidate(entry)) continue;
        setAssetProxyRebuild(id, { state: 'processing', progress: 0 });
        let outcome: RebuildRequestOutcome = 'failed';
        let detail = '';
        try {
          const res = await backend.fetch(backend.rebuildProxyUrl(id), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...backend.authHeaders() },
            body: '{}',
          });
          outcome = rebuildOutcomeForStatus(res.status);
          if (outcome === 'started') {
            const body = (await res.json()) as { jobId?: unknown; proxyGeneration?: unknown };
            if (typeof body.jobId === 'string' && typeof body.proxyGeneration === 'number') {
              setAssetProxyRebuild(id, { state: 'processing', jobId: body.jobId, generation: body.proxyGeneration, progress: 0 });
              started++;
              continue;
            }
            outcome = 'failed';
          } else {
            detail = await res.text().catch(() => '');
          }
        } catch (err) {
          detail = (err as Error).message;
        }
        // Not started: the asset keeps its current proxy, untouched.
        setAssetProxyRebuild(id, outcome === 'failed' ? { state: 'failed' } : undefined);
        if (outcome === 'unavailable') {
          toast.error(t('contentStudio.mediaBin.rebuildUnavailable'));
          break;
        }
        if (outcome === 'rate-limited') {
          toast.error(t('contentStudio.mediaBin.rebuildRateLimited'));
          break;
        }
        toast.error(t('contentStudio.mediaBin.rebuildFailed'), { description: detail || undefined });
      }
      return started;
    },
    [backend, setAssetProxyRebuild, t],
  );

  return { available, rebuild };
}
