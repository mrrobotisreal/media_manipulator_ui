// Tracks when the user last opened the Threads view, so the sidebar can show an
// activity dot when a newer reply has arrived since. Persisted in localStorage
// and broadcast via a window event so the sidebar reacts immediately.

const KEY = 'dr:feedback:threadsSeenAt';
const EVENT = 'dr-threads-seen';

export function markThreadsSeen(): void {
  try {
    localStorage.setItem(KEY, new Date().toISOString());
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // localStorage unavailable (private mode) — the dot just won't clear; harmless.
  }
}

export function getThreadsSeen(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export const THREADS_SEEN_EVENT = EVENT;
