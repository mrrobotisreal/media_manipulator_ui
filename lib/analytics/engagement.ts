'use client';

import { touchSession } from './session';

/**
 * Per-page engagement measurement.
 *
 * EXTRACTED FROM AnalyticsProvider IN PART 2, unchanged. It was a private class in the
 * provider, which meant the one piece of machinery that can measure "did somebody actually
 * read this?" was reachable only by the provider — so `content_read_progress` and
 * `content_read_completed` sat in the catalog with no producers while a working scroll +
 * active-time tracker existed ten lines away. Exporting it let
 * `components/analytics/content-read-tracker.tsx` instantiate a second, article-scoped one.
 *
 * `active_ms` is the number that matters on this site, and it is NOT time-on-page. A
 * 4-minute video transcode leaves the tab open and idle BY DESIGN, so wall-clock time
 * would score a successful conversion as deep engagement and a bounce-with-a-long-read as
 * the same thing. "Active" here means visible AND focused AND interacted-with in the last
 * five seconds, sampled on a one-second tick.
 *
 * The tick is one `setInterval` per instance, and the interaction listeners are passive —
 * so the cost is a boolean flip per input event. Two concurrent instances (the provider's
 * page-level one and an article's) are therefore two intervals and two sets of passive
 * listeners, which is cheap enough not to warrant sharing one instance through context —
 * and sharing would be wrong anyway: the provider's resets on every route change, while an
 * article's has to survive for exactly as long as the article is mounted.
 */
export class EngagementTracker {
  private startedAt = Date.now();
  private activeMs = 0;
  private visibleMs = 0;
  private maxScrollPct = 0;
  private lastInteractionAt = Date.now();
  private ticker: ReturnType<typeof setInterval> | null = null;
  private detachers: Array<() => void> = [];
  private firedMilestones = new Set<number>();
  private onMilestone: (pct: 25 | 50 | 75 | 100) => void;

  /** How recently an interaction has to have happened for the visitor to count as active. */
  private static readonly INTERACTION_WINDOW_MS = 5_000;

  constructor(onMilestone: (pct: 25 | 50 | 75 | 100) => void) {
    this.onMilestone = onMilestone;
  }

  start(): void {
    if (typeof window === 'undefined') return;
    this.startedAt = Date.now();
    this.lastInteractionAt = Date.now();

    const markInteraction = () => {
      this.lastInteractionAt = Date.now();
      // Interaction is also session activity — this is what keeps a visitor reading a long
      // tutorial from being idled out of their session mid-read.
      touchSession();
    };

    const events: Array<keyof WindowEventMap> = [
      'pointerdown',
      'keydown',
      'wheel',
      'touchstart',
    ];
    for (const name of events) {
      window.addEventListener(name, markInteraction, { passive: true });
      this.detachers.push(() => window.removeEventListener(name, markInteraction));
    }

    const onScroll = () => {
      markInteraction();
      this.recordScroll();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    this.detachers.push(() => window.removeEventListener('scroll', onScroll));

    this.ticker = setInterval(() => this.tick(), 1000);
    // Take an initial reading so a page short enough to never scroll still reports a
    // sensible max_scroll_pct (100 when the whole document fits on screen).
    this.recordScroll();
  }

  private tick(): void {
    const visible = typeof document === 'undefined' || document.visibilityState === 'visible';
    if (!visible) return;
    this.visibleMs += 1000;
    const focused = typeof document === 'undefined' || document.hasFocus();
    const recentlyInteracted =
      Date.now() - this.lastInteractionAt <= EngagementTracker.INTERACTION_WINDOW_MS;
    if (focused && recentlyInteracted) this.activeMs += 1000;
  }

  private recordScroll(): void {
    try {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      // A document that fits entirely on screen has been fully "read" by definition.
      const pct = scrollable <= 0 ? 100 : Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      if (pct > this.maxScrollPct) this.maxScrollPct = pct;

      for (const milestone of [25, 50, 75, 100] as const) {
        if (this.maxScrollPct >= milestone && !this.firedMilestones.has(milestone)) {
          this.firedMilestones.add(milestone);
          this.onMilestone(milestone);
        }
      }
    } catch {
      // A layout read can throw during teardown. Not worth handling.
    }
  }

  snapshot(): { active_ms: number; visible_ms: number; duration_ms: number; max_scroll_pct: number } {
    return {
      active_ms: this.activeMs,
      visible_ms: this.visibleMs,
      duration_ms: Date.now() - this.startedAt,
      max_scroll_pct: this.maxScrollPct,
    };
  }

  stop(): void {
    if (this.ticker) clearInterval(this.ticker);
    this.ticker = null;
    this.detachers.forEach((detach) => {
      try {
        detach();
      } catch {
        // ignore
      }
    });
    this.detachers = [];
  }
}
