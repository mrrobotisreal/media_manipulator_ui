'use client';

import type { ReactNode } from 'react';

import { ADSENSE_ENABLED, MOCK_ADS_ENABLED } from '@/lib/adsenseConfig';
import { cn } from '@/lib/utils';

/**
 * MM88 decision 6: the box an in-content ad unit sits in, reserved ONLY when an ad can
 * render.
 *
 * The tool landing page used to reserve `min-h-[280px]` around its AdBanner whenever the
 * page had a slot id, and on the review build (ads off) that was a 280-300px blank in the
 * middle of the copy, which a reviewer on a phone sees as a broken page. With ads off
 * (`NEXT_PUBLIC_ADSENSE_ENABLED` unset, a build-time constant) this renders nothing at all,
 * so the box is not in the HTML. With ads on, the box is reserved before the unit loads so
 * the fill causes no layout shift; MM82's loader and AdBanner's tier/path guards decide
 * whether an ad actually fills it.
 *
 * Trade-off, documented on purpose: with ads on, the reserved box stays even when Google
 * returns no fill (or the visitor is Premium and AdBanner renders nothing into it). Removing
 * it after the fact would be the layout shift the reservation exists to prevent.
 *
 * `MOCK_ADS_ENABLED` (local preview only, never production) also reserves it so the
 * first-party MockAd keeps its place in dev.
 */
export function AdSlotFrame({ children, className }: { children: ReactNode; className?: string }) {
  if (!ADSENSE_ENABLED && !MOCK_ADS_ENABLED) return null;
  return (
    <div data-ad-frame className={cn('my-12 flex justify-center min-h-[280px] md:min-h-[300px]', className)}>
      {children}
    </div>
  );
}

export default AdSlotFrame;
