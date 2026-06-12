'use client';

import React, { useEffect, useState } from 'react';
import { ScanFace, Loader2 } from 'lucide-react';
import { useLocalization } from '@/i18n/useLocalization';
import useDetectFaces from '@/lib/useDetectFaces';
import type { ImageRestoreModelId, ImageRestoreModelInfo } from '@/lib/imageRestoreTypes';

interface ModelPickerProps {
  file: File;
  models: ImageRestoreModelInfo[];
  preclean: ImageRestoreModelId[];
  onPrecleanChange: (ids: ImageRestoreModelId[]) => void;
  general: ImageRestoreModelId[];
  onGeneralChange: (ids: ImageRestoreModelId[]) => void;
  face: ImageRestoreModelId[];
  onFaceChange: (ids: ImageRestoreModelId[]) => void;
  precleanEnabled: boolean;
  onPrecleanEnabledChange: (value: boolean) => void;
  faceEnabled: boolean;
  onFaceEnabledChange: (value: boolean) => void;
  chain: boolean;
  onChainChange: (value: boolean) => void;
  fbcnnQf: number; // 0 = auto
  onFbcnnQfChange: (value: number) => void;
  codeformerFidelity: number;
  onCodeformerFidelityChange: (value: number) => void;
  maxOutputs: number;
  disabled?: boolean;
}

const PRECLEAN_IDS: ImageRestoreModelId[] = ['fbcnn', 'scunet', 'nafnet'];

