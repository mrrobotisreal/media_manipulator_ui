import { z } from 'zod';

export const imageConversionSchema = z.object({
  format: z.enum(['jpg', 'png', 'webp', 'gif']),
  width: z.number().min(1).max(4096).optional(),
  height: z.number().min(1).max(4096).optional(),
  quality: z.number().min(1).max(100).default(85),
  filter: z.enum(['none', 'grayscale', 'sepia', 'blur', 'sharpen', 'swirl', 'barrel-distortion', 'oil-painting', 'vintage', 'emboss', 'charcoal', 'sketch', 'rotate-45º', 'rotate-90º', 'rotate-180º', 'rotate-270º']).default('none'),
  tint: z.string().optional(),
  crop: z.object({
    x: z.number().min(0),
    y: z.number().min(0),
    width: z.number().min(1),
    height: z.number().min(1),
  }).optional(),
  textOverlay: z.object({
    text: z.string().max(500).optional(),
    size: z.number().min(8).max(512).optional(),
    color: z.string().optional(),
    strokeColor: z.string().optional(),
    strokeWidth: z.number().min(0).max(32).optional(),
    gravity: z.enum(['NorthWest', 'North', 'NorthEast', 'West', 'Center', 'East', 'SouthWest', 'South', 'SouthEast']).optional(),
    font: z.enum(['default', 'DejaVu-Sans', 'DejaVu-Serif', 'DejaVu-Sans-Mono', 'Liberation-Sans', 'Liberation-Serif', 'Liberation-Mono']).optional(),
    x: z.number().min(0).optional(),
    y: z.number().min(0).optional(),
  }).optional(),
  metadataMode: z.enum(['keep', 'strip', 'custom']).default('keep'),
  removeMetadata: z.boolean().optional(),
  metadata: z.object({
    title: z.string().max(1000).optional(),
    author: z.string().max(1000).optional(),
    description: z.string().max(1000).optional(),
    copyright: z.string().max(1000).optional(),
    comment: z.string().max(1000).optional(),
    keywords: z.string().max(1000).optional(),
    exifTiff: z.record(z.string()).optional(),
    gpsLocation: z.record(z.string()).optional(),
    iptc: z.record(z.string()).optional(),
    advanced: z.record(z.string()).optional(),
  }).optional(),
  gpsOptions: z.object({
    removeLocationData: z.boolean().optional(),
    replaceLocationData: z.boolean().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    altitude: z.number().optional(),
    roundLocationPrecision: z.boolean().optional(),
    precisionDecimals: z.number().min(0).max(8).optional(),
    removeCaptureDirection: z.boolean().optional(),
    removeGpsTimestamp: z.boolean().optional(),
    removeAltitude: z.boolean().optional(),
    removeDestinationFields: z.boolean().optional(),
  }).optional(),
  advancedTags: z.record(z.string()).optional(),

  // AI image tools (Phase 1). When ai.enabled is true and ai.operation is not
  // 'none', the API runs the AI op and bypasses the normal ImageMagick chain.
  ai: z.object({
    enabled: z.boolean().default(false).optional(),
    operation: z.enum(['none', 'face_privacy', 'remove_background', 'ai_upscale', 'redact_text', 'remove_object']).default('none'),
    faceMode: z.enum(['blur', 'pixelate', 'blackbox']).optional(),
    backgroundModel: z.enum([
      'birefnet-general',
      'birefnet-general-lite',
      'isnet-general-use',
      'u2net',
      'u2netp',
      'u2net_human_seg',
      'birefnet-portrait',
    ]).optional(),
    upscaleScale: z.union([z.literal(2), z.literal(4)]).optional(),
    upscaleModel: z.enum(['realesrgan-x4plus', 'realesrgan-x4plus-anime', 'realesr-animevideov3']).optional(),
    textDetect: z.enum(['pii', 'all-text']).optional(),
    textRedaction: z.enum(['blackbox', 'blur', 'pixelate']).optional(),
    // Optional face selection driven by /api/ai/faces/detect. When sessionId
    // is absent or selectionMode is 'all', the backend keeps the legacy
    // behavior of obscuring every detected face.
    faceSelection: z.object({
      sessionId: z.string().optional(),
      selectionMode: z.enum(['all', 'only_selected', 'all_except_selected']).default('all').optional(),
      selectedFaceIds: z.array(z.string()).default([]).optional(),
    }).optional(),
    // remove_object: user-drawn rectangles covering the object(s) to inpaint.
    // Coordinates are normalized to [0,1] relative to the original image so
    // the backend can rasterize a same-sized PNG mask for LaMa.
    removeObjectMask: z.object({
      rectangles: z.array(z.object({
        x: z.number().min(0).max(1),
        y: z.number().min(0).max(1),
        width: z.number().min(0).max(1),
        height: z.number().min(0).max(1),
      })).min(1).optional(),
    }).optional(),
  }).optional(),
});
