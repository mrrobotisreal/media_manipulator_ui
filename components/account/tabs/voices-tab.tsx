'use client';

import * as React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/account/confirm-dialog';
import { DANGER_TEXT_BUTTON_CLASS, LINK_CLASS, TEXT_BUTTON_CLASS } from '@/components/account/tabs/shared';
import type { AccountCopy } from '@/components/account/account-copy';
import { Panel } from '@/components/darkroom/panel';
import { PanelLoading } from '@/components/darkroom/panel-loading';
import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import { fmt } from '@/lib/account/retention';
import { isIrreversibleActionHidden } from '@/lib/translator/mode';
import { useDeleteVoice, useRenameVoice, useVoices } from '@/lib/useVoices';
import { VOICE_NAME_MAX_CHARS } from '@/lib/voices/consent';
import type { SavedVoice } from '@/lib/voices/voicesApi';

/**
 * Account → Voices (MM78 decision 7): the caller's saved voices with name, kind,
 * language, creation date and the consent record (date + text version, cloned voices
 * only), the preview, inline rename, delete through ConfirmDialog, and "n of N voices".
 * Data from GET /api/voices (MM77); rename PATCH, delete DELETE /api/voices/:id.
 */
const TOOLS = [
  { key: 'clone', href: '/tools/voice-cloning' },
  { key: 'design', href: '/tools/voice-designer' },
  { key: 'change', href: '/tools/voice-changer' },
] as const;

function languageNameFor(locale: string): (code: string) => string {
  let names: Intl.DisplayNames | null = null;
  try {
    names = new Intl.DisplayNames([locale], { type: 'language' });
  } catch {
    names = null;
  }
  return (code) => {
    try {
      return names?.of(code) ?? code;
    } catch {
      return code;
    }
  };
}

