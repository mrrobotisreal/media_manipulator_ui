import { describe, expect, it, vi } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  convertVoice,
  createVoice,
  fetchVoicesCapabilities,
  previewBlob,
  shiftVoice,
  speak,
  speakPreset,
  VOICE_ERROR_CODES,
  VoiceApiError,
  voiceErrorCode,
  voiceErrorKey,
  voiceErrorValues,
  type Fetcher,
} from './voicesApi';
import { VOICE_CONSENT_TEXT_VERSION, referenceLengthVerdict } from './consent';
import { VOICE_SHIFT_PRESETS, clampSemitones, pitchRatio } from './shift';
import en from '@/i18n/locales/en-us/interface/panels.json';

const ok = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('voices client (MM77 contract)', () => {
  it('capabilities is a GET on /voices/capabilities', async () => {
    const f = vi.fn(async () => ok({ enabled: false, warm: false }));
    const caps = await fetchVoicesCapabilities(f);
    expect(caps.enabled).toBe(false);
    expect((f.mock.calls[0] as unknown[])[0]).toMatch(/\/voices\/capabilities$/);
  });

  it('create voice: multipart reference + name + languageHint + consent=true + the consent text version', async () => {
    const f = vi.fn<Fetcher>(async () => ok({ id: 'v1', name: 'Me' }, 201));
    await createVoice(f, {
      reference: new Blob(['x'], { type: 'audio/webm' }),
      fileName: 'take.webm',
      name: 'Me',
      languageHint: 'en',
      consent: true,
      consentTextVersion: VOICE_CONSENT_TEXT_VERSION,
    });
    const [u, init] = f.mock.calls[0];
    expect(u).toMatch(/\/voices$/);
    expect(init?.method).toBe('POST');
    const form = init?.body as FormData;
    expect(form.get('consent')).toBe('true');
    expect(form.get('consentTextVersion')).toBe('2026-10-28');
    expect(form.get('name')).toBe('Me');
    expect(form.get('languageHint')).toBe('en');
    expect((form.get('reference') as File).name).toBe('take.webm');
  });

  it('speak routes: saved voice by id, preset by name, both 202 jobs', async () => {
    const f = vi.fn<Fetcher>(async () => ok({ jobId: 'j1', tool: 'voice_tts' }, 202));
    await speak(f, 'abc', { text: 'Hi', language: 'de', exaggeration: 0.5 });
    await speakPreset(f, 'Vivian', { text: 'Hi', language: 'en' });
    expect(f.mock.calls[0][0]).toMatch(/\/voices\/abc\/speak$/);
    expect(JSON.parse(String(f.mock.calls[0][1]?.body))).toEqual({ text: 'Hi', language: 'de', exaggeration: 0.5 });
    expect(f.mock.calls[1][0]).toMatch(/\/voices\/presets\/Vivian\/speak$/);
  });

  it('convert sends exactly one of voiceId / preset; shift sends semitones, formant and preset', async () => {
    const f = vi.fn<Fetcher>(async () => ok({ jobId: 'j', tool: 'voice_convert' }, 202));
    const input = new File(['a'], 'clip.wav', { type: 'audio/wav' });
    await convertVoice(f, { input, target: { preset: 'Ryan' } });
    let form = f.mock.calls[0][1]?.body as FormData;
    expect(form.get('preset')).toBe('Ryan');
    expect(form.get('voiceId')).toBeNull();
    await shiftVoice(f, { input, semitones: -4, formant: 'shifted', preset: 'deeper' });
    form = f.mock.calls[1][1]?.body as FormData;
    expect(f.mock.calls[1][0]).toMatch(/\/voices\/shift$/);
    expect([form.get('semitones'), form.get('formant'), form.get('preset')]).toEqual(['-4', 'shifted', 'deeper']);
  });

  it('a refusal becomes a VoiceApiError carrying the server code and its numbers', async () => {
    const f = vi.fn(async () => ok({ error: 'voice_limit', message: 'x', limit: 1, used: 1, tier: 'free' }, 403));
    const err = await createVoice(f, {
      reference: new Blob(['x']), fileName: 'a.webm', name: 'n', languageHint: 'en', consent: true, consentTextVersion: 'v',
    }).catch((e) => e);
    expect(err).toBeInstanceOf(VoiceApiError);
    expect(err.code).toBe('voice_limit');
    expect(voiceErrorValues(err)).toMatchObject({ limit: 1, used: 1 });
  });

  it('maps unknown and prose-only refusals to stable codes', () => {
    expect(voiceErrorCode(429, { error: 'Too many requests. Please slow down.' })).toBe('rate_limited');
    expect(voiceErrorCode(503, null)).toBe('voices_unavailable');
    expect(voiceErrorCode(401, {})).toBe('sign_in_required');
    expect(voiceErrorCode(500, { error: 'boom' })).toBe('generic');
    expect(voiceErrorCode(400, { error: 'reference_too_short' })).toBe('reference_too_short');
  });

  it('every error code the client knows has an English message (panels voiceTools.errors)', () => {
    const errors = (en as unknown as { voiceTools: { errors: Record<string, string> } }).voiceTools.errors;
    for (const code of VOICE_ERROR_CODES) {
      expect(errors[code], voiceErrorKey(code)).toBeTruthy();
    }
  });

  it('the ticket error codes are all mapped', () => {
    for (const code of ['consent_required', 'reference_too_short', 'reference_too_long', 'no_speech_detected', 'voice_limit', 'text_too_long', 'voice_convert_not_in_plan', 'voices_unavailable']) {
      expect(VOICE_ERROR_CODES as readonly string[]).toContain(code);
    }
  });

  it('decodes the inline design preview into an audio blob', async () => {
    const blob = previewBlob({ seed: 1, mime: 'audio/mpeg', seconds: 1, audioBase64: btoa('ID3') });
    expect(blob.type).toBe('audio/mpeg');
    expect(await blob.text()).toBe('ID3');
  });
});

