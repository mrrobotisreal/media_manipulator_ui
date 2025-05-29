import { z } from "zod";
import { imageConversionSchema } from "./imageSchema";
import { videoConversionSchema } from "./videoSchema";
import { audioConversionSchema } from "./audioSchema";

export type ConversionFormData = z.infer<typeof imageConversionSchema> | z.infer<typeof videoConversionSchema> | z.infer<typeof audioConversionSchema>;
