import { useEffect, useRef, useState } from 'react';
import { getBaseURL } from '@/lib/utils';

/**
 * Live progress for a JobManager job (ingest or export). Prefers SSE
 * (EventSource on /job/:id/events) and falls back to 2s polling if the stream
 * errors — matching the brief and the existing useGetJobStatus poll cadence.
 */
export interface StudioJobProgress {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  resultUrl?: string;
  error?: string;
}

interface UseStudioJobOptions {
  onComplete?: (job: StudioJobProgress) => void;
  onError?: (message: string) => void;
}

export function useStudioJobProgress(
  jobId: string | null,
  opts: UseStudioJobOptions = {},
): StudioJobProgress | null {
  const [state, setState] = useState<StudioJobProgress | null>(null);
  const optsRef = useRef(opts);
  optsRef.current = opts;

  useEffect(() => {
    if (!jobId) {
      setState(null);
      return;
    }
    let done = false;
    let es: EventSource | null = null;
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    const finish = (job: StudioJobProgress) => {
      if (done) return;
      done = true;
      if (es) es.close();
      if (pollTimer) clearInterval(pollTimer);
      if (job.status === 'completed') optsRef.current.onComplete?.(job);
      if (job.status === 'failed') optsRef.current.onError?.(job.error || 'Job failed');
    };

    const apply = (raw: unknown) => {
      const data = raw as Partial<StudioJobProgress> & { status?: string };
      const next: StudioJobProgress = {
        status: (data.status as StudioJobProgress['status']) || 'processing',
        progress: typeof data.progress === 'number' ? data.progress : 0,
        resultUrl: data.resultUrl,
        error: data.error,
      };
      setState(next);
      if (next.status === 'completed' || next.status === 'failed') finish(next);
    };

    const startPolling = () => {
      if (done || pollTimer) return;
      const tick = async () => {
        try {
          const res = await fetch(`${getBaseURL()}/job/${jobId}`);
          if (!res.ok) return;
          apply(await res.json());
        } catch {
          // transient; next tick retries
        }
      };
      void tick();
      pollTimer = setInterval(tick, 2000);
    };

    try {
      es = new EventSource(`${getBaseURL()}/job/${jobId}/events`);
      es.addEventListener('update', (ev) => {
        try {
          apply(JSON.parse((ev as MessageEvent).data));
        } catch {
          // ignore malformed frame
        }
      });
      es.onerror = () => {
        // Stream dropped before completion — fall back to polling.
        if (es) es.close();
        if (!done) startPolling();
      };
    } catch {
      startPolling();
    }

    return () => {
      done = true;
      if (es) es.close();
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [jobId]);

  return state;
}
