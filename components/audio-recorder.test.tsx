import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';

import { AudioRecorder, canRecordAudio } from './audio-recorder';

class FakeRecorder {
  static instances: FakeRecorder[] = [];
  static isTypeSupported = (m: string) => m === 'audio/mp4';
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
    this.ondataavailable?.({ data: new Blob(['abc'], { type: 'audio/mp4' }) });
    this.onstop?.();
  }
}

const labels = { record: 'Record', recording: 'Recording', stop: 'Stop', cancel: 'Cancel', level: 'Level' };
const getUserMedia = vi.fn();
const trackStop = vi.fn();

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'Date'] });
  FakeRecorder.instances = [];
  vi.stubGlobal('MediaRecorder', FakeRecorder);
  getUserMedia.mockReset().mockResolvedValue({ getTracks: () => [{ stop: trackStop }] });
  trackStop.mockReset();
  Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia } });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('AudioRecorder (shared, MM78)', () => {
  it('picks a supported mime (Safari mp4) and hands back the blob with its length', async () => {
    const onRecorded = vi.fn();
    render(<AudioRecorder labels={labels} onRecorded={onRecorded} onError={vi.fn()} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Record' }));
    });
    expect(FakeRecorder.instances[0].mimeType).toBe('audio/mp4');
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    expect(screen.getByTestId('recorder-elapsed').textContent).toContain('0:07');
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Stop' }));
    });
    expect(onRecorded).toHaveBeenCalledTimes(1);
    const take = onRecorded.mock.calls[0][0];
    expect(take.blob.type).toBe('audio/mp4');
    expect(take.durationMs).toBeGreaterThanOrEqual(7000);
    expect(trackStop).toHaveBeenCalled();
  });

  it('stops by itself at maxMs (the 60 s voices ceiling)', async () => {
    const onRecorded = vi.fn();
    render(<AudioRecorder labels={labels} onRecorded={onRecorded} onError={vi.fn()} maxMs={60_000} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Record' }));
    });
    act(() => {
      vi.advanceTimersByTime(60_250);
    });
    expect(onRecorded).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Record' })).toBeTruthy();
  });

  it('cancel hands back nothing', async () => {
    const onRecorded = vi.fn();
    render(<AudioRecorder labels={labels} onRecorded={onRecorded} onError={vi.fn()} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Record' }));
    });
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    });
    expect(onRecorded).not.toHaveBeenCalled();
  });

  it('reports unavailable without MediaRecorder, so callers fall back to upload', async () => {
    vi.stubGlobal('MediaRecorder', undefined);
    expect(canRecordAudio()).toBe(false);
    const onError = vi.fn();
    render(<AudioRecorder labels={labels} onRecorded={vi.fn()} onError={onError} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Record' }));
    });
    expect(onError).toHaveBeenCalledWith('unavailable');
    expect(getUserMedia).not.toHaveBeenCalled();
  });
});
