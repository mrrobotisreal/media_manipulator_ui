import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';

const track = vi.hoisted(() => vi.fn());
vi.mock('@/lib/analytics/client', () => ({ analytics: { track } }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { RetentionPicker } from './retention-picker';
import { copy } from '@/components/account/test-utils';
import type { AccountSettings, RetentionPreview } from '@/lib/auth/accountApi';

const settings = (hours: number): AccountSettings => ({
  retentionHours: hours,
  retentionScope: 'all',
  deleteMetadataReports: false,
  historyVisibility: 'full',
  updatedAt: 'x',
  limits: { minHours: 24, maxHours: 17520, defaultHours: 4320 },
});
const preview = (results: number, projects = 0, bytes = 0): RetentionPreview => ({
  wouldDelete: { results, projects, other: 0, bytes },
  earliestDeletionAt: results + projects ? 'x' : null,
});

function setup(hours = 4320, p: RetentionPreview = preview(0)) {
  const previewFn = vi.fn(async () => p);
  const save = vi.fn(async (h: number) => settings(h));
  const onSaved = vi.fn();
  render(<RetentionPicker copy={copy} settings={settings(hours)} preview={previewFn} save={save} onSaved={onSaved} />);
  return { previewFn, save, onSaved };
}
const radio = (name: string) => screen.getByRole('radio', { name: new RegExp(name) });

afterEach(() => {
  cleanup();
  track.mockClear();
});

describe('RetentionPicker states', () => {
  it.each([
    [24, '24 hours'], [168, '7 days'], [720, '30 days'], [2160, '90 days'], [4320, '6 months'], [8760, '1 year'], [17520, '2 years'],
  ])('selects the %s h preset', (hours, label) => {
    setup(hours);
    expect((radio(label) as HTMLInputElement).checked).toBe(true);
    expect(screen.getByText(`Currently ${label}.`)).toBeTruthy();
  });

  it('marks 6 months as recommended', () => {
    setup();
    expect(screen.getByText('Recommended')).toBeTruthy();
  });

  it('shows Custom with the days when the window matches no preset', () => {
    setup(1080);
    expect((radio('Custom') as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText(/Custom window in days/) as HTMLInputElement).value).toBe('45');
    expect(screen.getByText('Currently 45 days.')).toBeTruthy();
  });

  it('custom: invalid input shows the inline error and disables Apply; valid saves hours', async () => {
    const { save } = setup(1080);
    const input = screen.getByLabelText(/Custom window in days/);
    fireEvent.change(input, { target: { value: '900' } });
    expect(screen.getByRole('alert').textContent).toContain('1 to 730');
    expect((screen.getByRole('button', { name: 'Apply' }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.change(input, { target: { value: '60' } });
    expect(screen.queryByRole('alert')).toBeNull();
    fireEvent.change(input, { target: { value: '90' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    await waitFor(() => expect(save).toHaveBeenCalledWith(2160));
  });

  it('shows Saving while in flight, then the saved message', async () => {
    let release: (s: AccountSettings) => void = () => undefined;
    const save = vi.fn(() => new Promise<AccountSettings>((r) => { release = r; }));
    render(<RetentionPicker copy={copy} settings={settings(720)} preview={vi.fn()} save={save} onSaved={vi.fn()} />);
    fireEvent.click(radio('1 year'));
    expect(await screen.findByText('Saving…')).toBeTruthy();
    expect((radio('1 year') as HTMLInputElement).checked).toBe(true); // optimistic
    release(settings(8760));
    expect(await screen.findByText(/Saved\. Your files are now kept for 1 year/)).toBeTruthy();
  });

  it('emits retention_setting_changed with buckets after a successful save, not after a failed one', async () => {
    const save = vi.fn(async (h: number) => settings(h));
    render(<RetentionPicker copy={copy} settings={settings(4320)} preview={vi.fn(async () => preview(0))} save={save} onSaved={vi.fn()} />);
    fireEvent.click(radio('1 year'));
    await waitFor(() => expect(track).toHaveBeenCalledWith('retention_setting_changed', { from_bucket: '6mo', to_bucket: '1y' }));
    cleanup();
    track.mockClear();
    const bad = vi.fn(async () => { throw new Error('500'); });
    render(<RetentionPicker copy={copy} settings={settings(4320)} preview={vi.fn()} save={bad} onSaved={vi.fn()} />);
    fireEvent.click(radio('1 year'));
    await waitFor(() => expect(bad).toHaveBeenCalled());
    expect(track).not.toHaveBeenCalled();
  });

  it('rolls back and says so when the save fails', async () => {
    const save = vi.fn(async () => { throw new Error('500'); });
    render(<RetentionPicker copy={copy} settings={settings(720)} preview={vi.fn()} save={save} onSaved={vi.fn()} />);
    fireEvent.click(radio('1 year'));
    expect(await screen.findByText(copy.privacy.retention.saveFailed)).toBeTruthy();
    expect((radio('30 days') as HTMLInputElement).checked).toBe(true);
    expect(screen.getByText('Currently 30 days.')).toBeTruthy();
  });
});

describe('RetentionPicker shrink confirmation', () => {
  it('with impact shows the dialog with the preview numbers, and saves only on confirm', async () => {
    const { previewFn, save } = setup(4320, preview(12, 3, 5 * 1024 ** 2));
    fireEvent.click(radio('7 days'));
    const dialog = await screen.findByRole('alertdialog');
    expect(previewFn).toHaveBeenCalledWith(168);
    expect(dialog.textContent).toContain('Shortening to 7 days will delete 12 results and 3 projects older than that within the hour.');
    expect(dialog.textContent).toContain('5 MB');
    expect(save).not.toHaveBeenCalled();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Shorten and delete' }));
    await waitFor(() => expect(save).toHaveBeenCalledWith(168));
  });

  it('cancel leaves the value unchanged and saves nothing', async () => {
    const { save } = setup(4320, preview(2));
    fireEvent.click(radio('7 days'));
    fireEvent.click(within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Keep my current window' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    expect(save).not.toHaveBeenCalled();
    expect((radio('6 months') as HTMLInputElement).checked).toBe(true);
  });

  it('a zero-impact shrink saves directly without a dialog', async () => {
    const { save } = setup(4320, preview(0));
    fireEvent.click(radio('7 days'));
    await waitFor(() => expect(save).toHaveBeenCalledWith(168));
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('lengthening never prompts or even asks for a preview', async () => {
    const { previewFn, save } = setup(720, preview(99));
    fireEvent.click(radio('2 years'));
    await waitFor(() => expect(save).toHaveBeenCalledWith(17520));
    expect(previewFn).not.toHaveBeenCalled();
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('if the preview fails nothing is saved', async () => {
    const previewFn = vi.fn(async () => { throw new Error('x'); });
    const save = vi.fn();
    render(<RetentionPicker copy={copy} settings={settings(4320)} preview={previewFn} save={save} onSaved={vi.fn()} />);
    fireEvent.click(radio('7 days'));
    expect(await screen.findByText(copy.privacy.retention.previewFailed)).toBeTruthy();
    expect(save).not.toHaveBeenCalled();
  });
});
