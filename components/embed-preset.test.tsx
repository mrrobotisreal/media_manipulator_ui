import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import en from '@/i18n/locales/en-us/interface/forms.json';
import { TOOL_PAGES, type EmbedPreset } from '@/content/toolPages';

vi.mock('next/dynamic', () => ({
  default: (loader: () => Promise<unknown>) => {
    const src = String(loader);
    const name = ['video-compressor-panel', 'video-conversion-form', 'audio-conversion-form'].find((n) => src.includes(n)) ?? 'unknown';
    const Stub = () => <div data-testid={`dyn-${name}`} />;
    return Stub;
  },
}));
vi.mock('next/link', () => ({ default: ({ children }: { children: React.ReactNode }) => <a>{children}</a> }));
vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string) => {
      const k = key.replace(/^interface:/, '');
      const found = k.split('.').reduce<unknown>((o, p) => (o as Record<string, unknown> | undefined)?.[p], en);
      return typeof found === 'string' ? found : key;
    },
    formatDuration: () => '',
    formatFileSize: () => '',
  }),
}));
vi.mock('react-i18next', () => ({ Trans: ({ i18nKey }: { i18nKey: string }) => <>{i18nKey}</> }));
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => p }));
vi.mock('@/components/conversion-options', () => ({ default: () => null }));
vi.mock('@/components/advanced-audio-effects', () => ({ default: () => null }));
vi.mock('@/components/advanced-video-effects', () => ({ default: () => null }));
vi.mock('@/components/media-trim-modal', () => ({ default: () => null }));
vi.mock('@/components/info-tooltip', () => ({ default: () => null }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => null }));
vi.mock('@/components/account/upgrade-surfaces', () => ({ UploadLimitHint: () => null, useUpgradeNudge: () => () => undefined }));
vi.mock('@/lib/analytics', () => ({
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
  normalizeMediaKind: (k: string) => k,
  safeFileExtension: (n: string) => n,
  ToolAnalyticsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  trackFileChoice: () => undefined,
  useToolAnalytics: () => ({ track: () => undefined, setMediaKind: () => undefined }),
}));
vi.mock('@/lib/useConvertFile', () => ({ default: () => ({ mutate: vi.fn(), isPending: false, uploadProgress: 0 }) }));
vi.mock('@/lib/useTranscribeFile', () => ({ default: () => ({ mutate: vi.fn(), isPending: false, uploadProgress: 0 }) }));
vi.mock('@/lib/useGetJobStatus', () => ({ default: () => ({ data: undefined }) }));
vi.mock('@/components/results/result-panel', () => ({ ResultPanel: () => null }));

import AudioConversionForm from './audio-conversion-form';
import VideoConversionForm from './video-conversion-form';
import AIVideoTools from './ai-video-tools';
import EmbeddedToolPanel from './embedded-tool-panel';

afterEach(cleanup);

const page = (slug: string) => {
  const p = TOOL_PAGES.find((t) => t.slug === slug);
  if (!p) throw new Error(`no page ${slug}`);
  return p;
};

describe('EmbedPreset type', () => {
  it('rejects an audio preset carrying targetFps and a video panel preset carrying aiOperation', () => {
    type Audio = Extract<EmbedPreset, { kind: 'audio' }>;
    expectTypeOf<Audio>().not.toHaveProperty('targetFps');
    // @ts-expect-error targetFps is not part of the audio preset
    const bad: EmbedPreset = { kind: 'audio', aiOperation: 'isolate_vocals', targetFps: 60 };
    expect(bad.kind).toBe('audio');
  });
});

