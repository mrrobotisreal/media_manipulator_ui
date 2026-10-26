/**
 * mediabunny muxer for MP4 / WebM exports (ticket MM47 decision 4).
 * mediabunny is MPL-2.0 and used unmodified (design §4, `/licenses`). Only
 * this module imports it, and only `video.ts` loads this module, with a
 * dynamic import when a video export starts. The named imports let the
 * bundler drop the demuxers, decoders and converters we never use.
 */
import { BufferTarget, EncodedPacket, EncodedVideoPacketSource, Mp4OutputFormat, Output, WebMOutputFormat } from 'mediabunny';

import type { VideoCodecId } from './capabilities';
import type { CreateMuxer } from './video';

/** mediabunny's codec ids. */
const MB_CODEC: Record<VideoCodecId, 'avc' | 'vp9' | 'av1'> = { h264: 'avc', vp9: 'vp9', av1: 'av1' };

/** `Output` + `EncodedVideoPacketSource` into a `BufferTarget`. */
export const createMediabunnyMuxer: CreateMuxer = async ({ container, codec, fps }) => {
  const target = new BufferTarget();
  // MP4: moov first ("in-memory" fast start) so players can start at once.
  const format = container === 'mp4' ? new Mp4OutputFormat({ fastStart: 'in-memory' }) : new WebMOutputFormat();
  const output = new Output({ format, target });
  const source = new EncodedVideoPacketSource(MB_CODEC[codec]);
  output.addVideoTrack(source, { frameRate: fps });
  await output.start();
  let bytes = 0;
  return {
    async add(chunk, meta) {
      bytes += chunk.byteLength;
      // Same conversion as EncodedPacket.fromEncodedChunk (µs → s), without its
      // instanceof check, so the muxer is testable with plain chunks.
      const data = new Uint8Array(chunk.byteLength);
      chunk.copyTo(data);
      const packet = new EncodedPacket(data, chunk.type, chunk.timestamp / 1e6, (chunk.duration ?? 0) / 1e6);
      await source.add(packet, meta as EncodedVideoChunkMetadata | undefined);
    },
    bytes: () => bytes,
    async finalize() {
      await output.finalize();
      if (!target.buffer) throw new Error('muxer produced no output');
      return new Blob([target.buffer], { type: container === 'mp4' ? 'video/mp4' : 'video/webm' });
    },
    async cancel() {
      if (output.state !== 'finalized' && output.state !== 'canceled') await output.cancel();
    },
  };
};
