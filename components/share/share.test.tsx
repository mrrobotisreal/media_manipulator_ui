import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import en from '@/i18n/locales/en-us/interface/components.json';
import { describe as describeResult } from '@/lib/results/describe';
import { resetResultBlobCache } from '@/lib/results/useResultBlob';
import { ResultPanel, resetPreviewedForTests } from '@/components/results/result-panel';
import { SharedResultGone, SharedResultView } from './shared-result-view';
import { shareToResultDescriptor, type ShareDescriptor } from '@/lib/share/sharedResult';

const track = vi.hoisted(() => vi.fn());
const add = vi.hoisted(() => vi.fn(async () => undefined));
const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), message: vi.fn() }));
const api = vi.hoisted(() => ({ createShareLink: vi.fn(), revokeShareLinks: vi.fn() }));
const copy = vi.hoisted(() => vi.fn(async () => true));

vi.mock('sonner', () => ({ toast }));
vi.mock('@/lib/results/clipboard', () => ({ copyText: copy }));
vi.mock('@/lib/history/localHistory', () => ({ localHistory: { add } }));
vi.mock('@/lib/history/thumbnail', () => ({ thumbnailable: () => false, makeThumbnail: vi.fn() }));
vi.mock('@/components/metadata/metadata-strip', () => ({ MetadataStrip: () => <div data-testid="metadata-strip" /> }));
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => p }));
vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string, opts?: Record<string, string>) => {
      const found = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], en);
      const text = typeof found === 'string' ? found : key;
      return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => opts?.[k] ?? '');
    },
    formatFileSize: (n: number) => `${n} B`,
    formatDate: () => 'Oct 27, 2026',
    formatTime: () => '9:00 AM',
    language: { code: 'en-US' },
  }),
}));
vi.mock('@/lib/analytics', async () => {
  const actual = await vi.importActual<typeof import('@/lib/analytics')>('@/lib/analytics');
  return { ...actual, analytics: { track }, useToolAnalytics: () => ({ track, toolSlug: 'compress-image', setMediaKind: () => undefined }) };
});
vi.mock('@/lib/useDownloadFile', () => ({ default: () => ({ downloadFile: async () => new Blob(['b']) }) }));
vi.mock('@/lib/results/save', () => ({ saveBlobToDisk: vi.fn() }));
vi.mock('@/lib/share/shareApi', async (orig) => ({
  ...(await orig<typeof import('@/lib/share/shareApi')>()),
  createShareLink: api.createShareLink,
  revokeShareLinks: api.revokeShareLinks,
}));

import { ShareError } from '@/lib/share/shareApi';

const owned = (file = 'out.png', extra: Record<string, unknown> = {}) =>
  describeResult({ job: { id: 'job-1', resultFileName: file, resultSizeBytes: 100, expiresAt: '2026-10-25T09:00:00Z', ...extra } });

beforeEach(() => {
  Object.assign(URL, { createObjectURL: vi.fn(() => 'blob:x'), revokeObjectURL: vi.fn() });
  for (const f of [track, add, copy, api.createShareLink, api.revokeShareLinks, toast.success, toast.error, toast.message]) f.mockClear();
  resetPreviewedForTests();
  resetResultBlobCache();
});
afterEach(cleanup);

