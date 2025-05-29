import { useMutation } from '@tanstack/react-query';
import type { ConversionFormData } from '@/schemas/types';
import { getBaseURL } from '@/lib/utils';

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
    onSuccess,
    onError: (error) => {
      console.error('Conversion failed:', error);
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
