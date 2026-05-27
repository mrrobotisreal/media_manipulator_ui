import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { AD_SLOTS } from '@/lib/adSlots';
import { useLocalization } from '@/i18n/useLocalization';

const DISMISS_STORAGE_KEY = 'mm_anchor_dismissed';

/**
 * Sticky mobile anchor ad — only renders below the `lg` breakpoint, pinned to
 * the bottom of the viewport with a 30px gap above the browser chrome and a
 * 30×30 close button (AdSense policy compliance). Dismissal is stored in
 * sessionStorage so the unit reappears in a fresh tab/session.
 */
const MobileAnchorAd: React.FC = () => {
  const { t } = useLocalization('accessibility');
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.sessionStorage.getItem(DISMISS_STORAGE_KEY);
      if (stored !== '1') setDismissed(false);
    } catch {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(DISMISS_STORAGE_KEY, '1');
    } catch {
      // sessionStorage may be unavailable in privacy modes — fine.
    }
  };

  if (dismissed) return null;

  return (
    <div
      className="lg:hidden fixed left-0 right-0 z-40 flex justify-center pointer-events-none"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 30px)' }}
      role="complementary"
      aria-label={t('ad.label')}
    >
      <div className="pointer-events-auto relative flex items-end gap-2 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-2">
        <button
          type="button"
          onClick={handleDismiss}
          aria-label={t('ad.close')}
          className="absolute -top-3 -right-3 w-[30px] h-[30px] rounded-full bg-background border border-border text-foreground shadow-md flex items-center justify-center hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
        <AdBanner
          adSlot={AD_SLOTS.mobile_anchor}
          adFormat="banner"
          adPosition="mobile_anchor"
          utmMedium="mobile_anchor_banner"
        />
      </div>
    </div>
  );
};

export default MobileAnchorAd;
