'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/account/confirm-dialog';
import type { AccountCopy } from '@/components/account/account-copy';
import { Segmented } from '@/components/darkroom/segmented';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { retentionEvents } from '@/lib/analytics/retentionEvents';
import type { AccountSettings, RetentionPreview } from '@/lib/auth/accountApi';
import { formatBytes } from '@/lib/auth/formatLimits';
import {
  CUSTOM_ID,
  CUSTOM_MAX_DAYS,
  fmt,
  parseCustomDays,
  presetForHours,
  previewTotal,
  RECOMMENDED_PRESET,
  RETENTION_PRESETS,
  type PresetId,
} from '@/lib/account/retention';

type RetentionCopy = AccountCopy['privacy']['retention'];

/** "6 months", "30 days", "36 hours": the preset's name when there is one, else derived. */
export function windowLabel(hours: number, copy: RetentionCopy): string {
  const preset = presetForHours(hours);
  if (preset) return copy.preset[preset];
  if (hours % 24 === 0) {
    const days = hours / 24;
    return days === 1 ? copy.windowDay : fmt(copy.windowDays, { count: days });
  }
  return fmt(copy.windowHours, { count: hours });
}

export interface RetentionPickerProps {
  copy: AccountCopy;
  settings: AccountSettings;
  /** The shrink impact for a smaller window. The preview endpoint is the only source of numbers. */
  preview: (hours: number) => Promise<RetentionPreview>;
  /** Persists the window; resolves with the saved settings. */
  save: (hours: number) => Promise<AccountSettings>;
  onSaved: (settings: AccountSettings) => void;
}

type Pick = PresetId | typeof CUSTOM_ID;

/**
 * The retention picker: presets plus Custom, optimistic save with rollback, and a
 * preview-backed confirmation before any shrink that would delete something. Lengthening
 * never prompts. The windows are the user's choice, not the plan's (ADR-0010).
 */
