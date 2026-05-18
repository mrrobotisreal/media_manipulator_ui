import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { getBaseURL, getFileType } from '@/lib/utils';
import { getSessionId, trackFirstPartyError, trackFirstPartyEvent } from '@/lib/firstPartyAnalytics';

export type TranscribeOutputFormat = 'vtt' | 'txt' | 'json';

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
  const response = await fetch(`${getBaseURL()}/upload`, {
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
): Promise<TranscribeUploadResponse> => {
  const sessionId = getSessionId();
  const contentType = file.type || 'video/mp4';
  setPhase('requesting-url');
  setProgress(0);

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
    throw new Error(`Failed to create video upload URL: ${presignResponse.statusText}`);
  }
  const target = await presignResponse.json() as VideoUploadTarget;

  setPhase('uploading-to-s3');
  await putFileToS3(target, file, contentType, setProgress);

  setPhase('finalizing');
  const completeResponse = await fetch(`${getBaseURL()}/video-upload/complete`, {
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
      if (getFileType(file) === 'video') {
        return uploadVideoForTranscribe(file, options, setUploadPhase, setUploadProgress);
      }
      setUploadPhase('uploading-to-s3');
      setUploadProgress(0);
      return uploadAudioForTranscribe(file, options);
    },
    onSuccess: (data, variables) => {
      setUploadProgress(100);
      setUploadPhase('processing');
      toast.success('Transcription started', {
        description: `Job ID: ${data.jobId} - Generating transcript`,
      });
      trackFirstPartyEvent('transcription_started', {
        target_format: variables.options.format,
        size_bytes: variables.file.size,
      }, {
        mediaKind: getFileType(variables.file),
        conversionJobId: data.jobId,
      });
      onSuccess(data);
    },
    onError: (error, variables) => {
      setUploadPhase('idle');
      console.error('Transcription upload failed:', error);
      trackFirstPartyError('transcription_upload', error, {
        target_format: variables.options.format,
      }, {
        mediaKind: getFileType(variables.file),
      });
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
