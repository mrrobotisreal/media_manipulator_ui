'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { authedFetch } from '@/lib/auth/authedFetch';
import { getBaseURL, getFileType } from '@/lib/utils';
import {
  analytics,
  EVENTS,
  getSessionId,
  markJobStarted,
  normalizeMediaKind,
  reportError,
  trackUploadStarted,
  type MediaKind,
} from '@/lib/analytics';

export type TranscribeOutputFormat = 'vtt' | 'srt' | 'txt' | 'json';

export interface TranscribeFormData {
  mode: 'transcribe';
  format: TranscribeOutputFormat;
  language?: string;
}

export interface TranscribeUploadResponse {
  jobId: string;
}

type UploadPhase = 'idle' | 'requesting-url' | 'uploading-to-s3' | 'finalizing' | 'processing';

interface VideoUploadTarget {
  uploadUrl: string;
  s3Key: string;
  bucket: string;
  expiresAt: string;
}

const uploadAudioForTranscribe = async (file: File, options: TranscribeFormData): Promise<TranscribeUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('options', JSON.stringify(options));
  const response = await authedFetch(`${getBaseURL()}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error(`Transcription upload failed: ${response.statusText}`);
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

const uploadVideoForTranscribe = async (
  file: File,
  options: TranscribeFormData,
  setPhase: (phase: UploadPhase) => void,
  setProgress: (progress: number) => void,
  mediaKind: MediaKind | undefined,
): Promise<TranscribeUploadResponse> => {
  const sessionId = getSessionId();
  const contentType = file.type || 'video/mp4';
  setPhase('requesting-url');
  setProgress(0);

  // From the presign request, because that is when the visitor's wait begins.
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

  // Bytes are on S3; `finalizing` below is job creation, which job_started covers.
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

interface UseTranscribeFileReturns {
  mutate: (input: { file: File; options: TranscribeFormData }) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  uploadProgress: number;
  uploadPhase: UploadPhase;
}

const useTranscribeFile = (onSuccess: (res: TranscribeUploadResponse) => void): UseTranscribeFileReturns => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>('idle');

  const mutation = useMutation({
    mutationFn: ({ file, options }: { file: File; options: TranscribeFormData }) => {
      const mediaKind = normalizeMediaKind(getFileType(file));
      if (getFileType(file) === 'video') {
        return uploadVideoForTranscribe(file, options, setUploadPhase, setUploadProgress, mediaKind);
      }
      setUploadPhase('uploading-to-s3');
      setUploadProgress(0);
      // Audio goes straight to our API in one multipart POST, so the request that uploads
      // the bytes is also the request that creates the job: the tracker closes on resolve.
      const upload = trackUploadStarted(file.size, 'post', { media_kind: mediaKind });
      return uploadAudioForTranscribe(file, options).then((res) => {
        upload.completed();
        return res;
      });
    },
    onSuccess: (data, variables) => {
      setUploadProgress(100);
      setUploadPhase('processing');
      toast.success('Transcription started', {
        description: `Job ID: ${data.jobId} - Generating transcript`,
      });
      const mediaKind = normalizeMediaKind(getFileType(variables.file));
      markJobStarted(data.jobId, 'transcribe-audio', mediaKind);
      analytics.track(
        EVENTS.JOB_STARTED,
        { job_id: data.jobId, target_format: variables.options.format },
        { job_id: data.jobId, media_kind: mediaKind },
      );
      onSuccess(data);
    },
    onError: (error, variables) => {
      setUploadPhase('idle');
      console.error('Transcription upload failed:', error);
      analytics.track(
        EVENTS.UPLOAD_FAILED,
        {
          reason: error.message || 'unknown',
          size_bytes: variables.file.size,
          transport: getFileType(variables.file) === 'video' ? 'presigned_put' : 'post',
        },
        { media_kind: normalizeMediaKind(getFileType(variables.file)) },
      );
      reportError(analytics, error, { stage: 'transcription_upload' });
      toast.error('Failed to start transcription', {
        description: error.message || 'An unexpected error occurred',
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

export default useTranscribeFile;
