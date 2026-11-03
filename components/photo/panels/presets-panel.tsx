'use client';

import * as React from 'react';
import { Download, Pencil, Trash2, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useLocalization } from '@/i18n/useLocalization';
import { computeAutoPreset } from '@/lib/photo/presets/autoPreset';
import { BUILTIN_PRESETS, PRESET_CATEGORIES, appendPreset, parsePresetLayers, type PresetDef } from '@/lib/photo/presets';
import { ThumbCache } from '@/lib/photo/presets/thumbs';
import {
  USER_PRESET_NAME_MAX,
  deleteUserPreset,
  exportUserPresets,
  importUserPresets,
  listUserPresets,
  renameUserPreset,
  saveUserPreset,
  type UserPreset,
} from '@/lib/photo/presets/userStore';
import { usePhotoStore } from '@/lib/photo/photoStore';
import { onPresetApplied, onPresetSaved } from '@/lib/photo/seams';
import { cn } from '@/lib/utils';
import { useOptionalPhotoSession } from '../session-context';
import { PanelSection } from '../controls';

/** One shared cache: thumbnails are keyed by (source, preset) and survive panel re-opens. */
const thumbCache = new ThumbCache();
const downloadText = (name: string, text: string) => {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

function Thumb({ rgba, w, h, label }: { rgba: Uint8ClampedArray | null; w: number; h: number; label: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const c = ref.current;
    if (!c || !rgba || (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent))) return;
    c.width = w;
    c.height = h;
    try {
      const ctx = c.getContext('2d');
      ctx?.putImageData(new ImageData(new Uint8ClampedArray(rgba), w, h), 0, 0);
    } catch {
      // jsdom has no canvas
    }
  }, [rgba, w, h]);
  return <canvas ref={ref} role="img" aria-label={label} className="h-14 w-20 rounded bg-surface-2 object-cover" />;
}

