import { afterEach, describe, expect, it, vi } from 'vitest';

import { translatorLocales } from '@/i18n/locales';
import {
  isIrreversibleActionHidden,
  isTranslatorArmed,
  isTranslatorEnv,
  resetTranslatorModeWarningsForTests,
  translatorLocale,
} from './mode';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  resetTranslatorModeWarningsForTests();
});

describe('translator mode flags', () => {
  it('is off by default (production never sets the role)', () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
    expect(isTranslatorEnv()).toBe(false);
    expect(isTranslatorArmed()).toBe(false);
    expect(translatorLocale()).toBeNull();
    expect(isIrreversibleActionHidden()).toBe(false);
  });

  it('only the exact value `translator` turns it on', () => {
    for (const v of ['Translator', 'translator ', 'production', 'true', '1']) {
      vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', v);
      expect(isTranslatorEnv()).toBe(false);
    }
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    expect(isTranslatorEnv()).toBe(true);
    expect(isIrreversibleActionHidden()).toBe(true);
  });

  it.each(translatorLocales.map((l) => [l.code]))('arms for translator locale %s (any case)', (code) => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    vi.stubEnv('NEXT_PUBLIC_TRANSLATOR_LOCALE', code.toLowerCase());
    expect(translatorLocale()).toBe(code);
    expect(isTranslatorArmed()).toBe(true);
  });

  it.each([['en-US'], ['de'], ['xx-XX'], ['']])(
    'refuses to arm for %j, logs once, keeps hardening on',
    (value) => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
      vi.stubEnv('NEXT_PUBLIC_TRANSLATOR_LOCALE', value);
      expect(isTranslatorArmed()).toBe(false);
      expect(translatorLocale()).toBeNull();
      expect(isTranslatorEnv()).toBe(true);
      expect(isIrreversibleActionHidden()).toBe(true);
      expect(warn).toHaveBeenCalledTimes(1);
    },
  );
});
