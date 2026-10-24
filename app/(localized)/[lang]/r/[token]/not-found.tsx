import type { Metadata } from 'next';
import { SharedResultGone } from '@/components/share/shared-result-view';

// MM32: unknown, expired, revoked and deleted links all land here (same page for every case,
// so a visitor cannot tell them apart). Never indexable.
export const metadata: Metadata = {
  title: 'Link unavailable | Media Manipulator',
  robots: { index: false, follow: false },
};

export default function SharedResultNotFound() {
  return <SharedResultGone />;
}
