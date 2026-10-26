import { readFileSync } from 'node:fs';
import { join } from 'node:path';
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

  it('MM54: flags the server routes sentinel and jose / @octokit code', () => {
    expect(findTranslatorTraces('const s="__MM_TRANSLATOR_SERVER__"')).toEqual(['translator server routes']);
    expect(findTranslatorTraces('code="ERR_JWKS_NO_MATCHING_KEY"')).toEqual(['jose']);
    expect(findTranslatorTraces('`octokit-core.js/${VERSION}`')).toEqual(['@octokit/core']);
    expect(findTranslatorTraces('`octokit-rest.js/${VERSION}`')).toEqual(['@octokit/rest']);
    expect(findTranslatorTraces('"[universal-github-app-jwt] Private Key is in PKCS#1 format"')).toEqual(['@octokit/auth-app JWT']);
  });

  it('MM54: the needles really are in the installed jose and @octokit sources (so a leak would be caught)', () => {
    const read = (p: string) => readFileSync(join(__dirname, '..', '..', 'node_modules', p), 'utf8');
    expect(findTranslatorTraces(read('jose/dist/webapi/util/errors.js'))).toContain('jose');
    expect(findTranslatorTraces(read('@octokit/core/dist-src/index.js'))).toContain('@octokit/core');
    expect(findTranslatorTraces(read('@octokit/rest/dist-src/index.js'))).toContain('@octokit/rest');
    expect(findTranslatorTraces(read('universal-github-app-jwt/lib/get-token.js'))).toContain('@octokit/auth-app JWT');
  });

  it('ignores genuine joiners in shipped copy (Hindi, Persian, emoji)', () => {
    expect(findTranslatorTraces('क्‍ष क्‌ष می‌خواهم 👨‍👩‍👧‍👦 \\u200d \\u200c')).toEqual([]);
  });
});