describe('Share button in ResultPanel', () => {
  it('creates a link, copies it, toasts the expiry and emits share_link_copied', async () => {
    api.createShareLink.mockResolvedValue({ token: 't', url: 'https://x/r/t', expiresAt: '2026-10-27T09:00:00Z' });
    render(<ResultPanel descriptor={owned()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Share' }));
    await waitFor(() => expect(copy).toHaveBeenCalledWith('https://x/r/t'));
    expect(toast.success).toHaveBeenCalledWith('Link copied. It works until Oct 27, 2026 9:00 AM.');
    expect(track).toHaveBeenCalledWith('share_link_copied', { job_kind: 'image', source: 'result_panel' }, { job_id: 'job-1' });
  });

  it('every click mints a new link (not idempotent)', async () => {
    api.createShareLink.mockResolvedValue({ token: 't', url: 'https://x/r/t', expiresAt: '2026-10-27T09:00:00Z' });
    render(<ResultPanel descriptor={owned()} />);
    const btn = screen.getByRole('button', { name: 'Share' });
    fireEvent.click(btn);
    await waitFor(() => expect(toast.success).toHaveBeenCalledTimes(1));
    fireEvent.click(btn);
    await waitFor(() => expect(api.createShareLink).toHaveBeenCalledTimes(2));
  });

  it.each([
    ['not_allowed', "This kind of result can't be shared."],
    ['unavailable', 'This file has expired.'],
  ] as const)('maps %s to its message and emits nothing', async (code, text) => {
    api.createShareLink.mockRejectedValue(new ShareError(code, 409));
    render(<ResultPanel descriptor={owned()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Share' }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(text));
    expect(track.mock.calls.some((c) => c[0] === 'share_link_copied')).toBe(false);
  });

  it('share_limit offers Revoke through a confirm dialog, never a single click', async () => {
    api.createShareLink.mockRejectedValue(new ShareError('limit', 409));
    api.revokeShareLinks.mockResolvedValue(5);
    render(<ResultPanel descriptor={owned()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Share' }));
    expect(await screen.findByText(/already has 5 live share links/)).toBeTruthy();
    expect(api.revokeShareLinks).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Revoke links' }));
    await waitFor(() => expect(api.revokeShareLinks).toHaveBeenCalledWith('job-1'));
  });

  it('falls back to showing the URL when the clipboard is refused', async () => {
    copy.mockResolvedValueOnce(false);
    api.createShareLink.mockResolvedValue({ token: 't', url: 'https://x/r/t', expiresAt: '2026-10-27T09:00:00Z' });
    render(<ResultPanel descriptor={owned()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Share' }));
    await waitFor(() => expect(toast.message).toHaveBeenCalled());
    expect(String(toast.message.mock.calls[0][0])).toContain('https://x/r/t');
    expect(track.mock.calls.some((c) => c[0] === 'share_link_copied')).toBe(false);
  });

  it('is hidden for kinds the API refuses', () => {
    render(<ResultPanel descriptor={owned('weird.xyz')} />);
    expect(screen.queryByRole('button', { name: 'Share' })).toBeNull();
  });
});

describe('read-only panel and /r view', () => {
  const share: ShareDescriptor = {
    kind: 'image', fileName: 'result.png', sizeBytes: 100, mime: 'image/png', tool: 'compress-image',
    expiresAt: '2026-10-27T09:00:00Z', downloadUrl: '/api/share/T/file?download=1', thumbnailUrl: '/api/share/T/file',
  };
  const descriptor = shareToResultDescriptor(share, 'https://api.example.com/api');

  it('keeps viewer and Download; drops Share, Run another, Compare, metadata strip; records nothing', async () => {
    const original = new File([new Uint8Array(4)], 'in.png', { type: 'image/png' });
    const d = { ...descriptor, original: { file: original, kind: 'image' as const } };
    const { container } = render(<ResultPanel descriptor={d} readOnly onRunAnother={() => undefined} />);
    expect(screen.getByRole('button', { name: /Download/ })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Share' })).toBeNull();
    expect(screen.queryByText('Run another')).toBeNull();
    expect(screen.queryByText('Compare')).toBeNull();
    expect(screen.queryByTestId('metadata-strip')).toBeNull();
    await waitFor(() => expect(container.querySelector('img')?.getAttribute('src')).toBe('https://api.example.com/api/share/T/file'));
    expect(add).not.toHaveBeenCalled();
    for (const name of ['result_previewed', 'result_viewed']) {
      expect(track.mock.calls.some((c) => c[0] === name)).toBe(false);
    }
  });

  it('read-only Download uses the public attachment URL', () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    render(<ResultPanel descriptor={descriptor} readOnly />);
    fireEvent.click(screen.getByRole('button', { name: /Download/ }));
    expect(click).toHaveBeenCalled();
    click.mockRestore();
  });

  it('SharedResultView links the CTA to the tool page, or home', () => {
    const { rerender } = render(<SharedResultView descriptor={descriptor} toolPath="/tools/compress-image" />);
    expect(screen.getByTestId('shared-cta').getAttribute('href')).toBe('/tools/compress-image');
    expect(screen.getByText('Made with Media Manipulator')).toBeTruthy();
    rerender(<SharedResultView descriptor={descriptor} toolPath={null} />);
    expect(screen.getByTestId('shared-cta').getAttribute('href')).toBe('/');
  });

  it('the 404 page is friendly, with a CTA home', () => {
    render(<SharedResultGone />);
    expect(screen.getByRole('heading', { name: 'This link has expired or was removed' })).toBeTruthy();
    expect(screen.getByTestId('shared-gone-cta').getAttribute('href')).toBe('/');
  });
});
