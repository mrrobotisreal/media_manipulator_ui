import { z } from "zod";
import { imageConversionSchema } from "./imageSchema";
import { videoConversionSchema } from "./videoSchema";
import { audioConversionSchema } from "./audioSchema";
import { pdfConversionSchema } from "./pdfSchema";

export type ConversionFormData = z.infer<typeof imageConversionSchema> | z.infer<typeof videoConversionSchema> | z.infer<typeof audioConversionSchema> | z.infer<typeof pdfConversionSchema>;
