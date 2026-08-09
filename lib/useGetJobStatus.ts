'use client';

import { getBaseURL } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useLocalization } from '@/i18n/useLocalization';
import { analytics, EVENTS, reportError, takeJobDuration } from '@/lib/analytics';

export interface ConversionJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  originalFile: File;
  progress?: number;
  resultUrl?: string;
  error?: string;
  /**
   * Result metadata, when the pipeline that ran the job knows it.
   *
   * Both are OPTIONAL because only some pipelines set them (the API's
   * `ResultSizeBytes` / `ResultFileName` are populated by the ones that package an
   * artifact). They exist here purely so `job_completed` can carry `output_bytes` and
   * `output_format` — the two numbers that turn "the job finished" into "the job
   * produced 4 MB of mp4", which is what makes compression and format reports possible
   * without joining to the download event.
   */
  resultSizeBytes?: number;
  resultFileName?: string;
}

/**
 * Extension of a result filename, lowercased, without the dot.
 *
 * THE EXTENSION IS THE ONLY PART THAT MAY BE EMITTED. `resultFileName` is derived from the
 * visitor's own filename, so "mp4" is a format and "wedding video final.mp4" is PII.
 * Anything that does not look like a plain short extension is dropped rather than guessed.
 */
const resultFormatOf = (fileName: string | undefined): string | undefined => {
  const ext = (fileName || '').split('.').pop()?.toLowerCase() ?? '';
  return /^[a-z0-9]{1,12}$/.test(ext) && ext !== (fileName || '').toLowerCase() ? ext : undefined;
};

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
    // Passed through only when the API actually sent them; `undefined` stays undefined so
    // the properties below are omitted rather than reported as zero.
    resultSizeBytes: typeof data.resultSizeBytes === 'number' ? data.resultSizeBytes : undefined,
    resultFileName: typeof data.resultFileName === 'string' ? data.resultFileName : undefined,
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
  const { t } = useLocalization('interface');
  const previousStatusRef = useRef<string | null>(null);

  const { data: jobStatusData, isPending, isError, error } = useQuery({
    queryKey: ['job-status', conversionJob?.id],
    queryFn: () => checkJobStatus(conversionJob!.id),
    enabled: !!conversionJob && conversionJob.status !== 'completed' && conversionJob.status !== 'failed',
    refetchInterval: 2000,
  });

  // Toasts AND the terminal analytics events, on the status TRANSITION.
  //
  // Emitting from the transition rather than from the polled value is what keeps this to
  // one event per job: the query refetches every 2s and would otherwise re-fire
  // job_completed on every poll after the job finished.
  useEffect(() => {
    if (jobStatusData && previousStatusRef.current !== jobStatusData.status) {
      if (jobStatusData.status === 'completed') {
        toast.success(t('toasts.conversionCompleted'), {
          description: t('toasts.readyForDownload')
        });
        analytics.track(
          EVENTS.JOB_COMPLETED,
          {
            job_id: jobStatusData.id,
            duration_ms: takeJobDuration(jobStatusData.id),
            output_bytes: jobStatusData.resultSizeBytes,
            output_format: resultFormatOf(jobStatusData.resultFileName),
          },
          { job_id: jobStatusData.id },
        );
      } else if (jobStatusData.status === 'failed') {
        toast.error(t('error:conversion.failed'), {
          description: jobStatusData.error || t('error:toasts.conversionFailedFallback')
        });
        analytics.track(
          EVENTS.JOB_FAILED,
          {
            job_id: jobStatusData.id,
            duration_ms: takeJobDuration(jobStatusData.id),
            reason: jobStatusData.error || 'unknown',
            stage: 'processing',
          },
          { job_id: jobStatusData.id },
        );
      }
      previousStatusRef.current = jobStatusData.status;
    }
  }, [jobStatusData, t]);

  // Handle query errors
  useEffect(() => {
    if (isError && error) {
      // A poll failure is an engineering signal, not a funnel stage — the job itself may
      // still be fine. client_error only, and the dedupe stops a persistently failing
      // poll (one every 2s) from flooding the pipeline.
      reportError(analytics, error, { stage: 'job_status_poll' });
      toast.error(t('error:toasts.jobStatusCheckFailed'), {
        description: error.message || t('error:toasts.unableToGetProgress')
      });
    }
  }, [isError, error, conversionJob?.id, t]);

  return {
    data: jobStatusData,
    isPending: isPending,
    isError: isError,
    error: error,
  };
};

export default useGetJobStatus;
