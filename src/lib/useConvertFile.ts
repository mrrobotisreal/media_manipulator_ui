import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ConversionFormData } from '@/schemas/types';
import { getBaseURL, getFileType } from '@/lib/utils';
import { trackFirstPartyError, trackFirstPartyEvent } from '@/lib/firstPartyAnalytics';

export interface UploadFileResponse {
  jobId: string;
}

const uploadFile = async (file: File, options: ConversionFormData): Promise<{ jobId: string }> => {
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

interface UseConvertFileReturns {
  mutate: ({ file, options }: { file: File, options: ConversionFormData }) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
}

const useConvertFile = (onSuccess: (res: UploadFileResponse) => void): UseConvertFileReturns => {
  const conversionMutation = useMutation({
    mutationFn: ({ file, options }: { file: File; options: ConversionFormData }) =>
      uploadFile(file, options),
    onSuccess: (data, variables) => {
      toast.success('Conversion started successfully', {
        description: `Job ID: ${data.jobId} - Your file is being processed`
      });
      trackFirstPartyEvent('conversion_started', {
        file_name: variables.file.name,
        source_format: variables.file.name.split('.').pop()?.toLowerCase() || 'unknown',
        target_format: variables.options.format,
        size_bytes: variables.file.size,
        options: variables.options as unknown as Record<string, unknown>,
      }, {
        mediaKind: getFileType(variables.file),
        conversionJobId: data.jobId,
      });
      onSuccess(data);
    },
    onError: (error, variables) => {
      console.error('Conversion failed:', error);
      trackFirstPartyError('conversion_upload', error, {
        file_name: variables.file.name,
        target_format: variables.options.format,
      }, {
        mediaKind: getFileType(variables.file),
      });
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
  };
};

export default useConvertFile;
