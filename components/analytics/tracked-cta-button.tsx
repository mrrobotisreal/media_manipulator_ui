'use client';

import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { EVENTS, useAnalytics } from '@/lib/analytics';

interface TrackedCtaButtonProps {
  /**
   * Stable, low-cardinality identifier for this CTA — e.g.
   * `blog_video_compression_try_converter`.
   *
   * A CTA ID, not a free-text event name. The previous version took an arbitrary
   * `event` string ("Video Compression Guide - Try Video Converter Free"), which meant
   * three long-form guides invented three event names that no query could group. One
   * event (`cta_clicked`) with a `cta_id` dimension is the shape that answers "which CTAs
   * convert?" — and it is why the catalog forbids inline event names.
   */
  ctaId: string;
  /** Where on the site this CTA sits, for cross-page comparison. */
  placement?: string;
  href: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * The single interactive element in the long-form blog guides.
 *
 * Isolating it here keeps ~1,250 lines of guide prose in server components: the articles
 * render as static HTML and only this button ships JS.
 *
 * `cta_clicked` is priority 1 and the tier comes from SDK context automatically. The old
 * version hardcoded `user_tier: 'free'` on every click, which was simply a lie for
 * anonymous and premium visitors alike — and precisely the kind of thing a typed catalog
 * with server-side context exists to prevent.
 */
export function TrackedCtaButton({
  ctaId,
  placement,
  href,
  className,
  children,
}: TrackedCtaButtonProps) {
  const { track } = useAnalytics();

  return (
    <Button
      asChild
      size="lg"
      className={className}
      onClick={() =>
        track(EVENTS.CTA_CLICKED, {
          cta_id: ctaId,
          placement: placement || 'blog_guide',
          href,
        })
      }
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}

export default TrackedCtaButton;
