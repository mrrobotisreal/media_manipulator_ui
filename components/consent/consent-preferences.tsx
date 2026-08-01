'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  getConsentDetails,
  optOutOfSale,
  setConsent,
  type ConsentDetails,
} from '@/lib/consent';
import { analyticsBaseUrl, forgetIdentity, getVisitorId } from '@/lib/analytics';
import { getCurrentIdToken } from '@/lib/firebase';
import { useLocalization } from '@/i18n/useLocalization';

/**
 * The preferences centre.
 *
 * Reachable from the footer's "Cookie settings" and, in the US, from the "Do Not Sell or
 * Share My Personal Information" link that CPRA requires by that literal name. Unlike the
 * banner this IS a dialog: the visitor came here deliberately to change a setting, so taking
 * over the screen is what they asked for.
 *
 * THREE CATEGORIES, and each one's treatment is a decision rather than a default:
 *
 *   NECESSARY is locked on, and it says WHY in plain language rather than just being greyed
 *   out. It covers the theme preference and the visitor/session identifiers the main API uses
 *   for quota and abuse prevention — a strictly-necessary basis, which means it is not a
 *   consent question and pretending to offer a choice would be the dark pattern.
 *
 *   ANALYTICS is the real control, and the only one that does anything today.
 *
 *   ADVERTISING is VISIBLE but marked not-yet-active. Hiding it would be tidier and would
 *   also mean that on the day ads go live a category appears that nobody was ever shown.
 *   Showing it now — off, honest, and labelled — is what makes the Phase 12 transition
 *   uneventful. When GPC is present the toggle is disabled and says so, because the signal is
 *   binding and a click must not appear to override it.
 */

export interface ConsentPreferencesProps {
  onClose: () => void;
}

