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
});
