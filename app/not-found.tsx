import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import NotFoundView from '@/views/not-found';

export const metadata: Metadata = buildMetadata('/404');

export default function NotFound() {
  return <NotFoundView />;
}
