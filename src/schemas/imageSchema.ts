import { z } from 'zod';

export const imageConversionSchema = z.object({
  format: z.enum(['jpg', 'png', 'webp', 'gif']),
  width: z.number().min(1).max(4096).optional(),
  height: z.number().min(1).max(4096).optional(),
  quality: z.number().min(1).max(100).default(85),
  filter: z.enum(['none', 'grayscale', 'sepia', 'blur', 'sharpen']).default('none'),
  tint: z.string().optional(),
});
