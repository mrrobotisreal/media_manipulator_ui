'use client';

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/account/confirm-dialog';
import { DANGER_TEXT_BUTTON_CLASS, LINK_CLASS } from '@/components/account/tabs/shared';
import type { AccountCopy } from '@/components/account/account-copy';
import { PanelLoading } from '@/components/darkroom/panel-loading';
import { useLocalization } from '@/i18n/useLocalization';
import { fmt } from '@/lib/account/retention';
import { PHOTO_BRAND } from '@/lib/photo/brand';
import { deleteServerPreset, listServerPresets, renameServerPreset, type ServerPreset } from '@/lib/photo/presetsApi';
import { USER_PRESET_NAME_MAX } from '@/lib/photo/presets/userStore';

/**
 * Account → Projects → Presets (MM103): the signed-in user's saved Aperture presets.
 * Writer's call (logged): a section under the projects list rather than a sub-tab,
 * because the Projects tab is not dense and the presets list is short (name, category,
 * updated, rename, delete).
 */
export const PresetsSection: React.FC<{ copy: AccountCopy; uid: string }> = ({ copy, uid }) => {
  const p = copy.projects;
  const { formatDate } = useLocalization('interface');
  const queryClient = useQueryClient();
  const [renaming, setRenaming] = React.useState<{ id: string; value: string } | null>(null);
  const [toDelete, setToDelete] = React.useState<ServerPreset | null>(null);
  const [live, setLive] = React.useState('');

  const presets = useQuery({
    queryKey: ['account-presets', uid],
    staleTime: 30_000,
    retry: 1,
    queryFn: async () => listServerPresets(undefined, false),
  });
  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ['account-presets', uid] });
    void queryClient.invalidateQueries({ queryKey: ['photo-presets'] });
  };

  const rename = useMutation({
    mutationFn: async ({ preset, name }: { preset: ServerPreset; name: string }) => renameServerPreset(preset.id, preset.revision, name),
    onSuccess: () => {
      setLive(p.presetRenamed);
      toast.success(p.presetRenamed);
    },
    onError: () => {
      setLive(p.presetRenameFailed);
      toast.error(p.presetRenameFailed);
    },
    onSettled: () => {
      setRenaming(null);
      refresh();
    },
  });
  const remove = useMutation({
    mutationFn: async (preset: ServerPreset) => deleteServerPreset(preset.id),
    onSuccess: () => {
      setLive(p.presetDeleted);
      toast.success(p.presetDeleted);
    },
    onError: () => {
      setLive(p.presetDeleteFailed);
      toast.error(p.presetDeleteFailed);
    },
    onSettled: () => {
      setToDelete(null);
      refresh();
    },
  });

  const list = presets.data?.presets ?? [];
  return (
    <section className="mt-8 border-t border-edge pt-6" aria-labelledby="account-presets-heading" data-testid="account-presets">
      <h3 id="account-presets-heading" className="mb-1 text-sm font-semibold text-foreground">
        {p.presetsHeading}
      </h3>
      <div role="status" aria-live="polite" className="sr-only">
        {live}
      </div>
      <p className="mb-3 text-xs text-muted-foreground">{fmt(p.presetsIntro, { brand: PHOTO_BRAND })}</p>
      {presets.isPending ? (
        <PanelLoading variant="inline" label={p.loading} />
      ) : presets.isError ? (
        <p className="text-xs text-muted-foreground">{p.presetsLoadFailed}</p>
      ) : list.length === 0 ? (
        <p className="text-sm text-muted-foreground">{fmt(p.presetsEmpty, { brand: PHOTO_BRAND })}</p>
      ) : (
        <ul>
          {list.map((preset) => (
            <li key={preset.id} data-testid="preset-row" className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-edge py-3 last:border-b-0">
              <div className="min-w-0">
                {renaming?.id === preset.id ? (
                  <form
                    className="flex items-center gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const name = renaming.value.trim();
                      if (name) rename.mutate({ preset, name });
                      else setRenaming(null);
                    }}
                  >
                    <input
                      autoFocus
                      aria-label={p.renameLabel}
                      maxLength={USER_PRESET_NAME_MAX}
                      value={renaming.value}
                      onChange={(e) => setRenaming({ id: preset.id, value: e.target.value })}
                      className="h-8 rounded border border-edge bg-surface-2 px-2 text-sm text-foreground"
                    />
                    <button type="submit" className={LINK_CLASS} disabled={rename.isPending}>
                      {p.renameSave}
                    </button>
                    <button type="button" className={LINK_CLASS} onClick={() => setRenaming(null)}>
                      {p.cancel}
                    </button>
                  </form>
                ) : (
                  <p className="flex items-center gap-2">
                    <span className="truncate text-sm text-foreground">{preset.name}</span>
                    {preset.category ? (
                      <span data-testid="preset-category" className="shrink-0 rounded-full border border-edge px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {p.presetCategory[preset.category]}
                      </span>
                    ) : null}
                  </p>
                )}
                <p className="num text-xs text-muted-foreground">{fmt(p.edited, { date: formatDate(preset.updatedAt, { month: 'short', day: 'numeric' }) })}</p>
              </div>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => setRenaming({ id: preset.id, value: preset.name })} className={LINK_CLASS}>
                  {p.rename}
                </button>
                <button type="button" onClick={() => setToDelete(preset)} className={DANGER_TEXT_BUTTON_CLASS}>
                  {p.delete}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => {
          if (!open) setToDelete(null);
        }}
        title={fmt(p.deleteTitle, { name: toDelete?.name ?? '' })}
        description={p.presetDeleteBody}
        confirmLabel={p.delete}
        cancelLabel={p.cancel}
        busy={remove.isPending}
        onConfirm={() => {
          if (toDelete) remove.mutate(toDelete);
        }}
      />
    </section>
  );
};

export default PresetsSection;
