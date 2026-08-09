'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { useLocalization } from '@/i18n/useLocalization';
import { authedFetch } from '@/lib/auth/authedFetch';
import { getBaseURL, getFileType } from '@/lib/utils';
import {
  analytics,
  EVENTS,
  getSessionId,
  getToolSlug,
  markJobStarted,
  normalizeMediaKind,
  reportError,
  trackUploadStarted,
  type MediaKind,
} from '@/lib/analytics';

/**
 * useSpecializedMediaTool wraps the standard /api/upload (audio/image) and
 * /api/video-upload/presign + /complete (video) flows for the specialized
 * tools that take exactly one media file plus a structured options object —
 * audio waveform, extract audio, extract video-only, extract frames.
 *
 * It mirrors useConvertFile / useTranscribeFile shape so the existing
 * useGetJobStatus + useDownloadFile machinery continues to work unchanged.
 */

export type SpecializedToolMode =
  | 'audio_waveform'
  | 'extract_audio'
  | 'extract_video_only'
  | 'extract_frames'
  | 'trim_video';

export interface SpecializedToolOptions {
  /** The mode the backend dispatches on. */
  mode: SpecializedToolMode;
  /** Free-form options blob, validated server-side. */
  [key: string]: unknown;
}

export interface SpecializedToolResponse {
  jobId: string;
}

type UploadPhase = 'idle' | 'requesting-url' | 'uploading-to-s3' | 'finalizing' | 'processing';

interface VideoUploadTarget {
  uploadUrl: string;
  s3Key: string;
  bucket: string;
  expiresAt: string;
}

const putFileToS3 = (target: VideoUploadTarget, file: File, contentType: string, onProgress: (progress: number) => void) =>
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

const uploadDirect = async (file: File, options: SpecializedToolOptions): Promise<SpecializedToolResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('options', JSON.stringify(options));
  const response = await authedFetch(`${getBaseURL()}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }
  return response.json();
};

const uploadVideoViaS3 = async (
  file: File,
  options: SpecializedToolOptions,
  setPhase: (phase: UploadPhase) => void,
  setProgress: (progress: number) => void,
  mediaKind: MediaKind | undefined,
): Promise<SpecializedToolResponse> => {
  const sessionId = getSessionId();
  const contentType = file.type || 'video/mp4';
  setPhase('requesting-url');
  setProgress(0);

  const upload = trackUploadStarted(file.size, 'presigned_put', {
    media_kind: mediaKind,
    feature: options.mode,
  });

  const presign = await authedFetch(`${getBaseURL()}/video-upload/presign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      contentType,
      fileSizeBytes: file.size,
      sessionId,
    }),
  });
  if (!presign.ok) {
    throw new Error(`Failed to create video upload URL: ${presign.statusText}`);
  }
  const target = (await presign.json()) as VideoUploadTarget;

  setPhase('uploading-to-s3');
  await putFileToS3(target, file, contentType, setProgress);

  upload.completed();

  setPhase('finalizing');
  const complete = await authedFetch(`${getBaseURL()}/video-upload/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      s3Key: target.s3Key,
      fileName: file.name,
      contentType,
      fileSizeBytes: file.size,
      options,
    }),
  });
  if (!complete.ok) {
    throw new Error(`Failed to finalize video upload: ${complete.statusText}`);
  }
  setPhase('processing');
  return complete.json();
};

interface UseSpecializedMediaToolReturns {
  mutate: (input: { file: File; options: SpecializedToolOptions }) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  uploadProgress: number;
  uploadPhase: UploadPhase;
}

const useSpecializedMediaTool = (
  onSuccess: (res: SpecializedToolResponse) => void,
): UseSpecializedMediaToolReturns => {
  const { t } = useLocalization('interface');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>('idle');

  const mutation = useMutation({
    mutationFn: ({ file, options }: { file: File; options: SpecializedToolOptions }) => {
      const mediaKind = normalizeMediaKind(getFileType(file));
      if (getFileType(file) === 'video') {
        return uploadVideoViaS3(file, options, setUploadPhase, setUploadProgress, mediaKind);
      }
      setUploadPhase('uploading-to-s3');
      setUploadProgress(0);
      const upload = trackUploadStarted(file.size, 'post', {
        media_kind: mediaKind,
        feature: options.mode,
      });
      return uploadDirect(file, options).then((res) => {
        upload.completed();
        return res;
      });
    },
    onSuccess: (data, variables) => {
      setUploadProgress(100);
      setUploadPhase('processing');
      toast.success(t('toasts.jobStarted'), {
        description: t('toasts.jobIdDescription', { jobId: data.jobId }),
      });
      const mediaKind = normalizeMediaKind(getFileType(variables.file));
      // The mode IS the tool here — these hooks back several distinct tool pages — so it
      // becomes the feature dimension. The tool_slug still arrives from
      // ToolAnalyticsContext at the component level.
      // getToolSlug(), not null: this hook backs several distinct /tools pages, so the
      // slug can only come from the context the page's provider already set. Passing null
      // left peekJobToolSlug unable to attribute any of their job durations.
      markJobStarted(data.jobId, getToolSlug(), mediaKind);
      analytics.track(
        EVENTS.JOB_STARTED,
        { job_id: data.jobId, options_hash: variables.options.mode },
        { job_id: data.jobId, media_kind: mediaKind, feature: variables.options.mode },
      );
      onSuccess(data);
    },
    onError: (error, variables) => {
      setUploadPhase('idle');
      console.error('Specialized tool upload failed:', error);
      analytics.track(
        EVENTS.UPLOAD_FAILED,
        {
          reason: error.message || 'unknown',
          size_bytes: variables.file.size,
          transport: getFileType(variables.file) === 'video' ? 'presigned_put' : 'post',
        },
        { media_kind: normalizeMediaKind(getFileType(variables.file)), feature: variables.options.mode },
      );
      reportError(analytics, error, { stage: 'specialized_tool_upload' });
      toast.error(t('error:toasts.jobStartFailed'), {
        description: error.message || t('error:toasts.unexpectedFallback'),
      });
    },
  });

  return {
    mutate: (input) => mutation.mutate(input),
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    uploadProgress,
    uploadPhase,
  };
};

export default useSpecializedMediaTool;
