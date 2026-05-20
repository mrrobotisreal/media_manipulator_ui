import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, Film, Sparkles, Captions, Image as ImageIcon, Info, Download, AlertTriangle } from 'lucide-react';
import useVideoTranscodeProbe, { type ProbeMutationResult } from '@/lib/useVideoTranscodeProbe';
import useStartVideoTranscode from '@/lib/useStartVideoTranscode';
import useTranscodeJobStatus from '@/lib/useTranscodeJobStatus';
import type {
  DashCodec,
  TranscodeProbeResponse,
  TranscodeProtocol,
  TranscodeQualityRung,
  TranscodeJobStage,
} from '@/lib/transcodeTypes';
import InfoTooltip from '@/components/info-tooltip';

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
  const disabled = !rung.enabled;
  const tooltipText = rung.disabledReason || (rung.premiumOnly
    ? 'Sign up for a Premium account to get full transcode access! (Premium sign-up Coming Soon!)'
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
      {rung.premiumOnly && <span className="ml-auto text-[10px] uppercase tracking-wide text-blue-600">Premium</span>}
      {rung.sourceTooSmall && <span className="ml-auto text-[10px] uppercase tracking-wide text-orange-600">Too small</span>}
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
  const [protocol, setProtocol] = useState<TranscodeProtocol>(defaultProtocol);
  const [dashCodec, setDashCodec] = useState<DashCodec>(defaultDashCodec);
  const [probe, setProbe] = useState<TranscodeProbeResponse | null>(null);
  const [probeContext, setProbeContext] = useState<ProbeMutationResult | null>(null);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [generateCaptions, setGenerateCaptions] = useState(false);
  const [generateStoryboards, setGenerateStoryboards] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

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
      generateStoryboards,
      sessionId: probeContext.sessionId,
    });
  };

  const captionsDisabled = !probe?.hasAudio;
  const captionsTooltip = captionsDisabled
    ? 'Captions require an audio track. This video does not appear to have audio.'
    : 'Generate VTT captions from the audio track using whisper-ctranslate2. Off by default.';

  const downloadUrl = job.data?.resultUrl && job.data?.status === 'completed' ? job.data.resultUrl : null;

  return (
    <div className="space-y-5">
      {/* Protocol + codec selector */}
      <div>
        <h3 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
          <Film className="w-4 h-4 text-blue-600" /> Protocol
          <InfoTooltip
            ariaLabel="About transcode protocol"
            width="lg"
            content={
              <div className="space-y-1">
                <p><strong>HLS</strong> — Apple HTTP Live Streaming. H.264/AAC, master.m3u8 + per-rendition variants + .ts segments. Plays everywhere.</p>
                <p><strong>DASH</strong> — MPEG-DASH adaptive streaming. AV1 (smallest, modern) or VP9 (broader support); manifest.mpd + .m4s segments.</p>
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
                {p === 'hls' ? 'H.264 / AAC · .m3u8 · everywhere' : 'AV1 or VP9 · .mpd · modern web'}
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
                <span className="text-xs text-muted-foreground">{c === 'av1' ? 'Recommended · smaller files' : 'Wider playback support'}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Step 1: Analyze video */}
      {!probe && (
        <div className="rounded-lg border border-input p-4 bg-muted/20">
          <p className="text-sm text-card-foreground mb-3">
            We&apos;ll upload your video and run <code className="text-xs px-1 py-0.5 bg-card border border-border rounded">ffprobe</code> to detect resolution, codec, audio, and the quality rungs your source supports.
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
                  ? `Uploading ${probeMutation.uploadProgress}%`
                  : probeMutation.uploadPhase === 'probing'
                    ? 'Analyzing source...'
                    : 'Preparing upload...'}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze video
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
          <h3 className="font-semibold text-card-foreground mb-2">Source video report</h3>
          <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
            <div><dt className="text-muted-foreground">Resolution</dt><dd className="text-card-foreground">{probe.width}×{probe.height}</dd></div>
            <div><dt className="text-muted-foreground">Max quality</dt><dd className="text-card-foreground uppercase">{probe.maxQualityLabel}</dd></div>
            <div><dt className="text-muted-foreground">FPS</dt><dd className="text-card-foreground">{probe.fps ? probe.fps.toFixed(2) : '—'}</dd></div>
            <div><dt className="text-muted-foreground">Duration</dt><dd className="text-card-foreground">{formatSeconds(probe.durationSeconds)}</dd></div>
            <div><dt className="text-muted-foreground">Audio</dt><dd className="text-card-foreground">{probe.hasAudio ? 'Yes' : 'No'}</dd></div>
            <div><dt className="text-muted-foreground">Video codec</dt><dd className="text-card-foreground">{probe.videoCodec || '—'}</dd></div>
            <div><dt className="text-muted-foreground">Audio codec</dt><dd className="text-card-foreground">{probe.audioCodec || '—'}</dd></div>
            <div><dt className="text-muted-foreground">Container</dt><dd className="text-card-foreground">{probe.containerFormat || '—'}</dd></div>
            <div><dt className="text-muted-foreground">File size</dt><dd className="text-card-foreground">{formatBytes(probe.fileSizeBytes)}</dd></div>
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
            Quality rungs
            <InfoTooltip
              ariaLabel="About quality rungs"
              content="Each selected rung becomes one rendition in the final HLS/DASH package. Premium rungs (144p/240p/1080p/2160p) are coming soon."
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
            Defaults: 360p + 480p + 720p when the source video supports them.
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
                <Captions className="w-4 h-4" /> Generate captions
              </div>
              <p className="text-xs text-muted-foreground">VTT subtitles auto-generated from the audio track. Off by default.</p>
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
                <ImageIcon className="w-4 h-4" /> Generate storyboards
              </div>
              <p className="text-xs text-muted-foreground">Sprite-sheet scrubber thumbnails + WebVTT index. Off by default.</p>
            </div>
          </label>
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
              Starting transcode...
            </>
          ) : (
            <>Start {protocol.toUpperCase()} transcode</>
          )}
        </button>
      )}

      {probe?.sourceTooSmall && (
        <div className="rounded border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 p-3 text-sm flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <span>
            This video is below the free transcode minimum of 360p. Premium support for ultra-low-quality sources is coming soon. Please load a video that is 360p or higher.
          </span>
        </div>
      )}

      {/* Job progress timeline */}
      {activeJobId && job.data && (
        <div className="rounded-lg border border-border p-4 bg-muted/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-card-foreground">Pipeline progress</h3>
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
              {job.data.error || 'Transcode failed.'}
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
          Download {job.data?.resultFileName || `${protocol}-package.tar.gz`}
        </a>
      )}
    </div>
  );
};

export default VideoTranscodeForm;
