'use client';

/**
 * The translator submit modal (MM54 decision 9, acceptance criterion 6).
 *
 * TRANSLATOR DEPLOYMENTS ONLY (mounted from the workbench panel's Changes tab).
 * Flow: describe the change -> pre-flight (`dryRun`) fills conflicts + warnings ->
 * every warning acknowledged and every conflict "Keep my version" -> Submit.
 * Every failure keeps the drafts; only "Start fresh" after a success clears them.
 * Chrome is English (`lang="en" dir="ltr"`); values render as text, never HTML.
 */
import * as React from 'react';

import * as DialogPrimitive from '@radix-ui/react-dialog';

import { Button } from '@/components/ui/button';
import { CHROME } from '@/lib/translator/chromeCopy';
import { emitTranslatorEvent } from '@/lib/translator/devEvents';
import { DESCRIPTION_MAX, DESCRIPTION_MIN, type SubmitConflict, type SubmitSuccess, type SubmitWarning } from '@/lib/translator/submitContract';
import type { WorkbenchModel } from '@/lib/translator/workbenchModel';

const C = CHROME.submitModal;
const Z = 'z-[2147483646]';

type Check = 'checking' | 'ok' | 'failed';

export interface SubmitModalProps {
  model: WorkbenchModel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Done {
  result: SubmitSuccess;
  submitted: Array<{ file: string; key: string; value: string }>;
}

function toggled(set: Set<string>, id: string, on: boolean): Set<string> {
  const next = new Set(set);
  if (on) next.add(id);
  else next.delete(id);
  return next;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({ model, open, onOpenChange }) => {
  const [description, setDescription] = React.useState('');
  const descRef = React.useRef('');
  const [check, setCheck] = React.useState<Check>('checking');
  const [checkDetail, setCheckDetail] = React.useState('');
  const [checkedOnce, setCheckedOnce] = React.useState(false);
  const [conflicts, setConflicts] = React.useState<SubmitConflict[]>([]);
  const [warnings, setWarnings] = React.useState<SubmitWarning[]>([]);
  const [ackedWarnings, setAckedWarnings] = React.useState<Set<string>>(new Set());
  const [keptConflicts, setKeptConflicts] = React.useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<{ text: string; paths?: string[] } | null>(null);
  const [done, setDone] = React.useState<Done | null>(null);
  const emittedFor = React.useRef<string | null>(null);

  const changes = model.changes();
  const trimmed = description.trim();
  const descriptionValid = trimmed.length >= DESCRIPTION_MIN && description.length <= DESCRIPTION_MAX;

  // Pre-flight: on open (the modal mounts open) and on Re-check. `checking` is the
  // initial state, so the effect never sets state synchronously.
  const runPreflight = React.useCallback(async () => {
    const body = model.buildSubmitRequest({ description: descRef.current, acknowledged: [], confirmConflicts: [] });
    const res = await model.submit(body, { dryRun: true });
    if (res.kind === 'dry_run') {
      setConflicts(res.result.conflicts);
      setWarnings(res.result.warnings);
      setAckedWarnings((prev) => new Set([...prev].filter((id) => res.result.warnings.some((w) => w.id === id))));
      setKeptConflicts((prev) => new Set([...prev].filter((id) => res.result.conflicts.some((c) => c.id === id))));
      setCheckedOnce(true);
      setCheck('ok');
      return;
    }
    setCheck('failed');
    setCheckDetail(
      res.kind === 'error' ? res.detail : res.kind === 'invalid' ? res.error : res.kind === 'unauthorized' ? 'signed out' : res.kind,
    );
  }, [model]);

  const preflight = React.useCallback(() => {
    setCheck('checking');
    void runPreflight();
  }, [runPreflight]);

  const startedFor = React.useRef(false);
  React.useEffect(() => {
    if (!open || startedFor.current) return;
    startedFor.current = true;
    void runPreflight();
  }, [open, runPreflight]);

  // Rate-limit window (429): Submit stays disabled until it passes. `waiting` is
  // state set from the response handler and cleared by a timer (no clock in render).
  const [waiting, setWaiting] = React.useState(false);
  const [waitMs, setWaitMs] = React.useState(0);
  React.useEffect(() => {
    if (!waiting) return;
    const t = setTimeout(() => {
      setWaiting(false);
      setMessage(null);
    }, waitMs);
    return () => clearTimeout(t);
  }, [waiting, waitMs]);

  const allAcked = warnings.every((w) => ackedWarnings.has(w.id));
  const allKept = conflicts.every((c) => keptConflicts.has(c.id));
  const canSubmit =
    descriptionValid && checkedOnce && check !== 'checking' && allAcked && allKept && !submitting && !waiting && changes.length > 0;

  const onSubmit = async () => {
    setSubmitting(true);
    setMessage(null);
    const submitted = model.changes().map((c) => ({ file: c.file, key: c.key, value: c.value }));
    const body = model.buildSubmitRequest({
      description: trimmed,
      acknowledged: [...ackedWarnings],
      confirmConflicts: [...keptConflicts],
    });
    const res = await model.submit(body);
    setSubmitting(false);
    switch (res.kind) {
      case 'ok':
        setDone({ result: res.result, submitted });
        if (emittedFor.current !== res.result.branch) {
          emittedFor.current = res.result.branch;
          emitTranslatorEvent('translator_submitted', {
            locale: model.locale,
            prNumber: res.result.prNumber,
            files: res.result.files,
            changed: res.result.changed,
          });
        }
        return;
      case 'conflicts':
        setConflicts(res.conflicts);
        setKeptConflicts((prev) => new Set([...prev].filter((id) => res.conflicts.some((c) => c.id === id))));
        setMessage({ text: C.mainChanged });
        return;
      case 'warnings':
        setWarnings(res.warnings);
        setAckedWarnings((prev) => new Set([...prev].filter((id) => res.warnings.some((w) => w.id === id))));
        setMessage({ text: C.warningsReturned });
        return;
      case 'rate_limited':
        setWaitMs(res.retryAfterSeconds * 1000);
        setWaiting(true);
        setMessage({ text: C.rateLimited(res.retryAfterSeconds) });
        return;
      case 'unauthorized':
        setMessage({ text: C.unauthorized });
        return;
      case 'forbidden':
        setMessage({ text: C.forbidden });
        return;
      case 'invalid':
        setMessage({ text: C.invalid(res.error), paths: res.error === 'path_not_allowed' ? res.paths : undefined });
        return;
      case 'dry_run':
        setMessage({ text: C.failed('unexpected dry-run response') });
        return;
      default:
        setMessage({ text: C.failed(res.detail) });
    }
  };

  const startFresh = async () => {
    if (!done) return;
    const submitted = done.submitted;
    onOpenChange(false);
    await model.clearSubmitted(submitted);
  };

  const cell = 'border-b border-border px-2 py-1 align-top text-xs';
  const valueCell = `${cell} max-w-[14rem] whitespace-pre-wrap break-words`;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={`fixed inset-0 ${Z} bg-black/50`} />
        <DialogPrimitive.Content
          className={`fixed left-1/2 top-1/2 ${Z} grid max-h-[90vh] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-lg border bg-background p-6 text-foreground shadow-lg sm:max-w-3xl`}
          lang="en"
          dir="ltr"
          data-translator-ui=""
          data-submit-modal=""
        >
        <DialogPrimitive.Title className="text-lg font-semibold">{done ? C.successTitle : C.title}</DialogPrimitive.Title>
        <DialogPrimitive.Description className="text-sm text-muted-foreground">{C.intro}</DialogPrimitive.Description>

        {done ? (
          <div className="grid gap-3" data-submit-success="">
            <p className="text-sm">
              <a href={done.result.prUrl} target="_blank" rel="noopener noreferrer" className="font-medium underline">
                {C.openPr}
              </a>{' '}
              <span>{C.prNumber(done.result.prNumber)}</span>
            </p>
            <p className="text-xs text-muted-foreground">{C.branch(done.result.branch)}</p>
            <p className="text-xs text-muted-foreground">{C.counts(done.result.files, done.result.changed)}</p>
            <p className="text-xs text-muted-foreground">{C.startFreshHint}</p>
            <div className="flex justify-end gap-2">
              <Button onClick={() => void startFresh()}>{C.startFresh}</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-1">
              <label htmlFor="tw-submit-description" className="text-sm font-medium">
                {C.descriptionLabel}
              </label>
              <textarea
                id="tw-submit-description"
                value={description}
                rows={3}
                maxLength={DESCRIPTION_MAX}
                onChange={(e) => {
                  descRef.current = e.target.value;
                  setDescription(e.target.value);
                }}
                className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
              <p className="flex justify-between text-[11px] text-muted-foreground">
                <span data-description-hint="">{trimmed.length < DESCRIPTION_MIN ? C.descriptionHint : ''}</span>
                <span data-description-counter="">{C.counter(description.length, DESCRIPTION_MAX)}</span>
              </p>
            </div>

            <section aria-label={C.diffHeading}>
              <h3 className="mb-1 text-sm font-medium">{C.diffHeading}</h3>
              <div className="max-h-56 overflow-auto rounded-md border border-border" data-diff-table="">
                <table className="w-full border-collapse text-left">
                  <thead className="sticky top-0 bg-muted">
                    <tr>
                      {[C.colKey, C.colOld, C.colNew, C.colSeen].map((h) => (
                        <th key={h} className={`${cell} font-semibold`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {changes.map((c) => (
                      <tr key={`${c.file}|${c.key}`} data-diff-row={c.key}>
                        <td className={`${cell} font-mono break-all`}>{c.key}</td>
                        <td className={valueCell} dir="auto">
                          {c.isNew ? <em className="text-muted-foreground">{C.newKeyValue}</em> : c.baseValue}
                        </td>
                        <td className={valueCell} dir="auto">
                          {c.value}
                        </td>
                        <td className={`${cell} break-all`}>{c.seenOn.join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {check === 'checking' ? (
              <p role="status" className="text-sm text-muted-foreground" data-preflight="checking">
                {C.checking}
              </p>
            ) : null}
            {check === 'failed' ? (
              <p role="alert" className="flex items-center gap-2 text-sm text-destructive" data-preflight="failed">
                {C.checkFailed(checkDetail)}
                <Button variant="outline" size="sm" onClick={preflight}>
                  {C.recheck}
                </Button>
              </p>
            ) : null}
            {check === 'ok' ? (
              <div>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={preflight}>
                  {C.recheck}
                </Button>
              </div>
            ) : null}

            {conflicts.length ? (
              <section aria-label={C.conflictsHeading} data-conflicts="">
                <h3 className="text-sm font-medium">{C.conflictsHeading}</h3>
                <p className="mb-1 text-xs text-muted-foreground">{C.conflictsIntro}</p>
                <ul className="grid gap-2">
                  {conflicts.map((c) => (
                    <li key={c.id} className="rounded-md border border-border p-2 text-xs" data-conflict={c.id}>
                      <p className="font-mono break-all font-semibold">{c.key}</p>
                      <dl className="grid grid-cols-[auto_1fr] gap-x-2">
                        <dt className="text-muted-foreground">{C.colBase}</dt>
                        <dd dir="auto" className="whitespace-pre-wrap break-words">{c.base}</dd>
                        <dt className="text-muted-foreground">{C.colTheirs}</dt>
                        <dd dir="auto" className="whitespace-pre-wrap break-words">
                          {c.theirs === null ? <em>{C.removedOnMain}</em> : c.theirs}
                        </dd>
                        <dt className="text-muted-foreground">{C.colMine}</dt>
                        <dd dir="auto" className="whitespace-pre-wrap break-words">{c.mine}</dd>
                      </dl>
                      <label className="mt-1 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={keptConflicts.has(c.id)}
                          onChange={(e) => setKeptConflicts((s) => toggled(s, c.id, e.target.checked))}
                        />
                        {C.keepMine}
                        <span className="sr-only"> ({c.key})</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {warnings.length ? (
              <section aria-label={C.warningsHeading} data-warnings="">
                <h3 className="text-sm font-medium">{C.warningsHeading}</h3>
                <p className="mb-1 text-xs text-muted-foreground">{C.warningsIntro}</p>
                <ul className="grid gap-2">
                  {warnings.map((w) => (
                    <li key={w.id} className="rounded-md border border-border p-2 text-xs" data-warning={w.id}>
                      <p>
                        <span className="font-mono font-semibold">{w.code}</span> <span className="font-mono break-all">{w.key}</span>
                      </p>
                      <p>{w.message}</p>
                      <label className="mt-1 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={ackedWarnings.has(w.id)}
                          onChange={(e) => setAckedWarnings((s) => toggled(s, w.id, e.target.checked))}
                        />
                        {C.acknowledge}
                        <span className="sr-only"> ({w.key} {w.code})</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {message ? (
              <div role="alert" className="text-sm text-destructive" data-submit-message="">
                <p>{message.text}</p>
                {message.paths?.length ? (
                  <ul className="list-disc ps-5 font-mono text-xs">
                    {message.paths.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {C.cancel}
              </Button>
              <Button disabled={!canSubmit} onClick={() => void onSubmit()} data-submit-confirm="">
                {submitting ? C.submitting : C.submit}
              </Button>
            </div>
          </>
        )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default SubmitModal;
