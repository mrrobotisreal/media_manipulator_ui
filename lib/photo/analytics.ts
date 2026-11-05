/**
 * Aperture editor analytics (ticket MM101 decision 3/4, design PHOTO_EDITOR.md §10).
 *
 * WHY THIS IS ITS OWN MODULE. `/photo/*` is chromeless (app/providers.tsx): no
 * AnalyticsProvider, no ConsentGate, no consent bar, no AuthProvider. Exactly like
 * the Motion editor (lib/vector/analytics.ts, MM49) it therefore
 *
 *   1. reads the visitor's STORED analytics decision (`mm-consent-v2`). It does NOT
 *      run the site's `initConsent()` (that would apply a region default on a
 *      surface that shows no notice). No stored decision = nothing is sent;
 *   2. starts the shared SDK client only when that decision is `granted`;
 *   3. sends `photo_*` ONLY while it is `granted`, re-read on every call; nothing is
 *      buffered before a decision;
 *   4. sends nothing on translator deployments (MM52).
 *
 * Every property is an enum or a bucket: never a slider value, a filename, a project
 * name or a raw size. Event names only through `EVENTS` (the catalog).
 */
import { analytics, EVENTS, type PropsFor } from '@/lib/analytics';
import { getVisitorId } from '@/lib/analytics/identity';
import { batchBucket, countBucket, photoMegapixelBucket, vectorBytesBucket, vectorMsBucket } from '@/lib/analytics/buckets';
import type { PhotoEditorSource, PhotoFailReason, PhotoMaskKindProp } from '@/lib/analytics/events';
import type { Tier } from '@/lib/auth/accountApi';
import { getConsentDetails } from '@/lib/consent';
import { applyConsent, readStoredConsent } from '@/lib/consent/state';
import { PHOTO_ADJUSTMENT_SLUGS } from '@/content/photo/slugs';
import type { PhotoDoc } from '@/lib/photo/photoTypes';

type PhotoEventName =
  | typeof EVENTS.UPGRADE_CTA_CLICKED
  | typeof EVENTS.PHOTO_EDITOR_OPENED
  | typeof EVENTS.PHOTO_PROJECT_CREATED
  | typeof EVENTS.PHOTO_ADJUSTMENT_CHANGED
  | typeof EVENTS.PHOTO_MASK_ADDED
  | typeof EVENTS.PHOTO_AI_MASK_REQUESTED
  | typeof EVENTS.PHOTO_AI_MASK_COMPLETED
  | typeof EVENTS.PHOTO_AI_MASK_FAILED
  | typeof EVENTS.PHOTO_HEAL_REQUESTED
  | typeof EVENTS.PHOTO_HEAL_COMPLETED
  | typeof EVENTS.PHOTO_HEAL_FAILED
  | typeof EVENTS.PHOTO_PRESET_APPLIED
  | typeof EVENTS.PHOTO_PRESET_SAVED
  | typeof EVENTS.PHOTO_PRESETS_MIGRATED
  | typeof EVENTS.PHOTO_COMPARE_USED
  | typeof EVENTS.PHOTO_PROJECT_SAVED
  | typeof EVENTS.PHOTO_EXPORT_STARTED
  | typeof EVENTS.PHOTO_EXPORT_COMPLETED
  | typeof EVENTS.PHOTO_EXPORT_FAILED
  | typeof EVENTS.PHOTO_EXPORT_GATED;

/** The sink the editor emits through; tests inject a recorder. */
export interface PhotoTracker {
  track<E extends PhotoEventName>(name: E, props: PropsFor<E>): void;
}

const isTranslator = () => process.env.NEXT_PUBLIC_DEPLOY_ROLE === 'translator';

