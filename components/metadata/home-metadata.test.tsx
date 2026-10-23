import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

vi.mock('@/i18n/useLocalization', async () => ({ useLocalization: (await import('./test-utils')).useLocalizationMock }));
const state = vi.hoisted(() => ({ calls: [] as Array<{ file: unknown; enabled: boolean }> }));
vi.mock('./use-metadata-data', () => ({
  useMetadataInspect: (file: File | null, o: { enabled?: boolean } = {}) => {
    state.calls.push({ file, enabled: o.enabled ?? true });
    return { data: undefined, status: 'loading', error: null };
  },
}));
vi.mock('./metadata-inspector-lazy', () => ({
  LazyMetadataInspector: ({ surface, status }: { surface: string; status: string }) => <div data-testid="lazy" data-surface={surface} data-status={status} />,
}));
vi.mock('@/lib/metadata/useMetadataAnalytics', () => ({ useMetadataAnalytics: () => ({ onEvent: vi.fn(), onDiffEvent: vi.fn() }) }));

import HomeMetadata, { AUTO_INSPECT_MAX_BYTES, shouldAutoInspect } from './home-metadata';

const file = (name: string, type: string, size: number) => {
  const f = new File(['x'], name, { type });
  Object.defineProperty(f, 'size', { value: size });
  return f;
};
const last = () => state.calls[state.calls.length - 1];

beforeEach(() => {
  state.calls = [];
});
afterEach(cleanup);

describe('shouldAutoInspect', () => {
  it('images and PDFs always; others up to 100 MB', () => {
    expect(shouldAutoInspect({ size: 900 * 1024 * 1024 }, 'image')).toBe(true);
    expect(shouldAutoInspect({ size: 900 * 1024 * 1024 }, 'pdf')).toBe(true);
    expect(shouldAutoInspect({ size: AUTO_INSPECT_MAX_BYTES }, 'video')).toBe(true);
    expect(shouldAutoInspect({ size: AUTO_INSPECT_MAX_BYTES + 1 }, 'video')).toBe(false);
  });
});

describe('HomeMetadata', () => {
  it('auto-inspects an image and shows the inspector with the privacy note', () => {
    render(<HomeMetadata file={file('a.jpg', 'image/jpeg', 2_000_000)} kind="image" uploading={false} />);
    expect(last().enabled).toBe(true);
    expect(screen.getByTestId('lazy').dataset.surface).toBe('home');
    expect(screen.getByText(/the file is deleted after analysis/)).toBeTruthy();
    expect(screen.queryByTestId('home-inspect-button')).toBeNull();
  });

  it('does not inspect a 150 MB video until the button is pressed', () => {
    render(<HomeMetadata file={file('big.mp4', 'video/mp4', 150 * 1024 * 1024)} kind="video" uploading={false} />);
    expect(last().enabled).toBe(false);
    expect(screen.queryByTestId('lazy')).toBeNull();
    fireEvent.click(screen.getByTestId('home-inspect-button'));
    expect(last().enabled).toBe(true);
    expect(screen.getByTestId('lazy')).toBeTruthy();
  });

  it('waits for an in-flight upload, and a new file (new key) resets the request', () => {
    const big = file('big.mp4', 'video/mp4', 150 * 1024 * 1024);
    const { rerender } = render(<HomeMetadata key="a" file={big} kind="video" uploading />);
    expect((screen.getByTestId('home-inspect-button') as HTMLButtonElement).disabled).toBe(true);
    rerender(<HomeMetadata key="a" file={big} kind="video" uploading={false} />);
    fireEvent.click(screen.getByTestId('home-inspect-button'));
    expect(screen.getByTestId('lazy')).toBeTruthy();
    rerender(<HomeMetadata key="b" file={file('other.mp4', 'video/mp4', 150 * 1024 * 1024)} kind="video" uploading={false} />);
    expect(screen.queryByTestId('lazy')).toBeNull();
    expect(screen.getByTestId('home-inspect-button')).toBeTruthy();
  });

  it('auto inspection is held while uploading', () => {
    render(<HomeMetadata file={file('a.jpg', 'image/jpeg', 1000)} kind="image" uploading />);
    expect(last().enabled).toBe(false);
  });

  it('makes no /details request', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    render(<HomeMetadata file={file('a.jpg', 'image/jpeg', 1000)} kind="image" uploading={false} />);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
