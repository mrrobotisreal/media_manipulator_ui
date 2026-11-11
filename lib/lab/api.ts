import { authedFetch } from '@/lib/auth/authedFetch';
import { getBaseURL } from '@/lib/utils';
import type { LabSpend } from './types';

export async function fetchLabSpend(): Promise<LabSpend> {
  const res = await authedFetch(`${getBaseURL()}/lab/spend`);
  if (!res.ok) throw new Error(`Spend request failed (${res.status})`);
  return (await res.json()) as LabSpend;
}

export async function endLabSession(modelKey: string): Promise<boolean> {
  const res = await authedFetch(`${getBaseURL()}/lab/sessions/${encodeURIComponent(modelKey)}/end`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error(`Could not end the session (${res.status})`);
  const body = (await res.json().catch(() => ({}))) as { ended?: boolean };
  return body.ended === true;
}

export interface LabJobRequest {
  model: string;
  params: Record<string, unknown>;
  /** Inputs taken from a previous job's result, keyed by input name. */
  fromJob: Record<string, string>;
  /** Inputs uploaded as files, keyed by input name. */
  files: Record<string, File>;
}

/** Throws an Error whose message is shown as-is in the page. */
export async function submitLabJob(req: LabJobRequest): Promise<string> {
  const inputs: Record<string, { fromJob: string }> = {};
  for (const [name, id] of Object.entries(req.fromJob)) inputs[name] = { fromJob: id };
  const form = new FormData();
  form.set('request', JSON.stringify({ model: req.model, params: req.params, inputs }));
  for (const [name, file] of Object.entries(req.files)) form.set(name, file);
  // No Content-Type header: the browser sets the multipart boundary.
  const res = await authedFetch(`${getBaseURL()}/lab/jobs`, { method: 'POST', body: form });
  if (res.status === 202) {
    const body = (await res.json()) as { jobId?: string };
    if (!body.jobId) throw new Error('The API accepted the job but returned no job id.');
    return body.jobId;
  }
  const body = (await res.json().catch(() => null)) as {
    error?: string;
    message?: string;
    field?: string;
    scope?: string;
  } | null;
  if (res.status === 409 && body?.error === 'lab_cap') {
    throw new Error(`Spend cap (${body.scope ?? 'lab'}): ${body.message ?? 'this run would cross a Lab spend cap.'}`);
  }
  if (res.status === 503 && body?.error === 'lab_unavailable') {
    throw new Error(`Unavailable: ${body.message ?? 'the Lab cannot start this model right now.'}`);
  }
  if (res.status === 400) {
    throw new Error(`${body?.error ?? 'Invalid request'}${body?.field ? ` (${body.field})` : ''}`);
  }
  throw new Error(`Lab request failed (${res.status})`);
}
