/**
 * MP4 / WebM export (ticket MM47 decision 4): WebCodecs `VideoEncoder`
 * encodes, `mediabunny` (MPL-2.0, unmodified, attributed on /licenses) muxes.
 *
 *   MP4  → H.264 (High profile), else AV1 where `isConfigSupported` says so
 *   WebM → VP9 (profile 0), else AV1
 *
 * Each frame is rendered by the frame renderer (`frames.ts`), wrapped in a
 * `VideoFrame` with timestamp `i / fps`, encoded and closed at once, so only
 * the encoder's own queue holds frames. Backpressure: the loop waits while
 * `encodeQueueSize` is above `MAX_ENCODE_QUEUE`, and every packet handed to
 * the muxer is awaited (mediabunny's `add` promise is its writer
 * backpressure). Keyframe every 2 s. Even dimensions are enforced by the
 * caller (`outputSize(…, even: true)`) and re-checked here. No audio.
 *
 * Frames are flattened onto the canvas background: an opaque background is
 * drawn by the SVG itself, a transparent one becomes white (decision 9).
 *
 * The encoder and the muxer are injectable (`VideoDeps`) so tests use a fake
 * `VideoEncoder` and a mediabunny stub. The real muxer loads mediabunny with
 * a dynamic `import()` only when a video export starts.
 */
import { createFrameRenderer, frameCount, frameTime } from './frames';
import { CONTAINER_CODECS, codecString, videoBitrate, type VideoCodecId } from './capabilities';
import { isTransparentBackground, type RasterResult } from './gif';
import { RasterAbortError, checkBytes, throwIfAborted, yieldToEventLoop, type RasterJob } from './pipeline';

export type VideoContainer = keyof typeof CONTAINER_CODECS;

/** At most this many frames waiting inside the encoder. */
export const MAX_ENCODE_QUEUE = 4;
/** Keyframe interval, seconds. */
export const KEYFRAME_SECONDS = 2;

export interface VideoEncoderConfigLike {
  codec: string;
  width: number;
  height: number;
  bitrate: number;
  framerate: number;
  latencyMode?: 'quality' | 'realtime';
  avc?: { format: 'avc' | 'annexb' };
}

export interface EncodedChunkLike {
  type: 'key' | 'delta';
  timestamp: number;
  duration: number | null;
  byteLength: number;
  copyTo(dest: Uint8Array): void;
}

export interface VideoEncoderLike {
  readonly state: 'unconfigured' | 'configured' | 'closed';
  readonly encodeQueueSize: number;
  configure(config: VideoEncoderConfigLike): void;
  encode(frame: unknown, options?: { keyFrame?: boolean }): void;
  flush(): Promise<void>;
  close(): void;
  addEventListener?(type: 'dequeue', listener: () => void, options?: { once?: boolean }): void;
}

export interface VideoEncoderCtorLike {
  new (init: { output: (chunk: EncodedChunkLike, meta?: unknown) => void; error: (e: unknown) => void }): VideoEncoderLike;
  isConfigSupported(config: VideoEncoderConfigLike): Promise<{ supported?: boolean }>;
}

export interface VideoFrameLike {
  close(): void;
}

export type VideoFrameCtorLike = new (source: unknown, init: { timestamp: number; duration: number }) => VideoFrameLike;

/** The muxer seam (mediabunny in the browser, a stub in tests). */
export interface VideoMuxer {
  add(chunk: EncodedChunkLike, meta?: unknown): Promise<void>;
  /** Bytes written to the output so far (for the size guard). */
  bytes(): number;
  finalize(): Promise<Blob>;
  cancel(): Promise<void>;
}

export type CreateMuxer = (opts: { container: VideoContainer; codec: VideoCodecId; fps: number; width: number; height: number }) => Promise<VideoMuxer>;

export interface VideoDeps {
  VideoEncoder: VideoEncoderCtorLike;
  VideoFrame: VideoFrameCtorLike;
  createMuxer: CreateMuxer;
}

export interface VideoJob extends RasterJob {
  container: VideoContainer;
  deps?: VideoDeps;
}

export interface VideoResult extends RasterResult {
  codec: VideoCodecId;
}

export class VideoUnsupportedError extends Error {
  constructor(readonly container: VideoContainer) {
    super(`No supported ${container} video codec`);
    this.name = 'VideoUnsupportedError';
  }
}

/** mediabunny's codec ids. */
const MB_CODEC: Record<VideoCodecId, 'avc' | 'vp9' | 'av1'> = { h264: 'avc', vp9: 'vp9', av1: 'av1' };

