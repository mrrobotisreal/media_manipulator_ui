/**
 * Upload lifecycle: `upload_started` → `upload_completed`.
 *
 * WHY A HELPER RATHER THAN TEN COPIES. Ten tool hooks upload files, each with its own
 * shape (single multipart POST, presigned PUT, presign-then-PUT-then-finalize, and a probe
 * that uploads without starting a job). Every one of them already tracked
 * `upload_failed`, and none of them tracked the two events either side of it — so the
 * funnel had a hole exactly where "is the upload the thing that's slow?" gets answered.
 * Writing the pair by hand in ten places would have meant ten chances to forget the
 * duration, or to measure it from the wrong instant.
 *
 * THE DURATION IS MEASURED LOCALLY, not from the event timestamps. `upload_started` and
 * `upload_completed` can be flushed in different batches, minutes apart if the visitor
 * closes the tab and the outbox recovers later, so subtracting their `event_ts` values
 * server-side would sometimes measure the outbox instead of the upload. A local
 * `Date.now()` pair measures the upload.
 *
 * ANALYTICS NEVER THROWS. Both calls go through `analytics.track`, which swallows
 * everything; a tracker whose `completed()` is never called simply produces no
 * `upload_completed`, which reads in the data as an incomplete upload — the truth.
 */

import { analytics } from './client';
import { EVENTS, type TrackOptions } from './events';

/**
 * How the bytes travelled.
 *
 * `post` is a multipart POST straight to our API; `presigned_put` is a PUT to S3 against a
 * presigned URL. The distinction matters because the two have completely different failure
 * modes and completely different speed profiles, and because the presigned path is the one
 * we chose specifically to keep large videos off the API process.
 */
export type UploadTransport = 'presigned_put' | 'post';

export interface UploadTracker {
  /** Emit `upload_completed` with the measured duration. Safe to call more than once. */
  completed: () => void;
}

/**
 * Emit `upload_started` and return a tracker that closes the pair.
 *
 * `context` is passed straight through to `analytics.track` as the per-event context
 * override, which is how a hook supplies `media_kind` (the tool slug comes from the
 * persistent context the ToolAnalyticsProvider maintains, so it never has to be passed).
 */
export function trackUploadStarted(
  sizeBytes: number,
  transport: UploadTransport,
  context?: TrackOptions,
): UploadTracker {
  const startedAt = Date.now();
  let done = false;

  analytics.track(EVENTS.UPLOAD_STARTED, { size_bytes: sizeBytes, transport }, context);

  return {
    completed: () => {
      // Guarded because several hooks can reach their success path through more than one
      // branch (a retry, a resumed presign), and two `upload_completed` events for one
      // upload would double the denominator of every upload-success rate.
      if (done) return;
      done = true;
      analytics.track(
        EVENTS.UPLOAD_COMPLETED,
        { size_bytes: sizeBytes, duration_ms: Date.now() - startedAt, transport },
        context,
      );
    },
  };
}
