import { getBaseURL } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export interface ConversionJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  originalFile: File;
  progress?: number;
  resultUrl?: string;
  error?: string;
}

const checkJobStatus = async (jobId: string): Promise<ConversionJob> => {
  const response = await fetch(`${getBaseURL()}/job/${jobId}`);

  if (!response.ok) {
    throw new Error(`Failed to check job status: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    id: jobId,
    status: data.status,
    progress: data.progress,
    originalFile: new File([], 'temp'), // This would need to be handled differently in a real app
    resultUrl: data.status === 'completed' ? `${getBaseURL()}/download/${jobId}` : undefined,
    error: data.error,
  };
};

interface UseGetJobStatusReturns {
  data: ConversionJob | undefined;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
}

// const useGetJobStatus = (conversionJob: ConversionJob | null): UseGetJobStatusReturns => {
//   const { data: jobStatusData, isPending, isError, error } = useQuery({
//     queryKey: ['job-status', conversionJob?.id],
//     queryFn: () => checkJobStatus(conversionJob!.id),
//     enabled: !!conversionJob && conversionJob.status !== 'completed' && conversionJob.status !== 'failed',
//     refetchInterval: 2000,
//   });

//   return {
//     data: jobStatusData,
//     isPending: isPending,
//     isError: isError,
//     error: error,
//   };
// };

const useGetJobStatus = (conversionJob: ConversionJob | null): UseGetJobStatusReturns => {
  const previousStatusRef = useRef<string | null>(null);

  const { data: jobStatusData, isPending, isError, error } = useQuery({
    queryKey: ['job-status', conversionJob?.id],
    queryFn: () => checkJobStatus(conversionJob!.id),
    enabled: !!conversionJob && conversionJob.status !== 'completed' && conversionJob.status !== 'failed',
    refetchInterval: 2000,
  });

  // Handle toast notifications when status changes
  useEffect(() => {
    if (jobStatusData && previousStatusRef.current !== jobStatusData.status) {
      if (jobStatusData.status === 'completed') {
        toast.success('Conversion completed successfully!', {
          description: 'Your file is ready for download'
        });
      } else if (jobStatusData.status === 'failed') {
        toast.error('Conversion failed', {
          description: jobStatusData.error || 'The conversion process encountered an error'
        });
      }
      previousStatusRef.current = jobStatusData.status;
    }
  }, [jobStatusData]);

  // Handle query errors
  useEffect(() => {
    if (isError && error) {
      toast.error('Failed to check job status', {
        description: error.message || 'Unable to get conversion progress'
      });
    }
  }, [isError, error]);

  return {
    data: jobStatusData,
    isPending: isPending,
    isError: isError,
    error: error,
  };
};

export default useGetJobStatus;
