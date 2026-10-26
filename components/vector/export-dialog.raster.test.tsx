/**
 * MM47 acceptance 3 (dialog half) and 5: the raster export flow with a mocked
 * API, a fake probe, a fake plan and a stub raster runtime.
 *   allowed → the encoder runs with the clamped options, the file downloads
 *   403 / 422 / 429 → the encoder is never constructed
 *   cancel → the encoder is aborted, nothing downloads, URLs revoked
 *   no WebCodecs → "Use Chrome or Edge for video export", MP4/WebM disabled
 *   format in no public tier → "Not available on any plan yet", no API call
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import enPanels from '@/i18n/locales/en-us/interface/panels.json';
import { createI18nInstance } from '@/i18n';
import type { RasterProbe } from '@/lib/vector/raster/capabilities';
import { capsFromLimits } from '@/lib/vector/raster/caps';
import type { RasterPlan } from '@/lib/vector/raster/plan';
import type { RasterRunJob, RasterRuntime } from '@/lib/vector/raster/run';
import { createRasterRuntime } from '@/lib/vector/raster/run';
import { inProcessGifPort } from '@/lib/vector/raster/gif';
import { fakeFrameEnv } from '@/lib/vector/raster/testFakes.testutil';
import { parseVectorDoc } from '@/lib/vector/vectorTypes';

vi.mock('next/navigation', () => ({ usePathname: () => '/motion/x', useRouter: () => ({ push: vi.fn() }) }));
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => `/de${p}` }));
vi.mock('@/lib/firebase', () => ({ getCurrentIdToken: async () => null, onAuthStateChange: () => () => {} }));

import { ExportDialog, rasterFileName } from './export-dialog';

const i18n = createI18nInstance('en-US');
i18n.addResourceBundle('en-US', 'interface', enPanels, true, true);

const doc = (() => {
  const r = parseVectorDoc({
    version: 1,
    duration: 30000,
    fps: 30,
    canvas: { width: 1920, height: 1080 },
    layers: [{ type: 'rect', id: 'box', x: 0, y: 0, width: 10, height: 10 }],
    animations: [{ layerId: 'box', property: 'transform.x', keyframes: [{ t: 0, value: 0, easing: 'linear' }, { t: 30000, value: 90, easing: 'linear' }] }],
  });
  if (!r.ok) throw new Error(r.error);
  return r.doc;
})();

const ALL = ['svg_animated', 'lottie', 'react_tsx', 'js_ts', 'flutter', 'gif', 'png_sequence', 'mp4', 'webm', 'import_lottie', 'import_svg_vectorize'];
/** Premium today (MM43 defaults): GIF 720p / 15 s; no public tier has PNG sequence / MP4 / WebM. */
const PREMIUM_PLAN: RasterPlan = {
  tier: 'premium',
  caps: capsFromLimits({ vectorFormats: ALL.filter((f) => !['png_sequence', 'mp4', 'webm'].includes(f)), vectorMaxDurationMs: 0, vectorVideo: { maxHeight: 720, maxFps: 0, maxSeconds: 15 } }),
  publicFormats: new Set(ALL.filter((f) => !['png_sequence', 'mp4', 'webm'].includes(f))),
};
const FREE_PLAN: RasterPlan = { ...PREMIUM_PLAN, tier: 'free', caps: capsFromLimits({ vectorFormats: ['svg_animated', 'lottie'], vectorMaxDurationMs: 0, vectorVideo: { maxHeight: 0, maxFps: 0, maxSeconds: 0 } }) };
const OPERATOR_PLAN: RasterPlan = { tier: 'operator', caps: capsFromLimits({ vectorFormats: ALL, vectorMaxDurationMs: 0, vectorVideo: { maxHeight: 4320, maxFps: 240, maxSeconds: 600 } }), publicFormats: PREMIUM_PLAN.publicFormats };

const PROBE_ALL: RasterProbe = { gif: true, png: true, webcodecs: true, h264: true, vp9: true, av1: true, offscreen: true, secureContext: true };
const PROBE_NONE: RasterProbe = { ...PROBE_ALL, webcodecs: false, h264: false, vp9: false, av1: false };

const fetchMock = vi.fn<typeof fetch>();
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const granted = (format: string) => json(200, { ok: true, format, tier: 'premium', limit: 30, remaining: 12, resetsAt: '' });

function stubRuntime(behaviour: (job: RasterRunJob) => Promise<{ blob: Blob; frames: number; bytes: number }> = async () => ({ blob: new Blob(['GIF89a'], { type: 'image/gif' }), frames: 1, bytes: 6 })) {
  const run = vi.fn(behaviour);
  const canEncode = vi.fn(async () => true);
  const check = vi.fn(() => [] as string[]);
  const runtime: RasterRuntime = { run, canEncode, check };
  const load = vi.fn(async () => runtime);
  return { run, canEncode, check, load };
}

