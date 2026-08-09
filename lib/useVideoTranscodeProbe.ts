'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useLocalization } from '@/i18n/useLocalization';
import { authedFetch } from '@/lib/auth/authedFetch';
import { getBaseURL } from '@/lib/utils';
import { analytics, EVENTS, getSessionId, reportError, trackUploadStarted } from '@/lib/analytics';
import type {
  TranscodeProbeResponse,
  TranscodeUploadTarget,
  TranscodeUploadPhase,
} from './transcodeTypes';

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

export interface ProbeMutationResult {
  s3Key: string;
  probe: TranscodeProbeResponse;
  contentType: string;
  fileName: string;
  fileSizeBytes: number;
  sessionId: string;
}

interface UseVideoTranscodeProbeReturns {
  mutate: (file: File) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  uploadProgress: number;
  uploadPhase: TranscodeUploadPhase;
  reset: () => void;
}

// useVideoTranscodeProbe uploads a video via the existing presigned PUT flow
// (the same /video-upload/presign endpoint as convert/transcribe), then calls
// the new /video-transcode/probe endpoint to get the ffprobe report. The S3
// key is preserved so the subsequent /video-transcode/start call can reuse it
// without re-uploading.
const useVideoTranscodeProbe = (
  onSuccess: (result: ProbeMutationResult) => void,
): UseVideoTranscodeProbeReturns => {
  const { t } = useLocalization('error');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState<TranscodeUploadPhase>('idle');

  const mutation = useMutation({
    mutationFn: async (file: File): Promise<ProbeMutationResult> => {
      const sessionId = getSessionId();
      const contentType = file.type || 'video/mp4';
      setUploadPhase('requesting-url');
      setUploadProgress(0);
      // THE PROBE IS THIS TOOL'S UPLOAD. Transcoding is a two-request flow — probe first
      // (presign → PUT → ffprobe), then /video-transcode/start reusing the same s3Key — so
      // the upload lifecycle belongs here and useStartVideoTranscode deliberately has none.
      // Emitting a second upload_started there would double every upload count for the one
      // tool that uploads exactly once.
      const upload = trackUploadStarted(file.size, 'presigned_put', { media_kind: 'video' });
      const presignResponse = await authedFetch(`${getBaseURL()}/video-upload/presign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      // The bytes have landed. The probe that follows is server-side analysis, not upload.
      upload.completed();
      setUploadPhase('probing');
      const probeResponse = await authedFetch(`${getBaseURL()}/video-transcode/probe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          s3Key: target.s3Key,
          fileName: file.name,
          contentType,
          fileSizeBytes: file.size,
        }),
      });
      if (!probeResponse.ok) {
        const body = await probeResponse.text().catch(() => '');
        throw new Error(body || `Probe failed: ${probeResponse.statusText}`);
      }
      const probe = (await probeResponse.json()) as TranscodeProbeResponse;
      setUploadPhase('ready');
      return {
        s3Key: target.s3Key,
        probe,
        contentType,
        fileName: file.name,
        fileSizeBytes: file.size,
        sessionId,
      };
    },
    onSuccess: (data) => {
      setUploadProgress(100);
      onSuccess(data);
    },
    onError: (error, file) => {
      setUploadPhase('idle');
      console.error('Transcode probe failed:', error);
      // The probe IS the upload for this tool (presign → PUT → probe), so a failure here
      // is an upload failure in funnel terms, not merely a client error.
      analytics.track(
        EVENTS.UPLOAD_FAILED,
        {
          reason: error.message || 'unknown',
          size_bytes: file.size,
          transport: 'presigned_put',
        },
        { media_kind: 'video' },
      );
      reportError(analytics, error, { stage: 'transcode_probe', toolSlug: 'transcode-video' });
      toast.error(t('toasts.videoAnalysisFailed'), {
        description: error.message || t('toasts.unexpectedFallback'),
      });
    },
  });

  return {
    mutate: (file: File) => mutation.mutate(file),
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    uploadProgress,
    uploadPhase,
    reset: () => {
      mutation.reset();
      setUploadPhase('idle');
      setUploadProgress(0);
    },
  };
};

export default useVideoTranscodeProbe;
