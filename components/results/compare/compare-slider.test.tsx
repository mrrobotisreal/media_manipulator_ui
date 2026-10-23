import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import en from '@/i18n/locales/en-us/interface/components.json';
import { CompareSlider } from './compare-slider';

vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string, opts?: Record<string, string>) => {
      const found = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], en);
      const text = typeof found === 'string' ? found : key;
      return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => opts?.[k] ?? '');
    },
  }),
}));

const mockMotion = (reduce: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduce && query.includes('reduce'),
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
};

const mount = (props: Partial<React.ComponentProps<typeof CompareSlider>> = {}) =>
  render(
    <CompareSlider
      before={<span>B</span>}
      after={<span>A</span>}
      beforeLabel="Original"
      afterLabel="Result"
      {...props}
    />,
  );

describe('CompareSlider', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('exposes exactly one slider and follows the keyboard', () => {
    mockMotion(true);
    mount();
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(1);
    const s = sliders[0];
    const log: string[] = [];
    const press = (key: string, shiftKey = false) => {
      fireEvent.keyDown(s, { key, shiftKey });
      log.push(`${key}${shiftKey ? '+Shift' : ''} -> ${s.getAttribute('aria-valuenow')}`);
    };
    expect(s.getAttribute('aria-valuemin')).toBe('0');
    expect(s.getAttribute('aria-valuemax')).toBe('100');
    expect(s.getAttribute('tabindex')).toBe('0');
    expect(s.getAttribute('aria-valuenow')).toBe('50');
    press('ArrowRight');
    press('ArrowRight');
    press('ArrowRight');
    expect(s.getAttribute('aria-valuenow')).toBe('53');
    press('ArrowLeft', true);
    expect(s.getAttribute('aria-valuenow')).toBe('43');
    expect(s.getAttribute('aria-valuetext')).toBe('Original 43%, Result 57%');
    press('Home');
    expect(s.getAttribute('aria-valuenow')).toBe('0');
    press('End');
    expect(s.getAttribute('aria-valuenow')).toBe('100');
    console.log(log.join('\n'));
  });

  it('calls onChange and honours a controlled value', () => {
    mockMotion(true);
    const onChange = vi.fn();
    const view = mount({ value: 20, onChange });
    const s = screen.getByRole('slider');
    expect(s.getAttribute('aria-valuenow')).toBe('20');
    fireEvent.keyDown(s, { key: 'PageUp' });
    expect(onChange).toHaveBeenCalledWith(30);
    expect(s.getAttribute('aria-valuenow')).toBe('20');
    view.rerender(<CompareSlider before="b" after="a" value={30} beforeLabel="O" afterLabel="R" />);
    expect(screen.getByRole('slider').getAttribute('aria-valuenow')).toBe('30');
  });

  it('ignores unrelated keys without preventing default', () => {
    mockMotion(true);
    mount();
    const notPrevented = fireEvent.keyDown(screen.getByRole('slider'), { key: 'a' });
    expect(notPrevented).toBe(true);
  });

  it('renders the reveal class unless reduced motion is requested', () => {
    mockMotion(false);
    const first = mount();
    expect(first.container.querySelector('.mm-compare-reveal')).toBeTruthy();
    cleanup();
    mockMotion(true);
    const second = mount();
    expect(second.container.querySelector('.mm-compare-reveal')).toBeNull();
  });
});
