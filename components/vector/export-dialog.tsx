'use client';

import * as React from 'react';
import { Download, Loader2 } from 'lucide-react';
import type { RasterProbe } from '@/lib/vector/raster/capabilities';
import { RASTER_FORMATS, clampRasterOptions, isVideoFormat, outputSize, type RasterFormat, type RasterOptions } from '@/lib/vector/raster/caps';
import { loadRasterPlan, type RasterPlan } from '@/lib/vector/raster/plan';
import type { RasterProgress } from '@/lib/vector/raster/pipeline';
import type { RasterRuntime } from '@/lib/vector/raster/run';
import { svgFileName as baseFileName } from '@/lib/vector/exportSvg';
import { RasterBlockNote, RasterProgressBar, RasterSettings, defaultProbe, defaultRasterOptions, rasterBlock, useRasterProbe, type GifSettings } from './raster-export';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import { saveBlobToDisk } from '@/lib/results/save';
import { MOTION_BRAND } from '@/lib/vector/brand';
import { canExportAnime, exportAnimatedSvgAnime } from '@/lib/vector/export/anime';
import { ANIME_RUNTIME } from '@/lib/vector/export/animeRuntime.generated';
import { chooseRuntime } from '@/lib/vector/export/chooseRuntime';
import { canExportCss, exportAnimatedSvgCss } from '@/lib/vector/export/css';
import { serializeSvg, svgFileName } from '@/lib/vector/exportSvg';
import { countVectorExport, type VectorExportRefusal, type VectorExportResult, type VectorExportRequest } from '@/lib/vector/exportsApi';
import { CODE_FORMATS, SERVER_FORMAT, formatProblem, runFormatExport, type CodeFormat, type FormatExport } from '@/lib/vector/export/formats';
import { LOTTIE_UNSUPPORTED, lottieFeatureKey } from '@/lib/vector/export/lottieSupport';
import { findDocLayer } from '@/lib/vector/advanced';
import { sampleDoc } from '@/lib/vector/sampleTrack';
import { isIrreversibleActionHidden } from '@/lib/translator/mode';
import type { VectorDoc } from '@/lib/vector/vectorTypes';
import { cn } from '@/lib/utils';

/**
 * The Motion export dialog, first version (ticket MM44 decision 9).
 *
 *   - Static SVG: free and UNCOUNTED (§3.4). Serialises the frame at the
 *     playhead and downloads. Zero API calls.
 *   - Animated SVG (CSS): counted. Calls `POST /api/vector/exports` FIRST and
 *     runs the exporter only on `{ok:true}`; 429 / 403 / 422 show a message
 *     with a plain link to /pricing (upgrade routing by ladder is MM49).
 *     The remaining count comes from the response.
 *   - MM46: Lottie JSON, React/TSX, JS and TS modules and Flutter/Dart are
 *     counted the same way (`SERVER_FORMAT`: `lottie`, `react_tsx`, `js_ts`,
 *     `flutter`) and run their exporter only on `{ok:true}`. A tier without
 *     the format gets the server's 403 message (no client-side locks until
 *     MM49). After the download the dialog lists what did not carry over
 *     (Lottie warnings, raw layers left out of React) and what was emitted
 *     (runtime and reasons; Flutter: native or WebView, and why).
 *   - MM47: GIF, PNG sequence, MP4 and WebM, rendered and encoded in the
 *     browser (`lib/vector/raster/*`). Counted as the MM43 formats `gif`,
 *     `png_sequence`, `mp4`, `webm` with the export's real duration, height
 *     and fps. Before counting, the options are clamped to the caller's caps
 *     (`/api/account/usage` limits, the same row `/api/tiers` lists), a
 *     format the tier lacks is shown locked, and one NO public tier offers
 *     yet (MP4/WebM/PNG sequence until MM49) says so instead of calling. Video
 *     needs WebCodecs: without it the options say "Use Chrome or Edge for
 *     video export". The exporters load with a dynamic import on Export, run
 *     with a progress bar and Cancel (AbortController; the GIF worker is
 *     terminated, the video encoder closed). A cancelled export stays counted.
 *
 * MM45: animated SVG picks its runtime with `chooseRuntime`: CSS when every
 * feature is CSS in every major engine, else the inline MIT anime.js script
 * (`exportAnimatedSvgAnime`). The dialog shows the runtime, the reasons
 * ("Uses a 35 KB script because: shape morph"), the `<img>` caveat for
 * scripts, and lets the user force the script runtime (never CSS when CSS
 * cannot express the document). Both runtimes count as the one server
 * format `svg_animated` (`internal/tiers/vector.go` knows no other name).
 *
 * Translator deployments (MM52) hide the counted format: it spends a server
 * allowance, which is an irreversible action there. Static SVG stays.
 *
 * Dependencies are injectable for tests (`count`, `save`). The editor mounts the
 * dialog only while it is open, so every opening starts from a clean status.
 */
export interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doc: VectorDoc;
  name: string;
  /** Playhead (ms): static SVG exports this frame. */
  time: number;
  /** Server project id, when saved (absent for local / anonymous). */
  projectId?: string;
  /** Signed-in? Anonymous exports carry the "made with" comment. */
  signedIn: boolean;
  count?: (req: VectorExportRequest) => Promise<VectorExportResult>;
  save?: (blob: Blob, fileName: string) => void;
  /** MM47 seams: the caller's plan, the codec probe and the raster exporters (lazy-loaded by default). */
  plan?: (signal: AbortSignal) => Promise<RasterPlan | null>;
  probe?: () => Promise<RasterProbe>;
  raster?: () => Promise<RasterRuntime>;
}

const loadRasterRuntime = () => import('@/lib/vector/raster/run').then((m) => m.createRasterRuntime());

const RASTER_EXT: Record<RasterFormat, string> = { gif: 'gif', png_sequence: 'zip', mp4: 'mp4', webm: 'webm' };
/** `<name>.<ext>` (PNG sequence: `<name>-frames.zip`), filesystem-safe like the SVG name. */
export const rasterFileName = (name: string | undefined, f: RasterFormat) => baseFileName(name).replace(/\.svg$/, f === 'png_sequence' ? '-frames.zip' : `.${RASTER_EXT[f]}`);

type Format = 'svg_animated' | 'svg_static' | CodeFormat | RasterFormat;
const isCode = (f: Format): f is CodeFormat => (CODE_FORMATS as readonly string[]).includes(f);
const isRaster = (f: Format): f is RasterFormat => (RASTER_FORMATS as readonly string[]).includes(f);

type Status =
  | { kind: 'idle' }
  | { kind: 'counting' }
  | { kind: 'done'; remaining: number | null; result?: FormatExport }
  | { kind: 'refused'; refusal: VectorExportRefusal }
  | { kind: 'invalid' }
  /** MM47: a raster export is rendering / encoding. */
  | { kind: 'rendering'; progress: RasterProgress | null }
  | { kind: 'cancelled' }
  | { kind: 'rasterFailed'; reason: 'tooLarge' | 'codec' | 'unsafe' | 'error' };

