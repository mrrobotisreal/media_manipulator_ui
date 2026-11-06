import { describe, expect, it } from 'vitest';
import {
  CANVAS_PRESETS,
  buildExportRequest,
  canvasPresetKey,
  clampCanvas,
  effectiveCaptionsMode,
  errorClassKey,
  exportHistorySummary,
  formatExtension,
  hasRunning,
  jobsToWatch,
  mergeExportRows,
  outputDimensions,
  resolutionLabel,
  resolutionOptions,
  sidecarFileNames,
  choiceLabel,
  exportMode,
  prefillFromParams,
  recordOutput,
  rerenderExportProps,
  type ExportChoices,
} from './exportOptions';
import type { StudioExportRecord } from '@/lib/studioTypes';

const out = (container: string, videoCodec: string, audioCodec: string, audioBitrate = 192, audioChannels = 2) => ({ container, videoCodec, audioCodec, audioBitrate, audioChannels });
const choices = (over: Partial<ExportChoices> = {}): ExportChoices => ({
  fileName: 'cut', quality: 'high', loudness: 'none', outputPreset: 'mp4_h264', mode: 'preset', output: out('mp4', 'h264', 'aac'),
  resolution: 0, captionsMode: 'burn_in', ...over,
});

const rec = (over: Partial<StudioExportRecord> = {}): StudioExportRecord => ({
  id: 'e1', jobId: 'j1', format: 'h264', resolution: 0, captionsMode: 'none', status: 'running',
  createdAt: '2026-10-24T00:00:00Z', available: false, ...over,
});

describe('buildExportRequest', () => {
  it('sends the legacy body only when the backend lacks export depth (CreaTV)', () => {
    const req = buildExportRequest(choices({ outputPreset: 'mov_hevc', resolution: 2160, captionsMode: 'sidecar' }), false);
    expect(req).toEqual({ fileName: 'cut', preset: 'high', loudness: '' });
    expect(Object.keys(req)).not.toContain('format');
    expect(Object.keys(req)).not.toContain('outputPreset');
  });
  it('a preset sends outputPreset with resolution/captionsMode, never the format alias', () => {
    expect(buildExportRequest(choices({ outputPreset: 'mp4_hevc', resolution: 1440, captionsMode: 'sidecar', loudness: 'podcast' }), true)).toEqual({
      fileName: 'cut', preset: 'high', loudness: 'podcast', outputPreset: 'mp4_hevc', resolution: 1440, captionsMode: 'sidecar',
    });
  });
  it('advanced sends the explicit parts; non-default bitrate/channels only when set', () => {
    const r = buildExportRequest(choices({ mode: 'advanced', output: out('mkv', 'h264', 'mp3', 320, 1) }), true);
    expect(r).toMatchObject({ container: 'mkv', videoCodec: 'h264', audioCodec: 'mp3', audioBitrate: 320, audioChannels: 1 });
    expect(r.outputPreset).toBeUndefined();
    const pcm = buildExportRequest(choices({ mode: 'advanced', output: out('mov', 'h264', 'pcm_s16le', 0) }), true);
    expect(pcm).toMatchObject({ container: 'mov', audioCodec: 'pcm_s16le' });
    expect(pcm.audioBitrate).toBeUndefined();
    expect(pcm.audioChannels).toBeUndefined();
  });
  it('an Advanced choice equal to a preset is sent as that preset (never gated as Advanced)', () => {
    const r = buildExportRequest(choices({ mode: 'advanced', output: out('mov', 'hevc', 'aac') }), true);
    expect(r.outputPreset).toBe('mov_hevc');
    expect(r.container).toBeUndefined();
    expect(exportMode(choices({ mode: 'advanced', output: out('mov', 'hevc', 'aac') }))).toBe('preset');
    expect(exportMode(choices({ mode: 'advanced', output: out('mov', 'hevc', 'aac', 256) }))).toBe('advanced');
  });
  it('audio presets drop resolution and captions', () => {
    for (const outputPreset of ['audio_mp3', 'audio_wav']) {
      const r = buildExportRequest(choices({ outputPreset, resolution: 2160, captionsMode: 'burn_in' }), true);
      expect(r.resolution).toBe(0);
      expect(r.captionsMode).toBe('none');
    }
  });
  it('labels follow the table: legacy names for the four, derived labels otherwise', () => {
    expect(choiceLabel(choices())).toBe('h264');
    expect(choiceLabel(choices({ outputPreset: 'mp4_hevc' }))).toBe('hevc');
    expect(choiceLabel(choices({ outputPreset: 'audio_wav' }))).toBe('wav');
    expect(choiceLabel(choices({ outputPreset: 'mov_hevc' }))).toBe('mov_hevc_aac');
    expect(choiceLabel(choices({ mode: 'advanced', output: out('mkv', 'hevc', 'mp3') }))).toBe('mkv_hevc_mp3');
  });
});

