'use client';

import * as React from 'react';

import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import { EVENTS } from '@/lib/analytics/events';
import { photoTierProp, photoTracker, type PhotoTracker } from '@/lib/photo/analytics';
import type { PhotoCta } from '@/lib/photo/gating';
import { isIrreversibleActionHidden } from '@/lib/translator/mode';

/**
 * The one Aperture upsell link (MM101 decision 2): "Sign in free" opens the account
 * page, "Upgrade to Premium" / "Upgrade to Pro" the pricing page, in a new tab so the
 * editor (and any unsaved work) stays open. The editor mounts no AuthProvider, so
 * `useUpgradeAction` (which needs it) cannot run here: this mirrors Motion's
 * UpgradeCta (components/vector/export-dialog.tsx), and `upgrade_cta_clicked` goes
 * through the consent-gated tracker. Nothing for `none` and on translator
 * deployments (MM52 sells nothing).
 */
export function PhotoUpgradeCta({ cta, placement, ctaId, tier, track = photoTracker }: { cta: PhotoCta; placement: string; ctaId?: string; tier?: string; track?: PhotoTracker }) {
  const { t } = useLocalization('interface');
  const localized = useLocalizedHref();
  if (cta === 'none' || isIrreversibleActionHidden()) return null;
  const href = localized(cta === 'signup' ? '/account' : '/pricing');
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      data-testid="photo-upgrade-cta"
      data-cta={cta}
      onClick={(e) => {
        e.stopPropagation();
        track.track(EVENTS.UPGRADE_CTA_CLICKED, { placement, cta_id: ctaId ?? `aperture_${cta}`, from_tier: photoTierProp(tier) });
      }}
      className="font-medium text-foreground underline underline-offset-2"
    >
      {t(`photo.gate.cta.${cta}`)}
    </a>
  );
}
