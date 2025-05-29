import { z } from 'zod';

export const videoConversionSchema = z.object({
  format: z.enum(['mp4', 'webm', 'avi', 'mov']),
  width: z.number().min(1).max(4096).optional(),
  height: z.number().min(1).max(4096).optional(),
  preserveAspectRatio: z.boolean().default(true),
  speed: z.number().min(0.25).max(4).default(1),
  quality: z.enum(['low', 'medium', 'high']).default('medium'),
});