export const VoicesTab: React.FC<{ copy: AccountCopy }> = ({ copy }) => {
  const v = copy.voices;
  const { formatDate, language } = useLocalization('interface');
  const localized = useLocalizedHref();
  const languageName = React.useMemo(() => languageNameFor(language?.code ?? 'en-US'), [language?.code]);
  const voices = useVoices();
  const rename = useRenameVoice();
  const remove = useDeleteVoice();
  const [editing, setEditing] = React.useState<{ id: string; name: string } | null>(null);
  const [toDelete, setToDelete] = React.useState<SavedVoice | null>(null);
  const [live, setLive] = React.useState('');
  const hideDelete = isIrreversibleActionHidden();

  const announce = (message: string, ok: boolean) => {
    setLive(message);
    if (ok) toast.success(message);
    else toast.error(message);
  };

  if (voices.isPending) {
    return (
      <Panel title={copy.tabs.voices} titleAs="h2">
        <PanelLoading variant="inline" label={v.loading} />
      </Panel>
    );
  }
  if (voices.isError || !voices.data) {
    return (
      <Panel title={copy.tabs.voices} titleAs="h2">
        <p className="text-sm text-muted-foreground">{v.loadFailed}</p>
      </Panel>
    );
  }

  const { voices: list, limit, used } = voices.data;
  const usage = limit < 0 ? fmt(v.usageUnlimited, { used }) : fmt(v.usage, { used, limit });
  const date = (iso: string) => formatDate(iso, { year: 'numeric', month: 'short', day: 'numeric' });

  const submitRename = (voice: SavedVoice) => {
    if (!editing) return;
    const name = editing.name.trim();
    if (name === voice.name) {
      setEditing(null);
      return;
    }
    rename.mutate(
      { id: voice.id, name },
      {
        onSuccess: () => {
          setEditing(null);
          announce(v.renamed, true);
        },
        onError: () => announce(v.renameFailed, false),
      },
    );
  };

  return (
    <Panel title={copy.tabs.voices} titleAs="h2">
      <div role="status" aria-live="polite" className="sr-only">
        {live}
      </div>
      <p className="num mb-3 text-xs text-muted-foreground" data-testid="voices-usage">
        {usage}
      </p>
      {list.length === 0 ? (
        <div data-testid="voices-empty">
          <p className="text-sm text-muted-foreground">{v.empty}</p>
          <p className="mt-2 text-sm text-muted-foreground">{v.emptyCta}</p>
          <ul className="mt-2 flex flex-wrap gap-x-6">
            {TOOLS.map((tool) => (
              <li key={tool.key}>
                <Link href={localized(tool.href)} className={LINK_CLASS}>
                  {v.tools[tool.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">{v.intro}</p>
          <ul>
            {list.map((voice) => {
              const isEditing = editing?.id === voice.id;
              const nameOk = !!editing && editing.name.trim().length >= 1 && [...editing.name.trim()].length <= VOICE_NAME_MAX_CHARS;
              return (
                <li
                  key={voice.id}
                  data-testid="voice-row"
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-edge py-3.5 first:pt-0 last:border-b-0"
                >
                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <form
                        className="flex flex-wrap items-center gap-2"
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (nameOk) submitRename(voice);
                        }}
                      >
                        <input
                          autoFocus
                          aria-label={fmt(v.renameLabel, { name: voice.name })}
                          className="min-h-9 rounded-md border border-input bg-input px-2 text-sm text-foreground"
                          value={editing.name}
                          maxLength={VOICE_NAME_MAX_CHARS}
                          onChange={(e) => setEditing({ id: voice.id, name: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') setEditing(null);
                          }}
                        />
                        <button type="submit" disabled={!nameOk || rename.isPending} className={TEXT_BUTTON_CLASS}>
                          {v.save}
                        </button>
                        <button type="button" onClick={() => setEditing(null)} className={TEXT_BUTTON_CLASS}>
                          {v.cancel}
                        </button>
                      </form>
                    ) : (
                      <p className="flex items-center gap-2">
                        <span className="truncate text-sm text-foreground">{voice.name}</span>
                        <span className="shrink-0 rounded-full border border-edge px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          {v.kinds[voice.kind]}
                        </span>
                      </p>
                    )}
                    <p className="num text-xs text-muted-foreground">
                      {[languageName(voice.languageHint), fmt(v.created, { date: date(voice.createdAt) })].join(' · ')}
                    </p>
                    <p className="text-xs text-muted-foreground" data-testid="voice-consent">
                      {voice.consentAt
                        ? fmt(v.consent, { date: date(voice.consentAt), version: voice.consentTextVersion || '—' })
                        : v.noConsent}
                    </p>
                  </div>
                  {voice.previewUrl ? (
                    <audio controls preload="none" src={voice.previewUrl} className="h-9 max-w-full" aria-label={fmt(v.preview, { name: voice.name })} />
                  ) : null}
                  {isEditing ? null : (
                    <div className="flex items-center gap-4">
                      <button type="button" className={TEXT_BUTTON_CLASS} onClick={() => setEditing({ id: voice.id, name: voice.name })}>
                        {v.rename}
                      </button>
                      {hideDelete ? null : (
                        <button type="button" onClick={() => setToDelete(voice)} className={DANGER_TEXT_BUTTON_CLASS}>
                          {v.delete}
                        </button>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => {
          if (!open) setToDelete(null);
        }}
        title={fmt(v.deleteTitle, { name: toDelete?.name ?? '' })}
        description={v.deleteBody}
        confirmLabel={v.deleteConfirm}
        cancelLabel={v.cancel}
        busy={remove.isPending}
        onConfirm={() => {
          if (!toDelete) return;
          remove.mutate(toDelete.id, {
            onSuccess: (res) => announce(res.pending > 0 ? v.deletedPending : v.deleted, true),
            onError: () => announce(v.deleteFailed, false),
            onSettled: () => setToDelete(null),
          });
        }}
      />
    </Panel>
  );
};

export default VoicesTab;
