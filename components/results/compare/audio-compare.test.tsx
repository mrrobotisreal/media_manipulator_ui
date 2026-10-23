import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import en from '@/i18n/locales/en-us/interface/components.json';
import { describe as describeResult } from '@/lib/results/describe';
import { AudioCompare } from './audio-compare';

vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string) => {
      const found = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], en);
      return typeof found === 'string' ? found : key;
    },
  }),
}));
vi.mock('@/lib/results/peaks', () => ({ decodePeaks: vi.fn(async () => null), drawPeaks: vi.fn() }));

const descriptor = describeResult({ job: { id: 'j', resultFileName: 'out.mp3' } });

describe('AudioCompare', () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('switching A/B mutes the other side without pausing either', () => {
    const { container } = render(
      <AudioCompare
        mode="ab"
        descriptor={descriptor}
        original={{ src: 'blob:a', fileName: 'in.mp3', mime: 'audio/mpeg' }}
        result={{ src: 'blob:b', fileName: 'out.mp3', mime: 'audio/mpeg' }}
      />,
    );
    const [a, b] = [...container.querySelectorAll('audio')];
    expect(a.muted).toBe(true);
    expect(b.muted).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    const pause = HTMLMediaElement.prototype.pause as unknown as ReturnType<typeof vi.fn>;
    pause.mockClear();
    fireEvent.click(screen.getByRole('radio', { name: /^A/ }));
    expect(a.muted).toBe(false);
    expect(b.muted).toBe(true);
    expect(pause).not.toHaveBeenCalled();
  });

  it('seeking moves both elements together', () => {
    const { container } = render(
      <AudioCompare
        mode="ab"
        descriptor={descriptor}
        original={{ src: 'blob:a', fileName: 'in.mp3', mime: 'audio/mpeg' }}
        result={{ src: 'blob:b', fileName: 'out.mp3', mime: 'audio/mpeg' }}
      />,
    );
    const [a, b] = [...container.querySelectorAll('audio')];
    Object.defineProperty(a, 'duration', { value: 20, configurable: true });
    fireEvent.loadedMetadata(a);
    fireEvent.change(screen.getByRole('slider', { name: 'Seek' }), { target: { value: '7' } });
    expect(a.currentTime).toBe(7);
    expect(b.currentTime).toBe(7);
  });
});
