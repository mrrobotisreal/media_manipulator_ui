import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { applyConsent, getConsentDetails, resetConsentStateForTests } from '@/lib/consent/state';
import { toConsentModeUpdate } from '@/lib/consent/consentModeBridge';
import type { AnalyticsClient } from './client';
import { EVENTS, type EventName } from './events';
import type { QueuedEvent } from './queue';
import { GA4_SCRIPT_ID, initGA4Bridge } from './ga4';

type Listener = (name: EventName, event: QueuedEvent) => void;

function fakeClient() {
  let listener: Listener | null = null;
  const client = {
    subscribe(l: Listener) {
      listener = l;
      return () => {
        listener = null;
      };
    },
  } as unknown as AnalyticsClient;
  const emit = (name: EventName) => listener?.(name, { properties: {} } as QueuedEvent);
  return { client, emit };
}

function setAnalytics(value: 'granted' | 'denied' | 'unset') {
  applyConsent({ ...getConsentDetails(), analytics: value }, false);
}

const gtagScript = () => document.getElementById(GA4_SCRIPT_ID);
const gtagCalls = () =>
  ((window as unknown as { dataLayer: unknown[] }).dataLayer || []).map((a) =>
    Array.from(a as ArrayLike<unknown>),
  );

describe('GA4 consent gating', () => {
  beforeEach(() => {
    resetConsentStateForTests();
    document.head.innerHTML = '';
    // What the inline layout bootstrap does: stub + denied defaults, no network.
    const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void };
    w.dataLayer = [];
    w.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer.push(arguments);
    };
    w.gtag('consent', 'default', { analytics_storage: 'denied' });
  });

  afterEach(() => {
    delete (window as unknown as Record<string, unknown>).gtag;
    delete (window as unknown as Record<string, unknown>).dataLayer;
  });

  it('loads no gtag script and sends nothing to Google before consent', () => {
    const { client, emit } = fakeClient();
    initGA4Bridge(client);
    emit(EVENTS.PAGE_VIEW);
    expect(gtagScript()).toBeNull();
    expect(document.querySelector('script[src*="googletagmanager"]')).toBeNull();
    expect(gtagCalls().filter((c) => c[0] === 'event')).toHaveLength(0);
  });

  it('does not load when consent is explicitly denied', () => {
    setAnalytics('denied');
    const { client, emit } = fakeClient();
    initGA4Bridge(client);
    emit(EVENTS.PAGE_VIEW);
    expect(gtagScript()).toBeNull();
  });

  it('loads the script when consent is granted later, without replaying earlier events', () => {
    const { client, emit } = fakeClient();
    initGA4Bridge(client);
    emit(EVENTS.PAGE_VIEW); // before consent
    setAnalytics('granted');

    const el = gtagScript() as HTMLScriptElement;
    expect(el).not.toBeNull();
    expect(el.src).toContain('googletagmanager.com/gtag/js');
    expect(gtagCalls().filter((c) => c[0] === 'event')).toHaveLength(0);

    emit(EVENTS.PAGE_VIEW);
    expect(gtagCalls().filter((c) => c[0] === 'event')).toHaveLength(1);
    // never loads twice
    setAnalytics('denied');
    setAnalytics('granted');
    expect(document.querySelectorAll(`#${GA4_SCRIPT_ID}`)).toHaveLength(1);
  });

  it('loads at init when consent is already granted', () => {
    setAnalytics('granted');
    initGA4Bridge(fakeClient().client);
    expect(gtagScript()).not.toBeNull();
  });

  it('makes no gtag event calls after withdrawal and sets Consent Mode to denied', () => {
    const { client, emit } = fakeClient();
    initGA4Bridge(client);
    setAnalytics('granted');
    emit(EVENTS.PAGE_VIEW);
    const before = gtagCalls().filter((c) => c[0] === 'event').length;

    setAnalytics('denied');
    const last = gtagCalls().filter((c) => c[0] === 'consent').pop()!;
    expect(last[1]).toBe('update');
    expect(last[2]).toMatchObject({ analytics_storage: 'denied' });

    emit(EVENTS.PAGE_VIEW);
    emit(EVENTS.JOB_COMPLETED);
    expect(gtagCalls().filter((c) => c[0] === 'event')).toHaveLength(before);
  });

  it('maps unset to denied in Consent Mode', () => {
    expect(toConsentModeUpdate(getConsentDetails()).analytics_storage).toBe('denied');
  });
});

vi.mock('@/lib/consent', async () => {
  const state = await import('@/lib/consent/state');
  return { getConsentDetails: state.getConsentDetails, onConsentDetailsChange: state.onConsentDetailsChange };
});
