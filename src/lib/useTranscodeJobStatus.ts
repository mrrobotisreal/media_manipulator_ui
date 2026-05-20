import { useQuery } from '@tanstack/react-query';
import { getBaseURL } from '@/lib/utils';
import type { TranscodeJobStage, TranscodeProbeResponse } from './transcodeTypes';

// TranscodeJob is the polled view of /api/job/:jobId for transcode jobs. It
// extends the generic ConversionJob shape with the extra fields the backend
// includes for mode === 'transcode'.
export interface TranscodeJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  resultUrl?: string;
  error?: string;
  mode?: string;
  currentStage?: string;
  stages?: TranscodeJobStage[];
  resultS3Key?: string;
  resultFileName?: string;
  expiresAt?: string;
  transcodeReport?: TranscodeProbeResponse;
}

const fetchJob = async (jobId: string): Promise<TranscodeJob> => {
  const response = await fetch(`${getBaseURL()}/job/${jobId}`);
  if (!response.ok) {
    throw new Error(`Failed to check job status: ${response.statusText}`);
  }
  return (await response.json()) as TranscodeJob;
};

interface UseTranscodeJobStatusReturns {
  data: TranscodeJob | undefined;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
}

// useTranscodeJobStatus polls /api/job/:id every 2 seconds while the job is
// still running. Returns the raw backend response (including the new stages
// + transcodeReport fields) so the form can render the timeline.
const useTranscodeJobStatus = (jobId: string | null): UseTranscodeJobStatusReturns => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['transcode-job-status', jobId],
    queryFn: () => fetchJob(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const job = query.state.data as TranscodeJob | undefined;
      if (!job) return 2000;
      if (job.status === 'completed' || job.status === 'failed') return false;
      return 2000;
    },
  });

  return { data, isPending, isError, error };
};

export default useTranscodeJobStatus;
