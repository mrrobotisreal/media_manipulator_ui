'use client';

import { useEffect, useRef, useState } from 'react';
import { getBaseURL } from '@/lib/utils';
import type { TranscodeJobStage, TranscodeProbeResponse } from './transcodeTypes';

// TranscodeJob is the polled / streamed view of /api/job/:jobId for transcode
// jobs. It extends the generic ConversionJob shape with the extra fields the
// backend includes for mode === 'transcode'.
export interface TranscodeJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  resultUrl?: string;
  error?: string;
  mode?: string;
  currentStage?: string;
  stages?: TranscodeJobStage[];
  resultS3Key?: string;
  resultFileName?: string;
  expiresAt?: string;
  transcodeReport?: TranscodeProbeResponse;
}

interface UseTranscodeJobStatusReturns {
  data: TranscodeJob | undefined;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  /** "sse" when the EventSource is alive, "poll" when we've fallen back. */
  transport: 'sse' | 'poll' | 'idle';
}

const POLL_INTERVAL_MS = 2000;
const TERMINAL_STATES = new Set(['completed', 'failed']);

// useTranscodeJobStatus opens an SSE stream to /api/job/:id/events and falls
// back to 2-second polling if the EventSource errors out (proxy strips SSE,
// network blip, etc.). On every job update it surfaces the full job snapshot.
//
// The hook starts polling immediately for the first frame too — that way we
// always have a snapshot to render even if the SSE handshake takes a moment.
// Once SSE delivers its first event, polling is suspended.
const useTranscodeJobStatus = (jobId: string | null): UseTranscodeJobStatusReturns => {
  const [data, setData] = useState<TranscodeJob | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [transport, setTransport] = useState<'sse' | 'poll' | 'idle'>('idle');
  const [isPending, setIsPending] = useState(false);

  // Refs so the effect deps can stay minimal (jobId only).
  const sseRef = useRef<EventSource | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!jobId) {
      setData(undefined);
      setTransport('idle');
      return;
    }
    cancelledRef.current = false;
    setIsPending(true);

    const stopPolling = () => {
      if (pollTimerRef.current !== null) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
    const closeSSE = () => {
      if (sseRef.current) {
        sseRef.current.close();
        sseRef.current = null;
      }
    };

    const applySnapshot = (snapshot: TranscodeJob) => {
      if (cancelledRef.current) return;
      setData(snapshot);
      setIsPending(false);
      if (TERMINAL_STATES.has(snapshot.status)) {
        stopPolling();
        closeSSE();
      }
    };

    const pollOnce = async () => {
      try {
        const response = await fetch(`${getBaseURL()}/job/${jobId}`);
        if (!response.ok) throw new Error(`Failed to check job status: ${response.statusText}`);
        const json = (await response.json()) as TranscodeJob;
        applySnapshot(json);
      } catch (err) {
        if (cancelledRef.current) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsPending(false);
      }
    };

    const startPolling = () => {
      if (pollTimerRef.current !== null) return;
      setTransport((t) => (t === 'sse' ? t : 'poll'));
      // Kick off an immediate fetch so the UI doesn't wait for the next tick.
      void pollOnce();
      pollTimerRef.current = setInterval(() => {
        void pollOnce();
      }, POLL_INTERVAL_MS);
    };

    const openSSE = () => {
      try {
        const es = new EventSource(`${getBaseURL()}/job/${jobId}/events`);
        sseRef.current = es;
        es.addEventListener('update', (event: MessageEvent) => {
          try {
            const snapshot = JSON.parse(event.data) as TranscodeJob;
            // SSE is now the source of truth — stop polling.
            stopPolling();
            setTransport('sse');
            applySnapshot(snapshot);
          } catch (parseErr) {
            console.warn('Failed to parse SSE update', parseErr);
          }
        });
        es.onerror = () => {
          // Proxy stripped SSE, network blip, or the server closed the stream
          // because the job is done. Either way, drop back to polling so we
          // can detect terminal states without the stream.
          closeSSE();
          if (cancelledRef.current) return;
          if (!data || !TERMINAL_STATES.has(data.status)) {
            startPolling();
          }
        };
      } catch (err) {
        // EventSource not available (very old browsers, jsdom). Polling only.
        console.warn('EventSource unavailable; falling back to polling', err);
        startPolling();
      }
    };

    // Race: start polling AND open SSE. Whichever delivers a snapshot first
    // wins, and `applySnapshot` stops the polling timer once SSE takes over.
    startPolling();
    openSSE();

    return () => {
      cancelledRef.current = true;
      stopPolling();
      closeSSE();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  return {
    data,
    isPending,
    isError: error !== null,
    error,
    transport,
  };
};

export default useTranscodeJobStatus;
