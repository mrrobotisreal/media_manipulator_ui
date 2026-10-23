import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, waitFor } from '@testing-library/react';
import { peekResultBlob, resetResultBlobCache, useResultBlob, type ResultBlobState } from './useResultBlob';

vi.mock('@/lib/useDownloadFile', () => ({
  default: () => ({ downloadFile: async () => new Blob(['x']) }),
}));

const descriptor = { jobId: 'job-a', kind: 'image' as const, mimeFromServer: false };

function Probe({ onState, id = descriptor.jobId, fetchBlob }: {
  onState: (s: ResultBlobState) => void;
  id?: string;
  fetchBlob: (jobId: string) => Promise<Blob>;
}) {
  const state = useResultBlob({ ...descriptor, jobId: id }, { fetchBlob });
  onState(state);
  return null;
}

describe('useResultBlob', () => {
  let create: ReturnType<typeof vi.fn>;
  let revoke: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    let n = 0;
    create = vi.fn(() => `blob:fake-${++n}`);
    revoke = vi.fn();
    Object.assign(URL, { createObjectURL: create, revokeObjectURL: revoke });
  });

  afterEach(() => {
    cleanup();
    resetResultBlobCache();
  });

  it('fetches once for two consumers and revokes once after both unmount', async () => {
    const fetchBlob = vi.fn(async () => new Blob(['bytes']));
    let a: ResultBlobState | undefined;
    let b: ResultBlobState | undefined;
    const first = render(<Probe fetchBlob={fetchBlob} onState={(s) => (a = s)} />);
    const second = render(<Probe fetchBlob={fetchBlob} onState={(s) => (b = s)} />);

    await waitFor(() => expect(a?.status).toBe('ready'));
    await waitFor(() => expect(b?.status).toBe('ready'));
    expect(fetchBlob).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledTimes(1);
    expect(a?.url).toBe(b?.url);
    expect(peekResultBlob('job-a')).not.toBeNull();

    first.unmount();
    expect(revoke).not.toHaveBeenCalled();
    second.unmount();
    expect(revoke).toHaveBeenCalledTimes(1);
    expect(revoke).toHaveBeenCalledWith('blob:fake-1');
    expect(peekResultBlob('job-a')).toBeNull();
  });

  it('does not mint a URL when every consumer left before the bytes arrived', async () => {
    let resolve!: (blob: Blob) => void;
    const fetchBlob = vi.fn(() => new Promise<Blob>((r) => (resolve = r)));
    const view = render(<Probe fetchBlob={fetchBlob} onState={() => undefined} />);
    view.unmount();
    await act(async () => resolve(new Blob(['late'])));
    expect(create).not.toHaveBeenCalled();
    expect(revoke).not.toHaveBeenCalled();
  });

  it('surfaces a fetch error and refetches on retry', async () => {
    const fetchBlob = vi
      .fn<(jobId: string) => Promise<Blob>>()
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValue(new Blob(['ok']));
    let state: ResultBlobState | undefined;
    render(<Probe fetchBlob={fetchBlob} onState={(s) => (state = s)} />);
    await waitFor(() => expect(state?.status).toBe('error'));
    expect(state?.error?.message).toBe('boom');
    act(() => state?.retry());
    await waitFor(() => expect(state?.status).toBe('ready'));
    expect(fetchBlob).toHaveBeenCalledTimes(2);
  });

  it('prefers the inline URL for streamable kinds when the API sent a MIME, and fetches nothing', () => {
    const fetchBlob = vi.fn(async () => new Blob(['x']));
    let state: ResultBlobState | undefined;
    function InlineProbe() {
      state = useResultBlob({ jobId: 'v1', kind: 'video', mimeFromServer: true }, { fetchBlob });
      return null;
    }
    render(<InlineProbe />);
    expect(state?.source).toBe('inline');
    expect(state?.url).toContain('/result/v1?sid=');
    expect(fetchBlob).not.toHaveBeenCalled();
  });
});
