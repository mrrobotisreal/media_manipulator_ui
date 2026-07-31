'use client';

import { analytics, EVENTS, takeJobDuration } from '@/lib/analytics';
import { getBaseURL } from '@/lib/utils';

/**
 * Result download.
 *
 * PREVIOUSLY TRACKED NOTHING. That was the single largest hole in the old
 * instrumentation: a download is the closest thing this product has to a conversion, and
 * the funnel simply ended at `job_completed`. Every download event in the catalog is
 * priority 0 and flushes immediately.
 *
 * `download_started` and `download_completed` are separate events, and the distinction
 * earns its keep: the blob fetch for a large video takes real time and can fail, so
 * "began downloading" and "actually got the file" are genuinely different outcomes.
 * `download_failed` means the work succeeded and the user still got nothing, which is the
 * worst thing this product can do.
 */
/**
 * The delivered format, for the "what do people actually take away?" question.
 *
 * Derived from the response rather than from the job, because the job's requested format
 * and the bytes that arrived can differ (a fallback codec, a container swap). Two sources,
 * in order of trustworthiness: the Content-Disposition filename's extension, then the blob's
 * MIME subtype.
 *
 * ONLY THE EXTENSION EVER LEAVES THIS FUNCTION. The Content-Disposition header carries the
 * visitor's own filename, and that is never an analytics property — "mp4", never
 * "wedding video final.mp4".
 */
const outputFormatOf = (response: Response, blob: Blob): string | undefined => {
  const disposition = response.headers.get('Content-Disposition') || '';
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);
  if (match) {
    const ext = match[1].split('.').pop()?.toLowerCase() ?? '';
    if (/^[a-z0-9]{1,12}$/.test(ext)) return ext;
  }
  // Fall back to the MIME subtype: 'video/mp4' → 'mp4'. The generic
  // application/octet-stream our download handler sets is not a format, so it is dropped
  // rather than reported as one.
  const subtype = (blob.type || '').split('/')[1]?.split(';')[0]?.trim().toLowerCase() ?? '';
  if (subtype && subtype !== 'octet-stream' && /^[a-z0-9.+-]{1,20}$/.test(subtype)) {
    return subtype;
  }
  return undefined;
};

const downloadFile = async (jobId: string): Promise<Blob> => {
  const startedAt = Date.now();
  analytics.track(EVENTS.DOWNLOAD_STARTED, { job_id: jobId }, { job_id: jobId });

  let response: Response;
  try {
    response = await fetch(`${getBaseURL()}/download/${jobId}`);
  } catch (error) {
    analytics.track(
      EVENTS.DOWNLOAD_FAILED,
      { job_id: jobId, reason: error instanceof Error ? error.message : 'network error' },
      { job_id: jobId },
    );
    throw error;
  }

  if (!response.ok) {
    analytics.track(
      EVENTS.DOWNLOAD_FAILED,
      { job_id: jobId, reason: response.statusText || 'http error', status: response.status },
      { job_id: jobId },
    );
    throw new Error(`Download failed: ${response.statusText}`);
  }

  const blob = await response.blob();
  analytics.track(
    EVENTS.DOWNLOAD_COMPLETED,
    {
      job_id: jobId,
      size_bytes: blob.size,
      duration_ms: Date.now() - startedAt,
      output_format: outputFormatOf(response, blob),
    },
    { job_id: jobId },
  );
  // Consume the job's timing entry here rather than leaving it to the sweeper: a download
  // is the end of this job's life in the UI.
  takeJobDuration(jobId);
  return blob;
};

interface UseDownloadFileReturns {
  downloadFile: (jobId: string) => Promise<Blob>;
}

const useDownloadFile = (): UseDownloadFileReturns => {
  return {
    downloadFile,
  };
};

export default useDownloadFile;
