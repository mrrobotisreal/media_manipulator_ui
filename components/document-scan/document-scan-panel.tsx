'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Circle, FileSearch, Loader2, RotateCcw, Upload, XCircle } from 'lucide-react';
import { useLocalization } from '@/i18n/useLocalization';
import useDocumentScanCapabilities from '@/lib/useDocumentScanCapabilities';
import useDocumentScan from '@/lib/useDocumentScan';
import useDocumentScanResult from '@/lib/useDocumentScanResult';
import useTranscodeJobStatus from '@/lib/useTranscodeJobStatus';
import type { TranscodeJobStage } from '@/lib/transcodeTypes';
import type { DocumentScanContentMode } from '@/lib/documentScanTypes';
import PageOrderList from './page-order-list';
import PdfResultViewer from './pdf-result-viewer';

const FIXED_STAGE_KEYS = new Set(['queued', 'prepare', 'package', 'completed']);

const stageIcon = (status: TranscodeJobStage['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" aria-hidden="true" />;
    case 'processing':
      return <Loader2 className="w-4 h-4 text-blue-500 animate-spin motion-reduce:animate-none shrink-0" aria-hidden="true" />;
    case 'failed':
      return <XCircle className="w-4 h-4 text-destructive shrink-0" aria-hidden="true" />;
    case 'skipped':
      return <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0" aria-hidden="true" />;
    default:
      return <Circle className="w-4 h-4 text-muted-foreground/60 shrink-0" aria-hidden="true" />;
  }
};

export interface DocumentScanPanelProps {
  enableReorder?: boolean;
  initialFiles?: File[];
}

