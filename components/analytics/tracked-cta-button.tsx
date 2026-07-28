'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { trackMixpanelEvent } from '@/lib/analytics';

interface TrackedCtaButtonProps {
  /** Mixpanel event name fired on click. */
  event: string;
  /** Extra event properties merged over the defaults. */
  properties?: Record<string, unknown>;
  href: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * The single interactive element in the long-form blog guides.
 *
 * Isolating it here keeps ~1,250 lines of guide prose in server components:
 * the articles render as static HTML and only this button ships JS. Events go
 * through `trackMixpanelEvent`, which is consent-gated and cannot throw before
 * Mixpanel initializes — a raw `mixpanel.track()` here would blank the page.
 */
export function TrackedCtaButton({
  event,
  properties,
  href,
  className,
  children,
}: TrackedCtaButtonProps) {
  return (
    <Button
      asChild
      size="lg"
      className={className}
      onClick={() => trackMixpanelEvent(event, { user_tier: 'free', ...properties })}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}

export default TrackedCtaButton;
