import React from 'react';
import { getServerT } from '@/lib/i18n/server';

/** Dated "what changed" note shown at the top of the Privacy Policy and Terms (MM26). */
export const WhatChanged: React.FC<{ locale?: string }> = ({ locale }) => {
  const t = getServerT('interface', locale);
  return (
    <aside
      data-testid="legal-what-changed"
      className="mb-6 rounded-md border border-primary/40 bg-primary/5 p-4"
    >
      <h2 className="mb-2 text-lg font-semibold text-card-foreground">{t('legalCommon.whatChangedTitle')}</h2>
      <p>{t('legalCommon.whatChangedBody')}</p>
    </aside>
  );
};