const ImageModelPicker: React.FC<ModelPickerProps> = ({
  file,
  models,
  preclean,
  onPrecleanChange,
  general,
  onGeneralChange,
  face,
  onFaceChange,
  precleanEnabled,
  onPrecleanEnabledChange,
  faceEnabled,
  onFaceEnabledChange,
  chain,
  onChainChange,
  fbcnnQf,
  onFbcnnQfChange,
  codeformerFidelity,
  onCodeformerFidelityChange,
  maxOutputs,
  disabled = false,
}) => {
  const { t } = useLocalization('interface');
  const detect = useDetectFaces();
  const [thumbUrl, setThumbUrl] = useState('');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setThumbUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const precleanModels = models.filter((m) => m.kind === 'preclean');
  const generalModels = models.filter((m) => m.kind === 'general');
  const faceModels = models.filter((m) => m.kind === 'face');

  const toggleIn = (
    list: ImageRestoreModelId[],
    onChange: (ids: ImageRestoreModelId[]) => void,
    id: ImageRestoreModelId,
  ) => {
    if (list.includes(id)) onChange(list.filter((x) => x !== id));
    else onChange([...list, id]);
  };

  const totalOutputs =
    preclean.length + general.length + face.length + (chain ? face.length * general.length : 0);
  const overBudget = maxOutputs > 0 && totalOutputs > maxOutputs;
  const faceSelected = face.length > 0;
  const codeformerSelected = face.includes('codeformer');
  const fbcnnSelected = preclean.includes('fbcnn');
  const chainAvailable = faceSelected && general.length > 0;

  const renderCard = (
    model: ImageRestoreModelInfo,
    list: ImageRestoreModelId[],
    onChange: (ids: ImageRestoreModelId[]) => void,
  ) => {
    const checked = list.includes(model.id);
    const cardDisabled = disabled || !model.available;
    return (
      <label
        key={model.id}
        title={!model.available && model.reason ? model.reason : undefined}
        className={`flex items-start gap-3 rounded-lg border p-3 transition-colors motion-reduce:transition-none ${
          cardDisabled
            ? 'border-border bg-muted/40 opacity-60 cursor-not-allowed'
            : checked
              ? 'border-blue-500 bg-blue-500/10 cursor-pointer'
              : 'border-border bg-background/40 hover:border-blue-400/60 cursor-pointer'
        }`}
      >
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-blue-600"
          checked={checked}
          disabled={cardDisabled}
          onChange={() => toggleIn(list, onChange, model.id)}
          aria-label={model.displayName}
        />
        <span className="flex-1 min-w-0">
          <span className="block font-medium text-sm">{model.displayName}</span>
          <span className="block text-xs text-muted-foreground mt-0.5">
            {t(`imageRestore.models.${model.id}.description`)}
          </span>
          {!model.available && (
            <span className="block text-xs text-destructive mt-1">
              {model.reason || t('imageRestore.picker.unavailable')}
            </span>
          )}
        </span>
      </label>
    );
  };

  return (
    <div className="space-y-5">
      {/* (1) Pre-clean */}
      <fieldset className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 accent-blue-600"
            checked={precleanEnabled}
            disabled={disabled}
            onChange={(e) => {
              onPrecleanEnabledChange(e.target.checked);
              if (!e.target.checked) onPrecleanChange([]);
            }}
          />
          <span className="text-sm font-semibold">{t('imageRestore.picker.precleanToggle')}</span>
        </label>
        <p className="text-xs text-muted-foreground">{t('imageRestore.picker.precleanToggleHint')}</p>
        {precleanEnabled && (
          <div className="space-y-2 pl-6">
            <p className="text-xs text-muted-foreground italic">{t('imageRestore.picker.precleanOrderNote')}</p>
            <div className="grid gap-2 sm:grid-cols-3">{precleanModels.map((m) => renderCard(m, preclean, onPrecleanChange))}</div>
            {preclean.length > 0 && (
              <p className="text-xs text-blue-600 dark:text-blue-400">{t('imageRestore.picker.precleanBaseHint')}</p>
            )}
            {fbcnnSelected && (
              <label className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">{t('imageRestore.picker.fbcnnQf')}</span>
                <input
                  type="number"
                  min={1}
                  max={100}
                  placeholder={t('imageRestore.picker.fbcnnQfAuto')}
                  value={fbcnnQf > 0 ? fbcnnQf : ''}
                  disabled={disabled}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    onFbcnnQfChange(Number.isFinite(v) ? Math.min(100, Math.max(1, v)) : 0);
                  }}
                  className="w-20 rounded border border-input bg-background px-2 py-1 text-center"
                  aria-label={t('imageRestore.picker.fbcnnQf')}
                />
                <span className="text-muted-foreground">{t('imageRestore.picker.fbcnnQfHint')}</span>
              </label>
            )}
          </div>
        )}
      </fieldset>

      {/* (2) General upscalers */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold">{t('imageRestore.picker.generalGroup')}</legend>
        <div className="grid gap-2 sm:grid-cols-3">{generalModels.map((m) => renderCard(m, general, onGeneralChange))}</div>
      </fieldset>

      {/* (3) Face enhancement */}
      <fieldset className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 accent-blue-600"
            checked={faceEnabled}
            disabled={disabled}
            onChange={(e) => {
              onFaceEnabledChange(e.target.checked);
              if (!e.target.checked) {
                onFaceChange([]);
                onChainChange(false);
              }
            }}
          />
          <span className="text-sm font-semibold">{t('imageRestore.picker.faceToggle')}</span>
        </label>
        <p className="text-xs text-muted-foreground">{t('imageRestore.picker.faceToggleHint')}</p>

        {faceEnabled && (
          <div className="space-y-3 pl-6">
            {/* Preview detected faces (read-only, informational). */}
            <div className="space-y-2">
              <button
                type="button"
                disabled={disabled || detect.isPending}
                onClick={() => detect.mutate(file)}
                className="inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50"
              >
                {detect.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                ) : (
                  <ScanFace className="w-4 h-4" aria-hidden="true" />
                )}
                {t('imageRestore.picker.previewFaces')}
              </button>
              {detect.isError && <p className="text-xs text-destructive">{detect.error?.message}</p>}
              {detect.data && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {t('imageRestore.picker.facesDetected', { count: detect.data.faces.length })}
                  </p>
                  {detect.data.faces.length > 0 && (
                    <div className="relative inline-block max-w-xs overflow-hidden rounded-md border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={thumbUrl} alt="" className="block w-full h-auto" draggable={false} />
                      {detect.data.faces.map((f) => (
                        <span
                          key={f.id}
                          className="absolute border-2 border-emerald-400 bg-emerald-400/10 pointer-events-none"
                          style={{ left: `${f.x * 100}%`, top: `${f.y * 100}%`, width: `${f.width * 100}%`, height: `${f.height * 100}%` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid gap-2 sm:grid-cols-2">{faceModels.map((m) => renderCard(m, face, onFaceChange))}</div>

            {codeformerSelected && (
              <div className="space-y-1">
                <label className="flex items-center justify-between text-xs">
                  <span className="font-medium">{t('imageRestore.picker.fidelityLabel')}</span>
                  <span className="text-muted-foreground">{codeformerFidelity.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={codeformerFidelity}
                  disabled={disabled}
                  onChange={(e) => onCodeformerFidelityChange(parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                  aria-label={t('imageRestore.picker.fidelityLabel')}
                />
                <p className="text-xs text-muted-foreground">{t('imageRestore.picker.fidelityHint')}</p>
              </div>
            )}

            {chainAvailable && (
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-blue-600"
                  checked={chain}
                  disabled={disabled}
                  onChange={(e) => onChainChange(e.target.checked)}
                />
                <span>
                  <span className="block text-sm font-medium">{t('imageRestore.picker.chainToggle')}</span>
                  <span className="block text-xs text-muted-foreground mt-0.5">{t('imageRestore.picker.chainHint')}</span>
                </span>
              </label>
            )}

            <p className="text-xs rounded-md border border-amber-400/50 bg-amber-500/10 text-amber-700 dark:text-amber-300 px-3 py-2">
              {t('imageRestore.picker.generativeWarning')}
            </p>
          </div>
        )}
      </fieldset>

      {/* Running total */}
      <p className="text-sm text-muted-foreground">
        {totalOutputs === 0
          ? t('imageRestore.picker.noneSelected')
          : t('imageRestore.picker.totalOutputs', { count: totalOutputs })}
      </p>
      {overBudget && (
        <p className="text-sm rounded-md border border-amber-400/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-2">
          {t('imageRestore.picker.overBudget', { max: maxOutputs })}
        </p>
      )}
    </div>
  );
};

export default ImageModelPicker;
