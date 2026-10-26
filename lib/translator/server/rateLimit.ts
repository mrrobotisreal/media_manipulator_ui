/**
 * Per-user submit rate limit (MM54 decision 6f; design §2.14).
 *
 * In memory, per function instance: best-effort by design (a cold start or a
 * second instance resets it; a persistent limiter is out of scope). One
 * SUCCESSFUL submit per uid per window; a submit already in flight for the uid
 * also refuses, so two parallel requests cannot both open PRs. Failed submits
 * (409, 422, GitHub errors) do not consume the window, so the translator can fix
 * and retry at once. Dry runs have their own, looser budget (reads only).
 */
export interface SubmitLimiter {
  /** Seconds to wait, or 0 when the uid may submit now. */
  retryAfter(uid: string): number;
  /** Marks a submit in flight; returns false when one already is. */
  begin(uid: string): boolean;
  /** Ends the in-flight mark; `succeeded` starts the window. */
  end(uid: string, succeeded: boolean): void;
  /** Dry-run budget: true when allowed (and counts it). */
  allowDryRun(uid: string): boolean;
}

export function createSubmitLimiter(options: {
  windowMs: number;
  dryRunsPerWindow?: number;
  now?: () => number;
}): SubmitLimiter {
  const now = options.now ?? Date.now;
  const lastSuccess = new Map<string, number>();
  const inFlight = new Set<string>();
  const dryRuns = new Map<string, number[]>();
  const dryRunMax = options.dryRunsPerWindow ?? 60;
  const prune = () => {
    const t = now();
    for (const [uid, at] of lastSuccess) if (t - at >= options.windowMs) lastSuccess.delete(uid);
  };
  return {
    retryAfter(uid) {
      prune();
      if (inFlight.has(uid)) return 30;
      const at = lastSuccess.get(uid);
      if (at === undefined) return 0;
      return Math.max(1, Math.ceil((options.windowMs - (now() - at)) / 1000));
    },
    begin(uid) {
      if (inFlight.has(uid)) return false;
      inFlight.add(uid);
      return true;
    },
    end(uid, succeeded) {
      inFlight.delete(uid);
      if (succeeded) lastSuccess.set(uid, now());
    },
    allowDryRun(uid) {
      const t = now();
      const recent = (dryRuns.get(uid) ?? []).filter((at) => t - at < options.windowMs);
      if (recent.length >= dryRunMax) {
        dryRuns.set(uid, recent);
        return false;
      }
      recent.push(t);
      dryRuns.set(uid, recent);
      return true;
    },
  };
}
