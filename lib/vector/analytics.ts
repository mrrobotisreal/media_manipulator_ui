/**
 * Motion editor analytics (ticket MM49 decision 4, design §3.8).
 *
 * WHY THIS IS ITS OWN MODULE. `/motion/*` is chromeless (app/providers.tsx):
 * no AnalyticsProvider, no ConsentGate, no consent bar, no AuthProvider. The
 * editor still needs `vector_*` events, and it must never send one without
 * consent. So the editor (decision recorded in the MM49 log):
 *
 *   1. reads the visitor's STORED analytics decision (`mm-consent-v2`, the
 *      record the site's banner and preferences centre write). It does NOT
 *      run the site's `initConsent()`: that would apply a region default
 *      (implied consent in the US, with an audit record) on a surface that
 *      shows no notice. No stored decision = nothing is sent.
 *   2. starts the shared SDK client only when that decision is `granted`;
 *   3. sends `vector_*` ONLY while it is `granted`. Nothing is buffered before
 *      a decision (the editor shows no banner, so an undecided visitor would
 *      never answer here). A visitor who has not answered on the site, or
 *      declined, sends nothing from the editor;
 *   4. sends nothing on translator deployments (MM52): this module and the
 *      SDK client both refuse there.
 *
 * Consent is re-read on every call (`getConsentDetails`), so a withdrawal the
 * SDK hears about stops emission at once; a change made in another tab is
 * picked up on the editor's next load.
 *
 * Every property goes through `lib/analytics/buckets.ts`: no raw sizes, counts
 * or timings. Event names only through `EVENTS` (the catalog).
 */
import { analytics, EVENTS, type PropsFor } from '@/lib/analytics';
import { getVisitorId } from '@/lib/analytics/identity';
import {
  countBucket,
  vectorBytesBucket,
  vectorDurationBucket,
  vectorFpsBucket,
  vectorHeightBucket,
  vectorMsBucket,
  vectorRevisionBucket,
} from '@/lib/analytics/buckets';
import type { Tier } from '@/lib/auth/accountApi';
import { getConsentDetails } from '@/lib/consent';
import { applyConsent, readStoredConsent } from '@/lib/consent/state';
import type { VectorDoc } from '@/lib/vector/vectorTypes';

type VectorEventName =
  | typeof EVENTS.UPGRADE_CTA_CLICKED
  | typeof EVENTS.VECTOR_EDITOR_OPENED
  | typeof EVENTS.VECTOR_PROJECT_CREATED
  | typeof EVENTS.VECTOR_IMPORT_COMPLETED
  | typeof EVENTS.VECTOR_IMPORT_FAILED
  | typeof EVENTS.VECTOR_TOOL_USED
  | typeof EVENTS.VECTOR_KEYFRAME_ADDED
  | typeof EVENTS.VECTOR_ANIMATOR_USED
  | typeof EVENTS.VECTOR_EXPORT_STARTED
  | typeof EVENTS.VECTOR_EXPORT_COMPLETED
  | typeof EVENTS.VECTOR_EXPORT_FAILED
  | typeof EVENTS.VECTOR_EXPORT_GATED
  | typeof EVENTS.VECTOR_PROJECT_SAVED;

/** The sink the editor emits through; tests inject a recorder. */
export interface VectorTracker {
  track<E extends VectorEventName>(name: E, props: PropsFor<E>): void;
}

const isTranslator = () => process.env.NEXT_PUBLIC_DEPLOY_ROLE === 'translator';

/** Whether the visitor's analytics decision is `granted` right now. */
export function vectorAnalyticsAllowed(): boolean {
  if (isTranslator() || typeof window === 'undefined') return false;
  try {
    return getConsentDetails().analytics === 'granted';
  } catch {
    return false;
  }
}

let started = false;

/**
 * Apply the stored consent decision and, when it is `granted`, start the SDK
 * client (queue, flush triggers, session). Idempotent; returns whether
 * emission is on. Never throws, never contacts the network by itself.
 */
export function startVectorAnalytics(): boolean {
  if (isTranslator() || typeof window === 'undefined') return false;
  try {
    if (!started) {
      started = true;
      const stored = readStoredConsent();
      // Decided only: an absent record stays `unset` (nothing captured), and
      // persist=false because this surface never writes a consent record.
      if (stored) applyConsent(stored, false);
      if (vectorAnalyticsAllowed()) {
        analytics.setContext({ page_type: 'tool', tool_slug: 'motion' });
        analytics.start();
      }
    }
    return vectorAnalyticsAllowed();
  } catch {
    return false;
  }
}

