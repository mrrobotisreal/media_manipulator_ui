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
import { I18nContext } from 'react-i18next';

import { VerifyNotice } from '@/components/account/verify-notice';
import { getLocaleDef, localizeHref, stripLocalePrefix } from '@/i18n/locales';
import { useAuth, type AuthContextValue } from '@/lib/auth/AuthProvider';
import { createHttpTranslatorApi, type TranslatorApi } from '@/lib/translator/api';
import { CHROME } from '@/lib/translator/chromeCopy';
import type { I18nLike } from '@/lib/translator/liveEdit';
import { translatorLocale } from '@/lib/translator/mode';
import { useTranslatorGate } from '@/lib/translator/useTranslatorGate';
import {
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
  const { state, recheck } = useTranslatorGate({ api, auth: gateAuth, locale, getIdToken });
  const dir = (locale && getLocaleDef(locale)?.dir) || 'ltr';
  const side = dir === 'rtl' ? 'left' : 'right';

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
}: {
  locale: string;
  dir: 'ltr' | 'rtl';
  api: TranslatorApi;
  i18n: I18nLike | null;
  getIdToken: () => Promise<string | null>;
  startSession: (options: StartWorkbenchSessionOptions) => Promise<WorkbenchSession>;
  panelProps?: Partial<WorkbenchPanelProps>;
}) {
  const [session, setSession] = React.useState<WorkbenchSession | null>(null);
  const [failed, setFailed] = React.useState(false);
  const tokenRef = React.useRef(getIdToken);
  React.useEffect(() => {
    tokenRef.current = getIdToken;
  }, [getIdToken]);
  const i18nRef = React.useRef(i18n);

  React.useEffect(() => {
    let cancelled = false;
    let started: WorkbenchSession | null = null;
    startSession({ locale, i18n: i18nRef.current, api, getIdToken: () => tokenRef.current() })
      .then((s) => {
        if (cancelled) s.dispose();
        else {
          started = s;
          setSession(s);
        }
      })
      .catch((error) => {
        console.error('[translator] workbench failed to start', error);
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      started?.dispose();
    };
  }, [api, locale, startSession]);

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
