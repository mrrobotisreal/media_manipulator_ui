import { z } from 'zod';

// Options for the PDF -> image direction (pdf-to-jpg, pdf-to-png, pdf-converter
// when a PDF is uploaded). The backend reads these from the job options map.
export const pdfConversionSchema = z.object({
  format: z.enum(['jpg', 'png']),
  pageSelection: z.enum(['all', 'first']).default('all'),
  dpi: z.number().min(50).max(400).default(150),
  quality: z.number().min(1).max(100).default(90),
});

export type PdfConversionFormData = z.infer<typeof pdfConversionSchema>;
