import { describe, expect, it } from 'vitest';

import { PRIMARY_TOOL_PAGES } from '@/content/toolPages';
import { encodeOptions } from '@/lib/assistant/toolOptions/codec';
import { allToolOptionSpecs, optionsSpecForTool } from '@/lib/assistant/toolOptions/registry';
import { compressorRequest, extractAudioRequest, transformRequest, trimRequest } from '@/lib/assistant/toolOptions/requests';
import { actionHref } from '@/lib/assistant/links';

import { RUNNABLE_FAMILIES, planJob, resultFileName, runBlock, type JobEmbed } from './plan';
import { CODE_VALUES, settingRows, valueKey, vocabulary } from './settings';

const tool = (slug: string) => PRIMARY_TOOL_PAGES.find((t) => t.slug === slug)!;
const embedOf = (slug: string) => tool(slug).embed as unknown as JobEmbed;
const familyOf = (slug: string) => {
  const s = optionsSpecForTool(tool(slug));
  if (s.kind !== 'options') throw new Error('no options');
  return s.family;
};
const plan = (slug: string, o: Record<string, unknown>) => planJob(familyOf(slug), o, embedOf(slug));

describe('planJob: the request the page itself would send (MM116b)', () => {
  it('video compressor: level, resolution, codec, audio, and the CRF override', () => {
    const p = plan('compress-video', { level: 'smallest', resolution: '720', stripAudio: true });
    expect(p).toMatchObject({ submit: 'convert', needs: ['video'] });
    expect(p!.request).toEqual({ format: 'mp4', quality: 'low', speed: 1, preserveAspectRatio: true, crf: 31, stripAudio: true, videoCodec: 'h264', height: 720 });
    // The same function the panel calls, so the card and the page cannot disagree.
    expect(p!.request).toEqual(compressorRequest({ level: 'smallest', format: 'mp4', codec: 'h264', resolution: '720', stripAudio: true, crfOverride: '' }));
    expect((plan('compress-video', { crf: 35 })!.request as unknown as { crf: number }).crf).toBe(35);
    // WebM sends no codec (the API picks VP9).
    expect(plan('compress-video', { format: 'webm' })!.request).not.toHaveProperty('videoCodec');
  });

  it('a locked-format page forces its container', () => {
    expect((plan('convert-video-to-hevc', { format: 'webm' })!.request as unknown as { format: string }).format).toBe('mp4');
  });

  it('resize / rotate / crop need what the page needs', () => {
    expect(plan('resize-video', { width: 640 })!.request).toEqual(transformRequest({ emphasis: 'resize', format: 'mp4', width: 640, height: '', preserveAspect: true, rotation: 90, flipH: false, flipV: false, cropX: 0, cropY: 0, cropW: '', cropH: '' }));
    expect(plan('resize-video', {})).toBeNull(); // no width or height: the page would ask
    expect((plan('rotate-video', { rotation: 180, flipHorizontal: true })!.request as unknown as { transform: object }).transform).toEqual({ rotation: 180, flipHorizontal: true, flipVertical: false });
    expect(plan('crop-video', { cropWidth: 100 })).toBeNull();
    expect((plan('crop-video', { cropWidth: 100, cropHeight: 80, cropX: 4 })!.request as unknown as { transform: { crop: object } }).transform.crop).toEqual({ x: 4, y: 0, width: 100, height: 80 });
  });

  it('trim needs an explicit range, like the page after it probes the file', () => {
    expect(plan('video-trimmer', { startTime: 5 })).toBeNull();
    expect(plan('video-trimmer', { startTime: 5, endTime: 5 })).toBeNull();
    expect(plan('video-trimmer', { startTime: 5, endTime: 12, reencode: true })).toEqual({ submit: 'specialized', needs: ['video'], request: trimRequest({ format: 'mp4', start: 5, end: 12, reencode: true }) });
  });

  it('extract audio, remove audio and transcribe', () => {
    expect(plan('extract-audio-from-video', { format: 'flac' })!.request).toEqual(extractAudioRequest('flac'));
    expect(plan('extract-audio-from-video', {})!.request).toEqual({ mode: 'extract_audio', format: 'mp3' });
    expect(plan('remove-audio-from-video', { format: 'webm' })!.request).toEqual({ mode: 'extract_video_only', format: 'webm' });
    expect(plan('transcribe-audio', { format: 'srt', language: 'es' })).toEqual({ submit: 'transcribe', needs: ['audio', 'video'], request: { mode: 'transcribe', format: 'srt', language: 'es' } });
    expect((plan('srt-generator', {})!.request as unknown as { format: string }).format).toBe('srt');
  });

  it('every other family falls back to opening the tool page (logged: see ticket)', () => {
    const fallback = new Set<string>();
    for (const { tool: t, spec } of allToolOptionSpecs()) {
      if (spec.kind !== 'options') continue;
      if (!(RUNNABLE_FAMILIES as readonly string[]).includes(spec.family)) {
        fallback.add(spec.family);
        expect(planJob(spec.family, {}, t.embed as unknown as JobEmbed), t.slug).toBeNull();
      }
    }
    // The image / audio / video converter forms keep their state inside react-hook-form; the AI tools, summaries,
    // captions, frames, waveform, stitch and HLS/DASH have their own panels. All open the page with ?o=.
    expect([...fallback].sort()).toEqual(
      ['audio:ai', 'audio:convert', 'audio:stems', 'audio:waveform', 'caption:translate', 'image:ai_upscale', 'image:convert', 'image:crop', 'image:face_privacy', 'image:filter', 'image:metadata', 'image:redact_text', 'image:remove_background', 'image:remove_object', 'image:text', 'pdf', 'summarize', 'transcode', 'video:convert', 'video:extract-frames', 'video:interpolate', 'video:stitch'].sort(),
    );
  });

  it('runBlock: a button reads Start only with a file of the right kind, a plan and allowance left', () => {
    const p = plan('compress-video', {});
    expect(runBlock(p, { kind: 'video' }, false)).toBeNull();
    expect(runBlock(p, null, false)).toBe('no_file');
    expect(runBlock(p, { kind: 'audio' }, false)).toBe('wrong_kind');
    expect(runBlock(p, { kind: 'unknown' }, false)).toBe('wrong_kind');
    expect(runBlock(p, { kind: 'video' }, true)).toBe('quota_exhausted');
    expect(runBlock(null, { kind: 'video' }, false)).toBe('unsupported');
    expect(runBlock(plan('transcribe-audio', {}), { kind: 'audio' }, false)).toBeNull();
  });

  it('names the result like the panels do', () => {
    expect(resultFileName(plan('compress-video', {})!, new File([], 'My Trip.mov'))).toBe('My Trip.mp4');
    expect(resultFileName(plan('transcribe-audio', { format: 'srt' })!, new File([], 'talk.m4a'))).toBe('talk_transcript.srt');
  });
});

