/**
 * Client for `POST /api/vector/exports` (MM43, `VectorHandler.CountExport` in
 * `media_manipulator_api/internal/handlers/vector.go`): the server-side count
 * of one Motion export, spent BEFORE the browser runs the exporter
 * (design §3.4, ticket MM44 decision 9).
 *
 * Identity: optional auth + `X-MM-Session-ID`, both attached by `authedFetch`
 * (the anonymous allowance keys on the session). The quota headers are
 * published on the shared bus by `authedFetch` too.
 *
 * Static SVG export (`svg_static`) is free and NEVER calls this: the server
 * answers 400 `vector_format_not_countable` for it, and the dialog does not
 * ask.
 */
import { authedFetch } from '@/lib/auth/authedFetch';
import { getBaseURL } from '@/lib/utils';

/** The countable formats MM43 accepts (`internal/tiers/vector.go`). */
export const VECTOR_EXPORT_FORMATS = [
  'svg_animated',
  'lottie',
  'react_tsx',
  'js_ts',
  'flutter',
  'gif',
  'png_sequence',
  'mp4',
  'webm',
] as const;
export type VectorExportFormat = (typeof VECTOR_EXPORT_FORMATS)[number];

export interface VectorExportRequest {
  /** Server project id; absent for browser-only (local / anonymous) projects. */
  projectId?: string;
  format: VectorExportFormat;
  durationMs: number;
  /** Output pixel height (0 = not applicable). */
  height: number;
  /** Output frames per second (0 = not applicable). */
  fps: number;
}

/** 200 body. `remaining` -1 = unlimited. */
export interface VectorExportGranted {
  ok: true;
  format: string;
  tier: string;
  limit: number;
  remaining: number;
  resetsAt: string;
}

export type VectorExportRefusal =
  /** 403: the tier does not include the format. */
  | { kind: 'locked'; format: string; tier: string; upgradePath: string }
  /** 422: duration / height / fps above the tier's cap (`max` in ms / px / fps). */
  | { kind: 'cap'; cap: 'duration' | 'height' | 'fps' | string; max: number; tier: string }
  /** 429: the daily allowance is spent. */
  | { kind: 'limit'; tier: string; limit: number; used: number; resetsAt: string; upgradePath: string }
  /** 503 / network / anything unexpected: the counter failed closed. */
  | { kind: 'unavailable'; status: number };

export type VectorExportResult = { ok: true; granted: VectorExportGranted } | { ok: false; refusal: VectorExportRefusal };

const str = (v: unknown, d = '') => (typeof v === 'string' ? v : d);
const num = (v: unknown, d = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : d);

/** Spend one export. Never throws: refusals and failures come back as `{ok:false}`. */
export async function countVectorExport(req: VectorExportRequest, fetchImpl: typeof authedFetch = authedFetch): Promise<VectorExportResult> {
  const body: Record<string, unknown> = {
    format: req.format,
    durationMs: Math.max(0, Math.round(req.durationMs)),
    height: Math.max(0, Math.round(req.height)),
    fps: Math.max(0, Math.round(req.fps)),
  };
  if (req.projectId) body.projectId = req.projectId;
  let response: Response;
  try {
    response = await fetchImpl(`${getBaseURL()}/vector/exports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, refusal: { kind: 'unavailable', status: 0 } };
  }
  const json = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  if (response.ok && json?.ok === true) {
    return {
      ok: true,
      granted: {
        ok: true,
        format: str(json.format, req.format),
        tier: str(json.tier),
        limit: num(json.limit),
        remaining: num(json.remaining, -1),
        resetsAt: str(json.resetsAt),
      },
    };
  }
  const error = str(json?.error);
  if (response.status === 403 && error === 'vector_format_locked') {
    return { ok: false, refusal: { kind: 'locked', format: str(json?.format, req.format), tier: str(json?.tier), upgradePath: str(json?.upgradePath) } };
  }
  if (response.status === 422 && error === 'vector_cap_exceeded') {
    return { ok: false, refusal: { kind: 'cap', cap: str(json?.cap), max: num(json?.max), tier: str(json?.tier) } };
  }
  if (response.status === 429 && error === 'vector_export_limit') {
    return {
      ok: false,
      refusal: {
        kind: 'limit',
        tier: str(json?.tier),
        limit: num(json?.limit),
        used: num(json?.used),
        resetsAt: str(json?.resetsAt),
        upgradePath: str(json?.upgradePath),
      },
    };
  }
  return { ok: false, refusal: { kind: 'unavailable', status: response.status } };
}
