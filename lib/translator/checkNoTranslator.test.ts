import { describe, expect, it } from 'vitest';

import { findTranslatorTraces } from '../../scripts/check-no-translator-in-prod.mjs';
import { TRANSLATOR_SENTINEL } from './keyMarker';
import { appendMarker, encodeIndex } from './markerCodec';

describe('check-no-translator-in-prod', () => {
  it('flags the sentinel, the codec tag, the runtime slot and marker output (raw and escaped)', () => {
    expect(findTranslatorTraces(`var s="${TRANSLATOR_SENTINEL}"`)).toEqual(['sentinel']);
    expect(findTranslatorTraces('throw new RangeError(`__MM_TRANSLATOR_CODEC__: …`)')).toEqual(['marker encoder']);
    expect(findTranslatorTraces('globalThis.__mmTranslatorMarkerRuntime')).toEqual(['marker runtime slot']);
    expect(findTranslatorTraces(`<p>${appendMarker('Hallo', 99)}</p>`)).toEqual(['key-marker terminator (raw)']);
    expect(findTranslatorTraces(JSON.stringify(encodeIndex(5)).replace(/[‌‍]/g, (c) => `\\u${c.charCodeAt(0).toString(16).toUpperCase()}`))).toEqual([
      'key-marker terminator (escaped)',
    ]);
  });

  it('ignores genuine joiners in shipped copy (Hindi, Persian, emoji)', () => {
    expect(findTranslatorTraces('क्‍ष क्‌ष می‌خواهم 👨‍👩‍👧‍👦 \\u200d \\u200c')).toEqual([]);
  });
});
