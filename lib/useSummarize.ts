'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getBaseURL, getFileType } from '@/lib/utils';
import { authedFetch, authHeaders, QuotaExceededError } from '@/lib/auth/authedFetch';
import { isQuotaExceeded } from '@/lib/auth/accountApi';
import { publishQuotaExceeded, publishQuotaRefund } from '@/lib/auth/quotaBus';
import {
  analytics,
  EVENTS,
  getSessionId,
  getToolSlug,
  markJobStarted,
  normalizeMediaKind,
  reportError,
  trackUploadStarted,
} from '@/lib/analytics';
import type { ConversionJob } from '@/lib/useGetJobStatus';
import type { TranscodeJobStage } from '@/lib/transcodeTypes';
import { parseSummary } from '@/lib/results/summary';
import {
  SUMMARY_STAGE_KEYS,
  type SummarizeCapabilities,
  type SummarizeErrorCode,
  type SummarizeOptions,
  type SummarizeStartResponse,
  type SummaryStageKey,
  type VideoSummary,
} from './summarizeTypes';

/**
 * The MM74 video summary client (MM75 decision 1), modelled on useDocumentScan /
 * useDocumentScanCapabilities.
 *
 *   - `useSummarizeCapabilities()` reads GET /summarize/capabilities.
 *   - `useSummarize(onStarted)` uploads and starts the job: multipart `file` + `options` for
 *     audio and for video up to SUMMARY_MULTIPART_MAX_BYTES, otherwise the existing
 *     /video-upload/presign → S3 PUT → JSON `{s3Key, fileName, fileSizeBytes, options}`.
 *   - Progress is NOT polled here: the panel's SpecializedToolShell already polls
 *     GET /job/:id through useGetJobStatus, which passes `stages[]` through and publishes the
 *     MM73 refund signal on failure. `summaryStages(job)` turns that into the six-row list.
 *   - `useSummaryResult(jobId)` fetches GET /summarize/:jobId/result?format=json.
 */

/**
 * Above this a video goes through the presigned S3 path. Cloudflare in front of the API caps a
 * proxied request body at 100 MB, so a bigger multipart POST would never reach the server.
 */
export const SUMMARY_MULTIPART_MAX_BYTES = 90 * 1024 * 1024;

/** A refused start, with the API's `error` code so the panel can say the right thing. */
export class SummarizeStartError extends Error {
  readonly status: number;
  readonly code: SummarizeErrorCode;

  constructor(status: number, code: SummarizeErrorCode, message: string) {
    super(message);
    this.name = 'SummarizeStartError';
    this.status = status;
    this.code = code;
  }
}

const KNOWN_CODES: ReadonlySet<string> = new Set<SummarizeErrorCode>([
  'signin_required',
  'summary_not_in_plan',
  'summary_unavailable',
  'unreadable_media',
  'no_audio_or_video',
  'file_too_large',
  'upload_not_found',
  'quota_exceeded',
  'invalid_request',
]);

/**
 * Maps a non-2xx start response to a code. `invalid_*`, `no_file` and `invalid_s3_key` are all
 * "the request was malformed"; a 413 without a code (MaxBytesReader, or a validation `reason`
 * such as `video_duration`) is "too large"; anything else is `unknown`.
 */
export function summarizeErrorCode(status: number, body: unknown): SummarizeErrorCode {
  const error = body && typeof body === 'object' ? (body as { error?: unknown }).error : undefined;
  if (typeof error === 'string') {
    if (KNOWN_CODES.has(error)) return error as SummarizeErrorCode;
    if (error.startsWith('invalid_') || error === 'no_file') return 'invalid_request';
  }
  if (status === 413) return 'file_too_large';
  if (status === 429) return 'quota_exceeded';
  return 'unknown';
}

/** Whether a file goes through the presigned S3 route (video over the multipart cap). */
export function usesPresignedUpload(file: Pick<File, 'type' | 'size' | 'name'>): boolean {
  return getFileType(file as File) === 'video' && file.size > SUMMARY_MULTIPART_MAX_BYTES;
}

const fail = (status: number, body: unknown, fallback: string): SummarizeStartError => {
  const code = summarizeErrorCode(status, body);
  const message =
    body && typeof body === 'object' && typeof (body as { message?: unknown }).message === 'string'
      ? (body as { message: string }).message
      : fallback;
  return new SummarizeStartError(status, code, message);
};

const parseBody = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

/**
 * A refusal after the quota middleware ran is refunded by the API (MM73), and the 403
 * sign-in gate charges nothing; either way the meter re-reads usage. A 429 is the upgrade
 * moment and is announced like authedFetch does.
 */