describe('page entries', () => {
  it('declares the four presets', () => {
    expect(page('remove-exif-metadata').embed.preset).toEqual({ kind: 'metadata', mode: 'strip' });
    expect(page('isolate-vocals-from-song').embed.preset).toEqual({
      kind: 'audio', aiOperation: 'isolate_vocals', hideOperationSelect: true, format: 'wav',
    });
    const fi = page('ai-frame-interpolation').embed.preset;
    expect(fi).toMatchObject({ kind: 'video', aiOperation: 'frame_interpolation', openAiPanel: true, fpsPickerOnTop: true });
    expect(page('compress-video').embed.preset).toEqual({ kind: 'video', panel: 'video_compressor' });
  });

  it('the four MM27 pages plus the three MM28 audio pages carry the original preset kinds', () => {
    // The 2026-10-28 catalog expansion added `audio_effect` / `video_effect` /
    // `image_effect` presets (and one more `video` panel preset, HEVC); those
    // are checked separately below so this list stays the MM27/MM28 contract.
    const original = TOOL_PAGES.filter(
      (t) => t.embed.preset && (t.embed.preset.kind === 'metadata' || t.embed.preset.kind === 'audio' || (t.embed.preset.kind === 'video' && t.slug !== 'convert-video-to-hevc')),
    ).map((t) => t.slug).sort();
    expect(original).toEqual([
      'ai-frame-interpolation', 'clean-voice-audio', 'compress-video', 'isolate-vocals-from-song',
      'remove-background-noise', 'remove-exif-metadata', 'remove-vocals-from-song',
    ]);
  });

  it('every effect preset names a section the form can open, and its page is in the right category', () => {
    const effectPages = TOOL_PAGES.filter((t) => t.embed.preset && /_effect$/.test(t.embed.preset.kind));
    expect(effectPages.length).toBeGreaterThanOrEqual(20);
    for (const p of effectPages) {
      const preset = p.embed.preset!;
      if (preset.kind === 'audio_effect') {
        expect(p.embed.defaultMediaKind, p.slug).toBe('audio');
        expect(['speed', 'volume', 'pitch', 'normalize', 'equalizer', 'reverb', 'trim']).toContain(preset.effect);
      } else if (preset.kind === 'video_effect') {
        expect(p.embed.defaultMediaKind, p.slug).toBe('video');
        expect(['speed', 'reverse', 'flip', 'stabilize', 'frameRate', 'color']).toContain(preset.effect);
      } else if (preset.kind === 'image_effect') {
        expect(p.embed.defaultMediaKind, p.slug).toBe('image');
        expect(['text', 'crop', 'filter', 'metadata']).toContain(preset.effect);
      }
    }
  });

  it('keeps every former per-task recommended format on its page', () => {
    const former: Record<string, string> = {
      video_to_gif: 'gif', webp_to_jpg: 'jpg', wav_to_mp3: 'mp3', srt_generator: 'srt', extract_audio: 'mp3',
      extract_video_only: 'mp4', ai_frame_interpolation: 'mp4', png_to_jpg: 'jpg', jpg_to_png: 'png',
      webp_to_png: 'png', png_to_webp: 'webp', jpg_to_webp: 'webp', jpg_converter: 'jpg', png_converter: 'png',
      remove_background: 'png', image_to_pdf: 'pdf', jpg_to_pdf: 'pdf', png_to_pdf: 'pdf', pdf_to_jpg: 'jpg',
      pdf_to_png: 'png', heic_to_jpg: 'jpg', avif_to_jpg: 'jpg', avif_to_png: 'png', svg_to_png: 'png',
      png_to_svg: 'svg', png_to_ico: 'ico', svg_converter: 'png', mp4_converter: 'mp4', mov_to_mp4: 'mp4',
      webm_to_mp4: 'mp4', avi_to_mp4: 'mp4', mkv_to_mp4: 'mp4', mp4_to_webm: 'webm', mp4_to_mp3: 'mp3',
      video_to_mp3: 'mp3', mp4_to_gif: 'gif', gif_converter: 'gif',
    };
    for (const [task, fmt] of Object.entries(former)) {
      const pages = TOOL_PAGES.filter((t) => t.embed.defaultTask === task);
      expect(pages.length, task).toBeGreaterThan(0);
      for (const p of pages) {
        const e = p.embed;
        const shown = e.lockedOutputFormat ?? e.lockedVideoOutputFormat ?? e.lockedExtractAudioFormat
          ?? e.defaultOutputFormat ?? e.defaultVideoOutputFormat ?? e.defaultExtractAudioFormat;
        expect(shown, `${p.slug} (${task})`).toBe(fmt);
      }
    }
  });

  it('uses no explicit output height above the anonymous 1080 cap in any preset', () => {
    for (const p of TOOL_PAGES) {
      if (!p.embed.preset) continue;
      expect(p.embed.defaultVideoHeight ?? 0).toBeLessThanOrEqual(1080);
    }
  });
});

const submitAudio = async (presets?: Parameters<typeof AudioConversionForm>[0]['presets']) => {
  const onSubmit = vi.fn();
  render(<AudioConversionForm onSubmit={onSubmit} isLoading={false} presets={presets} />);
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: en.audioForm.submit })); });
  await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  return onSubmit.mock.calls[0][0];
};

