'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import type { ConversionFormData } from '@/schemas/types';
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
  safeFileExtension,
  trackUploadStarted,
  type MediaKind,
} from '@/lib/analytics';

export interface UploadFileResponse {
  jobId: string;
}

type UploadPhase = 'idle' | 'requesting-url' | 'uploading-to-s3' | 'finalizing' | 'processing';

interface VideoUploadTarget {
  uploadUrl: string;
  s3Key: string;
  bucket: string;
  expiresAt: string;
}

const uploadFile = async (file: File, options: ConversionFormData): Promise<{ jobId: string }> => {
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

const uploadVideoViaS3 = async (
  file: File,
  options: ConversionFormData,
  setPhase: (phase: UploadPhase) => void,
  setProgress: (progress: number) => void,
  mediaKind: MediaKind | undefined,
): Promise<{ jobId: string }> => {
  const sessionId = getSessionId();
  const contentType = file.type || 'video/mp4';
  setPhase('requesting-url');
  setProgress(0);

  // Measured from the presign request, not from the PUT: from the visitor's point of view
  // the upload starts when they hit the button, and a slow presign is a slow upload.
  const upload = trackUploadStarted(file.size, 'presigned_put', { media_kind: mediaKind });

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
    throw new Error(`Failed to create video upload URL: ${presignResponse.statusText}`);
  }
  const target = await presignResponse.json() as VideoUploadTarget;

  setPhase('uploading-to-s3');
  await putFileToS3(target, file, contentType, setProgress);

  // The bytes are on S3 — that is the upload. `finalizing` below is our own API accepting
  // the job, which the job funnel already covers with job_started.
  upload.completed();

  setPhase('finalizing');
  const completeResponse = await authedFetch(`${getBaseURL()}/video-upload/complete`, {
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
  if (!completeResponse.ok) {
    throw new Error(`Failed to finalize video upload: ${completeResponse.statusText}`);
  }
  setPhase('processing');
  return completeResponse.json();
};

interface UseConvertFileReturns {
  mutate: ({ file, options }: { file: File, options: ConversionFormData }) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  uploadProgress: number;
  uploadPhase: UploadPhase;
}

const useConvertFile = (onSuccess: (res: UploadFileResponse) => void): UseConvertFileReturns => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>('idle');

  const conversionMutation = useMutation({
    mutationFn: ({ file, options }: { file: File; options: ConversionFormData }) => {
      const mediaKind = normalizeMediaKind(getFileType(file));
      if (getFileType(file) === 'video') {
        return uploadVideoViaS3(file, options, setUploadPhase, setUploadProgress, mediaKind);
      }
      setUploadPhase('uploading-to-s3');
      setUploadProgress(0);
      // The multipart path has no separate "upload finished" moment — the same request
      // uploads the bytes and creates the job — so the tracker closes when the POST
      // resolves. A local, not state: it must not survive a re-render into the next
      // upload's measurement.
      const upload = trackUploadStarted(file.size, 'post', { media_kind: mediaKind });
      return uploadFile(file, options).then((res) => {
        upload.completed();
        return res;
      });
    },
    onSuccess: (data, variables) => {
      setUploadProgress(100);
      setUploadPhase('processing');
      toast.success('Conversion started successfully', {
        description: `Job ID: ${data.jobId} - Your file is being processed`
      });
      // job_started, not "conversion_started": the catalog name is the contract, and
      // the API has accepted the job by this point. markJobStarted is what makes the
      // duration on the eventual job_completed real rather than component state.
      const mediaKind = normalizeMediaKind(getFileType(variables.file));
      // getToolSlug(), not null. This hook serves the homepage converter AND every /tools
      // page that uses the generic panel, so a hardcoded slug would be wrong somewhere;
      // passing null made peekJobToolSlug useless for the highest-volume tool on the site.
      markJobStarted(data.jobId, getToolSlug(), mediaKind);
      analytics.track(
        EVENTS.JOB_STARTED,
        {
          job_id: data.jobId,
          source_format: safeFileExtension(variables.file.name),
          target_format: variables.options.format,
        },
        { job_id: data.jobId, media_kind: mediaKind },
      );
      onSuccess(data);
    },
    onError: (error, variables) => {
      setUploadPhase('idle');
      console.error('Conversion failed:', error);
      // Two events, deliberately. upload_failed is the funnel-stage signal (priority 0 —
      // a lost conversion); client_error is the engineering signal, deduped and capped.
      analytics.track(
        EVENTS.UPLOAD_FAILED,
        {
          reason: error.message || 'unknown',
          size_bytes: variables.file.size,
          transport: getFileType(variables.file) === 'video' ? 'presigned_put' : 'post',
        },
        { media_kind: normalizeMediaKind(getFileType(variables.file)) },
      );
      reportError(analytics, error, { stage: 'conversion_upload' });
      toast.error('Failed to start conversion', {
        description: error.message || 'An unexpected error occurred'
      });
    }
  });

  return {
    mutate: ({ file, options }: { file: File, options: ConversionFormData }) => conversionMutation.mutate({ file, options }),
    isPending: conversionMutation.isPending,
    isError: conversionMutation.isError,
    error: conversionMutation.error,
    uploadProgress,
    uploadPhase,
  };
};

export default useConvertFile;
