import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import TermsOfServicePage from '@/views/terms-of-service';

export const metadata: Metadata = buildMetadata('/terms-of-service');

export default function TermsOfService() {
  return (
    <>
      <JsonLd path="/terms-of-service" />
      <TermsOfServicePage />
    </>
  );
}