describe('prefillFromParams (Medi export bridge)', () => {
  it('prefills a preset, resolution, captions and the upgrade note', () => {
    expect(prefillFromParams({ preset: 'mov_h264', container: 'mov', videoCodec: 'h264', audioCodec: 'aac', resolution: 1080, captionsMode: 'none' })).toMatchObject({
      mode: 'preset', outputPreset: 'mov_h264', resolution: 1080, captionsMode: 'none',
    });
    expect(prefillFromParams({ preset: 'mp4_h264', upgrade: { required: 'premium', option: 'mov' } })?.upgrade).toEqual({ required: 'premium', option: 'mov' });
  });
  it('prefills Advanced for a combination no preset names, or a non-default bitrate', () => {
    expect(prefillFromParams({ container: 'mkv', videoCodec: 'h264', audioCodec: 'mp3' })).toMatchObject({ mode: 'advanced', output: { container: 'mkv', audioCodec: 'mp3' } });
    expect(prefillFromParams({ container: 'mp4', videoCodec: 'h264', audioCodec: 'aac', audioBitrate: 320 })?.mode).toBe('advanced');
  });
  it('refuses anything the table does not have instead of guessing', () => {
    expect(prefillFromParams(null)).toBeNull();
    expect(prefillFromParams({})).toBeNull();
    expect(prefillFromParams({ preset: 'webm_vp9' })).toBeNull();
    expect(prefillFromParams({ container: 'mov', audioCodec: 'opus' })).toBeNull();
    expect(prefillFromParams({ preset: 'mp4_h264', resolution: 999 })?.resolution).toBeUndefined();
  });
});

describe('history rows', () => {
  it('reads stored parts, or the parts a legacy label means', () => {
    expect(recordOutput(rec({ format: 'hevc' }))).toMatchObject({ container: 'mp4', videoCodec: 'hevc', audioCodec: 'aac' });
    expect(recordOutput(rec({ format: 'mov_hevc_aac', container: 'mov', videoCodec: 'hevc', audioCodec: 'aac', audioBitrate: 256 }))).toMatchObject({ container: 'mov', audioBitrate: 256 });
  });
  it('render-again props carry the label, parts and mode', () => {
    expect(rerenderExportProps(rec({ format: 'wav', preset: 'low' }), 'mm')).toMatchObject({ format: 'wav', container: 'wav', resolution: 'audio', mode: 'preset', preset: 'low' });
    expect(rerenderExportProps(rec({ format: 'mkv_h264_mp3', container: 'mkv', videoCodec: 'h264', audioCodec: 'mp3', audioBitrate: 192 }), 'mm').mode).toBe('advanced');
  });
});

describe('resolutionOptions', () => {
  it('annotates rungs above the cap but never hides them', () => {
    const opts = resolutionOptions(1080, 1080);
    expect(opts.map((o) => o.value)).toEqual([0, 2160, 1440, 1080, 720]);
    expect(opts.map((o) => o.overCap)).toEqual([false, true, true, false, false]);
  });
  it('flags the Source rung when the canvas itself exceeds the cap', () => {
    expect(resolutionOptions(2160, 1440)[0]).toMatchObject({ height: 2160, overCap: true });
  });
  it('annotates nothing when the cap is unknown or absent', () => {
    expect(resolutionOptions(1080, undefined).some((o) => o.overCap)).toBe(false);
    expect(resolutionOptions(2160, -1).some((o) => o.overCap)).toBe(false);
  });
});

describe('outputDimensions (mirrors the server)', () => {
  it('keeps aspect with an even width', () => {
    expect(outputDimensions(1920, 1080, 720)).toEqual({ width: 1280, height: 720 });
    expect(outputDimensions(1080, 1920, 720)).toEqual({ width: 406, height: 720 });
    expect(outputDimensions(1080, 1350, 1080)).toEqual({ width: 864, height: 1080 });
  });
  it('is the canvas for 0 or an equal height', () => {
    expect(outputDimensions(1920, 1080, 0)).toEqual({ width: 1920, height: 1080 });
    expect(outputDimensions(1920, 1080, 1080)).toEqual({ width: 1920, height: 1080 });
  });
});

