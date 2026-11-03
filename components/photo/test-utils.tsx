import * as React from 'react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import enPanels from '@/i18n/locales/en-us/interface/panels.json';
import enComponents from '@/i18n/locales/en-us/interface/components.json';
import { createI18nInstance } from '@/i18n';

/** Test wrapper: i18n with the lazy `photo.*` shard merged, plus react-query. */
export function Wrap({ children }: { children: React.ReactNode }) {
  const i18n = React.useMemo(() => {
    const i = createI18nInstance('en-US');
    i.addResourceBundle('en-US', 'interface', enPanels, true, true);
    i.addResourceBundle('en-US', 'interface', enComponents, true, true);
    return i;
  }, []);
  const qc = React.useMemo(() => new QueryClient({ defaultOptions: { queries: { retry: false } } }), []);
  return (
    <QueryClientProvider client={qc}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </QueryClientProvider>
  );
}
