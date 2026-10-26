/**
 * MM54 acceptance criterion 6: the submit modal's gating and result mapping.
 */
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createFakeTranslatorApi, type FakeTranslatorApi, type SubmitResult } from '@/lib/translator/api';
import { onTranslatorEvent } from '@/lib/translator/devEvents';
import { createMemoryDraftStore } from '@/lib/translator/draftStore';
import { makeModel, shard } from '@/lib/translator/testing/fixtures';
import type { DryRunResponse, SubmitConflict, SubmitWarning } from '@/lib/translator/submitContract';
import type { WorkbenchModel } from '@/lib/translator/workbenchModel';
import { SubmitModal } from './submit-modal';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const dry = (over: Partial<DryRunResponse> = {}): SubmitResult => ({
  kind: 'dry_run',
  result: { dryRun: true, conflicts: [], warnings: [], files: 1, changed: 1, ...over },
});
const okResult = (): SubmitResult => ({
  kind: 'ok',
  result: { prUrl: 'https://github.com/o/r/pull/42', prNumber: 42, branch: 'i18n/de-de/abc', files: 1, changed: 2 },
});
const warning: SubmitWarning = { id: 'a.one#placeholder_mismatch', code: 'placeholder_mismatch', key: 'a.one', message: 'Missing {{name}}' };
const conflict: SubmitConflict = { id: 'i18n/locales/de-de/interface/components.json|a.one', file: 'i18n/locales/de-de/interface/components.json', key: 'a.one', base: 'Eins', theirs: 'Ein', mine: 'Uno' };

async function setup(handler?: Parameters<FakeTranslatorApi['setSubmit']>[0]) {
  const api = createFakeTranslatorApi({ base: { ok: true, base: { sha: 'abcdef1234', files: { 'i18n/locales/de-de/interface/components.json': 'blob1' } } } });
  if (handler) api.setSubmit(handler);
  const model = await makeModel('de-DE', [shard('de-DE', 'interface/components', { 'a.one': 'One', 'a.two': 'Two' })], {
    api,
    getIdToken: async () => 'tok',
    store: createMemoryDraftStore(null),
    now: () => 1000,
  });
  await model.refreshBase();
  model.edit(model.table.byRef('interface', 'a.one')!.id, 'Eins');
  model.edit(model.table.byRef('interface', 'a.two')!.id, 'Zwei');
  return { api, model };
}

async function open(model: WorkbenchModel) {
  const onOpenChange = vi.fn();
  render(<SubmitModal model={model} open onOpenChange={onOpenChange} />);
  await waitFor(() => expect(document.querySelector('[data-preflight="checking"]')).toBeNull());
  return onOpenChange;
}

const type = (text: string) => fireEvent.change(screen.getByLabelText('Describe your changes'), { target: { value: text } });
const submitBtn = () => screen.getByRole('button', { name: 'Submit' }) as HTMLButtonElement;
const ok10 = 'ten chars!!';

