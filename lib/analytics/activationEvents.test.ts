import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const track = vi.hoisted(() => vi.fn());
vi.mock('./client', () => ({ analytics: { track } }));

import { activationEvents, resetActivationForTests, setActivationIdentity } from './activationEvents';
import { daysSinceLastBucket, hoursSinceSignupBucket } from './buckets';
import { resetContext, setContext } from './context';
import { EVENTS } from './events';
import { getSessionId, onSessionStart, resetSessionCacheForTests, SESSION_IDLE_MS } from './session';

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

beforeEach(() => {
  window.localStorage.clear();
  resetActivationForTests();
  resetContext();
  track.mockReset();
});

describe('activation_first_job_completed', () => {
  it('fires once per guest browser, with context from the analytics context', () => {
    setContext({ tool_slug: 'compress-video', media_kind: 'video' });
    activationEvents.jobCompleted();
    activationEvents.jobCompleted();
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith(EVENTS.ACTIVATION_FIRST_JOB_COMPLETED, {
      tool_slug: 'compress-video',
      media_kind: 'video',
      hours_since_signup: null,
      guest: true,
    });
  });

  it('a guest who signs up is counted once more as a person, with a signup-age bucket', () => {
    const now = Date.UTC(2026, 9, 24, 12);
    activationEvents.jobCompleted(now);
    setActivationIdentity({ uid: 'fb1', createdAtMs: now - 3 * HOUR });
    activationEvents.jobCompleted(now);
    activationEvents.jobCompleted(now);
    expect(track).toHaveBeenCalledTimes(2);
    expect(track.mock.calls[1][1]).toMatchObject({ guest: false, hours_since_signup: '1-24h', media_kind: 'unknown', tool_slug: null });
  });

  it('dedupes in memory when localStorage throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    activationEvents.jobCompleted();
    activationEvents.jobCompleted();
    expect(track).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});

describe('activation buckets', () => {
  it('hoursSinceSignupBucket boundaries', () => {
    expect(hoursSinceSignupBucket(-5)).toBe('<1h');
    expect(hoursSinceSignupBucket(HOUR - 1)).toBe('<1h');
    expect(hoursSinceSignupBucket(HOUR)).toBe('1-24h');
    expect(hoursSinceSignupBucket(DAY)).toBe('1-7d');
    expect(hoursSinceSignupBucket(7 * DAY)).toBe('7d+');
  });
  it('daysSinceLastBucket boundaries', () => {
    expect(daysSinceLastBucket(DAY - 1)).toBe('0');
    expect(daysSinceLastBucket(DAY)).toBe('1');
    expect(daysSinceLastBucket(3 * DAY)).toBe('2_3');
    expect(daysSinceLastBucket(7 * DAY)).toBe('4_7');
    expect(daysSinceLastBucket(30 * DAY)).toBe('8_30');
    expect(daysSinceLastBucket(31 * DAY)).toBe('31_plus');
  });
});

describe('session rotation carries the previous session (return_visit input)', () => {
  afterEach(() => {
    vi.useRealTimers();
    resetSessionCacheForTests();
  });

  it('the first session has no predecessor; an idle rotation reports the last activity', async () => {
    vi.useFakeTimers();
    const t0 = Date.UTC(2026, 9, 20, 9);
    vi.setSystemTime(t0);
    const seen: Array<{ lastActivityAt: number } | undefined> = [];
    const listen = () => onSessionStart((_s, previous) => seen.push(previous));

    resetSessionCacheForTests();
    listen();
    getSessionId();
    await Promise.resolve();
    // A later page load: in-memory cache gone (reset also drops listeners), storage kept.
    vi.setSystemTime(t0 + SESSION_IDLE_MS + 2 * DAY);
    resetSessionCacheForTests();
    listen();
    getSessionId();
    await Promise.resolve();

    expect(seen).toHaveLength(2);
    expect(seen[0]).toBeUndefined();
    expect(seen[1]?.lastActivityAt).toBe(t0);
    expect(daysSinceLastBucket(t0 + SESSION_IDLE_MS + 2 * DAY - seen[1]!.lastActivityAt)).toBe('2_3');
  });
});
