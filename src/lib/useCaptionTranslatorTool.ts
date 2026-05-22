import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { getBaseURL } from '@/lib/utils';
import { trackFirstPartyError, trackFirstPartyEvent } from '@/lib/firstPartyAnalytics';

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
  const response = await fetch(`${getBaseURL()}/tools/caption-translator`, {
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
    mutationFn: ({ file, options }: { file: File; options: CaptionTranslatorFormData }) =>
      submitCaptionTranslation(file, options, setUploadProgress),
    onSuccess: (data, variables) => {
      toast.success('Caption translation started', {
        description: `Job ID: ${data.jobId}`,
      });
      trackFirstPartyEvent('caption_translator_started', {
        source_format: variables.options.inputFormat,
        target_format: variables.options.outputFormat,
        target_language: variables.options.targetLanguage,
        size_bytes: variables.file.size,
      }, {
        mediaKind: 'unknown',
        conversionJobId: data.jobId,
        featureName: 'caption_translator',
      });
      onSuccess(data);
    },
    onError: (error, variables) => {
      console.error('Caption translation failed:', error);
      trackFirstPartyError('caption_translator_upload', error, {
        target_language: variables.options.targetLanguage,
      }, {
        mediaKind: 'unknown',
        featureName: 'caption_translator',
      });
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
