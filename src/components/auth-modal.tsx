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
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '@/lib/firebase';
import { toast } from 'sonner';
import mixpanel from 'mixpanel-browser';

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
  title = "Sign in to convert your file",
  description = "Create a free account to start converting files instantly"
}) => {
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

      toast.success("Welcome!", {
        description: "Successfully signed in with Google."
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error("Authentication failed", {
        description: "Please try again."
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
          toast.error("Name required", {
            description: "Please enter your name."
          });
          return;
        }
        await signUpWithEmail(email, password, displayName);

        mixpanel.track('Auth Modal - Email Signup Success', {
          modal_trigger: 'conversion_attempt'
        });

        toast.success("Account created!", {
          description: "Welcome to Media Manipulator!"
        });
      } else {
        await signInWithEmail(email, password);

        mixpanel.track('Auth Modal - Email Signin Success', {
          modal_trigger: 'conversion_attempt'
        });

        toast.success("Welcome back!", {
          description: "Successfully signed in."
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Email auth error:', error);

      let errorMessage = "Please try again.";
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password.";
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = "An account with this email already exists.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters.";
      }

      toast.error("Authentication failed", {
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground">{description}</p>
        </DialogHeader>

        {/* Free Tier Benefits */}
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-600" />
              Free Account Includes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">5 free conversions per month</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Files up to 50MB</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">All popular formats supported</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Fast, secure processing</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Create Account</TabsTrigger>
            <TabsTrigger value="signin">Sign In</TabsTrigger>
          </TabsList>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="At least 6 characters"
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
                {isLoading ? 'Creating Account...' : 'Create Free Account'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Your password"
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
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
            OR
          </span>
        </div>

        <Button
          onClick={handleGoogleAuth}
          variant="outline"
          className="w-full"
          disabled={isLoading}
        >
          {/* <Google className="w-4 h-4 mr-2" /> */}
          Continue with Google
        </Button>

        {/* Upgrade Preview */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              Need More? Upgrade Anytime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div>
                <div className="font-medium">Starter Plan</div>
                <div className="text-muted-foreground">100 conversions/month</div>
              </div>
              <Badge variant="secondary">$9/month</Badge>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          By signing up, you agree to our{' '}
          <a href="/terms-of-service" className="underline hover:text-foreground">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy-policy" className="underline hover:text-foreground">
            Privacy Policy
          </a>
        </p>
      </DialogContent>
    </Dialog>
  );
};
