/**
 * Google's Privacy & messaging consent message (Funding Choices, TCF v2.2).
 *
 * It ships inside the ad script and exposes `window.googlefc` once the message
 * is configured in the AdSense dashboard (MM83). In the EEA/UK/CH it owns ad
 * consent, so "Cookie settings" and the preferences centre's Advertising row
 * reopen it rather than asking a second time (MM82).
 */

/** Whether the Google consent message can be reopened on this page. */
export function hasGoogleConsentMessage(): boolean {
  try {
    const fc = typeof window !== 'undefined' ? window.googlefc : undefined;
    return Boolean(fc?.callbackQueue && typeof fc.showRevocationMessage === 'function');
  } catch {
    return false;
  }
}

/**
 * Reopen Google's consent message. Returns false (and does nothing) when it is
 * not available, so the caller can fall back to the first-party preferences.
 * `onError` runs if the message throws once queued.
 */
export function showGoogleConsentMessage(onError?: () => void): boolean {
  if (!hasGoogleConsentMessage()) return false;
  try {
    const fc = window.googlefc!;
    fc.callbackQueue!.push(() => {
      try {
        fc.showRevocationMessage?.();
      } catch {
        onError?.();
      }
    });
    return true;
  } catch {
    return false;
  }
}
