import type { LabParamsSchema } from './types';

export type LabFieldKind = 'select' | 'boolean' | 'number' | 'text';

export interface LabField {
  name: string;
  label: string;
  description?: string;
  kind: LabFieldKind;
  required: boolean;
  default?: string | number | boolean;
  options?: (string | number)[];
  min?: number;
  max?: number;
  integer?: boolean;
}

const isScalar = (v: unknown): v is string | number | boolean =>
  typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean';

/** Turns a draft-07 subset schema into a flat field list. Unsupported properties are skipped. */
export function schemaToFields(schema: LabParamsSchema | null | undefined): LabField[] {
  const props =
    schema && typeof schema === 'object' && schema.properties && typeof schema.properties === 'object'
      ? schema.properties
      : {};
  const required = new Set(Array.isArray(schema?.required) ? schema!.required : []);
  const fields: LabField[] = [];
  for (const [name, raw] of Object.entries(props)) {
    if (!raw || typeof raw !== 'object') continue;
    const type = raw.type;
    if (type !== 'string' && type !== 'number' && type !== 'integer' && type !== 'boolean') continue;
    const base = {
      name,
      label: typeof raw.title === 'string' && raw.title ? raw.title : name,
      description: typeof raw.description === 'string' ? raw.description : undefined,
      required: required.has(name),
      default: isScalar(raw.default) ? raw.default : undefined,
    };
    const options = Array.isArray(raw.enum)
      ? raw.enum.filter((o): o is string | number => typeof o === 'string' || typeof o === 'number')
      : [];
    if (options.length > 0 && type !== 'boolean') {
      fields.push({ ...base, kind: 'select', options });
    } else if (type === 'boolean') {
      fields.push({ ...base, kind: 'boolean' });
    } else if (type === 'number' || type === 'integer') {
      fields.push({
        ...base,
        kind: 'number',
        integer: type === 'integer',
        min: typeof raw.minimum === 'number' ? raw.minimum : undefined,
        max: typeof raw.maximum === 'number' ? raw.maximum : undefined,
      });
    } else {
      fields.push({ ...base, kind: 'text' });
    }
  }
  return fields;
}

export type LabFormValues = Record<string, string | number | boolean | undefined>;

/** Initial values: the schema default, else false for booleans, else the first option when required. */
export function defaultValues(fields: LabField[]): LabFormValues {
  const out: LabFormValues = {};
  for (const f of fields) {
    if (f.default !== undefined) out[f.name] = f.default;
    else if (f.kind === 'boolean') out[f.name] = false;
    else if (f.kind === 'select' && f.required && f.options?.length) out[f.name] = f.options[0];
  }
  return out;
}

/** Validates and builds the `params` object. Returns the first error per field. */
export function buildParams(
  fields: LabField[],
  values: LabFormValues,
): { params: Record<string, unknown>; errors: Record<string, string> } {
  const params: Record<string, unknown> = {};
  const errors: Record<string, string> = {};
  for (const f of fields) {
    const v = values[f.name];
    const empty = v === undefined || v === '' || (typeof v === 'number' && Number.isNaN(v));
    if (empty) {
      if (f.required) errors[f.name] = `${f.label} is required`;
      continue;
    }
    if (f.kind === 'number') {
      const n = typeof v === 'number' ? v : Number(v);
      if (!Number.isFinite(n)) errors[f.name] = `${f.label} must be a number`;
      else if (f.integer && !Number.isInteger(n)) errors[f.name] = `${f.label} must be a whole number`;
      else if (f.min !== undefined && n < f.min) errors[f.name] = `${f.label} must be at least ${f.min}`;
      else if (f.max !== undefined && n > f.max) errors[f.name] = `${f.label} must be at most ${f.max}`;
      else params[f.name] = n;
    } else if (f.kind === 'select') {
      const match = f.options?.find((o) => String(o) === String(v));
      if (match === undefined) errors[f.name] = `${f.label} has an unknown option`;
      else params[f.name] = match;
    } else if (f.kind === 'boolean') {
      params[f.name] = v === true || v === 'true';
    } else {
      params[f.name] = String(v);
    }
  }
  return { params, errors };
}
