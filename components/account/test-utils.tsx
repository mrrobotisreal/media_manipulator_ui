import en from '@/i18n/locales/en-us/interface/pages.json';
import type { AccountCopy } from './account-copy';

/** The real English account copy, so assertions read as user-visible text. */
export const copy = en.account as unknown as AccountCopy;

/** `useLocalization` double: metadata shard keys resolve, dates echo, language is en-US. */
export async function localizationMock() {
  const m = await import('@/components/metadata/test-utils');
  return {
    useLocalization: () =>
      Object.assign(m.mockLocalization(), {
        dir: 'ltr' as const,
        formatDate: (d: string) => `D(${d.slice(0, 10)})`,
      }),
  };
}

export const row = (jobId: string, extra: object = {}) => ({
  jobId,
  status: 'completed',
  createdAt: '2026-10-01T00:00:00Z',
  expired: false,
  ...extra,
});
