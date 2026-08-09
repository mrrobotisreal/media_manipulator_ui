import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import NotFoundView from '@/views/not-found';
import { getRequestLocale } from '@/lib/i18n/requestLocale';

export const metadata: Metadata = buildMetadata('/404');

export default async function NotFound() {
  const locale = await getRequestLocale();
  return <NotFoundView locale={locale} />;
}
