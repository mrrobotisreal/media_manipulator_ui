/**
 * MM108: the copilot's per-browser preferences. localStorage only (each wrapped: private windows
 * and blocked storage throw), and the panel works without it: the defaults are "show the notice"
 * and "let Medi see the preview".
 */
const PREVIEW_KEY = 'mm-medi-preview-v1';
const NOTICE_KEY = 'mm-medi-frame-notice-v1';

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // storage unavailable: the choice lasts for this page only
  }
}

/** "Let Medi see the preview" (default on). */
export const previewAllowed = (): boolean => read(PREVIEW_KEY) !== 'off';
export const setPreviewAllowed = (on: boolean): void => write(PREVIEW_KEY, on ? 'on' : 'off');

/** The one-time frames disclosure was acknowledged. */
export const noticeSeen = (): boolean => read(NOTICE_KEY) === 'seen';
export const markNoticeSeen = (): void => write(NOTICE_KEY, 'seen');
