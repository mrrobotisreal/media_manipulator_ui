'use client';

import { useMutation } from '@tanstack/react-query';
import { getBaseURL } from '@/lib/utils';
import { toast } from 'sonner';
import { analytics, EVENTS, normalizeMediaKind, reportError } from '@/lib/analytics';

export interface FileIdentificationResponse {
  fileName: string;
  fileSize: number;
  fileType: 'image' | 'video' | 'audio' | 'unknown';
  mimeType: string;
  details: Record<string, unknown>;
  imageMetadata?: {
    container?: Record<string, unknown>;
    exifTiff?: Record<string, unknown>;
    gpsLocation?: Record<string, unknown>;
    advancedDeviceMetadata?: Record<string, Record<string, unknown>>;
  };
  tool: string;
  rawOutput: string;
}

const identifyFile = async (file: File): Promise<FileIdentificationResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${getBaseURL()}/details`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`File identification failed: ${response.statusText}`);
  }

  return response.json();
};

interface UseIdentifyFileReturns {
  mutate: (file: File) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  data: FileIdentificationResponse | undefined;
  reset: () => void;
}

const useIdentifyFile = (): UseIdentifyFileReturns => {
  const identificationMutation = useMutation({
    mutationFn: identifyFile,
    onSuccess: (data) => {
      // Identification is not a job in the funnel sense (nothing is produced and there is
      // nothing to download), so it maps to feature_used rather than job_completed.
      analytics.track(
        EVENTS.FEATURE_USED,
        {
          feature: 'file_identification',
          action: 'completed',
          value: data.fileType,
        },
        { media_kind: normalizeMediaKind(data.fileType), feature: 'file_identification' },
      );
      toast.success('File identified successfully', {
        description: `File type: ${data.fileType} | Size: ${(data.fileSize / 1024 / 1024).toFixed(2)} MB`
      });
    },
    onError: (error, file) => {
      console.error('File identification failed:', error);
      void file;
      reportError(analytics, error, { stage: 'file_identification' });
      toast.error('Failed to identify file', {
        description: error.message || 'An unexpected error occurred'
      });
    }
  });

  return {
    mutate: (file: File) => identificationMutation.mutate(file),
    isPending: identificationMutation.isPending,
    isError: identificationMutation.isError,
    error: identificationMutation.error,
    data: identificationMutation.data,
    reset: identificationMutation.reset,
  };
};

export default useIdentifyFile;