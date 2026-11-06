import { describe, expect, it } from 'vitest';
import { validateDevEvent } from './devValidation';

// MM119: the strict dev schemas accept the new Darkroom output vocabulary (WebM, .opus,
// VP9, Opus, Vorbis), the embedded captions mode and the subs_embedded locked option, and
// still reject values outside the table.
const ctx = { page_type: 'tool' };
const check = (name: string, properties: Record<string, unknown>) => validateDevEvent(name, { properties, context: ctx } as never, ctx as never);

describe('studio export events (MM119 vocabulary)', () => {
  const webm = {
    preset: 'high', format: 'webm_vp9_opus', container: 'webm', videoCodec: 'vp9', audioCodec: 'opus',
    audioBitrate: 96, audioChannels: 2, mode: 'advanced', resolution: '1080p', captionsMode: 'embedded', host: 'mm',
  };
  it('accepts WebM VP9 + Opus with an embedded caption track', () => {
    expect(check('studio_export_started', webm)).toEqual([]);
    expect(check('studio_export_completed', { ...webm, durationRatioBucket: '1-2x' })).toEqual([]);
  });
  it('accepts .opus audio-only and Vorbis', () => {
    expect(check('studio_export_started', { ...webm, format: 'opus_none_opus', container: 'opus', videoCodec: 'none', audioBitrate: 64, audioChannels: 1, resolution: 'audio', captionsMode: 'none' })).toEqual([]);
    expect(check('studio_export_started', { ...webm, format: 'webm_vp9_vorbis', audioCodec: 'vorbis', audioBitrate: 192 })).toEqual([]);
  });
  it('rejects values outside the table', () => {
    expect(check('studio_export_started', { ...webm, videoCodec: 'av1' })).not.toEqual([]);
    expect(check('studio_export_started', { ...webm, captionsMode: 'karaoke' })).not.toEqual([]);
    expect(check('studio_export_started', { ...webm, format: 'webm_av1_opus' })).not.toEqual([]);
  });
  it('the locked-option click names subs_embedded and the new tokens', () => {
    for (const option of ['subs_embedded', 'webm', 'opus', 'vp9', 'vorbis']) {
      expect(check('studio_export_format_locked', { option, required: 'premium', tier: 'free', host: 'mm' })).toEqual([]);
    }
  });
});
