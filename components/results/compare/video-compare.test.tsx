import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import en from '@/i18n/locales/en-us/interface/components.json';
import { VideoCompare } from './video-compare';

vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string, opts?: Record<string, string>) => {
      const found = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], en);
      const text = typeof found === 'string' ? found : key;
      return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => opts?.[k] ?? '');
    },
  }),
}));

const ready = (el: HTMLVideoElement, state = 4) => Object.defineProperty(el, 'readyState', { value: state, configurable: true });

describe('VideoCompare / useSyncedVideos', () => {
  let paused = new WeakMap<HTMLMediaElement, boolean>();
  beforeEach(() => {
    paused = new WeakMap();
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: () => undefined, removeEventListener: () => undefined }) as unknown as typeof window.matchMedia;
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (this: HTMLMediaElement) {
      paused.set(this, false);
      this.dispatchEvent(new Event('play'));
      return Promise.resolve();
    });
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function (this: HTMLMediaElement) {
      paused.set(this, true);
      this.dispatchEvent(new Event('pause'));
    });
    Object.defineProperty(HTMLMediaElement.prototype, 'paused', { configurable: true, get(this: HTMLMediaElement) { return paused.get(this) ?? true; } });
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const mount = (mode: 'side_by_side' | 'wipe' | 'toggle' = 'side_by_side', targetFps?: number) => {
    const view = render(<VideoCompare mode={mode} originalSrc="blob:a" resultSrc="http://x/result/1?sid=s" targetFps={targetFps} />);
    const a = view.container.querySelector<HTMLVideoElement>('video[data-role="a"]')!;
    const b = view.container.querySelector<HTMLVideoElement>('video[data-role="b"]')!;
    ready(a);
    ready(b);
    return { a, b, ...view };
  };

  it('renders two muted videos and one transport, whichever src kind', () => {
    const { a, b, container } = mount();
    expect(a.muted).toBe(true);
    expect(b.getAttribute('src')).toContain('/result/1');
    expect(container.querySelectorAll('[data-testid="video-transport"]')).toHaveLength(1);
  });

  it('pulls B back to A when B seeks on its own', () => {
    const { a, b } = mount();
    a.currentTime = 3;
    b.currentTime = 9;
    fireEvent(b, new Event('seeked'));
    expect(Math.abs(a.currentTime - b.currentTime)).toBeLessThanOrEqual(1 / 30);
    expect(b.currentTime).toBe(3);
  });

  it('seeking through the transport moves both together', () => {
    const { a, b } = mount();
    act(() => {
      Object.defineProperty(a, 'duration', { value: 10, configurable: true });
      fireEvent(a, new Event('durationchange'));
    });
    fireEvent.change(screen.getByRole('slider', { name: 'Seek' }), { target: { value: '4' } });
    expect(a.currentTime).toBe(4);
    expect(b.currentTime).toBe(4);
  });

  it('play starts both; waiting on either pauses both; canplay on both resumes', () => {
    const { a, b } = mount();
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    expect(paused.get(a)).toBe(false);
    expect(paused.get(b)).toBe(false);

    ready(b, 2);
    fireEvent(b, new Event('waiting'));
    expect(paused.get(a)).toBe(true);
    expect(paused.get(b)).toBe(true);

    ready(b, 4);
    fireEvent(b, new Event('canplay'));
    expect(paused.get(a)).toBe(false);
    expect(paused.get(b)).toBe(false);

    ready(a, 2);
    fireEvent(a, new Event('waiting'));
    expect(paused.get(a)).toBe(true);
    expect(paused.get(b)).toBe(true);
  });

  it('does not resume after waiting if the user had paused', () => {
    const { a, b } = mount();
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    fireEvent(a, new Event('canplay'));
    expect(paused.get(a)).toBe(true);
    expect(paused.get(b)).toBe(true);
  });

  it('rate and sound apply to B only for sound', () => {
    const { a, b } = mount();
    fireEvent.click(screen.getByRole('radio', { name: '2×' }));
    expect(a.playbackRate).toBe(2);
    expect(b.playbackRate).toBe(2);
    fireEvent.click(screen.getByRole('button', { name: 'Unmute result sound' }));
    expect(b.muted).toBe(false);
    expect(a.muted).toBe(true);
  });

  it('frame step pauses and moves by 1/fps (30 when unknown)', () => {
    const { a, b } = mount();
    a.currentTime = 1;
    fireEvent.click(screen.getByRole('button', { name: 'Next frame' }));
    expect(a.currentTime).toBeCloseTo(1 + 1 / 30);
    expect(b.currentTime).toBeCloseTo(1 + 1 / 30);
  });

  it('shows the fps hint as target when nothing is measured', () => {
    mount('side_by_side', 60);
    expect(screen.getByTestId('fps-readout').textContent).toContain('60 fps (target)');
  });

  it('shows no fps readout without a measurement or hint', () => {
    mount();
    expect(screen.queryByTestId('fps-readout')).toBeNull();
  });

  it('wipe has one slider handle; toggle hides the other side but keeps both mounted', () => {
    const wipe = mount('wipe');
    expect(wipe.container.querySelectorAll('[role="slider"][aria-valuemax="100"]')).toHaveLength(1);
    cleanup();
    const toggle = mount('toggle');
    expect(toggle.b.style.visibility).toBe('');
    fireEvent.click(screen.getByRole('radio', { name: 'Original' }));
    expect(toggle.container.querySelector<HTMLVideoElement>('video[data-role="b"]')!.style.visibility).toBe('hidden');
    expect(toggle.container.querySelectorAll('video')).toHaveLength(2);
  });
});
