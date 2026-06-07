'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, Film, Sparkles, Captions, Image as ImageIcon, Info, Download, AlertTriangle, Languages, X, Radio, Package } from 'lucide-react';
import useVideoTranscodeProbe, { type ProbeMutationResult } from '@/lib/useVideoTranscodeProbe';
import useStartVideoTranscode from '@/lib/useStartVideoTranscode';
import useTranscodeJobStatus from '@/lib/useTranscodeJobStatus';
import {
  CAPTION_LANGUAGE_FALLBACK,
  type BundleFormat,
  type DashCodec,
  type SupportedCaptionLanguage,
  type TranscodeProbeResponse,
  type TranscodeProtocol,
  type TranscodeQualityRung,
  type TranscodeJobStage,
} from '@/lib/transcodeTypes';
import InfoTooltip from '@/components/info-tooltip';
import { Trans } from 'react-i18next';
import { useLocalization } from '@/i18n/useLocalization';

const MAX_EXTRA_LANGUAGES = 3;

export interface VideoTranscodeFormProps {
  file: File | null;
  defaultProtocol?: TranscodeProtocol;
  defaultDashCodec?: DashCodec;
  lockProtocol?: boolean;
  onJobStarted?: (jobId: string) => void;
}

const formatBytes = (bytes: number | undefined): string => {
  if (!bytes || bytes <= 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[i]}`;
};

const formatSeconds = (secs: number | undefined): string => {
  if (!secs || secs <= 0) return '—';
  const m = Math.floor(secs / 60);
  const s = Math.round(secs - m * 60);
  return `${m}:${String(s).padStart(2, '0')}`;
};

const RungChip: React.FC<{
  rung: TranscodeQualityRung;
  checked: boolean;
  onToggle: () => void;
}> = ({ rung, checked, onToggle }) => {
  const { t } = useLocalization('interface');
  const disabled = !rung.enabled;
  const tooltipText = rung.disabledReason || (rung.premiumOnly
    ? t('videoTranscodeForm.premiumTooltip')
    : '');
  return (
    <label
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
        disabled
          ? 'cursor-not-allowed border-input bg-muted/40 text-muted-foreground'
          : checked
            ? 'cursor-pointer border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-card-foreground'
            : 'cursor-pointer border-input hover:bg-muted/40 text-card-foreground'
      }`}
      title={disabled ? tooltipText : undefined}
    >
      <input
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={onToggle}
        className="accent-blue-600"
      />
      <span className="font-medium">{rung.label}</span>
      <span className="text-xs text-muted-foreground">{rung.bitrateKbps} kbps</span>
      {rung.premiumOnly && <span className="ml-auto text-[10px] uppercase tracking-wide text-blue-600">{t('videoTranscodeForm.premiumBadge')}</span>}
      {rung.sourceTooSmall && <span className="ml-auto text-[10px] uppercase tracking-wide text-orange-600">{t('videoTranscodeForm.tooSmallBadge')}</span>}
    </label>
  );
};

