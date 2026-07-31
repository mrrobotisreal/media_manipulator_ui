'use client';

import * as React from 'react';

import { analytics, EngagementTracker, EVENTS } from '@/lib/analytics';

/**
 * Reading measurement for the blog and the tutorials.
 *
 * WHY THIS IS NOT `scroll_depth`. Both events keep firing and they answer different
 * questions. `scroll_depth` is generic and page-agnostic: it says a viewport moved down a
 * document, which is as true of a tool page as of an article. `content_read_*` is scoped to
 * one piece of CONTENT, carries its slug, and — crucially — requires active time as well as
 * scroll position. That distinction is the whole point: a fast scroll to the bottom looks
 * identical to a careful read in `scroll_depth`, and the SEO question ("is this article
 * earning its keep?") is exactly the one where the difference matters. Different grain,
 * both kept.
 *
 * WHY A SECOND TRACKER INSTANCE. `AnalyticsProvider` already runs an EngagementTracker, but
 * that one is page-scoped and resets on every route change — and its milestone callback
 * emits the generic `scroll_depth`. This one is article-scoped, lives exactly as long as the
 * article is mounted, and reports against the article's slug. Sharing one instance would
 * conflate the two lifetimes; the cost of not sharing is one extra one-second interval and
 * one extra set of passive listeners, which is nothing.
 *
 * COMPLETION NEEDS BOTH SCROLL AND TIME. `content_read_completed` requires ≥90% scroll AND
 * ≥15s of ACTIVE time (visible, focused, recently interacted with — see EngagementTracker).
 * Either alone is a well-known lie: a keyboard `End` press reaches 100% instantly, and a tab
 * left open on an article overnight accumulates hours without a word being read.
 *
 * ANALYTICS NEVER THROWS AND NEVER BLOCKS. Everything here is passive listeners plus one
 * interval, and the component renders no DOM at all.
 */

/** ≥90%, not 100%: footers, related-post rails and cookie banners routinely make the last
 *  few percent unreachable, and demanding them would under-count every completed read. */
const COMPLETION_SCROLL_PCT = 90;

/** 15s of ACTIVE time. Short enough for a skim-read of a short post to qualify, long enough
 *  that an instant jump to the bottom does not. */
const COMPLETION_ACTIVE_MS = 15_000;

export interface ContentReadTrackerProps {
  /** The article's own slug — the dimension every content report groups by. */
  slug: string;
  contentType: 'blog' | 'tutorial';
}

export const ContentReadTracker: React.FC<ContentReadTrackerProps> = ({ slug, contentType }) => {
  React.useEffect(() => {
    // Milestones that have already been reported, so a scroll back up and down again does
    // not re-report 25%. Held outside the tracker because the tracker's own milestone set
    // covers 100 as well, and the catalog's `pct` is 25 | 50 | 75 only — completion is a
    // separate event with a stricter test.
    const reported = new Set<number>();
    let completed = false;

    const tracker = new EngagementTracker((pct) => {
      if (pct !== 100 && !reported.has(pct)) {
        reported.add(pct);
        analytics.track(EVENTS.CONTENT_READ_PROGRESS, { pct, slug, content_type: contentType });
      }
      maybeComplete();
    });

    function maybeComplete(): void {
      if (completed) return;
      const { max_scroll_pct: scrollPct, active_ms: activeMs } = tracker.snapshot();
      if (scrollPct < COMPLETION_SCROLL_PCT || activeMs < COMPLETION_ACTIVE_MS) return;
      completed = true;
      analytics.track(EVENTS.CONTENT_READ_COMPLETED, {
        slug,
        content_type: contentType,
        active_ms: activeMs,
      });
    }

    tracker.start();

    // Scroll alone cannot decide completion, so the time condition needs its own poll: a
    // reader who reaches the bottom in 4 seconds and then keeps reading would otherwise
    // never qualify, because no further scroll event would arrive to re-test. Five seconds
    // is coarse enough to be free and fine enough that the event lands while they are still
    // on the page.
    const timer = window.setInterval(maybeComplete, 5_000);

    return () => {
      window.clearInterval(timer);
      // One last chance on unmount (a route change away from the article). If they already
      // qualified, this is where the event goes out; if not, no event — which is the honest
      // answer.
      maybeComplete();
      tracker.stop();
    };
  }, [contentType, slug]);

  return null;
};

export default ContentReadTracker;