function announceRefusal(status: number, body: unknown): void {
  if (status === 429 && isQuotaExceeded(body)) {
    publishQuotaExceeded(body);
    throw new QuotaExceededError(body);
  }
  publishQuotaRefund();
}

type UploadPhase = 'idle' | 'uploading' | 'starting' | 'processing';

const postMultipart = (
  url: string,
  form: FormData,
  headers: Record<string, string>,
  onProgress: (pct: number) => void,
) =>
  new Promise<{ status: number; text: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => resolve({ status: xhr.status, text: xhr.responseText });
    xhr.onerror = () => reject(new Error('Upload failed'));
    xhr.onabort = () => reject(new Error('Upload was cancelled'));
    xhr.send(form);
  });

const putToS3 = (uploadUrl: string, file: File, contentType: string, onProgress: (pct: number) => void) =>
  new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`S3 upload failed: ${xhr.status}`));
    xhr.onerror = () => reject(new Error('S3 upload failed'));
    xhr.onabort = () => reject(new Error('S3 upload was cancelled'));
    xhr.send(file);
  });

async function startMultipart(
  file: File,
  options: SummarizeOptions,
  onProgress: (pct: number) => void,
): Promise<SummarizeStartResponse> {
  const form = new FormData();
  form.append('file', file);
  form.append('options', JSON.stringify(options));
  // XMLHttpRequest for upload progress, so authHeaders builds the identity set by hand.
  const headers = await authHeaders();
  const { status, text } = await postMultipart(`${getBaseURL()}/summarize/start`, form, headers, onProgress);
  const body = parseBody(text);
  if (status >= 200 && status < 300) {
    const jobId = body && typeof body === 'object' ? (body as { jobId?: unknown }).jobId : undefined;
    if (typeof jobId === 'string' && jobId) return { jobId };
    throw new Error('Unexpected response from the server');
  }
  announceRefusal(status, body);
  throw fail(status, body, `Failed to start the summary: ${status}`);
}

async function startPresigned(
  file: File,
  options: SummarizeOptions,
  onProgress: (pct: number) => void,
  onUploaded: () => void,
): Promise<SummarizeStartResponse> {
  const contentType = file.type || 'video/mp4';
  const presign = await authedFetch(`${getBaseURL()}/video-upload/presign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: file.name, contentType, fileSizeBytes: file.size, sessionId: getSessionId() }),
  });
  if (!presign.ok) {
    const body = await presign.json().catch(() => null);
    throw fail(presign.status, body, `Failed to create the upload URL: ${presign.status}`);
  }
  const target = (await presign.json()) as { uploadUrl: string; s3Key: string };
  await putToS3(target.uploadUrl, file, contentType, onProgress);
  onUploaded();
  // authedFetch throws QuotaExceededError on a 429 by itself.
  const response = await authedFetch(`${getBaseURL()}/summarize/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ s3Key: target.s3Key, fileName: file.name, fileSizeBytes: file.size, options }),
  });
  const body = await response.json().catch(() => null);
  if (response.ok && body && typeof (body as { jobId?: unknown }).jobId === 'string') {
    return { jobId: (body as { jobId: string }).jobId };
  }
  if (response.ok) throw new Error('Unexpected response from the server');
  throw fail(response.status, body, `Failed to start the summary: ${response.status}`);
}

export interface SummarizeInput {
  file: File;
  options: SummarizeOptions;
}

export interface UseSummarizeReturns {
  start: (input: SummarizeInput) => void;
  isPending: boolean;
  error: Error | null;
  uploadProgress: number;
  uploadPhase: UploadPhase;
  reset: () => void;
}

/**
 * Uploads and starts one summary. Analytics: upload_started/completed through the shared
 * tracker, job_started on acceptance (feature `video_summary`, options_hash `<depth>-<lang>`),
 * upload_failed + client_error on refusal. Never file names or text.
 */
