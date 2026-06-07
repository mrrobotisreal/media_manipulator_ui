// DISABLED FOR ADSENSE REVIEW.
//
// The sticky mobile anchor ad is intentionally not rendered anywhere in the
// app. This component now renders nothing and pulls in no ad code, so even if
// it were accidentally imported it cannot load Google scripts or send an ad
// request. The audit (scripts/audit-adsense) fails if this is imported by an
// active runtime route/provider. Re-enable only after AdSense approval.

export default function MobileAnchorAd() {
  return null;
}