/** The real muxer: mediabunny `Output` + `EncodedVideoPacketSource` into a `BufferTarget`. */
export const mediabunnyMuxer: CreateMuxer = async ({ container, codec, fps }) => {
  const mb = await import('mediabunny');
  const target = new mb.BufferTarget();
  // MP4: moov first ("in-memory" fast start) so players can start at once.
  const format = container === 'mp4' ? new mb.Mp4OutputFormat({ fastStart: 'in-memory' }) : new mb.WebMOutputFormat();
  const output = new mb.Output({ format, target });
  const source = new mb.EncodedVideoPacketSource(MB_CODEC[codec]);
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
      const packet = new mb.EncodedPacket(data, chunk.type, chunk.timestamp / 1e6, (chunk.duration ?? 0) / 1e6);
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

export function browserVideoDeps(): VideoDeps | null {
  const g = globalThis as unknown as { VideoEncoder?: VideoEncoderCtorLike; VideoFrame?: VideoFrameCtorLike };
  if (!g.VideoEncoder || !g.VideoFrame) return null;
  return { VideoEncoder: g.VideoEncoder, VideoFrame: g.VideoFrame, createMuxer: mediabunnyMuxer };
}

export function encoderConfig(codec: VideoCodecId, width: number, height: number, fps: number): VideoEncoderConfigLike {
  const config: VideoEncoderConfigLike = {
    codec: codecString(codec, width, height, fps),
    width,
    height,
    bitrate: videoBitrate(width, height, fps),
    framerate: fps,
    latencyMode: 'quality',
  };
  if (codec === 'h264') config.avc = { format: 'avc' };
  return config;
}

/** The first codec of the container whose exact config the browser supports. */
export async function chooseVideoCodec(deps: Pick<VideoDeps, 'VideoEncoder'>, container: VideoContainer, width: number, height: number, fps: number): Promise<{ codec: VideoCodecId; config: VideoEncoderConfigLike } | null> {
  for (const codec of CONTAINER_CODECS[container]) {
    const config = encoderConfig(codec, width, height, fps);
    try {
      if ((await deps.VideoEncoder.isConfigSupported(config)).supported === true) return { codec, config };
    } catch {
      // try the next codec
    }
  }
  return null;
}

function waitForQueue(encoder: VideoEncoderLike, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (encoder.encodeQueueSize <= MAX_ENCODE_QUEUE || signal?.aborted) return resolve();
    if (encoder.addEventListener) encoder.addEventListener('dequeue', () => resolve(), { once: true });
    else setTimeout(resolve, 4);
  });
}

export async function exportVideo(job: VideoJob): Promise<VideoResult> {
  const { doc, size, fps, startMs, endMs, signal, container } = job;
  throwIfAborted(signal);
  if (size.width % 2 || size.height % 2) throw new Error('video dimensions must be even');
  const deps = job.deps ?? browserVideoDeps();
  if (!deps) throw new VideoUnsupportedError(container);
  const chosen = await chooseVideoCodec(deps, container, size.width, size.height, fps);
  if (!chosen) throw new VideoUnsupportedError(container);
  throwIfAborted(signal);

  const underlay = isTransparentBackground(doc.canvas.background) ? '#ffffff' : null;
  const renderer = createFrameRenderer(doc, size, { underlay, env: job.env });
  const total = frameCount(endMs - startMs, fps);
  const muxer = await deps.createMuxer({ container, codec: chosen.codec, fps, width: size.width, height: size.height });

  let failure: unknown = null;
  let muxing: Promise<void> = Promise.resolve();
  const encoder = new deps.VideoEncoder({
    output: (chunk, meta) => {
      muxing = muxing.then(() => muxer.add(chunk, meta)).catch((e) => {
        failure ??= e;
      });
    },
    error: (e) => {
      failure ??= e;
    },
  });
  const close = () => {
    if (encoder.state !== 'closed') encoder.close();
  };
  const onAbort = () => close();
  signal?.addEventListener('abort', onAbort, { once: true });
  try {
    encoder.configure(chosen.config);
    const frameUs = 1e6 / fps;
    const keyEvery = Math.max(1, Math.round(fps * KEYFRAME_SECONDS));
    for (let i = 0; i < total; i++) {
      const canvas = await renderer.render(frameTime(i, fps, startMs));
      throwIfAborted(signal);
      if (failure) throw failure;
      const frame = new deps.VideoFrame(canvas, { timestamp: Math.round(i * frameUs), duration: Math.round(frameUs) });
      try {
        encoder.encode(frame, { keyFrame: i % keyEvery === 0 });
      } finally {
        frame.close();
      }
      await waitForQueue(encoder, signal);
      await muxing;
      throwIfAborted(signal);
      checkBytes(muxer.bytes(), job);
      job.onProgress?.({ phase: 'render', done: i + 1, total, bytes: muxer.bytes() });
      await yieldToEventLoop();
    }
    job.onProgress?.({ phase: 'finalize', done: 0, total: 1, bytes: muxer.bytes() });
    await encoder.flush();
    await muxing;
    if (failure) throw failure;
    throwIfAborted(signal);
    const blob = await muxer.finalize();
    job.onProgress?.({ phase: 'finalize', done: 1, total: 1, bytes: blob.size });
    return { blob, frames: total, bytes: blob.size, codec: chosen.codec };
  } catch (e) {
    await muxer.cancel().catch(() => {});
    if (signal?.aborted) throw new RasterAbortError();
    throw e;
  } finally {
    signal?.removeEventListener('abort', onAbort);
    close();
  }
}
