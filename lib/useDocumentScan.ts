'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getBaseURL } from '@/lib/utils';
import { getCurrentIdToken } from '@/lib/firebase';
import { getSessionId, trackFirstPartyEvent, trackFirstPartyError } from '@/lib/firstPartyAnalytics';
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState<DocumentScanUploadPhase>('idle');

  const mutation = useMutation({
    mutationFn: async (input: DocumentScanInput): Promise<DocumentScanStartResponse> => {
      const { files, options } = input;
      const sessionId = getSessionId();

      setUploadPhase('uploading');
      setUploadProgress(0);

      const form = new FormData();
      const order: string[] = [];
      files.forEach((file, idx) => {
        const field = `image_${idx}`;
        form.append(field, file);
        order.push(field);
      });
      form.append('options', JSON.stringify({ ...options, order, sessionId }));

      const idToken = await getCurrentIdToken();
      const headers: Record<string, string> = { 'X-MM-Session-ID': sessionId };
      if (idToken) headers.Authorization = `Bearer ${idToken}`;

      const result = await postMultipart(
        `${getBaseURL()}/document-scan/start`,
        form,
        headers,
        (pct) => {
          setUploadProgress(pct);
          if (pct >= 100) setUploadPhase('starting');
        },
      );
      setUploadPhase('processing');
      return result;
    },
    onSuccess: (data, variables) => {
      setUploadProgress(100);
      const { options, files } = variables;
      trackFirstPartyEvent(
        'document_scan_started',
        {
          page_count: files.length,
          content_mode: options.contentMode,
          outputs: options.outputs.join('+'),
          preclean: options.preclean,
          verify: options.verify,
          second_opinion: options.secondOpinion,
          summarize: options.summarize,
        },
        {
          mediaKind: 'image',
          conversionJobId: data.jobId,
        },
      );
      onSuccess(data);
    },
    onError: (error, variables) => {
      setUploadPhase('idle');
      console.error('Document scan start failed:', error);
      trackFirstPartyError(
        'document_scan_start',
        error,
        {
          page_count: variables.files.length,
          content_mode: variables.options.contentMode,
        },
        { mediaKind: 'image' },
      );
      toast.error('Failed to start scan', {
        description: error.message || 'An unexpected error occurred',
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
