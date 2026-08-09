'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useLocalization } from '@/i18n/useLocalization';
import { getBaseURL } from '@/lib/utils';
import { authHeaders } from '@/lib/auth/authedFetch';
import {
  analytics,
  EVENTS,
  getSessionId,
  markJobStarted,
  reportError,
  trackUploadStarted,
} from '@/lib/analytics';
import type {
  ImageRestoreOptions,
  ImageRestoreStartResponse,
  ImageRestoreUploadPhase,
} from './imageRestoreTypes';

export interface ImageRestoreInput {
  file: File;
  options: ImageRestoreOptions;
}

interface UseImageRestoreReturns {
  mutate: (input: ImageRestoreInput) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  uploadProgress: number;
  uploadPhase: ImageRestoreUploadPhase;
  reset: () => void;
}

const sizeBucket = (bytes: number): string => {
  if (bytes < 2 * 1024 * 1024) return 'lt2mb';
  if (bytes < 10 * 1024 * 1024) return 'lt10mb';
  if (bytes < 25 * 1024 * 1024) return 'lt25mb';
  if (bytes < 50 * 1024 * 1024) return 'lt50mb';
  return 'gte50mb';
};

// postMultipart sends the image + options JSON via XHR so we get upload
// progress. The image-restore start endpoint is multipart (images are small —
// no S3 presign flow, unlike video restoration).
const postMultipart = (
  url: string,
  form: FormData,
  headers: Record<string, string>,
  onProgress: (progress: number) => void,
) =>
  new Promise<ImageRestoreStartResponse>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as ImageRestoreStartResponse);
        } catch {
          reject(new Error('Unexpected response from the server'));
        }
        return;
      }
      let message = `Failed to start restoration: ${xhr.status}`;
      try {
        const body = JSON.parse(xhr.responseText);
        if (body?.error) message = body.error;
      } catch {
        // keep default
      }
      reject(new Error(message));
    };
    xhr.onerror = () => reject(new Error('Upload failed'));
    xhr.onabort = () => reject(new Error('Upload was cancelled'));
    xhr.send(form);
  });

// useImageRestore drives the multipart upload + job start for AI Image
// Restoration. The phase machine is idle → uploading → starting → processing;
// job progress is consumed separately via useTranscodeJobStatus(jobId) since
// the job flows through the same /job/:jobId machinery.
const useImageRestore = (
  onSuccess: (result: ImageRestoreStartResponse) => void,
): UseImageRestoreReturns => {
  const { t } = useLocalization('error');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState<ImageRestoreUploadPhase>('idle');

  const mutation = useMutation({
    mutationFn: async (input: ImageRestoreInput): Promise<ImageRestoreStartResponse> => {
      const { file, options } = input;
      const sessionId = getSessionId();

      setUploadPhase('uploading');
      setUploadProgress(0);
      // One multipart POST both uploads the image and starts the restoration, so the
      // upload's end is the point where the bytes are all sent — which the progress
      // callback below reports as 100% — rather than when the response arrives.
      const upload = trackUploadStarted(file.size, 'post', { media_kind: 'image' });

      const form = new FormData();
      form.append('image', file);
      form.append('options', JSON.stringify({ ...options, sessionId }));

      // postMultipart uses XMLHttpRequest for upload progress, so it cannot go
      // through authedFetch; authHeaders builds the same identity set.
      const headers = await authHeaders();

      const result = await postMultipart(
        `${getBaseURL()}/image-restore/start`,
        form,
        headers,
        (pct) => {
          setUploadProgress(pct);
          if (pct >= 100) {
            setUploadPhase('starting');
            // 100% of bytes sent IS the completed upload here; everything after is the
            // server starting the job. The tracker ignores repeat calls, so a progress
            // callback that reports 100 more than once cannot double-count.
            upload.completed();
          }
        },
      );
      setUploadPhase('processing');
      return result;
    },
    onSuccess: (data, variables) => {
      setUploadProgress(100);
      const { options, file } = variables;
      markJobStarted(data.jobId, 'image-restore', 'image');
      analytics.track(
        EVENTS.JOB_STARTED,
        {
          job_id: data.jobId,
          // Which model chains people run, as a bucketed digest. `crop_used` stays a
          // BOOLEAN — the crop coordinates describe the content of someone's photo and
          // have no place in an analytics store.
          options_hash: [
            options.chain,
            `x${options.scale}`,
            `${options.models.length}m`,
            `${options.faceModels.length}f`,
            `${options.preclean.length}pre`,
            options.crop ? 'crop' : '',
            sizeBucket(file.size),
          ]
            .filter(Boolean)
            .join('-'),
        },
        { job_id: data.jobId, media_kind: 'image' },
      );
      onSuccess(data);
    },
    onError: (error, variables) => {
      setUploadPhase('idle');
      console.error('Image restore start failed:', error);
      analytics.track(
        EVENTS.UPLOAD_FAILED,
        { reason: error.message || 'unknown', size_bytes: variables.file.size, transport: 'post' },
        { media_kind: 'image' },
      );
      reportError(analytics, error, { stage: 'image_restore_start', toolSlug: 'image-restore' });
      toast.error(t('toasts.restorationStartFailed'), {
        description: error.message || t('toasts.unexpectedFallback'),
      });
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    uploadProgress,
    uploadPhase,
    reset: () => {
      mutation.reset();
      setUploadProgress(0);
      setUploadPhase('idle');
    },
  };
};

export default useImageRestore;