describe('settingRows: labels and units come from the option schema, in schema order', () => {
  it('rows follow the schema and drop names the schema does not know', () => {
    const spec = optionsSpecForTool(tool('compress-video'));
    const rows = settingRows(spec, { stripAudio: true, level: 'smallest', crf: 30, bogus: 'x' });
    expect(rows.map((r) => r.name)).toEqual(['level', 'crf', 'stripAudio']);
    expect(rows[0]).toMatchObject({ label: 'Compression level', value: 'smallest', isEnum: true });
    expect(rows[1]).toMatchObject({ label: 'CRF override', value: 30, isEnum: false });
    expect(settingRows(spec, undefined)).toEqual([]);
    expect(settingRows(optionsSpecForTool(tool('motion')), { a: 1 })).toEqual([]);
  });
  it('carries units', () => {
    expect(settingRows(optionsSpecForTool(tool('resize-video')), { width: 640 })[0]).toMatchObject({ unit: 'px' });
  });
  it('valueKey is a safe i18n key part', () => {
    expect(valueKey('rotate-45º')).toBe('rotate_45o');
    expect(valueKey('high_quality')).toBe('high_quality');
    expect(valueKey('NorthEast')).toBe('NorthEast');
  });
});

describe('the card vocabulary is translated in every locale', () => {
  it('every field, unit and word-like value has a key in each of the 18 shards', async () => {
    const { locales } = await import('@/i18n/locales');
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    const v = vocabulary(allToolOptionSpecs().map((x) => x.spec));
    expect(Object.keys(v.fields).length).toBeGreaterThan(70);
    expect(locales.length).toBe(18);
    for (const l of locales) {
      const shard = JSON.parse(readFileSync(join(process.cwd(), 'i18n/locales', l.code.toLowerCase(), 'interface/assistant.json'), 'utf8')).assistant.jobCard;
      for (const f of Object.keys(v.fields)) expect(shard.fields[f], `${l.code} field ${f}`).toBeTruthy();
      for (const u of v.units) expect(shard.units[u], `${l.code} unit ${u}`).toBeTruthy();
      for (const val of v.values) expect(shard.values[valueKey(val)], `${l.code} value ${val}`).toBeTruthy();
    }
    for (const c of CODE_VALUES) expect(v.values).not.toContain(c);
  });
});

describe('the confirmation link is the tool page link', () => {
  it('opens the tool with the validated ?o= options', () => {
    const href = actionHref('open_tool', { slug: 'compress-video', options: { level: 'smallest' } }, 'es-ES');
    expect(href).toBe(`/es/tools/compress-video?o=${encodeOptions({ level: 'smallest' })}`);
  });
});
