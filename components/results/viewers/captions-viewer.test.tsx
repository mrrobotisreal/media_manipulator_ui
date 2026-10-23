import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import en from '@/i18n/locales/en-us/interface/components.json';
import { describe as describeResult } from '@/lib/results/describe';
import { alignCues, CaptionsViewer } from './captions-viewer';
import { parseCaptions } from '@/lib/results/captions';

vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string, opts?: Record<string, string | number>) => {
      const found = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], en);
      const text = typeof found === 'string' ? found : key;
      return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => String(opts?.[k] ?? ''));
    },
    formatFileSize: (n: number) => `${n} B`,
  }),
}));

const srt = (cues: Array<[string, string, string]>) =>
  cues.map(([a, b, text], i) => `${i + 1}\n${a} --> ${b}\n${text}\n`).join('\n');

const SOURCE3 = srt([
  ['00:00:01,000', '00:00:02,000', 'Hello'],
  ['00:00:03,000', '00:00:04,000', 'How are you'],
  ['00:00:05,000', '00:00:06,000', 'Bye'],
]);
const TRANSLATED3 = srt([
  ['00:00:01,000', '00:00:02,000', 'Hola'],
  ['00:00:03,000', '00:00:04,000', 'Como estas'],
  ['00:00:05,900', '00:00:06,000', 'Adios'],
]);
const TRANSLATED4 = TRANSLATED3 + '\n' + srt([['00:00:07,000', '00:00:08,000', 'Extra']]).replace(/^1/, '4');

const mount = (translated: string, source?: string, name = 'talk_es.srt') => {
  const file = source === undefined ? null : new File([source], 'talk.srt', { type: 'application/x-subrip' });
  const descriptor = describeResult({
    job: { id: 'job-cap', resultFileName: name },
    originalFile: file,
    task: 'caption_translator',
  });
  return render(
    <CaptionsViewer
      role="result"
      kind="captions"
      src="blob:x"
      blob={new Blob([translated])}
      fileName={name}
      mime="application/x-subrip"
      descriptor={descriptor}
    />,
  );
};

describe('CaptionsViewer', () => {
  beforeEach(() => {
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });
  afterEach(cleanup);

  it('single mode shows a cue table with search', async () => {
    const { container } = mount(TRANSLATED3);
    await screen.findByText('Hola');
    expect(screen.getAllByTestId('caption-row')).toHaveLength(3);
    fireEvent.change(screen.getByLabelText('Search transcript'), { target: { value: 'adi' } });
    expect(screen.getByText('1 of 1')).toBeTruthy();
    expect(container.querySelectorAll('mark')).toHaveLength(1);
  });

  it('translator mode shows 3 aligned rows for 3 vs 3 cues, flags timing, no warning', async () => {
    mount(TRANSLATED3, SOURCE3);
    await screen.findByText('Hola');
    const rows = screen.getAllByTestId('caption-row');
    expect(rows).toHaveLength(3);
    expect(rows[0].textContent).toContain('Hello');
    expect(rows[0].textContent).toContain('Hola');
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getAllByText('timing differs')).toHaveLength(1);
    expect(rows[2].textContent).toContain('timing differs');
  });

  it('shows a warning and an empty cell for 3 vs 4 cues', async () => {
    mount(TRANSLATED4, SOURCE3);
    await screen.findByText('Extra');
    const rows = screen.getAllByTestId('caption-row');
    expect(rows).toHaveLength(4);
    expect(rows[3].textContent).toContain('(none)');
    expect(screen.getByRole('alert').textContent).toContain('3 cues');
  });

  it('falls back to the file card for oversized captions', async () => {
    const big = { size: 6 * 1024 * 1024, text: async () => '' } as unknown as Blob;
    const descriptor = describeResult({ job: { id: 'j', resultFileName: 'big.srt' }, task: 'caption_translator' });
    render(<CaptionsViewer role="result" kind="captions" src="blob:x" blob={big} fileName="big.srt" mime="x" descriptor={descriptor} />);
    await waitFor(() => expect(screen.getByText(/no in-browser preview/)).toBeTruthy());
  });
});

describe('alignCues', () => {
  it('pairs by index and flags drift over 250 ms', () => {
    const a = parseCaptions(SOURCE3).cues;
    const b = parseCaptions(TRANSLATED3).cues;
    expect(alignCues(a, b).map((r) => r.timingDiffers)).toEqual([false, false, true]);
    expect(alignCues(a, b.slice(0, 2))[2].translated).toBeUndefined();
  });
});
