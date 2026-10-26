// Types for scripts/check-i18n-pr-paths.mjs (imported by scripts/check-i18n-pr-paths.test.ts).
export interface I18nPrPathsResult {
  ok: boolean;
  localeDir: string | null;
  offending: string[];
  reason: string | null;
}
export function checkI18nPrPaths(files: string[], localeDirs: string[]): I18nPrPathsResult;
export function escapeWorkflowData(s: string): string;
