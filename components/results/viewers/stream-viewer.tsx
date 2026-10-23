'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Segmented } from '@/components/darkroom/segmented';
import { useLocalization } from '@/i18n/useLocalization';
import { isOverArchiveCap } from '@/lib/results/archive/limits';
import type { OpenedArchive } from '@/lib/results/archive/types';
import { useOpenedArchive } from '@/lib/results/archive/useOpenedArchive';
import { mimeForFileName } from '@/lib/results/describe';
import { bundleUrl, createBundleLoader, pathFromBundleUrl } from '@/lib/results/stream/loaders';
import { buildNativePlaylistUrl } from '@/lib/results/stream/native';
import { findEntryPoint, mpdUsesAv1 } from '@/lib/results/stream/rewrite';
import { useResultBlob } from '@/lib/results/useResultBlob';
import { StreamReport } from '../stream-report';
import type { ViewerProps } from './types';
import { UnknownViewer } from './unknown-viewer';

interface Rung {
  value: string;
  label: string;
  /** Short name handed to `onRungSelect`, e.g. `720p`. */
  name: string;
}

interface PlayerHandle {
  select: (value: string) => void;
  destroy: () => void;
}

interface PlayerArgs {
  video: HTMLVideoElement;
  archive: OpenedArchive;
  kind: 'hls' | 'dash';
  formatRung: (height: number, bitrateKbps: number) => string;
  onRungs: (rungs: Rung[]) => void;
  onFatal: (reason: 'unsupported' | 'av1' | 'error') => void;
  isCancelled: () => boolean;
}

/** Wires hls.js (loaded here, on demand) or dash.js to the in-memory bundle. */
async function startPlayer(args: PlayerArgs): Promise<PlayerHandle | null> {
  const { video, archive, kind, formatRung, onRungs, onFatal, isCancelled } = args;
  const files = new Map(archive.entries.filter((e) => !e.isDir).map((e) => [e.path, e]));
  const read = (path: string): Uint8Array | null => files.get(path)?.data?.() ?? null;
  const entryPath = findEntryPoint(archive.entries.filter((e) => !e.isDir), kind);
  if (!entryPath) {
    onFatal('unsupported');
    return null;
  }

  if (kind === 'dash') {
    const manifest = read(entryPath);
    if (manifest && mpdUsesAv1(new TextDecoder().decode(manifest)) && typeof MediaSource !== 'undefined' && !MediaSource.isTypeSupported('video/mp4; codecs="av01.0.05M.08"')) {
      onFatal('av1');
      return null;
    }
    const dashModule = (await import('dashjs')) as unknown as { default?: typeof import('dashjs'); MediaPlayer?: typeof import('dashjs').MediaPlayer };
    if (isCancelled()) return null;
    const MediaPlayer = dashModule.MediaPlayer ?? dashModule.default?.MediaPlayer;
    if (!MediaPlayer) {
      onFatal('unsupported');
      return null;
    }
    const player = MediaPlayer().create();
    const urls = new Map<string, string>();
    // Requests for bundle URLs are answered from memory by pointing them at blob URLs.
    player.addRequestInterceptor(async (request) => {
      const path = pathFromBundleUrl(request.url);
      const bytes = path === null ? null : read(path);
      if (path !== null && bytes) {
        let url = urls.get(path);
        if (!url) {
          url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: mimeForFileName(path) }));
          urls.set(path, url);
        }
        return { ...request, url };
      }
      return request;
    });
    player.on('error', () => onFatal('error'));
    player.on('streamInitialized', () => {
      const reps = player.getRepresentationsByType('video') ?? [];
      onRungs(reps.map((r) => ({ value: String(r.id), name: `${r.height}p`, label: formatRung(r.height, Math.round(r.bitrateInKbit)) })));
    });
    player.initialize(video, bundleUrl(entryPath), false);
    return {
      select(value) {
        if (value === 'auto') {
          player.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: true } } } });
        } else {
          player.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: false } } } });
          player.setRepresentationForTypeById('video', value, true);
        }
      },
      destroy() {
        player.destroy();
        urls.forEach((u) => URL.revokeObjectURL(u));
      },
    };
  }

  const { default: Hls } = await import('hls.js');
  if (isCancelled()) return null;
  if (Hls.isSupported()) {
    const hls = new Hls({ loader: createBundleLoader(read) as unknown as typeof Hls.DefaultConfig.loader });
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      onRungs(hls.levels.map((level, index) => ({ value: String(index), name: `${level.height}p`, label: formatRung(level.height, Math.round(level.bitrate / 1000)) })));
    });
    hls.on(Hls.Events.ERROR, (_event, data) => {
      if (data.fatal) onFatal('error');
    });
    hls.loadSource(bundleUrl(entryPath));
    hls.attachMedia(video);
    return {
      select(value) {
        hls.currentLevel = value === 'auto' ? -1 : Number(value);
      },
      destroy() {
        hls.destroy();
      },
    };
  }
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // Safari plays HLS natively but cannot take a loader: give it playlists with blob URLs.
    const made: string[] = [];
    const url = buildNativePlaylistUrl(entryPath, read, (path, data) => {
      const blob = new Blob([data as BlobPart], { type: mimeForFileName(path) });
      const u = URL.createObjectURL(blob);
      made.push(u);
      return u;
    });
    if (!url) {
      onFatal('unsupported');
      return null;
    }
    video.src = url;
    return { select() {}, destroy: () => made.forEach((u) => URL.revokeObjectURL(u)) };
  }
  onFatal('unsupported');
  return null;
}

