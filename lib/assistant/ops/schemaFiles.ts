/**
 * MM108: the op-schema files the UI owns and the API byte-copies (design MEDI_ASSISTANT.md §8.2;
 * the photo-fixtures pattern). `lib/assistant/ops/schema/<surface>.json` is generated from the
 * Zod vocabularies by `npm run export:ops`; the API embeds the same bytes in
 * `internal/assistant/ops/schema/<surface>.json` and turns `apply_edits` on for that surface.
 * A test in each repo fails when the two copies differ.
 */
import { photoOpsJsonSchema } from './photo';
import { studioOpsJsonSchema } from './studio';
import { vectorOpsJsonSchema } from './vector';

/** Relative to the UI repo root. */
export const OPS_SCHEMA_DIR = 'lib/assistant/ops/schema';
export const API_OPS_SCHEMA_DIR = '../media_manipulator_api/internal/assistant/ops/schema';

/** Stable JSON: two-space indent, one trailing newline (the bytes both repos commit). */
export const schemaFileText = (schema: unknown): string => `${JSON.stringify(schema, null, 2)}\n`;

/** Every generated schema file, `<surface>.json` → bytes. MM109 adds studio, MM110 vector. */
export function buildOpsSchemaFiles(): Record<string, string> {
  return {
    'photo.json': schemaFileText(photoOpsJsonSchema()),
    'studio.json': schemaFileText(studioOpsJsonSchema()),
    'vector.json': schemaFileText(vectorOpsJsonSchema()),
  };
}
