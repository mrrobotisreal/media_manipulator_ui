import { z } from 'zod';

export const videoConversionSchema = z.object({
  format: z.enum(['mp4', 'webm', 'avi', 'mov', 'mkv', 'flv', 'wmv', 'prores', 'dnxhd', 'gif']),
  width: z.number().min(1).max(4096).optional(),
  height: z.number().min(1).max(4096).optional(),
  preserveAspectRatio: z.boolean().default(true),
  speed: z.number().min(0.25).max(4).default(1),
  quality: z.enum(['low', 'medium', 'high']).default('medium'),

  // Optional compression controls (video-compressor / compress-mp4 pages).
  // Mirror the backend models.VideoConversionOptions fields. All optional and
  // backward compatible — omitting them keeps the legacy quality behavior.
  videoCodec: z.enum(['h264', 'h265', 'vp9', 'av1']).optional(),
  crf: z.number().int().min(0).max(51).optional(),
  videoBitrateKbps: z.number().int().min(50).max(200000).optional(),
  audioBitrateKbps: z.number().int().min(8).max(1024).optional(),
  preset: z.enum(['ultrafast', 'superfast', 'veryfast', 'faster', 'fast', 'medium', 'slow', 'slower', 'veryslow']).optional(),
  stripAudio: z.boolean().optional(),

  // Trimming parameters (in seconds)
  trim: z.object({
    startTime: z.number().min(0),
    endTime: z.number().min(0),
  }).optional(),

  // Animated GIF tuning (only applied when format === 'gif').
  // Mirrors quick-gif2.sh: ffmpeg downscales to `width` at `fps`, then gifsicle
  // re-quantizes to `colors`, sets frame `delay`, and applies `optimize` level.
  gif: z.object({
    width: z.number().int().min(16).max(2000).default(900),
    fps: z.number().int().min(1).max(50).default(12),
    colors: z.number().int().min(2).max(256).default(128),
    delay: z.number().int().min(1).max(100).default(3),
    optimize: z.number().int().min(1).max(3).default(3),
  }).optional(),

  // Visual Effects
  visualEffects: z.object({
    // Color/Exposure
    brightness: z.number().min(-100).max(100).default(0).optional(),
    contrast: z.number().min(-100).max(100).default(0).optional(),
    saturation: z.number().min(-100).max(100).default(0).optional(),
    hue: z.number().min(-180).max(180).default(0).optional(),
    gamma: z.number().min(0.1).max(3.0).default(1.0).optional(),
    exposure: z.number().min(-3).max(3).default(0).optional(),
    shadows: z.number().min(-100).max(100).default(0).optional(),
    highlights: z.number().min(-100).max(100).default(0).optional(),

    // Blur/Sharpen
    gaussianBlur: z.number().min(0).max(50).default(0).optional(),
    motionBlur: z.object({
      angle: z.number().min(0).max(360).default(0),
      distance: z.number().min(0).max(100).default(0),
    }).optional(),
    unsharpMask: z.object({
      radius: z.number().min(0).max(10).default(1),
      amount: z.number().min(0).max(500).default(100),
      threshold: z.number().min(0).max(255).default(3),
    }).optional(),

    // Artistic
    artistic: z.enum(['none', 'oil-painting', 'watercolor', 'sketch', 'emboss', 'edge-detection', 'posterize']).default('none').optional(),

    // Noise
    noise: z.object({
      type: z.enum(['none', 'add', 'remove', 'denoise', 'grain', 'film']).default('none'),
      amount: z.number().min(0).max(100).default(0),
    }).optional(),
  }).optional(),

  // Geometric Transformations
  transform: z.object({
    // Rotation/Flip
    rotation: z.number().min(-360).max(360).default(0).optional(),
    flipHorizontal: z.boolean().default(false).optional(),
    flipVertical: z.boolean().default(false).optional(),

    // Cropping (already exists but expanding)
    crop: z.object({
      x: z.number().min(0),
      y: z.number().min(0),
      width: z.number().min(1),
      height: z.number().min(1),
    }).optional(),

    // Padding
    padding: z.object({
      top: z.number().min(0).default(0),
      bottom: z.number().min(0).default(0),
      left: z.number().min(0).default(0),
      right: z.number().min(0).default(0),
      color: z.string().default('#000000'),
    }).optional(),
  }).optional(),

  // Temporal Effects
  temporal: z.object({
    // Speed (already exists but expanding)
    variableSpeed: z.array(z.object({
      time: z.number().min(0),
      speed: z.number().min(0.1).max(10),
    })).optional(),

    // Reverse
    reverse: z.boolean().default(false).optional(),
    pingPong: z.boolean().default(false).optional(),

    // Frame Operations
    frameRate: z.object({
      target: z.number().min(1).max(120).optional(),
      interpolation: z.boolean().default(false),
    }).optional(),

    // Stabilization
    stabilization: z.object({
      enabled: z.boolean().default(false),
      shakiness: z.number().min(1).max(10).default(5),
      accuracy: z.number().min(1).max(15).default(9),
    }).optional(),
  }).optional(),

  // AI Video Tools
  //
  // Mirrors the backend AIVideoOptions struct. v1 only exposes frame
  // interpolation, but the enum is open so we can add more video AI ops
  // without breaking schema consumers.
  ai: z.object({
    enabled: z.boolean().default(false).optional(),
    operation: z.enum(['none', 'frame_interpolation']).default('none').optional(),
    frameInterpolation: z.object({
      targetFps: z.union([z.literal(48), z.literal(60), z.literal(120)]).default(60).optional(),
      model: z.enum(['rife-v4.6', 'rife-v4', 'rife-v2.3']).default('rife-v4.6').optional(),
      quality: z.enum(['low', 'medium', 'high']).default('medium').optional(),
      maxHeight: z.number().int().min(144).max(1080).default(720).optional(),
      preserveAudio: z.boolean().default(true).optional(),
    }).optional(),
  }).optional(),

  // Advanced Processing
  advanced: z.object({
    // Deinterlacing
    deinterlace: z.boolean().default(false).optional(),

    // HDR Processing
    hdr: z.object({
      enabled: z.boolean().default(false),
      toneMapping: z.enum(['none', 'hable', 'reinhard', 'mobius']).default('none'),
    }).optional(),

    // Color Space
    colorSpace: z.object({
      input: z.enum(['auto', 'rec709', 'rec2020', 'srgb', 'p3']).default('auto'),
      output: z.enum(['rec709', 'rec2020', 'srgb', 'p3']).default('rec709'),
    }).optional(),
  }).optional(),
});
