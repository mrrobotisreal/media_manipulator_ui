import { beforeEach, describe, expect, it, vi } from 'vitest';

const track = vi.hoisted(() => vi.fn());
vi.mock('./client', () => ({ analytics: { track } }));

import { retentionEvents } from './retentionEvents';
import { EVENTS, EVENT_PRIORITY } from './events';
import { reopenAgeBucket, retentionBucket } from './buckets';
import { validateDevEvent } from './devValidation';

const ctx = { page_type: 'account' };
const check = (name: string, properties: Record<string, unknown>) =>
  validateDevEvent(name, { properties, context: ctx } as never, ctx as never);

beforeEach(() => track.mockReset());

describe('retention buckets', () => {
  it.each([[24, '24h'], [168, '7d'], [720, '30d'], [2160, '90d'], [4320, '6mo'], [8760, '1y'], [17520, '2y'], [100, 'custom']])(
    '%i hours -> %s', (h, b) => expect(retentionBucket(h)).toBe(b));
  const day = 86_400_000;
  it.each([[0, '<1d'], [day - 1, '<1d'], [day, '1-7d'], [7 * day, '7-30d'], [30 * day, '30-90d'], [90 * day, '90d+']])(
    'age %i ms -> %s', (ms, b) => expect(reopenAgeBucket(ms)).toBe(b));
});

describe('retentionEvents emission', () => {
  it('retention_setting_changed carries buckets only', () => {
    retentionEvents.settingsChanged({ from_hours: 4320, to_hours: 999 });
    expect(track).toHaveBeenCalledWith(EVENTS.RETENTION_SETTING_CHANGED, { from_bucket: '6mo', to_bucket: 'custom' });
  });
  it('data_deleted: item, all and account scopes', () => {
    retentionEvents.itemDeleted('result');
    retentionEvents.itemDeleted('project', 1);
    retentionEvents.allFilesDeleted();
    retentionEvents.accountDeleted();
    expect(track.mock.calls).toEqual([
      [EVENTS.DATA_DELETED, { scope: 'item', kind: 'result' }],
      [EVENTS.DATA_DELETED, { scope: 'item', kind: 'project' }],
      [EVENTS.DATA_DELETED, { scope: 'all', kind: 'all_files' }],
      [EVENTS.DATA_DELETED, { scope: 'account', kind: 'account' }],
    ]);
  });
  it('a bulk delete emits one event per deleted item, capped, and none for zero', () => {
    retentionEvents.itemDeleted('result', 3);
    expect(track).toHaveBeenCalledTimes(3);
    track.mockReset();
    retentionEvents.itemDeleted('result', 500);
    expect(track).toHaveBeenCalledTimes(50);
    track.mockReset();
    retentionEvents.itemDeleted('result', 0);
    expect(track).not.toHaveBeenCalled();
  });
  it('data_export_requested has no props', () => {
    retentionEvents.exportRequested();
    expect(track).toHaveBeenCalledWith(EVENTS.DATA_EXPORT_REQUESTED, {});
  });
  it('history_item_reopened buckets the age and never sends ids or names', () => {
    retentionEvents.itemReopened('video', new Date(Date.now() - 40 * 86_400_000).toISOString());
    retentionEvents.itemReopened(undefined, 'not a date');
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith(EVENTS.HISTORY_ITEM_REOPENED, { kind: 'video', age_bucket: '30-90d', source: 'account' });
  });
});

describe('retention event schemas and priorities', () => {
  it('accepts valid payloads and rejects extras or bad enums', () => {
    expect(check('retention_setting_changed', { from_bucket: '24h', to_bucket: '2y' })).toEqual([]);
    expect(check('retention_setting_changed', { from_bucket: '5d', to_bucket: '2y' }).length).toBeGreaterThan(0);
    expect(check('data_deleted', { scope: 'all', kind: 'all_files' })).toEqual([]);
    expect(check('data_deleted', { scope: 'item', kind: 'result', job_id: 'x' }).length).toBeGreaterThan(0);
    expect(check('data_export_requested', {})).toEqual([]);
    expect(check('history_item_reopened', { kind: 'video', age_bucket: '90d+' })).toEqual([]);
    expect(check('history_item_reopened', { kind: 'video', age_bucket: '3d' }).length).toBeGreaterThan(0);
  });
  it('registers the priorities mirrored in the Go catalog', () => {
    expect(EVENT_PRIORITY.retention_setting_changed).toBe(1);
    expect(EVENT_PRIORITY.data_deleted).toBe(1);
    expect(EVENT_PRIORITY.data_export_requested).toBe(2);
    expect(EVENT_PRIORITY.history_item_reopened).toBe(2);
  });
});
