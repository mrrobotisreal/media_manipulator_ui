import type { Metadata } from 'next';
import ContentStudioEmbedHost from '@/components/content-studio/embed-host';

export const metadata: Metadata = {
  title: 'Content Studio',
  robots: { index: false, follow: false },
};

/**
 * /embed/content-studio — the chromeless route CreaTV's Darkroom iframes. It
 * renders only the editor (no site nav/footer; Providers skips chrome on
 * /embed). The host (CreaTV) drives which draft to open via the postMessage
 * handshake; no secrets are read from the URL.
 */
export default function ContentStudioEmbedRoute() {
  return <ContentStudioEmbedHost />;
}
