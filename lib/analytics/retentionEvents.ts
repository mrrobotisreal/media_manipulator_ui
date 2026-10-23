/* eslint-disable @typescript-eslint/no-unused-vars -- stub signatures document the MM26 contract */
// Single entry point for the retention / data-control analytics of the account screen (MM25).
//
// MM26 owns the event catalog (lib/analytics/events.ts). Until it lands, every method here is
// a deliberate no-op: call sites are wired now, through named methods rather than inline
// event-name strings, and MM26 fills the bodies with `analytics.track(EVENTS.*, ...)`.
// Nothing here may throw: analytics never breaks a destructive flow.

export interface RetentionSettingsChange {
  from_hours: number;
  to_hours: number;
  /** Whether the shrink-confirmation dialog was shown. */
  confirmed_shrink: boolean;
}

export const retentionEvents = {
  tabViewed(_tab: string): void {},
  settingsChanged(_change: RetentionSettingsChange): void {},
  shrinkDialogShown(_impact: { results: number; projects: number; bytes: number }): void {},
  shrinkDialogCancelled(): void {},
  keepLonger(_hours: number): void {},
  itemDeleted(_scope: 'result' | 'project' | 'bulk', _count: number): void {},
  exportRequested(_outcome: 'started' | 'rate_limited' | 'failed'): void {},
  deleteAllConfirmed(): void {},
  accountDeleteConfirmed(_outcome: 'completed' | 'reauth_required' | 'incomplete' | 'failed'): void {},
  sessionsRevoked(): void {},
};
