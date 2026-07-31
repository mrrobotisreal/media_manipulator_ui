'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Trans } from 'react-i18next';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  dialogWidthWide,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlanSummary } from '@/components/account/plan-summary';
import { fetchTiers, type TierDescriptor } from '@/lib/auth/accountApi';
import { useAuth } from '@/lib/auth/AuthProvider';
import { EVENTS, useAnalytics } from '@/lib/analytics';
import { useLocalization } from '@/i18n/useLocalization';
import { cn } from '@/lib/utils';

/**
 * The account panel.
 *
 * Opened from the quota meter, from the nav, and — the moment that matters —
 * from a 429, where it arrives already explaining what just happened and what
 * a free account would have allowed. §4.9's tone target is Linear, not a mobile
 * game: no countdown, no interstitial, dismissible always, and every number in
 * it comes from GET /api/tiers rather than from copy that can go stale.
 *
 * Mounted only while open (AuthProvider renders it behind next/dynamic), so
 * none of this is in anyone's first load.
 */
export const AuthModal: React.FC = () => {
  const auth = useAuth();
  const { track } = useAnalytics();
  const { t } = useLocalization(['interface', 'error']);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(
    auth?.prompt.intent ?? 'signup',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const source = auth?.prompt.source ?? 'unknown';

  // The tier matrix is cacheable configuration, identical for every caller, so
  // one fetch per session is plenty.
  const tiersQuery = useQuery({
    queryKey: ['tiers'],
    queryFn: ({ signal }) => fetchTiers(signal),
    staleTime: 5 * 60_000,
    retry: 1,
  });
  const byTier = React.useMemo(() => {
    const map = new Map<string, TierDescriptor>();
    tiersQuery.data?.tiers.forEach((entry) => map.set(entry.tier, entry));
    return map;
  }, [tiersQuery.data]);

  // Whether auth actually succeeded, so the close event can distinguish an abandoned
  // modal from a completed one. A ref rather than state: it is read in a callback that
  // must not re-render when it changes.
  const completedRef = React.useRef(false);

  React.useEffect(() => {
    // TWO events, not one. `auth_prompt_shown` answers "which surfaces drive people to
    // sign in" (its `source` is the attribution passed to openAuth) and is priority 1;
    // `auth_modal_opened` is the funnel step itself. Collapsing them would make the
    // attribution question unanswerable, because a visitor can be prompted from several
    // places before they ever open the modal.
    track(EVENTS.AUTH_PROMPT_SHOWN, { source });
    track(EVENTS.AUTH_MODAL_OPENED, {
      source,
      mode: (auth?.prompt.intent ?? 'signup') as 'signin' | 'signup',
    });
    // Deliberately fires once per mount: AuthProvider mounts this only while
    // open, so mount and open are the same event.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!auth) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
  };

  const handleClose = () => {
    // `completed` is the whole value of this event: an abandoned modal is a funnel drop-off
    // and a completed one is a conversion, and they look identical without it.
    track(EVENTS.AUTH_MODAL_CLOSED, { completed: completedRef.current, mode: activeTab });
    resetForm();
    auth.closeAuth();
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'signin' | 'signup');
    resetForm();
    // A tab toggle is not a funnel step and does not deserve a dedicated catalog event —
    // it is an interaction inside one. `feature_used` is where interactions like this
    // belong, which keeps the auth funnel's event set to the states that actually matter.
    track(EVENTS.FEATURE_USED, { feature: 'auth_modal', action: 'tab_changed', value: tab });
  };

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      // signup_started before the attempt: without it, a Google popup that the visitor
      // dismisses is invisible, and "how many people start and abandon Google auth" is one
      // of the few questions with an obvious product fix attached.
      track(EVENTS.SIGNUP_STARTED, { method: 'google' });
      await auth.signInWithGoogle();
      completedRef.current = true;
      // Google's popup does not tell us whether the account already existed, so this is
      // recorded as a sign-in. `signup_completed` — the event that sets persons.signup_at —
      // is only emitted where we KNOW a new account was created, which is the email path.
      // Over-reporting signups would corrupt the single most important growth number here.
      track(EVENTS.SIGNIN_COMPLETED, { method: 'google' });
      toast.success(t('interface:authModal.toast.welcome'), {
        description: t('interface:authModal.toast.googleSuccess'),
      });
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error(t('interface:authModal.toast.authFailed'), {
        description: t('error:auth.tryAgain'),
      });
      track(EVENTS.AUTH_FAILED, {
        method: 'google',
        stage: 'popup',
        reason: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setIsLoading(true);

      if (activeTab === 'signup') {
        if (!displayName) {
          toast.error(t('interface:authModal.toast.nameRequired'), {
            description: t('interface:authModal.toast.nameRequiredDesc'),
          });
          return;
        }
        track(EVENTS.SIGNUP_STARTED, { method: 'email' });
        await auth.signUp(email, password, displayName);
        completedRef.current = true;
        track(EVENTS.SIGNUP_COMPLETED, { method: 'email' });
        toast.success(t('interface:authModal.toast.accountCreated'), {
          description: t('interface:authModal.toast.welcomeMM'),
        });
      } else {
        await auth.signIn(email, password);
        completedRef.current = true;
        track(EVENTS.SIGNIN_COMPLETED, { method: 'email' });
        toast.success(t('interface:authModal.toast.welcomeBack'), {
          description: t('interface:authModal.toast.signedIn'),
        });
      }
    } catch (error: any) {
      console.error('Email auth error:', error);

      let errorMessage = t('error:auth.tryAgain');
      if (error.code === 'auth/user-not-found') {
        errorMessage = t('error:auth.userNotFound');
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = t('error:auth.wrongPassword');
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = t('error:auth.emailAlreadyInUse');
      } else if (error.code === 'auth/weak-password') {
        errorMessage = t('error:auth.weakPassword');
      }

      toast.error(t('interface:authModal.toast.authFailed'), { description: errorMessage });
      // `stage` is the Firebase error code, which is exactly the diagnostic dimension
       // wanted here: auth/wrong-password and auth/email-already-in-use are completely
       // different product problems. The MESSAGE goes in `reason` and is sanitized
       // server-side; the code is a closed vocabulary and safe as a dimension.
      track(EVENTS.AUTH_FAILED, {
        method: 'email',
        stage: error.code || activeTab,
        reason: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // The panel's framing follows the intent it was OPENED with, not the tab that
  // happens to be active. Someone who clicked "Sign in" is told the panel is for
  // signing in; someone who hit an upgrade surface is told what an account buys.
  //
  // Opening intent rather than `activeTab` on purpose: the headline answers "why
  // am I looking at this", which does not change when you toggle a tab, and
  // rewriting it under the cursor mid-glance is twitchy. Both tabs stay present
  // and equally reachable either way — a panel that only ever says "Create
  // account" leaves a returning user hunting for the way in, and reads as though
  // the point were sign-up count rather than the person.
  //
  // A caller-supplied headline still wins outright: that is the 429 path, and
  // what just happened outranks both framings.
  const returning = auth.prompt.intent === 'signin';
  const headline =
    auth.prompt.headline ??
    t(returning ? 'interface:authModal.signInTitle' : 'interface:authModal.defaultTitle');
  const body =
    auth.prompt.body ??
    t(returning ? 'interface:authModal.signInDescription' : 'interface:authModal.defaultDescription');
  const premium = byTier.get('premium');
  const premiumPrice = tiersQuery.data?.premiumPriceUSD;

  return (
    <Dialog open={auth.prompt.open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className={cn('max-h-[90dvh] gap-6 overflow-y-auto', dialogWidthWide)}>
        {/* The header keeps a readable measure of its own. Letting a headline and
            a sentence of body copy run the full 1440px would be the opposite
            problem from the narrow modal this replaced. */}
        <DialogHeader className="lg:max-w-[46rem]">
          <DialogTitle className="text-xl font-semibold tracking-[-0.02em]">
            {headline}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">{body}</DialogDescription>
        </DialogHeader>

        {/* Two jobs, two columns once there is room: signing in on the left,
            what an account is worth on the right. Below `lg` they stack in this
            same order — form first, then the plans — which is the layout phones
            already had, so nothing about the mobile experience changes.

            The form column is capped rather than fluid: an email field 600px
            wide is harder to use, not easier, and inputs that grow with the
            viewport are how a wide dialog ends up looking stretched instead of
            composed. */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start lg:gap-10">
          <div className="grid content-start gap-5">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup">{t('interface:authModal.tabs.signup')}</TabsTrigger>
                <TabsTrigger value="signin">{t('interface:authModal.tabs.signin')}</TabsTrigger>
              </TabsList>

              <TabsContent value="signup" className="mt-4 space-y-4">
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">{t('interface:authModal.fields.fullName')}</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      autoComplete="name"
                      placeholder={t('interface:authModal.fields.fullNamePlaceholder')}
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t('interface:authModal.fields.email')}</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      placeholder={t('interface:authModal.fields.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t('interface:authModal.fields.password')}</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder={t('interface:authModal.fields.passwordPlaceholderSignup')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      minLength={6}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !email || !password || !displayName}
                  >
                    {isLoading
                      ? t('interface:authModal.actions.creatingAccount')
                      : t('interface:authModal.actions.createAccount')}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signin" className="mt-4 space-y-4">
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">{t('interface:authModal.fields.email')}</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      autoComplete="email"
                      placeholder={t('interface:authModal.fields.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">{t('interface:authModal.fields.password')}</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      autoComplete="current-password"
                      placeholder={t('interface:authModal.fields.passwordPlaceholderSignin')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading || !email || !password}>
                    {isLoading
                      ? t('interface:authModal.actions.signingIn')
                      : t('interface:authModal.actions.signIn')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px flex-1 bg-edge" />
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                {t('interface:authModal.orDivider')}
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-edge" />
            </div>

            {/* This button sits outside <Tabs>, so the one instance serves both
                Sign in and Create account.

                Google's own mark, served as a file rather than inlined. The
                official asset builds the G from nine gradient meshes behind a
                clip path, and names them with single letters — id="a" through
                id="s". Inlined, those land in the document's global id namespace,
                where any other element or SVG claiming `a` or `i` silently
                repaints the logo. In its own document they cannot collide.

                Decorative: `alt=""`, because the button already says "Continue
                with Google" and the icon would otherwise be announced twice. The
                18px box and 8px gap (the Button's own `gap-2`) are what Google's
                branding guidelines ask for, and the file is rendered untouched —
                not recoloured, not redrawn, aspect ratio preserved. */}
            <Button onClick={handleGoogleAuth} variant="outline" className="w-full" disabled={isLoading}>
              <img src="/Google.svg" alt="" width={18} height={18} className="shrink-0" />
              {t('interface:authModal.googleSignIn')}
            </Button>
          </div>

          {/* The plans column. Two columns is the ceiling for this panel, so the
              plans always stack here rather than splitting into a third column on
              a wide screen: signing in and reading what an account is worth are
              two things, not three, and the widths in `dialogWidthWide` stop
              where a two-column layout stops improving.

              Every number in them is served by /api/tiers, so the panel cannot
              promise something the server will not honour. */}
          <div className="grid content-start gap-4">
            <PlanSummary
              descriptor={byTier.get('free')}
              title={t('interface:authModal.plans.freeTitle')}
              tone="data"
            />

            {premium ? (
              <PlanSummary
                descriptor={premium}
                tone="premium"
                title={t('interface:authModal.plans.premiumTitle')}
                aside={
                  <span className="flex items-baseline gap-2">
                    {premiumPrice !== undefined ? (
                      <span className="num text-sm text-premium">
                        {t('interface:authModal.plans.premiumPrice', { price: premiumPrice })}
                      </span>
                    ) : null}
                    {!tiersQuery.data?.premiumPurchasable ? (
                      <span className="text-xs text-muted-foreground">
                        {t('interface:authModal.plans.premiumComingSoon')}
                      </span>
                    ) : null}
                  </span>
                }
              />
            ) : null}

            <div className="flex flex-col gap-3 text-center lg:text-left">
              <Link
                href="/pricing"
                onClick={handleClose}
                className="text-sm text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary lg:w-fit"
              >
                {t('interface:authModal.plans.comparePlans')}
              </Link>
              <p className="max-w-prose text-xs text-muted-foreground">
                <Trans
                  i18nKey="interface:authModal.terms"
                  components={{
                    tos: (
                      <Link
                        href="/terms-of-service"
                        className="underline underline-offset-2 hover:text-foreground"
                      />
                    ),
                    privacy: (
                      <Link
                        href="/privacy-policy"
                        className="underline underline-offset-2 hover:text-foreground"
                      />
                    ),
                  }}
                />
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