describe('SubmitModal (criterion 6)', () => {
  it('cannot submit with a 9-char description', async () => {
    const { model } = await setup();
    await open(model);
    type('123456789');
    expect(submitBtn().disabled).toBe(true);
    expect(screen.getByText('at least 10 characters')).toBeTruthy();
    type('1234567890');
    expect(submitBtn().disabled).toBe(false);
    expect(document.querySelector('[data-description-counter]')!.textContent).toBe('10 / 2000');
  });

  it('cannot submit with an unacknowledged warning', async () => {
    const { model } = await setup(() => dry({ warnings: [warning] }));
    await open(model);
    type(ok10);
    expect(submitBtn().disabled).toBe(true);
    fireEvent.click(screen.getByRole('checkbox', { name: /I have checked this/ }));
    expect(submitBtn().disabled).toBe(false);
  });

  it('conflicts need Keep my version before submit; ids are sent in confirmConflicts', async () => {
    const { model, api } = await setup((_b, d) => (d ? dry({ conflicts: [conflict] }) : okResult()));
    await open(model);
    type(ok10);
    expect(document.querySelector('[data-conflict]')!.textContent).toContain('Ein');
    expect(submitBtn().disabled).toBe(true);
    fireEvent.click(screen.getByRole('checkbox', { name: /Keep my version/ }));
    expect(submitBtn().disabled).toBe(false);
    fireEvent.click(submitBtn());
    await waitFor(() => expect(api.calls.submit.some((c) => !c.dryRun)).toBe(true));
    expect(api.calls.submit.find((c) => !c.dryRun)!.body.confirmConflicts).toEqual([conflict.id]);
  });

  it('success shows the PR URL and number and emits translator_submitted', async () => {
    const { model } = await setup((_b, d) => (d ? dry() : okResult()));
    const events: Array<{ name: string; props: Record<string, unknown> }> = [];
    const off = onTranslatorEvent((e) => events.push(e));
    await open(model);
    type(ok10);
    fireEvent.click(submitBtn());
    const link = (await screen.findByRole('link', { name: 'Open the pull request' })) as HTMLAnchorElement;
    off();
    expect(link.href).toBe('https://github.com/o/r/pull/42');
    expect(link.target).toBe('_blank');
    expect(link.rel).toBe('noopener noreferrer');
    expect(screen.getByText('PR #42')).toBeTruthy();
    expect(screen.getByText('Pull request opened')).toBeTruthy();
    const sent = events.filter((e) => e.name === 'translator_submitted');
    expect(sent).toHaveLength(1);
    expect(sent[0].props).toEqual({ locale: 'de-DE', prNumber: 42, files: 1, changed: 2 });
    expect(model.changes()).toHaveLength(2); // drafts stay until Start fresh
  });

  it('Start fresh clears exactly the submitted drafts and refreshes the base', async () => {
    const { model, api } = await setup((_b, d) => (d ? dry() : okResult()));
    const onOpenChange = await open(model);
    type(ok10);
    fireEvent.click(submitBtn());
    const startFresh = await screen.findByRole('button', { name: 'Start fresh' });
    const baseCalls = api.calls.base.length;
    await act(async () => {
      fireEvent.click(startFresh);
    });
    await waitFor(() => expect(model.changes()).toHaveLength(0));
    expect(api.calls.base.length).toBeGreaterThan(baseCalls);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('429 shows the wait time and keeps drafts', async () => {
    const { model } = await setup((_b, d) => (d ? dry() : { kind: 'rate_limited', retryAfterSeconds: 540 }));
    await open(model);
    type(ok10);
    fireEvent.click(submitBtn());
    expect(await screen.findByText('You can submit again in 9 minutes.')).toBeTruthy();
    expect(submitBtn().disabled).toBe(true);
    expect(model.changes()).toHaveLength(2);
  });

  it('409 on submit replaces the conflict list; 422 replaces the warnings', async () => {
    let mode: 'conflicts' | 'warnings' = 'conflicts';
    const { model } = await setup((_b, d) =>
      d ? dry() : mode === 'conflicts' ? { kind: 'conflicts', conflicts: [conflict] } : { kind: 'warnings', warnings: [warning] },
    );
    await open(model);
    type(ok10);
    fireEvent.click(submitBtn());
    expect(await screen.findByText('Main changed since you started; review the conflicts.')).toBeTruthy();
    expect(document.querySelectorAll('[data-conflict]')).toHaveLength(1);
    expect(submitBtn().disabled).toBe(true);
    fireEvent.click(screen.getByRole('checkbox', { name: /Keep my version/ }));
    mode = 'warnings';
    fireEvent.click(submitBtn());
    await waitFor(() => expect(document.querySelectorAll('[data-warning]')).toHaveLength(1));
    expect(submitBtn().disabled).toBe(true);
    expect(model.changes()).toHaveLength(2);
  });

  it('5xx keeps drafts and allows retry', async () => {
    const { model, api } = await setup((_b, d) => (d ? dry() : { kind: 'error', status: 502, detail: 'github_error' }));
    await open(model);
    type(ok10);
    fireEvent.click(submitBtn());
    expect(await screen.findByText('Submit failed (github_error). Your drafts are kept — try again.')).toBeTruthy();
    expect(submitBtn().disabled).toBe(false);
    expect(model.changes()).toHaveLength(2);
    fireEvent.click(submitBtn());
    await waitFor(() => expect(api.calls.submit.filter((c) => !c.dryRun)).toHaveLength(2));
  });

  it('the request carries acknowledged ids, seenOn and baseValue', async () => {
    const { model, api } = await setup((_b, d) => (d ? dry({ warnings: [warning] }) : okResult()));
    const oneId = model.table.byRef('interface', 'a.one')!.id;
    (model as unknown as { seen: Map<string, string[]> }).seen.set(oneId, ['/de/tools/x']);
    await open(model);
    type(ok10);
    expect(document.querySelector('[data-diff-row="a.one"]')!.textContent).toContain('/de/tools/x');
    fireEvent.click(screen.getByRole('checkbox', { name: /I have checked this/ }));
    fireEvent.click(submitBtn());
    await waitFor(() => expect(api.calls.submit.some((c) => !c.dryRun)).toBe(true));
    const call = api.calls.submit.find((c) => !c.dryRun)!;
    expect(call.token).toBe('tok');
    expect(call.body.acknowledged).toEqual([warning.id]);
    expect(call.body.description).toBe(ok10);
    const one = call.body.changes.find((c) => c.key === 'a.one')!;
    expect(one.baseValue).toBe('One');
    expect(one.value).toBe('Eins');
    expect(one.seenOn).toEqual(['/de/tools/x']);
    expect(call.body.base.sha).toBe('abcdef1234');
  });
});
