import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { getBaseURL } from '@/lib/utils';
import { trackFirstPartyError, trackFirstPartyEvent } from '@/lib/firstPartyAnalytics';

/**
 * useStitchAudioToVideoTool POSTs a base video together with up to a small
 * number of additional audio files and their per-track volume + offset
 * settings to /api/tools/stitch-audio-to-video. Each audio file is uploaded
 * as a separate part named "audio_0", "audio_1", "audio_2" — matching the
 * backend handler's expected form layout.
 */

export type StitchMode = 'mix' | 'replace';

export interface StitchAudioTrackInput {
  file: File;
  /** Volume scalar 0..4 (1 = unchanged). */
  volume: number;
  /** Start offset in seconds relative to the start of the video. */
  offsetSeconds: number;
  /** Loop short backing tracks until the end of the video. */
  loop: boolean;
}

export interface StitchAudioFormData {
  mode: StitchMode;
  trimToVideoDuration: boolean;
  tracks: StitchAudioTrackInput[];
}

export interface StitchAudioResponse {
  jobId: string;
}

const submitStitchJob = async (
  video: File,
  data: StitchAudioFormData,
  setProgress: (n: number) => void,
): Promise<StitchAudioResponse> => {
  const formData = new FormData();
  formData.append('video', video);
  formData.append('mode', data.mode);
  formData.append('trimToVideoDuration', data.trimToVideoDuration ? 'true' : 'false');
  formData.append('trackCount', String(data.tracks.length));
  data.tracks.forEach((track, i) => {
    formData.append(`audio_${i}`, track.file);
    formData.append(`volume_${i}`, String(track.volume));
    formData.append(`offset_${i}`, String(track.offsetSeconds));
    formData.append(`loop_${i}`, track.loop ? 'true' : 'false');
  });
  setProgress(10);
  const response = await fetch(`${getBaseURL()}/tools/stitch-audio-to-video`, {
    method: 'POST',
    body: formData,
  });
  setProgress(80);
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Stitch request failed: ${response.status} ${text || response.statusText}`);
  }
  setProgress(100);
  return response.json();
};

interface UseStitchAudioReturns {
  mutate: (input: { video: File; options: StitchAudioFormData }) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  uploadProgress: number;
}

const useStitchAudioToVideoTool = (
  onSuccess: (res: StitchAudioResponse) => void,
): UseStitchAudioReturns => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: ({ video, options }: { video: File; options: StitchAudioFormData }) =>
      submitStitchJob(video, options, setUploadProgress),
    onSuccess: (data, variables) => {
      toast.success('Stitch job started', {
        description: `Job ID: ${data.jobId}`,
      });
      trackFirstPartyEvent('stitch_audio_to_video_started', {
        track_count: variables.options.tracks.length,
        stitch_mode: variables.options.mode,
        size_bytes: variables.video.size,
      }, {
        mediaKind: 'video',
        conversionJobId: data.jobId,
        featureName: 'stitch_audio_to_video',
      });
      onSuccess(data);
    },
    onError: (error, variables) => {
      console.error('Stitch audio submission failed:', error);
      trackFirstPartyError('stitch_audio_upload', error, {
        track_count: variables.options.tracks.length,
      }, {
        mediaKind: 'video',
        featureName: 'stitch_audio_to_video',
      });
      toast.error('Failed to start stitch job', {
        description: error.message || 'An unexpected error occurred',
      });
    },
  });

  return {
    mutate: (input) => mutation.mutate(input),
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    uploadProgress,
  };
};

export default useStitchAudioToVideoTool;