export function useSummarize(onStarted: (res: SummarizeStartResponse) => void): UseSummarizeReturns {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>('idle');

  const mutation = useMutation({
    mutationFn: async ({ file, options }: SummarizeInput): Promise<SummarizeStartResponse> => {
      const presigned = usesPresignedUpload(file);
      const mediaKind = normalizeMediaKind(getFileType(file));
      setUploadPhase('uploading');
      setUploadProgress(0);
      const upload = trackUploadStarted(file.size, presigned ? 'presigned_put' : 'post', {
        media_kind: mediaKind,
        feature: 'video_summary',
      });
      const uploaded = () => {
        setUploadPhase('starting');
        upload.completed();
      };
      const onProgress = (pct: number) => {
        setUploadProgress(pct);
        if (!presigned && pct >= 100) uploaded();
      };
      const result = presigned
        ? await startPresigned(file, options, onProgress, uploaded)
        : await startMultipart(file, options, onProgress);
      setUploadPhase('processing');
      return result;
    },
    onSuccess: (data, { file, options }) => {
      setUploadProgress(100);
      const mediaKind = normalizeMediaKind(getFileType(file));
      markJobStarted(data.jobId, getToolSlug(), mediaKind);
      analytics.track(
        EVENTS.JOB_STARTED,
        { job_id: data.jobId, target_format: 'md', options_hash: `${options.depth}-${options.outputLanguage}` },
        { job_id: data.jobId, media_kind: mediaKind, feature: 'video_summary' },
      );
      onStarted(data);
    },
    onError: (error, { file }) => {
      setUploadPhase('idle');
      const reason = error instanceof SummarizeStartError ? error.code : error.message || 'unknown';
      analytics.track(
        EVENTS.UPLOAD_FAILED,
        { reason, size_bytes: file.size, transport: usesPresignedUpload(file) ? 'presigned_put' : 'post' },
        { media_kind: normalizeMediaKind(getFileType(file)), feature: 'video_summary' },
      );
      // The sign-in gate is an expected refusal, not an engineering error.
      if (!(error instanceof SummarizeStartError && error.code === 'signin_required')) {
        reportError(analytics, error, { stage: 'summary_start', toolSlug: getToolSlug() ?? undefined });
      }
    },
  });

  return {
    start: (input) => mutation.mutate(input),
    isPending: mutation.isPending,
    error: mutation.error,
    uploadProgress,
    uploadPhase,
    reset: () => {
      mutation.reset();
      setUploadProgress(0);
      setUploadPhase('idle');
    },
  };
}

const fetchCapabilities = async (): Promise<SummarizeCapabilities> => {
  const response = await authedFetch(`${getBaseURL()}/summarize/capabilities`);
  if (!response.ok) throw new Error(`Failed to load capabilities: ${response.status}`);
  const raw = (await response.json()) as Partial<SummarizeCapabilities>;
  return {
    enabled: raw.enabled === true,
    vlmModel: typeof raw.vlmModel === 'string' ? raw.vlmModel : '',
    summaryModel: typeof raw.summaryModel === 'string' ? raw.summaryModel : '',
    deepModel: typeof raw.deepModel === 'string' ? raw.deepModel : undefined,
    deep: raw.deep === true,
    deepTiers: Array.isArray(raw.deepTiers) ? raw.deepTiers.filter((t): t is string => typeof t === 'string') : [],
    maxFramesByTier: raw.maxFramesByTier && typeof raw.maxFramesByTier === 'object' ? raw.maxFramesByTier : {},
    outputLanguages: Array.isArray(raw.outputLanguages)
      ? raw.outputLanguages.filter((l): l is string => typeof l === 'string')
      : [],
  };
};

/**
 * Feature flags and budgets. A failed request is treated by the panel like `enabled: false`
 * (an honest "temporarily unavailable"), never as a broken start button.
 */
export function useSummarizeCapabilities() {
  return useQuery({
    queryKey: ['summarize', 'capabilities'],
    queryFn: fetchCapabilities,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

/** The depth toggle exists only when deep synthesis is up AND the tier may use it. */
export function canUseDeep(caps: Pick<SummarizeCapabilities, 'deep' | 'deepTiers'> | undefined, tier: string): boolean {
  return !!caps && caps.deep && caps.deepTiers.includes(tier);
}

/** One row of the panel's stage list. */
export interface SummaryStageRow {
  key: SummaryStageKey;
  status: TranscodeJobStage['status'];
  message?: string;
  active: boolean;
}

/**
 * The six stages in pipeline order from a polled job. Missing stages read `pending`; unknown
 * keys are dropped. `active` marks every stage that is processing (audio and frames can run
 * together), else nothing.
 */
export function summaryStages(job: Pick<ConversionJob, 'stages'> | null | undefined): SummaryStageRow[] {
  const byKey = new Map((job?.stages ?? []).map((s) => [s.key, s]));
  return SUMMARY_STAGE_KEYS.map((key) => {
    const s = byKey.get(key);
    const status = s?.status ?? 'pending';
    return { key, status, message: s?.message || undefined, active: status === 'processing' };
  });
}

/** Fetches summary.json once the job is complete. 409 (`not_ready`) retries; 404 is null. */
export function useSummaryResult(jobId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ['summarize', 'result', jobId],
    queryFn: async (): Promise<VideoSummary | null> => {
      const response = await authedFetch(`${getBaseURL()}/summarize/${jobId}/result?format=json`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`Failed to load the summary: ${response.status}`);
      return parseSummary(await response.json().catch(() => null));
    },
    enabled: enabled && !!jobId,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
