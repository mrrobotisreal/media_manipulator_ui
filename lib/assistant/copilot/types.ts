/**
 * MM108: the editor-agnostic copilot contract (design MEDI_ASSISTANT.md §5.2, §8.3).
 *
 * Each editor (Aperture now; Darkroom MM109, Motion MM110) implements one `CopilotAdapter`;
 * `useCopilot` and `CopilotPanel` know nothing about any document. The adapter owns every
 * document rule: it validates the ops against its own schema, applies them all-or-nothing
 * through the editor's pure ops and records exactly ONE undo entry, and it can undo exactly that
 * entry. Nothing the model says reaches the document by any other path.
 */
import type { AssistantActionKind } from '@/schemas/assistant';

export type CopilotSurface = 'photo' | 'studio' | 'vector';

export type CopilotRejectReason = 'validation' | 'unknown_id' | 'locked';

/** Opaque handle of an applied edit; `undo` only acts while the edit is still the latest step. */
export interface CopilotEditToken {
  readonly id: number;
}

export type CopilotApplyResult =
  /** `changes`: the "what I changed" lines, localized from templated keys (never model text). */
  | { ok: true; token: CopilotEditToken; opCount: number; opKinds: string[]; changes: string[] }
  | { ok: false; reason: CopilotRejectReason; errors: string[] };

export interface CopilotAdapter {
  surface: CopilotSurface;
  /** The open document as compact text (≤ ~4k tokens, deterministic). */
  digest(): string;
  /** The current preview as a ≤ 1024 px JPEG, or null (no frame is sent). */
  captureFrame(): Promise<Blob | null>;
  /** The server project id the conversation belongs to (null for a guest/local document). */
  projectId(): string | null;
  /** Validate and apply `ops` all-or-nothing as ONE undo entry labelled with `summary`. */
  apply(summary: string, ops: unknown): CopilotApplyResult;
  /** Undo that edit (true) when it is still the latest step; otherwise leave the history alone (false). */
  undo(token: CopilotEditToken): boolean;
  /** Whether `undo(token)` would act right now (the Undo chip hides when the user moved on). */
  canUndo(token: CopilotEditToken): boolean;
  /** Handlers for the suggested actions this editor supports (each spends nothing until clicked). */
  suggest: Partial<Record<AssistantActionKind, (params: Record<string, unknown>) => void | Promise<void>>>;
  /** Attach a frame to new messages when the preview toggle is on (Aperture, Darkroom: yes; Motion: verify only). */
  frameOnMessage: boolean;
  /**
   * MM109 (optional): whether an applied op list changed what the preview shows, so the verify
   * loop sends an after-frame. Absent = every applied edit is visual (Aperture).
   */
  isVisual?: (ops: unknown) => boolean;
}
