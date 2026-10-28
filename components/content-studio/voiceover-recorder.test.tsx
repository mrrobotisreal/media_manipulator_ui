import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

// MM78: behaviour snapshot of the Darkroom voiceover recorder, written BEFORE the
// MediaRecorder plumbing moved into components/audio-recorder.tsx, so the refactor is
// proven not to change what the editor does.

const upload = vi.hoisted(() => vi.fn());
const place = vi.hoisted(() => vi.fn());
const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));

vi.mock('@/i18n/useLocalization', () => ({ useLocalization: () => ({ t: (k: string) => k }) }));
vi.mock('sonner', () => ({ toast }));
vi.mock('@/lib/useStudioAsset', () => ({ useUploadStudioAsset: () => ({ uploadAsync: upload }) }));
vi.mock('@/lib/analytics', () => ({ analytics: { track: vi.fn() }, EVENTS: {}, fileSizeBucket: () => 'small' }));
vi.mock('@/lib/studio/telemetry', () => ({ editSummary: { increment: vi.fn() }, studioHost: () => 'mm' }));
vi.mock('@/lib/studioStore', () => {
  const state = {
    playhead: 4.5,
    assets: { a1: { status: 'ready', asset: { id: 'a1', originalFileName: 'Voiceover 1.webm' } } } as Record<string, unknown>,
    placeAssetAtPlayhead: place,
  };
  return { useStudioStore: Object.assign(() => state, { getState: () => state, subscribe: () => () => undefined }) };
});

import VoiceoverRecorder from './voiceover-recorder';

class FakeRecorder {
  static instances: FakeRecorder[] = [];
  static isTypeSupported = (m: string) => m === 'audio/webm;codecs=opus';
  state: 'inactive' | 'recording' = 'inactive';
  mimeType: string;
  ondataavailable: ((e: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  constructor(_stream: unknown, opts?: { mimeType?: string }) {
    this.mimeType = opts?.mimeType ?? '';
    FakeRecorder.instances.push(this);
  }
  start() {
    this.state = 'recording';
  }
  stop() {
    this.state = 'inactive';
    this.ondataavailable?.({ data: new Blob(['abc'], { type: 'audio/webm' }) });
    this.onstop?.();
  }
}

const trackStop = vi.fn();
const getUserMedia = vi.fn();

beforeEach(() => {
  FakeRecorder.instances = [];
  vi.stubGlobal('MediaRecorder', FakeRecorder);
  getUserMedia.mockReset().mockResolvedValue({ getTracks: () => [{ stop: trackStop }] });
  Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia } });
  upload.mockReset().mockResolvedValue({ asset: { id: 'a1' } });
  place.mockReset();
  toast.success.mockReset();
  toast.error.mockReset();
  trackStop.mockReset();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('VoiceoverRecorder (behaviour kept through the MM78 refactor)', () => {
  it('records, uploads "Voiceover N.webm" and places it at the playhead where recording began', async () => {
    render(<VoiceoverRecorder projectId="p1" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'contentStudio.mediaBin.voiceover' }));
    });
    expect(getUserMedia).toHaveBeenCalledWith({ audio: true });
    expect(FakeRecorder.instances[0].mimeType).toBe('audio/webm;codecs=opus');
    expect(screen.getByRole('status', { name: 'contentStudio.mediaBin.voiceoverRecording' })).toBeTruthy();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'contentStudio.mediaBin.voiceoverStop' }));
    });
    await waitFor(() => expect(place).toHaveBeenCalledWith('a1', 4.5));
    const file = upload.mock.calls[0][0] as File;
    expect(file.name).toBe('Voiceover 2.webm');
    expect(file.type).toBe('audio/webm');
    expect(trackStop).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('contentStudio.mediaBin.voiceoverPlaced');
    // Back to the idle mic button.
    expect(screen.getByRole('button', { name: 'contentStudio.mediaBin.voiceover' })).toBeTruthy();
  });

  it('cancel discards the take: nothing is uploaded and the mic is released', async () => {
    render(<VoiceoverRecorder projectId="p1" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'contentStudio.mediaBin.voiceover' }));
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'contentStudio.mediaBin.voiceoverCancel' }));
    });
    expect(upload).not.toHaveBeenCalled();
    expect(trackStop).toHaveBeenCalled();
  });

  it('a denied microphone shows the denied toast and records nothing', async () => {
    getUserMedia.mockRejectedValue(Object.assign(new Error('no'), { name: 'NotAllowedError' }));
    render(<VoiceoverRecorder projectId="p1" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'contentStudio.mediaBin.voiceover' }));
    });
    expect(toast.error).toHaveBeenCalledWith('contentStudio.mediaBin.micDenied');
    expect(FakeRecorder.instances).toHaveLength(0);
  });

  it('no MediaRecorder in the browser: the unavailable toast, no permission prompt', async () => {
    vi.stubGlobal('MediaRecorder', undefined);
    render(<VoiceoverRecorder projectId="p1" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'contentStudio.mediaBin.voiceover' }));
    });
    expect(toast.error).toHaveBeenCalledWith('contentStudio.mediaBin.micUnavailable');
    expect(getUserMedia).not.toHaveBeenCalled();
  });
});
