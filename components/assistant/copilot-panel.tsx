'use client';

/**
 * Medi's editing copilot panel (MM108 decision 1), editor-agnostic: a collapsible inline-end
 * panel (a bottom sheet under 768 px) with starter chips, the conversation (shared markdown
 * renderer), the Undo chip and "what I changed" list of every applied edit, "Plan my edit", the
 * "Let Medi see the preview" toggle, the one-time frames disclosure, and the sign-in / limit
 * states. All document work happens in the editor's `CopilotAdapter`; the loop is `useCopilot`.
 * Loaded lazily with the assistant shard (`interface/assistant.json`) by the editor.
 */
import * as React from 'react';
import { ChevronDown, ListChecks, Loader2, Plus, Send, Square, Undo2, X } from 'lucide-react';

import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import { MEDI_BRAND, MEDI_MARK_SRC } from '@/lib/assistant/brand';
import { planSteps, useCopilot, type AppliedEdit } from '@/lib/assistant/copilot/useCopilot';
import type { CopilotAdapter } from '@/lib/assistant/copilot/types';
import type { AssistantTrack, AssistantUiMessage } from '@/lib/assistant/useAssistantStream';
import type { StreamDeps } from '@/lib/assistant/stream';
import type { Tier } from '@/lib/analytics/events';
import type { AssistantCapabilities } from '@/schemas/assistant';
import { getAssistantCapabilities } from '@/lib/assistant/api';
import { cn } from '@/lib/utils';

import AssistantMarkdown from './markdown';
import { errorKey } from './guide-sheet';

export const COPILOT_STARTERS: Record<CopilotAdapter['surface'], readonly string[]> = {
  photo: ['fixLighting', 'moody', 'keepRed', 'vintage'],
  studio: ['cinematic', 'lowerThird', 'pauses', 'voice'],
  vector: ['lowerThird', 'logoReveal', 'titlePop', 'forSocial'],
};

export interface CopilotPanelProps {
  adapter: CopilotAdapter;
  capabilities: AssistantCapabilities | null;
  signedIn: boolean;
  tier: Tier;
  track: AssistantTrack;
  onClose: () => void;
  /** Turn cost of "Plan my edit" (shown in its hint). */
  planCost?: number;
  deps?: StreamDeps;
  /** Opens the editor's sign-in (the chromeless editors link to /account). */
  signInHref?: string;
  /** Re-reads capabilities after each turn so "N edits left today" follows the server (tests inject a fake). */
  loadCapabilities?: () => Promise<AssistantCapabilities | null>;
}

