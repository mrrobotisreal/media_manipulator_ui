import { getSessionIdSync, getUserIdSync, initializeIndexedIdentity } from '@/lib/indexedIdentity';

type EventProperties = Record<string, string | number | boolean | null | undefined | Record<string, unknown> | unknown[]>;

interface TrackOptions {
  mediaKind?: 'image' | 'video' | 'audio' | 'pdf' | 'unknown';
  featureName?: string;
  conversionJobId?: string;
}

const analyticsBaseURL = () => (import.meta.env.VITE_ANALYTICS_BASE_URL || 'https://analytics.media-manipulator.com').replace(/\/$/, '');

const uuid = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const getVisitorId = () => {
  void initializeIndexedIdentity().catch(() => undefined);
  return getUserIdSync();
};

export const getSessionId = () => {
  void initializeIndexedIdentity().catch(() => undefined);
  return getSessionIdSync();
};

const referringDomain = () => {
  try {
    return document.referrer ? new URL(document.referrer).hostname : '';
  } catch {
    return '';
  }
};

const deviceType = () => {
  if (window.innerWidth < 768) return 'mobile';
  if (window.innerWidth < 1024) return 'tablet';
  return 'desktop';
};

const getUTM = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_term: params.get('utm_term') || undefined,
    utm_content: params.get('utm_content') || undefined,
  };
};

export const trackFirstPartyEvent = (eventName: string, properties: EventProperties = {}, options: TrackOptions = {}) => {
  if (typeof window === 'undefined') return;

  const event = {
    insert_id: uuid(),
    event_name: eventName,
    visitor_id: getVisitorId(),
    user_id: getVisitorId(),
    session_id: getSessionId(),
    event_ts: new Date().toISOString(),
    sent_at: new Date().toISOString(),
    current_url: window.location.href,
    host: window.location.host,
    pathname: window.location.pathname,
    referrer: document.referrer || '',
    referring_domain: referringDomain(),
    browser_language: navigator.language,
    screen_width: window.screen?.width,
    screen_height: window.screen?.height,
    device_type: deviceType(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    user_agent: navigator.userAgent,
    media_kind: options.mediaKind,
    feature_name: options.featureName,
    conversion_job_id: options.conversionJobId,
    properties: {
      ...getUTM(),
      ...properties,
    },
  };

  const body = JSON.stringify({ events: [event] });

  void fetch(`${analyticsBaseURL()}/capture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    credentials: 'omit',
    keepalive: true,
  }).catch(() => {
    // Analytics must never interrupt the editing flow.
  });
};

export const trackFirstPartyPageView = (pageTitle: string) => {
  trackFirstPartyEvent('page_view', { page_title: pageTitle });
};

export const trackFirstPartyError = (stage: string, error: unknown, properties: EventProperties = {}, options: TrackOptions = {}) => {
  trackFirstPartyEvent('error', {
    source: 'frontend',
    stage,
    error_type: error instanceof Error ? error.name : typeof error,
    error_message: error instanceof Error ? error.message : String(error),
    ...properties,
  }, options);
};
