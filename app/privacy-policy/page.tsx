import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import PrivacyPolicyPage from '@/views/privacy-policy';

export const metadata: Metadata = buildMetadata('/privacy-policy');

export default function PrivacyPolicy() {
  return (
    <>
      <JsonLd path="/privacy-policy" />
      <PrivacyPolicyPage />
    </>
  );
}
