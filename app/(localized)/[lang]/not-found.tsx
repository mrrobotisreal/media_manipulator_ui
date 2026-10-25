import type { Metadata } from 'next';
import NotFoundView from '@/views/not-found';
import { translatorRobots } from '@/lib/translator/mode';

// `not-found.tsx` receives no props (including no `params`), so the locale
// cannot be resolved here — NotFoundView is a client component that speaks
// the language the i18n provider derived from the `[lang]` URL segment.
export const metadata: Metadata = {
  title: 'Page not found — Media Manipulator',
  robots: translatorRobots({ index: false, follow: true }),
};

export default function NotFound() {
  return <NotFoundView />;
}
