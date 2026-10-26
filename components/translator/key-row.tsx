'use client';

/**
 * One workbench row (MM53 decisions 3, 6, 7, 10): English source (always LTR),
 * the editable translation in the locale's direction, attribute badges, modified
 * dot, warnings, revert. Plural groups render as one block with a field per CLDR
 * form; `<Trans>` strings edit the raw template in a monospace field with a preview.
 *
 * Each row subscribes to its own `rowSnapshot`, so typing re-renders one row.
 */
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CHROME } from '@/lib/translator/chromeCopy';
import type { KeyEntry, PluralGroup } from '@/lib/translator/keyTable';
import type { ValidationWarning } from '@/lib/translator/validators';
import type { WorkbenchModel } from '@/lib/translator/workbenchModel';
import { cn } from '@/lib/utils';
import { TransPreview } from './trans-preview';

export interface RowCallbacks {
  /** Row hover / focus -> page outline. `null` = left the row. */
  onHighlight: (id: string | null) => void;
}

function useRow(model: WorkbenchModel, ids: readonly string[]): string {
  const subscribe = model.subscribe;
  const snap = React.useCallback(() => ids.map((id) => model.rowSnapshot(id)).join('\u0002'), [model, ids]);
  return React.useSyncExternalStore(subscribe, snap, snap);
}

/** DOM id of a row's (first) field, for Alt+click focus. */
export function fieldDomId(entryId: string): string {
  let h = 0;
  for (let i = 0; i < entryId.length; i++) h = (Math.imul(h, 31) + entryId.charCodeAt(i)) | 0;
  return `tw-field-${(h >>> 0).toString(36)}`;
}

const Dot: React.FC<{ on: boolean }> = ({ on }) =>
  on ? (
    <span
      className="inline-block size-2 shrink-0 rounded-full bg-premium"
      role="img"
      aria-label={CHROME.modified}
      title={CHROME.modified}
      data-modified=""
    />
  ) : null;

const Warnings: React.FC<{ list: ValidationWarning[] }> = ({ list }) => {
  if (!list.length) return null;
  return (
    <ul className="mt-1 space-y-0.5 text-[11px] leading-snug text-amber-700 dark:text-amber-400" aria-label={CHROME.warnings(list.length)}>
      {list.map((w) => (
        <li key={w.id} data-warning={w.code}>
          ⚠ {w.message}
        </li>
      ))}
    </ul>
  );
};

const Flags: React.FC<{ model: WorkbenchModel; id: string }> = ({ model, id }) => (
  <>
    {model.isApproximate(id) ? (
      <Badge variant="outline" className="text-[10px]" title={CHROME.approximateHint} data-approximate="">
        {CHROME.approximate}
      </Badge>
    ) : null}
    {model.upstreamChanged(id) ? (
      <Badge variant="outline" className="text-[10px]" title={CHROME.upstreamChangedHint}>
        {CHROME.upstreamChanged}
      </Badge>
    ) : null}
  </>
);

interface FieldProps {
  model: WorkbenchModel;
  entry: KeyEntry;
  dir: 'ltr' | 'rtl';
  lang: string;
  label: string;
  domId?: string;
  onFocusRow: () => void;
}

const Field: React.FC<FieldProps> = ({ model, entry, dir, lang, label, domId, onFocusRow }) => {
  const value = model.valueOf(entry.id);
  const multiline = entry.trans || value.length > 60 || value.includes('\n') || (entry.english?.length ?? 0) > 60;
  const common = {
    id: domId,
    dir,
    lang,
    'aria-label': label,
    value,
    spellCheck: true,
    onFocus: onFocusRow,
    onBlur: () => model.endEdit(entry.id),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => model.edit(entry.id, e.target.value),
    className: cn(
      'w-full min-w-0 rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-xs outline-none',
      'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
      entry.trans && 'font-mono text-xs',
    ),
  };
  return multiline ? <textarea rows={entry.trans ? 3 : 2} {...common} /> : <input type="text" {...common} />;
};

interface KeyRowProps extends RowCallbacks {
  model: WorkbenchModel;
  entryId: string;
  dir: 'ltr' | 'rtl';
  lang: string;
  /** Show the page sites (This page tab). */
  showSites?: boolean;
}

/** A single key, or a whole plural group when `entryId` is a group's form. */
export const KeyRow: React.FC<KeyRowProps> = React.memo(function KeyRow(props) {
  const { model, entryId } = props;
  const entry = model.entry(entryId);
  const group = entry ? model.table.groupOf(entry) : undefined;
  if (!entry) return null;
  return group ? <PluralRow {...props} group={group} /> : <SingleRow {...props} entry={entry} />;
});

const RowShell: React.FC<{
  entryId: string;
  hovered: boolean;
  onHighlight: (id: string | null) => void;
  children: React.ReactNode;
}> = ({ entryId, hovered, onHighlight, children }) => (
  <div
    data-entry-id={entryId}
    data-hovered={hovered ? '' : undefined}
    onMouseEnter={() => onHighlight(entryId)}
    onMouseLeave={() => onHighlight(null)}
    className={cn(
      'border-b border-border/60 px-3 py-2 transition-colors',
      hovered && 'bg-premium/10 outline outline-1 -outline-offset-1 outline-premium/60',
    )}
  >
    {children}
  </div>
);

const KeyHeader: React.FC<{ keyName: string; group: string; badges?: React.ReactNode; dot: boolean }> = ({
  keyName,
  group,
  badges,
  dot,
}) => (
  <div className="flex min-w-0 items-center gap-1.5" dir="ltr">
    <Dot on={dot} />
    <code className="min-w-0 truncate text-[11px] text-muted-foreground" title={`${group} › ${keyName}`}>
      {keyName}
    </code>
    <span className="ms-auto flex shrink-0 flex-wrap items-center gap-1">{badges}</span>
  </div>
);

