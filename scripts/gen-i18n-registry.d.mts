// Types for the pure exports of gen-i18n-registry.mjs (imported by i18n/generated/registry.test.ts).
export const GENERATED_DIR: string;
export const EAGER_SHARDS: string[];
export const LAZY_SHARDS: string[];
export const SERVER_SHARDS: string[];
export const TRANSLATOR_SHARDS: string[];
export function codeToDir(code: string): string;
export interface RenderInput {
  codes: string[];
  defaultCode: string;
  toolPagesCodes: string[];
}
export function render(input: RenderInput): Record<string, string>;
export function collectInput(root: string, locales: { code: string }[], defaultCode: string): RenderInput;
