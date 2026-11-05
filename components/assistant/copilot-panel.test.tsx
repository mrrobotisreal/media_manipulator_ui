/**
 * MM108 copilot framework: the panel + useCopilot against a fake stream and a fake adapter.
 * An `edits` event is applied once; after `done {awaiting}` the editResult continuation goes
 * out (with frameAfter only when the preview toggle is on); the disclosure shows once; a
 * suggested action does nothing until clicked; the limit card and the sign-in state; Undo.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { createI18nInstance } from '@/i18n';
import en from '@/i18n/locales/en-us/interface/assistant.json';
import type { AssistantChatBody } from '@/lib/assistant/stream';
import type { CopilotAdapter } from '@/lib/assistant/copilot/types';
import type { AssistantStreamEvent } from '@/schemas/assistant';

vi.mock('next/navigation', () => ({ usePathname: () => '/photo/x', useRouter: () => ({ push: vi.fn() }) }));
const h = vi.hoisted(() => ({ calls: [] as AssistantChatBody[], scripts: [] as unknown[][] }));
const fb = vi.hoisted(() => ({ send: vi.fn(async (...args: [string, string]) => args.length > 0) }));
vi.mock('@/lib/assistant/api', async (orig) => ({
  ...(await orig<typeof import('@/lib/assistant/api')>()),
  sendAssistantFeedback: fb.send,
}));
vi.mock('@/lib/assistant/stream', () => ({
  streamAssistantChat: vi.fn(async (body: AssistantChatBody, onEvent: (e: AssistantStreamEvent) => void) => {
    h.calls.push(body);
    for (const e of h.scripts.shift() ?? []) onEvent(e as AssistantStreamEvent);
  }),
}));

import CopilotPanel from './copilot-panel';
import { planSteps } from '@/lib/assistant/copilot/useCopilot';
import { flushKept, keptPending, resetKept } from '@/lib/assistant/copilot/kept';

const CAPS = {
  enabled: true as const,
  guide: { enabled: true },
  copilot: { enabled: true, surfaces: ['photo'], signedInOnly: true, editSurfaces: ['photo'] },
  turns: { limit: 5, remaining: 4, resetsAt: '' },
  frames: true,
  maxFrameBytes: 307200,
  maxMessageChars: 4000,
  spendCapReached: false,
};

const meta = { type: 'meta', conversationId: '00000000-0000-0000-0000-000000000001', turnId: '00000000-0000-0000-0000-0000000000aa', model: 'm' };
const editTurn = [meta, { type: 'delta', text: 'Done.' }, { type: 'edits', callId: 'e1', summary: 'Grey except red', ops: [{ op: 'grey_except', ranges: ['red'] }] }, { type: 'done', awaiting: 'edit_result' }];
const confirm = [meta, { type: 'delta', text: 'Everything is grey except the red.' }, { type: 'done' }];

function fakeAdapter(over: Partial<CopilotAdapter> = {}) {
  const undo = vi.fn(() => true);
  const heal = vi.fn();
  const a: CopilotAdapter = {
    surface: 'photo',
    frameOnMessage: true,
    digest: () => 'Aperture photo. layers (0):',
    captureFrame: vi.fn(async () => new Blob([new Uint8Array([0xff, 0xd8, 0xff, 0x00])], { type: 'image/jpeg' })),
    projectId: () => 'p1',
    apply: vi.fn(() => ({ ok: true as const, token: { id: 1 }, opCount: 1, opKinds: ['grey_except'], changes: ['Made everything grey except red'], lines: [{ text: 'Made everything grey except red', op: 'grey_except', raw: { op: 'grey_except' }, reason: 'Only the red jacket keeps colour' }] })),
    preview: vi.fn(() => ({ ok: true as const, lines: [{ text: 'Made everything grey except red', op: 'grey_except', raw: { op: 'grey_except' }, reason: 'Only the red jacket keeps colour', values: [{ label: 'Saturation', before: '0', after: '-100' }] }] })),
    canReveal: () => true,
    reveal: vi.fn(() => true),
    undo,
    canUndo: () => true,
    suggest: { heal },
    ...over,
  };
  return { a, undo, heal };
}

function renderPanel(adapter: CopilotAdapter, props: Partial<React.ComponentProps<typeof CopilotPanel>> = {}) {
  const i18n = createI18nInstance('en-US');
  i18n.addResourceBundle('en-US', 'interface', en, true, true);
  const track = vi.fn();
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}>
      <I18nextProvider i18n={i18n}>
        <CopilotPanel adapter={adapter} capabilities={CAPS} signedIn tier="free" track={track} onClose={() => {}} {...props} />
      </I18nextProvider>
    </QueryClientProvider>,
  );
  return { track };
}

const send = async (text: string) => {
  fireEvent.change(screen.getByTestId('copilot-input'), { target: { value: text } });
  await act(async () => {
    fireEvent.click(screen.getByTestId('copilot-send'));
  });
};

beforeEach(() => {
  h.calls = [];
  h.scripts = [];
  fb.send.mockClear();
  resetKept();
  localStorage.clear();
});
afterEach(cleanup);

const reasonTurn = [meta, { type: 'delta', text: 'Done.' }, { type: 'edits', callId: 'e1', summary: 'Grey except red', reason: 'The jacket is the only thing you asked to keep', ops: [{ op: 'grey_except', ranges: ['red'] }] }, { type: 'done', awaiting: 'edit_result' }];
const openMenu = async () => {
  await act(async () => {
    fireEvent.click(screen.getByTestId('copilot-info'));
  });
};

describe('MM114 reasons, staged mode and Show me', () => {
  it('shows the batch reason under the summary and the op reason in the "what I changed" list', async () => {
    const { a } = fakeAdapter();
    h.scripts.push(reasonTurn, confirm);
    renderPanel(a);
    await send('grey except red');
    await screen.findByTestId('copilot-edit');
    expect(screen.getByTestId('copilot-reason').textContent).toBe('The jacket is the only thing you asked to keep');
    fireEvent.click(screen.getByText('What I changed'));
    expect(screen.getByTestId('copilot-op-reason').textContent).toBe('Only the red jacket keeps colour');
  });

  it('auto-apply is on by default, and the switch is persisted with try/catch storage', async () => {
    const { a } = fakeAdapter();
    const { track } = renderPanel(a);
    await openMenu();
    const box = screen.getByTestId('copilot-auto-apply') as HTMLInputElement;
    expect(box.checked).toBe(true);
    fireEvent.click(box);
    expect(localStorage.getItem('mm-medi-auto-apply-v1')).toBe('off');
    expect(track.mock.calls.find((c) => c[0] === 'assistant_auto_apply_toggled')?.[1]).toEqual({ surface: 'photo', enabled: false });
  });

  it('survives storage that throws: the default stays on and the panel still works', async () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const { a } = fakeAdapter();
    renderPanel(a);
    await openMenu();
    expect((screen.getByTestId('copilot-auto-apply') as HTMLInputElement).checked).toBe(true);
    fireEvent.click(screen.getByTestId('copilot-auto-apply'));
    expect((screen.getByTestId('copilot-auto-apply') as HTMLInputElement).checked).toBe(false);
    spy.mockRestore();
    set.mockRestore();
  });

  it('staged: nothing is applied until Apply; Apply is one apply call (one undo entry) and then reports applied', async () => {
    localStorage.setItem('mm-medi-auto-apply-v1', 'off');
    const { a } = fakeAdapter();
    h.scripts.push(reasonTurn, confirm);
    const { track } = renderPanel(a);
    await send('grey except red');
    const card = await screen.findByTestId('copilot-staged');
    expect(a.preview).toHaveBeenCalledTimes(1);
    expect(a.apply).not.toHaveBeenCalled();
    expect(screen.queryByTestId('copilot-edit')).toBeNull();
    expect(screen.getByTestId('copilot-values').textContent).toContain('Saturation');
    expect(screen.getByTestId('copilot-values').textContent).toMatch(/0 →.*-100/);
    expect(card.textContent).toContain('The jacket is the only thing you asked to keep');
    expect(h.calls).toHaveLength(1);
    await act(async () => {
      fireEvent.click(screen.getByTestId('copilot-staged-apply'));
    });
    await waitFor(() => expect(h.calls).toHaveLength(2));
    expect(a.apply).toHaveBeenCalledTimes(1);
    expect(a.apply).toHaveBeenCalledWith('Grey except red', [{ op: 'grey_except', ranges: ['red'] }]);
    expect(h.calls[1].editResult).toMatchObject({ callId: 'e1', applied: true });
    expect(screen.queryByTestId('copilot-staged')).toBeNull();
    expect(screen.getByTestId('copilot-edit')).toBeTruthy();
    expect(track.mock.calls.find((c) => c[0] === 'assistant_edits_staged_decision')?.[1]).toEqual({ surface: 'photo', decision: 'applied', op_count: 1 });
  });

  it('staged: Discard reports editResult applied:false with "user discarded" and never touches the document', async () => {
    localStorage.setItem('mm-medi-auto-apply-v1', 'off');
    const { a } = fakeAdapter();
    h.scripts.push(reasonTurn, [meta, { type: 'delta', text: 'No problem, I left it as it was.' }, { type: 'done' }]);
    const { track } = renderPanel(a);
    await send('grey except red');
    await screen.findByTestId('copilot-staged');
    await act(async () => {
      fireEvent.click(screen.getByTestId('copilot-staged-discard'));
    });
    await waitFor(() => expect(h.calls).toHaveLength(2));
    expect(h.calls[1].editResult).toEqual({ callId: 'e1', applied: false, errors: ['user discarded'] });
    expect(a.apply).not.toHaveBeenCalled();
    expect(screen.getByTestId('copilot-staged-discarded')).toBeTruthy();
    expect(track.mock.calls.find((c) => c[0] === 'assistant_edits_staged_decision')?.[1]).toEqual({ surface: 'photo', decision: 'discarded', op_count: 1 });
  });

  it('staged: a batch that fails its dry run is reported back as rejected without a card', async () => {
    localStorage.setItem('mm-medi-auto-apply-v1', 'off');
    const { a } = fakeAdapter({ preview: vi.fn(() => ({ ok: false as const, reason: 'unknown_id' as const, errors: ['ops[0]: no layer "x"'] })) });
    h.scripts.push(reasonTurn, confirm);
    renderPanel(a);
    await send('fix it');
    await waitFor(() => expect(h.calls).toHaveLength(2));
    expect(h.calls[1].editResult).toEqual({ callId: 'e1', applied: false, errors: ['ops[0]: no layer "x"'] });
    expect(screen.queryByTestId('copilot-staged')).toBeNull();
  });

  it('Show me calls the adapter with the op and reports assistant_show_me_clicked', async () => {
    const { a } = fakeAdapter();
    h.scripts.push(reasonTurn, confirm);
    const { track } = renderPanel(a);
    await send('grey except red');
    await screen.findByTestId('copilot-edit');
    fireEvent.click(screen.getByText('What I changed'));
    fireEvent.click(screen.getByTestId('copilot-show-me'));
    expect(a.reveal).toHaveBeenCalledWith({ op: 'grey_except' });
    expect(track.mock.calls.find((c) => c[0] === 'assistant_show_me_clicked')?.[1]).toEqual({ surface: 'photo', op: 'grey_except' });
  });

  it('no Show me button when the adapter has no control for the op', async () => {
    const { a } = fakeAdapter({ canReveal: () => false });
    h.scripts.push(reasonTurn, confirm);
    renderPanel(a);
    await send('grey except red');
    await screen.findByTestId('copilot-edit');
    fireEvent.click(screen.getByText('What I changed'));
    expect(screen.queryByTestId('copilot-show-me')).toBeNull();
  });
});

describe('CopilotPanel + useCopilot', () => {
  it('re-reads the allowance after a turn so "edits left" follows the server', async () => {
    const { a } = fakeAdapter();
    h.scripts.push(editTurn, confirm);
    const loadCapabilities = vi.fn(async () => ({ ...CAPS, turns: { limit: 5, remaining: 3, resetsAt: '' } }));
    renderPanel(a, { loadCapabilities });
    expect(screen.getByTestId('copilot-turns').textContent).toContain('4');
    await send('Make everything grey except the red jacket');
    await waitFor(() => expect(h.calls).toHaveLength(2));
    await screen.findByText('Everything is grey except the red.');
    await waitFor(() => expect(loadCapabilities).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByTestId("copilot-turns").textContent).toContain("3"));
    expect(loadCapabilities).toHaveBeenCalled();
  });

  it('does not re-read the allowance when signed out', async () => {
    const { a } = fakeAdapter();
    h.scripts.push([meta, { type: 'error', code: 'sign_in_required', message: 'x' }]);
    const loadCapabilities = vi.fn(async () => CAPS);
    renderPanel(a, { loadCapabilities, signedIn: false });
    expect(loadCapabilities).not.toHaveBeenCalled();
  });

  it('applies the edit once, then continues the same turn with editResult + frameAfter (not a new message)', async () => {
    const { a } = fakeAdapter();
    h.scripts.push(editTurn, confirm);
    const { track } = renderPanel(a, { });
    await send('Make everything grey except the red jacket');
    await waitFor(() => expect(h.calls).toHaveLength(2));
    expect(a.apply).toHaveBeenCalledTimes(1);
    expect(a.apply).toHaveBeenCalledWith('Grey except red', [{ op: 'grey_except', ranges: ['red'] }]);
    const [first, second] = h.calls;
    expect(first.surface).toBe('photo');
    expect(first.context).toEqual({ digest: 'Aperture photo. layers (0):', projectId: 'p1' });
    expect(first.frame?.jpegBase64).toBeTruthy();
    expect(second.message).toBeUndefined();
    expect(second.editResult).toMatchObject({ callId: 'e1', applied: true });
    expect(second.editResult?.frameAfter?.jpegBase64).toBeTruthy();
    expect(second.turnId).toBe(meta.turnId);
    expect(second.conversationId).toBe(meta.conversationId);
    await screen.findByText('Everything is grey except the red.');
    expect(screen.getByTestId('copilot-edit').textContent).toContain('Medi: Grey except red');
    const names = track.mock.calls.map((c) => c[0]);
    expect(names).toContain('assistant_edits_applied');
    expect(track.mock.calls.find((c) => c[0] === 'assistant_edits_applied')?.[1]).toEqual({ surface: 'photo', op_count: 1, op_kinds: 'grey_except', round: 1 });
  });

  it('with "Let Medi see the preview" off, no frame is captured or sent (message or verify)', async () => {
    const { a } = fakeAdapter();
    h.scripts.push(editTurn, confirm);
    renderPanel(a);
    fireEvent.click(screen.getByTestId('copilot-preview-toggle'));
    await send('Moody please');
    await waitFor(() => expect(h.calls).toHaveLength(2));
    expect(a.captureFrame).not.toHaveBeenCalled();
    expect(h.calls[0].frame).toBeUndefined();
    expect(h.calls[1].editResult?.frameAfter).toBeUndefined();
    expect(localStorage.getItem('mm-medi-preview-v1')).toBe('off');
  });

  it('shows the frames disclosure once; sending acknowledges it', async () => {
    const { a } = fakeAdapter();
    h.scripts.push(confirm);
    renderPanel(a);
    expect(screen.getByTestId('copilot-notice').textContent).toMatch(/preview image of your work/);
    await send('hi');
    expect(screen.queryByTestId('copilot-notice')).toBeNull();
    cleanup();
    renderPanel(fakeAdapter().a);
    expect(screen.queryByTestId('copilot-notice')).toBeNull();
  });

  it('a rejected edit reports the errors back to the model and shows nothing was changed', async () => {
    const { a } = fakeAdapter({ apply: vi.fn(() => ({ ok: false as const, reason: 'unknown_id' as const, errors: ['ops[0]: no layer "x"'] })) });
    h.scripts.push(editTurn, confirm);
    const { track } = renderPanel(a);
    await send('fix it');
    await waitFor(() => expect(h.calls).toHaveLength(2));
    expect(h.calls[1].editResult).toEqual({ callId: 'e1', applied: false, errors: ['ops[0]: no layer "x"'] });
    expect(screen.getByTestId('copilot-rejected')).toBeTruthy();
    expect(track.mock.calls.find((c) => c[0] === 'assistant_edits_rejected')?.[1]).toEqual({ surface: 'photo', reason: 'unknown_id' });
  });

  it('a suggested action calls nothing until clicked', async () => {
    const { a, heal } = fakeAdapter();
    h.scripts.push([meta, { type: 'delta', text: 'Heal can remove it.' }, { type: 'action', callId: 'a1', kind: 'heal', label: 'Heal the blemish', params: {} }, { type: 'done' }]);
    const { track } = renderPanel(a);
    await send('remove the pimple');
    const btn = await screen.findByTestId('copilot-action');
    expect(heal).not.toHaveBeenCalled();
    await act(async () => {
      fireEvent.click(btn);
    });
    expect(heal).toHaveBeenCalledTimes(1);
    expect(track.mock.calls.find((c) => c[0] === 'assistant_action_clicked')?.[1]).toEqual({ surface: 'photo', kind: 'heal' });
  });

  it('Undo on the latest edit calls the adapter and reports assistant_edits_undone', async () => {
    const { a, undo } = fakeAdapter();
    h.scripts.push(editTurn, confirm);
    const { track } = renderPanel(a);
    await send('grey except red');
    fireEvent.click(await screen.findByTestId('copilot-undo'));
    expect(undo).toHaveBeenCalledWith({ id: 1 });
    expect(screen.getByTestId('copilot-edit').getAttribute('data-undone')).toBe('true');
    expect(track.mock.calls.find((c) => c[0] === 'assistant_edits_undone')?.[1]).toMatchObject({ surface: 'photo', within_seconds_bucket: '<10s' });
  });

  it('a limit refusal shows the limit card and reports assistant_limit_hit once', async () => {
    const { a } = fakeAdapter();
    h.scripts.push([{ type: 'error', code: 'limit', message: 'HTTP 429' }]);
    const { track } = renderPanel(a);
    await send('make it moody');
    expect((await screen.findByTestId('copilot-limit')).textContent).toMatch(/today's Medi edits/);
    expect(track.mock.calls.filter((c) => c[0] === 'assistant_limit_hit')).toEqual([['assistant_limit_hit', { surface: 'photo', tier: 'free' }]]);
  });

  it('signed out: the sign-in card, no input, nothing sent', () => {
    renderPanel(fakeAdapter().a, { signedIn: false });
    expect(screen.getByTestId('copilot-sign-in')).toBeTruthy();
    expect((screen.getByTestId('copilot-input') as HTMLTextAreaElement).disabled).toBe(true);
    expect(h.calls).toHaveLength(0);
  });

  it('Plan my edit sends plan:true', async () => {
    h.scripts.push([meta, { type: 'delta', text: '1. Lift the shadows\n2. Warm it up\n3. Add a vignette' }, { type: 'done' }]);
    renderPanel(fakeAdapter().a);
    fireEvent.change(screen.getByTestId('copilot-input'), { target: { value: 'make it cinematic' } });
    await act(async () => {
      fireEvent.click(screen.getByTestId('copilot-plan-button'));
    });
    expect(h.calls[0].plan).toBe(true);
    expect((await screen.findByTestId('copilot-plan')).textContent).toContain('Warm it up');
  });

  it('not a copilot surface for this caller: an unavailable line, nothing else', () => {
    renderPanel(fakeAdapter().a, { capabilities: { ...CAPS, copilot: { ...CAPS.copilot, surfaces: [] } } });
    expect(screen.getByTestId('copilot-unavailable')).toBeTruthy();
  });
});

const doneWithId = [meta, { type: 'delta', text: 'Everything is grey except the red.' }, { type: 'done', messageId: 'msg-9' }];

// MM113 acceptance 5: copilot thumbs.
describe('copilot thumbs + version (MM113)', () => {
  it('thumbs-up posts the feedback once through the mutation and tracks it with the copilot surface', async () => {
    h.scripts.push(doneWithId);
    const { track } = renderPanel(fakeAdapter().a);
    await send('hello');
    fireEvent.click(await screen.findByRole('button', { name: 'Helpful' }));
    await waitFor(() => expect(fb.send).toHaveBeenCalledWith('msg-9', 'up'));
    expect(track).toHaveBeenCalledWith('assistant_feedback_given', { surface: 'photo', rating: 'up' });
    expect(screen.getByText('Thanks for the feedback.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Not helpful' })).toBeNull();
    expect(fb.send).toHaveBeenCalledTimes(1);
  });

  it('thumbs-down sends down; no thumbs for a guest or an answer without a stored id', async () => {
    h.scripts.push(doneWithId);
    renderPanel(fakeAdapter().a);
    await send('hello');
    fireEvent.click(await screen.findByRole('button', { name: 'Not helpful' }));
    await waitFor(() => expect(fb.send).toHaveBeenCalledWith('msg-9', 'down'));
    cleanup();
    h.scripts.push(confirm);
    renderPanel(fakeAdapter().a);
    await send('hello');
    await screen.findByText('Everything is grey except the red.');
    expect(screen.queryByTestId('medi-feedback')).toBeNull();
  });

  it('the ⓘ menu shows the prompt version from capabilities', async () => {
    renderPanel(fakeAdapter().a, { capabilities: { ...CAPS, promptVersion: 'a1b2c3d4e5f6' } });
    fireEvent.click(screen.getByTestId('copilot-info'));
    expect((await screen.findByTestId('copilot-version')).textContent).toBe('a1b2c3d4e5f6');
  });
});

// MM113 decision 4: the implicit signal. assistant_edit_kept is the catalog's equivalent of "kept".
describe('assistant_edit_kept (MM113)', () => {
  it('an applied edit that survives to an export is reported once as kept/exported', async () => {
    const { a } = fakeAdapter();
    h.scripts.push(editTurn, confirm);
    const { track } = renderPanel(a);
    await send('grey except red');
    await waitFor(() => expect(h.calls).toHaveLength(2));
    expect(keptPending('photo')).toBe(1);
    flushKept('exported', 'photo');
    flushKept('exported', 'photo');
    const kept = track.mock.calls.filter((c) => c[0] === 'assistant_edit_kept');
    expect(kept).toEqual([['assistant_edit_kept', { surface: 'photo', outcome: 'exported' }]]);
  });

  it('an undone edit is not kept', async () => {
    const { a } = fakeAdapter();
    h.scripts.push(editTurn, confirm);
    const { track } = renderPanel(a);
    await send('grey except red');
    fireEvent.click(await screen.findByTestId('copilot-undo'));
    flushKept('session_end');
    expect(track.mock.calls.some((c) => c[0] === 'assistant_edit_kept')).toBe(false);
    expect(keptPending()).toBe(0);
  });

  it('flushes by surface and outcome', async () => {
    const { a } = fakeAdapter();
    h.scripts.push(editTurn, confirm);
    const { track } = renderPanel(a);
    await send('grey except red');
    await waitFor(() => expect(h.calls).toHaveLength(2));
    flushKept('saved', 'vector');
    expect(keptPending('photo')).toBe(1);
    flushKept('session_end');
    expect(track.mock.calls.find((c) => c[0] === 'assistant_edit_kept')?.[1]).toEqual({ surface: 'photo', outcome: 'session_end' });
  });
});

describe('planSteps', () => {
  it('reads consecutive numbered lines; one line is not a plan', () => {
    expect(planSteps('Here:\n1. **Lift** shadows\n2) Warm it\n4. skip')).toEqual(['Lift shadows', 'Warm it']);
    expect(planSteps('1. only')).toEqual([]);
  });
});
