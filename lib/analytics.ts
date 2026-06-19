import mixpanel from 'mixpanel-browser';
import { getFirebaseAnalytics } from './firebase';
import { hasAnalyticsConsent } from './consent';
import { trackFirstPartyEvent, trackFirstPartyPageView } from './firstPartyAnalytics';
import { trackGoogleEvent, trackGooglePageView } from './gtag';

// Fire-and-forget Firebase Analytics helpers. They lazily resolve the analytics
// instance (browser-only, configured-only) and dynamically import the SDK, so
// nothing Firebase-related runs during server prerender. They no-op silently
// when analytics is unavailable.
function logAnalyticsEvent(name: string, params: Record<string, unknown>) {
  void getFirebaseAnalytics()
    .then(async (analytics) => {
      if (!analytics) return;
      const { logEvent } = await import('firebase/analytics');
      logEvent(analytics, name, params);
    })
    .catch(() => {
      // Analytics must never break the app.
    });
}

function setAnalyticsUserProperties(props: Record<string, string>) {
  void getFirebaseAnalytics()
    .then(async (analytics) => {
      if (!analytics) return;
      const { setUserProperties } = await import('firebase/analytics');
      setUserProperties(analytics, props);
    })
    .catch(() => {
      // Analytics must never break the app.
    });
}

/**
 * Return a lowercase file extension safe to send to analytics.
 *
 * Never returns the full file name. Falls back to "unknown" if the
 * extension cannot be derived. Keeps cardinality low by capping length.
 */
export const getSafeFileExtension = (fileName: string): string => {
  if (!fileName) return 'unknown';
  const lastDot = fileName.lastIndexOf('.');
  if (lastDot === -1 || lastDot === fileName.length - 1) return 'unknown';
  const ext = fileName.slice(lastDot + 1).toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!ext) return 'unknown';
  return ext.slice(0, 12);
};

const sizeInMb = (size: number) => Math.round((size / 1024 / 1024) * 100) / 100;

// Track file upload events
export const trackFileUpload = (fileType: string, fileSize: number, fileName: string) => {
  const props = {
    file_type: fileType,
    media_kind: fileType,
    file_size_mb: sizeInMb(fileSize),
    file_extension: getSafeFileExtension(fileName),
    size_bytes: fileSize,
  };
  trackFirstPartyEvent('file_selected', props, { mediaKind: fileType as 'image' | 'video' | 'audio' | 'pdf' | 'unknown' });
  trackGoogleEvent('file_selected', props);
  logAnalyticsEvent('file_upload', props);
};

// Track file conversion events
export const trackFileConversion = (fromFormat: string, toFormat: string, fileSize: number) => {
  const props = {
    source_format: fromFormat,
    target_format: toFormat,
    from_format: fromFormat,
    to_format: toFormat,
    file_size_mb: sizeInMb(fileSize),
    size_bytes: fileSize,
    conversion_type: `${fromFormat}_to_${toFormat}`,
  };
  trackFirstPartyEvent('conversion_started', props);
  trackGoogleEvent('conversion_started', props);
  logAnalyticsEvent('file_conversion_start', props);
};

// Track successful conversions
export const trackConversionSuccess = (conversionType: string, processingTime?: number) => {
  const props = {
    conversion_type: conversionType,
    processing_time_seconds: processingTime || 0,
    duration_ms: Math.round((processingTime || 0) * 1000),
    success: true,
  };
  trackFirstPartyEvent('conversion_completed', props);
  trackGoogleEvent('conversion_completed', props);
  logAnalyticsEvent('file_conversion_success', props);
};

// Track conversion failures
export const trackConversionFailure = (conversionType: string, errorReason?: string) => {
  const props = {
    conversion_type: conversionType,
    error_reason: errorReason || 'unknown',
    error_message: errorReason || 'unknown',
    source: 'frontend',
    stage: 'conversion',
    success: false,
  };
  trackFirstPartyEvent('conversion_failed', props);
  trackFirstPartyEvent('error', props);
  trackGoogleEvent('conversion_failed', props);
  logAnalyticsEvent('file_conversion_failure', props);
};

