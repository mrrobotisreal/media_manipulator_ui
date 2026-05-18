import { logEvent, setUserProperties } from 'firebase/analytics';
import { analytics } from './firebase';
import { trackFirstPartyEvent, trackFirstPartyPageView } from './firstPartyAnalytics';
import { trackGoogleEvent, trackGooglePageView } from './gtag';

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
  trackFirstPartyEvent('file_selected', props, { mediaKind: fileType as 'image' | 'video' | 'audio' | 'unknown' });
  trackGoogleEvent('file_selected', props);
  if (!analytics) return;
  logEvent(analytics, 'file_upload', props);
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
  if (!analytics) return;
  logEvent(analytics, 'file_conversion_start', props);
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
  if (!analytics) return;
  logEvent(analytics, 'file_conversion_success', props);
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
  if (!analytics) return;
  logEvent(analytics, 'file_conversion_failure', props);
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
  trackFirstPartyEvent('download', props, { mediaKind: fileType as 'image' | 'video' | 'audio' | 'unknown' });
  trackGoogleEvent('file_download', props);
  if (!analytics) return;
  logEvent(analytics, 'file_download', props);
};

// Track file identification usage
export const trackFileIdentification = (fileType: string, identificationSuccess: boolean) => {
  const props = {
    file_type: fileType,
    media_kind: fileType,
    success: identificationSuccess,
    identification_success: identificationSuccess,
  };
  trackFirstPartyEvent('file_identified', props, { mediaKind: fileType as 'image' | 'video' | 'audio' | 'unknown' });
  trackGoogleEvent('file_identified', props);
  if (!analytics) return;
  logEvent(analytics, 'file_identification', props);
};

// Track user engagement
export const trackPageView = (pageName: string) => {
  trackFirstPartyPageView(pageName);
  trackGooglePageView(pageName);
  if (!analytics) return;
  logEvent(analytics, 'page_view', {
    page_title: pageName,
    page_location: window.location.href,
  });
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
  if (!analytics) return;
  logEvent(analytics, 'feature_usage', props);
};

// Set user properties for better audience segmentation
export const setUserProperty = (propertyName: string, propertyValue: string) => {
  if (!analytics) return;
  setUserProperties(analytics, {
    [propertyName]: propertyValue,
  });
};

// Track user session information
export const trackUserSession = (sessionData: {
  user_type?: 'new' | 'returning';
  preferred_file_type?: string;
  conversion_count?: number;
}) => {
  if (!analytics) return;
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
  if (!analytics) return;
  logEvent(analytics, 'ad_interaction', props);
};

// Track revenue events (for future monetization)
export const trackRevenue = (revenue: number, currency: string = 'USD', source: string) => {
  if (!analytics) return;
  logEvent(analytics, 'earn_virtual_currency', {
    virtual_currency_name: currency,
    value: revenue,
    revenue_source: source,
  });
};
