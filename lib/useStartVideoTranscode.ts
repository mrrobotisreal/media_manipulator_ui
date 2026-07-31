'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authedFetch } from '@/lib/auth/authedFetch';
import { getBaseURL } from '@/lib/utils';
import { analytics, EVENTS, getSessionId, markJobStarted, reportError } from '@/lib/analytics';
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
//
// NO UPLOAD LIFECYCLE HERE, DELIBERATELY. This hook uploads nothing: the file already
// went to S3 during the probe, and this request only references its s3Key. The
// upload_started/upload_completed pair lives in useVideoTranscodeProbe, which is the
// request that actually moves the bytes. Adding a second pair here would double every
// upload count for the one tool that uploads exactly once.
//
// It does still emit UPLOAD_FAILED on error, which reads oddly but is right: from the
// funnel's point of view a start failure is the visitor's upload attempt not producing a
// job, and the alternative — a failure with no funnel event — would silently shrink the
// denominator of the tool's conversion rate.
const useStartVideoTranscode = (
  onSuccess: (res: TranscodeStartResponse) => void,
): UseStartVideoTranscodeReturns => {
  const mutation = useMutation({
    mutationFn: async (req: TranscodeStartRequest): Promise<TranscodeStartResponse> => {
      const sessionId = req.sessionId || getSessionId();
      const response = await authedFetch(`${getBaseURL()}/video-transcode/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      markJobStarted(data.jobId, 'transcode-video', 'video');
      analytics.track(
        EVENTS.JOB_STARTED,
        {
          job_id: data.jobId,
          target_format: variables.protocol,
          // A compact digest of the ladder configuration, so popular setups are
          // countable without exploding the property space.
          options_hash: [
            variables.protocol,
            variables.dashCodec || 'none',
            `${variables.qualityRungs.length}rungs`,
            variables.generateCaptions ? 'captions' : '',
            variables.generateStoryboards ? 'storyboards' : '',
          ]
            .filter(Boolean)
            .join('-'),
        },
        { job_id: data.jobId, media_kind: 'video' },
      );
      onSuccess(data);
    },
    onError: (error, variables) => {
      console.error('Failed to start transcode:', error);
      analytics.track(
        EVENTS.UPLOAD_FAILED,
        { reason: error.message || 'unknown', size_bytes: variables.fileSizeBytes },
        { media_kind: 'video' },
      );
      reportError(analytics, error, { stage: 'transcode_start', toolSlug: 'transcode-video' });
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
