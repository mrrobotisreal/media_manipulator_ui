import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { LabConsole } from '@/components/lab/lab-console';
import { LAB_COOKIE_NAME } from '@/lib/lab/session';
import { fetchLabModelsServer } from '@/lib/lab/serverFetch';

// MM138: hidden, English-only operator Lab. Server-gated: no cookie, a failed fetch or any
// status but 200 from GET /api/lab/models is a 404 (fail closed). Strings live here and in
// components/lab by decision (no i18n keys). Not in the sitemap, nav, routes.json or Medi.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Lab',
  robots: { index: false, follow: false },
};

export default async function LabPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== 'en') notFound();
  const jar = await cookies();
  const data = await fetchLabModelsServer(jar.get(LAB_COOKIE_NAME)?.value);
  if (!data) notFound();
  return <LabConsole initial={data} />;
}
