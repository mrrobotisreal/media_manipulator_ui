'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getBaseURL } from '@/lib/utils';
import { trackFirstPartyError, trackFirstPartyEvent, getSessionId } from '@/lib/firstPartyAnalytics';
import type {
  TranscodeStartRequest,
  TranscodeStartResponse,
} from './transcodeTypes';

interface UseStartVideoTranscodeReturns {
  mutate: (req: TranscodeStartRequest) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
}

// useStartVideoTranscode calls POST /api/video-transcode/start with the s3Key
// returned by a prior probe. The backend enqueues the job and returns a jobId
// so the parent can poll /api/job/:jobId for status.
const useStartVideoTranscode = (
  onSuccess: (res: TranscodeStartResponse) => void,
): UseStartVideoTranscodeReturns => {
  const mutation = useMutation({
    mutationFn: async (req: TranscodeStartRequest): Promise<TranscodeStartResponse> => {
      const sessionId = req.sessionId || getSessionId();
      const response = await fetch(`${getBaseURL()}/video-transcode/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-MM-Session-ID': sessionId,
        },
        body: JSON.stringify({ ...req, sessionId }),
      });
      if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(body || `Failed to start transcode: ${response.statusText}`);
      }
      return (await response.json()) as TranscodeStartResponse;
    },
    onSuccess: (data, variables) => {
      toast.success('Transcode started', {
        description: `Job ID: ${data.jobId}`,
      });
      trackFirstPartyEvent('transcode_started', {
        protocol: variables.protocol,
        dash_codec: variables.dashCodec || '',
        rung_count: variables.qualityRungs.length,
        generate_captions: variables.generateCaptions,
        generate_storyboards: variables.generateStoryboards,
        size_bytes: variables.fileSizeBytes,
      }, {
        mediaKind: 'video',
        conversionJobId: data.jobId,
      });
      onSuccess(data);
    },
    onError: (error, variables) => {
      console.error('Failed to start transcode:', error);
      trackFirstPartyError('transcode_start', error, {
        protocol: variables.protocol,
      }, {
        mediaKind: 'video',
      });
      toast.error('Failed to start transcode', {
        description: error.message,
      });
    },
  });

  return {
    mutate: (req: TranscodeStartRequest) => mutation.mutate(req),
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export default useStartVideoTranscode;
