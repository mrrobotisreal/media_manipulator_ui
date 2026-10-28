import { describe, expect, it } from 'vitest';
import {
  canUseDeep,
  SUMMARY_MULTIPART_MAX_BYTES,
  summarizeErrorCode,
  summaryStages,
  usesPresignedUpload,
} from './useSummarize';

describe('summarizeErrorCode', () => {
  it('passes the API codes through', () => {
    expect(summarizeErrorCode(403, { error: 'signin_required', upgradePath: 'signup' })).toBe('signin_required');
    expect(summarizeErrorCode(403, { error: 'summary_not_in_plan' })).toBe('summary_not_in_plan');
    expect(summarizeErrorCode(503, { error: 'summary_unavailable' })).toBe('summary_unavailable');
    expect(summarizeErrorCode(422, { error: 'no_audio_or_video' })).toBe('no_audio_or_video');
    expect(summarizeErrorCode(422, { error: 'unreadable_media' })).toBe('unreadable_media');
    expect(summarizeErrorCode(400, { error: 'upload_not_found' })).toBe('upload_not_found');
  });

  it('folds invalid_* and no_file into invalid_request', () => {
    expect(summarizeErrorCode(400, { error: 'invalid_output_language' })).toBe('invalid_request');
    expect(summarizeErrorCode(400, { error: 'invalid_s3_key' })).toBe('invalid_request');
    expect(summarizeErrorCode(400, { error: 'no_file' })).toBe('invalid_request');
  });

  it('a 413 without a code (validation reason, MaxBytesReader) is file_too_large', () => {
    expect(summarizeErrorCode(413, { error: 'Video is too long', reason: 'video_duration' })).toBe('file_too_large');
    expect(summarizeErrorCode(413, null)).toBe('file_too_large');
    expect(summarizeErrorCode(500, null)).toBe('unknown');
  });
});

describe('usesPresignedUpload', () => {
  const file = (type: string, size: number) => ({ type, size, name: 'x' });
  it('only large video goes through S3', () => {
    expect(usesPresignedUpload(file('video/mp4', SUMMARY_MULTIPART_MAX_BYTES + 1))).toBe(true);
    expect(usesPresignedUpload(file('video/mp4', 1024))).toBe(false);
    expect(usesPresignedUpload(file('audio/mpeg', SUMMARY_MULTIPART_MAX_BYTES * 3))).toBe(false);
  });
});

describe('canUseDeep', () => {
  const caps = { deep: true, deepTiers: ['pro'] };
  it('needs deep up and the tier listed', () => {
    expect(canUseDeep(caps, 'pro')).toBe(true);
    expect(canUseDeep(caps, 'premium')).toBe(false);
    expect(canUseDeep({ deep: false, deepTiers: ['pro'] }, 'pro')).toBe(false);
    expect(canUseDeep(undefined, 'pro')).toBe(false);
  });
});

describe('summaryStages', () => {
  it('is the six stages in order, pending when unreported', () => {
    expect(summaryStages(null).map((s) => `${s.key}:${s.status}`)).toEqual([
      'probe:pending', 'audio:pending', 'frames:pending', 'vision:pending', 'synthesis:pending', 'render:pending',
    ]);
  });

  it('reflects polled stages and marks the processing ones active', () => {
    const rows = summaryStages({
      stages: [
        { key: 'render', label: 'Formatting', status: 'pending', progress: 100 },
        { key: 'probe', label: 'Reading', status: 'completed', progress: 5 },
        { key: 'audio', label: 'Transcribing', status: 'processing', progress: 25 },
        { key: 'frames', label: 'Choosing', status: 'completed', progress: 40, message: '12 frames' },
        { key: 'mystery', label: '?', status: 'failed', progress: 0 },
      ],
    });
    expect(rows.map((r) => r.status)).toEqual(['completed', 'processing', 'completed', 'pending', 'pending', 'pending']);
    expect(rows.filter((r) => r.active).map((r) => r.key)).toEqual(['audio']);
    expect(rows[2].message).toBe('12 frames');
  });
});