const SingleRow: React.FC<KeyRowProps & { entry: KeyEntry }> = ({ model, entry, dir, lang, showSites, onHighlight }) => {
  useRow(model, React.useMemo(() => [entry.id], [entry.id]));
  const pk = model.pageKey(entry.id);
  const attrs = showSites && pk ? [...pk.sites].filter((s) => s !== 'text') : [];
  const modified = model.isModified(entry.id);
  const value = model.valueOf(entry.id);
  return (
    <RowShell entryId={entry.id} hovered={model.isHovered(entry.id)} onHighlight={onHighlight}>
      <KeyHeader
        keyName={entry.key}
        group={entry.group}
        dot={modified}
        badges={
          <>
            {attrs.map((a) => (
              <Badge key={a} variant="secondary" className="text-[10px]" data-attr-badge={a}>
                {CHROME.attributeBadge(a)}
              </Badge>
            ))}
            {entry.isNew ? (
              <Badge variant="outline" className="text-[10px]">
                {CHROME.newKey}
              </Badge>
            ) : null}
            <Flags model={model} id={entry.id} />
            {modified ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-1.5 text-[11px]"
                aria-label={CHROME.revertKey(entry.key)}
                onClick={() => model.revert(entry.id)}
              >
                {CHROME.revert}
              </Button>
            ) : null}
          </>
        }
      />
      <p dir="ltr" lang="en" className="mt-1 whitespace-pre-wrap break-words text-xs text-muted-foreground">
        {entry.english ?? '—'}
      </p>
      <div className="mt-1">
        <Field
          model={model}
          entry={entry}
          dir={dir}
          lang={lang}
          label={CHROME.editField(entry.key)}
          domId={fieldDomId(entry.id)}
          onFocusRow={() => onHighlight(entry.id)}
        />
      </div>
      {entry.trans ? (
        <div className="mt-1">
          <TransPreview template={value} source={entry.english ?? entry.base ?? ''} dir={dir} />
        </div>
      ) : null}
      <Warnings list={model.warnings(entry.id)} />
    </RowShell>
  );
};

const PluralRow: React.FC<KeyRowProps & { group: PluralGroup }> = ({ model, group, dir, lang, showSites, onHighlight }) => {
  const ids = React.useMemo(() => group.forms.map((f) => f.id), [group]);
  useRow(model, ids);
  const first = group.forms[0];
  const modified = ids.some((id) => model.isModified(id));
  const hovered = ids.some((id) => model.isHovered(id));
  const attrs = showSites
    ? [...new Set(ids.flatMap((id) => [...(model.pageKey(id)?.sites ?? [])]))].filter((s) => s !== 'text')
    : [];
  const groupWarnings = model.groupWarningsFor(group.id);
  return (
    <RowShell entryId={first.id} hovered={hovered} onHighlight={onHighlight}>
      <div role="group" aria-label={`${CHROME.pluralGroup}: ${group.base}`} data-plural-group={group.base}>
        <KeyHeader
          keyName={`${group.base}_*`}
          group={group.group}
          dot={modified}
          badges={
            <>
              {attrs.map((a) => (
                <Badge key={a} variant="secondary" className="text-[10px]" data-attr-badge={a}>
                  {CHROME.attributeBadge(a)}
                </Badge>
              ))}
              <Badge variant="outline" className="text-[10px]">
                {CHROME.pluralGroup}
              </Badge>
            </>
          }
        />
        <p dir="ltr" lang="en" className="mt-1 text-[11px] text-muted-foreground">
          {CHROME.pluralEnglish}:{' '}
          {Object.entries(group.englishForms)
            .map(([c, v]) => `${c}: ${v}`)
            .join(' · ')}
        </p>
        <p dir="ltr" className="text-[11px] text-muted-foreground">
          {CHROME.pluralRequired(group.required.join(', '))}
        </p>
        <div className="mt-1 space-y-1.5">
          {group.forms.map((f, i) => {
            const cat = f.plural!.category;
            const formModified = model.isModified(f.id);
            return (
              <div key={f.id} data-plural-form={cat} data-required={f.plural!.required ? '' : undefined}>
                <div className="flex items-center gap-1.5" dir="ltr">
                  <Dot on={formModified} />
                  <code className="text-[11px] text-muted-foreground">_{cat}</code>
                  {!f.plural!.required ? (
                    <Badge variant="outline" className="text-[10px]" data-surplus="">
                      {CHROME.pluralSurplus}
                    </Badge>
                  ) : null}
                  {f.isNew ? (
                    <Badge variant="outline" className="text-[10px]">
                      {CHROME.newKey}
                    </Badge>
                  ) : null}
                  <Flags model={model} id={f.id} />
                  {formModified ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ms-auto h-6 px-1.5 text-[11px]"
                      aria-label={CHROME.revertKey(f.key)}
                      onClick={() => model.revert(f.id)}
                    >
                      {CHROME.revert}
                    </Button>
                  ) : null}
                </div>
                <Field
                  model={model}
                  entry={f}
                  dir={dir}
                  lang={lang}
                  label={CHROME.editField(f.key)}
                  domId={i === 0 ? fieldDomId(first.id) : fieldDomId(f.id)}
                  onFocusRow={() => onHighlight(f.id)}
                />
                <Warnings list={model.warningsById(f.id)} />
              </div>
            );
          })}
        </div>
        <Warnings list={groupWarnings} />
      </div>
    </RowShell>
  );
};
