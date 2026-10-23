import { describe, expect, it } from 'vitest';

import { EVENTS, EVENT_PRIORITY } from './events';
import { validateDevEvent } from './devValidation';

const ctx = { tool_slug: 'compress-video', page_type: 'tool' };
const check = (name: string, properties: Record<string, unknown>) =>
  validateDevEvent(name, { properties, context: ctx } as never, ctx as never);

const VALID: Record<string, Record<string, unknown>> = {
  result_viewed: { job_id: 'j', kind: 'video', surface: 'tutorial', has_original: true },
  result_compare_used: { job_id: 'j', kind: 'image', mode: 'side_by_side' },
  result_download_clicked: { job_id: 'j', kind: 'audio', surface: 'home', viewed_first: false },
  result_archive_entry_opened: { job_id: 'j', entry_kind: 'text' },
  result_stream_rung_selected: { job_id: 'j', rung: '720p' },
  transcript_cue_seeked: { job_id: 'j' },
};
const BAD_ENUM: Record<string, Record<string, unknown>> = {
  result_viewed: { ...VALID.result_viewed, surface: 'sidebar' },
  result_compare_used: { ...VALID.result_compare_used, mode: 'fade' },
  result_download_clicked: { ...VALID.result_download_clicked, surface: 'x' },
  result_archive_entry_opened: { ...VALID.result_archive_entry_opened, entry_kind: 'zip' },
  result_stream_rung_selected: { ...VALID.result_stream_rung_selected, rung: '5000kbps' },
  transcript_cue_seeked: { job_id: 5 },
};

describe('result viewer event schemas', () => {
  it.each(Object.keys(VALID))('%s accepts a valid payload', (name) => {
    expect(check(name, VALID[name])).toEqual([]);
  });
  it.each(Object.keys(VALID))('%s rejects an extra key', (name) => {
    expect(check(name, { ...VALID[name], extra: 1 }).length).toBeGreaterThan(0);
  });
  it.each(Object.keys(VALID))('%s rejects a bad value', (name) => {
    expect(check(name, BAD_ENUM[name]).length).toBeGreaterThan(0);
  });
  it.each(Object.keys(VALID))('%s has no PII-shaped property key', (name) => {
    for (const key of Object.keys(VALID[name])) {
      expect(key).not.toMatch(/name|url|path/);
    }
  });
  it('registers the priorities from the ticket', () => {
    expect(EVENT_PRIORITY.result_download_clicked).toBe(EVENT_PRIORITY.upload_started);
    expect(EVENT_PRIORITY.result_viewed).toBe(EVENT_PRIORITY.result_previewed);
    expect(EVENTS.TRANSCRIPT_CUE_SEEKED).toBe('transcript_cue_seeked');
  });
  it('widens result_previewed preview_kind', () => {
    for (const k of ['transcript', 'archive', 'document', 'stream']) {
      expect(check('result_previewed', { job_id: 'j', preview_kind: k })).toEqual([]);
    }
  });
});