// DocumentScanPanel is the interactive island for /tools/ai-document-scan and the
// home "Scan to PDF / Word (AI)" mode: add pages → (reorder) → choose content
// mode + outputs + options → upload + start → live stage checklist → PDF result
// viewer modal with downloads + confidence note.
const DocumentScanPanel: React.FC<DocumentScanPanelProps> = ({ enableReorder = false, initialFiles }) => {
  const { t, formatFileSize } = useLocalization('interface');
  const capabilitiesQuery = useDocumentScanCapabilities();
  const caps = capabilitiesQuery.data;

  const [files, setFiles] = useState<File[]>(initialFiles ?? []);
  const [contentMode, setContentMode] = useState<DocumentScanContentMode>('auto');
  const [wantDocx, setWantDocx] = useState(false);
  const [language, setLanguage] = useState('eng');
  const [deskew, setDeskew] = useState(true);
  const [rotate, setRotate] = useState(true);
  const [clean, setClean] = useState(false);
  const [preclean, setPreclean] = useState(true);
  const precleanTouched = useRef(false);
  const [structureEngine, setStructureEngine] = useState<'paddleocr-vl' | 'docling'>('paddleocr-vl');
  const [secondOpinion, setSecondOpinion] = useState(false);
  const [secondOpinionEngine, setSecondOpinionEngine] = useState<'paddleocr-vl' | 'trocr'>('paddleocr-vl');
  const [verify, setVerify] = useState(true);
  const [summarize, setSummarize] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [fileError, setFileError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scan = useDocumentScan((result) => setJobId(result.jobId));
  const { data: job } = useTranscodeJobStatus(jobId);
  const completed = job?.status === 'completed';
  const { data: results } = useDocumentScanResult(jobId, !!completed);

  // Seed from a single home-page selection. Key on the File identity (not the
  // array, which the parent recreates every render) so re-renders don't wipe
  // pages the user added, while a genuinely new selection resets the panel.
  const seedFile = initialFiles && initialFiles.length > 0 ? initialFiles[0] : null;
  useEffect(() => {
    if (seedFile) setFiles([seedFile]);
  }, [seedFile]);

  // Mode-driven preclean default: ON for handwriting/auto, OFF for printed —
  // unless the user has explicitly toggled it.
  useEffect(() => {
    if (precleanTouched.current) return;
    setPreclean(contentMode !== 'printed');
  }, [contentMode]);

  // Auto-open the viewer once the job completes.
  useEffect(() => {
    if (completed) setViewerOpen(true);
  }, [completed]);

  const showPrinted = contentMode === 'printed' || contentMode === 'auto';
  const showHandwriting = contentMode === 'handwriting' || contentMode === 'auto';

  const acceptFiles = (incoming: FileList | File[] | null | undefined) => {
    setFileError('');
    if (!incoming) return;
    const list = Array.from(incoming).filter((f) => f.type.startsWith('image/'));
    if (list.length === 0) {
      setFileError(t('documentScan.panel.notAnImage'));
      return;
    }
    if (caps) {
      for (const f of list) {
        if (f.size > caps.maxImageBytes) {
          setFileError(t('documentScan.panel.tooLarge', { max: formatFileSize(caps.maxImageBytes) }));
          return;
        }
      }
    }
    setFiles((prev) => {
      const next = [...prev, ...list];
      if (caps && next.length > caps.maxImages) {
        setFileError(t('documentScan.panel.tooManyPages', { max: caps.maxImages }));
        return next.slice(0, caps.maxImages);
      }
      return next;
    });
  };

  const handleReset = () => {
    setFiles([]);
    setJobId(null);
    setFileError('');
    setContentMode('auto');
    setWantDocx(false);
    setDeskew(true);
    setRotate(true);
    setClean(false);
    precleanTouched.current = false;
    setPreclean(true);
    setStructureEngine('paddleocr-vl');
    setSecondOpinion(false);
    setSecondOpinionEngine('paddleocr-vl');
    setVerify(true);
    setSummarize(false);
    setViewerOpen(false);
    scan.reset();
  };

  const canSubmit = files.length > 0 && !scan.isPending && !jobId;

  const submit = () => {
    if (!canSubmit) return;
    scan.mutate({
      files,
      options: {
        outputs: wantDocx ? ['pdf', 'docx'] : ['pdf'],
        contentMode,
        language,
        deskew,
        rotate,
        clean,
        preclean,
        structureEngine,
        secondOpinion,
        secondOpinionEngine: secondOpinion ? secondOpinionEngine : 'none',
        verify,
        summarize,
      },
    });
  };

  if (capabilitiesQuery.isLoading) {
    return (
      <div className="my-6 rounded-lg border border-border bg-background/40 p-8 text-center text-sm text-muted-foreground">
        {t('documentScan.panel.loading')}
      </div>
    );
  }
  if (caps && !caps.enabled) {
    return (
      <div className="my-6 rounded-lg border border-border bg-background/40 p-8 text-center text-sm text-muted-foreground">
        {t('documentScan.panel.disabled')}
      </div>
    );
  }

  const modeButtons: { value: DocumentScanContentMode; label: string; disabled: boolean; reason?: string }[] = [
    { value: 'auto', label: t('documentScan.options.modeAuto'), disabled: false },
    {
      value: 'printed',
      label: t('documentScan.options.modePrinted'),
      disabled: !!caps && !caps.printedAvailable,
      reason: t('documentScan.options.printedUnavailable'),
    },
    {
      value: 'handwriting',
      label: t('documentScan.options.modeHandwriting'),
      disabled: !!caps && !caps.handwritingAvailable,
      reason: t('documentScan.options.handwritingUnavailable'),
    },
  ];

  return (
    <div className="my-6 space-y-6">
      {/* Step 1 — add pages */}
      {!jobId && (
        <div
          className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors motion-reduce:transition-none cursor-pointer ${
            isDragOver ? 'border-blue-500 bg-blue-500/10' : 'border-border bg-background/40 hover:border-blue-400/60'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            acceptFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
          }}
        >
          <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" aria-hidden="true" />
          <p className="font-medium">{t('documentScan.panel.dropTitle')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('documentScan.panel.dropHint')}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => acceptFiles(e.target.files)}
          />
        </div>
      )}
      {fileError && <p className="text-sm text-destructive">{fileError}</p>}

      {/* Step 2 — pages + options */}
      {files.length > 0 && !jobId && caps && (
        <>
          <PageOrderList
            files={files}
            onReorder={setFiles}
            onRemove={(index) => setFiles((prev) => prev.filter((_, i) => i !== index))}
            enableReorder={enableReorder}
          />

          {/* Content mode */}
          <fieldset className="space-y-1.5">
            <legend className="text-sm font-semibold">{t('documentScan.options.contentMode')}</legend>
            <div className="flex flex-wrap gap-2">
              {modeButtons.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  disabled={m.disabled || scan.isPending}
                  title={m.disabled ? m.reason : undefined}
                  onClick={() => setContentMode(m.value)}
                  className={`rounded-md border px-4 py-1.5 text-sm transition-colors motion-reduce:transition-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    contentMode === m.value ? 'border-blue-500 bg-blue-500/10 font-medium' : 'border-input hover:bg-muted'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Outputs */}
          <fieldset className="space-y-1.5">
            <legend className="text-sm font-semibold">{t('documentScan.options.outputs')}</legend>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
                {t('documentScan.options.pdfAlways')}
              </span>
              <label className={`inline-flex items-center gap-2 ${!caps.docxAvailable ? 'opacity-50' : ''}`}>
                <input
                  type="checkbox"
                  checked={wantDocx && caps.docxAvailable}
                  disabled={!caps.docxAvailable || scan.isPending}
                  onChange={(e) => setWantDocx(e.target.checked)}
                />
                {t('documentScan.options.docx')}
                {!caps.docxAvailable && (
                  <span className="text-xs text-muted-foreground">({t('documentScan.options.unavailable')})</span>
                )}
              </label>
            </div>
          </fieldset>

          {/* Language (printed/auto) */}
          {showPrinted && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold block" htmlFor="ds-language">
                {t('documentScan.options.language')}
              </label>
              <select
                id="ds-language"
                value={language}
                disabled={scan.isPending}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
              >
                {caps.languages.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Printed flags */}
          {showPrinted && (
            <fieldset className="space-y-1.5">
              <legend className="text-sm font-semibold">{t('documentScan.options.printedCleanup')}</legend>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={deskew} disabled={scan.isPending} onChange={(e) => setDeskew(e.target.checked)} />
                  {t('documentScan.options.deskew')}
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={rotate} disabled={scan.isPending} onChange={(e) => setRotate(e.target.checked)} />
                  {t('documentScan.options.rotate')}
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={clean} disabled={scan.isPending} onChange={(e) => setClean(e.target.checked)} />
                  {t('documentScan.options.clean')}
                </label>
              </div>
            </fieldset>
          )}

          {/* DOCX structure engine — only when DOCX selected and >1 engine available */}
          {wantDocx && caps.docxAvailable && caps.paddleOcrAvailable && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold block" htmlFor="ds-structure">
                {t('documentScan.options.structureEngine')}
              </label>
              <select
                id="ds-structure"
                value={structureEngine}
                disabled={scan.isPending}
                onChange={(e) => setStructureEngine(e.target.value as 'paddleocr-vl' | 'docling')}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
              >
                <option value="paddleocr-vl">{t('documentScan.options.enginePaddle')}</option>
                <option value="docling">{t('documentScan.options.engineDocling')}</option>
              </select>
            </div>
          )}

          {/* Preclean */}
          <label className={`flex items-start gap-2 text-sm ${!caps.precleanAvailable ? 'opacity-50' : ''}`}>
            <input
              type="checkbox"
              checked={preclean && caps.precleanAvailable}
              disabled={!caps.precleanAvailable || scan.isPending}
              onChange={(e) => {
                precleanTouched.current = true;
                setPreclean(e.target.checked);
              }}
              className="mt-0.5"
            />
            <span>
              <span className="font-medium">{t('documentScan.options.preclean')}</span>
              <span className="block text-xs text-muted-foreground">{t('documentScan.options.precleanHint')}</span>
            </span>
          </label>

          {/* Handwriting options */}
          {showHandwriting && (
            <div className="space-y-3 rounded-md border border-border p-3">
              <p className="text-sm font-semibold">{t('documentScan.options.handwritingTitle')}</p>
              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" checked={verify} disabled={scan.isPending} onChange={(e) => setVerify(e.target.checked)} className="mt-0.5" />
                <span>
                  <span className="font-medium">{t('documentScan.options.verify')}</span>
                  <span className="block text-xs text-muted-foreground">{t('documentScan.options.verifyHint')}</span>
                </span>
              </label>
              <label className={`flex items-start gap-2 text-sm ${!caps.secondOpinionAvailable ? 'opacity-50' : ''}`}>
                <input
                  type="checkbox"
                  checked={secondOpinion && caps.secondOpinionAvailable}
                  disabled={!caps.secondOpinionAvailable || scan.isPending}
                  onChange={(e) => setSecondOpinion(e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  <span className="font-medium">{t('documentScan.options.secondOpinion')}</span>
                  <span className="block text-xs text-muted-foreground">{t('documentScan.options.secondOpinionHint')}</span>
                </span>
              </label>
              {secondOpinion && caps.secondOpinionAvailable && (
                <select
                  value={secondOpinionEngine}
                  disabled={scan.isPending}
                  onChange={(e) => setSecondOpinionEngine(e.target.value as 'paddleocr-vl' | 'trocr')}
                  className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                >
                  {caps.paddleOcrAvailable && <option value="paddleocr-vl">{t('documentScan.options.enginePaddle')}</option>}
                  <option value="trocr">{t('documentScan.options.engineTrocr')}</option>
                </select>
              )}
            </div>
          )}

          {/* AI summary */}
          <label className={`flex items-start gap-2 text-sm ${!caps.summaryAvailable ? 'opacity-50' : ''}`}>
            <input
              type="checkbox"
              checked={summarize && caps.summaryAvailable}
              disabled={!caps.summaryAvailable || scan.isPending}
              onChange={(e) => setSummarize(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              <span className="font-medium">{t('documentScan.options.summary')}</span>
              <span className="block text-xs text-muted-foreground">{t('documentScan.options.summaryHint')}</span>
            </span>
          </label>

          {scan.isPending ? (
            <div className="space-y-2" aria-live="polite">
              <p className="text-sm text-muted-foreground">
                {scan.uploadPhase === 'uploading'
                  ? t('documentScan.panel.uploading', { percent: scan.uploadProgress })
                  : scan.uploadPhase === 'starting'
                    ? t('documentScan.panel.startingJob')
                    : t('documentScan.panel.preparingUpload')}
              </p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 motion-reduce:transition-none"
                  style={{ width: `${scan.uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={!canSubmit}
              onClick={submit}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-white font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors motion-reduce:transition-none"
            >
              <FileSearch className="h-4 w-4" aria-hidden="true" />
              {t('documentScan.panel.submit', { count: files.length })}
            </button>
          )}
        </>
      )}

      {/* Step 3 — progress + results */}
      {jobId && job && (
        <div className="space-y-4">
          <ul className="space-y-1.5" aria-live="polite">
            {(job.stages ?? []).map((stage) => (
              <li key={stage.key} className="flex items-center gap-2 text-sm">
                {stageIcon(stage.status)}
                <span className={stage.status === 'pending' ? 'text-muted-foreground' : ''}>{stage.label}</span>
                {stage.status === 'failed' && !FIXED_STAGE_KEYS.has(stage.key) && stage.message && (
                  <span className="text-xs rounded bg-muted text-muted-foreground px-1.5 py-0.5">{stage.message}</span>
                )}
                {stage.status === 'failed' && FIXED_STAGE_KEYS.has(stage.key) && stage.message && (
                  <span className="text-xs text-destructive">{stage.message}</span>
                )}
              </li>
            ))}
          </ul>

          {job.status === 'processing' || job.status === 'pending' ? (
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 motion-reduce:transition-none"
                style={{ width: `${job.progress ?? 0}%` }}
              />
            </div>
          ) : null}

          {job.status === 'failed' && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 space-y-3">
              <p className="text-sm text-destructive">{job.error || t('documentScan.panel.genericFailure')}</p>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                {t('documentScan.panel.startOver')}
              </button>
            </div>
          )}

          {completed && (
            <div className="rounded-md border border-green-500/40 bg-green-500/10 p-4 space-y-3">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                {t('documentScan.panel.completedTitle')}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewerOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 transition-colors motion-reduce:transition-none"
                >
                  <FileSearch className="w-4 h-4" aria-hidden="true" />
                  {t('documentScan.panel.viewResult')}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  {t('documentScan.panel.scanAnother')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {jobId && completed && (
        <PdfResultViewer jobId={jobId} open={viewerOpen} onOpenChange={setViewerOpen} results={results} />
      )}
    </div>
  );
};

export default DocumentScanPanel;
