import { z } from 'zod';

export const videoConversionSchema = z.object({
  format: z.enum(['mp4', 'webm', 'avi', 'mov', 'mkv', 'flv', 'wmv', 'prores', 'dnxhd']),
  width: z.number().min(1).max(4096).optional(),
  height: z.number().min(1).max(4096).optional(),
  preserveAspectRatio: z.boolean().default(true),
  speed: z.number().min(0.25).max(4).default(1),
  quality: z.enum(['low', 'medium', 'high']).default('medium'),

  // Trimming parameters (in seconds)
  trim: z.object({
    startTime: z.number().min(0),
    endTime: z.number().min(0),
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