export function ExportDialog({
  open,
  onOpenChange,
  doc,
  name,
  time,
  projectId,
  signedIn,
  count = countVectorExport,
  save = saveBlobToDisk,
  plan: loadPlan = loadRasterPlan,
  probe = defaultProbe,
  raster = loadRasterRuntime,
}: ExportDialogProps) {
  const { t } = useLocalization('interface');
  const countedHidden = isIrreversibleActionHidden();
  const [format, setFormat] = React.useState<Format>(countedHidden ? 'svg_static' : 'svg_animated');
  const [status, setStatus] = React.useState<Status>({ kind: 'idle' });
  const [forceAnime, setForceAnime] = React.useState(false);
  const choice = React.useMemo(() => chooseRuntime(doc, { forceAnime }), [doc, forceAnime]);
  const animatedOk = React.useMemo(
    () => (choice.runtime === 'css' ? canExportCss(doc).ok : canExportAnime(doc).ok),
    [doc, choice.runtime],
  );
  // MM46: code formats run the web exporters, so they inherit their limits (checked before counting).
  const codeOk = React.useMemo(() => {
    const out = {} as Record<CodeFormat, boolean>;
    for (const f of CODE_FORMATS) out[f] = formatProblem(doc, f, forceAnime) === null;
    return out;
  }, [doc, forceAnime]);

  // MM47 raster state. The plan and the probe are reads (never counted); a
  // translator deployment never loads them (raster formats are hidden there).
  const [plan, setPlan] = React.useState<RasterPlan | null>(null);
  React.useEffect(() => {
    if (countedHidden) return;
    const ctl = new AbortController();
    loadPlan(ctl.signal).then((p) => !ctl.signal.aborted && setPlan(p), () => {});
    return () => ctl.abort();
  }, [countedHidden, loadPlan]);
  const rasterProbe = useRasterProbe(countedHidden ? neverProbe : probe);
  const [rasterOptions, setRasterOptions] = React.useState<RasterOptions>(() => defaultRasterOptions('gif', doc));
  const [gif, setGif] = React.useState<GifSettings>({ transparent: true, dither: false, plays: doc.loop === false ? 1 : 0 });
  const abortRef = React.useRef<AbortController | null>(null);
  React.useEffect(() => () => abortRef.current?.abort(), []);

  const pickFormat = (f: Format) => {
    setFormat(f);
    if (isRaster(f)) setRasterOptions((o) => ({ ...o, format: f }));
  };

  const exportRaster = async (f: RasterFormat) => {
    const clamp = clampRasterOptions({ ...rasterOptions, format: f }, plan?.caps ?? null, doc.duration);
    if (!clamp.available || rasterBlock(f, plan, rasterProbe)) return;
    const o = clamp.options;
    const size = outputSize(doc.canvas, o.height, isVideoFormat(f));
    const ctl = new AbortController();
    abortRef.current = ctl;
    setStatus({ kind: 'rendering', progress: null });
    let runtime: RasterRuntime;
    try {
      runtime = await raster();
    } catch {
      setStatus({ kind: 'rasterFailed', reason: 'error' });
      return;
    }
    // Before spending the export: the document must be rasterisable and the
    // browser must encode this exact size and rate.
    if (runtime.check(doc).length > 0) {
      setStatus({ kind: 'rasterFailed', reason: 'unsafe' });
      return;
    }
    if (!(await runtime.canEncode(f, size, o.fps))) {
      setStatus({ kind: 'rasterFailed', reason: 'codec' });
      return;
    }
    if (ctl.signal.aborted) {
      setStatus({ kind: 'cancelled' });
      return;
    }
    setStatus({ kind: 'counting' });
    const result = await count({
      ...(projectId ? { projectId } : {}),
      format: f,
      durationMs: o.endMs - o.startMs,
      height: size.height,
      fps: o.fps,
    });
    if (!result.ok) {
      setStatus({ kind: 'refused', refusal: result.refusal });
      return;
    }
    // Only now: the unit is spent server-side (a cancel from here on is not refunded).
    setStatus({ kind: 'rendering', progress: null });
    try {
      const out = await runtime.run({
        doc,
        format: f,
        size,
        fps: o.fps,
        startMs: o.startMs,
        endMs: o.endMs,
        gif,
        signal: ctl.signal,
        onProgress: (progress) => !ctl.signal.aborted && setStatus({ kind: 'rendering', progress }),
      });
      if (ctl.signal.aborted) throw new DOMException('cancelled', 'AbortError');
      save(out.blob, rasterFileName(name, f));
      setStatus({ kind: 'done', remaining: result.granted.remaining });
    } catch (e) {
      const errName = e instanceof Error ? e.name : '';
      setStatus(
        ctl.signal.aborted || errName === 'AbortError'
          ? { kind: 'cancelled' }
          : { kind: 'rasterFailed', reason: errName === 'RasterTooLargeError' ? 'tooLarge' : errName === 'VideoUnsupportedError' ? 'codec' : 'error' },
      );
    } finally {
      if (abortRef.current === ctl) abortRef.current = null;
    }
  };

  const cancelRaster = () => abortRef.current?.abort();

  const exportStatic = () => {
    const svg = serializeSvg(sampleDoc(doc, time));
    save(new Blob([svg], { type: 'image/svg+xml' }), svgFileName(name));
    setStatus({ kind: 'done', remaining: null });
  };

  const exportAnimated = async () => {
    if (!animatedOk) {
      setStatus({ kind: 'invalid' });
      return;
    }
    setStatus({ kind: 'counting' });
    const result = await count({
      ...(projectId ? { projectId } : {}),
      format: 'svg_animated',
      durationMs: doc.duration,
      height: Math.round(doc.canvas.height),
      fps: Math.round(doc.fps),
    });
    if (!result.ok) {
      setStatus({ kind: 'refused', refusal: result.refusal });
      return;
    }
    // Only now: the unit is spent server-side.
    const svg = choice.runtime === 'anime' ? exportAnimatedSvgAnime(doc, { anonymous: !signedIn }) : exportAnimatedSvgCss(doc, { anonymous: !signedIn });
    save(new Blob([svg], { type: 'image/svg+xml' }), svgFileName(name));
    setStatus({ kind: 'done', remaining: result.granted.remaining });
  };

  const exportCode = async (f: CodeFormat) => {
    if (!codeOk[f]) {
      setStatus({ kind: 'invalid' });
      return;
    }
    setStatus({ kind: 'counting' });
    const result = await count({
      ...(projectId ? { projectId } : {}),
      format: SERVER_FORMAT[f],
      durationMs: doc.duration,
      height: Math.round(doc.canvas.height),
      fps: Math.round(doc.fps),
    });
    if (!result.ok) {
      setStatus({ kind: 'refused', refusal: result.refusal });
      return;
    }
    // Only now: the unit is spent server-side.
    const out = runFormatExport(doc, f, { name, forceAnime });
    save(out.blob, out.fileName);
    setStatus({ kind: 'done', remaining: result.granted.remaining, result: out });
  };

  const run = () =>
    format === 'svg_static' ? exportStatic() : format === 'svg_animated' ? void exportAnimated() : isRaster(format) ? void exportRaster(format) : void exportCode(format);
  const busy = status.kind === 'counting' || status.kind === 'rendering';
  const rasterBlocked = isRaster(format) && rasterBlock(format, plan, rasterProbe) !== null;
  const runDisabled = busy || (format === 'svg_animated' && !animatedOk) || (isCode(format) && !codeOk[format]) || rasterBlocked;

  const option = (id: Format, title: string, hint: string, extra?: React.ReactNode) => (
    <label
      key={id}
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-md border border-edge p-3 hover:bg-surface-2',
        format === id && 'border-edge-strong bg-surface-2',
      )}
    >
      <input type="radio" name="vector-export-format" value={id} checked={format === id} onChange={() => pickFormat(id)} className="mt-1" disabled={busy} />
      <span className="min-w-0">
        <span className="block text-sm font-medium">{title}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
        {extra}
      </span>
    </label>
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !busy && onOpenChange(o)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg" data-testid="vector-export-dialog">
        <DialogHeader>
          <DialogTitle>
            {t('vector.exportDialog.title')}{' '}
            <span className="ms-1 rounded-full border border-premium/40 bg-premium/10 px-2 py-0.5 align-middle text-[10px] font-medium uppercase tracking-wider text-premium">
              {t('vector.beta', { brand: MOTION_BRAND })}
            </span>
          </DialogTitle>
          <DialogDescription>{t('vector.exportDialog.description')}</DialogDescription>
        </DialogHeader>

        <div role="radiogroup" aria-label={t('vector.exportDialog.formats')} className="space-y-2">
          {!countedHidden &&
            option(
              'svg_animated',
              t('vector.exportDialog.animated'),
              t('vector.exportDialog.animatedHint'),
              !animatedOk ? (
                <span className="mt-1 block text-xs text-destructive">{t('vector.exportDialog.unsupported')}</span>
              ) : (
                format === 'svg_animated' && <RuntimeNote runtime={choice.runtime} reasons={choice.reasons} forceAnime={forceAnime} onForceAnime={setForceAnime} />
              ),
            )}
          {option('svg_static', t('vector.exportDialog.static'), t('vector.exportDialog.staticHint'))}
          {!countedHidden &&
            CODE_FORMATS.map((f) =>
              option(
                f,
                t(`vector.exportDialog.code.${f}.title`),
                t(`vector.exportDialog.code.${f}.hint`),
                !codeOk[f] ? (
                  <span className="mt-1 block text-xs text-destructive">{t('vector.exportDialog.unsupported')}</span>
                ) : format !== f ? undefined : f === 'lottie' ? (
                  <LottieSupportNote />
                ) : (
                  <RuntimeNote runtime={choice.runtime} reasons={choice.reasons} forceAnime={forceAnime} onForceAnime={setForceAnime} />
                ),
              ),
            )}
          {!countedHidden &&
            RASTER_FORMATS.map((f) => {
              const block = rasterBlock(f, plan, rasterProbe);
              return option(
                f,
                t(`vector.raster.formats.${f}.title`),
                t(`vector.raster.formats.${f}.hint`),
                block ? (
                  <RasterBlockNote block={block} />
                ) : format === f ? (
                  <RasterSettings doc={doc} options={rasterOptions} onOptions={setRasterOptions} plan={plan} gif={gif} onGif={setGif} disabled={busy} />
                ) : undefined,
              );
            })}
        </div>

        <div role="status" aria-live="polite" className="min-h-5 text-sm" data-testid="vector-export-status">
          {status.kind === 'done' && (
            <span className="text-data">
              {status.remaining === null
                ? t('vector.exportDialog.doneStatic')
                : status.remaining < 0
                  ? t('vector.exportDialog.doneUnlimited')
                  : t('vector.exportDialog.done', { count: status.remaining })}
            </span>
          )}
          {status.kind === 'done' && status.result && <ExportReport doc={doc} result={status.result} />}
          {status.kind === 'invalid' && <span className="text-destructive">{t('vector.exportDialog.unsupported')}</span>}
          {status.kind === 'refused' && <RefusalMessage refusal={status.refusal} />}
          {status.kind === 'rendering' && <RasterProgressBar progress={status.progress} onCancel={cancelRaster} />}
          {status.kind === 'cancelled' && <span className="text-muted-foreground">{t('vector.raster.cancelled')}</span>}
          {status.kind === 'rasterFailed' && <span className="text-destructive">{t(`vector.raster.failed.${status.reason}`)}</span>}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
            {t('common.close')}
          </Button>
          <Button onClick={run} disabled={runDisabled}>
            {busy ? <Loader2 className="animate-spin" /> : <Download />}
            {t('vector.exportDialog.export')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const neverProbe = () => new Promise<RasterProbe>(() => {});

/** The documented Lottie unsupported list (decision 1: rendered in the dialog), collapsed. */
function LottieSupportNote() {
  const { t } = useLocalization('interface');
  return (
    <details className="mt-1.5 text-xs text-muted-foreground" onClick={(e) => e.stopPropagation()} data-testid="vector-lottie-support">
      <summary className="cursor-pointer">{t('vector.lottie.supportSummary')}</summary>
      <ul className="mt-1 list-disc space-y-0.5 ps-4">
        {LOTTIE_UNSUPPORTED.map((f) => (
          <li key={f}>{t(lottieFeatureKey(f))}</li>
        ))}
      </ul>
    </details>
  );
}

/** After an MM46 export: the warnings (never silent) and what was emitted (decision 10). */
function ExportReport({ doc, result }: { doc: VectorDoc; result: FormatExport }) {
  const { t } = useLocalization('interface');
  const label = (id: string) => {
    if (!id) return t('vector.lottie.document');
    const l = findDocLayer(doc, id);
    return (l && l.name) || id;
  };
  const because = (codes: string[], ns: string) => codes.map((r) => t(`${ns}.${r}`)).join(', ');
  return (
    <div className="mt-2 space-y-1.5 text-xs" data-testid="vector-export-report">
      {result.runtime && (
        <p className="text-muted-foreground" data-testid="vector-export-emitted-runtime">
          {result.runtime === 'css'
            ? t('vector.exportDialog.emitted.css')
            : result.runtimeReasons.length > 0
              ? t('vector.exportDialog.emitted.animeBecause', { reasons: because(result.runtimeReasons, 'vector.exportDialog.reasons') })
              : t('vector.exportDialog.emitted.anime')}
        </p>
      )}
      {result.flutter && (
        <p className="text-muted-foreground" data-testid="vector-export-emitted-flutter" data-emitter={result.flutter.emitter}>
          {result.flutter.emitter === 'native'
            ? t('vector.exportDialog.flutter.native')
            : t('vector.exportDialog.flutter.webview', { reasons: because(result.flutter.reasons, 'vector.exportDialog.flutterReasons') })}
        </p>
      )}
      {result.warnings.length > 0 && (
        <div className="rounded-md border border-premium/40 p-2" data-testid="vector-export-warnings">
          <p className="mb-1 font-medium text-premium">{t('vector.lottie.warningsTitle', { count: result.warnings.length })}</p>
          <ul className="max-h-32 space-y-0.5 overflow-y-auto text-muted-foreground">
            {result.warnings.map((w, i) => (
              <li key={i} data-feature={w.feature}>
                {t(lottieFeatureKey(w.feature as never))} <span className="font-mono text-text-subtle">{label(w.layerId)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** The runtime size users are told about ("a 35 KB script"), rounded to whole KB. */
export const ANIME_RUNTIME_KB = Math.round(ANIME_RUNTIME.length / 1024);

/**
 * Which runtime the animated export uses and why (MM45 decision 8). The
 * checkbox forces the script runtime; it is checked and locked when CSS cannot
 * express the document (CSS can never be forced).
 */
function RuntimeNote({
  runtime,
  reasons,
  forceAnime,
  onForceAnime,
}: {
  runtime: 'css' | 'anime';
  reasons: string[];
  forceAnime: boolean;
  onForceAnime: (on: boolean) => void;
}) {
  const { t } = useLocalization('interface');
  const required = reasons.length > 0;
  const because = reasons.map((r) => t(`vector.exportDialog.reasons.${r}`)).join(', ');
  return (
    <span className="mt-1.5 block space-y-1 text-xs" data-testid="vector-export-runtime" data-runtime={runtime}>
      <span className="block text-muted-foreground">
        {runtime === 'css'
          ? t('vector.exportDialog.runtimeCss')
          : required
            ? t('vector.exportDialog.runtimeAnimeBecause', { size: ANIME_RUNTIME_KB, reasons: because })
            : t('vector.exportDialog.runtimeAnimeChosen', { size: ANIME_RUNTIME_KB })}
      </span>
      {runtime === 'anime' && <span className="block text-premium">{t('vector.exportDialog.scriptImgNote')}</span>}
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <input
          type="checkbox"
          checked={required || forceAnime}
          disabled={required}
          onChange={(e) => onForceAnime(e.target.checked)}
          onClick={(e) => e.stopPropagation()}
          aria-label={t('vector.exportDialog.forceAnime')}
        />
        <span>{t('vector.exportDialog.forceAnime')}</span>
      </span>
    </span>
  );
}

function RefusalMessage({ refusal }: { refusal: VectorExportRefusal }) {
  const { t } = useLocalization('interface');
  const localized = useLocalizedHref();
  const message = (() => {
    switch (refusal.kind) {
      case 'limit':
        return t('vector.exportDialog.limit', { count: refusal.limit });
      case 'locked':
        return t('vector.exportDialog.locked');
      case 'cap':
        return refusal.cap === 'duration'
          ? t('vector.exportDialog.capDuration', { seconds: Math.round(refusal.max / 100) / 10 })
          : refusal.cap === 'height'
            ? t('vector.raster.capHeight', { max: refusal.max })
            : refusal.cap === 'fps'
              ? t('vector.raster.capFps', { max: refusal.max })
              : t('vector.exportDialog.capOther');
      case 'unavailable':
        return t('vector.exportDialog.unavailable');
    }
  })();
  const upgrade = refusal.kind !== 'unavailable' && !isIrreversibleActionHidden();
  return (
    <span className="text-destructive" data-refusal={refusal.kind}>
      {message}{' '}
      {upgrade && (
        // Plain /pricing link in the editor's language (MM49 routes by ladder).
        <a href={localized('/pricing')} className="font-medium text-foreground underline underline-offset-2">
          {t('vector.exportDialog.upgrade')}
        </a>
      )}
    </span>
  );
}
