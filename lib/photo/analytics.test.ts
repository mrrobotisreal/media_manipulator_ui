/**
 * MM101 decision 3/4: the Aperture editor never sends analytics without consent (it
 * reads only the STORED decision), tool_slug resolves from ?slug then the referrer,
 * and every prop is an enum or a bucket.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const sdk = vi.hoisted(() => ({ track: vi.fn(), start: vi.fn(() => () => undefined), setContext: vi.fn() }));
vi.mock('@/lib/analytics', async (orig) => {
  const real = await orig<typeof import('@/lib/analytics')>();
  return { ...real, analytics: { track: sdk.track, start: sdk.start, setContext: sdk.setContext } };
});

import { EVENTS } from '@/lib/analytics/events';
import { photoMegapixelBucket } from '@/lib/analytics/buckets';
import { CONSENT_STORAGE_KEY, POLICY_VERSION, BANNER_VERSION, resetConsentStateForTests } from '@/lib/consent/state';
import { newPhotoDoc } from '@/lib/photo/photoTypes';
import {
  failReason,
  maskKindOf,
  photoAnalyticsAllowed,
  photoCountHeaders,
  photoTracker,
  resetPhotoAnalyticsForTests,
  resolvePhotoToolSlug,
  savedProps,
  setPhotoToolSlug,
  sourceFormatOf,
  startPhotoAnalytics,
  exportStartedProps,
} from './analytics';

const store = (analytics: 'granted' | 'denied') =>
  window.localStorage.setItem(
    CONSENT_STORAGE_KEY,
    JSON.stringify({ v: 2, policyVersion: POLICY_VERSION, bannerVersion: BANNER_VERSION, regionGroup: 'gdpr', analytics, advertising: 'denied', gpc: false, decidedAt: '2026-11-03T00:00:00Z' }),
  );

beforeEach(() => {
  window.localStorage.clear();
  resetConsentStateForTests();
  resetPhotoAnalyticsForTests();
  sdk.track.mockClear();
  sdk.start.mockClear();
  sdk.setContext.mockClear();
});
afterEach(() => vi.unstubAllEnvs());

const fire = () => photoTracker.track(EVENTS.PHOTO_EDITOR_OPENED, { source: 'upload', local_decode: true });

describe('Aperture analytics consent gate (as Motion)', () => {
  it('no stored decision: nothing is started, sent or attached, and no consent record is written', () => {
    expect(startPhotoAnalytics()).toBe(false);
    fire();
    expect(sdk.start).not.toHaveBeenCalled();
    expect(sdk.track).not.toHaveBeenCalled();
    expect(photoCountHeaders()).toEqual({});
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
  });
  it('a stored denial: nothing is sent', () => {
    store('denied');
    expect(startPhotoAnalytics()).toBe(false);
    fire();
    expect(sdk.track).not.toHaveBeenCalled();
    expect(photoCountHeaders()).toEqual({});
  });
  it('a stored grant: the client starts once and photo_* carries feature photo and the tool_slug', () => {
    store('granted');
    expect(startPhotoAnalytics()).toBe(true);
    startPhotoAnalytics();
    expect(sdk.start).toHaveBeenCalledTimes(1);
    setPhotoToolSlug('color-pop');
    fire();
    expect(sdk.track).toHaveBeenCalledWith('photo_editor_opened', { source: 'upload', local_decode: true }, { tool_slug: 'color-pop', feature: 'photo' });
    expect(Object.keys(photoCountHeaders())).toEqual(['X-MM-Visitor-ID']);
  });
  it('translator deployments send nothing even with a stored grant (MM52)', () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    store('granted');
    expect(startPhotoAnalytics()).toBe(false);
    expect(photoAnalyticsAllowed()).toBe(false);
    fire();
    expect(sdk.start).not.toHaveBeenCalled();
    expect(sdk.track).not.toHaveBeenCalled();
    expect(photoCountHeaders()).toEqual({});
  });
});

describe('tool_slug resolution', () => {
  it('?slug from the tool page wins when it is an Aperture page', () => {
    expect(resolvePhotoToolSlug({ slug: 'color-pop', referrer: 'https://media-manipulator.com/tools/grayscale-image', selfHost: 'media-manipulator.com' })).toBe('color-pop');
    expect(resolvePhotoToolSlug({ slug: 'aperture' })).toBe('aperture');
  });
  it('an unknown or malformed slug is ignored (no free text reaches the event)', () => {
    expect(resolvePhotoToolSlug({ slug: 'drop table' })).toBe('aperture');
    expect(resolvePhotoToolSlug({ slug: 'not-a-page' })).toBe('aperture');
    expect(resolvePhotoToolSlug({ slug: '../x' })).toBe('aperture');
  });
  it('falls back to the same-site /tools/<slug> referrer (localized or not), else aperture', () => {
    const self = 'media-manipulator.com';
    expect(resolvePhotoToolSlug({ referrer: 'https://media-manipulator.com/tools/grayscale-image', selfHost: self })).toBe('grayscale-image');
    expect(resolvePhotoToolSlug({ referrer: 'https://media-manipulator.com/de/tools/sharpen-image/', selfHost: self })).toBe('sharpen-image');
    expect(resolvePhotoToolSlug({ referrer: 'https://evil.example/tools/grayscale-image', selfHost: self })).toBe('aperture');
    expect(resolvePhotoToolSlug({ referrer: 'https://media-manipulator.com/blog/post', selfHost: self })).toBe('aperture');
    expect(resolvePhotoToolSlug({ referrer: '', slug: null })).toBe('aperture');
    expect(resolvePhotoToolSlug({ referrer: 'not a url' })).toBe('aperture');
  });
});

describe('props are enums and buckets', () => {
  it('megapixel buckets are upper-inclusive', () => {
    expect([1, 2, 2.1, 8, 12, 16, 24, 32, 33, 120].map(photoMegapixelBucket)).toEqual(['<=2', '<=2', '<=8', '<=8', '<=16', '<=16', '<=32', '<=32', '>32', '>32']);
  });
  it('saved and export props carry buckets only', () => {
    const doc = newPhotoDoc(4000, 3000);
    expect(savedProps(doc)).toEqual({ layers: '0', masks: '0', heals: '0', doc_bytes_bucket: '<10kb' });
    expect(exportStartedProps({ format: 'jpg', megapixels: 12, doc, batchSize: 3 })).toEqual({ format: 'jpg', megapixels_bucket: '<=16', layers: '0', masks: '0', batch_size: '2-5' });
    expect(exportStartedProps({ format: 'png', megapixels: 3, doc })).toMatchObject({ batch_size: '1', megapixels_bucket: '<=8' });
  });
  it('source format is the extension class, never the name', () => {
    expect(['IMG_1.JPG', 'a.jpeg', 'x.heic', 'p.TIF', 'weird.xyz', 'noext'].map(sourceFormatOf)).toEqual(['jpg', 'jpg', 'heic', 'tiff', 'other', 'other']);
  });
  it('failure reasons map into the catalog vocabulary', () => {
    expect(failReason('QuotaExceededError')).toBe('quota');
    expect(failReason('429')).toBe('limit');
    expect(failReason('photo_batch_limit')).toBe('limit');
    expect(failReason('403')).toBe('locked');
    expect(failReason('heal_timeout')).toBe('timeout');
    expect(failReason('photo_too_many_pixels')).toBe('too_large');
    expect(failReason('network')).toBe('unavailable');
    expect(failReason('photo_disabled')).toBe('unavailable');
    expect(failReason('AbortError')).toBe('cancelled');
    expect(failReason('something odd')).toBe('error');
    expect(failReason(undefined)).toBe('error');
  });
  it('the mask seam kinds map (local -> brush) and unknown kinds are dropped', () => {
    expect(['gradient', 'local', 'subject', 'bogus'].map(maskKindOf)).toEqual(['gradient', 'brush', 'subject', null]);
  });
});
