// Single entry point for the retention / data-control analytics of the account screen (MM25 wired
// the call sites, MM26 owns the catalog entries in lib/analytics/events.ts).
//
// Four events, all property-free of PII: no file names, no ids, no free text. Only enums and the
// buckets from lib/analytics/buckets.ts. Consent gating and the outbox are the analytics client's
// job (a declined visitor records nothing). Nothing here may throw: analytics never breaks a
// destructive flow.

import { analytics } from './client';
import { EVENTS, type DataDeletedKind, type DataDeletedScope } from './events';
import { reopenAgeBucket, retentionBucket } from './buckets';

export interface RetentionSettingsChange {
  from_hours: number;
  to_hours: number;
}

/** Upper bound on per-item events from one bulk delete, so a runaway selection cannot flood the outbox. */
const BULK_EVENT_CAP = 50;

function safely(fn: () => void): void {
  try {
    fn();
  } catch {
    /* analytics must never break the flow it observes */
  }
}

function deleted(scope: DataDeletedScope, kind: DataDeletedKind): void {
  safely(() => analytics.track(EVENTS.DATA_DELETED, { scope, kind }));
}

export const retentionEvents = {
  /** The account retention window was saved. Buckets, never raw hours. */
  settingsChanged(change: RetentionSettingsChange): void {
    safely(() =>
      analytics.track(EVENTS.RETENTION_SETTING_CHANGED, {
        from_bucket: retentionBucket(change.from_hours),
        to_bucket: retentionBucket(change.to_hours),
      }),
    );
  },

  /** A single result or project was deleted (`count` > 1 for a bulk delete: one event per item, capped). */
  itemDeleted(kind: 'result' | 'project', count = 1): void {
    for (let i = 0; i < Math.min(Math.max(count, 0), BULK_EVENT_CAP); i += 1) deleted('item', kind);
  },

  /** "Delete all my files" completed. */
  allFilesDeleted(): void {
    deleted('all', 'all_files');
  },

  /** The whole account was deleted. */
  accountDeleted(): void {
    deleted('account', 'account');
  },

  /** The person asked for a data export and the API accepted the request. */
  exportRequested(): void {
    safely(() => analytics.track(EVENTS.DATA_EXPORT_REQUESTED, {}));
  },

  /**
   * A stored item was opened again (preview, download or project open). `kind` is the media kind of
   * a result or `project`; the age is bucketed. This is the number that says whether long retention
   * is actually used.
   */
  itemReopened(kind: string | undefined, createdAt: string): void {
    safely(() => {
      const created = Date.parse(createdAt);
      if (!Number.isFinite(created)) return;
      analytics.track(EVENTS.HISTORY_ITEM_REOPENED, {
        kind: kind || 'other',
        age_bucket: reopenAgeBucket(Date.now() - created),
      });
    });
  },
};
