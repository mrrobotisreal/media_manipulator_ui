import { afterEach, describe, expect, it } from 'vitest';
import {
  NEW_ACCOUNT_WINDOW_MS,
  isAccountPath,
  isNewAccount,
  markOnboardingDone,
  onboardingKey,
  readOnboardingDone,
  resetOnboardingForTests,
  shouldAutoShowTour,
  type TourContext,
} from './state';

const NOW = Date.parse('2026-10-24T12:00:00Z');
const fresh = new Date(NOW - 60_000).toUTCString();
const base: TourContext = {
  signedIn: true,
  uid: 'u1',
  creationTime: fresh,
  pathname: '/tools',
  busy: false,
  authOpen: false,
  now: NOW,
};

afterEach(() => {
  window.localStorage.clear();
  resetOnboardingForTests();
});

describe('onboarding persistence', () => {
  it('is per uid and survives in localStorage', () => {
    expect(readOnboardingDone('u1')).toBe(false);
    markOnboardingDone('u1', NOW);
    expect(window.localStorage.getItem(onboardingKey('u1'))).toBe(new Date(NOW).toISOString());
    expect(readOnboardingDone('u1')).toBe(true);
    expect(readOnboardingDone('u2')).toBe(false);
  });

  it('still dedupes in memory when storage throws', () => {
    const proto = Object.getPrototypeOf(window.localStorage) as Storage;
    const set = proto.setItem;
    const get = proto.getItem;
    proto.setItem = () => {
      throw new Error('blocked');
    };
    proto.getItem = () => {
      throw new Error('blocked');
    };
    try {
      markOnboardingDone('u3');
      expect(readOnboardingDone('u3')).toBe(true);
      expect(readOnboardingDone('u4')).toBe(false);
    } finally {
      proto.setItem = set;
      proto.getItem = get;
    }
  });
});

describe('isNewAccount / isAccountPath', () => {
  it('treats only recently created accounts as new', () => {
    expect(isNewAccount(fresh, NOW)).toBe(true);
    expect(isNewAccount(new Date(NOW - NEW_ACCOUNT_WINDOW_MS - 1000).toUTCString(), NOW)).toBe(false);
    expect(isNewAccount(undefined, NOW)).toBe(false);
    expect(isNewAccount('garbage', NOW)).toBe(false);
  });
  it('recognises /account under every locale prefix', () => {
    for (const p of ['/account', '/ru/account', '/he/account/', '/de/account/x']) expect(isAccountPath(p)).toBe(true);
    for (const p of ['/', '/accounts', '/ru', '/tools/account', null]) expect(isAccountPath(p)).toBe(false);
  });
});

describe('shouldAutoShowTour', () => {
  it('shows for a fresh signed-in account that has not finished', () => {
    expect(shouldAutoShowTour(base)).toBe(true);
  });
  it('never for guests', () => {
    expect(shouldAutoShowTour({ ...base, signedIn: false, uid: null })).toBe(false);
  });
  it('shows once: not after completion', () => {
    markOnboardingDone('u1', NOW);
    expect(shouldAutoShowTour(base)).toBe(false);
  });
  it('not on /account, not over a job, not over the auth panel, not for old accounts', () => {
    expect(shouldAutoShowTour({ ...base, pathname: '/ru/account' })).toBe(false);
    expect(shouldAutoShowTour({ ...base, busy: true })).toBe(false);
    expect(shouldAutoShowTour({ ...base, authOpen: true })).toBe(false);
    expect(shouldAutoShowTour({ ...base, creationTime: new Date(NOW - 30 * 86_400_000).toUTCString() })).toBe(false);
  });
});
