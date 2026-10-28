import { describe, expect, it } from 'vitest';
import { encodeWav, wavFileName } from './wav';

describe('encodeWav', () => {
  it('writes a 44-byte PCM header and clamped little-endian 16-bit samples', async () => {
    const blob = encodeWav([new Float32Array([0, 1, -1, 2])], 24000);
    expect(blob.type).toBe('audio/wav');
    const view = new DataView(await blob.arrayBuffer());
    const text = (o: number) => String.fromCharCode(...[0, 1, 2, 3].map((i) => view.getUint8(o + i)));
    expect(text(0)).toBe('RIFF');
    expect(text(8)).toBe('WAVE');
    expect(view.getUint16(22, true)).toBe(1);
    expect(view.getUint32(24, true)).toBe(24000);
    expect(view.getUint32(40, true)).toBe(8);
    expect([0, 1, 2, 3].map((i) => view.getInt16(44 + i * 2, true))).toEqual([0, 32767, -32768, 32767]);
  });

  it('interleaves stereo', async () => {
    const view = new DataView(await encodeWav([new Float32Array([1]), new Float32Array([-1])], 8000).arrayBuffer());
    expect(view.getUint16(22, true)).toBe(2);
    expect([view.getInt16(44, true), view.getInt16(46, true)]).toEqual([32767, -32768]);
  });

  it('names the file after the MP3', () => {
    expect(wavFileName('talk_voice.mp3')).toBe('talk_voice.wav');
  });
});