describe('recorder length gate (5 to 60 s inclusive, like the server)', () => {
  it.each([
    [4.9, 'too_short'],
    [5, 'ok'],
    [60, 'ok'],
    [60.1, 'too_long'],
    [Number.NaN, 'too_short'],
  ] as const)('%s s → %s', (s, v) => expect(referenceLengthVerdict(s)).toBe(v));
});

describe('shifter presets mirror the Go table (services.VoiceShiftPresets)', () => {
  it('pins each preset to its semitone / formant pair', () => {
    expect(VOICE_SHIFT_PRESETS.map((p) => [p.id, p.semitones, p.formant])).toEqual([
      ['deeper', -4, 'shifted'],
      ['higher', 4, 'shifted'],
      ['child', 7, 'shifted'],
      ['elder', -2, 'preserved'],
      ['telephone', 0, 'preserved'],
    ]);
  });

  // When the API checkout sits next to this repo (the workspace layout), read the Go
  // table itself so a server-side change fails here too. Skipped elsewhere (CI).
  const goFile = [
    join(process.cwd(), '..', 'media_manipulator_api', 'internal', 'services', 'voices_shift.go'),
  ].find((p) => existsSync(p));
  it.skipIf(!goFile)('matches voices_shift.go row for row', () => {
    const src = readFileSync(goFile!, 'utf8');
    const rows = [...src.matchAll(/\{ID: "(\w+)", Semitones: (-?\d+), Formant: Formant(Shifted|Preserved)/g)].map((m) => [
      m[1],
      Number(m[2]),
      m[3].toLowerCase(),
    ]);
    expect(rows).toEqual(VOICE_SHIFT_PRESETS.map((p) => [p.id, p.semitones, p.formant]));
  });

  it('clamps to ±12 and computes the rubberband ratio', () => {
    expect(clampSemitones(20)).toBe(12);
    expect(clampSemitones(-20)).toBe(-12);
    expect(pitchRatio(3).toFixed(6)).toBe('1.189207');
  });
});
