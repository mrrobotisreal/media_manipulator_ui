// MM138: the Lab API contract (GET /api/lab/models, /api/lab/spend, POST /api/lab/jobs).
// English-only, operator-only surface; see docs/design/OPERATOR_LAB.md.

export type LabArea = 'voice' | 'image' | 'video';
export type LabLicence = 'noncommercial' | 'research' | 'deal_required' | 'copyleft' | 'permissive';
export type LabInputKind = 'image' | 'audio' | 'video';

export interface LabSchemaProperty {
  type?: string;
  enum?: unknown[];
  default?: unknown;
  minimum?: number;
  maximum?: number;
  title?: string;
  description?: string;
}

export interface LabParamsSchema {
  type?: string;
  properties?: Record<string, LabSchemaProperty>;
  required?: string[];
}

export interface LabInput {
  name: string;
  kind: LabInputKind;
  label: string;
  required: boolean;
}

export interface LabModel {
  key: string;
  name: string;
  area: LabArea;
  licence: LabLicence;
  licenceUrl: string;
  sourceUrl: string;
  family: string;
  instance: string;
  fitsHome: boolean;
  runsAt: 'home' | 'burst';
  estSeconds: number;
  estCostUsd: number;
  available: boolean;
  unavailableReason?: string;
  paramsSchema: LabParamsSchema;
  inputs: LabInput[];
  outputs: { kind: 'image' | 'audio' | 'video' | 'file'; label: string }[];
}

export interface LabModelsResponse {
  notice: string;
  burstConfigured: boolean;
  models: LabModel[];
}

export interface LabSpend {
  day: { spentUsd: number; capUsd: number };
  month: { spentUsd: number; capUsd: number };
  sessions: { model: string; until: string }[];
}

export const LICENCE_LABEL: Record<LabLicence, string> = {
  noncommercial: 'Non-commercial',
  research: 'Research',
  deal_required: 'Deal required',
  copyleft: 'Copyleft',
  permissive: 'Permissive',
};

export const AREA_LABEL: Record<LabArea, string> = { voice: 'Voice', image: 'Image', video: 'Video' };
export const AREA_ORDER: LabArea[] = ['voice', 'image', 'video'];
