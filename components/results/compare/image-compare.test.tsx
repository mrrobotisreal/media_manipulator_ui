import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import en from '@/i18n/locales/en-us/interface/components.json';
import { describe as describeResult } from '@/lib/results/describe';
import { ImageCompare } from './image-compare';
import type { CompareViewProps } from './types';

vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string, opts?: Record<string, string>) => {
      const found = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], en);
      const text = typeof found === 'string' ? found : key;
      return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => opts?.[k] ?? '');
    },
    formatFileSize: (n: number) => `${n} B`,
  }),
}));

const descriptor = describeResult({ job: { id: 'j', resultFileName: 'out.png' } });
const props = (mode: CompareViewProps['mode']): CompareViewProps => ({
  mode,
  descriptor,
  original: { src: 'blob:o', fileName: 'in.png', mime: 'image/png', sizeBytes: 1000 },
  result: { src: 'blob:r', fileName: 'out.png', mime: 'image/png', sizeBytes: 380 },
});

describe('ImageCompare', () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: () => undefined, removeEventListener: () => undefined }) as unknown as typeof window.matchMedia;
  });
  afterEach(cleanup);

  it('wipe mode renders both images, one slider and the byte delta', () => {
    const { container } = render(<ImageCompare {...props('wipe')} />);
    expect(container.querySelectorAll('img')).toHaveLength(2);
    expect(screen.getAllByRole('slider')).toHaveLength(1);
    expect(screen.getByTestId('image-compare-stats').textContent).toContain('380 B (−62%)');
  });

  it('side by side renders two stages and shares zoom', () => {
    const { container } = render(<ImageCompare {...props('side_by_side')} />);
    expect(screen.getByTestId('image-stage-original')).toBeTruthy();
    expect(screen.getByTestId('image-stage-result')).toBeTruthy();
    fireEvent.click(screen.getByRole('radio', { name: '2×' }));
    const zooms = [...container.querySelectorAll('img')].map((i) => i.getAttribute('data-zoom'));
    expect(zooms).toEqual(['2x', '2x']);
  });

  it('toggle shows one side at a time', () => {
    const { container } = render(<ImageCompare {...props('toggle')} />);
    const visible = () => [...container.querySelectorAll('img')].filter((i) => !i.hidden).map((i) => i.getAttribute('src'));
    expect(visible()).toEqual(['blob:r']);
    fireEvent.click(screen.getByRole('radio', { name: 'Original' }));
    expect(visible()).toEqual(['blob:o']);
  });

  it('records natural dimensions on load', () => {
    const { container } = render(<ImageCompare {...props('side_by_side')} />);
    const [a, b] = [...container.querySelectorAll('img')];
    Object.defineProperty(a, 'naturalWidth', { value: 800 });
    Object.defineProperty(a, 'naturalHeight', { value: 600 });
    Object.defineProperty(b, 'naturalWidth', { value: 400 });
    Object.defineProperty(b, 'naturalHeight', { value: 300 });
    fireEvent.load(a);
    fireEvent.load(b);
    expect(screen.getByTestId('image-compare-stats').textContent).toContain('800 × 600');
    expect(screen.getByTestId('image-compare-stats').textContent).toContain('400 × 300');
  });
});