const StageRow: React.FC<{ stage: TranscodeJobStage }> = ({ stage }) => {
  const colors: Record<TranscodeJobStage['status'], string> = {
    pending: 'bg-muted text-muted-foreground',
    processing: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    completed: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300',
    skipped: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    failed: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
  };
  return (
    <li className="flex items-center justify-between gap-3 rounded border border-border px-3 py-2 text-sm">
      <div className="flex items-center gap-2 min-w-0">
        <span className={`shrink-0 inline-block w-2 h-2 rounded-full ${
          stage.status === 'processing' ? 'bg-blue-500 animate-pulse'
            : stage.status === 'completed' ? 'bg-green-500'
            : stage.status === 'failed' ? 'bg-red-500'
            : stage.status === 'skipped' ? 'bg-amber-500'
            : 'bg-muted-foreground/50'
        }`} />
        <span className="font-medium text-card-foreground truncate">{stage.label}</span>
        {stage.message && (
          <span className="text-xs text-muted-foreground truncate">— {stage.message}</span>
        )}
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full ${colors[stage.status]}`}>{stage.status}</span>
    </li>
  );
};

const VideoTranscodeForm: React.FC<VideoTranscodeFormProps> = ({
  file,
  defaultProtocol = 'hls',
  defaultDashCodec = 'av1',
  lockProtocol = false,
  onJobStarted,
}) => {
  const { t } = useLocalization('interface');
  const [protocol, setProtocol] = useState<TranscodeProtocol>(defaultProtocol);
  const [dashCodec, setDashCodec] = useState<DashCodec>(defaultDashCodec);
  const [probe, setProbe] = useState<TranscodeProbeResponse | null>(null);
  const [probeContext, setProbeContext] = useState<ProbeMutationResult | null>(null);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [generateCaptions, setGenerateCaptions] = useState(false);
  const [generateStoryboards, setGenerateStoryboards] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [captionLanguages, setCaptionLanguages] = useState<string[]>([]);
  const [languageCatalog, setLanguageCatalog] = useState<SupportedCaptionLanguage[]>(CAPTION_LANGUAGE_FALLBACK);
  const [translationAvailable, setTranslationAvailable] = useState<boolean | null>(null);
  const [bundleFormat, setBundleFormat] = useState<BundleFormat>('targz');

  // Fetch the live capabilities so we use the canonical language list and can
  // grey out the picker if Ollama isn't reachable.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const baseURL = (await import('@/lib/utils')).getBaseURL();
        const response = await fetch(`${baseURL}/video-transcode/capabilities`);
        if (!response.ok) return;
        const json = await response.json();
        if (cancelled) return;
        if (Array.isArray(json.captionLanguages) && json.captionLanguages.length > 0) {
          setLanguageCatalog(json.captionLanguages);
        }
        if (typeof json.captionTranslation === 'boolean') {
          setTranslationAvailable(json.captionTranslation);
        }
      } catch {
        // Fallback list is fine; we just can't tell whether translation is up.
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    setProtocol(defaultProtocol);
  }, [defaultProtocol]);

  useEffect(() => {
    setDashCodec(defaultDashCodec);
  }, [defaultDashCodec]);

  // Clear probe when file changes.
  useEffect(() => {
    setProbe(null);
    setProbeContext(null);
    setActiveJobId(null);
    setSelectedLabels([]);
  }, [file]);

  const probeMutation = useVideoTranscodeProbe((result) => {
    setProbe(result.probe);
    setProbeContext(result);
    setSelectedLabels(result.probe.selectableRungs.filter(r => r.selected).map(r => r.label));
  });

  const startMutation = useStartVideoTranscode((res) => {
    setActiveJobId(res.jobId);
    onJobStarted?.(res.jobId);
  });

  const job = useTranscodeJobStatus(activeJobId);

  const allRungs = useMemo<TranscodeQualityRung[]>(() => {
    if (!probe) return [];
    return [...probe.selectableRungs, ...probe.disabledRungs].sort((a, b) => a.height - b.height);
  }, [probe]);

  const toggleRung = (label: string) => {
    setSelectedLabels(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const handleAnalyze = () => {
    if (!file) return;
    probeMutation.mutate(file);
  };

  const handleStartTranscode = () => {
    if (!probe || !probeContext) return;
    if (selectedLabels.length === 0) return;
    startMutation.mutate({
      s3Key: probeContext.s3Key,
      fileName: probeContext.fileName,
      contentType: probeContext.contentType,
      fileSizeBytes: probeContext.fileSizeBytes,
      protocol,
      dashCodec: protocol === 'dash' ? dashCodec : undefined,
      qualityRungs: selectedLabels,
      generateCaptions,
      captionLanguages: generateCaptions ? captionLanguages : undefined,
      generateStoryboards,
      bundleFormat,
      sessionId: probeContext.sessionId,
    });
  };

  const updateExtraLanguage = (index: number, code: string) => {
    setCaptionLanguages((prev) => {
      const next = [...prev];
      next[index] = code;
      return next.filter((c) => c !== '');
    });
  };
  const removeExtraLanguage = (index: number) => {
    setCaptionLanguages((prev) => prev.filter((_, i) => i !== index));
  };
  const addExtraLanguage = () => {
    if (captionLanguages.length >= MAX_EXTRA_LANGUAGES) return;
    // Pick the first language not already chosen as the default value.
    const used = new Set(captionLanguages);
    const next = languageCatalog.find((l) => !used.has(l.code));
    if (next) setCaptionLanguages([...captionLanguages, next.code]);
  };

  const captionsDisabled = !probe?.hasAudio;
  const captionsTooltip = captionsDisabled
    ? t('videoTranscodeForm.captions.disabledTooltip')
    : t('videoTranscodeForm.captions.enabledTooltip');

  const downloadUrl = job.data?.resultUrl && job.data?.status === 'completed' ? job.data.resultUrl : null;

  return (
    <div className="space-y-5">
      {/* Protocol + codec selector */}
      <div>
        <h3 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
          <Film className="w-4 h-4 text-blue-600" /> {t('videoTranscodeForm.protocol.title')}
          <InfoTooltip
            ariaLabel={t('videoTranscodeForm.protocol.tooltipAria')}
            width="lg"
            content={
              <div className="space-y-1">
                <p><Trans i18nKey="interface:videoTranscodeForm.protocol.tooltipHls" components={{ strong: <strong /> }} /></p>
                <p><Trans i18nKey="interface:videoTranscodeForm.protocol.tooltipDash" components={{ strong: <strong /> }} /></p>
              </div>
            }
          />
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {(['hls', 'dash'] as TranscodeProtocol[]).map((p) => (
            <button
              key={p}
              type="button"
              disabled={lockProtocol && p !== defaultProtocol}
              onClick={() => setProtocol(p)}
              className={`px-4 py-3 rounded-lg border text-sm transition-colors ${
                protocol === p
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-card-foreground'
                  : 'border-input hover:bg-muted/40 text-card-foreground'
              } ${lockProtocol && p !== defaultProtocol ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="font-semibold uppercase">{p}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {p === 'hls' ? t('videoTranscodeForm.protocol.hlsSub') : t('videoTranscodeForm.protocol.dashSub')}
              </div>
            </button>
          ))}
        </div>
        {protocol === 'dash' && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(['av1', 'vp9'] as DashCodec[]).map((c) => (
              <label
                key={c}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer ${
                  dashCodec === c
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                    : 'border-input hover:bg-muted/40'
                }`}
              >
                <input
                  type="radio"
                  name="dash-codec"
                  value={c}
                  checked={dashCodec === c}
                  onChange={() => setDashCodec(c)}
                />
                <span className="font-medium uppercase">{c}</span>
                <span className="text-xs text-muted-foreground">{c === 'av1' ? t('videoTranscodeForm.protocol.av1Sub') : t('videoTranscodeForm.protocol.vp9Sub')}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Step 1: Analyze video */}
      {!probe && (
        <div className="rounded-lg border border-input p-4 bg-muted/20">
          <p className="text-sm text-card-foreground mb-3">
            <Trans
              i18nKey="interface:videoTranscodeForm.analyze.intro"
              components={{ code: <code className="text-xs px-1 py-0.5 bg-card border border-border rounded" /> }}
            />
          </p>
          <button
            type="button"
            disabled={!file || probeMutation.isPending}
            onClick={handleAnalyze}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {probeMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {probeMutation.uploadPhase === 'uploading-to-s3'
                  ? t('videoTranscodeForm.analyze.uploadingPercent', { percent: probeMutation.uploadProgress })
                  : probeMutation.uploadPhase === 'probing'
                    ? t('videoTranscodeForm.analyze.analyzingSource')
                    : t('videoTranscodeForm.analyze.preparingUpload')}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {t('videoTranscodeForm.analyze.analyzeVideo')}
              </>
            )}
          </button>
          {probeMutation.isPending && probeMutation.uploadPhase === 'uploading-to-s3' && (
            <div className="w-full bg-muted rounded-full h-2 mt-3">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${probeMutation.uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Probe report */}
      {probe && (
        <div className="rounded-lg border border-border p-4 bg-muted/20">
          <h3 className="font-semibold text-card-foreground mb-2">{t('videoTranscodeForm.report.title')}</h3>
          <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
            <div><dt className="text-muted-foreground">{t('videoTranscodeForm.report.resolution')}</dt><dd className="text-card-foreground">{probe.width}×{probe.height}</dd></div>
            <div><dt className="text-muted-foreground">{t('videoTranscodeForm.report.maxQuality')}</dt><dd className="text-card-foreground uppercase">{probe.maxQualityLabel}</dd></div>
            <div><dt className="text-muted-foreground">{t('videoTranscodeForm.report.fps')}</dt><dd className="text-card-foreground">{probe.fps ? probe.fps.toFixed(2) : '—'}</dd></div>
            <div><dt className="text-muted-foreground">{t('videoTranscodeForm.report.duration')}</dt><dd className="text-card-foreground">{formatSeconds(probe.durationSeconds)}</dd></div>
            <div><dt className="text-muted-foreground">{t('videoTranscodeForm.report.audio')}</dt><dd className="text-card-foreground">{probe.hasAudio ? t('videoTranscodeForm.report.yes') : t('videoTranscodeForm.report.no')}</dd></div>
            <div><dt className="text-muted-foreground">{t('videoTranscodeForm.report.videoCodec')}</dt><dd className="text-card-foreground">{probe.videoCodec || '—'}</dd></div>
            <div><dt className="text-muted-foreground">{t('videoTranscodeForm.report.audioCodec')}</dt><dd className="text-card-foreground">{probe.audioCodec || '—'}</dd></div>
            <div><dt className="text-muted-foreground">{t('videoTranscodeForm.report.container')}</dt><dd className="text-card-foreground">{probe.containerFormat || '—'}</dd></div>
            <div><dt className="text-muted-foreground">{t('videoTranscodeForm.report.fileSize')}</dt><dd className="text-card-foreground">{formatBytes(probe.fileSizeBytes)}</dd></div>
          </dl>
          {probe.warnings && probe.warnings.length > 0 && (
            <div className="mt-3 rounded border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 p-3 text-sm flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <ul className="space-y-1">
                  {probe.warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quality rungs */}
      {probe && !probe.sourceTooSmall && (
        <div>
          <h3 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
            {t('videoTranscodeForm.rungs.title')}
            <InfoTooltip
              ariaLabel={t('videoTranscodeForm.rungs.tooltipAria')}
              content={t('videoTranscodeForm.rungs.tooltip')}
            />
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {allRungs.map((rung) => (
              <RungChip
                key={rung.label}
                rung={rung}
                checked={selectedLabels.includes(rung.label)}
                onToggle={() => toggleRung(rung.label)}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t('videoTranscodeForm.rungs.defaultsNote')}
          </p>
        </div>
      )}

      {/* Captions + storyboards */}
      {probe && !probe.sourceTooSmall && (
        <div className="grid gap-3 md:grid-cols-2">
          <label
            className={`flex items-start gap-3 rounded-lg border p-3 ${
              captionsDisabled ? 'cursor-not-allowed bg-muted/40 text-muted-foreground' : 'cursor-pointer'
            }`}
            title={captionsTooltip}
          >
            <input
              type="checkbox"
              disabled={captionsDisabled}
              checked={generateCaptions && !captionsDisabled}
              onChange={(e) => setGenerateCaptions(e.target.checked)}
              className="mt-1 accent-blue-600"
            />
            <div>
              <div className="flex items-center gap-2 font-medium text-card-foreground">
                <Captions className="w-4 h-4" /> {t('videoTranscodeForm.captions.generateCaptions')}
              </div>
              <p className="text-xs text-muted-foreground">{t('videoTranscodeForm.captions.captionsSub')}</p>
            </div>
          </label>
          <label className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer">
            <input
              type="checkbox"
              checked={generateStoryboards}
              onChange={(e) => setGenerateStoryboards(e.target.checked)}
              className="mt-1 accent-blue-600"
            />
            <div>
              <div className="flex items-center gap-2 font-medium text-card-foreground">
                <ImageIcon className="w-4 h-4" /> {t('videoTranscodeForm.captions.generateStoryboards')}
              </div>
              <p className="text-xs text-muted-foreground">{t('videoTranscodeForm.captions.storyboardsSub')}</p>
            </div>
          </label>
        </div>
      )}

      {/* Caption translations — only meaningful when captions are enabled. */}
      {probe && !probe.sourceTooSmall && generateCaptions && !captionsDisabled && (
        <div className="rounded-lg border border-input p-4 bg-muted/10">
          <div className="flex items-start gap-2 mb-3">
            <Languages className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-card-foreground text-sm flex items-center gap-2">
                {t('videoTranscodeForm.translations.title')}
                <InfoTooltip
                  ariaLabel={t('videoTranscodeForm.translations.tooltipAria')}
                  width="lg"
                  content={
                    <div className="space-y-1">
                      <p>{t('videoTranscodeForm.translations.tooltip1', { max: MAX_EXTRA_LANGUAGES })}</p>
                      <p>{t('videoTranscodeForm.translations.tooltip2')}</p>
                    </div>
                  }
                />
              </h4>
              <p className="text-xs text-muted-foreground">
                {t('videoTranscodeForm.translations.primaryNote', { max: MAX_EXTRA_LANGUAGES })}
              </p>
              {translationAvailable === false && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {t('videoTranscodeForm.translations.backendUnreachable')}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            {captionLanguages.map((code, idx) => {
              const used = new Set(captionLanguages.filter((_, i) => i !== idx));
              return (
                <div key={`lang-${idx}`} className="flex items-center gap-2">
                  <Radio className="w-3 h-3 text-blue-600 shrink-0" />
                  <select
                    value={code}
                    onChange={(e) => updateExtraLanguage(idx, e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-input rounded-md bg-input text-card-foreground text-sm focus:ring-2 focus:ring-ring"
                  >
                    {languageCatalog.map((lang) => (
                      <option
                        key={lang.code}
                        value={lang.code}
                        disabled={used.has(lang.code)}
                      >
                        {lang.displayName} · {lang.localDisplayName}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeExtraLanguage(idx)}
                    className="text-muted-foreground hover:text-card-foreground p-1"
                    aria-label={t('videoTranscodeForm.translations.removeLanguage')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            {captionLanguages.length < MAX_EXTRA_LANGUAGES && (
              <button
                type="button"
                onClick={addExtraLanguage}
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                {t('videoTranscodeForm.translations.addLanguage', { count: captionLanguages.length, max: MAX_EXTRA_LANGUAGES })}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bundle format toggle */}
      {probe && !probe.sourceTooSmall && (
        <div>
          <h3 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" /> {t('videoTranscodeForm.bundle.title')}
            <InfoTooltip
              ariaLabel={t('videoTranscodeForm.bundle.tooltipAria')}
              width="lg"
              content={
                <div className="space-y-1">
                  <p><Trans i18nKey="interface:videoTranscodeForm.bundle.tooltipTargz" components={{ strong: <strong />, code: <code /> }} /></p>
                  <p><Trans i18nKey="interface:videoTranscodeForm.bundle.tooltipZip" components={{ strong: <strong /> }} /></p>
                </div>
              }
            />
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {(['targz', 'zip'] as BundleFormat[]).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setBundleFormat(fmt)}
                className={`px-4 py-3 rounded-lg border text-sm transition-colors ${
                  bundleFormat === fmt
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-card-foreground'
                    : 'border-input hover:bg-muted/40 text-card-foreground'
                }`}
              >
                <div className="font-semibold">
                  {fmt === 'targz' ? '.tar.gz' : '.zip'}
                  {fmt === 'targz' && (
                    <span className="ml-2 text-[10px] uppercase tracking-wide text-blue-600">{t('videoTranscodeForm.bundle.defaultBadge')}</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {fmt === 'targz'
                    ? t('videoTranscodeForm.bundle.targzSub')
                    : t('videoTranscodeForm.bundle.zipSub')}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Start button */}
      {probe && !probe.sourceTooSmall && !activeJobId && (
        <button
          type="button"
          disabled={selectedLabels.length === 0 || startMutation.isPending}
          onClick={handleStartTranscode}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {startMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('videoTranscodeForm.start.starting')}
            </>
          ) : (
            <>{t('videoTranscodeForm.start.startButton', { protocol: protocol.toUpperCase(), format: bundleFormat === 'zip' ? '.zip' : '.tar.gz' })}</>
          )}
        </button>
      )}

      {probe?.sourceTooSmall && (
        <div className="rounded border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 p-3 text-sm flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <span>
            {t('videoTranscodeForm.tooSmall')}
          </span>
        </div>
      )}

      {/* Job progress timeline */}
      {activeJobId && job.data && (
        <div className="rounded-lg border border-border p-4 bg-muted/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-card-foreground">{t('videoTranscodeForm.progress.title')}</h3>
            <span className="text-sm text-muted-foreground">{job.data.progress ?? 0}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mb-3">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${job.data.progress ?? 0}%` }}
            />
          </div>
          {job.data.stages && job.data.stages.length > 0 && (
            <ul className="space-y-1 max-h-64 overflow-auto">
              {job.data.stages.map((stage) => (
                <StageRow key={stage.key} stage={stage} />
              ))}
            </ul>
          )}
          {job.data.status === 'failed' && (
            <div className="mt-3 rounded border border-destructive/30 bg-destructive/10 text-destructive p-3 text-sm">
              {job.data.error || t('videoTranscodeForm.progress.failed')}
            </div>
          )}
        </div>
      )}

      {/* Download tarball */}
      {downloadUrl && (
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          {t('videoTranscodeForm.downloadPackage', { filename: job.data?.resultFileName || `${protocol}-package.tar.gz` })}
        </a>
      )}
    </div>
  );
};

export default VideoTranscodeForm;
