import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { defaultDemoLanguageFor, VOICE_DEMO_LANGUAGES, VOICES } from '@/content/voices';

describe('voices', () => {
  it('ships every rendition file the players point at', () => {
    for (const voice of VOICES) {
      expect(voice.renditions.map((r) => r.lang)).toEqual(VOICE_DEMO_LANGUAGES.map((l) => l.code));
      for (const r of voice.renditions) {
        expect(r.durationSeconds, `${voice.id}-${r.lang}`).toBeGreaterThan(0);
        for (const s of r.sources) {
          expect(existsSync(join(process.cwd(), 'public', s.src)), s.src).toBe(true);
        }
      }
    }
  });

  it('links each voice to its public ElevenLabs share page', () => {
    for (const voice of VOICES) {
      expect(voice.elevenLabsUrl).toMatch(/^https:\/\/elevenlabs\.io\/app\/voice-lab\/share\/[0-9a-f]+\/\w+$/);
    }
  });

  it('preselects the site language when there is a demo in it', () => {
    expect(defaultDemoLanguageFor('ru-RU')).toBe('ru');
    expect(defaultDemoLanguageFor('he-IL')).toBe('he');
    expect(defaultDemoLanguageFor('en-US')).toBe('en');
    expect(defaultDemoLanguageFor('pt-BR')).toBe('en');
    expect(defaultDemoLanguageFor(undefined)).toBe('en');
  });
});
