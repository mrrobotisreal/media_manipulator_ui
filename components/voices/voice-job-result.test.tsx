import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import en from '@/i18n/locales/en-us/interface/components.json';
import { enT } from './test-utils';
import { describe as describeResult } from '@/lib/results/describe';
import { resetResultBlobCache } from '@/lib/results/useResultBlob';
import { resetPreviewedForTests } from '@/components/results/result-panel';
import type { ConversionJob } from '@/lib/useGetJobStatus';

// MM78 acceptance 13: TTS results show the audio viewer with MP3 + WAV downloads;
// convert and shift results open the MM02 audio A/B compare against the input.

vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      const found = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], en);
      return typeof found === 'string' ? found.replace(/\{\{(\w+)\}\}/g, (_, k: string) => String(opts?.[k] ?? '')) : enT(key, opts);
    },
    formatFileSize: (n: number) => `${n} B`,
    formatDate: () => 'Oct 28, 2026',
    formatTime: () => '9:00 AM',
    language: { code: 'en-US' },
  }),
}));
vi.mock('@/lib/analytics', async () => ({
  ...(await vi.importActual<typeof import('@/lib/analytics')>('@/lib/analytics')),
  analytics: { track: vi.fn() },
  useToolAnalytics: () => ({ track: vi.fn(), toolSlug: 'voice-changer', setMediaKind: () => undefined }),
}));
vi.mock('@/lib/useDownloadFile', () => ({ default: () => ({ downloadFile: async () => new Blob(['ID3'], { type: 'audio/mpeg' }) }) }));
vi.mock('@/lib/results/peaks', () => ({ decodePeaks: vi.fn(async () => null), drawPeaks: vi.fn() }));
vi.mock('@/lib/useGetJobStatus', () => ({ default: () => ({ data: undefined }) }));

import { VoiceJobResult } from './voice-job-result';

const done = (id: string): ConversionJob => ({
  id,
  status: 'completed',
  originalFile: new File([], 'temp'),
  resultFileName: 'clip_voice.mp3',
  resultMime: 'audio/mpeg',
  resultSizeBytes: 3,
});

beforeEach(() => {
  let n = 0;
  Object.assign(URL, { createObjectURL: vi.fn(() => `blob:fake-${++n}`), revokeObjectURL: vi.fn() });
  HTMLMediaElement.prototype.load = vi.fn();
  resetResultBlobCache();
  resetPreviewedForTests();
});
afterEach(() => cleanup());

describe('voice results (acceptance 13)', () => {
  it('describe() maps every voice task to audio', () => {
    for (const task of ['voice_tts', 'voice_convert', 'voice_shift', 'voice_clone', 'voice_design']) {
      expect(describeResult({ job: { id: 'j' }, task }).kind, task).toBe('audio');
    }
  });

  it('TTS: the audio viewer with Download MP3 and Download WAV, no compare', async () => {
    const { container } = render(<VoiceJobResult job={done('tts')} setJob={vi.fn()} task="voice_tts" fallbackFileName="speech_voice.mp3" />);
    expect(screen.getByRole('button', { name: /Download MP3/ })).toBeTruthy();
    const wav = screen.getByRole('button', { name: /Download WAV/ }) as HTMLButtonElement;
    await waitFor(() => expect(container.querySelector('[data-testid="result-stage"] audio')).toBeTruthy());
    expect(wav.disabled).toBe(false);
    expect(container.querySelector('[data-compare-mode]')).toBeNull();
  });

  it.each(['voice_convert', 'voice_shift'] as const)('%s: the A/B compare against the input recording', async (task) => {
    const input = new File(['abc'], 'clip.wav', { type: 'audio/wav' });
    const { container } = render(<VoiceJobResult job={done(task)} setJob={vi.fn()} task={task} original={input} fallbackFileName="clip_voice.mp3" />);
    await waitFor(() => expect(container.querySelector('[data-compare-mode="ab"]')).toBeTruthy());
  });

  it('a failed job shows its error and no download', () => {
    render(
      <VoiceJobResult
        job={{ ...done('f'), status: 'failed', error: 'The voice engine is unavailable right now.' }}
        setJob={vi.fn()}
        task="voice_tts"
        fallbackFileName="x.mp3"
      />,
    );
    expect(screen.getByRole('alert').textContent).toMatch(/unavailable/);
    expect(screen.queryByRole('button', { name: /Download/ })).toBeNull();
  });
});
