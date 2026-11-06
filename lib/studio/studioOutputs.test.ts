import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  STATIC_STUDIO_OUTPUTS as T,
  accessFromLimits,
  bitrateOptions,
  choiceTokens,
  codecOptions,
  containerOptions,
  defaultOutputAccess,
  defaultPresetKey,
  fitChoice,
  lockFor,
  needsAdvanced,
  outputHumanLabel,
  outputLabel,
  outputWarnings,
  parseOutputLabel,
  presetOptions,
  type StudioOutputAccess,
} from './studioOutputs';

// The tiers' default sets (API tiers.go defaults, decided 2026-11-05).
const ANON = ['mp4', 'mp3', 'wav', 'h264', 'aac', 'pcm_s16le'];
const FREE = [...ANON, 'hevc'];
const PREMIUM = [...FREE, 'mov', 'mkv'];
const access = (formats: string[], advanced: boolean, tier: StudioOutputAccess['tier']): StudioOutputAccess => ({ ...defaultOutputAccess(), formats, advanced, tier });

describe('studio output table identity (MM118)', () => {
  const apiFixture = join(process.cwd(), '..', 'media_manipulator_api', 'internal', 'services', 'testdata', 'studio_outputs.json');
  const local = readFileSync(join(process.cwd(), 'lib', 'studio', 'studioOutputs.json'), 'utf8');
  if (existsSync(apiFixture) && readFileSync(apiFixture, 'utf8').includes('"legacyFormats"')) {
    it('lib/studio/studioOutputs.json is the API fixture byte for byte', () => {
      expect(local).toBe(readFileSync(apiFixture, 'utf8'));
    });
  } else {
    it.skip(`skipped: ${apiFixture} not found (sibling media_manipulator_api checkout absent or pre-MM118)`, () => undefined);
  }
  it('every container × codec label round-trips and is in the closed list', () => {
    for (const c of T.containers) {
      for (const v of c.videoCodecs) {
        for (const a of c.audioCodecs) {
          const label = outputLabel({ container: c.key, videoCodec: v, audioCodec: a });
          expect(T.formats).toContain(label);
          expect(parseOutputLabel(label)).toMatchObject({ container: c.key, videoCodec: v, audioCodec: a });
        }
      }
    }
    expect(T.formats).toHaveLength(14);
  });
});

describe('locks (visible, never hidden)', () => {
  it('anonymous: H.265, MOV and MKV presets listed but locked with the unlocking plan', () => {
    const rows = presetOptions(access(ANON, false, 'anonymous'));
    expect(rows.map((r) => r.preset.key)).toEqual(T.presets.map((p) => p.key));
    const lock = Object.fromEntries(rows.map((r) => [r.preset.key, r.lock?.required ?? null]));
    expect(lock).toEqual({ mp4_h264: null, mp4_hevc: 'free', mov_h264: 'premium', mov_hevc: 'premium', mkv_hevc_aac: 'premium', audio_mp3: null, audio_wav: null });
  });
  it('free: H.265 unlocked, MOV still Premium, Advanced locked', () => {
    const a = access(FREE, false, 'free');
    expect(presetOptions(a).find((r) => r.preset.key === 'mp4_hevc')?.lock).toBeNull();
    expect(presetOptions(a).find((r) => r.preset.key === 'mov_h264')?.lock).toEqual({ option: 'mov', required: 'premium' });
    expect(lockFor([], a, true)).toEqual({ option: 'advanced', required: 'premium' });
  });
  it('premium: nothing locked, Advanced on', () => {
    const a = access(PREMIUM, true, 'premium');
    expect(presetOptions(a).every((r) => r.lock === null)).toBe(true);
    expect(lockFor([], a, true)).toBeNull();
    expect(containerOptions(a).every((o) => o.lock === null)).toBe(true);
  });
  it('unknown caller (API before MM118): nothing marked, the server decides', () => {
    expect(presetOptions(accessFromLimits(undefined, 'free')).every((r) => r.lock === null)).toBe(true);
  });
  it('the default preset is the first the caller may use', () => {
    expect(defaultPresetKey(access(ANON, false, 'anonymous'))).toBe('mp4_h264');
  });
});

