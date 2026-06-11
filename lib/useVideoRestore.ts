'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getBaseURL } from '@/lib/utils';
import { getCurrentIdToken } from '@/lib/firebase';
import { getSessionId, trackFirstPartyEvent, trackFirstPartyError } from '@/lib/firstPartyAnalytics';
import type { TranscodeUploadTarget } from './transcodeTypes';
import type { RestoreModelId, RestoreStartResponse, RestoreUploadPhase } from './restoreTypes';

export interface VideoRestoreInput {
  file: File;
  clipStartSeconds: number;
  clipEndSeconds: number;
  models: RestoreModelId[];
  /** 0 = auto, or explicit 2 / 4. */
  scale: number;
  includeFrames: boolean;
}

interface UseVideoRestoreReturns {
  mutate: (input: VideoRestoreInput) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  uploadProgress: number;
  uploadPhase: RestoreUploadPhase;
  reset: () => void;
}

const putFileToS3 = (
  target: TranscodeUploadTarget,
  file: File,
  contentType: string,
  onProgress: (progress: number) => void,
) =>
  new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', target.uploadUrl);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
        return;
      }
      reject(new Error(`S3 upload failed: ${xhr.status} ${xhr.statusText}`));
    };
    xhr.onerror = () => reject(new Error('S3 upload failed'));
    xhr.onabort = () => reject(new Error('S3 upload was cancelled'));
    xhr.send(file);
  });

const sizeBucket = (bytes: number): string => {
  if (bytes < 10 * 1024 * 1024) return 'lt10mb';
  if (bytes < 50 * 1024 * 1024) return 'lt50mb';
  if (bytes < 100 * 1024 * 1024) return 'lt100mb';
  if (bytes < 500 * 1024 * 1024) return 'lt500mb';
  return 'gte500mb';
};

// useVideoRestore drives upload + job start for AI Video Restoration:
// presign via the existing /video-upload/presign flow, XHR PUT to S3 with
// progress, then POST /video-restore/start. Job progress is consumed
// separately via useTranscodeJobStatus(jobId) — the restoration job flows
// through the same /job/:jobId machinery.
const useVideoRestore = (onSuccess: (result: RestoreStartResponse) => void): UseVideoRestoreReturns => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState<RestoreUploadPhase>('idle');

  const mutation = useMutation({
    mutationFn: async (input: VideoRestoreInput): Promise<RestoreStartResponse> => {
      const { file } = input;
      const sessionId = getSessionId();
      const contentType = file.type || 'video/mp4';

      setUploadPhase('requesting-url');
      setUploadProgress(0);
      const presignResponse = await fetch(`${getBaseURL()}/video-upload/presign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-MM-Session-ID': sessionId,
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType,
          fileSizeBytes: file.size,
          sessionId,
        }),
      });
      if (!presignResponse.ok) {
        throw new Error(`Failed to create upload URL: ${presignResponse.statusText}`);
      }
      const target = (await presignResponse.json()) as TranscodeUploadTarget;

      setUploadPhase('uploading-to-s3');
      await putFileToS3(target, file, contentType, setUploadProgress);

      setUploadPhase('starting');
      // Firebase ID token when signed in — required by the auth-gated
      // deployment (RESTORE_REQUIRE_FIREBASE_AUTH), harmless otherwise.
      const idToken = await getCurrentIdToken();
      const startResponse = await fetch(`${getBaseURL()}/video-restore/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-MM-Session-ID': sessionId,
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({
          s3Key: target.s3Key,
          fileName: file.name,
          fileSizeBytes: file.size,
          clipStartSeconds: input.clipStartSeconds,
          clipEndSeconds: input.clipEndSeconds,
          models: input.models,
          scale: input.scale,
          includeFrames: input.includeFrames,
          sessionId,
        }),
      });
      if (!startResponse.ok) {
        const body = await startResponse.text().catch(() => '');
        throw new Error(body || `Failed to start restoration: ${startResponse.statusText}`);
      }
      const result = (await startResponse.json()) as RestoreStartResponse;
      setUploadPhase('processing');
      return result;
    },
    onSuccess: (data, variables) => {
      setUploadProgress(100);
      trackFirstPartyEvent(
        'restore_started',
        {
          clip_seconds: Math.round((variables.clipEndSeconds - variables.clipStartSeconds) * 10) / 10,
          model_count: variables.models.length,
          models: variables.models.join(','),
          scale: variables.scale,
          include_frames: variables.includeFrames,
          size_bucket: sizeBucket(variables.file.size),
        },
        {
          mediaKind: 'video',
          conversionJobId: data.jobId,
        },
      );
      onSuccess(data);
    },
    onError: (error, variables) => {
      setUploadPhase('idle');
      console.error('Video restore start failed:', error);
      trackFirstPartyError(
        'restore_start',
        error,
        { size_bucket: sizeBucket(variables.file.size), model_count: variables.models.length },
        { mediaKind: 'video' },
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

export default useVideoRestore;
