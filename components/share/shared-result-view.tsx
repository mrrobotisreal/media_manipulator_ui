'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Panel } from '@/components/darkroom/panel';
import { ResultPanel } from '@/components/results/result-panel';
import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import type { ResultDescriptor } from '@/lib/results/describe';

const CTA_CLASS =
  'inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 py-2 font-medium text-primary-foreground transition-colors hover:bg-[var(--accent-primary-hover)]';

export interface SharedResultViewProps {
  /** Built on the server from the share descriptor (`shareToResultDescriptor`). */
  descriptor: ResultDescriptor;
  /** Tool page path for the CTA (`/tools/<slug>`), or null to link home. */
  toolPath: string | null;
}

/** MM32: the read-only page body. No owner affordances, no history recording. */
export function SharedResultView({ descriptor, toolPath }: SharedResultViewProps) {
  const { t } = useLocalization('interface');
  const localized = useLocalizedHref();
  const href = localized(toolPath ?? '/');
  const label = useMemo(() => {
    if (!descriptor.expiresAt) return null;
    const when = new Date(descriptor.expiresAt);
    return Number.isNaN(when.getTime()) ? null : when.toLocaleString();
  }, [descriptor.expiresAt]);
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
      <ResultPanel descriptor={descriptor} readOnly surface="shared" metadataStrip={false} recordHistory={false} />
      {label ? <p className="text-center text-sm text-muted-foreground">{t('sharedResult.expires', { when: label })}</p> : null}
      <Panel level="1" className="flex flex-col items-center gap-3 p-6 text-center">
        <Link href={href} className={CTA_CLASS} data-testid="shared-cta">
          {t('sharedResult.tryIt')}
        </Link>
        <p className="text-sm text-muted-foreground">
          <Link href={localized('/')} className="underline underline-offset-4" data-testid="shared-footer">
            {t('sharedResult.madeWith')}
          </Link>
        </p>
      </Panel>
    </main>
  );
}

/** MM32: friendly 404 for unknown, expired, revoked or deleted links. */
export function SharedResultGone() {
  const { t } = useLocalization('interface');
  const localized = useLocalizedHref();
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-16 text-center sm:px-6">
      <h1 className="text-2xl font-semibold text-foreground">{t('sharedResult.goneTitle')}</h1>
      <p className="text-muted-foreground">{t('sharedResult.goneBody')}</p>
      <div>
        <Link href={localized('/')} className={CTA_CLASS} data-testid="shared-gone-cta">
          {t('sharedResult.goneCta')}
        </Link>
      </div>
    </main>
  );
}