export const RetentionPicker: React.FC<RetentionPickerProps> = ({ copy, settings, preview, save, onSaved }) => {
  const r = copy.privacy.retention;
  const limits = settings.limits;
  const [hours, setHours] = React.useState(settings.retentionHours);
  const [customMode, setCustomMode] = React.useState(() => presetForHours(settings.retentionHours) === null);
  const [customDays, setCustomDays] = React.useState(() => String(Math.max(1, Math.round(settings.retentionHours / 24))));
  const [busy, setBusy] = React.useState<'idle' | 'checking' | 'saving'>('idle');
  const [pending, setPending] = React.useState<{ hours: number; preview: RetentionPreview } | null>(null);
  const [message, setMessage] = React.useState('');
  const customParsed = parseCustomDays(customDays, limits);
  const showInvalid = customMode && customDays !== '' && !customParsed.ok;

  const selected: Pick = customMode ? CUSTOM_ID : (presetForHours(hours) ?? CUSTOM_ID);

  const commit = async (next: number) => {
    const previous = hours;
    setHours(next); // optimistic
    setBusy('saving');
    setMessage(r.saving);
    try {
      const saved = await save(next);
      setHours(saved.retentionHours);
      onSaved(saved);
      retentionEvents.settingsChanged({ from_hours: previous, to_hours: saved.retentionHours });
      const done = fmt(r.saved, { window: windowLabel(saved.retentionHours, r) });
      setMessage(done);
      toast.success(done);
    } catch {
      setHours(previous); // rollback
      setCustomMode(presetForHours(previous) === null);
      setMessage(r.saveFailed);
      toast.error(r.saveFailed);
    } finally {
      setBusy('idle');
    }
  };

  const request = async (next: number) => {
    if (next === hours || busy !== 'idle') return;
    if (next > hours) {
      await commit(next); // lengthening never prompts
      return;
    }
    setBusy('checking');
    setMessage('');
    try {
      const result = await preview(next);
      if (previewTotal(result) === 0) {
        setBusy('idle');
        await commit(next); // a zero-impact shrink saves directly
        return;
      }
      setPending({ hours: next, preview: result });
    } catch {
      // Without the preview we cannot say what would be deleted, so nothing changes.
      setMessage(r.previewFailed);
      toast.error(r.previewFailed);
    } finally {
      setBusy((b) => (b === 'checking' ? 'idle' : b));
    }
  };

  const onPick = (value: Pick) => {
    if (value === CUSTOM_ID) {
      setCustomMode(true);
      return;
    }
    setCustomMode(false);
    const preset = RETENTION_PRESETS.find((p) => p.id === value);
    if (preset) void request(preset.hours);
  };

  const options = [
    ...RETENTION_PRESETS.map((p) => ({
      value: p.id as Pick,
      label: (
        <span className="flex flex-col items-center leading-tight">
          <span>{r.preset[p.id]}</span>
          {p.id === RECOMMENDED_PRESET ? <span className="text-[10px] text-data">{r.recommended}</span> : null}
        </span>
      ),
    })),
    { value: CUSTOM_ID as Pick, label: r.custom },
  ];

  const w = pending?.preview.wouldDelete;
  return (
    <div className="grid gap-4" data-testid="retention-picker">
      <div className="overflow-x-auto">
        <Segmented<Pick>
          name="retention-window"
          label={r.label}
          value={selected}
          onValueChange={onPick}
          options={options}
        />
      </div>

      {customMode ? (
        <div className="flex flex-wrap items-end gap-3">
          <div className="grid gap-1">
            <Label htmlFor="retention-custom-days" className="text-xs text-muted-foreground">
              {r.customLabel}
            </Label>
            <Input
              id="retention-custom-days"
              inputMode="numeric"
              value={customDays}
              onChange={(event) => setCustomDays(event.target.value)}
              aria-invalid={showInvalid}
              aria-describedby={showInvalid ? 'retention-custom-error' : undefined}
              className="min-h-11 w-32 sm:min-h-9"
              max={CUSTOM_MAX_DAYS}
            />
          </div>
          <Button
            type="button"
            className="min-h-11 sm:min-h-9"
            disabled={!customParsed.ok || busy !== 'idle'}
            onClick={() => customParsed.ok && void request(customParsed.hours)}
          >
            {r.customApply}
          </Button>
          {showInvalid ? (
            <p id="retention-custom-error" role="alert" className="basis-full text-xs text-destructive">
              {r.customInvalid}
            </p>
          ) : null}
        </div>
      ) : null}

      <p className="text-sm text-muted-foreground">{fmt(r.current, { window: windowLabel(hours, r) })}</p>
      <p role="status" aria-live="polite" className="min-h-5 text-xs text-muted-foreground">
        {message}
      </p>

      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPending(null);
            setCustomMode(presetForHours(hours) === null);
          }
        }}
        title={pending ? fmt(copy.privacy.shrink.title, { window: windowLabel(pending.hours, r) }) : ''}
        description={
          pending && w
            ? fmt(copy.privacy.shrink.body, {
                window: windowLabel(pending.hours, r),
                results: w.results,
                projects: w.projects,
              })
            : ''
        }
        confirmLabel={copy.privacy.shrink.confirm}
        cancelLabel={copy.privacy.shrink.cancel}
        busy={busy === 'saving'}
        onConfirm={async () => {
          if (!pending) return;
          const next = pending.hours;
          setPending(null);
          await commit(next);
        }}
      >
        {w ? (
          <div className="grid gap-1 text-sm text-muted-foreground">
            <p className="num">{fmt(copy.privacy.shrink.bytes, { size: formatBytes(w.bytes) === '—' ? '0 MB' : formatBytes(w.bytes) })}</p>
            {w.other > 0 ? <p className="num">{fmt(copy.privacy.shrink.other, { other: w.other })}</p> : null}
            <p>{copy.privacy.shrink.irreversible}</p>
          </div>
        ) : null}
      </ConfirmDialog>
    </div>
  );
};
