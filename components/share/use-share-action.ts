'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { analytics, EVENTS } from '@/lib/analytics';
import { copyText } from '@/lib/results/clipboard';
import type { ResultKind } from '@/lib/results/describe';
import { createShareLink, revokeShareLinks, ShareError, shareJobKind, type ShareErrorCode } from '@/lib/share/shareApi';

/** Every user-facing string the share action needs (supplied by the caller's i18n source). */
export interface ShareMessages {
  /** Toast after a successful copy; `{{when}}` is the formatted expiry. */
  copied: (when: string) => string;
  /** Toast when the clipboard was refused: the URL is shown so it can be copied by hand. */
  copyManually: (url: string) => string;
  notAllowed: string;
  expired: string;
  limit: string;
  signIn: string;
  failed: string;
  revoked: () => string;
  revokeNone: string;
  revokeFailed: string;
}

export interface ShareActionArgs {
  jobId: string;
  kind: ResultKind;
  /** Analytics `source`: the surface the click came from. */
  source: 'result_panel' | 'history';
  messages: ShareMessages;
  formatExpiry: (iso: string) => string;
  /** Called after a revoke succeeded (the history tab refetches). */
  onRevoked?: () => void;
}

/** Maps an API failure to the message shown for it (unit-tested). */
export function shareErrorMessage(code: ShareErrorCode, m: ShareMessages): string {
  switch (code) {
    case 'not_allowed':
      return m.notAllowed;
    case 'unavailable':
      return m.expired;
    case 'limit':
      return m.limit;
    case 'unauthorized':
      return m.signIn;
    default:
      return m.failed;
  }
}

/**
 * Create / revoke for one job. Create is NOT idempotent (each click mints a new link and the
 * plaintext token is only ever returned once), so nothing here caches or re-shows a link.
 */
export function useShareAction({ jobId, kind, source, messages, formatExpiry, onRevoked }: ShareActionArgs) {
  const [busy, setBusy] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [limitOpen, setLimitOpen] = useState(false);

  const share = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      const created = await createShareLink(jobId);
      const copied = await copyText(created.url);
      if (copied) {
        toast.success(messages.copied(formatExpiry(created.expiresAt)));
        analytics.track(
          EVENTS.SHARE_LINK_COPIED,
          { job_kind: shareJobKind(kind), source },
          { job_id: jobId },
        );
      } else {
        toast.message(messages.copyManually(created.url), { duration: 20_000 });
      }
    } catch (error) {
      const code = error instanceof ShareError ? error.code : 'unknown';
      if (code === 'limit') setLimitOpen(true);
      else toast.error(shareErrorMessage(code, messages));
    } finally {
      setBusy(false);
    }
  }, [busy, formatExpiry, jobId, kind, messages, source]);

  const revoke = useCallback(async () => {
    setRevoking(true);
    try {
      const n = await revokeShareLinks(jobId);
      toast.success(n > 0 ? messages.revoked() : messages.revokeNone);
      setLimitOpen(false);
      onRevoked?.();
    } catch {
      toast.error(messages.revokeFailed);
    } finally {
      setRevoking(false);
    }
  }, [jobId, messages, onRevoked]);

  return { share, revoke, busy, revoking, limitOpen, setLimitOpen };
}
