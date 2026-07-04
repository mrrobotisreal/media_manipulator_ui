import { z } from 'zod';

// AI Document Scan options. Mirrors models.DocumentScanOptions on the Go side.
// `preclean` and `verify` schema defaults are conservative; the panel overrides
// `preclean` based on the chosen content mode (ON for handwriting/auto, OFF for
// printed — see document-scan-panel.tsx §5.8).
export const documentScanSchema = z.object({
  outputs: z.array(z.enum(['pdf', 'docx'])).min(1).default(['pdf']),
  contentMode: z.enum(['auto', 'printed', 'handwriting']).default('auto'),
  language: z.string().default('eng'),
  deskew: z.boolean().default(true),
  rotate: z.boolean().default(true),
  clean: z.boolean().default(false),
  // preclean: the PANEL sets this true when contentMode is 'handwriting' or
  // 'auto', false for 'printed' (see §5.8). The schema default is false; the
  // live default is mode-driven.
  preclean: z.boolean().default(false),
  structureEngine: z.enum(['paddleocr-vl', 'docling']).default('paddleocr-vl'),
  secondOpinion: z.boolean().default(false),
  secondOpinionEngine: z.enum(['paddleocr-vl', 'trocr', 'none']).default('paddleocr-vl'),
  verify: z.boolean().default(true),
  summarize: z.boolean().default(false),
});

export type DocumentScanFormData = z.infer<typeof documentScanSchema>;
