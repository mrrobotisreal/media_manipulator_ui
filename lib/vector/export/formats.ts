/**
 * The MM46 export formats of the Motion export dialog (ticket MM46 decisions
 * 8–10): what each produces, which server format it counts as, and the
 * "what was emitted" note the dialog shows afterwards.
 *
 * Every format here is COUNTED: the dialog calls `POST /api/vector/exports`
 * with `serverFormat` first and runs `runFormatExport` only on `{ok:true}`.
 * The names are exactly the ones `internal/tiers/vector.go` knows (MM43):
 * `lottie` (free and up), `react_tsx`, `js_ts`, `flutter` (premium and up).
 * Locks are the server's: a tier without the format answers 403
 * `vector_format_locked` and the dialog shows that message (decision 8,
 * proposed: no client-side gating beyond the server's answer).
 *
 * Pure: no React, no network. The dialog lazy-loads nothing extra: these
 * exporters are string templating and live in the editor route's chunk.
 */
import type { VectorDoc } from '@/lib/vector/vectorTypes';

import { exportFlutter, type NativeFlutterReason } from './dart';
import { exportJsModule } from './js';
import { exportLottie, lottieFileName, lottieText } from './lottie';
import { exportReactComponent } from './react';
import { canExportAnime } from './anime';
import { chooseRuntime, type AnimeReason } from './chooseRuntime';
import { canExportCss } from './css';
import type { LottieWarning } from './lottieSupport';
import type { CodeExportWarning } from './codeEscape';
import type { VectorExportFormat } from '@/lib/vector/exportsApi';

/** The dialog's MM46 format options. */
export const CODE_FORMATS = ['lottie', 'react_tsx', 'js', 'ts', 'flutter'] as const;
export type CodeFormat = (typeof CODE_FORMATS)[number];

/** The counted server format of each option (MM43 names; JS and TS share `js_ts`). */
export const SERVER_FORMAT: Record<CodeFormat, VectorExportFormat> = {
  lottie: 'lottie',
  react_tsx: 'react_tsx',
  js: 'js_ts',
  ts: 'js_ts',
  flutter: 'flutter',
};

/** What an export produced, for the dialog's after-export note (decision 10). */
export interface FormatExport {
  format: CodeFormat;
  blob: Blob;
  fileName: string;
  /** Lottie: what did not carry over (`vector.lottie.unsupported.<feature>`); code exports: raw layers left out. */
  warnings: Array<LottieWarning | CodeExportWarning>;
  /** React / JS / TS / Flutter WebView: the runtime and why; null for Lottie and native Flutter. */
  runtime: 'css' | 'anime' | null;
  runtimeReasons: AnimeReason[];
  /** Flutter only: which emitter and why the native one was not used. */
  flutter?: { emitter: 'native' | 'webview'; reasons: NativeFlutterReason[] };
}

const text = (s: string, type: string) => new Blob([s], { type });

/**
 * Run the exporter of `format` (after the count succeeded). Throws the
 * exporters' own errors when the document cannot be expressed (the dialog
 * checks `formatProblem` first, so this is a bug guard).
 */
export function runFormatExport(doc: VectorDoc, format: CodeFormat, opts: { name: string; forceAnime: boolean }): FormatExport {
  switch (format) {
    case 'lottie': {
      const { json, warnings } = exportLottie(doc, { name: opts.name });
      return { format, blob: text(lottieText(json), 'application/json'), fileName: lottieFileName(opts.name), warnings, runtime: null, runtimeReasons: [] };
    }
    case 'react_tsx': {
      const r = exportReactComponent(doc, { name: opts.name, forceAnime: opts.forceAnime });
      return { format, blob: text(r.code, 'text/plain'), fileName: r.fileName, warnings: r.warnings, runtime: r.runtime, runtimeReasons: r.reasons };
    }
    case 'js':
    case 'ts': {
      const r = exportJsModule(doc, { typescript: format === 'ts', name: opts.name, forceAnime: opts.forceAnime });
      // Raw layers travel inside the module's SVG string exactly as in the animated SVG (already sanitised): no warning.
      return { format, blob: text(r.code, 'text/plain'), fileName: r.fileName, warnings: [], runtime: r.runtime, runtimeReasons: r.reasons };
    }
    case 'flutter': {
      const r = exportFlutter(doc, { name: opts.name, forceAnime: opts.forceAnime });
      return {
        format,
        blob: text(r.code, 'text/plain'),
        fileName: r.fileName,
        warnings: [],
        runtime: r.runtime,
        runtimeReasons: r.runtimeReasons,
        flutter: { emitter: r.emitter, reasons: r.reasons },
      };
    }
  }
}

/**
 * Why a format cannot export this document at all (checked before counting,
 * so a refusal never spends an allowance), or null. Lottie always exports
 * (unsupported content becomes warnings); the code formats need the web
 * exporter of their runtime to accept the document (the native Flutter
 * variant only carries documents the web exporters accept too). Runs the
 * exporters' checks only, never an export.
 */
export function formatProblem(doc: VectorDoc, format: CodeFormat, forceAnime: boolean): string | null {
  if (format === 'lottie') return null;
  const { runtime } = chooseRuntime(doc, { forceAnime });
  const check = runtime === 'css' ? canExportCss(doc) : canExportAnime(doc);
  return check.ok ? null : check.issues.map((i) => i.code).join(',');
}
