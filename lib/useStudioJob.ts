'use client';

import { useEffect, useRef, useState } from 'react';
import { useStudioBackend } from '@/lib/studio/studioBackendProvider';
import type { StudioJobProgress } from '@/lib/studio/studioBackend';

export type { StudioJobProgress } from '@/lib/studio/studioBackend';

/**
 * Live progress for a render/ingest job. On MM it prefers SSE (EventSource on
 * /job/:id/events) and falls back to 2s polling if the stream errors. On CreaTV
 * the backend exposes no SSE (backend.jobEventsUrl is undefined) so it polls
 * /darkroom/studio/jobs/:id only. Response shapes are normalized by
 * backend.parseJob.
 */
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
  const backend = useStudioBackend();
  const backendRef = useRef(backend);
  backendRef.current = backend;

  useEffect(() => {
    if (!jobId) {
      setState(null);
      return;
    }
    const backend = backendRef.current;
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
      const next = backendRef.current.parseJob(raw);
      setState(next);
      if (next.status === 'completed' || next.status === 'failed') finish(next);
    };

    const startPolling = () => {
      if (done || pollTimer) return;
      const tick = async () => {
        try {
          // No explicit headers: on MM this is the same header-free GET as
          // before the abstraction; the CreaTV backend.fetch wrapper attaches
          // the bearer itself (and carries user_id/channel_id in the URL).
          const res = await backendRef.current.fetch(backendRef.current.jobUrl(jobId));
          if (!res.ok) return;
          apply(await res.json());
        } catch {
          // transient; next tick retries
        }
      };
      void tick();
      pollTimer = setInterval(tick, 2000);
    };

    const eventsUrl = backend.capabilities.supportsSSE ? backend.jobEventsUrl?.(jobId) : undefined;
    if (eventsUrl) {
      try {
        es = new EventSource(eventsUrl);
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
    } else {
      // No SSE for this backend — poll only.
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
