export const ACCOUNT_TABS = ['overview', 'history', 'projects', 'voices', 'billing', 'privacy', 'profile'] as const;
export type AccountTab = (typeof ACCOUNT_TABS)[number];

/** `?tab=` value to a tab; anything unknown (or missing) is the overview. */
export function parseAccountTab(value: string | null | undefined): AccountTab {
  return (ACCOUNT_TABS as readonly string[]).includes(value ?? '') ? (value as AccountTab) : 'overview';
}

/**
 * The browser URL for `next` on the current page: same path as the address bar
 * (never the internal /en rewrite), other query params kept, `tab` set or
 * removed (overview is the bare URL), hash kept.
 */
export function accountTabHref(loc: { pathname: string; search: string; hash: string }, next: AccountTab): string {
  const params = new URLSearchParams(loc.search);
  if (next === 'overview') params.delete('tab');
  else params.set('tab', next);
  const query = params.toString();
  return `${loc.pathname}${query ? `?${query}` : ''}${loc.hash}`;
}
