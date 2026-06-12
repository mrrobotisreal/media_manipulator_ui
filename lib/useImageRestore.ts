'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getBaseURL } from '@/lib/utils';
import { getCurrentIdToken } from '@/lib/firebase';
import { getSessionId, trackFirstPartyEvent, trackFirstPartyError } from '@/lib/firstPartyAnalytics';
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState<ImageRestoreUploadPhase>('idle');

  const mutation = useMutation({
    mutationFn: async (input: ImageRestoreInput): Promise<ImageRestoreStartResponse> => {
      const { file, options } = input;
      const sessionId = getSessionId();

      setUploadPhase('uploading');
      setUploadProgress(0);

      const form = new FormData();
      form.append('image', file);
      form.append('options', JSON.stringify({ ...options, sessionId }));

      // Firebase ID token when signed in — required by the auth-gated
      // deployment (RESTORE_REQUIRE_FIREBASE_AUTH), harmless otherwise.
      const idToken = await getCurrentIdToken();
      const headers: Record<string, string> = { 'X-MM-Session-ID': sessionId };
      if (idToken) headers.Authorization = `Bearer ${idToken}`;

      const result = await postMultipart(
        `${getBaseURL()}/image-restore/start`,
        form,
        headers,
        (pct) => {
          setUploadProgress(pct);
          if (pct >= 100) setUploadPhase('starting');
        },
      );
      setUploadPhase('processing');
      return result;
    },
    onSuccess: (data, variables) => {
      setUploadProgress(100);
      const { options, file } = variables;
      trackFirstPartyEvent(
        'image_restore_started',
        {
          size_bucket: sizeBucket(file.size),
          preclean_count: options.preclean.length,
          model_count: options.models.length,
          face_model_count: options.faceModels.length,
          chain: options.chain,
          scale: options.scale,
          // boolean only — never the crop coordinates
          crop_used: !!options.crop,
        },
        {
          mediaKind: 'image',
          conversionJobId: data.jobId,
        },
      );
      onSuccess(data);
    },
    onError: (error, variables) => {
      setUploadPhase('idle');
      console.error('Image restore start failed:', error);
      trackFirstPartyError(
        'image_restore_start',
        error,
        {
          size_bucket: sizeBucket(variables.file.size),
          model_count: variables.options.models.length,
          face_model_count: variables.options.faceModels.length,
          preclean_count: variables.options.preclean.length,
        },
        { mediaKind: 'image' },
      );
      toast.error('Failed to start restoration', {
        description: error.message || 'An unexpected error occurred',
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
