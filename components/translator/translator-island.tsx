'use client';

/**
 * The translator-only client island (MM53 decision 1, 2; design §2.8).
 *
 * TRANSLATOR DEPLOYMENTS ONLY. `app/providers.tsx` reaches it solely through
 * `loadTranslatorWorkbench()` in `lib/translator/mode.ts`, behind the literal
 * NEXT_PUBLIC_DEPLOY_ROLE guard, so production builds contain none of it
 * (`npm run check:no-translator`).
 *
 * Gate -> what renders:
 *   allowed       the workbench (shards load, scanner starts, drafts re-apply)
 *   unverified    the "Verify your email" notice (shared VerifyNotice)
 *   signed_out    one small floating "Sign in to translate" button (proposed)
 *   anything else nothing: the plain site, no panel, no hint
 */
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { I18nContext } from 'react-i18next';

import { VerifyNotice } from '@/components/account/verify-notice';
import { getLocaleDef, localizeHref, stripLocalePrefix } from '@/i18n/locales';
import { useAuth, type AuthContextValue } from '@/lib/auth/AuthProvider';
import { createHttpTranslatorApi, type TranslatorApi } from '@/lib/translator/api';
import { CHROME } from '@/lib/translator/chromeCopy';
import type { I18nLike } from '@/lib/translator/liveEdit';
import { translatorLocale } from '@/lib/translator/mode';
import { useTranslatorGate, type GateCache } from '@/lib/translator/useTranslatorGate';
import {
  heldWorkbenchSession,
  holdWorkbenchSession,
  releaseWorkbenchSession,
  startWorkbenchSession,
  type StartWorkbenchSessionOptions,
  type WorkbenchSession,
} from '@/lib/translator/workbenchSession';
import { cn } from '@/lib/utils';
import { WorkbenchPanel, type WorkbenchPanelProps } from './workbench-panel';

type AuthLike = Pick<AuthContextValue, 'loading' | 'user' | 'emailVerified' | 'openAuth'>;

export interface TranslatorIslandProps {
  /** Test seams; the deployment uses the defaults. */
  api?: TranslatorApi;
  /** MM56 `/me` cache (default sessionStorage); `null` disables it. */
  gateCache?: GateCache | null;
  /** MM56: the current pathname (default `usePathname()`); a change re-scans the page. */
  pathname?: string | null;
  auth?: AuthLike | null;
  locale?: string | null;
  i18n?: I18nLike | null;
  startSession?: (options: StartWorkbenchSessionOptions) => Promise<WorkbenchSession>;
  panelProps?: Partial<WorkbenchPanelProps>;
}

export default function TranslatorIsland(props: TranslatorIslandProps) {
  const contextAuth = useAuth();
  const auth = props.auth !== undefined ? props.auth : contextAuth;
  const i18nContext = React.useContext(I18nContext) as { i18n?: I18nLike } | undefined;
  const i18n = props.i18n !== undefined ? props.i18n : (i18nContext?.i18n ?? null);
  const locale = props.locale !== undefined ? props.locale : translatorLocale();
  const api = React.useMemo(() => props.api ?? createHttpTranslatorApi(), [props.api]);
  const user = auth?.user ?? null;
  const getIdToken = React.useCallback(async () => (user ? user.getIdToken() : null), [user]);
  const gateAuth = auth ? { loading: auth.loading, user: auth.user, emailVerified: auth.emailVerified } : null;
  const { state, recheck } = useTranslatorGate({ api, auth: gateAuth, locale, getIdToken, cache: props.gateCache });
  const dir = (locale && getLocaleDef(locale)?.dir) || 'ltr';
  const side = dir === 'rtl' ? 'left' : 'right';

  // MM56: the session outlives this mount (see `holdWorkbenchSession`); a settled
  // refusal (signed out, denied, unverified) ends it. `loading` keeps it.
  const refused = state.kind === 'denied' || state.kind === 'signed_out' || state.kind === 'unverified';
  React.useEffect(() => {
    if (refused) releaseWorkbenchSession();
  }, [refused]);

  if (!locale) return null;
  switch (state.kind) {
    case 'allowed':
      return (
        <WorkbenchHost
          locale={locale}
          dir={dir}
          api={api}
          i18n={i18n}
          getIdToken={getIdToken}
          startSession={props.startSession ?? startWorkbenchSession}
          panelProps={props.panelProps}
          pathname={props.pathname}
        />
      );
    case 'unverified':
      return (
        <div
          data-translator-ui=""
          data-translator-verify=""
          className={cn('fixed bottom-4 z-[2147483645] w-[min(24rem,calc(100vw-2rem))]', side === 'right' ? 'right-4' : 'left-4')}
          dir="ltr"
          lang="en"
        >
          <VerifyNotice labels={CHROME.verify} onVerified={recheck} className="border-premium/40 bg-background shadow-xl" />
        </div>
      );
    case 'signed_out':
      return (
        <button
          type="button"
          data-translator-ui=""
          data-translator-signin=""
          onClick={() => auth?.openAuth({ intent: 'signin', source: 'translator_workbench' })}
          className={cn(
            'fixed bottom-4 z-[2147483645] rounded-full border border-border bg-background/90 px-3 py-1.5 text-xs text-muted-foreground shadow-md backdrop-blur',
            'hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
            side === 'right' ? 'right-4' : 'left-4',
          )}
          lang="en"
        >
          {CHROME.signIn}
        </button>
      );
    default:
      return null;
  }
}

