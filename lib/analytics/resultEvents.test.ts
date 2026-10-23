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

const META_VALID: Record<string, Record<string, unknown>> = {
  metadata_inspected: { surface: 'home', kind: 'image', tag_bucket: '26-100', has_gps: true, has_c2pa: false },
  metadata_section_toggled: { category: 'gps', open: true },
  metadata_search_used: {},
  metadata_privacy_filter_used: { flag: 'location' },
  metadata_diff_opened: { tool: 'exif-remover', removed_bucket: '1-25', added_bucket: '0', changed_bucket: '0' },
  metadata_diff_mode_changed: { mode: 'split' },
  metadata_binary_downloaded: { category: 'thumbnail' },
};
const META_BAD: Record<string, Record<string, unknown>> = {
  metadata_inspected: { ...META_VALID.metadata_inspected, tag_bucket: '12' },
  metadata_section_toggled: { category: 'gps', open: 'yes' },
  metadata_search_used: { query: 'iphone' },
  metadata_privacy_filter_used: { flag: 'gps' },
  metadata_diff_opened: { ...META_VALID.metadata_diff_opened, removed_bucket: 7 },
  metadata_diff_mode_changed: { mode: 'side' },
  metadata_binary_downloaded: { category: 5 },
};

describe('metadata event schemas', () => {
  it.each(Object.keys(META_VALID))('%s accepts a valid payload', (name) => {
    expect(check(name, META_VALID[name])).toEqual([]);
  });
  it.each(Object.keys(META_VALID))('%s rejects an extra key', (name) => {
    expect(check(name, { ...META_VALID[name], extra: 1 }).length).toBeGreaterThan(0);
  });
  it.each(Object.keys(META_VALID))('%s rejects a bad value', (name) => {
    expect(check(name, META_BAD[name]).length).toBeGreaterThan(0);
  });
  it('registers priorities', () => {
    expect(EVENT_PRIORITY.metadata_inspected).toBe(EVENT_PRIORITY.result_viewed);
    expect(EVENT_PRIORITY.metadata_diff_opened).toBe(EVENT_PRIORITY.result_viewed);
    for (const n of ['metadata_section_toggled', 'metadata_search_used', 'metadata_privacy_filter_used', 'metadata_diff_mode_changed', 'metadata_binary_downloaded']) {
      expect(EVENT_PRIORITY[n as keyof typeof EVENT_PRIORITY]).toBe(3);
    }
    expect(EVENTS.METADATA_SEARCH_USED).toBe('metadata_search_used');
  });
});
