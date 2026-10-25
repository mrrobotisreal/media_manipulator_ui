'use client';

import * as React from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/account/confirm-dialog';
import { DANGER_TEXT_BUTTON_CLASS, LINK_CLASS } from '@/components/account/tabs/shared';
import type { AccountCopy } from '@/components/account/account-copy';
import { Panel } from '@/components/darkroom/panel';
import { PanelLoading } from '@/components/darkroom/panel-loading';
import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import { retentionEvents } from '@/lib/analytics/retentionEvents';
import {
  deleteProject,
  deleteVectorProject,
  fetchStudioProjects,
  fetchVectorProjects,
  type StudioProjectSummary,
  type VectorProjectSummary,
} from '@/lib/auth/accountApi';
import { MOTION_BRAND } from '@/lib/vector/brand';
import { isIrreversibleActionHidden } from '@/lib/translator/mode';
import { fmt } from '@/lib/account/retention';
import { requireToken } from '@/lib/account/requireToken';

/**
 * Where the Open link points. The Darkroom host (components/content-studio/studio-host.tsx)
 * keeps the open project in component state and reads no URL parameter yet, so `?project=<id>`
 * is the forward-compatible contract: today it lands on the Darkroom entry screen, where the
 * same project is listed under recents.
 */
export function openProjectHref(localized: (path: string) => string, id: string): string {
  return `${localized('/tools/content-studio')}?project=${encodeURIComponent(id)}`;
}

/**
 * Motion's route is excluded from the locale proxy, so the Open link is the raw path and is
 * deliberately never passed through `localized(...)`.
 */
export function openMotionProjectHref(id: string): string {
  return `/motion/${encodeURIComponent(id)}`;
}

type ProjectRow =
  | { kind: 'darkroom'; project: StudioProjectSummary }
  | { kind: 'motion'; project: VectorProjectSummary };

function formatClock(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export const ProjectsTab: React.FC<{ copy: AccountCopy; uid: string }> = ({ copy, uid }) => {
  const p = copy.projects;
  const { formatDate } = useLocalization('interface');
  const localized = useLocalizedHref();
  const queryClient = useQueryClient();
  const [toDelete, setToDelete] = React.useState<ProjectRow | null>(null);
  const [live, setLive] = React.useState('');

  const projects = useQuery({
    queryKey: ['account-projects', uid, 'studio'],
    staleTime: 30_000,
    retry: 1,
    queryFn: async () => fetchStudioProjects(await requireToken()),
  });

  const motionProjects = useQuery({
    queryKey: ['account-projects', uid, 'vector'],
    staleTime: 30_000,
    retry: 1,
    queryFn: async () => fetchVectorProjects(await requireToken()),
  });

  const remove = useMutation({
    mutationFn: async (row: ProjectRow) =>
      row.kind === 'motion'
        ? deleteVectorProject(await requireToken(), row.project.id)
        : deleteProject(await requireToken(), row.project.id),
    onSuccess: (result) => {
      retentionEvents.itemDeleted('project', 1);
      const message = result.pending > 0 ? p.deletedPending : p.deleted;
      setLive(message);
      toast.success(message);
    },
    onError: () => {
      setLive(p.deleteFailed);
      toast.error(p.deleteFailed);
    },
    onSettled: () => {
      setToDelete(null);
      // Never trust a stale list after a destructive call.
      void queryClient.invalidateQueries({ queryKey: ['account-projects', uid] });
    },
  });

  if (projects.isPending || motionProjects.isPending) {
    return (
      <Panel title={copy.projectsTitle} titleAs="h2">
        <PanelLoading variant="inline" label={p.loading} />
      </Panel>
    );
  }
  if (projects.isError && motionProjects.isError) {
    return (
      <Panel title={copy.projectsTitle} titleAs="h2">
        <p className="text-sm text-muted-foreground">{p.loadFailed}</p>
      </Panel>
    );
  }

  const list: ProjectRow[] = [
    ...(projects.data ?? []).map((project): ProjectRow => ({ kind: 'darkroom', project })),
    ...(motionProjects.data ?? []).map((project): ProjectRow => ({ kind: 'motion', project })),
  ].sort((a, b) => Date.parse(b.project.updatedAt) - Date.parse(a.project.updatedAt));
  // A failure of one list must not blank the other; the failed side gets a muted note.
  const partialNote = projects.isError ? p.loadFailed : motionProjects.isError ? fmt(p.motionLoadFailed, { brand: MOTION_BRAND }) : null;
  return (
    <Panel title={copy.projectsTitle} titleAs="h2">
      <div role="status" aria-live="polite" className="sr-only">
        {live}
      </div>
      {partialNote ? <p className="mb-3 text-xs text-muted-foreground">{partialNote}</p> : null}
      {list.length === 0 ? (
        <>
          <p className="text-sm leading-relaxed text-muted-foreground">{copy.emptyProjects}</p>
          <Link href={localized('/tools/content-studio')} className={`${LINK_CLASS} mt-3`}>
            {copy.openStudio}
          </Link>
        </>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">{p.intro}</p>
          <ul>
            {list.map((row) => {
              const { project } = row;
              const isMotion = row.kind === 'motion';
              const edited = fmt(p.edited, { date: formatDate(project.updatedAt, { month: 'short', day: 'numeric' }) });
              return (
                <li
                  key={`${row.kind}:${project.id}`}
                  data-testid="project-row"
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-edge py-3.5 first:pt-0 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-2">
                      <span className="truncate text-sm text-foreground">{project.name || p.untitled}</span>
                      <span
                        data-testid="project-kind"
                        className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                          isMotion ? 'border-premium/40 text-premium' : 'border-edge text-muted-foreground'
                        }`}
                      >
                        {isMotion ? MOTION_BRAND : p.kindDarkroom}
                      </span>
                    </p>
                    <p className="num text-xs text-muted-foreground">
                      {row.kind === 'darkroom'
                        ? [fmt(p.duration, { duration: formatClock(row.project.durationSeconds) }), edited].join(' · ')
                        : edited}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      href={isMotion ? openMotionProjectHref(project.id) : openProjectHref(localized, project.id)}
                      className={LINK_CLASS}
                      onClick={() => retentionEvents.itemReopened('project', project.createdAt)}
                    >
                      {p.open}
                    </Link>
                    {/* MM44: Motion server deletes are hidden on translator deployments (MM52 rule). */}
                    {isMotion && isIrreversibleActionHidden() ? null : (
                      <button type="button" onClick={() => setToDelete(row)} className={DANGER_TEXT_BUTTON_CLASS}>
                        {p.delete}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <Link href={localized('/tools/content-studio')} className={`${LINK_CLASS} mt-4`}>
            {copy.openStudio}
          </Link>
        </>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => {
          if (!open) setToDelete(null);
        }}
        title={fmt(p.deleteTitle, { name: toDelete?.project.name || p.untitled })}
        description={toDelete?.kind === 'motion' ? fmt(p.motionDeleteBody, { brand: MOTION_BRAND }) : p.deleteBody}
        confirmLabel={p.deleteConfirm}
        cancelLabel={p.cancel}
        busy={remove.isPending}
        onConfirm={() => {
          if (toDelete) remove.mutate(toDelete);
        }}
      />
    </Panel>
  );
};

export default ProjectsTab;
