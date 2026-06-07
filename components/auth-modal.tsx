'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Zap, Shield, CheckCircle, X } from 'lucide-react';
import { Trans } from 'react-i18next';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '@/lib/firebase';
import { toast } from 'sonner';
import mixpanel from 'mixpanel-browser';
import { useLocalization } from '@/i18n/useLocalization';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title,
  description,
}) => {
  const { t } = useLocalization(['interface', 'error']);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signup');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();

      mixpanel.track('Auth Modal - Google Auth Success', {
        modal_trigger: 'conversion_attempt'
      });

      toast.success(t('interface:authModal.toast.welcome'), {
        description: t('interface:authModal.toast.googleSuccess'),
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error(t('interface:authModal.toast.authFailed'), {
        description: t('error:auth.tryAgain'),
      });

      mixpanel.track('Auth Modal - Google Auth Failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
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
        await signUpWithEmail(email, password, displayName);

        mixpanel.track('Auth Modal - Email Signup Success', {
          modal_trigger: 'conversion_attempt'
        });

        toast.success(t('interface:authModal.toast.accountCreated'), {
          description: t('interface:authModal.toast.welcomeMM'),
        });
      } else {
        await signInWithEmail(email, password);

        mixpanel.track('Auth Modal - Email Signin Success', {
          modal_trigger: 'conversion_attempt'
        });

        toast.success(t('interface:authModal.toast.welcomeBack'), {
          description: t('interface:authModal.toast.signedIn'),
        });
      }

      onSuccess();
      onClose();
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

      toast.error(t('interface:authModal.toast.authFailed'), {
        description: errorMessage
      });

      mixpanel.track('Auth Modal - Email Auth Failed', {
        tab: activeTab,
        error_code: error.code,
        error_message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'signin' | 'signup');
    resetForm();

    mixpanel.track('Auth Modal - Tab Changed', {
      tab: tab,
      previous_tab: activeTab
    });
  };

  const handleClose = () => {
    mixpanel.track('Auth Modal - Closed', {
      tab: activeTab,
      had_interaction: email.length > 0 || password.length > 0
    });

    resetForm();
    onClose();
  };

  React.useEffect(() => {
    if (isOpen) {
      mixpanel.track('Auth Modal - Opened', {
        default_tab: 'signup',
        trigger: 'conversion_attempt'
      });
    }
  }, [isOpen]);

  const resolvedTitle = title ?? t('interface:authModal.defaultTitle');
  const resolvedDescription = description ?? t('interface:authModal.defaultDescription');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">{resolvedTitle}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground">{resolvedDescription}</p>
        </DialogHeader>

        {/* Free Tier Benefits */}
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-600" />
              {t('interface:authModal.freeTier.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">{t('interface:authModal.freeTier.benefit1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">{t('interface:authModal.freeTier.benefit2')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">{t('interface:authModal.freeTier.benefit3')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">{t('interface:authModal.freeTier.benefit4')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">{t('interface:authModal.tabs.signup')}</TabsTrigger>
            <TabsTrigger value="signin">{t('interface:authModal.tabs.signin')}</TabsTrigger>
          </TabsList>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">{t('interface:authModal.fields.fullName')}</Label>
                <Input
                  id="signup-name"
                  type="text"
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
                {isLoading ? t('interface:authModal.actions.creatingAccount') : t('interface:authModal.actions.createAccount')}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">{t('interface:authModal.fields.email')}</Label>
                <Input
                  id="signin-email"
                  type="email"
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
                  placeholder={t('interface:authModal.fields.passwordPlaceholderSignin')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email || !password}
              >
                {isLoading ? t('interface:authModal.actions.signingIn') : t('interface:authModal.actions.signIn')}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
            {t('interface:authModal.orDivider')}
          </span>
        </div>

        <Button
          onClick={handleGoogleAuth}
          variant="outline"
          className="w-full"
          disabled={isLoading}
        >
          {t('interface:authModal.googleSignIn')}
        </Button>

        {/* Upgrade Preview */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              {t('interface:authModal.upgrade.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div>
                <div className="font-medium">{t('interface:authModal.upgrade.plan')}</div>
                <div className="text-muted-foreground">{t('interface:authModal.upgrade.planDetail')}</div>
              </div>
              <Badge variant="secondary">{t('interface:authModal.upgrade.price')}</Badge>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          <Trans
            i18nKey="interface:authModal.terms"
            components={{
              tos: <a href="/terms-of-service" className="underline hover:text-foreground" />,
              privacy: <a href="/privacy-policy" className="underline hover:text-foreground" />,
            }}
          />
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
