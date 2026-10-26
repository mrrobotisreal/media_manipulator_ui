/**
 * MM49 decision 4 / acceptance 5: the Motion editor never sends analytics
 * without consent. The editor reads only the visitor's STORED decision
 * (`mm-consent-v2`); no decision, a denial, or a translator deployment sends
 * nothing and never touches the SDK queue or the visitor-id header.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const sdk = vi.hoisted(() => ({ track: vi.fn(), start: vi.fn(() => () => undefined), setContext: vi.fn() }));
vi.mock('@/lib/analytics', async (orig) => {
  const real = await orig<typeof import('@/lib/analytics')>();
  return { ...real, analytics: { track: sdk.track, start: sdk.start, setContext: sdk.setContext } };
});

import { EVENTS } from '@/lib/analytics/events';
import { CONSENT_STORAGE_KEY, POLICY_VERSION, BANNER_VERSION, resetConsentStateForTests } from '@/lib/consent/state';
import {
  addedKeyframeProperties,
  exportProps,
  keyframePropertyProp,
  layerCount,
  resetVectorAnalyticsForTests,
  startVectorAnalytics,
  vectorAnalyticsAllowed,
  vectorCountHeaders,
  vectorTracker,
} from './analytics';
import { parseVectorDoc, type VectorDoc } from './vectorTypes';

const store = (analytics: 'granted' | 'denied') =>
  window.localStorage.setItem(
    CONSENT_STORAGE_KEY,
    JSON.stringify({ v: 2, policyVersion: POLICY_VERSION, bannerVersion: BANNER_VERSION, regionGroup: 'gdpr', analytics, advertising: 'denied', gpc: false, decidedAt: '2026-10-26T00:00:00Z' }),
  );

beforeEach(() => {
  window.localStorage.clear();
  resetConsentStateForTests();
  resetVectorAnalyticsForTests();
  sdk.track.mockClear();
  sdk.start.mockClear();
});
afterEach(() => {
  vi.unstubAllEnvs();
});

const fire = () => vectorTracker.track(EVENTS.VECTOR_EDITOR_OPENED, { source: 'new' });

describe('Motion analytics consent gate', () => {
  it('no stored decision: nothing is started, sent or attached (no region default, no buffering)', () => {
    expect(startVectorAnalytics()).toBe(false);
    fire();
    expect(sdk.start).not.toHaveBeenCalled();
    expect(sdk.track).not.toHaveBeenCalled();
    expect(vectorCountHeaders()).toEqual({});
    // The editor never writes a consent record of its own.
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
  });

  it('a stored denial: nothing is sent', () => {
    store('denied');
    expect(startVectorAnalytics()).toBe(false);
    fire();
    expect(sdk.track).not.toHaveBeenCalled();
    expect(vectorCountHeaders()).toEqual({});
  });

  it('a stored grant: the client starts and vector_* events are sent with the motion context', () => {
    store('granted');
    expect(startVectorAnalytics()).toBe(true);
    expect(sdk.start).toHaveBeenCalledTimes(1);
    fire();
    expect(sdk.track).toHaveBeenCalledWith('vector_editor_opened', { source: 'new' }, { tool_slug: 'motion', feature: 'vector' });
    expect(Object.keys(vectorCountHeaders())).toEqual(['X-MM-Visitor-ID']);
    // Idempotent.
    startVectorAnalytics();
    expect(sdk.start).toHaveBeenCalledTimes(1);
  });

  it('translator deployments send nothing even with a stored grant (MM52)', () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    store('granted');
    expect(startVectorAnalytics()).toBe(false);
    expect(vectorAnalyticsAllowed()).toBe(false);
    fire();
    expect(sdk.start).not.toHaveBeenCalled();
    expect(sdk.track).not.toHaveBeenCalled();
    expect(vectorCountHeaders()).toEqual({});
  });
});

const docOf = (input: unknown): VectorDoc => {
  const r = parseVectorDoc(input);
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};

describe('Motion analytics props', () => {
  it('export props are buckets, never raw numbers', () => {
    const p = exportProps({ format: 'mp4', runtime: undefined, durationMs: 60000, height: 2160, fps: 60, bytes: 5 * 1024 * 1024, ms: 4200 });
    expect(p).toEqual({ format: 'mp4', duration_ms: '30-60s', height: '<=2160', fps: '<=60', bytes: '1-10mb', ms: '1-5s' });
  });

  it('gradient stop indices fold into one property', () => {
    expect(keyframePropertyProp('gradientStop[12].color')).toBe('gradientStop.color');
    expect(keyframePropertyProp('transform.x')).toBe('transform.x');
  });

  it('counts nested and mask layers; finds the properties whose keyframes grew', () => {
    const a = docOf({
      version: 1,
      layers: [{ type: 'group', id: 'g', children: [{ type: 'rect', id: 'r', x: 0, y: 0, width: 1, height: 1 }] }],
      animations: [{ layerId: 'r', property: 'opacity', keyframes: [{ t: 0, value: 1, easing: 'linear' }] }],
    });
    expect(layerCount(a)).toBe(2);
    const b = docOf({
      ...JSON.parse(JSON.stringify(a)),
      animations: [
        { layerId: 'r', property: 'opacity', keyframes: [{ t: 0, value: 1, easing: 'linear' }, { t: 500, value: 0, easing: 'linear' }] },
        { layerId: 'r', property: 'transform.x', keyframes: [{ t: 0, value: 0, easing: 'linear' }] },
      ],
    });
    expect(addedKeyframeProperties(a, b)).toEqual(['opacity', 'transform.x']);
    expect(addedKeyframeProperties(b, a)).toEqual([]);
  });
});
