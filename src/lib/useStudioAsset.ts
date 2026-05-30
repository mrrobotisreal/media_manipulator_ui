import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { toast } from 'sonner';
import { getBaseURL } from '@/lib/utils';
import { getSessionId } from '@/lib/firstPartyAnalytics';
import {
  studioAssetPresignResponseSchema,
  studioAssetCompleteResponseSchema,
  type StudioAssetCompleteResponse,
} from '@/lib/studioTypes';
import { useStudioStore } from '@/lib/studioStore';

const EXT_MIME: Record<string, string> = {
  mp4: 'video/mp4', mov: 'video/quicktime', m4v: 'video/x-m4v', webm: 'video/webm',
  mkv: 'video/x-matroska', avi: 'video/x-msvideo', flv: 'video/x-flv', wmv: 'video/x-ms-wmv',
  mpeg: 'video/mpeg', mpg: 'video/mpeg',
  mp3: 'audio/mpeg', wav: 'audio/wav', aac: 'audio/aac', m4a: 'audio/mp4', ogg: 'audio/ogg', flac: 'audio/flac',
};

/** The browser's File.type is often empty for media; fall back to extension. */
function guessContentType(file: File): string {
  if (file.type && (file.type.startsWith('video/') || file.type.startsWith('audio/'))) return file.type;
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

async function postJson<T>(path: string, body: unknown, schema: z.ZodType<T>): Promise<T> {
  const res = await fetch(`${getBaseURL()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-MM-Session-ID': getSessionId() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || res.statusText);
  }
  return schema.parse(await res.json());
}

/**
 * useUploadStudioAsset runs the full ingest handshake for one project: presign
 * → PUT to S3 (with progress) → complete. On success it registers the asset in
 * the store with status 'processing'; the media bin then watches the returned
 * ingest jobId until the preview proxy is ready. Upload progress is surfaced
 * through a sonner toast (per the brief), the processing state inline.
 */
export function useUploadStudioAsset(projectId: string | null) {
  const upsertAsset = useStudioStore((s) => s.upsertAsset);

  const mutation = useMutation({
    mutationFn: async (file: File): Promise<StudioAssetCompleteResponse> => {
      if (!projectId) throw new Error('No active project');
      const contentType = guessContentType(file);
      const toastId = toast.loading(`Uploading ${file.name}…`);
      try {
        const presign = await postJson(
          '/studio/assets/presign',
          { projectId, fileName: file.name, contentType, fileSizeBytes: file.size, sessionId: getSessionId() },
          studioAssetPresignResponseSchema,
        );
        await putToS3(presign.uploadUrl, file, contentType, (p) => {
          toast.loading(`Uploading ${file.name}… ${p}%`, { id: toastId });
        });
        toast.loading(`Processing ${file.name}…`, { id: toastId });
        const result = await postJson(
          '/studio/assets/complete',
          { projectId, s3Key: presign.s3Key, fileName: file.name, contentType, fileSizeBytes: file.size },
          studioAssetCompleteResponseSchema,
        );
        toast.success(`${file.name} added`, { id: toastId, description: 'Building preview…' });
        return result;
      } catch (err) {
        toast.error('Upload failed', { id: toastId, description: (err as Error).message });
        throw err;
      }
    },
    onSuccess: (result) => {
      upsertAsset({ asset: result.asset, status: 'processing', jobId: result.jobId, uploadProgress: 100 });
    },
  });

  return {
    upload: (file: File) => mutation.mutate(file),
    isUploading: mutation.isPending,
  };
}