/** Presets (design §5.5, MM99): built-in looks as groups, and the user's own, saved in this browser. */
export function PresetsPanel() {
  const { t } = useLocalization('interface');
  const session = useOptionalPhotoSession();
  const thumb = session?.thumb ?? null;
  const [cat, setCat] = React.useState<'all' | (typeof PRESET_CATEGORIES)[number]>('all');
  const [mine, setMine] = React.useState<UserPreset[]>([]);
  const [saving, setSaving] = React.useState(false);
  const [name, setName] = React.useState('');
  const [renaming, setRenaming] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const layerCount = usePhotoStore((s) => s.doc?.layers.length ?? 0);
  const selectionIds = usePhotoStore((s) => s.doc?.layers.map((l) => l.id).join(',') ?? '');
  const [pick, setPick] = React.useState<Set<string> | null>(null);
  const sourceKey = thumb ? `${thumb.width}x${thumb.height}:${thumb.data[0]}:${thumb.data[Math.floor(thumb.data.length / 2)]}:${thumb.data[thumb.data.length - 5]}` : 'none';

  const reload = React.useCallback(async () => setMine(await listUserPresets()), []);
  React.useEffect(() => {
    let live = true;
    void listUserPresets().then((l) => live && setMine(l));
    return () => {
      live = false;
    };
  }, []);

  const histogram = session?.histogram ?? null;
  const autoLayers = histogram ? computeAutoPreset(histogram).layers : null;
  const layersFor = (p: PresetDef) => (p.computed ? autoLayers : parsePresetLayers(p.layers));

  const applyLayers = (id: string, builtin: boolean, displayName: string, labelKey: string, layers: ReturnType<typeof parsePresetLayers>) => {
    if (!layers || layers.length === 0) return;
    const group = t('photo.presets.groupName', { name: displayName }).slice(0, 80);
    const before = usePhotoStore.getState().doc;
    usePhotoStore.getState().mutate(labelKey, (d) => appendPreset(d, id, layers, group));
    if (usePhotoStore.getState().doc !== before) onPresetApplied(id, builtin);
  };

  const shown = BUILTIN_PRESETS.filter((p) => cat === 'all' || p.category === cat);
  const flash = (key: string) => {
    setNotice(key);
    setTimeout(() => setNotice((n) => (n === key ? null : n)), 4000);
  };

  const doSave = async () => {
    const doc = usePhotoStore.getState().doc;
    if (!doc || !name.trim()) return;
    const chosen = doc.layers.filter((l) => (pick ? pick.has(l.id) : true));
    if (chosen.length === 0) return;
    const saved = await saveUserPreset({ name, category: 'custom', layers: chosen });
    if (!saved) {
      flash('photo.presets.saveFailed');
      return;
    }
    onPresetSaved(chosen.length);
    setSaving(false);
    setName('');
    setPick(null);
    void reload();
  };

  return (
    <div data-testid="panel-presets">
      <PanelSection title={t('photo.presets.title')}>
        <div className="flex flex-wrap gap-1" role="group" aria-label={t('photo.presets.filter')}>
          {(['all', ...PRESET_CATEGORIES] as const).map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={cn('rounded-full border px-2.5 py-1 text-xs', cat === c ? 'border-primary bg-primary/15' : 'border-edge bg-surface-2 text-muted-foreground')}>
              {t(`photo.presets.category.${c}`)}
            </button>
          ))}
        </div>
        <ul className="flex gap-2 overflow-x-auto pb-1 md:grid md:grid-cols-3 md:overflow-visible" data-testid="preset-grid">
          {shown.map((p) => {
            const layers = layersFor(p);
            const th = thumb && layers && layers.length > 0 ? thumbCache.get(sourceKey, p.id, thumb, () => layers) : null;
            const display = t(p.nameKey);
            return (
              <li key={p.id} className="shrink-0">
                <button
                  type="button"
                  data-testid={`preset-${p.id}`}
                  disabled={!layers || layers.length === 0}
                  onClick={() => applyLayers(p.id, true, display, `Preset|builtin:${p.id}`, layers)}
                  className="flex w-20 flex-col items-center gap-1 rounded-md p-1 text-center text-xs hover:bg-surface-2 disabled:opacity-50"
                  title={display}
                >
                  <Thumb rgba={th?.data ?? null} w={th?.width ?? 1} h={th?.height ?? 1} label={display} />
                  <span className="line-clamp-2 leading-tight">{display}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="text-xs text-muted-foreground">{t('photo.presets.appendNote')}</p>
      </PanelSection>

      <PanelSection
        title={t('photo.presets.mine')}
        actions={
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" className="size-7" aria-label={t('photo.presets.import')} onClick={() => fileRef.current?.click()}>
              <Upload className="size-4" aria-hidden="true" />
            </Button>
            <Button size="icon" variant="ghost" className="size-7" aria-label={t('photo.presets.export')} disabled={mine.length === 0} onClick={() => downloadText('aperture-presets.json', exportUserPresets(mine))}>
              <Download className="size-4" aria-hidden="true" />
            </Button>
          </div>
        }
      >
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          data-testid="preset-import-input"
          aria-label={t('photo.presets.import')}
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = '';
            if (!f) return;
            const r = await importUserPresets(await f.text());
            if (r.ok) {
              flash('photo.presets.imported');
              void reload();
            } else flash(`photo.presets.importError.${r.reason}`);
          }}
        />
        <p className="text-xs text-muted-foreground">{t('photo.presets.browserNote')}</p>
        {notice ? (
          <p role="status" className="text-xs" data-testid="preset-notice">
            {t(notice)}
          </p>
        ) : null}
        {mine.length === 0 ? <p className="text-xs text-muted-foreground">{t('photo.presets.noneYet')}</p> : null}
        <ul className="space-y-1" data-testid="my-presets">
          {mine.map((p) => (
            <li key={p.id} className="flex items-center gap-1 rounded border border-edge bg-surface-2 px-2 py-1" data-testid={`my-preset-${p.id}`}>
              {renaming === p.id ? (
                <input
                  autoFocus
                  aria-label={t('photo.presets.rename')}
                  defaultValue={p.name}
                  maxLength={USER_PRESET_NAME_MAX}
                  className="min-w-0 flex-1 rounded border border-edge bg-background px-1 text-sm"
                  onBlur={async (e) => {
                    await renameUserPreset(p.id, e.target.value);
                    setRenaming(null);
                    void reload();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                    if (e.key === 'Escape') setRenaming(null);
                  }}
                />
              ) : (
                <button type="button" className="min-w-0 flex-1 truncate text-start text-sm" onClick={() => applyLayers(p.id, false, p.name, `Preset|user:${p.name}`, p.layers)}>
                  {p.name}
                  <span className="ms-1 text-xs text-muted-foreground">{t('photo.presets.layerCount', { count: p.layers.length })}</span>
                </button>
              )}
              <button type="button" aria-label={t('photo.presets.rename')} className="text-muted-foreground hover:text-foreground" onClick={() => setRenaming(p.id)}>
                <Pencil className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={t('photo.presets.delete')}
                className="text-muted-foreground hover:text-destructive"
                onClick={async () => {
                  await deleteUserPreset(p.id);
                  void reload();
                }}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
        {saving ? (
          <div className="space-y-2 rounded border border-edge p-2" data-testid="preset-save-form">
            <input
              autoFocus
              aria-label={t('photo.presets.nameLabel')}
              placeholder={t('photo.presets.namePlaceholder')}
              value={name}
              maxLength={USER_PRESET_NAME_MAX}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-edge bg-background px-2 py-1 text-sm"
            />
            <fieldset className="space-y-1">
              <legend className="text-xs text-muted-foreground">{t('photo.presets.whichLayers')}</legend>
              <ul className="max-h-32 space-y-0.5 overflow-y-auto">
                {(usePhotoStore.getState().doc?.layers ?? []).map((l) => (
                  <li key={l.id}>
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={pick ? pick.has(l.id) : true}
                        onChange={(e) => {
                          const all = new Set((usePhotoStore.getState().doc?.layers ?? []).map((x) => x.id));
                          const cur = new Set(pick ?? all);
                          if (e.target.checked) cur.add(l.id);
                          else cur.delete(l.id);
                          setPick(cur);
                        }}
                      />
                      {l.name || t(`photo.layers.type.${l.type}`)}
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => (setSaving(false), setPick(null))}>
                {t('photo.presets.cancel')}
              </Button>
              <Button size="sm" data-testid="preset-save-confirm" disabled={!name.trim()} onClick={() => void doSave()}>
                {t('photo.presets.save')}
              </Button>
            </div>
          </div>
        ) : (
          <Button size="sm" variant="outline" data-testid="preset-save-open" disabled={layerCount === 0 && selectionIds === ''} onClick={() => setSaving(true)}>
            {t('photo.presets.saveCurrent')}
          </Button>
        )}
      </PanelSection>
    </div>
  );
}
