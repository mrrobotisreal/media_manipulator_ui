'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { authedFetch } from '@/lib/auth/authedFetch';
import { getBaseURL } from '@/lib/utils';
import {
  analytics,
  EVENTS,
  markJobStarted,
  reportError,
  trackUploadStarted,
} from '@/lib/analytics';

/**
 * useCaptionTranslatorTool POSTs an .srt or .vtt caption file together with
 * source/target language and output format to the dedicated
 * /api/tools/caption-translator endpoint. The backend creates a normal job
 * which the caller can then poll with useGetJobStatus and download with
 * useDownloadFile, identical to every other Media Manipulator job.
 */

export type CaptionFormat = 'srt' | 'vtt';

export interface CaptionTranslatorFormData {
  inputFormat: CaptionFormat;
  outputFormat: CaptionFormat;
  /** BCP-47 source language code or "auto". */
  sourceLanguage: string;
  /** BCP-47 target language code. */
  targetLanguage: string;
}

export interface CaptionTranslatorResponse {
  jobId: string;
}

const submitCaptionTranslation = async (
  file: File,
  data: CaptionTranslatorFormData,
  setProgress: (n: number) => void,
): Promise<CaptionTranslatorResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('inputFormat', data.inputFormat);
  formData.append('outputFormat', data.outputFormat);
  formData.append('sourceLanguage', data.sourceLanguage || 'auto');
  formData.append('targetLanguage', data.targetLanguage);
  setProgress(10);
  const response = await authedFetch(`${getBaseURL()}/tools/caption-translator`, {
    method: 'POST',
    body: formData,
  });
  setProgress(80);
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Caption translation request failed: ${response.status} ${text || response.statusText}`);
  }
  setProgress(100);
  return response.json();
};

interface UseCaptionTranslatorReturns {
  mutate: (input: { file: File; options: CaptionTranslatorFormData }) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  uploadProgress: number;
}

const useCaptionTranslatorTool = (
  onSuccess: (res: CaptionTranslatorResponse) => void,
): UseCaptionTranslatorReturns => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: ({ file, options }: { file: File; options: CaptionTranslatorFormData }) => {
      // A caption file is kilobytes, so this upload is effectively instantaneous — but the
      // funnel is only usable if every tool reports the same stages, and a tool that skips
      // upload_started looks like a tool nobody uploads to.
      const upload = trackUploadStarted(file.size, 'post', {
        media_kind: 'document',
        feature: 'caption_translator',
      });
      return submitCaptionTranslation(file, options, setUploadProgress).then((res) => {
        upload.completed();
        return res;
      });
    },
    onSuccess: (data, variables) => {
      toast.success('Caption translation started', {
        description: `Job ID: ${data.jobId}`,
      });
      markJobStarted(data.jobId, 'caption-translator', 'document');
      analytics.track(
        EVENTS.JOB_STARTED,
        {
          job_id: data.jobId,
          source_format: variables.options.inputFormat,
          target_format: variables.options.outputFormat,
          // The target language is the interesting dimension here — which languages
          // people actually want is a roadmap input.
          options_hash: variables.options.targetLanguage,
        },
        { job_id: data.jobId, media_kind: 'document', feature: 'caption_translator' },
      );
      onSuccess(data);
    },
    onError: (error, variables) => {
      console.error('Caption translation failed:', error);
      analytics.track(
        EVENTS.UPLOAD_FAILED,
        { reason: error.message || 'unknown', size_bytes: variables.file.size, transport: 'post' },
        { media_kind: 'document', feature: 'caption_translator' },
      );
      reportError(analytics, error, { stage: 'caption_translator_upload', toolSlug: 'caption-translator' });
      toast.error('Failed to start translation', {
        description: error.message || 'An unexpected error occurred',
      });
    },
  });

  return {
    mutate: (input) => mutation.mutate(input),
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    uploadProgress,
  };
};

export default useCaptionTranslatorTool;
