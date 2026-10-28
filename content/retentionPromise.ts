/**
 * The one retention sentence used across every tool entry (MM26). English only: non-English tool
 * copy comes from the `common.retentionPromiseShort` i18n key, never from this constant. Keep it
 * in step with that key. Interpolated with no trailing period; callers add their own.
 *
 * Lives in its own module so content/toolPages.ts and content/toolPagesCatalog.ts can both
 * import it without importing each other at evaluation time.
 */
export const RETENTION_PROMISE =
  'Files are kept 24 hours for guests; with a free account you choose 24 hours to 2 years';
