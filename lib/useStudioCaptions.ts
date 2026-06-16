'use client';

import { useMutation } from '@tanstack/react-query';
import type { StudioCaptionCue } from '@/lib/studioTypes';
import { useStudioBackend } from '@/lib/studio/studioBackendProvider';

/**
 * useGenerateCaptions kicks off whisper transcription of the project's
 * timeline-aligned audio mix. Returns a jobId; the caller watches it and
 * refetches the project on completion (the server writes the cues). Gated by
 * backend.capabilities.captions — the Darkroom backend has no captions route.
 */
export function useGenerateCaptions(projectId: string | null) {
  const backend = useStudioBackend();
  const mutation = useMutation({
    mutationFn: async (language?: string): Promise<{ jobId: string }> => {
      if (!projectId) throw new Error('No active project');
      const res = await backend.fetch(backend.path(`/projects/${projectId}/captions/generate`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...backend.authHeaders() },
        body: JSON.stringify(backend.adaptCaptionsGenerate(language)),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || res.statusText);
      }
      return backend.parseExport(await res.json());
    },
  });
  return { generate: mutation.mutateAsync, isGenerating: mutation.isPending };
}

function pad(n: number, width = 2): string {
  return Math.floor(n).toString().padStart(width, '0');
}

function timecode(seconds: number, msSep: ',' | '.'): string {
  const s = Math.max(0, seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const ms = Math.round((s - Math.floor(s)) * 1000);
  return `${pad(h)}:${pad(m)}:${pad(sec)}${msSep}${pad(ms, 3)}`;
}

const sortedCues = (cues: StudioCaptionCue[]): StudioCaptionCue[] =>
  [...cues].sort((a, b) => a.startSeconds - b.startSeconds);

export function serializeSRT(cues: StudioCaptionCue[]): string {
  return sortedCues(cues)
    .map((c, i) => `${i + 1}\n${timecode(c.startSeconds, ',')} --> ${timecode(c.endSeconds, ',')}\n${c.text}\n`)
    .join('\n');
}

export function serializeVTT(cues: StudioCaptionCue[]): string {
  const body = sortedCues(cues)
    .map((c) => `${timecode(c.startSeconds, '.')} --> ${timecode(c.endSeconds, '.')}\n${c.text}`)
    .join('\n\n');
  return `WEBVTT\n\n${body}\n`;
}

export function downloadText(filename: string, text: string, mime = 'text/plain'): void {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