describe('Advanced pickers filter by the table', () => {
  const a = access(PREMIUM, true, 'premium');
  it('greys codecs a container cannot carry, with the reason', () => {
    const mp4Audio = codecOptions('audio', 'mp4', a);
    expect(mp4Audio.find((o) => o.value === 'aac')).toMatchObject({ valid: true });
    expect(mp4Audio.find((o) => o.value === 'pcm_s16le')).toMatchObject({ valid: false, invalidBecause: 'mp4' });
    expect(codecOptions('audio', 'mkv', a).every((o) => o.valid)).toBe(true);
    expect(codecOptions('video', 'wav', a)).toEqual([{ value: 'none', valid: true, lock: null }]);
  });
  it('locks a valid codec the plan lacks', () => {
    expect(codecOptions('video', 'mp4', access(ANON, false, 'anonymous')).find((o) => o.value === 'hevc')?.lock).toEqual({ option: 'hevc', required: 'free' });
  });
  it('re-fits codecs and bitrate when the container changes', () => {
    expect(fitChoice({ container: 'mp4', videoCodec: 'hevc', audioCodec: 'pcm_s16le', audioBitrate: 0, audioChannels: 2 })).toMatchObject({ videoCodec: 'hevc', audioCodec: 'aac', audioBitrate: 192 });
    expect(fitChoice({ container: 'wav', videoCodec: 'h264', audioCodec: 'aac', audioBitrate: 320, audioChannels: 1 })).toEqual({ container: 'wav', videoCodec: 'none', audioCodec: 'pcm_s16le', audioBitrate: 0, audioChannels: 1 });
    expect(bitrateOptions('aac')).toEqual([128, 192, 256, 320]);
    expect(bitrateOptions('pcm_s16le')).toEqual([]);
  });
  it('advanced is a non-preset combination or a non-default bitrate/channels', () => {
    expect(needsAdvanced({ container: 'mp4', videoCodec: 'h264', audioCodec: 'aac', audioBitrate: 192, audioChannels: 2 })).toBe(false);
    expect(needsAdvanced({ container: 'mp4', videoCodec: 'h264', audioCodec: 'aac', audioBitrate: 0, audioChannels: 0 })).toBe(false);
    expect(needsAdvanced({ container: 'mp4', videoCodec: 'h264', audioCodec: 'aac', audioBitrate: 256, audioChannels: 2 })).toBe(true);
    expect(needsAdvanced({ container: 'mkv', videoCodec: 'h264', audioCodec: 'aac', audioBitrate: 192, audioChannels: 2 })).toBe(true);
  });
});

describe('warnings, tokens and labels', () => {
  it('warnings come from the table', () => {
    expect(outputWarnings({ container: 'mkv', videoCodec: 'hevc', audioCodec: 'aac' })).toEqual(['apple_incompatible', 'no_browser_preview']);
    expect(outputWarnings({ container: 'mov', videoCodec: 'h264', audioCodec: 'pcm_s16le' })).toEqual(['no_browser_preview']);
    expect(outputWarnings({ container: 'mp4', videoCodec: 'hevc', audioCodec: 'aac' })).toEqual([]);
  });
  it('tokens mirror the API (no none, no repeated mp3)', () => {
    expect(choiceTokens({ container: 'mp3', videoCodec: 'none', audioCodec: 'mp3' })).toEqual(['mp3']);
    expect(choiceTokens({ container: 'mov', videoCodec: 'hevc', audioCodec: 'aac' })).toEqual(['mov', 'hevc', 'aac']);
  });
  it('the exports panel label', () => {
    expect(outputHumanLabel({ container: 'mov', videoCodec: 'hevc', audioCodec: 'aac', audioBitrate: 192 })).toBe('MOV · H.265 · AAC 192k');
    expect(outputHumanLabel({ container: 'wav', videoCodec: 'none', audioCodec: 'pcm_s16le', audioBitrate: 0 })).toBe('WAV · PCM 16-bit');
    expect(outputHumanLabel({ container: 'mp3', videoCodec: 'none', audioCodec: 'mp3', audioBitrate: 192, audioChannels: 1 })).toBe('MP3 · mono');
  });
});
