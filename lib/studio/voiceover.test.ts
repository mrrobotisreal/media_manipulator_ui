import { describe, expect, it } from 'vitest';
import {
  classifyMicError,
  formatElapsed,
  isEmbeddedFrame,
  levelFromTimeDomain,
  pickVoiceoverMime,
  voiceoverContentType,
  voiceoverExtension,
} from './voiceover';

describe('voiceover format selection', () => {
  it('prefers webm/opus, then falls back to what the browser supports', () => {
    expect(pickVoiceoverMime(() => true)).toBe('audio/webm;codecs=opus');
    expect(pickVoiceoverMime((t) => t === 'audio/mp4')).toBe('audio/mp4');
    expect(pickVoiceoverMime(() => false)).toBe('');
    expect(pickVoiceoverMime(undefined)).toBe('');
  });

  it('maps recorder MIME types to server-allowlisted extensions and content types', () => {
    expect(voiceoverExtension('audio/webm;codecs=opus')).toBe('webm');
    expect(voiceoverExtension('audio/mp4')).toBe('m4a');
    expect(voiceoverExtension('audio/ogg;codecs=opus')).toBe('ogg');
    expect(voiceoverContentType('audio/webm;codecs=opus')).toBe('audio/webm');
    expect(voiceoverContentType('video/webm')).toBe('audio/webm');
  });
});

describe('mic failures', () => {
  it('distinguishes a user denial from a host that did not grant allow="microphone"', () => {
    const denied = { name: 'NotAllowedError' };
    expect(classifyMicError(denied, false)).toBe('denied');
    expect(classifyMicError(denied, true)).toBe('host_blocked');
    expect(classifyMicError({ name: 'NotFoundError' }, true)).toBe('unavailable');
    expect(classifyMicError(null, false)).toBe('unavailable');
  });

  it('detects framing, including cross-origin top access that throws', () => {
    expect(isEmbeddedFrame({ self: 1, top: 1 })).toBe(false);
    expect(isEmbeddedFrame({ self: 1, top: 2 })).toBe(true);
    const throwing = {
      self: 1,
      get top(): unknown {
        throw new Error('cross-origin');
      },
    };
    expect(isEmbeddedFrame(throwing)).toBe(true);
    expect(isEmbeddedFrame(undefined)).toBe(false);
  });
});

describe('meter and clock', () => {
  it('formats elapsed time', () => {
    expect(formatElapsed(0)).toBe('0:00');
    expect(formatElapsed(65_900)).toBe('1:05');
    expect(formatElapsed(-5)).toBe('0:00');
  });

  it('reads RMS level from time-domain bytes', () => {
    expect(levelFromTimeDomain([])).toBe(0);
    expect(levelFromTimeDomain(new Uint8Array(64).fill(128))).toBe(0);
    expect(levelFromTimeDomain(new Uint8Array(64).fill(255))).toBeGreaterThan(0.9);
  });
});
