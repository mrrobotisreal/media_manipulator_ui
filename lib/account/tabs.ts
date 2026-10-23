export const ACCOUNT_TABS = ['overview', 'history', 'projects', 'billing', 'privacy', 'profile'] as const;
export type AccountTab = (typeof ACCOUNT_TABS)[number];

/** `?tab=` value to a tab; anything unknown (or missing) is the overview. */
export function parseAccountTab(value: string | null | undefined): AccountTab {
  return (ACCOUNT_TABS as readonly string[]).includes(value ?? '') ? (value as AccountTab) : 'overview';
}