export function ConsentPreferences({ onClose }: ConsentPreferencesProps) {
  const { t } = useLocalization(['interface']);
  const [details, setDetails] = React.useState<ConsentDetails>(() => getConsentDetails());
  // Local, uncommitted state: nothing is applied until Save. A toggle that took effect
  // instantly would leave someone who opened this to read it having silently changed their
  // settings.
  const [analytics, setAnalytics] = React.useState(details.analytics === 'granted');

  const gpcActive = details.gpc;

  const save = () => {
    const next = setConsent({ analytics, mechanism: 'preferences' });
    setDetails(next);
    onClose();
  };

  const doNotSell = () => {
    const next = optOutOfSale();
    setDetails(next);
  };

  return (
    <Dialog open onOpenChange={(open) => (open ? undefined : onClose())}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{t('interface:consentPrefs.title')}</DialogTitle>
          <DialogDescription>{t('interface:consentPrefs.subtitle')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-1 divide-y divide-edge">
          {/* --- Necessary: locked on ------------------------------------- */}
          <CategoryRow
            title={t('interface:consentPrefs.necessary.title')}
            body={t('interface:consentPrefs.necessary.body')}
            control={
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                {t('interface:consentPrefs.necessary.always')}
              </span>
            }
          />

          {/* --- Analytics: the real control ------------------------------ */}
          <CategoryRow
            title={t('interface:consentPrefs.analytics.title')}
            body={t('interface:consentPrefs.analytics.body')}
            control={
              <Switch
                checked={analytics}
                onCheckedChange={setAnalytics}
                aria-label={t('interface:consentPrefs.analytics.title')}
              />
            }
          />

          {/* --- Advertising: visible, dormant --------------------------- */}
          <CategoryRow
            title={t('interface:consentPrefs.advertising.title')}
            body={
              gpcActive
                ? t('interface:consentPrefs.advertising.bodyGpc')
                : t('interface:consentPrefs.advertising.body')
            }
            badge={t('interface:consentPrefs.advertising.notActive')}
            control={
              <Switch
                checked={false}
                disabled
                aria-label={t('interface:consentPrefs.advertising.title')}
              />
            }
          />
        </div>

        {/* --- GPC status line ------------------------------------------- */}
        {gpcActive ? (
          <p className="rounded-md border border-edge bg-surface-2 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            {t('interface:consentPrefs.gpcDetected')}
          </p>
        ) : null}

        {/* --- Your data: DSR export + delete (Phase 10) ----------------- */}
        <YourDataSection />

        {/* --- CPRA opt-out --------------------------------------------- */}
        {details.regionGroup === 'us' ? (
          <div className="rounded-md border border-edge px-3 py-3">
            <h4 className="text-sm font-medium text-card-foreground">
              {t('interface:consentPrefs.doNotSell.title')}
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {t('interface:consentPrefs.doNotSell.body')}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={doNotSell}
              disabled={details.advertising === 'denied'}
            >
              {details.advertising === 'denied'
                ? t('interface:consentPrefs.doNotSell.done')
                : t('interface:consentPrefs.doNotSell.action')}
            </Button>
          </div>
        ) : null}

        <p className="text-xs text-muted-foreground">
          {t('interface:consentPrefs.policyPrefix')}{' '}
          <Link
            href="/privacy-policy"
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            {t('interface:consentPrefs.policyLink')}
          </Link>
        </p>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            {t('interface:consentPrefs.cancel')}
          </Button>
          <Button variant="outline" onClick={save}>
            {t('interface:consentPrefs.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * The "Your data" section — the self-serve half of Phase 10's DSR automation.
 *
 * Export POSTs to the analytics service's public /v1/dsr/export and hands the
 * JSON straight to the user as a download; nothing is stored anywhere on the
 * way. Delete demands a TYPED confirmation (a destructive legal action gets
 * the strongest affordance we have — a misclick must not be able to erase 13
 * months of someone's history), then calls forgetIdentity() so the browser
 * mints a fresh visitor id: without that reset, the very next event would
 * re-create the visitor row the server just erased.
 *
 * When the user is signed in, getCurrentIdToken() attaches their Firebase
 * token and the request becomes ACCOUNT-WIDE (every linked device) — the
 * server's person scope. Signed out, it covers this browser's visitor id.
 *
 * Analytics-never-throws applies here doubly: this UI lives inside the
 * consent dialog, and a crash here would take down the very surface people
 * use to exercise their rights.
 */
function YourDataSection() {
  const { t } = useLocalization(['interface']);
  const [busy, setBusy] = React.useState<'export' | 'delete' | null>(null);
  const [error, setError] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);
  const [confirmText, setConfirmText] = React.useState('');
  const [deleted, setDeleted] = React.useState<{ events: number; sessions: number } | null>(null);

  const exportData = async () => {
    setBusy('export');
    setError(false);
    try {
      const token = await getCurrentIdToken();
      const res = await fetch(`${analyticsBaseUrl()}/v1/dsr/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ visitor_id: getVisitorId() }),
      });
      if (!res.ok) throw new Error(`export ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      try {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'media-manipulator-my-data.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } finally {
        URL.revokeObjectURL(url);
      }
    } catch {
      setError(true);
    } finally {
      setBusy(null);
    }
  };

  const deleteData = async () => {
    setBusy('delete');
    setError(false);
    try {
      const token = await getCurrentIdToken();
      const res = await fetch(`${analyticsBaseUrl()}/v1/dsr/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ visitor_id: getVisitorId() }),
      });
      if (!res.ok) throw new Error(`delete ${res.status}`);
      const body = (await res.json()) as {
        deleted?: { events?: number; sessions?: number };
      };
      // The reset is what makes the erasure stick — see forgetIdentity().
      forgetIdentity();
      setDeleted({
        events: body.deleted?.events ?? 0,
        sessions: body.deleted?.sessions ?? 0,
      });
      setConfirming(false);
      setConfirmText('');
    } catch {
      setError(true);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="rounded-md border border-edge px-3 py-3">
      <h4 className="text-sm font-medium text-card-foreground">
        {t('interface:consentPrefs.yourData.title')}
      </h4>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {t('interface:consentPrefs.yourData.body')}
      </p>

      {deleted ? (
        <div className="mt-2 rounded-md border border-edge bg-surface-2 px-3 py-2">
          <p className="text-xs leading-relaxed text-card-foreground">
            {t('interface:consentPrefs.yourData.deletedSummary', {
              events: deleted.events,
              sessions: deleted.sessions,
            })}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {t('interface:consentPrefs.yourData.deletedNote')}
          </p>
        </div>
      ) : (
        <>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportData} disabled={busy !== null}>
              {busy === 'export'
                ? t('interface:consentPrefs.yourData.exporting')
                : t('interface:consentPrefs.yourData.export')}
            </Button>
            {!confirming ? (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive"
                onClick={() => {
                  setConfirming(true);
                  setError(false);
                }}
                disabled={busy !== null}
              >
                {t('interface:consentPrefs.yourData.delete')}
              </Button>
            ) : null}
          </div>

          {confirming ? (
            <div className="mt-2 rounded-md border border-edge bg-surface-2 px-3 py-2">
              <p className="text-xs leading-relaxed text-muted-foreground">
                {t('interface:consentPrefs.yourData.deleteConfirmBody')}
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(event) => setConfirmText(event.target.value)}
                placeholder={t('interface:consentPrefs.yourData.deleteConfirmPlaceholder')}
                className="mt-2 w-full rounded-md border border-edge bg-transparent px-2 py-1 text-xs text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                autoComplete="off"
                spellCheck={false}
              />
              <div className="mt-2 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  onClick={deleteData}
                  disabled={confirmText !== 'DELETE' || busy !== null}
                >
                  {busy === 'delete'
                    ? t('interface:consentPrefs.yourData.deleting')
                    : t('interface:consentPrefs.yourData.deleteConfirmAction')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setConfirming(false);
                    setConfirmText('');
                  }}
                  disabled={busy !== null}
                >
                  {t('interface:consentPrefs.cancel')}
                </Button>
              </div>
            </div>
          ) : null}
        </>
      )}

      {error ? (
        <p className="mt-2 text-xs leading-relaxed text-destructive">
          {t('interface:consentPrefs.yourData.error')}
        </p>
      ) : null}
    </div>
  );
}

function CategoryRow({
  title,
  body,
  control,
  badge,
}: {
  title: string;
  body: string;
  control: React.ReactNode;
  badge?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-card-foreground">{title}</h4>
          {badge ? (
            <span className="rounded-full border border-edge px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {badge}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
      </div>
      <div className="shrink-0 pt-0.5">{control}</div>
    </div>
  );
}

export default ConsentPreferences;