export default function CopilotPanel({
  adapter,
  capabilities,
  signedIn,
  tier,
  track,
  onClose,
  planCost = 3,
  deps,
  signInHref = '/account',
  loadCapabilities = getAssistantCapabilities,
}: CopilotPanelProps) {
  const { t, language } = useLocalization(['interface']);
  const localized = useLocalizedHref();
  const locale = language.code;
  const b = { brand: MEDI_BRAND };
  const cp = useCopilot({ adapter, locale, track, tier, deps });
  const [draft, setDraft] = React.useState('');
  const listRef = React.useRef<HTMLDivElement>(null);
  const caps = capabilities && capabilities.enabled ? capabilities : null;
  const maxChars = caps?.maxMessageChars ?? 4000;
  const canEdit = !!caps?.copilot.editSurfaces?.includes(adapter.surface);
  // The editor loads capabilities once on open; a turn spends (or refunds) the daily allowance on the
  // server, so re-read it whenever a stream ends (Mitch, 2026-11-05: the count stayed at 5 after an edit).
  const [liveTurns, setLiveTurns] = React.useState<Extract<AssistantCapabilities, { enabled: true }>['turns'] | null>(null);
  // Only once the whole turn has ended: an edit's verify round (`awaiting`) follows the first reply,
  // and a re-render while it captures the after-frame would cancel it.
  const lastReply = [...cp.messages].reverse().find((m) => m.role === 'assistant');
  const turnEnded = !cp.streaming && !!lastReply && lastReply.status !== 'streaming' && !(lastReply.status === 'complete' && lastReply.awaiting);
  const settled = turnEnded ? cp.messages.filter((m) => m.role === 'assistant').length : 0;
  React.useEffect(() => {
    if (settled === 0 || !signedIn) return;
    let alive = true;
    void loadCapabilities()
      .then((c) => {
        if (alive && c && c.enabled && c.turns) setLiveTurns(c.turns);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [settled, signedIn, loadCapabilities]);
  const turns = liveTurns ?? caps?.turns ?? null;
  const signInNeeded = !signedIn || cp.lastError === 'sign_in_required';

  React.useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [cp.messages, cp.applied]);

  const submit = (text: string, plan = false) => {
    const clean = text.slice(0, maxChars);
    void cp.send(clean, { plan }).then((ok) => ok && !plan && setDraft(''));
  };

  if (!caps || !caps.copilot.surfaces.includes(adapter.surface)) {
    return (
      <PanelFrame onClose={onClose} title={t('assistant.copilot.title', b)} subtitle={t('assistant.copilot.subtitle')} closeLabel={t('assistant.copilot.close', b)}>
        <p className="p-4 text-sm text-muted-foreground" data-testid="copilot-unavailable">
          {t('assistant.copilot.unavailable', b)}
        </p>
      </PanelFrame>
    );
  }

  // Edits belong to the answer whose stream carried them (matched by the tool call id).
  const editsFor = (m: AssistantUiMessage) => cp.applied.filter((e) => m.edits.some((x) => x.callId === e.callId));
  const rejectedFor = (m: AssistantUiMessage) => cp.rejected.filter((e) => m.edits.some((x) => x.callId === e.callId));
  const latest = [...cp.applied].reverse().find((e) => !e.undone);

  return (
    <PanelFrame
      onClose={onClose}
      title={t('assistant.copilot.title', b)}
      subtitle={t('assistant.copilot.subtitle')}
      closeLabel={t('assistant.copilot.close', b)}
      actions={
        <button type="button" className="rounded p-2 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label={t('assistant.copilot.newChat')} title={t('assistant.copilot.newChat')} onClick={cp.reset}>
          <Plus className="size-4" />
        </button>
      }
    >
      <div ref={listRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-3" aria-live="polite" data-testid="copilot-messages">
        {signInNeeded ? (
          <div className="rounded-md border border-edge bg-surface-1 p-3 text-sm" data-testid="copilot-sign-in">
            <p className="font-medium">{t('assistant.copilot.signInTitle', b)}</p>
            <p className="mt-1 text-muted-foreground">{t('assistant.copilot.signInBody', b)}</p>
            <a href={localized(signInHref)} target="_blank" rel="noopener" className="mt-2 inline-flex min-h-11 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
              {t('assistant.copilot.signIn')}
            </a>
          </div>
        ) : null}
        {cp.messages.length === 0 && !signInNeeded ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{t('assistant.copilot.welcome')}</p>
            <div className="flex flex-wrap gap-2" data-testid="copilot-starters">
              {COPILOT_STARTERS[adapter.surface].map((k) => (
                <button
                  key={k}
                  type="button"
                  disabled={cp.streaming || !canEdit}
                  className="min-h-11 rounded-full border border-edge px-3 text-start text-sm hover:bg-accent disabled:opacity-50"
                  onClick={() => submit(t(`assistant.copilot.starters.${adapter.surface}.${k}`))}
                >
                  {t(`assistant.copilot.starters.${adapter.surface}.${k}`)}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        {cp.messages.map((m, i) => {
          if (m.role === 'user') {
            return (
              <div key={m.key} className="ms-6 rounded-lg bg-primary/10 px-3 py-2 text-sm whitespace-pre-wrap">
                {m.text}
              </div>
            );
          }
          const steps = m.status === 'complete' ? planSteps(m.text) : [];
          const isLast = i === cp.messages.length - 1;
          return (
            <div key={m.key} className="space-y-2" data-testid="copilot-answer" data-status={m.status}>
              {m.text ? <AssistantMarkdown content={m.text} locale={locale} /> : null}
              {m.status === 'streaming' && !m.text ? (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  {m.tool ? t('assistant.copilot.looking') : t('assistant.copilot.thinking')}
                </p>
              ) : null}
              {editsFor(m).map((e) => (
                <EditCard key={e.callId} edit={e} latest={e === latest} canUndo={cp.canUndo(e)} onUndo={() => cp.undo(e)} />
              ))}
              {rejectedFor(m).length > 0 ? (
                <p className="text-xs text-muted-foreground" data-testid="copilot-rejected">
                  {t('assistant.copilot.rejected')}
                </p>
              ) : null}
              {m.actions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {m.actions.map((a) =>
                    adapter.suggest[a.kind] ? (
                      <ActionButton key={a.callId} label={a.label} run={() => cp.runAction(a)} />
                    ) : null,
                  )}
                </div>
              ) : null}
              {m.ask ? (
                <div className="space-y-2">
                  <p className="text-sm">{m.ask.question}</p>
                  <div className="flex flex-wrap gap-2">
                    {(m.ask.choices ?? []).map((c) => (
                      <button key={c} type="button" disabled={cp.streaming} className="min-h-11 rounded-full border border-edge px-3 text-sm hover:bg-accent disabled:opacity-50" onClick={() => submit(c)}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              {steps.length && isLast ? (
                <div className="rounded-md border border-edge p-2" data-testid="copilot-plan">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t('assistant.copilot.planSteps')}</p>
                  <ol className="space-y-1">
                    {steps.map((s, n) => (
                      <li key={n} className="flex items-start gap-2 text-sm">
                        <span className="mt-1 text-xs text-muted-foreground">{n + 1}.</span>
                        <span className="min-w-0 flex-1">{s}</span>
                        <button type="button" disabled={cp.streaming} className="shrink-0 rounded border border-edge px-2 py-1 text-xs hover:bg-accent disabled:opacity-50" onClick={() => submit(t('assistant.copilot.doStepMessage', { n: n + 1, step: s }))}>
                          {t('assistant.copilot.doStep')}
                        </button>
                      </li>
                    ))}
                  </ol>
                  <button type="button" disabled={cp.streaming} className="mt-2 min-h-9 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground disabled:opacity-50" onClick={() => submit(t('assistant.copilot.doAllMessage'))}>
                    {t('assistant.copilot.doAll')}
                  </button>
                </div>
              ) : null}
              {m.status === 'stopped' ? <p className="text-xs text-muted-foreground">{t('assistant.copilot.stopped')}</p> : null}
              {m.status === 'error' && m.errorCode !== 'limit' && m.errorCode !== 'sign_in_required' ? (
                <p className="text-sm text-destructive" role="alert">
                  {t(`assistant.errors.${errorKey(m.errorCode)}`, b)}
                </p>
              ) : null}
            </div>
          );
        })}
        {cp.limitHit ? (
          <div className="rounded-md border border-premium/40 bg-premium/10 p-3 text-sm" data-testid="copilot-limit">
            <p className="font-medium">{t('assistant.copilot.limitTitle', b)}</p>
            <p className="mt-1 text-muted-foreground">{t('assistant.copilot.limitBody')}</p>
            <a href={localized('/pricing')} target="_blank" rel="noopener" className="mt-2 inline-flex min-h-11 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
              {t('assistant.copilot.seePlans')}
            </a>
          </div>
        ) : null}
      </div>

      {cp.notice && adapter.frameOnMessage && cp.preview && !signInNeeded ? (
        <div className="mx-3 mb-2 rounded-md border border-edge bg-surface-1 p-2 text-xs" role="note" data-testid="copilot-notice">
          <p>{t('assistant.copilot.notice', b)}</p>
          <div className="mt-1 flex items-center gap-3">
            <button type="button" className="font-medium text-primary hover:underline" onClick={cp.dismissNotice}>
              {t('assistant.copilot.noticeOk')}
            </button>
            <a href={localized('/privacy-policy')} target="_blank" rel="noopener" className="underline underline-offset-2">
              {t('assistant.copilot.privacyLink')}
            </a>
          </div>
        </div>
      ) : null}

      <form
        className="border-t border-edge p-3"
        onSubmit={(e) => {
          e.preventDefault();
          submit(draft);
        }}
      >
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, maxChars))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                submit(draft);
              }
            }}
            rows={2}
            maxLength={maxChars}
            disabled={signInNeeded || !canEdit}
            placeholder={t('assistant.copilot.placeholder', b)}
            aria-label={t('assistant.copilot.placeholder', b)}
            className="min-h-11 flex-1 resize-none rounded-md border border-edge bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            data-testid="copilot-input"
          />
          {cp.streaming ? (
            <button type="button" onClick={cp.stop} className="flex size-11 items-center justify-center rounded-md border border-edge hover:bg-accent" aria-label={t('assistant.copilot.stop')} title={t('assistant.copilot.stop')} data-testid="copilot-stop">
              <Square className="size-4" />
            </button>
          ) : (
            <button type="submit" disabled={!draft.trim() || signInNeeded || !canEdit} className="flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-50" aria-label={t('assistant.copilot.send')} title={t('assistant.copilot.send')} data-testid="copilot-send">
              <Send className="size-4 rtl:-scale-x-100" />
            </button>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <button
            type="button"
            disabled={!draft.trim() || cp.streaming || signInNeeded || !canEdit}
            onClick={() => {
              submit(draft, true);
              setDraft('');
            }}
            title={t('assistant.copilot.planHint', { ...b, count: planCost })}
            className="inline-flex min-h-8 items-center gap-1 rounded-full border border-edge px-2.5 text-foreground hover:bg-accent disabled:opacity-50"
            data-testid="copilot-plan-button"
          >
            <ListChecks className="size-3.5" />
            {t('assistant.copilot.plan')}
          </button>
          {adapter.frameOnMessage ? (
            <label className="inline-flex min-h-8 items-center gap-1.5">
              <input type="checkbox" checked={cp.preview} onChange={(e) => cp.setPreview(e.target.checked)} data-testid="copilot-preview-toggle" />
              {t('assistant.copilot.preview', b)}
            </label>
          ) : null}
          {turns && signedIn ? (
            <span className="ms-auto" data-testid="copilot-turns">
              {turns.limit < 0 ? t('assistant.copilot.turnsUnlimited') : t('assistant.copilot.turnsLeft', { count: turns.remaining })}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">{t('assistant.copilot.disclaimer', b)}</p>
      </form>
    </PanelFrame>
  );
}

function PanelFrame({ children, onClose, title, subtitle, closeLabel, actions }: { children: React.ReactNode; onClose: () => void; title: string; subtitle: string; closeLabel: string; actions?: React.ReactNode }) {
  return (
    <section className="flex h-full min-h-0 flex-col bg-surface-1" aria-label={title} data-testid="copilot-panel">
      <header className="flex items-center gap-2 border-b border-edge px-3 py-2">
        <img src={MEDI_MARK_SRC} alt="" width={24} height={24} />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
        {actions}
        <button type="button" className="rounded p-2 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label={closeLabel} title={closeLabel} onClick={onClose} data-testid="copilot-close">
          <X className="size-4" />
        </button>
      </header>
      {children}
    </section>
  );
}

function EditCard({ edit, latest, canUndo, onUndo }: { edit: AppliedEdit; latest: boolean; canUndo: boolean; onUndo: () => void }) {
  const { t } = useLocalization(['interface']);
  const [open, setOpen] = React.useState(false);
  return (
    <div className="rounded-md border border-primary/30 bg-primary/5 p-2 text-sm" data-testid="copilot-edit" data-undone={edit.undone ? 'true' : 'false'}>
      <div className="flex items-center gap-2">
        <img src={MEDI_MARK_SRC} alt="" width={14} height={14} />
        <span className="min-w-0 flex-1 truncate font-medium">{t('assistant.copilot.applied', { brand: MEDI_BRAND, summary: edit.summary })}</span>
        {edit.undone ? (
          <span className="text-xs text-muted-foreground">{t('assistant.copilot.undone')}</span>
        ) : latest && canUndo ? (
          <button type="button" onClick={onUndo} className="inline-flex min-h-8 items-center gap-1 rounded-full border border-edge bg-background px-2.5 text-xs hover:bg-accent" data-testid="copilot-undo">
            <Undo2 className="size-3.5" />
            {t('assistant.copilot.undo')}
          </button>
        ) : null}
      </div>
      {edit.changes.length ? (
        <>
          <button type="button" className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} />
            {t('assistant.copilot.whatChanged')}
          </button>
          {open ? (
            <ul className="mt-1 list-disc space-y-0.5 ps-5 text-xs" data-testid="copilot-changes">
              {edit.changes.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function ActionButton({ label, run }: { label: string; run: () => Promise<boolean> }) {
  const { t } = useLocalization(['interface']);
  const [state, setState] = React.useState<'idle' | 'busy' | 'failed'>('idle');
  return (
    <span className="inline-flex flex-col gap-1">
      <button
        type="button"
        disabled={state === 'busy'}
        data-testid="copilot-action"
        className="inline-flex min-h-11 items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-3 text-sm font-medium hover:bg-primary/20 disabled:opacity-50"
        onClick={() => {
          setState('busy');
          run()
            .then(() => setState('idle'))
            .catch(() => setState('failed'));
        }}
      >
        {state === 'busy' ? <Loader2 className="size-4 animate-spin" /> : null}
        {state === 'busy' ? t('assistant.copilot.actions.running') : label}
      </button>
      {state === 'failed' ? <span className="text-xs text-destructive">{t('assistant.copilot.actions.failed')}</span> : null}
    </span>
  );
}
