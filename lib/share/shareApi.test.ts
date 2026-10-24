import { describe, expect, it } from 'vitest';
import { isShareable, shareErrorFromResponse, shareJobKind } from './shareApi';
import { shareErrorMessage } from '@/components/share/use-share-action';
import { shareToResultDescriptor, toolPathFor, shareFileUrl, type ShareDescriptor } from './sharedResult';

describe('shareErrorFromResponse', () => {
  it.each([
    [422, { error: 'share_not_allowed', kind: 'metadata' }, 'not_allowed'],
    [409, { error: 'result_unavailable' }, 'unavailable'],
    [409, { error: 'share_limit' }, 'limit'],
    [401, {}, 'unauthorized'],
    [404, null, 'not_found'],
    [400, {}, 'bad_request'],
    [500, {}, 'unknown'],
    [409, { error: 'something_else' }, 'unknown'],
  ])('%i %j -> %s', (status, body, code) => {
    expect(shareErrorFromResponse(status, body).code).toBe(code);
  });
});

describe('shareErrorMessage', () => {
  const m = {
    copied: () => 'c', copyManually: () => 'm', notAllowed: "This kind of result can't be shared", expired: 'This file has expired',
    limit: 'limit', signIn: 'sign', failed: 'failed', revoked: () => 'r', revokeNone: 'n', revokeFailed: 'rf',
  };
  it('maps 422 and result_unavailable to the specified copy', () => {
    expect(shareErrorMessage('not_allowed', m)).toBe("This kind of result can't be shared");
    expect(shareErrorMessage('unavailable', m)).toBe('This file has expired');
    expect(shareErrorMessage('limit', m)).toBe('limit');
    expect(shareErrorMessage('network', m)).toBe('failed');
  });
});

describe('isShareable (mirrors internal/share Shareable)', () => {
  it('allows ordinary result kinds', () => {
    for (const k of ['image', 'gif', 'video', 'audio', 'pdf', 'transcript', 'captions', 'archive', 'hls', 'dash'] as const) {
      expect(isShareable(k, 'convert')).toBe(true);
    }
  });
  it('refuses metadata reports, unknown, and Darkroom', () => {
    expect(isShareable('metadata')).toBe(false);
    expect(isShareable('unknown')).toBe(false);
    expect(isShareable('video', 'studio_export')).toBe(false);
    expect(isShareable('image', 'inspect_metadata')).toBe(false);
    expect(isShareable('image', null, 'Metadata_Report')).toBe(false);
  });
  it('buckets analytics job_kind', () => {
    expect(shareJobKind('gif')).toBe('image');
    expect(shareJobKind('hls')).toBe('video');
    expect(shareJobKind('pdf')).toBe('document');
  });
});

describe('shared descriptor', () => {
  const share: ShareDescriptor = {
    kind: 'image', fileName: 'result.png', sizeBytes: 10, mime: 'image/png', tool: 'compress-image',
    expiresAt: '2026-10-27T00:00:00Z', downloadUrl: '/api/share/T/file?download=1', thumbnailUrl: '/api/share/T/file',
  };
  const base = 'https://api.media-manipulator.com/api';
  it('builds absolute URLs without doubling /api', () => {
    const d = shareToResultDescriptor(share, base);
    expect(d.downloadUrl).toBe('https://api.media-manipulator.com/api/share/T/file?download=1');
    expect(shareFileUrl(share, base)).toBe('https://api.media-manipulator.com/api/share/T/file');
    expect(d.jobId).toBe('shared');
    expect(d.kind).toBe('image');
  });
  it('maps an unrecognised kind to unknown', () => {
    expect(shareToResultDescriptor({ ...share, kind: 'weird' }, base).kind).toBe('unknown');
  });
  it('links to a tool page for a known slug, else null', () => {
    expect(toolPathFor('compress-video')).toBe('/tools/compress-video');
    expect(toolPathFor('convert')).toBeNull();
    expect(toolPathFor('nonsense')).toBeNull();
  });
});
