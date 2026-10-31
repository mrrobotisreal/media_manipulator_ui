// MM34 — status page data layer. Pure parsing + a feature-detecting fetch.
//
// Target contract (API half of MM34, not built yet): GET {API_BASE}/system/health
//   {
//     "status": "healthy" | "degraded" | "down",
//     "service": "media_manipulator_api",
//     "version": "<build id>",
//     "uptimeSeconds": 12345,
//     "checks": { "database": "ok"|"fail", "redis"?: "ok"|"fail", "storage": "ok"|"fail" },
//     "queue": { "gpuEnabled": true, "running": 1, "waiting": 0 }
//   }
// Until that exists the API only serves GET {API_BASE}/health = {status, service}.
// fetchSystemHealth() tries the rich endpoint first; a 404 (or any non-JSON
// reply) falls back to /health and reports only what is actually known.

import { getBaseURL } from '@/lib/utils';

/**
 * `unknown`: the browser could not get ANY answer from the API (network error,
 * CORS refusal, an extension blocking the request). It is not evidence that the
 * service is down, so the page must not say "Down"; `down` is reserved for an
 * answer that says so (a 5xx, or a body with status "down").
 */
export type ServiceState = 'operational' | 'degraded' | 'down' | 'unknown';
export type CheckResult = 'ok' | 'fail';

export interface SystemHealth {
  state: ServiceState;
  /** True when only the basic /health answered (no checks / queue known). */
  basic: boolean;
  checks?: { database?: CheckResult; redis?: CheckResult; storage?: CheckResult };
  queue?: { gpuEnabled: boolean; running: number; waiting: number };
  uptimeSeconds?: number;
}

const asCheck = (v: unknown): CheckResult | undefined =>
  v === 'ok' || v === 'fail' ? v : undefined;

const asCount = (v: unknown): number =>
  typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0;

/** Map the API's status word to the UI state. Unknown words are not trusted. */
export function stateFromStatus(status: unknown): ServiceState {
  if (status === 'healthy' || status === 'ok' || status === 'operational') return 'operational';
  if (status === 'degraded') return 'degraded';
  return 'down';
}

/** Parse a /system/health body. Returns null when it is not an object. */
export function parseSystemHealth(body: unknown): SystemHealth | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  const checksRaw = (b.checks && typeof b.checks === 'object' ? b.checks : {}) as Record<string, unknown>;
  const queueRaw = b.queue && typeof b.queue === 'object' ? (b.queue as Record<string, unknown>) : null;
  const checks = {
    database: asCheck(checksRaw.database),
    redis: asCheck(checksRaw.redis),
    storage: asCheck(checksRaw.storage),
  };
  return {
    state: stateFromStatus(b.status),
    basic: false,
    checks,
    queue: queueRaw
      ? {
          gpuEnabled: queueRaw.gpuEnabled === true,
          running: asCount(queueRaw.running),
          waiting: asCount(queueRaw.waiting),
        }
      : undefined,
    uptimeSeconds:
      typeof b.uptimeSeconds === 'number' && Number.isFinite(b.uptimeSeconds) ? b.uptimeSeconds : undefined,
  };
}

async function getJson(url: string, signal?: AbortSignal): Promise<{ status: number; body: unknown }> {
  const res = await fetch(url, { cache: 'no-store', signal, headers: { Accept: 'application/json' } });
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return { status: res.status, body };
}

/**
 * Fetch the service health. Never throws: a request that gets no answer at all
 * (network error, CORS refusal, blocked by an extension) is reported as
 * `unknown`, not `down`; the page shows "Status unavailable" and keeps polling.
 * 5xx from /system/health is a real answer (the API reports itself down), a
 * 404/405 means the endpoint does not exist yet and we fall back to /health.
 */
export async function fetchSystemHealth(signal?: AbortSignal): Promise<SystemHealth> {
  const base = getBaseURL().replace(/\/$/, '');
  try {
    const rich = await getJson(`${base}/system/health`, signal);
    if (rich.status !== 404 && rich.status !== 405) {
      const parsed = parseSystemHealth(rich.body);
      if (parsed) return parsed;
      return { state: rich.status >= 200 && rich.status < 300 ? 'operational' : 'down', basic: true };
    }
    const basic = await getJson(`${base}/health`, signal);
    const ok = basic.status >= 200 && basic.status < 300;
    const parsed = parseSystemHealth(basic.body);
    return { state: ok ? (parsed?.state ?? 'operational') : 'down', basic: true };
  } catch {
    return { state: 'unknown', basic: true };
  }
}
