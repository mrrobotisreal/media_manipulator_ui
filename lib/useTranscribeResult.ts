'use client';

import { useQuery } from '@tanstack/react-query';
import { getBaseURL } from '@/lib/utils';

export interface TranscribeSegment {
  id: number;
  start: number;
  end: number;
  text: string;
}

export interface TranscribeResult {
  format: 'vtt' | 'txt' | 'json';
  language?: string;
  hasAudio: boolean;
  hasSpeech: boolean;
  segmentCount: number;
  durationSeconds?: number;
  transcriptText?: string;
  audioDescription?: string;
  message?: string;
  outputFile: string;
  segments?: TranscribeSegment[];
  audioMetadata?: Record<string, unknown>;
  analysisEnqueued?: boolean;
  startedAt: string;
  completedAt: string;
}

export interface AnalysisResult {
  jobId: string;
  fileType: string;
  mode?: string;
  model?: string;
  audioDescription?: string;
  transcriptReview?: Record<string, unknown> & {
    summary?: string;
    extended_summary?: string;
    main_topics?: string[];
    keywords?: string[];
    audience_level?: string;
    language?: string;
    sentiment_label?: string;
    sentiment_score?: number;
    content_safety?: {
      rating?: 'safe' | 'moderate' | 'unsafe' | string;
      labels?: string[];
      concerns?: string;
    };
    harmful_content?: boolean;
    harmful_content_reasons?: string[];
  };
  summary?: unknown;
  batches?: unknown[];
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

const fetchJSON = async <T,>(url: string): Promise<T | null> => {
  const response = await fetch(url);
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
};

export const useTranscribeResult = (jobId: string | null, enabled: boolean) => {
  return useQuery({
    queryKey: ['transcribe-result', jobId],
    queryFn: () => fetchJSON<TranscribeResult>(`${getBaseURL()}/transcript/${jobId}`),
    enabled: !!jobId && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAnalysisResult = (jobId: string | null, enabled: boolean) => {
  return useQuery({
    queryKey: ['analysis-result', jobId],
    queryFn: () => fetchJSON<AnalysisResult>(`${getBaseURL()}/analysis/${jobId}`),
    enabled: !!jobId && enabled,
    refetchInterval: (query) => {
      const data = query.state.data;
      return data ? false : 4000;
    },
    staleTime: 5 * 60 * 1000,
  });
};
