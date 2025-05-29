import { z } from 'zod';

export const audioConversionSchema = z.object({
  format: z.enum(['mp3', 'wav', 'aac', 'ogg']),
  bitrate: z.enum(['128', '192', '256', '320']).default('192'),
  speed: z.number().min(0.25).max(4).default(1),
  volume: z.number().min(0.1).max(2).default(1),
});