/** The caller's tier for the event context, once the editor knows it. */
export function setVectorTier(tier: string | undefined): void {
  if (!vectorAnalyticsAllowed()) return;
  analytics.setContext({ tier: tierProp(tier) });
}

/** Test seam. */
export function resetVectorAnalyticsForTests(): void {
  started = false;
}

/** The production tracker: the shared SDK client, gated on consent per call. */
export const vectorTracker: VectorTracker = {
  track(name, props) {
    if (!vectorAnalyticsAllowed()) return;
    analytics.track(name, props as never, { tool_slug: 'motion', feature: 'vector' });
  },
};

/**
 * Identity headers for `POST /api/vector/exports`, so the API's
 * `server_vector_export_counted` joins the visitor's client events. The
 * visitor id is an analytics identifier: it is attached ONLY with consent.
 * (`X-MM-Session-ID` is always sent by authedFetch; it keys the anonymous
 * allowance.)
 */
export function vectorCountHeaders(): Record<string, string> {
  if (!vectorAnalyticsAllowed()) return {};
  try {
    return { 'X-MM-Visitor-ID': getVisitorId() };
  } catch {
    return {};
  }
}

/** Keyframe properties with the gradient stop index folded (bounded vocabulary). */
export function keyframePropertyProp(property: string): string {
  return property.replace(/^gradientStop\[\d+\]\./, 'gradientStop.');
}

/** The export props every vector_export_* carries (bucketed). */
export function exportProps(input: {
  format: PropsFor<typeof EVENTS.VECTOR_EXPORT_STARTED>['format'];
  runtime?: 'css' | 'anime';
  durationMs: number;
  height: number;
  fps: number;
  bytes?: number;
  ms?: number;
}): PropsFor<typeof EVENTS.VECTOR_EXPORT_STARTED> {
  return {
    format: input.format,
    ...(input.runtime ? { runtime: input.runtime } : {}),
    duration_ms: vectorDurationBucket(input.durationMs),
    height: vectorHeightBucket(input.height),
    fps: vectorFpsBucket(input.fps),
    ...(input.bytes !== undefined ? { bytes: vectorBytesBucket(input.bytes) } : {}),
    ...(input.ms !== undefined ? { ms: vectorMsBucket(input.ms) } : {}),
  };
}

export function importProps(format: 'svg' | 'lottie' | 'motion_json', layers: number, unsupported: number): PropsFor<typeof EVENTS.VECTOR_IMPORT_COMPLETED> {
  return { format, layers: countBucket(layers), unsupported_count: countBucket(unsupported) };
}

export function savedProps(revision: number, documentBytes: number): PropsFor<typeof EVENTS.VECTOR_PROJECT_SAVED> {
  return { revision: vectorRevisionBucket(revision), bytes: vectorBytesBucket(documentBytes) };
}

/** Narrow any tier-ish string to the catalog's Tier (unknown → anonymous). */
export function tierProp(tier: string | undefined): Tier {
  return tier === 'free' || tier === 'premium' || tier === 'pro' || tier === 'operator' ? tier : 'anonymous';
}

/** Layers in a document, nested and in masks / clip paths included. */
export function layerCount(doc: Pick<VectorDoc, 'layers' | 'defs'>): number {
  let n = 0;
  const walk = (layers: readonly { type: string; children?: unknown }[]) => {
    for (const l of layers) {
      n += 1;
      if (l.type === 'group' && Array.isArray(l.children)) walk(l.children as never);
    }
  };
  walk(doc.layers);
  for (const m of doc.defs.masks) walk(m.layers);
  for (const c of doc.defs.clipPaths) walk(c.layers);
  return n;
}

/**
 * The folded properties whose keyframe count grew from `prev` to `next`
 * (for `vector_keyframe_added`: one event per edit and property).
 */
export function addedKeyframeProperties(prev: VectorDoc | null, next: VectorDoc | null): string[] {
  if (!next) return [];
  const count = (doc: VectorDoc | null) => {
    const m = new Map<string, number>();
    for (const tr of doc?.animations ?? []) {
      const k = keyframePropertyProp(tr.property);
      m.set(k, (m.get(k) ?? 0) + tr.keyframes.length);
    }
    return m;
  };
  const before = count(prev);
  const out: string[] = [];
  for (const [k, n] of count(next)) if (n > (before.get(k) ?? 0)) out.push(k);
  return out.sort();
}
