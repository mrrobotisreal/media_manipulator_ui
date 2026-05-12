import { useMutation } from '@tanstack/react-query';
import { getBaseURL } from '@/lib/utils';
import { toast } from 'sonner';
import { trackFirstPartyError, trackFirstPartyEvent } from '@/lib/firstPartyAnalytics';

export interface FileIdentificationResponse {
  fileName: string;
  fileSize: number;
  fileType: 'image' | 'video' | 'audio' | 'unknown';
  mimeType: string;
  details: Record<string, unknown>;
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
    onSuccess: (data, file) => {
      trackFirstPartyEvent('file_identified', {
        file_name: file.name,
        file_type: data.fileType,
        media_kind: data.fileType,
        mime_type: data.mimeType,
        size_bytes: data.fileSize,
        tool: data.tool,
        success: true,
      }, { mediaKind: data.fileType });
      toast.success('File identified successfully', {
        description: `File type: ${data.fileType} | Size: ${(data.fileSize / 1024 / 1024).toFixed(2)} MB`
      });
    },
    onError: (error, file) => {
      console.error('File identification failed:', error);
      trackFirstPartyError('file_identification', error, {
        file_name: file.name,
        size_bytes: file.size,
      });
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