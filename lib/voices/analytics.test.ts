import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const track = vi.hoisted(() => vi.fn());
vi.mock('@/lib/analytics', async (orig) => ({
  ...(await orig<typeof import('@/lib/analytics')>()),
  analytics: { track },
}));

import { EVENTS, EVENT_PRIORITY, PRIORITY_NORMAL } from '@/lib/analytics/events';
import { voiceSecondsBucket } from '@/lib/analytics/buckets';
import {
  resetVoiceAnalyticsForTests,
  trackVoiceCreated,
  trackVoiceGenerated,
  voiceGeneratedProps,
  voiceKindForTool,
} from './analytics';

// MM79 acceptance 4: the voices events and the bucket helper.

describe('voiceSecondsBucket (bucket boundaries 10, 30, 60, 300)', () => {
  it.each([
    [0, '0-10'],
    [-1, '0-10'],
    [NaN, '0-10'],
    [9.99, '0-10'],
    [10, '10-30'],
    [29.9, '10-30'],
    [30, '30-60'],
    [59.99, '30-60'],
    [60, '60-300'],
    [299.9, '60-300'],
    [300, '300+'],
    [3600, '300+'],
  ])('%s s → %s', (s, want) => {
    expect(voiceSecondsBucket(s)).toBe(want);
  });
});

describe('voice events', () => {
  beforeEach(() => {
    track.mockClear();
    resetVoiceAnalyticsForTests();
  });

  it('names and priorities come from the catalog mirror', () => {
    expect(EVENTS.VOICE_CREATED).toBe('voice_created');
    expect(EVENTS.VOICE_GENERATED).toBe('voice_generated');
    expect(EVENT_PRIORITY.voice_created).toBe(PRIORITY_NORMAL);
    expect(EVENT_PRIORITY.voice_generated).toBe(PRIORITY_NORMAL);
  });

  it('voice_created carries only kind and languageHint', () => {
    trackVoiceCreated('designed', 'de');
    expect(track).toHaveBeenCalledWith('voice_created', { kind: 'designed', languageHint: 'de' }, { feature: 'voices' });
  });

  it('voice_generated fires once per job, with job_id in the context', () => {
    expect(trackVoiceGenerated('j1', { tool: 'voice_tts', resultSeconds: 42, language: 'ru', source: 'darkroom' })).toBe(true);
    expect(trackVoiceGenerated('j1', { tool: 'voice_tts', resultSeconds: 42, language: 'ru', source: 'darkroom' })).toBe(false);
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith(
      'voice_generated',
      { kind: 'tts', secondsBucket: '30-60', language: 'ru', source: 'darkroom' },
      { job_id: 'j1', feature: 'voices' },
    );
  });

  it('shift and unknown languages read none; tools map to kinds', () => {
    expect(voiceKindForTool('voice_convert')).toBe('convert');
    expect(voiceKindForTool('voice_shift')).toBe('shift');
    expect(voiceKindForTool('voice_tts')).toBe('tts');
    expect(voiceGeneratedProps({ tool: 'voice_shift', resultSeconds: 5, language: 'en', source: 'tool_page' }).language).toBe('none');
    expect(voiceGeneratedProps({ tool: 'voice_convert', resultSeconds: undefined, language: undefined, source: 'tool_page' })).toEqual({
      kind: 'convert',
      secondsBucket: '0-10',
      language: 'none',
      source: 'tool_page',
    });
    // A free-text value can never travel.
    expect(voiceGeneratedProps({ tool: 'voice_tts', resultSeconds: 1, language: 'Hello world', source: 'tool_page' }).language).toBe('none');
  });
});

// The three-places agreement for these events (the analytics repo's parity test reads
// this file too; this side checks the Go catalog and EVENT_CATALOG.md when the sibling
// checkout is next door).
describe('catalog parity (voices)', () => {
  const root = [join(__dirname, '..', '..', '..', 'media-manipulator-analytics-mm79'), join(__dirname, '..', '..', '..', 'media-manipulator-analytics')].find(
    (p) => existsSync(join(p, 'internal', 'catalog', 'catalog.go')),
  );
  it.skipIf(!root)('voice_created / voice_generated agree with catalog.go and EVENT_CATALOG.md', () => {
    const go = readFileSync(join(root!, 'internal', 'catalog', 'catalog.go'), 'utf8');
    const doc = readFileSync(join(root!, 'docs', 'EVENT_CATALOG.md'), 'utf8');
    const want: Record<string, string[]> = {
      voice_created: ['kind', 'languageHint'],
      voice_generated: ['kind', 'secondsBucket', 'language', 'source'],
    };
    for (const [name, props] of Object.entries(want)) {
      expect(go).toContain(`"${name}"`);
      const row = doc.split('\n').find((l) => l.startsWith(`| \`${name}\` |`));
      expect(row, `${name} row`).toBeTruthy();
      expect(row).toContain('| 2 |');
      for (const p of props) expect(row).toContain(`\`${p}\``);
    }
  });
});
