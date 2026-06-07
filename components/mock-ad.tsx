import { type AdPlacement } from '@/lib/adsenseConfig';

type MockAdProps = {
  placement: AdPlacement;
  className?: string;
  label?: string;
};

/**
 * First-party local-preview ad placeholder. Renders only when
 * NEXT_PUBLIC_MOCK_ADS_ENABLED is on in non-production. It never loads Google
 * scripts and never sends an ad request — it's purely a visual stand-in so we
 * can sanity-check spacing/placement without touching AdSense.
 */
export function MockAd({
  placement,
  className,
  label = 'Advertisement preview',
}: MockAdProps) {
  return (
    <div
      className={className}
      role="img"
      aria-label={label}
      data-mock-ad="true"
      data-placement={placement}
    >
      <div className="rounded-xl border border-dashed border-muted-foreground/30 bg-muted/30 p-6 text-center text-sm text-muted-foreground">
        <div className="font-medium">Mock ad preview</div>
        <div className="mt-1 text-xs">
          Local preview only. No Google ad request is sent.
        </div>
      </div>
    </div>
  );
}

export default MockAd;
