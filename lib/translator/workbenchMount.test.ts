/**
 * MM53 import boundary for the panel: the workbench is reachable only through
 * `loadTranslatorWorkbench()` behind the literal role guard, and `app/providers.tsx`
 * mounts it behind the same literal (so the dynamic import folds away in production).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const ROOT = join(__dirname, '..', '..');

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('workbench mount', () => {
  it('loadTranslatorWorkbench is null in production and with an invalid locale', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
    const prod = await import('./mode');
    expect(prod.loadTranslatorWorkbench()).toBeNull();
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    vi.stubEnv('NEXT_PUBLIC_TRANSLATOR_LOCALE', 'xx-XX');
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const bad = await import('./mode');
    expect(bad.loadTranslatorWorkbench()).toBeNull();
  });

  it('the import() sits inside the literal role guard in mode.ts', () => {
    const src = readFileSync(join(ROOT, 'lib/translator/mode.ts'), 'utf8');
    const at = src.indexOf("import('@/components/translator/translator-island')");
    expect(at).toBeGreaterThan(-1);
    const before = src.slice(0, at);
    const guard = before.lastIndexOf("if (process.env.NEXT_PUBLIC_DEPLOY_ROLE === 'translator') {");
    expect(guard).toBeGreaterThan(before.lastIndexOf('export function loadTranslatorWorkbench'));
    expect([...src.matchAll(/import\('@\/components/g)]).toHaveLength(1);
  });

  it('app/providers.tsx mounts it only behind the literal role check', () => {
    const src = readFileSync(join(ROOT, 'app/providers.tsx'), 'utf8');
    expect(src).toMatch(
      /const TranslatorWorkbench =\s*process\.env\.NEXT_PUBLIC_DEPLOY_ROLE === 'translator'\s*\?\s*dynamic\(\(\) => loadTranslatorWorkbench\(\)/,
    );
    expect(src).not.toMatch(/components\/translator/);
  });
});