describe('AudioConversionForm preset', () => {
  it('isolate-vocals preset: no operation select, chip shown, submits isolate_vocals as wav', async () => {
    const p = page('isolate-vocals-from-song').embed.preset as Extract<EmbedPreset, { kind: 'audio' }>;
    const data = await submitAudio({ aiOperation: p.aiOperation, hideOperationSelect: p.hideOperationSelect, defaultFormat: p.format });
    expect(screen.queryByRole('combobox')).toBeNull();
    expect(screen.getByTestId('audio-ai-preset-chip').textContent).toContain(en.audioForm.ai.operations.isolate_vocals);
    expect(data.ai).toMatchObject({ enabled: true, operation: 'isolate_vocals' });
    expect(data.format).toBe('wav');
  });

  it('without a preset: select present, ai off, mp3 (unchanged defaults)', async () => {
    const data = await submitAudio();
    expect(screen.getAllByRole('combobox').length).toBe(1);
    expect(data.ai).toEqual({ enabled: false, operation: 'none' });
    expect(data.format).toBe('mp3');
    expect(data.bitrate).toBe('192');
  });
});

const submitVideo = async (presets?: Parameters<typeof VideoConversionForm>[0]['presets']) => {
  const onSubmit = vi.fn();
  render(<VideoConversionForm onSubmit={onSubmit} isLoading={false} presets={presets} />);
  await act(async () => { fireEvent.submit(document.querySelector('form') as HTMLFormElement); });
  await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  return onSubmit.mock.calls[0][0];
};

describe('VideoConversionForm preset', () => {
  it('frame-interpolation preset mounts with op selected, 60 fps, fps picker before the model select', async () => {
    const preset = page('ai-frame-interpolation').embed.preset as Extract<EmbedPreset, { aiOperation: 'frame_interpolation' }>;
    const data = await submitVideo({ aiPreset: preset });
    expect((screen.getByLabelText('interface:aiVideoTools.operationLabel') as HTMLSelectElement).value).toBe('frame_interpolation');
    const fps = document.getElementById('ai-target-fps') as HTMLElement;
    const model = document.getElementById('ai-rife-model') as HTMLElement;
    expect(fps.compareDocumentPosition(model) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(data.ai).toMatchObject({ enabled: true, operation: 'frame_interpolation', frameInterpolation: { targetFps: 60 } });
    expect(data.format).toBe('mp4');
  });

  it('without a preset: ai off, picker absent, mp4/medium/speed 1 (unchanged defaults)', async () => {
    const data = await submitVideo();
    expect(document.getElementById('ai-target-fps')).toBeNull();
    expect(data.ai).toMatchObject({ enabled: false, operation: 'none' });
    expect(data.format).toBe('mp4');
    expect(data.quality).toBe('medium');
    expect(data.speed).toBe(1);
  });
});

describe('AIVideoTools fpsPickerOnTop', () => {
  const Harness = ({ top }: { top: boolean }) => {
    const { control, setValue } = useForm({ defaultValues: { ai: { operation: 'frame_interpolation' } } });
    return <AIVideoTools control={control} setValue={setValue} fpsPickerOnTop={top} />;
  };
  it('renders the picker once, first when asked and in the grid otherwise', () => {
    const { container, unmount } = render(<Harness top />);
    expect(container.querySelectorAll('#ai-target-fps').length).toBe(1);
    const order = (c: HTMLElement) => Array.from(c.querySelectorAll('select')).map((s) => s.id);
    expect(order(container)[1]).toBe('ai-target-fps');
    unmount();
    const r2 = render(<Harness top={false} />);
    expect(order(r2.container)[1]).toBe('ai-target-fps');
    expect(r2.container.querySelectorAll('#ai-target-fps').length).toBe(1);
  });
});

describe('EmbeddedToolPanel dispatch', () => {
  it('compress-video renders the VideoCompressorPanel via preset.panel', () => {
    const e = page('compress-video').embed;
    render(<EmbeddedToolPanel toolSlug="compress-video" defaultMediaKind={e.defaultMediaKind} defaultTask={e.defaultTask} preset={e.preset} />);
    expect(screen.getByTestId('dyn-video-compressor-panel')).toBeTruthy();
  });
  it('without the preset the generic compress_video task does not render the compressor', () => {
    render(<EmbeddedToolPanel toolSlug="compress-video" defaultMediaKind="video" defaultTask="compress_video" />);
    expect(screen.queryByTestId('dyn-video-compressor-panel')).toBeNull();
  });
});
