'use client';

// MM138: the Lab console. English-only by decision; no analytics, no i18n.

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Panel } from '@/components/darkroom/panel';
import { ResultPanel } from '@/components/results/result-panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { describe as describeResult } from '@/lib/results/describe';
import { checkJobStatus } from '@/lib/useGetJobStatus';
import { endLabSession, fetchLabSpend, submitLabJob } from '@/lib/lab/api';
import { estimateLabel, runBlock } from '@/lib/lab/caps';
import { buildParams, defaultValues, schemaToFields, type LabFormValues } from '@/lib/lab/schemaForm';
import {
  AREA_LABEL,
  AREA_ORDER,
  LICENCE_LABEL,
  type LabModel,
  type LabModelsResponse,
  type LabSpend,
} from '@/lib/lab/types';

const usd = (n: number) => '$' + n.toFixed(2);

export function LabConsole({ initial }: { initial: LabModelsResponse }) {
  const queryClient = useQueryClient();
  const spendQ = useQuery<LabSpend>({ queryKey: ['lab-spend'], queryFn: fetchLabSpend, refetchInterval: 30_000 });
  const spend = spendQ.data;
  const [selected, setSelected] = useState<string | null>(null);
  const endMut = useMutation({
    mutationFn: endLabSession,
    onSettled: () => void queryClient.invalidateQueries({ queryKey: ['lab-spend'] }),
  });

  const groups = AREA_ORDER.map((area) => ({ area, models: initial.models.filter((m) => m.area === area) })).filter(
    (g) => g.models.length > 0,
  );

  return (
    <main id="main" className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-semibold">Lab</h1>
      <div role="note" data-testid="lab-notice" className="rounded-md border border-edge bg-surface-2 p-3 text-sm">
        {initial.notice}
      </div>
      {!initial.burstConfigured ? (
        <p className="text-sm text-muted-foreground">Burst GPUs are not configured: only home models can run.</p>
      ) : null}

      <Panel level="1" as="section" title="Spend" titleAs="h2">
        {spend ? (
          <div className="space-y-3">
            <SpendBar label="Today" spent={spend.day.spentUsd} cap={spend.day.capUsd} />
            <SpendBar label="This month" spent={spend.month.spentUsd} cap={spend.month.capUsd} />
            {spend.sessions.length > 0 ? (
              <ul className="space-y-1 text-sm">
                {spend.sessions.map((s) => (
                  <li key={s.model} className="flex flex-wrap items-center gap-2">
                    <span>
                      Session open: {s.model} until {new Date(s.until).toLocaleTimeString()}
                    </span>
                    <Button size="sm" variant="outline" disabled={endMut.isPending} onClick={() => endMut.mutate(s.model)}>
                      End session
                    </Button>
                  </li>
                ))}
              </ul>
            ) : null}
            {endMut.isError ? (
              <p role="alert" className="text-sm text-destructive">
                {(endMut.error as Error).message}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground" role="status">
            {spendQ.isError ? 'Spend unavailable.' : 'Loading spend...'}
          </p>
        )}
      </Panel>

      {groups.map((g) => (
        <section key={g.area} aria-labelledby={'lab-area-' + g.area} className="space-y-3">
          <h2 id={'lab-area-' + g.area} className="text-lg font-medium">
            {AREA_LABEL[g.area]}
          </h2>
          <div className="grid gap-3">
            {g.models.map((m) => (
              <ModelCard
                key={m.key}
                model={m}
                spend={spend}
                open={selected === m.key}
                onToggle={() => setSelected(selected === m.key ? null : m.key)}
                onRan={() => void queryClient.invalidateQueries({ queryKey: ['lab-spend'] })}
              />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

function SpendBar({ label, spent, cap }: { label: string; spent: number; cap: number }) {
  const pct = cap > 0 ? Math.min(100, Math.round((spent / cap) * 100)) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="num">
          {usd(spent)} of {usd(cap)}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label + ' Lab spend'}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="h-2 w-full rounded-full bg-muted"
      >
        <div className={'h-2 rounded-full ' + (pct >= 90 ? 'bg-destructive' : 'bg-primary')} style={{ width: pct + '%' }} />
      </div>
    </div>
  );
}

function ModelCard({
  model,
  spend,
  open,
  onToggle,
  onRan,
}: {
  model: LabModel;
  spend: LabSpend | undefined;
  open: boolean;
  onToggle: () => void;
  onRan: () => void;
}) {
  const bodyId = 'lab-model-' + model.key;
  return (
    <Panel level="2" as="article" data-testid={'lab-card-' + model.key}>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-base font-medium">{model.name}</h3>
        <Badge variant="outline">
          <a href={model.licenceUrl} target="_blank" rel="noreferrer noopener">
            {LICENCE_LABEL[model.licence]}
          </a>
        </Badge>
        <span className="text-sm text-muted-foreground">{model.instance}</span>
        <span className="text-sm">{estimateLabel(model)}</span>
        <Button size="sm" variant="outline" className="ml-auto" aria-expanded={open} aria-controls={bodyId} onClick={onToggle}>
          {open ? 'Close' : 'Open'}
        </Button>
      </div>
      {!model.available ? (
        <p className="mt-2 text-sm text-destructive">{model.unavailableReason || 'Unavailable right now.'}</p>
      ) : null}
      {open ? (
        <div id={bodyId} className="mt-4">
          <ModelRunner model={model} spend={spend} onRan={onRan} />
        </div>
      ) : null}
    </Panel>
  );
}

function ModelRunner({ model, spend, onRan }: { model: LabModel; spend: LabSpend | undefined; onRan: () => void }) {
  const fields = schemaToFields(model.paramsSchema);
  const [values, setValues] = useState<LabFormValues>(() => defaultValues(fields));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File | undefined>>({});
  const [fromJob, setFromJob] = useState<Record<string, string>>({});
  const [jobId, setJobId] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const block = runBlock(model, spend);

  const jobQ = useQuery({
    queryKey: ['lab-job', jobId],
    queryFn: () => checkJobStatus(jobId!),
    enabled: !!jobId,
    refetchInterval: (q) => {
      const s = q.state.data?.status;
      return s === 'completed' || s === 'failed' ? false : 2000;
    },
  });
  const job = jobQ.data;

  const run = useMutation({
    mutationFn: submitLabJob,
    onSuccess: (id) => {
      setJobId(id);
      onRan();
    },
    onError: (e: Error) => {
      setRunError(e.message);
      onRan();
    },
  });

  const submit = () => {
    setRunError(null);
    setFormError(null);
    const built = buildParams(fields, values);
    setErrors(built.errors);
    if (Object.keys(built.errors).length > 0) return;
    const f: Record<string, File> = {};
    const from: Record<string, string> = {};
    for (const input of model.inputs) {
      const file = files[input.name];
      const id = (fromJob[input.name] ?? '').trim();
      if (file) f[input.name] = file;
      else if (id) from[input.name] = id;
      else if (input.required) {
        setFormError(input.label + ' is required: upload a file or give a previous job id.');
        return;
      }
    }
    run.mutate({ model: model.key, params: built.params, fromJob: from, files: f });
  };

  const running = run.isPending || (!!jobId && job?.status !== 'completed' && job?.status !== 'failed' && !jobQ.isError);
  const outKind = model.outputs[0]?.kind;
  const descriptor =
    job?.status === 'completed'
      ? describeResult({
          job,
          fallbackFileName: model.key + '-' + job.id,
          kindHint: outKind && outKind !== 'file' ? outKind : undefined,
        })
      : null;

  return (
    <div className="space-y-4">
      {fields.length > 0 ? (
        <fieldset className="grid gap-3 sm:grid-cols-2">
          <legend className="sr-only">Parameters</legend>
          {fields.map((f) => {
            const id = 'lab-' + model.key + '-' + f.name;
            const v = values[f.name];
            const set = (nv: string | number | boolean | undefined) => setValues((p) => ({ ...p, [f.name]: nv }));
            return (
              <div key={f.name} className="space-y-1">
                <label htmlFor={id} className="text-sm font-medium">
                  {f.label}
                  {f.required ? ' *' : ''}
                </label>
                {f.kind === 'select' ? (
                  <select
                    id={id}
                    className="h-9 w-full rounded-md border border-control bg-surface-2 px-2 text-sm"
                    value={v === undefined ? '' : String(v)}
                    onChange={(e) => set(e.target.value)}
                  >
                    {f.required ? null : <option value="">(default)</option>}
                    {f.options!.map((o) => (
                      <option key={String(o)} value={String(o)}>
                        {String(o)}
                      </option>
                    ))}
                  </select>
                ) : f.kind === 'boolean' ? (
                  <div>
                    <Switch id={id} checked={v === true} onCheckedChange={set} />
                  </div>
                ) : f.kind === 'number' ? (
                  <Input
                    id={id}
                    type="number"
                    min={f.min}
                    max={f.max}
                    step={f.integer ? 1 : 'any'}
                    value={v === undefined ? '' : String(v)}
                    onChange={(e) => set(e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                ) : (
                  <Input id={id} type="text" value={v === undefined ? '' : String(v)} onChange={(e) => set(e.target.value)} />
                )}
                {f.description ? <p className="text-xs text-muted-foreground">{f.description}</p> : null}
                {errors[f.name] ? (
                  <p role="alert" className="text-xs text-destructive">
                    {errors[f.name]}
                  </p>
                ) : null}
              </div>
            );
          })}
        </fieldset>
      ) : null}

      {model.inputs.map((input) => {
        const fid = 'lab-' + model.key + '-in-' + input.name;
        const jid = fid + '-job';
        return (
          <fieldset key={input.name} className="space-y-2 rounded-md border border-edge p-3">
            <legend className="px-1 text-sm font-medium">
              {input.label} ({input.kind}){input.required ? ' *' : ''}
            </legend>
            <div className="space-y-1">
              <label htmlFor={fid} className="text-xs text-muted-foreground">
                Upload a file
              </label>
              <input
                id={fid}
                type="file"
                accept={input.kind + '/*'}
                className="block text-sm"
                onChange={(e) => setFiles((p) => ({ ...p, [input.name]: e.target.files?.[0] }))}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor={jid} className="text-xs text-muted-foreground">
                Or use a previous result (job id)
              </label>
              <div className="flex gap-2">
                <Input
                  id={jid}
                  type="text"
                  value={fromJob[input.name] ?? ''}
                  onChange={(e) => setFromJob((p) => ({ ...p, [input.name]: e.target.value }))}
                />
                {jobId ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setFromJob((p) => ({ ...p, [input.name]: jobId }))}
                  >
                    Last result
                  </Button>
                ) : null}
              </div>
            </div>
          </fieldset>
        );
      })}

      <p className="text-sm" data-testid="lab-estimate">
        Estimate: {estimateLabel(model)}, about {Math.round(model.estSeconds)} s.
      </p>
      {block ? (
        <p role="alert" className="text-sm text-destructive" data-testid="lab-block">
          {block.message}
        </p>
      ) : null}
      {formError ? (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      ) : null}
      {runError ? (
        <p role="alert" className="text-sm text-destructive" data-testid="lab-run-error">
          {runError}
        </p>
      ) : null}

      <Button type="button" onClick={submit} disabled={!!block || running}>
        Run
      </Button>

      <div role="status" aria-live="polite" className="text-sm">
        {run.isPending ? 'Submitting...' : null}
        {jobId && !job && !jobQ.isError ? 'Queued...' : null}
        {job?.status === 'pending' ? 'Queued...' : null}
        {job?.status === 'processing' ? 'Running' + (job.progress ? ' (' + job.progress + '%)' : '') + '...' : null}
        {job?.status === 'failed' ? 'Failed: ' + (job.error || 'unknown error') : null}
        {job?.status === 'completed' ? 'Done.' : null}
        {jobQ.isError ? 'Could not read job status.' : null}
      </div>

      {descriptor ? <ResultPanel descriptor={descriptor} /> : null}
    </div>
  );
}
