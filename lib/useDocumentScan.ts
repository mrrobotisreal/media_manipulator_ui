'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useLocalization } from '@/i18n/useLocalization';
import { getBaseURL } from '@/lib/utils';
import { authHeaders } from '@/lib/auth/authedFetch';
import {
  analytics,
  EVENTS,
  getSessionId,
  markJobStarted,
  reportError,
  trackUploadStarted,
} from '@/lib/analytics';
import type {
  DocumentScanOptions,
  DocumentScanStartResponse,
  DocumentScanUploadPhase,
} from './documentScanTypes';

export interface DocumentScanInput {
  // files in final page order — appended as image_0..image_n
  files: File[];
  options: Omit<DocumentScanOptions, 'order' | 'sessionId'>;
}

interface UseDocumentScanReturns {
  mutate: (input: DocumentScanInput) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  uploadProgress: number;
  uploadPhase: DocumentScanUploadPhase;
  reset: () => void;
}

// postMultipart sends image_0..image_n + options JSON via XHR so we get upload
// progress. Document scan is multipart (page images are small — no S3 presign).
const postMultipart = (
  url: string,
  form: FormData,
  headers: Record<string, string>,
  onProgress: (progress: number) => void,
) =>
  new Promise<DocumentScanStartResponse>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as DocumentScanStartResponse);
        } catch {
          reject(new Error('Unexpected response from the server'));
        }
        return;
      }
      let message = `Failed to start scan: ${xhr.status}`;
      try {
        const body = JSON.parse(xhr.responseText);
        if (body?.error) message = body.error;
      } catch {
        // keep default
      }
      reject(new Error(message));
    };
    xhr.onerror = () => reject(new Error('Upload failed'));
    xhr.onabort = () => reject(new Error('Upload was cancelled'));
    xhr.send(form);
  });

// useDocumentScan drives the multipart upload + job start for AI Document Scan.
// The phase machine is idle → uploading → starting → processing; job progress is
// consumed separately via useTranscodeJobStatus(jobId) since the job flows
// through the same /job/:jobId machinery. The analytics event is privacy-safe:
// page count, mode, outputs and booleans only — never filenames or text.
const useDocumentScan = (
  onSuccess: (result: DocumentScanStartResponse) => void,
): UseDocumentScanReturns => {
  const { t } = useLocalization('error');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState<DocumentScanUploadPhase>('idle');

  const mutation = useMutation({
    mutationFn: async (input: DocumentScanInput): Promise<DocumentScanStartResponse> => {
      const { files, options } = input;
      const sessionId = getSessionId();

      setUploadPhase('uploading');
      setUploadProgress(0);
      // The one tool that uploads MANY files in one request. size_bytes is their total,
      // which is what determines how long the visitor waits — a per-file breakdown would
      // need one event per page and would tell us less.
      const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
      const upload = trackUploadStarted(totalBytes, 'post', { media_kind: 'document' });

      const form = new FormData();
      const order: string[] = [];
      files.forEach((file, idx) => {
        const field = `image_${idx}`;
        form.append(field, file);
        order.push(field);
      });
      form.append('options', JSON.stringify({ ...options, order, sessionId }));

      // postMultipart uses XMLHttpRequest for upload progress, so it cannot go
      // through authedFetch; authHeaders builds the same identity set.
      const headers = await authHeaders();

      const result = await postMultipart(
        `${getBaseURL()}/document-scan/start`,
        form,
        headers,
        (pct) => {
          setUploadProgress(pct);
          if (pct >= 100) {
            setUploadPhase('starting');
            // All bytes sent. Repeat 100% callbacks are absorbed by the tracker.
            upload.completed();
          }
        },
      );
      setUploadPhase('processing');
      return result;
    },
    onSuccess: (data, variables) => {
      setUploadProgress(100);
      const { options, files } = variables;
      markJobStarted(data.jobId, 'document-scan', 'document');
      analytics.track(
        EVENTS.JOB_STARTED,
        {
          job_id: data.jobId,
          target_format: options.outputs.join('+'),
          // Which engine options people actually turn on. No filenames, no page content —
          // counts and flags only.
          options_hash: [
            options.contentMode,
            `${files.length}p`,
            options.preclean ? 'preclean' : '',
            options.verify ? 'verify' : '',
            options.secondOpinion ? 'second' : '',
            options.summarize ? 'summary' : '',
          ]
            .filter(Boolean)
            .join('-'),
        },
        { job_id: data.jobId, media_kind: 'document' },
      );
      onSuccess(data);
    },
    onError: (error, variables) => {
      setUploadPhase('idle');
      console.error('Document scan start failed:', error);
      analytics.track(
        EVENTS.UPLOAD_FAILED,
        {
          reason: error.message || 'unknown',
          size_bytes: variables.files.reduce((sum, file) => sum + file.size, 0),
          transport: 'post',
        },
        { media_kind: 'document' },
      );
      reportError(analytics, error, { stage: 'document_scan_start', toolSlug: 'document-scan' });
      toast.error(t('toasts.scanStartFailed'), {
        description: error.message || t('toasts.unexpectedFallback'),
      });
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    uploadProgress,
    uploadPhase,
    reset: () => {
      mutation.reset();
      setUploadProgress(0);
      setUploadPhase('idle');
    },
  };
};

export default useDocumentScan;
