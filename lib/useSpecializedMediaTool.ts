'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { getBaseURL, getFileType } from '@/lib/utils';
import { getSessionId, trackFirstPartyError, trackFirstPartyEvent } from '@/lib/firstPartyAnalytics';

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
  const response = await fetch(`${getBaseURL()}/upload`, {
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
): Promise<SpecializedToolResponse> => {
  const sessionId = getSessionId();
  const contentType = file.type || 'video/mp4';
  setPhase('requesting-url');
  setProgress(0);

  const presign = await fetch(`${getBaseURL()}/video-upload/presign`, {
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
  if (!presign.ok) {
    throw new Error(`Failed to create video upload URL: ${presign.statusText}`);
  }
  const target = (await presign.json()) as VideoUploadTarget;

  setPhase('uploading-to-s3');
  await putFileToS3(target, file, contentType, setProgress);

  setPhase('finalizing');
  const complete = await fetch(`${getBaseURL()}/video-upload/complete`, {
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>('idle');

  const mutation = useMutation({
    mutationFn: ({ file, options }: { file: File; options: SpecializedToolOptions }) => {
      if (getFileType(file) === 'video') {
        return uploadVideoViaS3(file, options, setUploadPhase, setUploadProgress);
      }
      setUploadPhase('uploading-to-s3');
      setUploadProgress(0);
      return uploadDirect(file, options);
    },
    onSuccess: (data, variables) => {
      setUploadProgress(100);
      setUploadPhase('processing');
      toast.success('Job started', {
        description: `Job ID: ${data.jobId}`,
      });
      trackFirstPartyEvent('specialized_tool_started', {
        tool_mode: variables.options.mode,
        size_bytes: variables.file.size,
      }, {
        mediaKind: getFileType(variables.file),
        conversionJobId: data.jobId,
        featureName: variables.options.mode,
      });
      onSuccess(data);
    },
    onError: (error, variables) => {
      setUploadPhase('idle');
      console.error('Specialized tool upload failed:', error);
      trackFirstPartyError('specialized_tool_upload', error, {
        tool_mode: variables.options.mode,
      }, {
        mediaKind: getFileType(variables.file),
        featureName: variables.options.mode,
      });
      toast.error('Failed to start job', {
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

export default useSpecializedMediaTool;
