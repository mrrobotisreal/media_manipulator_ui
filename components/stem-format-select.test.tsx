import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import en from '@/i18n/locales/en-us/interface/forms.json';

vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string, opts?: Record<string, string>) => {
      const k = key.replace(/^interface:/, '');
      const found = k.split('.').reduce<unknown>((o, p) => (o as Record<string, unknown> | undefined)?.[p], en);
      const text = typeof found === 'string' ? found : key;
      return text.replace(/\{\{(\w+)\}\}/g, (_, n: string) => opts?.[n] ?? '');
    },
    formatDuration: () => '',
    // Binary megabytes, rounded, like the real formatter with 0 fraction digits.
    formatFileSize: (n: number) => `${Math.round(n / (1024 * 1024))} MB`,
  }),
}));
vi.mock('react-i18next', () => ({ Trans: ({ i18nKey }: { i18nKey: string }) => <>{i18nKey}</> }));
vi.mock('@/components/conversion-options', () => ({ default: () => null }));
vi.mock('@/components/advanced-audio-effects', () => ({ default: () => null }));
vi.mock('@/components/media-trim-modal', () => ({ default: () => null }));
vi.mock('@/components/info-tooltip', () => ({ default: () => null }));

import { StemFormatSelect } from './stem-format-select';
import AudioConversionForm from './audio-conversion-form';

afterEach(cleanup);

const EIGHTY_SEVEN_MIN = 87 * 60;
const optionTexts = () => Array.from(screen.getByRole('combobox').querySelectorAll('option')).map((o) => o.textContent);

describe('MM81 StemFormatSelect', () => {
  it('default: "Same as input" for an MP3, with every size estimate for 87 minutes', () => {
    render(<StemFormatSelect value="auto" onChange={() => undefined} fileName="Set.mp3" fileType="audio/mpeg" durationSeconds={EIGHTY_SEVEN_MIN} />);
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('auto');
    expect(optionTexts()).toEqual([
      'Same as input: MP3 (recommended) · about 199 MB',
      'MP3 (320 kbps) · about 199 MB',
      'FLAC (lossless) · about 483 MB',
      'WAV (lossless, largest) · about 878 MB',
    ]);
    expect(screen.queryByTestId('stem-wav-hint')).toBeNull();
  });

  it('a WAV input resolves "Same as input" to FLAC', () => {
    render(<StemFormatSelect value="auto" onChange={() => undefined} fileName="Song.wav" fileType="audio/wav" durationSeconds={60} />);
    expect(optionTexts()[0]).toMatch(/^Same as input: FLAC \(recommended\)/);
  });

  it('override: picking WAV calls back and shows the >500 MB hint', () => {
    const onChange = vi.fn();
    const { rerender } = render(<StemFormatSelect value="auto" onChange={onChange} fileName="Set.mp3" durationSeconds={EIGHTY_SEVEN_MIN} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'wav' } });
    expect(onChange).toHaveBeenCalledWith('wav');
    rerender(<StemFormatSelect value="wav" onChange={onChange} fileName="Set.mp3" durationSeconds={EIGHTY_SEVEN_MIN} />);
    expect(screen.getByTestId('stem-wav-hint').textContent).toContain('878 MB');
  });

  it('no hint for a short WAV and no estimates without a duration', () => {
    const { rerender } = render(<StemFormatSelect value="wav" onChange={() => undefined} fileName="a.mp3" durationSeconds={180} />);
    expect(screen.queryByTestId('stem-wav-hint')).toBeNull();
    rerender(<StemFormatSelect value="wav" onChange={() => undefined} fileName="a.mp3" durationSeconds={null} />);
    expect(optionTexts()).toEqual(['Same as input: MP3 (recommended)', 'MP3 (320 kbps)', 'FLAC (lossless)', 'WAV (lossless, largest)']);
    expect(screen.queryByTestId('stem-wav-hint')).toBeNull();
  });
});

const submit = async (props: Partial<Parameters<typeof AudioConversionForm>[0]>) => {
  const onSubmit = vi.fn();
  render(<AudioConversionForm onSubmit={onSubmit} isLoading={false} {...props} />);
  return {
    onSubmit,
    go: async () => {
      await act(async () => { fireEvent.click(screen.getByRole('button', { name: en.audioForm.submit })); });
      await waitFor(() => expect(onSubmit).toHaveBeenCalled());
      return onSubmit.mock.calls[0][0];
    },
  };
};

describe('MM81 AudioConversionForm: stems no longer jump to WAV', () => {
  it('home converter: choosing Remove vocals keeps the format at "auto" (default)', async () => {
    const { go } = await submit({ fileName: 'Set.mp3', fileType: 'audio/mpeg' });
    const op = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(op, { target: { value: 'remove_vocals' } });
    const stem = await screen.findByTestId('stem-format');
    expect((stem.querySelector('select') as HTMLSelectElement).value).toBe('auto');
    const data = await go();
    expect(data.ai).toMatchObject({ enabled: true, operation: 'remove_vocals' });
    expect(data.format).toBe('auto');
  });

  it('override: explicit WAV is sent as wav', async () => {
    const { go } = await submit({ presets: { aiOperation: 'remove_vocals', hideOperationSelect: true }, fileName: 'Set.mp3' });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'wav' } });
    const data = await go();
    expect(data.format).toBe('wav');
  });

  it('other AI ops keep the regular format (no stem select)', async () => {
    const { go } = await submit({ presets: { aiOperation: 'clean_voice', hideOperationSelect: true } });
    expect(screen.queryByTestId('stem-format')).toBeNull();
    const data = await go();
    expect(data.format).toBe('mp3');
  });
});
