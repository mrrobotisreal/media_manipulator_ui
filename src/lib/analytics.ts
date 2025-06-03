import { logEvent, setUserProperties } from 'firebase/analytics';
import { analytics } from './firebase';

// Track file upload events
export const trackFileUpload = (fileType: string, fileSize: number, fileName: string) => {
  if (!analytics) return;

  logEvent(analytics, 'file_upload', {
    file_type: fileType,
    file_size_mb: Math.round(fileSize / 1024 / 1024 * 100) / 100,
    file_extension: fileName.split('.').pop()?.toLowerCase() || 'unknown'
  });
};

// Track file conversion events
export const trackFileConversion = (fromFormat: string, toFormat: string, fileSize: number) => {
  if (!analytics) return;

  logEvent(analytics, 'file_conversion_start', {
    from_format: fromFormat,
    to_format: toFormat,
    file_size_mb: Math.round(fileSize / 1024 / 1024 * 100) / 100,
    conversion_type: `${fromFormat}_to_${toFormat}`
  });
};

// Track successful conversions
export const trackConversionSuccess = (conversionType: string, processingTime?: number) => {
  if (!analytics) return;

  logEvent(analytics, 'file_conversion_success', {
    conversion_type: conversionType,
    processing_time_seconds: processingTime || 0
  });
};

// Track conversion failures
export const trackConversionFailure = (conversionType: string, errorReason?: string) => {
  if (!analytics) return;

  logEvent(analytics, 'file_conversion_failure', {
    conversion_type: conversionType,
    error_reason: errorReason || 'unknown'
  });
};

// Track file downloads
export const trackFileDownload = (fileName: string, fileType: string) => {
  if (!analytics) return;

  logEvent(analytics, 'file_download', {
    file_name: fileName,
    file_type: fileType,
    download_source: 'conversion_result'
  });
};

// Track file identification usage
export const trackFileIdentification = (fileType: string, identificationSuccess: boolean) => {
  if (!analytics) return;

  logEvent(analytics, 'file_identification', {
    file_type: fileType,
    identification_success: identificationSuccess
  });
};

// Track user engagement
export const trackPageView = (pageName: string) => {
  if (!analytics) return;

  logEvent(analytics, 'page_view', {
    page_title: pageName,
    page_location: window.location.href
  });
};

// Track feature usage
export const trackFeatureUsage = (featureName: string, additionalData?: Record<string, string | number | boolean>) => {
  if (!analytics) return;

  logEvent(analytics, 'feature_usage', {
    feature_name: featureName,
    ...additionalData
  });
};

// Set user properties for better audience segmentation
export const setUserProperty = (propertyName: string, propertyValue: string) => {
  if (!analytics) return;

  setUserProperties(analytics, {
    [propertyName]: propertyValue
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
  if (!analytics) return;

  logEvent(analytics, 'ad_interaction', {
    ad_type: adType,
    ad_position: adPosition,
    interaction_type: interaction
  });
};

// Track revenue events (for future monetization)
export const trackRevenue = (revenue: number, currency: string = 'USD', source: string) => {
  if (!analytics) return;

  logEvent(analytics, 'earn_virtual_currency', {
    virtual_currency_name: currency,
    value: revenue,
    revenue_source: source
  });
};