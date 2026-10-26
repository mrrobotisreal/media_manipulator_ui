import { afterEach, describe, expect, it } from 'vitest';

import {
  adoptSettingCurrency,
  currentCurrency,
  noteLock,
  noteTiers,
  pickCurrency,
  readStoredCurrency,
  resetCurrencyForTests,
  resolveCurrency,
  restoreStoredCurrency,
  writeStoredCurrency,
} from './currency';

const clear = () => {
  document.cookie = 'mm-currency=; Max-Age=0; Path=/';
  window.localStorage.clear();
  resetCurrencyForTests();
};
afterEach(clear);

describe('resolveCurrency precedence: lock > setting > cookie > geo (MM69)', () => {
  it.each([
    [{ lock: 'eur', setting: 'usd', cookie: 'usd', geo: 'usd' }, 'eur', 'lock'],
    [{ setting: 'eur', cookie: 'usd', geo: 'usd' }, 'eur', 'setting'],
    [{ cookie: 'eur', geo: 'usd' }, 'eur', 'cookie'],
    [{ geo: 'eur' }, 'eur', 'geo'],
    [{}, 'usd', 'geo'],
  ] as const)('%o -> %s (%s)', (inputs, currency, source) => {
    expect(resolveCurrency(inputs)).toEqual({ currency, source });
  });
});

describe('persistence: cookie mm-currency + localStorage mirror', () => {
  it('writes a one-year, SameSite=Lax cookie and the localStorage copy; reads either', () => {
    writeStoredCurrency('eur');
    expect(document.cookie).toContain('mm-currency=eur');
    expect(window.localStorage.getItem('mm-currency')).toBe('eur');
    expect(readStoredCurrency()).toBe('eur');
    document.cookie = 'mm-currency=; Max-Age=0; Path=/';
    expect(readStoredCurrency()).toBe('eur'); // the localStorage mirror
    window.localStorage.setItem('mm-currency', 'gbp');
    expect(readStoredCurrency()).toBeNull(); // allowlisted
  });
});

describe('the page store', () => {
  it('stays USD (and unsupported) until an /api/tiers answer sells EUR', () => {
    pickCurrency('eur', false);
    expect(currentCurrency()).toMatchObject({ currency: 'usd', supported: false });
    noteTiers({ prices: { eur: {} } }, { geo: false });
    expect(currentCurrency()).toMatchObject({ currency: 'eur', source: 'cookie', supported: true });
  });

  it('geo only from the browser fetch; a cookie beats geo; a setting beats the cookie; a lock beats all', () => {
    noteTiers({ prices: { eur: {} }, defaultCurrency: 'eur' }, { geo: false });
    expect(currentCurrency().currency).toBe('usd');
    noteTiers({ prices: { eur: {} }, defaultCurrency: 'eur' }, { geo: true });
    expect(currentCurrency()).toMatchObject({ currency: 'eur', source: 'geo', locked: false });
    writeStoredCurrency('usd');
    restoreStoredCurrency();
    expect(currentCurrency()).toMatchObject({ currency: 'usd', source: 'cookie' });
    adoptSettingCurrency('eur');
    expect(currentCurrency()).toMatchObject({ currency: 'eur', source: 'setting' });
    noteLock('usd');
    expect(currentCurrency()).toMatchObject({ currency: 'usd', source: 'lock', locked: true });
    noteLock(null);
    expect(currentCurrency()).toMatchObject({ currency: 'eur', locked: false });
  });
});