function mount(opts: { plan?: RasterPlan | null; probe?: RasterProbe; runtime?: ReturnType<typeof stubRuntime> } = {}) {
  const save = vi.fn();
  const runtime = opts.runtime ?? stubRuntime();
  render(
    <I18nextProvider i18n={i18n}>
      <ExportDialog
        open
        onOpenChange={() => {}}
        doc={doc}
        name="Bounce"
        time={0}
        signedIn
        save={save}
        plan={async () => (opts.plan === undefined ? PREMIUM_PLAN : opts.plan)}
        probe={async () => opts.probe ?? PROBE_ALL}
        raster={runtime.load}
      />
    </I18nextProvider>,
  );
  return { save, runtime };
}

const radio = (name: RegExp) => screen.getByRole('radio', { name }) as HTMLInputElement;
const exportButton = () => screen.getByRole('button', { name: 'Export' }) as HTMLButtonElement;
const status = () => screen.getByTestId('vector-export-status');
const settle = () => act(async () => {});

describe('MM47 raster formats in the export dialog', () => {
  it('premium GIF: pre-clamped to 720p and 15 s, counted with those values, then encoded and downloaded', async () => {
    const { save, runtime } = mount();
    await settle();
    fireEvent.click(radio(/^GIF/));
    expect(screen.getByTestId('vector-raster-clamped').textContent).toContain('720p');
    expect(screen.getByTestId('vector-raster-clamped').textContent).toContain('15 s');
    expect(screen.getByTestId('vector-raster-summary').textContent).toContain('1280 × 720 px');
    fetchMock.mockResolvedValueOnce(granted('gif'));
    fireEvent.click(exportButton());
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual({ format: 'gif', durationMs: 15000, height: 720, fps: 30 });
    expect(runtime.run).toHaveBeenCalledTimes(1);
    expect(runtime.run.mock.calls[0][0]).toMatchObject({ format: 'gif', size: { width: 1280, height: 720 }, fps: 30, startMs: 0, endMs: 15000, gif: { transparent: true, dither: false, plays: 0 } });
    expect((save.mock.calls[0] as [Blob, string])[1]).toBe('Bounce.gif');
    expect(status().textContent).toContain('12 animated exports left today.');
  });

  it.each([
    [403, { error: 'vector_format_locked', format: 'gif', tier: 'free', upgradePath: 'premium' }, 'locked'],
    [422, { error: 'vector_cap_exceeded', cap: 'height', max: 720, tier: 'premium' }, 'cap'],
    [429, { error: 'vector_export_limit', tier: 'premium', limit: 30, used: 30, upgradePath: 'pro' }, 'limit'],
  ])('%i: the encoder is never constructed, nothing downloads', async (code, body, kind) => {
    // Unknown plan: nothing is locked client-side, so the server's answer is what stops it.
    const { save, runtime } = mount({ plan: null });
    await settle();
    fireEvent.click(radio(/^GIF/));
    fetchMock.mockResolvedValueOnce(json(code, body));
    fireEvent.click(exportButton());
    await waitFor(() => expect(status().querySelector('[data-refusal]')?.getAttribute('data-refusal')).toBe(kind));
    expect(runtime.run).not.toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
    if (code === 422) expect(status().textContent).toContain('720p');
  });

  it('cancel: aborts the running encoder; nothing downloads; the unit stays spent', async () => {
    let seen: AbortSignal | undefined;
    const runtime = stubRuntime(
      (job) =>
        new Promise((_resolve, reject) => {
          seen = job.signal;
          job.onProgress?.({ phase: 'render', done: 3, total: 450, bytes: 100 });
          job.signal?.addEventListener('abort', () => reject(Object.assign(new Error('cancelled'), { name: 'AbortError' })));
        }),
    );
    const { save } = mount({ runtime });
    await settle();
    fireEvent.click(radio(/^GIF/));
    fetchMock.mockResolvedValueOnce(granted('gif'));
    fireEvent.click(exportButton());
    await waitFor(() => expect(screen.getByTestId('vector-raster-progress').textContent).toContain('Rendering frame 3 of 450'));
    expect(exportButton().disabled).toBe(true);
    fireEvent.click(screen.getByTestId('vector-raster-cancel'));
    await waitFor(() => expect(status().textContent).toContain('Export cancelled'));
    expect(seen?.aborted).toBe(true);
    expect(save).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('cancel with the real GIF exporter: the worker port is terminated and every frame URL revoked', async () => {
    const env = fakeFrameEnv();
    let terminated = false;
    const real = createRasterRuntime({
      env,
      gifPort: () => {
        const p = inProcessGifPort();
        return { request: p.request, terminate: () => ((terminated = true), p.terminate()) };
      },
    });
    const ctlRef: { cancel?: () => void } = {};
    const runtime = stubRuntime((job) =>
      real.run({
        ...job,
        size: { width: 8, height: 6 },
        onProgress: (p) => {
          job.onProgress?.(p);
          if (p.done === 2) ctlRef.cancel?.();
        },
      }),
    );
    const { save } = mount({ runtime });
    await settle();
    fireEvent.click(radio(/^GIF/));
    fetchMock.mockResolvedValueOnce(granted('gif'));
    ctlRef.cancel = () => fireEvent.click(screen.getByTestId('vector-raster-cancel'));
    fireEvent.click(exportButton());
    await waitFor(() => expect(status().textContent).toContain('Export cancelled'));
    expect(terminated).toBe(true);
    expect(env.log.created.length).toBeGreaterThan(0);
    expect(env.log.revoked).toEqual(env.log.created);
    expect(save).not.toHaveBeenCalled();
  });

  it('no WebCodecs: MP4 and WebM say "Use Chrome or Edge for video export" and cannot be exported', async () => {
    const { runtime } = mount({ plan: OPERATOR_PLAN, probe: PROBE_NONE });
    await settle();
    const blocks = Array.from(document.querySelectorAll('[data-raster-block="useChromium"]'));
    expect(blocks).toHaveLength(2);
    expect(blocks[0].textContent).toBe('Use Chrome or Edge for video export');
    fireEvent.click(radio(/^MP4 video/));
    expect(exportButton().disabled).toBe(true);
    fireEvent.click(radio(/^WebM video/));
    expect(exportButton().disabled).toBe(true);
    // GIF and PNG do not need WebCodecs.
    fireEvent.click(radio(/^PNG sequence/));
    expect(exportButton().disabled).toBe(false);
    expect(runtime.load).not.toHaveBeenCalled();
  });

  it('H.264 unsupported but VP9 supported: MP4 disabled, WebM enabled', async () => {
    mount({ plan: OPERATOR_PLAN, probe: { ...PROBE_ALL, h264: false, av1: false } });
    await settle();
    fireEvent.click(radio(/^MP4 video/));
    expect(exportButton().disabled).toBe(true);
    expect(document.querySelector('[data-raster-block="noCodec"]')).toBeTruthy();
    fireEvent.click(radio(/^WebM video/));
    expect(exportButton().disabled).toBe(false);
  });

  it('formats no public tier offers yet (premium today): "Not available on any plan yet", no API call', async () => {
    const { runtime } = mount();
    await settle();
    expect(document.querySelectorAll('[data-raster-block="notOnAnyPlan"]')).toHaveLength(3);
    for (const name of [/^PNG sequence/, /^MP4 video/, /^WebM video/]) {
      fireEvent.click(radio(name));
      expect(exportButton().disabled).toBe(true);
      fireEvent.click(exportButton());
    }
    expect(fetchMock).not.toHaveBeenCalled();
    expect(runtime.load).not.toHaveBeenCalled();
  });

  it('free tier: GIF is locked with the plan message (a higher tier has it)', async () => {
    mount({ plan: FREE_PLAN });
    await settle();
    expect(document.querySelector('[data-raster-block="locked"]')?.textContent).toBe('Your plan does not include this format.');
    fireEvent.click(radio(/^GIF/));
    expect(exportButton().disabled).toBe(true);
  });

  it('operator: MP4 at 2160p60 is counted with the even output height and runs as video', async () => {
    const runtime = stubRuntime(async () => ({ blob: new Blob(['x'], { type: 'video/mp4' }), frames: 1, bytes: 1 }));
    const { save } = mount({ plan: OPERATOR_PLAN, runtime });
    await settle();
    fireEvent.click(radio(/^MP4 video/));
    fireEvent.change(screen.getByLabelText('Size'), { target: { value: '2160' } });
    fireEvent.change(screen.getByLabelText('Frames per second'), { target: { value: '60' } });
    fetchMock.mockResolvedValueOnce(granted('mp4'));
    fireEvent.click(exportButton());
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual({ format: 'mp4', durationMs: 30000, height: 2160, fps: 60 });
    expect(runtime.canEncode).toHaveBeenCalledWith('mp4', { width: 3840, height: 2160 }, 60);
    expect((save.mock.calls[0] as [Blob, string])[1]).toBe('Bounce.mp4');
  });

  it('a size the browser cannot encode is refused BEFORE counting', async () => {
    const runtime = stubRuntime();
    runtime.canEncode.mockResolvedValue(false);
    const { save } = mount({ plan: OPERATOR_PLAN, runtime });
    await settle();
    fireEvent.click(radio(/^WebM video/));
    fireEvent.click(exportButton());
    await waitFor(() => expect(status().textContent).toContain('cannot encode video'));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(runtime.run).not.toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
  });

  it('an unsafe document is refused BEFORE counting', async () => {
    const runtime = stubRuntime();
    runtime.check.mockReturnValue(['external reference']);
    mount({ runtime });
    await settle();
    fireEvent.click(radio(/^GIF/));
    fireEvent.click(exportButton());
    await waitFor(() => expect(status().textContent).toContain('external content'));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('PNG sequence downloads as <name>-frames.zip; translator deployments hide raster formats', () => {
    expect(rasterFileName('Bounce', 'png_sequence')).toBe('Bounce-frames.zip');
    expect(rasterFileName('', 'webm')).toBe('drawing.webm');
  });
});
