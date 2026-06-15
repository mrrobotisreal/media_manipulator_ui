'use client';

import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { getBaseURL } from '@/lib/utils';
import { getSessionId } from '@/lib/firstPartyAnalytics';
import type { StudioCaptionCue } from '@/lib/studioTypes';

const generateResponseSchema = z.object({ jobId: z.string() });

/**
 * useGenerateCaptions kicks off whisper transcription of the project's
 * timeline-aligned audio mix. Returns a jobId; the caller watches it and
 * refetches the project on completion (the server writes the cues).
 */
export function useGenerateCaptions(projectId: string | null) {
  const mutation = useMutation({
    mutationFn: async (language?: string): Promise<{ jobId: string }> => {
      if (!projectId) throw new Error('No active project');
      const res = await fetch(`${getBaseURL()}/studio/projects/${projectId}/captions/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-MM-Session-ID': getSessionId() },
        body: JSON.stringify({ language: language || undefined }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || res.statusText);
      }
      return generateResponseSchema.parse(await res.json());
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
