/**
 * Global Privacy Control.
 *
 * WHY GPC AND NOT DNT. Do Not Track is a dead standard: no regulator gave it legal
 * force, every major browser stopped sending it meaningfully, and honouring it would be
 * a gesture. GPC is the opposite — under CPRA (and the Colorado, Connecticut and
 * Virginia analogues) a GPC signal is a VALID, LEGALLY BINDING opt-out of the sale or
 * sharing of personal information, and the California AG has enforced against sites
 * that ignored it. So GPC is honoured automatically and DNT is ignored.
 *
 * WHAT IT MAPS TO. GPC is an opt-out of SALE/SHARING, which in Consent Mode terms is
 * `ad_storage` + `ad_user_data` + `ad_personalization` — our `advertising` category. It
 * is NOT an opt-out of first-party analytics: analytics on our own domain, for our own
 * product decisions, is not a sale or a share of anything. Treating GPC as an analytics
 * opt-out would be over-compliance that costs real data for no legal benefit, and it
 * would also make the signal unfalsifiable ("we honour GPC" would mean two different
 * things to two readers).
 *
 * GPC OVERRIDES A PRIOR GRANT. If a visitor previously accepted advertising and later
 * enables GPC, the GPC wins — CPRA treats the signal as a valid opt-out AT ALL TIMES,
 * not merely as a default for first-time visitors. It is re-evaluated on every load for
 * exactly that reason.
 */

/** Read `navigator.globalPrivacyControl`. */
export function detectGPC(): boolean {
  if (typeof navigator === 'undefined') return false;
  try {
    const gpc = (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;
    return gpc === true;
  } catch {
    return false;
  }
}

/**
 * Whether GPC should force `advertising` to denied.
 *
 * A separate predicate from `detectGPC` so the call site reads as the policy decision
 * it is, rather than as a browser-capability check.
 */
export function gpcDeniesAdvertising(): boolean {
  return detectGPC();
}