/** Whether the visitor's analytics decision is `granted` right now. */
export function photoAnalyticsAllowed(): boolean {
  if (isTranslator() || typeof window === 'undefined') return false;
  try {
    return getConsentDetails().analytics === 'granted';
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// tool_slug: the page that opened the editor
// ---------------------------------------------------------------------------

/** The default slug: the Aperture landing. */
export const PHOTO_DEFAULT_SLUG = 'aperture';
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,59}$/;
const KNOWN_PHOTO_SLUGS: readonly string[] = [PHOTO_DEFAULT_SLUG, ...PHOTO_ADJUSTMENT_SLUGS];

/**
 * The `context.tool_slug` for an editor session. Primary source: the `?slug=` the
 * tool-page drop zone writes into the hand-off URL (`lib/photo/handoff.ts`), which
 * must be one of the Aperture pages. Fallback: the same-site referrer's
 * `/tools/<slug>` (or `/<lang>/tools/<slug>`), any tool (a result panel's "Open in
 * Aperture" arrives from the tool that made the result). Otherwise `aperture`.
 * `panel` alone cannot name a page (several pages share a panel), so it is not used.
 */
export function resolvePhotoToolSlug(input: { slug?: string | null; referrer?: string | null; selfHost?: string | null }): string {
  const slug = (input.slug ?? '').trim().toLowerCase();
  if (SLUG_RE.test(slug) && KNOWN_PHOTO_SLUGS.includes(slug)) return slug;
  if (input.referrer) {
    try {
      const url = new URL(input.referrer);
      if (!input.selfHost || url.host === input.selfHost) {
        const m = /^(?:\/[a-z]{2}(?:-[A-Za-z]{2,4})?)?\/tools\/([a-z0-9][a-z0-9-]{0,59})\/?$/.exec(url.pathname);
        if (m) return m[1];
      }
    } catch {
      // not a URL: ignore
    }
  }
  return PHOTO_DEFAULT_SLUG;
}

let toolSlug = PHOTO_DEFAULT_SLUG;
export function setPhotoToolSlug(slug: string): void {
  toolSlug = SLUG_RE.test(slug) ? slug : PHOTO_DEFAULT_SLUG;
  if (photoAnalyticsAllowed()) analytics.setContext({ tool_slug: toolSlug });
}
export const getPhotoToolSlug = (): string => toolSlug;

// ---------------------------------------------------------------------------
// start / tier / tracker
// ---------------------------------------------------------------------------

let started = false;

/**
 * Apply the stored consent decision and, when it is `granted`, start the SDK
 * client. Idempotent; returns whether emission is on. Never throws, never contacts
 * the network by itself.
 */
export function startPhotoAnalytics(): boolean {
  if (isTranslator() || typeof window === 'undefined') return false;
  try {
    if (!started) {
      started = true;
      const stored = readStoredConsent();
      // Decided only: an absent record stays `unset` (nothing captured), and
      // persist=false because this surface never writes a consent record.
      if (stored) applyConsent(stored, false);
      if (photoAnalyticsAllowed()) {
        analytics.setContext({ page_type: 'tool', tool_slug: toolSlug });
        analytics.start();
      }
    }
    return photoAnalyticsAllowed();
  } catch {
    return false;
  }
}

/** Narrow any tier-ish string to the catalog's Tier (unknown becomes anonymous). */
export function photoTierProp(tier: string | undefined): Tier {
  return tier === 'free' || tier === 'premium' || tier === 'pro' || tier === 'operator' ? tier : 'anonymous';
}

/** The caller's tier for the event context, once the editor knows it. */
export function setPhotoTier(tier: string | undefined): void {
  if (!photoAnalyticsAllowed()) return;
  analytics.setContext({ tier: photoTierProp(tier) });
}

/** Test seam. */
export function resetPhotoAnalyticsForTests(): void {
  started = false;
  toolSlug = PHOTO_DEFAULT_SLUG;
  batchContext = null;
}

/** The production tracker: the shared SDK client, gated on consent per call. */
export const photoTracker: PhotoTracker = {
  track(name, props) {
    if (!photoAnalyticsAllowed()) return;
    analytics.track(name, props as never, { tool_slug: toolSlug, feature: 'photo' });
  },
};

/**
 * MM108: Medi's `assistant_*` events from the Aperture copilot, through the same consent gate
 * (the shared vocabulary, `surface: 'photo'`; `useAssistantStream` / `useCopilot` call it).
 */
export const photoAssistantTrack = (name: Parameters<typeof analytics.track>[0], props: Parameters<typeof analytics.track>[1]): void => {
  if (!photoAnalyticsAllowed()) return;
  analytics.track(name, props as never, { tool_slug: toolSlug, feature: 'photo' });
};

/**
 * Identity header for the export and batch routes so the API's
 * `server_photo_export_counted` joins the visitor's client events. The visitor id
 * is an analytics identifier: attached ONLY with consent. (`X-MM-Session-ID` is
 * always sent by authedFetch.)
 */
export function photoCountHeaders(): Record<string, string> {
  if (!photoAnalyticsAllowed()) return {};
  try {
    return { 'X-MM-Visitor-ID': getVisitorId() };
  } catch {
    return {};
  }
}

// ---------------------------------------------------------------------------
// prop builders
// ---------------------------------------------------------------------------

/** The size of a document's saved JSON (the autosave payload), in bytes. */
const docBytes = (doc: PhotoDoc): number => JSON.stringify(doc).length;

/** Named masks plus inline layer masks (a `ref` layer mask points at a named one). */
export function maskCount(doc: PhotoDoc): number {
  const inline = doc.layers.filter((l) => l.mask && !('ref' in l.mask)).length;
  return inline + Object.keys(doc.masks ?? {}).length;
}

export function savedProps(doc: PhotoDoc): PropsFor<typeof EVENTS.PHOTO_PROJECT_SAVED> {
  return {
    layers: countBucket(doc.layers.length),
    masks: countBucket(maskCount(doc)),
    heals: countBucket(doc.heals.length),
    doc_bytes_bucket: vectorBytesBucket(docBytes(doc)),
  };
}

export function exportStartedProps(input: {
  format: PropsFor<typeof EVENTS.PHOTO_EXPORT_STARTED>['format'];
  megapixels: number;
  doc: PhotoDoc;
  batchSize?: number;
}): PropsFor<typeof EVENTS.PHOTO_EXPORT_STARTED> {
  return {
    format: input.format,
    megapixels_bucket: photoMegapixelBucket(input.megapixels),
    layers: countBucket(input.doc.layers.length),
    masks: countBucket(maskCount(input.doc)),
    batch_size: batchBucket(input.batchSize ?? 1),
  };
}

const EXT_FORMAT: Record<string, string> = { jpg: 'jpg', jpeg: 'jpg', png: 'png', webp: 'webp', avif: 'avif', tif: 'tiff', tiff: 'tiff', heic: 'heic', heif: 'heic', gif: 'gif', bmp: 'bmp' };
/** `source_format` from a file name's extension (a closed vocabulary; never the name). */
export function sourceFormatOf(fileName: string): string {
  const ext = /\.([A-Za-z0-9]+)$/.exec(fileName)?.[1]?.toLowerCase() ?? '';
  return EXT_FORMAT[ext] ?? 'other';
}

/** Whether a decoded photo has any translucent pixel (a 32 px sample; false when it cannot be read). */
export function bitmapHasAlpha(bitmap: ImageBitmap | { width: number; height: number }, format: string): boolean {
  if (!['png', 'webp', 'avif', 'tiff', 'gif'].includes(format)) return false;
  try {
    const k = Math.min(1, 32 / Math.max(bitmap.width, bitmap.height, 1));
    const w = Math.max(1, Math.round(bitmap.width * k));
    const h = Math.max(1, Math.round(bitmap.height * k));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return false;
    ctx.drawImage(bitmap as ImageBitmap, 0, 0, w, h);
    const px = ctx.getImageData(0, 0, w, h).data;
    for (let i = 3; i < px.length; i += 4) if (px[i] < 250) return true;
    return false;
  } catch {
    return false;
  }
}

/** Map a raw failure (an error name/code, an HTTP status as text) to the catalog's reason vocabulary. */
export function failReason(raw: string | undefined | null): PhotoFailReason {
  const r = (raw ?? '').toLowerCase();
  if (!r) return 'error';
  if (r === 'quotaexceedederror' || r.includes('quota')) return 'quota';
  if (r === '429' || r.includes('rate') || r.includes('limit')) return 'limit';
  if (r === '403' || r.includes('locked') || r.includes('forbidden')) return 'locked';
  if (r === 'cancelled' || r === 'aborted' || r === 'aborterror' || r.includes('abort') || r.includes('cancel')) return 'cancelled';
  if (r.includes('timeout') || r === '504' || r === '408') return 'timeout';
  if (r === '413' || r.includes('too_large') || r.includes('too_many_pixels') || r.includes('too_big')) return 'too_large';
  if (r === '415' || r === '422' || r.includes('unsupported') || r.includes('invalid')) return 'unsupported';
  if (r === 'network' || r === '0' || r === '502' || r === '503' || r.includes('unavailable') || r.includes('disabled') || r.includes('network')) return 'unavailable';
  if (r.includes('render') || r.includes('failed_job')) return 'render';
  return 'error';
}

const MASK_KINDS: readonly string[] = ['gradient', 'radial', 'brush', 'luminosity', 'colorRange', 'subject'];
/** The mask seam says `local` for a brush-masked local adjustment. */
export function maskKindOf(kind: string): PhotoMaskKindProp | null {
  if (kind === 'local') return 'brush';
  return MASK_KINDS.includes(kind) ? (kind as PhotoMaskKindProp) : null;
}

export { vectorMsBucket as msBucket };

// ---------------------------------------------------------------------------
// batch context (the export dialog tells the MM99 `onBatchStarted(n)` seam what the batch is)
// ---------------------------------------------------------------------------

export interface PhotoBatchContext {
  format: PropsFor<typeof EVENTS.PHOTO_EXPORT_STARTED>['format'];
  megapixels: number;
  doc: PhotoDoc;
}
let batchContext: PhotoBatchContext | null = null;
export function setPhotoBatchContext(ctx: PhotoBatchContext | null): void {
  batchContext = ctx;
}
export const getPhotoBatchContext = (): PhotoBatchContext | null => batchContext;

export type { PhotoEditorSource };
