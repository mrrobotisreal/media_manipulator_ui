/**
 * 16-bit PCM WAV encoding for the voices result's "Download WAV" (MM78 decision 5).
 *
 * MM77 writes speech.wav beside speech.mp3, but only the MP3 is served
 * (/api/download/:jobId); there is no route for the WAV. Rather than invent one, the
 * browser decodes the MP3 it already holds (Web Audio decodeAudioData) and writes a WAV
 * here. Pure: no DOM, no Web Audio, so the byte layout is unit-tested.
 */
export function encodeWav(channels: Float32Array[], sampleRate: number): Blob {
  const numChannels = Math.max(1, channels.length);
  const frames = channels[0]?.length ?? 0;
  const bytesPerSample = 2;
  const dataBytes = frames * numChannels * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(buffer);
  const ascii = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  ascii(0, 'RIFF');
  view.setUint32(4, 36 + dataBytes, true);
  ascii(8, 'WAVE');
  ascii(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true);
  view.setUint16(32, numChannels * bytesPerSample, true);
  view.setUint16(34, 16, true);
  ascii(36, 'data');
  view.setUint32(40, dataBytes, true);
  let offset = 44;
  for (let i = 0; i < frames; i++) {
    for (let c = 0; c < numChannels; c++) {
      const v = Math.max(-1, Math.min(1, channels[c]?.[i] ?? 0));
      view.setInt16(offset, v < 0 ? Math.round(v * 0x8000) : Math.round(v * 0x7fff), true);
      offset += 2;
    }
  }
  return new Blob([buffer], { type: 'audio/wav' });
}

/** Decode an MP3 (or any browser-decodable audio) blob and re-encode it as WAV. */
export async function blobToWav(blob: Blob): Promise<Blob> {
  const AC =
    globalThis.AudioContext ?? (globalThis as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) throw new Error('Web Audio unavailable');
  const ctx = new AC();
  try {
    const audio = await ctx.decodeAudioData(await blob.arrayBuffer());
    const channels = Array.from({ length: audio.numberOfChannels }, (_, c) => audio.getChannelData(c));
    return encodeWav(channels, audio.sampleRate);
  } finally {
    void ctx.close().catch(() => undefined);
  }
}

/** `talk_voice.mp3` → `talk_voice.wav`. */
export function wavFileName(mp3Name: string): string {
  const base = mp3Name.replace(/\.[^.]+$/, '') || 'speech';
  return `${base}.wav`;
}
