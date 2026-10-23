import { describe, expect, it } from 'vitest';

import { accountTabHref } from './tabs';

describe('accountTabHref', () => {
  it('keeps the browser path (never /en), other params and the hash', () => {
    expect(accountTabHref({ pathname: '/account', search: '?tab=profile&x=1', hash: '#top' }, 'history')).toBe('/account?tab=history&x=1#top');
    expect(accountTabHref({ pathname: '/ru/account', search: '', hash: '' }, 'billing')).toBe('/ru/account?tab=billing');
  });
  it('overview is the bare URL', () => {
    expect(accountTabHref({ pathname: '/account', search: '?tab=profile', hash: '' }, 'overview')).toBe('/account');
  });
});
