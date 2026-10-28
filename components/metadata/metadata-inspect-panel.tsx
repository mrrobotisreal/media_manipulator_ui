'use client';

import { useCallback, useRef, useState } from 'react';
import { Search, Upload, X } from 'lucide-react';
import { useLocalization } from '@/i18n/useLocalization';
import { useMetadataAnalytics } from '@/lib/metadata/useMetadataAnalytics';
import { getFileType } from '@/lib/utils';
import { normalizeMediaKind, trackFileChoice, useToolAnalytics } from '@/lib/analytics';
import { useAuth } from '@/lib/auth/AuthProvider';
import { UploadLimitHint } from '@/components/account/upgrade-surfaces';
import { LazyMetadataInspector } from './metadata-inspector-lazy';
import { useMetadataInspect } from './use-metadata-data';
import { AUTO_INSPECT_MAX_BYTES, shouldAutoInspect } from './home-metadata';

export interface MetadataInspectPanelProps {
  /** File-input accept list; the page passes the catalog's accept for its media kind. */
  accept?: string;
}

/**
 * The standalone "Inspect metadata" tool: pick a file, read every tag the
 * server can find (EXIF, GPS, IPTC, XMP, ffprobe streams, ID3, PDF info), and
 * nothing else happens to it. The report is the product, so there is no
 * conversion form and no job: `POST /api/metadata/inspect` is not a quota-gated
 * route, and the inspector is the same component the home page and the EXIF
 * removal page already use.
 */
export default function MetadataInspectPanel({ accept = 'image/*,video/*,audio/*,application/pdf' }: MetadataInspectPanelProps) {
  const { t, formatFileSize } = useLocalization('interface');
  const { track: trackTool, setMediaKind } = useToolAnalytics();
  const auth = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [requested, setRequested] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const kind = file ? getFileType(file) : 'unknown';
  const auto = file ? shouldAutoInspect(file, kind) : false;
  const q = useMetadataInspect(file, { enabled: !!file && (auto || requested) });
  const analytics = useMetadataAnalytics('tool_page', q.data);

  const choose = useCallback(
    (next: File) => {
      setFile(next);
      setRequested(false);
      const fileKind = getFileType(next);
      setMediaKind(normalizeMediaKind(fileKind));
      trackFileChoice(trackTool, next, fileKind, {
        unsupported: fileKind === 'unknown',
        limitBytes: auth?.limits?.maxFileBytes,
      });
    },
    [auth?.limits?.maxFileBytes, setMediaKind, trackTool],
  );

  const clear = () => {
    setFile(null);
    setRequested(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  if (!file) {
    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          const dropped = e.dataTransfer.files?.[0];
          if (dropped) choose(dropped);
        }}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
        data-testid="metadata-inspect-dropzone"
      >
        <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <p className="font-medium text-card-foreground mb-1">{t('metadataInspectPanel.dragDrop')}</p>
        <p className="text-sm text-muted-foreground mb-4">{t('metadataInspectPanel.hint')}</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors"
        >
          {t('embeddedToolPanel.selectFile')}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => {
            const picked = e.target.files?.[0];
            if (picked) choose(picked);
          }}
          className="hidden"
          aria-label={t('embeddedToolPanel.selectFile')}
        />
        <UploadLimitHint className="mt-3" />
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="metadata-inspect-panel">
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div className="min-w-0">
          <p className="font-medium text-card-foreground truncate">{file.name}</p>
          <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
        </div>
        <button
          type="button"
          onClick={clear}
          className="p-1 rounded hover:bg-muted text-muted-foreground"
          aria-label={t('embeddedToolPanel.removeFile')}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {!auto && !requested ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {t('metadataInspectPanel.largeFile', { size: formatFileSize(AUTO_INSPECT_MAX_BYTES) })}
          </p>
          <button
            type="button"
            onClick={() => setRequested(true)}
            data-testid="metadata-inspect-button"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-[var(--accent-primary-hover)]"
          >
            <Search aria-hidden="true" className="size-4" />
            {t('metadata.home.inspect', { defaultValue: 'Inspect metadata' })}
          </button>
        </div>
      ) : q.status === 'error' ? (
        <p className="text-sm text-destructive" role="alert">
          {t('metadataInspectPanel.failed')}
        </p>
      ) : q.data ? (
        <LazyMetadataInspector document={q.data} surface="tool_page" fileName={file.name} status="ready" onEvent={analytics.onEvent} />
      ) : (
        <LazyMetadataInspector
          document={{ schemaVersion: 1, file: { name: file.name, sizeBytes: file.size, mime: file.type, kind: 'unknown' }, tools: [], entries: [], warnings: [] }}
          surface="tool_page"
          status="loading"
        />
      )}
      <p className="text-xs text-muted-foreground">
        {t('metadata.home.privacyNote', { defaultValue: 'Inspection happens on our servers; the file is deleted after analysis.' })}
      </p>
    </div>
  );
}
