import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, Download, Music, Plus, Trash2, Video, X } from 'lucide-react';
import useGetJobStatus, { type ConversionJob } from '@/lib/useGetJobStatus';
import useDownloadFile from '@/lib/useDownloadFile';
import useStitchAudioToVideoTool, {
  type StitchAudioTrackInput,
  type StitchMode,
} from '@/lib/useStitchAudioToVideoTool';

/**
 * StitchAudioToVideoPanel orchestrates the multi-file workflow: one base
 * video plus up to MAX_TRACKS audio files, each with its own volume +
 * offset + optional loop. We deliberately keep this in a single component
 * rather than reusing SpecializedToolShell because the upload UX is
 * meaningfully different (multiple files, per-track settings).
 */

const MAX_TRACKS = 3;

const StitchAudioToVideoPanel: React.FC = () => {
  const [video, setVideo] = useState<File | null>(null);
  const [tracks, setTracks] = useState<StitchAudioTrackInput[]>([]);
  const [mode, setMode] = useState<StitchMode>('mix');
  const [trimToVideoDuration, setTrimToVideoDuration] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [conversionJob, setConversionJob] = useState<ConversionJob | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending, uploadProgress } = useStitchAudioToVideoTool((res) => {
    setConversionJob({
      id: res.jobId,
      status: 'processing',
      originalFile: new File([], 'temp'),
      progress: 0,
    });
  });
  const { data: jobStatus } = useGetJobStatus(conversionJob);
  const { downloadFile } = useDownloadFile();

  useEffect(() => {
    if (jobStatus) {
      setConversionJob((prev) => (prev ? { ...prev, ...jobStatus } : prev));
    }
  }, [jobStatus]);

  const handleVideoDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setVideo(f);
  }, []);

  const addAudioFile = (file: File) => {
    if (tracks.length >= MAX_TRACKS) return;
    setTracks((prev) => [
      ...prev,
      { file, volume: 1.0, offsetSeconds: 0, loop: false },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!video || tracks.length === 0) return;
    mutate({
      video,
      options: { mode, trimToVideoDuration, tracks },
    });
  };

  const handleDownload = async () => {
    if (!conversionJob?.id || !video) return;
    try {
      const blob = await downloadFile(conversionJob.id);
      const baseName = video.name.substring(0, video.name.lastIndexOf('.')) || video.name;
      const fileName = `${baseName}_stitched.mp4`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Stitch download failed', err);
    }
  };

  const isProcessing = isPending || conversionJob?.status === 'processing';
  const isCompleted = conversionJob?.status === 'completed';

  return (
    <div className="space-y-5">
      {!video ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            setIsDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragOver(false);
          }}
          onDrop={handleVideoDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
        >
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-card-foreground mb-1">Drop your base video here</p>
          <p className="text-sm text-muted-foreground mb-4">
            Pick the video first — you'll add audio tracks (voiceover, music, narration) next.
          </p>
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Select video
          </button>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setVideo(f);
            }}
            className="hidden"
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3 min-w-0">
              <Video className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-card-foreground truncate">{video.name}</p>
                <p className="text-xs text-muted-foreground">{(video.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setVideo(null);
                setTracks([]);
                setConversionJob(null);
              }}
              className="text-muted-foreground hover:text-card-foreground transition-colors"
              aria-label="Remove base video"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h3 className="text-sm font-medium text-card-foreground mb-2">Audio tracks</h3>
            <div className="space-y-3">
              {tracks.map((track, i) => (
                <div key={i} className="border border-border rounded-lg p-3 bg-background/40 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Music className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-sm font-medium text-card-foreground truncate">{track.file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTracks((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove track"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground">Volume</label>
                      <input
                        type="number"
                        step={0.1}
                        min={0}
                        max={4}
                        value={track.volume}
                        onChange={(e) => {
                          const v = Math.max(0, Math.min(4, Number(e.target.value) || 0));
                          setTracks((prev) => prev.map((t, idx) => (idx === i ? { ...t, volume: v } : t)));
                        }}
                        className="w-full p-2 text-sm border border-input rounded-lg bg-input text-card-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Start offset (seconds)</label>
                      <input
                        type="number"
                        step={0.1}
                        min={0}
                        max={3600}
                        value={track.offsetSeconds}
                        onChange={(e) => {
                          const v = Math.max(0, Math.min(3600, Number(e.target.value) || 0));
                          setTracks((prev) => prev.map((t, idx) => (idx === i ? { ...t, offsetSeconds: v } : t)));
                        }}
                        className="w-full p-2 text-sm border border-input rounded-lg bg-input text-card-foreground"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={track.loop}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setTracks((prev) => prev.map((t, idx) => (idx === i ? { ...t, loop: checked } : t)));
                      }}
                    />
                    Loop this track to match the video length
                  </label>
                </div>
              ))}
              {tracks.length < MAX_TRACKS && (
                <button
                  type="button"
                  onClick={() => audioInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 rounded-lg p-3 text-sm text-card-foreground flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add audio track ({tracks.length}/{MAX_TRACKS})
                </button>
              )}
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) addAudioFile(f);
                  if (audioInputRef.current) audioInputRef.current.value = '';
                }}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Audio mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as StitchMode)}
                className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
              >
                <option value="mix">Mix with existing audio</option>
                <option value="replace">Replace original audio</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Output length</label>
              <select
                value={trimToVideoDuration ? 'video' : 'longest'}
                onChange={(e) => setTrimToVideoDuration(e.target.value === 'video')}
                className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
              >
                <option value="video">Trim to video duration</option>
                <option value="longest">Match longest input</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing || tracks.length === 0}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Music className="w-4 h-4" />
            {isProcessing ? 'Stitching audio + video…' : 'Add audio to video'}
          </button>

          {isProcessing && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {uploadProgress > 0 && uploadProgress < 100 ? `Uploading ${uploadProgress}%` : 'Mixing on the server…'}{' '}
                {conversionJob?.progress ? `· ${conversionJob.progress}%` : ''}
              </p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${conversionJob?.progress || uploadProgress || 0}%` }}
                />
              </div>
            </div>
          )}

          {isCompleted && (
            <button
              type="button"
              onClick={() => void handleDownload()}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download stitched video
            </button>
          )}
          {conversionJob?.status === 'failed' && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
              {conversionJob.error || 'Stitch failed. Check that your audio files are valid and try again.'}
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default StitchAudioToVideoPanel;