function WorkbenchHost({
  locale,
  dir,
  api,
  i18n,
  getIdToken,
  startSession,
  panelProps,
  pathname: pathnameProp,
}: {
  locale: string;
  dir: 'ltr' | 'rtl';
  api: TranslatorApi;
  i18n: I18nLike | null;
  getIdToken: () => Promise<string | null>;
  startSession: (options: StartWorkbenchSessionOptions) => Promise<WorkbenchSession>;
  panelProps?: Partial<WorkbenchPanelProps>;
  pathname?: string | null;
}) {
  // MM56: a remount (the `[lang]` layout changed) finds the page's session already
  // running and renders the panel in the same commit, with no loading flash.
  const [session, setSession] = React.useState<WorkbenchSession | null>(() => heldWorkbenchSession(locale));
  const [failed, setFailed] = React.useState(false);
  const tokenRef = React.useRef(getIdToken);
  React.useEffect(() => {
    tokenRef.current = getIdToken;
  }, [getIdToken]);
  const i18nRef = React.useRef(i18n);

  React.useEffect(() => {
    let cancelled = false;
    holdWorkbenchSession({ locale, i18n: i18nRef.current, api, getIdToken: () => tokenRef.current() }, startSession)
      .then((s) => {
        if (!cancelled) setSession(s);
      })
      .catch((error) => {
        console.error('[translator] workbench failed to start', error);
        if (!cancelled) setFailed(true);
      });
    // Unmounting does NOT dispose: the next mount (same page) reuses the session.
    return () => {
      cancelled = true;
    };
  }, [api, locale, startSession]);

  // MM56 defect 3: re-scan after every client navigation (and after a remount),
  // so "This page" lists the new page without a language toggle.
  const routerPath = usePathname();
  const pathname = pathnameProp !== undefined ? pathnameProp : routerPath;
  React.useEffect(() => {
    if (!session) return;
    // A macrotask after the commit, so the new page's nodes are in the DOM.
    const timer = setTimeout(() => session.rescan(), 0);
    return () => clearTimeout(timer);
  }, [session, pathname]);

  // Client-only island (ssr: false), so reading the location at render is safe.
  const localizedHref = session ? localizeHref(stripLocalePrefix(window.location.pathname), locale) : undefined;

  if (!session) {
    return (
      <p
        data-translator-ui=""
        role="status"
        lang="en"
        dir="ltr"
        className={cn(
          'fixed bottom-4 z-[2147483645] rounded-md border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground shadow-md',
          dir === 'rtl' ? 'left-4' : 'right-4',
        )}
      >
        {failed ? CHROME.loadFailed : CHROME.loading}
      </p>
    );
  }
  return (
    <WorkbenchPanel
      model={session.model}
      controller={session.controller}
      dir={dir}
      lang={locale}
      localizedHref={localizedHref}
      {...panelProps}
    />
  );
}