describe('labels and small helpers', () => {
  it('uses a closed vocabulary for resolution', () => {
    expect(resolutionLabel(0)).toBe('canvas');
    expect(resolutionLabel(1440)).toBe('1440p');
  });
  it('extensions and sidecar names', () => {
    expect(formatExtension('h264')).toBe('mp4');
    expect(formatExtension('hevc')).toBe('mp4');
    expect(formatExtension('mp3')).toBe('mp3');
    expect(formatExtension('wav')).toBe('wav');
    expect(formatExtension('mov_hevc_aac')).toBe('mov');
    expect(formatExtension('mkv_h264_mp3')).toBe('mkv');
    expect(sidecarFileNames('my-edit.mp4')).toEqual({ srt: 'my-edit.srt', vtt: 'my-edit.vtt' });
    expect(sidecarFileNames('my.edit')).toEqual({ srt: 'my.srt', vtt: 'my.vtt' });
    expect(sidecarFileNames('')).toEqual({ srt: 'captions.srt', vtt: 'captions.vtt' });
  });
  it('captions mode collapses to none without captions', () => {
    expect(effectiveCaptionsMode('burn_in', false)).toBe('none');
    expect(effectiveCaptionsMode('sidecar', true)).toBe('sidecar');
  });
  it('error classes map to known keys, else generic', () => {
    expect(errorClassKey('timeout')).toBe('timeout');
    expect(errorClassKey('interrupted')).toBe('interrupted');
    expect(errorClassKey('tool_failure')).toBe('generic');
    expect(errorClassKey(undefined)).toBe('generic');
  });
});

describe('mergeExportRows (leave-the-page-safe panel)', () => {
  it('shows live progress on a running row', () => {
    const [row] = mergeExportRows([rec()], { j1: { status: 'processing', progress: 42 } });
    expect(row).toMatchObject({ displayStatus: 'running', progress: 42, canDownload: false });
  });
  it('a running row with no live data yet is running at 0 (page just re-opened)', () => {
    const [row] = mergeExportRows([rec()], {});
    expect(row).toMatchObject({ displayStatus: 'running', progress: 0 });
  });
  it('live completion wins over a stale running row, and becomes downloadable', () => {
    const [row] = mergeExportRows([rec()], { j1: { status: 'completed', progress: 100 } });
    expect(row).toMatchObject({ displayStatus: 'completed', progress: 100, canDownload: true });
  });
  it('live failure wins over a stale running row', () => {
    const [row] = mergeExportRows([rec()], { j1: { status: 'failed', progress: 10, error: 'x' } });
    expect(row.displayStatus).toBe('failed');
    expect(row.canDownload).toBe(false);
  });
  it('never reopens a settled row', () => {
    const done = rec({ status: 'completed', available: true });
    expect(mergeExportRows([done], { j1: { status: 'processing', progress: 5 } })[0]).toMatchObject({
      displayStatus: 'completed', canDownload: true, progress: 100,
    });
    const failed = rec({ status: 'failed', error: 'timeout' });
    expect(mergeExportRows([failed], { j1: { status: 'processing', progress: 5 } })[0].displayStatus).toBe('failed');
  });
  it('a completed row past retention offers no download', () => {
    expect(mergeExportRows([rec({ status: 'completed', available: false })], {})[0].canDownload).toBe(false);
  });
  it('watch list and running flag follow the durable rows', () => {
    const rows = [rec({ jobId: 'a' }), rec({ id: 'e2', jobId: 'b', status: 'completed' }), rec({ id: 'e3', jobId: 'c' })];
    expect(jobsToWatch(rows)).toEqual(['a', 'c']);
    expect(hasRunning(mergeExportRows(rows, {}))).toBe(true);
    expect(hasRunning(mergeExportRows([rows[1]], {}))).toBe(false);
  });
});

describe('exportHistorySummary (cs:export-history)', () => {
  it('summarizes with enums and booleans only, newest first, capped', () => {
    const rows = mergeExportRows(
      Array.from({ length: 12 }, (_, i) => rec({ id: `e${i}`, jobId: `j${i}`, status: i === 0 ? 'running' : 'completed', available: true })),
      {},
    );
    const s = exportHistorySummary(rows);
    expect(s.total).toBe(12);
    expect(s.running).toBe(1);
    expect(s.entries).toHaveLength(10);
    expect(Object.keys(s.entries[0]).sort()).toEqual(['available', 'container', 'format', 'jobId', 'resolution', 'status']);
    expect(s.entries[0]).toMatchObject({ format: 'h264', container: 'mp4' });
  });
});

describe('canvas presets', () => {
  it('has the four delivery ratios', () => {
    expect(CANVAS_PRESETS.map((p) => [p.key, p.width, p.height])).toEqual([
      ['16:9', 1920, 1080], ['9:16', 1080, 1920], ['1:1', 1080, 1080], ['4:5', 1080, 1350],
    ]);
  });
  it('clamps to the server range with even numbers', () => {
    expect(clampCanvas(10, 10)).toEqual({ width: 64, height: 64 });
    expect(clampCanvas(99999, 99999)).toEqual({ width: 7680, height: 4320 });
    expect(clampCanvas(1081, 1919)).toEqual({ width: 1080, height: 1918 });
    expect(clampCanvas(NaN, NaN)).toEqual({ width: 1920, height: 1080 });
  });
  it('maps a size back to a preset key or custom', () => {
    expect(canvasPresetKey(1080, 1350)).toBe('4:5');
    expect(canvasPresetKey(1000, 1000)).toBe('custom');
  });
});