function StreamPlayer({ archive, kind, onRungSelect, onFatal }: { archive: OpenedArchive; kind: 'hls' | 'dash'; onRungSelect?: (rung: string) => void; onFatal: (reason: 'unsupported' | 'av1' | 'error') => void }) {
  const { t } = useLocalization('interface');
  const name = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const handle = useRef<PlayerHandle | null>(null);
  const [rungs, setRungs] = useState<Rung[]>([]);
  const [selected, setSelected] = useState('auto');
  const onFatalRef = useRef(onFatal);
  const tRef = useRef(t);
  useEffect(() => {
    onFatalRef.current = onFatal;
    tRef.current = t;
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;
    void startPlayer({
      video,
      archive,
      kind,
      formatRung: (height, bitrateKbps) => tRef.current('resultPanel.stream.rungLabel', { height, bitrate: bitrateKbps }),
      onRungs: (r) => !cancelled && setRungs(r),
      onFatal: (reason) => !cancelled && onFatalRef.current(reason),
      isCancelled: () => cancelled,
    })
      .then((h) => {
        if (cancelled) h?.destroy();
        else handle.current = h;
      })
      .catch(() => !cancelled && onFatalRef.current('error'));
    return () => {
      cancelled = true;
      handle.current?.destroy();
      handle.current = null;
    };
  }, [archive, kind]);

  const options = useMemo(() => [{ value: 'auto', label: t('resultPanel.stream.auto') }, ...rungs], [rungs, t]);
  return (
    <div className="flex w-full flex-col gap-3" data-testid="stream-viewer">
      <video ref={videoRef} controls playsInline className="max-h-[calc(100dvh-22rem)] max-w-full self-center rounded-lg bg-surface-0" />
      {rungs.length > 1 && (
        <Segmented
          name={`${name}-rung`}
          label={t('resultPanel.stream.rung')}
          value={selected}
          onValueChange={(value) => {
            setSelected(value);
            handle.current?.select(value);
            onRungSelect?.(value === 'auto' ? 'auto' : (rungs.find((r) => r.value === value)?.name ?? value));
          }}
          options={options}
          className="w-full"
        />
      )}
    </div>
  );
}

/**
 * HLS / DASH bundle viewer. Opens the bundle with the archive reader, serves hls.js (or
 * dash.js on the DASH page only) from memory through a custom loader, and offers a quality
 * selector. Anything that cannot play (over the cap, unreadable bundle, fatal player error,
 * AV1 without decoder support) shows the transcode report instead.
 */
export function StreamViewer(props: ViewerProps) {
  const { descriptor, kind, fileName, onRungSelect } = props;
  const { t } = useLocalization('interface');
  const streamKind: 'hls' | 'dash' = kind === 'dash' ? 'dash' : 'hls';
  const tooLarge = isOverArchiveCap(descriptor.sizeBytes);
  const blobState = useResultBlob(descriptor, { enabled: !tooLarge });
  const archiveState = useOpenedArchive(tooLarge ? null : blobState.blob, fileName);
  const [fatal, setFatal] = useState<'unsupported' | 'av1' | 'error' | null>(null);

  const failed = tooLarge || blobState.status === 'error' || archiveState.status === 'error' || fatal !== null;
  if (failed) {
    const message = tooLarge
      ? t('resultPanel.archive.tooLarge')
      : fatal === 'av1'
        ? t('resultPanel.stream.av1')
        : t('resultPanel.stream.unsupported');
    return (
      <div className="flex w-full flex-col items-center gap-3" data-testid="stream-fallback">
        <p role="status" className="text-sm text-muted-foreground">{message}</p>
        {descriptor.probe ? <StreamReport probe={descriptor.probe} /> : <UnknownViewer {...props} />}
      </div>
    );
  }
  if (archiveState.status !== 'ready') {
    return (
      <p role="status" className="flex items-center gap-2 text-muted-foreground">
        <Loader2 aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
        {t('resultPanel.stream.loading')}
      </p>
    );
  }
  return <StreamPlayer archive={archiveState.archive} kind={streamKind} onRungSelect={onRungSelect} onFatal={setFatal} />;
}

export default StreamViewer;