// Track file downloads (no raw filename — derive only the output extension).
export const trackFileDownload = (outputFileName: string, fileType: string) => {
  const props = {
    file_type: fileType,
    media_kind: fileType,
    output_format: getSafeFileExtension(outputFileName),
    download_source: 'conversion_result',
    success: true,
  };
  trackFirstPartyEvent('download', props, { mediaKind: fileType as 'image' | 'video' | 'audio' | 'pdf' | 'unknown' });
  trackGoogleEvent('file_download', props);
  logAnalyticsEvent('file_download', props);
};

// Track file identification usage
export const trackFileIdentification = (fileType: string, identificationSuccess: boolean) => {
  const props = {
    file_type: fileType,
    media_kind: fileType,
    success: identificationSuccess,
    identification_success: identificationSuccess,
  };
  trackFirstPartyEvent('file_identified', props, { mediaKind: fileType as 'image' | 'video' | 'audio' | 'pdf' | 'unknown' });
  trackGoogleEvent('file_identified', props);
  logAnalyticsEvent('file_identification', props);
};

// Track user engagement
export const trackPageView = (pageName: string) => {
  trackFirstPartyPageView(pageName);
  trackGooglePageView(pageName);
  logAnalyticsEvent('page_view', {
    page_title: pageName,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
  });
};

/**
 * Mixpanel page-view helper, gated behind analytics consent. Called once per
 * route change from RouteAnalytics so we have a single source of truth for
 * page-view fires across firstParty + GA + Mixpanel.
 */
export const trackMixpanelPageView = (title: string, path: string) => {
  if (!hasAnalyticsConsent()) return;
  try {
    mixpanel.track('Page View', {
      page_name: title,
      page_path: path,
      user_tier: 'free',
    });
  } catch {
    // Never block the UI.
  }
};

/**
 * Safe Mixpanel event helper. Gated behind analytics consent and wrapped in a
 * try/catch so a missing or uninitialized Mixpanel SDK can never throw.
 *
 * This matters because Mixpanel is only initialized after the user grants
 * analytics consent (see providers.tsx). Calling `mixpanel.track()` before
 * init throws `Cannot read properties of undefined (reading 'before_track')`.
 * When that throw happens inside a React effect — e.g. the conversion-complete
 * handler — it propagates past the (absent) error boundary and unmounts the
 * whole app, blanking the page. Always route Mixpanel events through here.
 */
export const trackMixpanelEvent = (eventName: string, props?: Record<string, unknown>) => {
  if (!hasAnalyticsConsent()) return;
  try {
    mixpanel.track(eventName, props);
  } catch {
    // Never block the UI.
  }
};

// Track feature usage
export const trackFeatureUsage = (featureName: string, additionalData?: Record<string, string | number | boolean>) => {
  const props = {
    feature_name: featureName,
    action: additionalData?.action || 'used',
    ...additionalData,
  };
  trackFirstPartyEvent('feature_usage', props, { featureName });
  trackGoogleEvent('feature_usage', props);
  logAnalyticsEvent('feature_usage', props);
};

// Set user properties for better audience segmentation
export const setUserProperty = (propertyName: string, propertyValue: string) => {
  setAnalyticsUserProperties({ [propertyName]: propertyValue });
};

// Track user session information
export const trackUserSession = (sessionData: {
  user_type?: 'new' | 'returning';
  preferred_file_type?: string;
  conversion_count?: number;
}) => {
  Object.entries(sessionData).forEach(([key, value]) => {
    setUserProperty(key, String(value));
  });
};

// Track ad interaction events (for future ad implementation)
export const trackAdInteraction = (adType: string, adPosition: string, interaction: 'view' | 'click') => {
  const props = {
    ad_type: adType,
    ad_position: adPosition,
    interaction_type: interaction,
  };
  trackFirstPartyEvent('ad_interaction', props);
  trackGoogleEvent('ad_interaction', props);
  logAnalyticsEvent('ad_interaction', props);
};

// Track revenue events (for future monetization)
export const trackRevenue = (revenue: number, currency: string = 'USD', source: string) => {
  logAnalyticsEvent('earn_virtual_currency', {
    virtual_currency_name: currency,
    value: revenue,
    revenue_source: source,
  });
};
