/**
 * Translator dev events (MM52 decision 10, design §2.14).
 *
 * Translator deployments run with analytics OFF, so workbench events never go
 * through `lib/analytics/events.ts` and are not in the analytics catalog. They
 * go to the console and to an in-memory ring buffer the panel's dev event
 * inspector (MM53) reads. Names are plain strings here on purpose: the
 * "no inline event names" lint guards `analytics.track`, which this never calls.
 */
export interface TranslatorDevEvent {
  name: string;
  props: Record<string, unknown>;
  at: number;
}

export const DEV_EVENT_BUFFER_SIZE = 200;

const buffer: TranslatorDevEvent[] = [];
const listeners = new Set<(event: TranslatorDevEvent) => void>();

export function emitTranslatorEvent(name: string, props: Record<string, unknown> = {}): TranslatorDevEvent {
  const event: TranslatorDevEvent = { name, props, at: Date.now() };
  buffer.push(event);
  if (buffer.length > DEV_EVENT_BUFFER_SIZE) buffer.splice(0, buffer.length - DEV_EVENT_BUFFER_SIZE);
  if (process.env.NODE_ENV !== 'test') console.info(`[translator] ${name}`, props);
  for (const l of listeners) {
    try {
      l(event);
    } catch {
      // A broken inspector must never break the page.
    }
  }
  return event;
}

/** Oldest first. */
export function getTranslatorEvents(): TranslatorDevEvent[] {
  return [...buffer];
}

export function onTranslatorEvent(listener: (event: TranslatorDevEvent) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function clearTranslatorEvents(): void {
  buffer.length = 0;
}
