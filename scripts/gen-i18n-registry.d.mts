// Types for the pure exports of gen-i18n-registry.mjs (imported by i18n/generated/registry.test.ts).
export const GENERATED_DIR: string;
export const EAGER_SHARDS: string[];
export const LAZY_SHARDS: string[];
export const SERVER_SHARDS: string[];
export function codeToDir(code: string): string;
export function render(input: { codes: string[]; toolPagesCodes: string[] }): Record<string, string>;
export function collectInput(root: string, locales: { code: string }[]): { codes: string[]; toolPagesCodes: string[] };
